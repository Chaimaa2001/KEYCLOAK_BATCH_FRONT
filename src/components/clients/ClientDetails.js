import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Pour récupérer l'ID du client depuis l'URL
import keycloak from "../../keycloak";

function ClientDetails() {
    const { id } = useParams(); // Récupérer l'ID du client depuis l'URL
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = keycloak.token;

        // Vérifiez si le token est valide et rafraîchissez-le si nécessaire
        if (keycloak.isTokenExpired()) {
            keycloak.updateToken(30).then((refreshed) => {
                if (refreshed) {
                    console.log('Token was successfully refreshed');
                } else {
                    console.log('Token is still valid');
                }
                fetchClient(token);
            }).catch(err => {
                console.error('Failed to refresh token', err);
                setError(err);
                setLoading(false);
            });
        } else {
            fetchClient(token);
        }
    }, [id]);

    const fetchClient = (token) => {
        fetch(`http://localhost:8081/api/clients/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setClient(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    if (loading) {
        return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
    }

    if (error) {
        return <div className="container mt-4"><div className="alert alert-danger">Error: {error.message}</div></div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Client Details</h1>
            {client ? (
                <div>
                    <p><strong>ID:</strong> {client.userID}</p>
                    <p><strong>Prenom:</strong> {client.prenom || 'N/A'}</p>
                    <p><strong>Nom:</strong> {client.nom || 'N/A'}</p>
                    <p><strong>Date of Birth:</strong> {client.dateNaissance ? new Date(client.dateNaissance).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Bank Code:</strong> {client.bankCode || 'N/A'}</p>
                    {/* Ajoutez d'autres informations client ici */}
                </div>
            ) : (
                <div className="alert alert-info">Client not found</div>
            )}
        </div>
    );
}

export default ClientDetails;
