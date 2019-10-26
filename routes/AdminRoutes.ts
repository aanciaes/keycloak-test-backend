import {Router} from "express";

const adminRoutes = (): Router => {
    const router = Router();

    router.get('/', (req, res, next) => {
        res.send('role based protected resource');
    });

    return router;
};

export default adminRoutes;
