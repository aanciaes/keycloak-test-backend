import {Router} from "express";

const publicRoutes = (): Router => {
  const router = Router();

  router.get('/', function(req, res, next) {
    res.send('unprotected resource');
  });

  return router;
};

export default publicRoutes;
