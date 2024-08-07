import React from 'react';
import { useNavigate } from 'react-router-dom';
import keycloak from "../keycloak";

const ChangePassword = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        // URL de gestion du compte Keycloak
        const accountUrl = `${keycloak.authServerUrl}/realms/${keycloak.realm}/account`;
        window.location.href = accountUrl;
    };

    const handleBack = () => {
        navigate('/'); // Redirige vers la page d'accueil ou une autre page de votre choix
    };

    return (
        <div className="container mt-5">
            <h2>Change Password</h2>
            <button className="btn btn-primary" onClick={handleRedirect}>Go to Account Management</button>
            <button className="btn btn-secondary ms-2" onClick={handleBack}>Back to App</button>
        </div>
    );
};

export default ChangePassword;
