// src/services/tokenService.js
const tokenEndpoint = 'http://localhost:8080/auth/realms/batch-alerte/protocol/openid-connect/token';

export const getToken = async () => {
    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': 'Batch-BackOffice',
            'client_secret': 'k0kK2HgPHCYS8RxpJe068P4Gqm7Kai5x'
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch token');
    }

    const data = await response.json();
    console.log('Token:', data.access_token);
    return data.access_token;
};
