// src/components/Profile.js
import React from 'react';
import keycloak from '../keycloak';

const Profile = () => {
    const { token, tokenParsed } = keycloak;

    if (!token) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Username:</strong> {tokenParsed.preferred_username}</p>
            <p><strong>Email:</strong> {tokenParsed.email}</p>
            <button onClick={() => keycloak.logout()}>Logout</button>
        </div>
    );
};

export default Profile;
