import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import session from "express-session";
import Keycloak from "keycloak-connect";
import * as bodyParser from "body-parser";

import usersRoutes from "./routes/UsersRoutes";
import publicRoutes from "./routes/PublicRoutes";
import protectedRoutes from "./routes/Protected";
import adminRoutes from "./routes/AdminRoutes";

const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
    extended: true,
}));

const memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

const keycloak = new Keycloak({store: memoryStore});

app.use(keycloak.middleware({
    logout: '/logout'
}));

app.use("/public", publicRoutes());

app.use("/user", usersRoutes());
app.use("/protected", keycloak.protect(), protectedRoutes());
app.use("/admin", keycloak.protect('admin'), adminRoutes());

const port = 3000;
const server = app.listen(port, () => {
    const host = server.address();
    console.log(`Server started at http://${JSON.stringify(host)}:${port}`);
});
