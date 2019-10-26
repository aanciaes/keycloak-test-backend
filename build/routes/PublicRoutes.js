"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var publicRoutes = function () {
    var router = express_1.Router();
    router.get('/', function (req, res, next) {
        res.send('unprotected resource');
    });
    return router;
};
exports.default = publicRoutes;
