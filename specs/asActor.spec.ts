import {expect} from 'chai';
import {$app} from '../src/app';
import {$mongoose} from '../src/factories/mongoose';
import {initApp} from '../src/config/init/initApp';
import {logger} from '../src/factories/logger';
import {agent} from 'supertest';
import {promisify} from 'util';

const sleep = promisify(setTimeout);

const version = 'v1';

describe(`${version} 1) as Raain Technical Administrator (prepare the other tests: teams, users, radar and rain zones)`, function () {

    this.timeout(100000);
    before(async () => {
        const app_ = await $app;
        const mongoose_ = await $mongoose;
        await initApp(app_, mongoose_, logger);
    });

    it('should (get) (=>200) status', async () => {
        const res = await agent(await $app)
            .get('/v1/status')
            .expect('Content-Type', /application\/json/)
            .expect(200);

        await sleep(1000);
        expect(res.body.version).to.contain('1.');
        expect(res.body.env).to.eq('test');
        expect(res.body.isPrincipal).to.eq(false);
    });
});
