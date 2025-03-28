import {Router} from 'express';
import {AdminController} from '../../controllers/admin';

export const routes = async (router: Router) => {

    // Give me a High Five: to say that you're alive - and still acting !
    router.post('/hi', AdminController.postHi);

    // Ask your preferred actor's question: Have I a principal role ?...
    router.post('/actors', AdminController.postActor);

    // May I give you one advice ?
    router.post('/advices', AdminController.postAdvice);

    // Receive one advice for the current situation: Do I need an update ?...
    router.get('/advices', AdminController.getAdvices);

    // To let me know where you are in this advice
    router.param('adviceId', AdminController.loadAdviceId);
    router.put('/advices/:adviceId', AdminController.putAdvice);

    // What is the current status ?
    router.get('/status', AdminController.getStatus); // TODO cacheLruFast,

    return router;

};
