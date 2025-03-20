import {expect} from 'chai';
import {$app} from '../src/app';
import {$mongoose} from '../src/factories/mongoose';
import {initApp} from '../src/config/init/initApp';
import {logger} from '../src/factories/logger';
import agent from 'supertest';
import {promisify} from 'util';
import {ActorAnswer, ActorQuestion} from '../src/models/actor';
import {AdviceStatus, AdviceType} from '../src/models/advice';

const sleep = promisify(setTimeout);

const version = 'v1';

describe(`${version} as an Actor`, function () {

    this.timeout(100000);

    const alivePeriodInSec = 2;

    before(async () => {
        const app_ = await $app;
        const mongoose_ = await $mongoose;
        await mongoose_.model('Actor').deleteMany({});
        await mongoose_.model('Advice').deleteMany({});
        await initApp(app_, mongoose_, logger);
    });

    it('should [get=>200] status', async () => {
        const res = await agent(await $app)
            .get('/status')
            .expect('Content-Type', /application\/json/)
            .expect(200);
        expect(res.body.version).to.contain('1.');
        expect(res.body.env).to.eq('test');
    });

    it('should [post=>204] hi as an actor:1', async () => {
        const hi = {
            weight: 1,
            alivePeriodInSec,
            version: '1.2.3',
            last100Errors: ['date1:info...', 'date2:info...']
        };
        const res = await agent(await $app)
            .post('/hi')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:1')
            .send(hi)
            .expect(204);
        expect(res).not.eq(null);
    });

    it('should [post=>200] actors question: Have I a principal role ? => yes!', async () => {
        const principalQuestion = {
            question: ActorQuestion.PRINCIPAL
        };

        const res = await agent(await $app)
            .post('/actors')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:1')
            .send(principalQuestion)
            .expect('Content-Type', /application\/json/)
            .expect(200);

        expect(res.body.answer).to.eq(ActorAnswer.yes);
    });

    it('should [post=>204] hi as a more important actor:2, but [post=>200] not yet Principal (sorry no)', async () => {
        const hi = {
            weight: 10,
            alivePeriodInSec,
            version: '1.2.3',
            last100Errors: ['date1:info_...', 'date2:info_...']
        };
        await agent(await $app)
            .post('/hi')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:2')
            .send(hi)
            .expect(204);

        const principalQuestion = {
            question: ActorQuestion.PRINCIPAL
        };

        const res = await agent(await $app)
            .post('/actors')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:2')
            .send(principalQuestion)
            .expect('Content-Type', /application\/json/)
            .expect(200);

        expect(res.body.answer).to.eq(ActorAnswer.no);
    });

    it('should (after waiting for "alive" period) actor:2 [post=>204] hi and [post=>200] actors question and receive positive answer for principal role', async () => {
        await sleep(3000);

        const hi = {
            weight: 3,
            alivePeriodInSec,
            version: '1.2.3',
            last100Errors: ['date1:info_...', 'date2:info_...']
        };

        try {
            await agent(await $app)
                .post('/hi')
                .set('Content-Type', 'application/json')
                .set('Host', 'actor:2')
                .send(hi)
                .expect(204);

            const principalQuestion = {
                question: ActorQuestion.PRINCIPAL
            };

            const res = await agent(await $app)
                .post('/actors')
                .set('Content-Type', 'application/json')
                .set('Host', 'actor:2')
                .send(principalQuestion)
                .expect('Content-Type', /application\/json/)
                .expect(200);

            expect(res.body.answer).to.eq(ActorAnswer.yes);
        } catch (error) {
            console.error('Test failed:', error);
            throw error;
        }
    });

    it('should [post=>204] hi for all actors in order to be alive', async () => {
        const hi = {
            weight: 1,
            alivePeriodInSec,
            version: '1.2.3',
            last100Errors: ['date1:info...', 'date2:info...']
        };
        const res1 = await agent(await $app)
            .post('/hi')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:1')
            .send(hi)
            .expect(204);
        expect(res1).not.eq(null);

        const res2 = await agent(await $app)
            .post('/hi')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:2')
            .send(hi)
            .expect(204);
        expect(res1).not.eq(null);
    });

    it('should [get=>404] advice: none for now', async () => {
        const res = await agent(await $app)
            .get('/advices')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:1')
            .expect(404);

        expect(res).not.eq(null);
    });

    it('should [post=>200] advice to update', async () => {
        const advice = {
            type: AdviceType.UPDATE,
            category: 'actor'
        }

        const res = await agent(await $app)
            .post('/advices')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:1')
            .send(advice)
            .expect('Content-Type', /application\/json/)
            .expect(200);

        expect(res.body.advices.length).to.eq(1);
        expect(res.body.advices[0].id).to.not.eq(undefined);
        expect(res.body.advices[0].type).to.eq(AdviceType.UPDATE);
    });

    it('should [get=>200] advice: update only for the less weight actor.' +
        '[put=>200] advice: ONGOING', async () => {
        // Actor:1 has a less weight => update
        let res = await agent(await $app)
            .get('/advices')
            .set('Host', 'actor:1')
            .expect('Content-Type', /application\/json/)
            .expect(200);   // lightest actor => update

        expect(res.body.advices.length).eq(1);

        const updateAdvice = res.body.advices[0];
        expect(updateAdvice.id).not.eq(null);
        expect(updateAdvice.type).eq(AdviceType.UPDATE);

        // Actor:2 has a bigger weight => no update yet
        res = await agent(await $app)
            .get('/advices')
            .set('Host', 'actor:2')
            .expect(404); // wait for first actor update

        // actor:1 is saying that advice is ongoing
        res = await agent(await $app)
            .put('/advices/' + updateAdvice.id)
            .set('Host', 'actor:1')
            .send({status: AdviceStatus.ONGOING})
            .expect('Content-Type', /application\/json/)
            .expect(200);   // lightest actor => update
    });

    it('should [post=>204] hi with updating version and [get=>404] advice : no more update. ' +
        'should [get=>200] advice the next actor in the list to update.', async () => {
        // First, say that you are alive with a hi
        const updatedHi = {
            weight: 1,
            alivePeriodInSec,
            version: 'no matter',
            last100Errors: ['date1:info...', 'date2:info...']
        };
        await agent(await $app)
            .post('/hi')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:1')
            .send(updatedHi)
            .expect(204);

        // Then check that actor doesn't need update advice anymore
        let res = await agent(await $app)
            .get('/advices')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:1')
            .expect(404); // Should not find any advice

        expect(res).not.eq(null);

        // But now, next actor should be updated
        res = await agent(await $app)
            .get('/advices')
            .set('Content-Type', 'application/json')
            .set('Host', 'actor:2')
            .expect('Content-Type', /application\/json/)
            .expect(200);

        expect(res.body.advices.length).eq(1);
        expect(res.body.advices[0].id).not.eq(null);
        expect(res.body.advices[0].type).eq(AdviceType.UPDATE);
    });
});
