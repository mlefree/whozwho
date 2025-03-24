"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const admin_1 = require("../../controllers/admin");
const routes = async (router) => {
    // Give me a High Five: to say that you're alive - and still acting !
    router.post('/hi', admin_1.AdminController.postHi);
    // Ask your preferred actor's question: Have I a principal role ?...
    router.post('/actors', admin_1.AdminController.postActor);
    // May I give you one advice ?
    router.post('/advices', admin_1.AdminController.postAdvice);
    // Receive one advice for the current situation: Do I need an update ?...
    router.get('/advices', admin_1.AdminController.getAdvices);
    // To let me know where you are in this advice
    router.param('adviceId', admin_1.AdminController.loadAdviceId);
    router.put('/advices/:adviceId', admin_1.AdminController.putAdvice);
    // What is the current status ?
    router.get('/status', admin_1.AdminController.getStatus); // TODO cacheLruFast,
    return router;
};
exports.routes = routes;
//# sourceMappingURL=routes.v1.js.map