"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const admin_1 = require("../../controllers/admin");
const cache_1 = require("../../factories/cache");
const routes = async (router) => {
    // Give me a High Five: to say that you're alive - and still acting !
    router.post('/hi', admin_1.AdminController.postHi);
    // Ask your preferred actor's question: Have I the principal role ? or need an address ?...
    //  => { answer : yes }
    //  => { answer : { actorId: 'result...', ...}}
    router.post('/actors', admin_1.AdminController.postActor);
    // Get all alive actors
    //  => {actors: [{<ActorSchema>}, {...}]}
    // Get all alive actors from a category   ?category=...
    // Get principal actor from a category   ?category=...&principal=true
    router.get('/actors', cache_1.cacheLruFast, admin_1.AdminController.getActors);
    // May I give you one advice ?
    // => { advices: [{id:12  type:'UPDATE'}, {...}] }
    router.post('/advices', admin_1.AdminController.postAdvice);
    // Receive one advice for the current situation: Do I need an update ?...
    router.get('/advices', cache_1.cacheLruFast, admin_1.AdminController.getAdvices);
    // To let me know where you are in this advice
    router.param('adviceId', admin_1.AdminController.loadAdviceId);
    router.put('/advices/:adviceId', admin_1.AdminController.putAdvice);
    // What is the current status ?
    router.get('/status', admin_1.AdminController.getStatus);
    return router;
};
exports.routes = routes;
//# sourceMappingURL=routes.v1.js.map