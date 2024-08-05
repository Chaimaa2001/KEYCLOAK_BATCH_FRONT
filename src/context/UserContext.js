// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import keycloak from '../keycloak';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        keycloak.init({
            onLoad: 'check-sso',
            promiseType: 'native',
            redirectUri: window.location.origin
        }).then(auth => {
            console.log('Keycloak authentication result:', auth);
            if (auth) {
                const token = keycloak.tokenParsed;
                setUser({
                    fullName: token.given_name + ' ' + token.family_name
                });
            }
            setAuthenticated(auth);
            setLoading(false);
        }).catch(error => {
            console.error('Keycloak init error:', error);
            setLoading(false);
        });
    }, []);



    if (loading) {
        return <div>Loading...</div>;
    }

    if (!authenticated) {
        return <div>Authentication failed. Please reload the page.</div>;
    }

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};
