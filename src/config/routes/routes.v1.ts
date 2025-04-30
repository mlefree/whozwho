import {Router} from 'express';
import {AdminController} from '../../controllers/admin';
import {cacheLruFast} from '../../factories/cache';

export const routes = async (router: Router) => {

    // Give me a High Five: to say that you're alive - and still acting !
    router.post('/hi', AdminController.postHi);

    // Ask your preferred actor's question: Have I the principal role ? or need an address ?...
    //  => { answer : yes }
    //  => { answer : { actorId: 'result...', ...}}
    router.post('/actors', AdminController.postActor);

    // Get all alive actors
    //  => {actors: [{<ActorSchema>}, {...}]}
    router.get('/actors', AdminController.getActors);

    // May I give you one advice ?
    // => { advices: [{id:12  type:'UPDATE'}, {...}] }
    router.post('/advices', AdminController.postAdvice);

    // Receive one advice for the current situation: Do I need an update ?...
    router.get('/advices', AdminController.getAdvices);

    // To let me know where you are in this advice
    router.param('adviceId', AdminController.loadAdviceId);
    router.put('/advices/:adviceId', AdminController.putAdvice);

    // What is the current status ?
    router.get('/status', cacheLruFast, AdminController.getStatus);

    return router;

};
