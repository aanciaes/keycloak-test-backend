"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var keycloak_admin_1 = __importDefault(require("keycloak-admin"));
var requiredActionProviderRepresentation_1 = require("keycloak-admin/lib/defs/requiredActionProviderRepresentation");
var usersRoutes = function () {
    var router = express_1.Router();
    var kcAdminClient = new keycloak_admin_1.default({
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
    }).then(function (client) {
        console.log("Authentication Successful");
    }).catch(function (err) {
        console.error(err);
    });
    router.post("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var cmd, credentials, requiredActions, role, user, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    cmd = req.body;
                    credentials = { value: cmd.password, type: "password" };
                    requiredActions = [];
                    if (cmd.temporaryCredentials) {
                        requiredActions.push(requiredActionProviderRepresentation_1.RequiredActionAlias.UPDATE_PASSWORD);
                    }
                    return [4 /*yield*/, kcAdminClient.clients.findRole({
                            id: "c414b1bf-9ac7-434e-98f9-c5e05f41f6b3",
                            roleName: cmd.role
                        })];
                case 1:
                    role = _a.sent();
                    if (!!role) return [3 /*break*/, 2];
                    res.send({ error: "No role named: " + cmd.role });
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, kcAdminClient.users.create({
                        username: cmd.username,
                        email: cmd.email,
                        enabled: true,
                        credentials: [credentials],
                        requiredActions: requiredActions,
                        clientRoles: {
                            "waterdog-backend": cmd.role
                        },
                        attributes: {
                            githubUser: ["false"],
                        }
                    })];
                case 3:
                    user = _a.sent();
                    /*await kcAdminClient.users.addClientRoleMappings({
                        id: user.id,
                        clientUniqueId: "c414b1bf-9ac7-434e-98f9-c5e05f41f6b3",
    
                        // at least id and name should appear
                        roles: [
                            {
                                id: role.id,
                                name: role.name,
                            },
                        ],
                    });*/
                    res.status(200).send(user);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    res.status(500).send({ error: e_1.message });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    return router;
};
exports.default = usersRoutes;
