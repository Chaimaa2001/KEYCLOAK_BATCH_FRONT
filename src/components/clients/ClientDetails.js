import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importez useNavigate
import keycloak from "../../keycloak";
import { Card, Spin, Alert, Table, Typography, Button } from 'antd';
import './ClientDetails.css';

const { Title } = Typography;

function ClientDetails() {
    const { id } = useParams(); // Récupérer l'ID du client depuis l'URL
    const navigate = useNavigate(); // Créez une instance de useNavigate
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
        return (
            <div className="container mt-4">
                <Spin tip="Loading..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <Alert message="Error" description={error.message} type="error" showIcon />
            </div>
        );
    }

    const columns = [
        {
            title: 'Attribute',
            dataIndex: 'attribute',
            key: 'attribute',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            render: (text, record) => {
                // Ajout de la logique pour l'email
                if (record.attribute === 'Email') {
                    return (
                        <a href={`mailto:${text}`} target="_blank" rel="noopener noreferrer">
                            {text}
                        </a>
                    );
                }
                return text;
            },
        },
    ];

    const dataSource = [
        { key: '1', attribute: 'ID', value: client.userID },
        { key: '2', attribute: 'Prénom', value: client.prenom || 'N/A' },
        { key: '3', attribute: 'Nom', value: client.nom || 'N/A' },
        { key: '4', attribute: 'Date of Birth', value: client.dateNaissance ? new Date(client.dateNaissance).toLocaleDateString() : 'N/A' },
        { key: '5', attribute: 'Bank Code', value: client.bankCode || 'N/A' },
        { key: '6', attribute: 'Email', value: client.email || 'N/A' },
        { key: '7', attribute: 'Phone Number', value: client.phoneNumber || 'N/A' },
    ];

    return (
        <div className="container mt-4">
            <Button
                type="primary"
                onClick={() => navigate(-1)} // Fonction pour revenir en arrière
                style={{ marginBottom: '20px' }}
            >
                Retour
            </Button>
            <Title level={1}>Client Details</Title>
            {client ? (
                <Card>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        bordered
                    />
                </Card>
            ) : (
                <Alert message="Client not found" type="info" showIcon />
            )}
        </div>
    );
}

export default ClientDetails;
