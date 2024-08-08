// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import keycloak from '../keycloak';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log(keycloak.authenticated)
    console.log(keycloak.token)
    useEffect(() => {
        keycloak.init({
            onLoad: 'login-required',
            promiseType: 'native'
        }).then(auth => {
            if (auth) {
                const token = keycloak.tokenParsed;
                setUser({
                    fullName: token.given_name + ' ' + token.family_name
                });
            }
            setLoading(false);
        }).catch(error => {
            console.error('Keycloak init error:', error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Authentication failed. Please reload the page.</div>;
    }

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};
