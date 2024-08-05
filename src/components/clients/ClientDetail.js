// src/components/ClientDetail.js
import React from 'react';
import PropTypes from 'prop-types';

const ClientDetail = ({ client }) => {
    return (
        <div className="container mt-4">
            <h2>Client Details</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{client.name}</h5>
                    <p className="card-text"><strong>Email:</strong> {client.email}</p>
                    <p className="card-text"><strong>Phone:</strong> {client.phone}</p>
                    <p className="card-text"><strong>Address:</strong> {client.address}</p>
                    {/* Ajoutez d'autres détails du client ici */}
                </div>
            </div>
        </div>
    );
};

ClientDetail.propTypes = {
    client: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        address: PropTypes.string,
    }).isRequired,
};

export default ClientDetail;
