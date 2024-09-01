import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Spin, Alert, Input } from 'antd';
import './ClientList.css';
import keycloak from "../../keycloak"; // Assurez-vous que le chemin est correct

function ClientList() {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                // Rafraîchir le token si nécessaire
                if (keycloak.isTokenExpired()) {
                    await keycloak.updateToken(30); // Rafraîchir le token
                }
                console.log(keycloak.token);

                const response = await fetch('http://localhost:8081/api/clients/all', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${keycloak.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                // Transformation des données pour ne conserver que l'ID, le nom et le prénom
                const transformedData = data.map(person => ({
                    id: person.userID,
                    nom: person.nom,
                    prenom: person.prenom
                }));

                setClients(transformedData);
                setFilteredClients(transformedData); // Initialement, afficher tous les clients
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        // Filtrer les clients en fonction du terme de recherche
        const filtered = clients.filter(client =>
            client.nom.toLowerCase().includes(value) ||
            client.prenom.toLowerCase().includes(value)
        );
        setFilteredClients(filtered);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Prénom',
            dataIndex: 'prenom',
            key: 'prenom',
        },
        {
            title: 'Details',
            key: 'details',
            render: (text, record) => (
                <Link to={`/client/${record.id}`}>View Details</Link>
            ),
        },
    ];

    if (loading) {
        return <Spin tip="Loading..." size="large" />;
    }

    if (error) {
        return <Alert message="Error" description={error.message} type="error" showIcon />;
    }

    return (
        <div className="container mt-4">
            <h2 className="table-title">Liste de tous les clients</h2>
            <Input
                placeholder="Rechercher par nom ou prénom"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginBottom: 16, width: '300px' }}
            />
            <Table
                dataSource={filteredClients}
                columns={columns}
                rowKey="id"
                bordered
                pagination={{
                    pageSize: 5, // Nombre de clients par page
                    style: { textAlign: 'center' } // Centrer la pagination
                }}
            />
        </div>
    );
}

export default ClientList;
