"use strict";
exports.__esModule = true;
var express_1 = require("express");
var path_1 = require("path");
var cookie_parser_1 = require("cookie-parser");
var morgan_1 = require("morgan");
var cors_1 = require("cors");
var KeycloakUsers_1 = require("./routes/KeycloakUsers");
/*import publicRoutes from "./routes/users";
import protectedRoutes from "./routes/protected";
import roleBasedProtectedRoutes from "./routes/roleBasedProtection";*/
var express_session_1 = require("express-session");
var keycloak_connect_1 = require("keycloak-connect");
var app = express_1["default"]();
app.use(cors_1["default"]());
var memoryStore = new express_session_1["default"].MemoryStore();
app.use(express_session_1["default"]({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
var keycloak = new keycloak_connect_1["default"]({ store: memoryStore });
app.use(keycloak.middleware({
    logout: '/logout'
}));
// view engine setup
app.set('views', path_1["default"].join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(morgan_1["default"]('dev'));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
app.use(cookie_parser_1["default"]());
// app.use('/public', publicRoutes);
app.use("/user", keycloak.protect('admin'), KeycloakUsers_1["default"]);
/*app.use("/protected", keycloak.protect(), protectedRoutes);
app.use("/protectedWithRole", keycloak.protect('admin'), roleBasedProtectedRoutes);*/
module.exports = app;
