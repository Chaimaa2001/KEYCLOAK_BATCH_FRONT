import React, { useState, useEffect } from 'react';
import keycloak from "../../keycloak"; // Assurez-vous que cette importation est correcte
import { Link } from 'react-router-dom'; // Importer Link pour la navigation

function TransactionsList() {
    const [transactions, setTransactions] = useState([]);
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
                fetchTransactions(token);
            }).catch(err => {
                console.error('Failed to refresh token', err);
                setError(err);
                setLoading(false);
            });
        } else {
            fetchTransactions(token);
        }
    }, []);

    const fetchTransactions = (token) => {
        fetch('http://localhost:8081/api/transactions/list', {
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
                console.log(data); // Ajoutez ceci pour vérifier les données reçues
                setTransactions(data);
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
            <h1 className="mb-4">Bank Transactions</h1>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Cheque Type</th>
                    <th>Invoice Reference</th>
                    <th>Notification Method</th>
                    <th>Bank Client ID</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map(transaction => (
                    <tr key={transaction.id}>
                        <td>{transaction.id}</td>
                        <td>{transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() : 'N/A'}</td>
                        <td>{transaction.transactionTypeDescription || 'N/A'}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.typeChequier}</td>
                        <td>{transaction.referenceFacture}</td>
                        <td>{transaction.notificationMethod}</td>
                        <td>
                            {transaction.bankClientID ? (
                                <Link to={`/client/${transaction.bankClientID}`}>
                                    {transaction.bankClientID}
                                </Link>
                            ) : 'N/A'}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionsList;
