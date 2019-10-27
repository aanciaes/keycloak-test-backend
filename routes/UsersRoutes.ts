import {Router} from "express";
import KcAdminClient from 'keycloak-admin';
import {RequiredActionAlias} from "keycloak-admin/lib/defs/requiredActionProviderRepresentation";
import CredentialRepresentation from "keycloak-admin/lib/defs/credentialRepresentation";

const usersRoutes = (): Router => {
    const router = Router();

    const kcAdminClient = new KcAdminClient({
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
        console.log("Authentication Successful");
    }).catch((err) => {
        console.error(err);
    });

    router.post("/", async (req, res) => {
        try {
            const cmd: { username: string, password: string, email: string, temporaryCredentials: boolean, role: string } = req.body.data;
            const credentials: CredentialRepresentation = {value: cmd.password, type: "password"};
            const requiredActions = [];
            if (cmd.temporaryCredentials){
                requiredActions.push(RequiredActionAlias.UPDATE_PASSWORD)
            }

            const role = await kcAdminClient.clients.findRole({
                id: "c414b1bf-9ac7-434e-98f9-c5e05f41f6b3",
                roleName: cmd.role
            });

            if (!role) {
                res.send({error: "No role named: " + cmd.role})
            } else {
                const user = await kcAdminClient.users.create({
                    username: cmd.username,
                    email: cmd.email,
                    enabled: true,
                    credentials: [credentials],
                    requiredActions: requiredActions,
                    attributes:
                        {
                            githubUser: ["false"],
                        }
                });

                await kcAdminClient.users.addClientRoleMappings({
                    id: user.id,
                    clientUniqueId: "c414b1bf-9ac7-434e-98f9-c5e05f41f6b3",

                    // at least id and name should appear
                    roles: [
                        {
                            id: role.id,
                            name: role.name,
                        },
                    ],
                });

                res.status(200).send(user)
            }
        } catch (e) {
            console.error(e.message);
            res.status(500).send({error: e.message})
        }
    });

    return router;
};

export default usersRoutes;
