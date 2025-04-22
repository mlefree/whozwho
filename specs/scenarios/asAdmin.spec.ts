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
import npmRun from 'npm-run';
import {AdminController} from '../../src/controllers/admin';

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
    describe('Update Method', () => {
        it('should return TODO message', async () => {
            // Call the Update method directly
            const result = await AdminController['Update']();

            // Verify it returns the TODO message
            expect(result).to.equal('TODO be careful');
        });

        it('should not call npm run update in test mode', async () => {
            // Spy on npmRun.exec
            const execSpy = sinon.spy(npmRun, 'exec');

            // Call the Update method
            await AdminController['Update']();

            // Verify npmRun.exec was not called
            expect(execSpy.called).to.be.false;
        });
    });
});
