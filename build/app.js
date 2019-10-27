"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var express_session_1 = __importDefault(require("express-session"));
var keycloak_connect_1 = __importDefault(require("keycloak-connect"));
var bodyParser = __importStar(require("body-parser"));
var UsersRoutes_1 = __importDefault(require("./routes/UsersRoutes"));
var PublicRoutes_1 = __importDefault(require("./routes/PublicRoutes"));
var Protected_1 = __importDefault(require("./routes/Protected"));
var AdminRoutes_1 = __importDefault(require("./routes/AdminRoutes"));
var app = express_1.default();
app.use(cors_1.default());
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
    extended: true,
}));
var memoryStore = new express_session_1.default.MemoryStore();
app.use(express_session_1.default({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
var keycloak = new keycloak_connect_1.default({ store: memoryStore });
app.use(keycloak.middleware({
    logout: '/logout'
}));
app.use("/public", PublicRoutes_1.default());
app.use("/user", keycloak.protect('admin'), UsersRoutes_1.default());
app.use("/protected", keycloak.protect(), Protected_1.default());
app.use("/admin", keycloak.protect('admin'), AdminRoutes_1.default());
var port = 3000;
var server = app.listen(port, function () {
    var host = server.address();
    console.log("Server started at http://" + JSON.stringify(host) + ":" + port);
});
