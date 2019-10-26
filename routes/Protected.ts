import {Router} from "express";

const protectedRoutes = (): Router => {
    const router = Router();

    router.get('/', function(req, res, next) {
        res.send('protected resource');
    });

    return router;
};

export default protectedRoutes;
