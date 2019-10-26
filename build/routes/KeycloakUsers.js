"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
/*
let kcAdminClient = null;
const configureKeycloak = async () => {
    kcAdminClient = new KcAdminClient({
        baseUrl: 'http://ec2-54-175-112-125.compute-1.amazonaws.com:8080/auth',
        realmName: 'waterdog',
    });

    // Authorize with username / password
    kcAdminClient.auth({
        username: '',
        password: '',
        grantType: 'client_credentials',
        clientId: "waterdog-backend",
        clientSecret: "dbc63a70-4914-4fe2-bca9-9b2b2d58de11"
    }).then((client) => {
        console.log("success");
    }).catch((err) => {
        console.error(err);
    });
};*/
var keycloakUsersRoutes = function () {
    var router = express_1.Router();
    router.post('/', function (req, res) {
        res.status(200).send({ message: "Test" });
    });
    return router;
};
exports.default = keycloakUsersRoutes;
