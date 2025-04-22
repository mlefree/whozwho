/**
 * Test suite for Actor API endpoints
 * Tests actor registration, principal role assignment, and update advice mechanisms
 */
import {expect} from 'chai';
import {$app} from '../../src/app';
import {$mongoose} from '../../src/factories/mongoose';
import {initApp} from '../../src/config/init/initApp';
import {logger} from '../../src/factories/logger';
import agent from 'supertest';
import {promisify} from 'util';
import {ActorAnswer, ActorQuestion} from '../../src/models/actor';
import {AdviceStatus, AdviceType} from '../../src/models/advice';

const sleep = promisify(setTimeout);

const version = 'v1';

/**
 * Test suite for Actor API functionality
 * Covers actor registration, role assignment, and update mechanisms
 */
describe(`${version} as an Actor`, function () {

    this.timeout(100000);

    const alivePeriodInSec = 2;

    // Setup: Clear existing data before tests
    before(async () => {
        const app_ = await $app;
        const mongoose_ = await $mongoose;
        await mongoose_.model('Actor').deleteMany({});
        await mongoose_.model('Advice').deleteMany({});
        await initApp(app_, mongoose_, logger);
    });

    /**
     * Basic API health check
     */
    it('Scenario: Check API status endpoint', async () => {
        // Verify API is running and returns correct version and environment
        const res = await agent(await $app)
            .get('/status')
            .expect('Content-Type', /application\/json/)
            .expect(200);
        expect(res.body.version).to.contain('1.');
        expect(res.body.env).to.eq('test');
    });

    /**
     * Test actor registration with weight=1
     */
    it('Scenario: Register actor:1 with basic weight', async () => {
        // Initialize actor with minimal weight and basic configuration
        const hi = {
            weight: 1,
            alivePeriodInSec,
            version: '1.2.3',
            last100Errors: ['date1:info...', 'date2:info...']
        };

        // Register actor:1 in the system
        const res = await agent(await $app)
            .post('/hi')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .send(hi)
            .expect(204);
        expect(res).not.eq(null);
    });

    /**
     * Test principal role assignment for first actor
     */
    it('Scenario: Verify actor:1 gets principal role as first actor', async () => {
        // Create request to check if actor has principal role
        const principalQuestion = {
            question: ActorQuestion.PRINCIPAL
        };

        // First registered actor should be assigned principal role
        const res = await agent(await $app)
            .post('/actors')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .send(principalQuestion)
            .expect('Content-Type', /application\/json/)
            .expect(200);

        // Verify actor:1 is assigned principal role
        expect(res.body.answer).to.eq(ActorAnswer.yes);
    });

    it('Scenario: Verify actors addresses', async () => {
        // Create requests to get actor's address
        const allAddressesQuestion = {
            category: 'actor',
            question: ActorQuestion.ADDRESS_ALL
        };
        const principalAddressQuestion = {
            category: 'actor',
            question: ActorQuestion.ADDRESS_PRINCIPAL
        };

        let res = await agent(await $app)
            .post('/actors')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .send(allAddressesQuestion)
            .expect('Content-Type', /application\/json/)
            .expect(200);

        expect(JSON.stringify(res.body.answer)).to.eq('{"1":"http://localhost:987"}');

        res = await agent(await $app)
            .post('/actors')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .send(principalAddressQuestion)
            .expect('Content-Type', /application\/json/)
            .expect(200);

        expect(JSON.stringify(res.body.answer)).to.eq('{"1":"http://localhost:987"}');
    });

    /**
     * Test registration and role check for higher weight actor
     */
    it('Scenario: Register actor:2 with higher weight but verify no immediate principal role', async () => {
        // Register actor:2 with higher weight (10 > 1)
        const hi = {
            weight: 10,
            alivePeriodInSec,
            version: '1.2.3',
            last100Errors: ['date1:info_...', 'date2:info_...']
        };
        await agent(await $app)
            .post('/hi')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=2')
            .send(hi)
            .expect(204);

        // Check if actor:2 has principal role
        const principalQuestion = {
            question: ActorQuestion.PRINCIPAL
        };

        // Despite higher weight, actor:2 should not be principal yet
        // as actor:1 is still active
        const res = await agent(await $app)
            .post('/actors')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=2')
            .send(principalQuestion)
            .expect('Content-Type', /application\/json/)
            .expect(200);

        expect(res.body.answer).to.eq(ActorAnswer.no);
    });

    /**
     * Test principal role reassignment after timeout
     */
    it('Scenario: Verify actor:2 becomes principal after alive period timeout', async () => {
        // Wait for actor:1's alive period to expire
        await sleep(3000);

        // Register actor:2 again with new weight
        const hi = {
            weight: 3,
            alivePeriodInSec,
            version: '1.2.3',
            last100Errors: ['date1:info_...', 'date2:info_...']
        };

        try {
            // Send heartbeat for actor:2
            await agent(await $app)
                .post('/hi')
                .set('Content-Type', 'application/json')
                .set('Host', 'http://localhost:987')
                .set('Forwarded', 'for=actor;by=2')
                .send(hi)
                .expect(204);

            // Check if actor:2 is now principal after timeout
            const principalQuestion = {
                question: ActorQuestion.PRINCIPAL
            };

            // Actor:2 should now be principal as actor:1 has timed out
            const res = await agent(await $app)
                .post('/actors')
                .set('Content-Type', 'application/json')
                .set('Host', 'http://localhost:987')
                .set('Forwarded', 'for=actor;by=2')
                .send(principalQuestion)
                .expect('Content-Type', /application\/json/)
                .expect(200);

            expect(res.body.answer).to.eq(ActorAnswer.yes);
        } catch (error) {
            console.error('Test failed:', error);
            throw error;
        }
    });

    /**
     * Test keeping actors alive with heartbeat
     */
    it('Scenario: Keep all actors alive with heartbeat', async () => {
        // Prepare heartbeat data for both actors
        const hi = {
            weight: 1,
            alivePeriodInSec,
            version: '1.2.3',
            last100Errors: ['date1:info...', 'date2:info...']
        };

        // Send heartbeat for actor:1
        const res1 = await agent(await $app)
            .post('/hi')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:9871')
            .set('Forwarded', 'for=actor;by=1')
            .send(hi)
            .expect(204);
        expect(res1).not.eq(null);

        // Send heartbeat for actor:2
        const res2 = await agent(await $app)
            .post('/hi')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:9862')
            .set('Forwarded', 'for=actor;by=2')
            .send(hi)
            .expect(204);
        expect(res1).not.eq(null);
    });

    it('Scenario: Verify actors last addresses', async () => {
        // Create requests to get actor's address
        const allAddressesQuestion = {
            category: 'actor',
            question: ActorQuestion.ADDRESS_ALL
        };
        const principalAddressQuestion = {
            category: 'actor',
            question: ActorQuestion.ADDRESS_PRINCIPAL
        };

        let res = await agent(await $app)
            .post('/actors')
            .set('Content-Type', 'application/json')
            .send(allAddressesQuestion)
            .expect('Content-Type', /application\/json/)
            .expect(200);

        expect(JSON.stringify(res.body.answer)).to.eq('{"1":"http://localhost:9871","2":"http://localhost:9862"}');

        res = await agent(await $app)
            .post('/actors')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .send(principalAddressQuestion)
            .expect('Content-Type', /application\/json/)
            .expect(200);

        expect(JSON.stringify(res.body.answer)).to.eq('{"2":"http://localhost:9862"}');
    });

    /**
     * Test initial state of advice endpoint
     */
    it('Scenario: Verify no initial advice exists', async () => {
        // Check advice endpoint returns 404 when no advice exists
        const res = await agent(await $app)
            .get('/advices')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .expect(404);

        expect(res).not.eq(null);
    });

    /**
     * Test creating update advice
     */
    it('Scenario: Create update advice for actors', async () => {
        // Create new update advice for actor category
        const advice = {
            type: AdviceType.UPDATE,
            category: 'actor'
        }

        // Post new advice and verify response
        const res = await agent(await $app)
            .post('/advices')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .send(advice)
            .expect('Content-Type', /application\/json/)
            .expect(200);

        // Verify advice was created with correct properties
        expect(res.body.advices.length).to.eq(1);
        expect(res.body.advices[0].id).to.not.eq(undefined);
        expect(res.body.advices[0].type).to.eq(AdviceType.UPDATE);
    });

    /**
     * Test advice distribution based on actor weight and status updates
     */
    it('Scenario: Verify advice distribution and status updates based on actor weight', async () => {
        // Check if actor:1 (lowest weight) receives update advice
        let res = await agent(await $app)
            .get('/advices')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .expect('Content-Type', /application\/json/)
            .expect(200);   // lightest actor => update

        // Verify advice details
        expect(res.body.advices.length).eq(1);
        const updateAdvice = res.body.advices[0];
        expect(updateAdvice.id).not.eq(null);
        expect(updateAdvice.type).eq(AdviceType.UPDATE);

        // Verify actor:2 (higher weight) doesn't receive advice yet
        res = await agent(await $app)
            .get('/advices')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=2')
            .expect(404); // wait for first actor update

        // Update advice status to ONGOING for actor:1
        res = await agent(await $app)
            .put('/advices/' + updateAdvice.id)
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .send({status: AdviceStatus.ONGOING})
            .expect('Content-Type', /application\/json/)
            .expect(200);
    });

    /**
     * Test complete update cycle and advice propagation
     */
    it('Scenario: Complete update cycle and verify advice propagation to next actor', async () => {
        // Send heartbeat with updated version for actor:1
        const updatedHi = {
            weight: 1,
            alivePeriodInSec,
            version: 'no matter',
            last100Errors: ['date1:info...', 'date2:info...']
        };
        await agent(await $app)
            .post('/hi')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .send(updatedHi)
            .expect(204);

        // Verify actor:1 no longer needs update advice
        let res = await agent(await $app)
            .get('/advices')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=1')
            .expect(404);

        expect(res).not.eq(null);

        // Verify update advice has propagated to actor:2
        res = await agent(await $app)
            .get('/advices')
            .set('Content-Type', 'application/json')
            .set('Host', 'http://localhost:987')
            .set('Forwarded', 'for=actor;by=2')
            .expect('Content-Type', /application\/json/)
            .expect(200);

        // Verify advice details for actor:2
        expect(res.body.advices.length).eq(1);
        expect(res.body.advices[0].id).not.eq(null);
        expect(res.body.advices[0].type).eq(AdviceType.UPDATE);
    });
});
