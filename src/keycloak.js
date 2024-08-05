import Keycloak from 'keycloak-js';

// Configuration de Keycloak
const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'batch-alerte',
    clientId: 'Batch-BackOffice',
});
console.log(keycloak.token)

export default keycloak;
