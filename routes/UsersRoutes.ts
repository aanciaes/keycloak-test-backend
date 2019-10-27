import {Router} from "express";
import KcAdminClient from 'keycloak-admin';
import {RequiredActionAlias} from "keycloak-admin/lib/defs/requiredActionProviderRepresentation";
import CredentialRepresentation from "keycloak-admin/lib/defs/credentialRepresentation";

const usersRoutes = (): Router => {
    const router = Router();

    const kcAdminClient = new KcAdminClient({
        baseUrl: 'http://ec2-13-58-116-147.us-east-2.compute.amazonaws.com:8080/auth',
        realmName: 'waterdog',
    });

    // Authorize with username / password
    kcAdminClient.auth({
        username: '',
        password: '',
        grantType: 'client_credentials',
        clientId: "waterdog-backend",
        clientSecret: "ec8a7668-19a5-4e9b-a4e8-e4044e108383"
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
                id: "a01c4257-7723-41fe-81d3-66b1668278a3",
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
                    clientUniqueId: "a01c4257-7723-41fe-81d3-66b1668278a3",

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
