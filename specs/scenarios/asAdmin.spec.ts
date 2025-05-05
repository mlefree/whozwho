/**
 * Test suite for Admin controller
 * Tests error handling paths and the Update method
 */
import {expect} from 'chai';
import {$app} from '../../src/app';
import {$mongoose} from '../../src/factories/mongoose';
import {initApp} from '../../src/config/init/initApp';
import {logger} from '../../src/factories/logger';
import agent from 'supertest';
import sinon from 'sinon';

/**
 * Test suite for Admin controller functionality
 * Covers error handling paths and the Update method
 */
describe('v1 as an Admin', function () {

    this.timeout(10000);

    // Setup: Clear existing data before tests
    before(async () => {
        const app_ = await $app;
        const mongoose_ = await $mongoose;
        await mongoose_.model('Actor').deleteMany({});
        await mongoose_.model('Advice').deleteMany({});
        await initApp(app_, mongoose_, logger);
    });

    afterEach(() => {
        // Restore all sinon stubs after each test
        sinon.restore();
    });

    /**
     * Test error handling in postHi endpoint
     */
    describe('postHi Error Handling', () => {
        it('should return 400 when missing required fields', async () => {
            // Test with missing weight
            const invalidHi = {
                alivePeriodInSec: 2,
                version: '1.2.3',
                last100Errors: []
            };

            const res = await agent(await $app)
                .post('/hi')
                .set('Content-Type', 'application/json')
                .set('Host', 'http://localhost:987')
                .set('Forwarded', 'for=actor;by=1')
                .send(invalidHi)
                .expect(400);

            expect(res.body).to.have.property('error');
        });

        it('should return 400 when missing actor information', async () => {
            // Test with valid hi but missing actor info in headers
            const validHi = {
                weight: 1,
                alivePeriodInSec: 2,
                version: '1.2.3',
                last100Errors: []
            };

            const res = await agent(await $app)
                .post('/hi')
                .set('Content-Type', 'application/json')
                // Missing Forwarded header
                .send(validHi)
                .expect(400);

            expect(res.body).to.have.property('error');
        });
    });

    /**
     * Test error handling in postActor endpoint
     */
    describe('postActor Error Handling', () => {
        it('should return 400 when missing question', async () => {
            const res = await agent(await $app)
                .post('/actors')
                .set('Content-Type', 'application/json')
                .set('Host', 'http://localhost:987')
                .set('Forwarded', 'for=actor;by=1')
                .send({}) // Missing question
                .expect(400);

            expect(res.body).to.have.property('error');
        });

        it('should return 400 when missing actor info for PRINCIPAL question', async () => {
            const res = await agent(await $app)
                .post('/actors')
                .set('Content-Type', 'application/json')
                // Missing Forwarded header
                .send({question: 'PRINCIPAL'})
                .expect(400);

            expect(res.body).to.have.property('error');
        });

        it('should return 400 when missing category for ADDRESS questions', async () => {
            const res = await agent(await $app)
                .post('/actors')
                .set('Content-Type', 'application/json')
                .set('Host', 'http://localhost:987')
                .set('Forwarded', 'for=actor;by=1')
                .send({question: 'ADDRESS_ALL'}) // Missing category
                .expect(400);

            expect(res.body).to.have.property('error');
        });
    });

    /**
     * Test error handling in advice endpoints
     */
    describe('Advice Endpoints Error Handling', () => {
        it('should return 400 when posting advice with missing fields', async () => {
            const res = await agent(await $app)
                .post('/advices')
                .set('Content-Type', 'application/json')
                .set('Host', 'http://localhost:987')
                .set('Forwarded', 'for=actor;by=1')
                .send({}) // Missing type
                .expect(400);

            expect(res.body).to.have.property('error');
        });

        it('should return 404 when advice not found', async () => {
            const res = await agent(await $app)
                .put('/advices/invalidId')
                .set('Content-Type', 'application/json')
                .set('Host', 'http://localhost:987')
                .set('Forwarded', 'for=actor;by=1')
                .send({status: 'ONGOING'})
                .expect(404);

            expect(res.body).to.have.property('error');
        });
    });

    /**
     * Test the Update method
     */
    // describe('Update Method', () => {
    //     it('should return TODO message', async () => {
    //         // Call the Update method directly
    //         const result = await AdminController['Update']();
//
    //         // Verify it returns the TODO message
    //         expect(result).to.equal('TODO be careful');
    //     });
//
    //     it('should not call npm run update in test mode', async () => {
    //         // Spy on npmRun.exec
    //         const execSpy = sinon.spy(npmRun, 'exec');
//
    //         // Call the Update method
    //         await AdminController['Update']();
//
    //         // Verify npmRun.exec was not called
    //         expect(execSpy.called).to.be.false;
    //     });
    // });

    /**
     * Test the getActors endpoint
     */
    describe('getActors Endpoint', () => {
        before(async () => {
            const mongoose_ = await $mongoose;
            // Clear existing actors
            await mongoose_.model('Actor').deleteMany({});

            // Create test actors
            const ActorModel = mongoose_.model('Actor');

            // Create actors for category1
            await new ActorModel({
                actorCategory: 'category1',
                actorId: 1,
                actorAddress: 'address1',
                weight: 2,
                alivePeriodInSec: 100,
                isPrincipal: true,
                version: '1.0.0',
                last100Errors: []
            }).save();

            await new ActorModel({
                actorCategory: 'category1',
                actorId: 2,
                actorAddress: 'address2',
                weight: 1,
                alivePeriodInSec: 100,
                isPrincipal: false,
                version: '1.0.0',
                last100Errors: []
            }).save();

            // Create actor for category2
            await new ActorModel({
                actorCategory: 'category2',
                actorId: 3,
                actorAddress: 'address3',
                weight: 3,
                alivePeriodInSec: 100,
                isPrincipal: true,
                version: '1.0.0',
                last100Errors: []
            }).save();
        });

        it('should return all alive actors', async () => {
            const res = await agent(await $app)
                .get('/actors')
                .set('Content-Type', 'application/json')
                .expect(200);

            // Verify response format
            expect(res.body).to.have.property('actors');
            expect(res.body.actors).to.be.an('array');

            // Verify we have all 3 actors
            expect(res.body.actors.length).to.equal(3);

            // Verify actor properties
            const categories = res.body.actors.map(actor => actor.actorCategory);
            expect(categories).to.include('category1');
            expect(categories).to.include('category2');

            // Verify actors are sorted by weight within categories
            const category1Actors = res.body.actors.filter(actor => actor.actorCategory === 'category1');
            expect(category1Actors.length).to.equal(2);
            expect(category1Actors[0].weight).to.be.lessThanOrEqual(category1Actors[1].weight);
        });

        it('should filter actors by category', async () => {
            const res = await agent(await $app)
                .get('/actors?category=category1')
                .set('Content-Type', 'application/json')
                .expect(200);

            // Verify response format
            expect(res.body).to.have.property('actors');
            expect(res.body.actors).to.be.an('array');

            // Verify we only have actors from category1
            expect(res.body.actors.length).to.equal(2);

            // All actors should be from category1
            res.body.actors.forEach(actor => {
                expect(actor.actorCategory).to.equal('category1');
            });

            // Verify actors are sorted by weight
            expect(res.body.actors[0].weight).to.be.lessThanOrEqual(res.body.actors[1].weight);
        });

        it('should return principal actor from a category', async () => {
            const res = await agent(await $app)
                .get('/actors?category=category1&principal=true')
                .set('Content-Type', 'application/json')
                .expect(200);

            // Verify response format
            expect(res.body).to.have.property('actors');
            expect(res.body.actors).to.be.an('array');

            // Verify we only have one actor (the principal one)
            expect(res.body.actors.length).to.equal(1);

            // Verify it's from the requested category
            expect(res.body.actors[0].actorCategory).to.equal('category1');

            // Verify it's the principal actor
            expect(res.body.actors[0].isPrincipal).to.eq(true);
        });
    });
});
