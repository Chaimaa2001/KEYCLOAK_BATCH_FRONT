import Keycloak from 'keycloak-js';

// Configuration de Keycloak
const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'batch-alerte',
    clientId: 'Batch-BackOffice',
    //clientSecret: 'Ui3usi95lTslPHhyOwnHLPBbOac6GiQK'
});


export default keycloak;
