import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import keycloak from "../../keycloak";
import { Card, Spin, Alert, Descriptions, Button } from 'antd';
import dayjs from 'dayjs';

const TransactionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = keycloak.token;

        if (keycloak.isTokenExpired()) {
            keycloak.updateToken(30).then((refreshed) => {
                if (refreshed) {
                    console.log('Token was successfully refreshed');
                } else {
                    console.log('Token is still valid');
                }
                fetchTransactionDetails(token);
            }).catch(err => {
                console.error('Failed to refresh token', err);
                setError(err);
                setLoading(false);
            });
        } else {
            fetchTransactionDetails(token);
        }
    }, [id]);

    const fetchTransactionDetails = async (token) => {
        try {
            const response = await fetch(`http://localhost:8081/api/statistics/statistics/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const sortedTransactions = data.sort((a, b) => new Date(b.processingDate) - new Date(a.processingDate));
                setTransactions(sortedTransactions);
            } else {
                console.error('Failed to fetch transaction details:', response.statusText);
                setError(new Error(`Failed to fetch transaction details: ${response.statusText}`));
            }
        } catch (error) {
            console.error('Error fetching transaction details:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const getTransactionTypeDescription = (code) => {
        const transactionTypes = {
            "V": "Virement",
            "DC": "Demande de Chéquier",
            "DE": "Demande de Crédit",
            "DOC": "Demande d'Opposition Chèque",
            "PF": "Paiement Facture"
        };

        return transactionTypes[code] || code;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin tip="Loading..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <Alert message="Error" description={error.message} type="error" showIcon />
            </div>
        );
    }

    const latestTransaction = transactions.length > 0 ? transactions[0] : null;

    return (
        <div>
            <Button onClick={handleGoBack} style={{ margin: '20px' }}>
                Retour
            </Button>
            <Card title={`Transaction ID: ${latestTransaction ? latestTransaction.id : 'N/A'}`} style={{ margin: '20px' }}>
                {latestTransaction ? (
                    <Descriptions bordered>
                        <Descriptions.Item label="Transaction ID">{latestTransaction.id}</Descriptions.Item>
                        <Descriptions.Item label="Date de traitement">{dayjs(latestTransaction.processingDate).format('DD/MM/YYYY HH:mm:ss')}</Descriptions.Item>
                        <Descriptions.Item label="Date de transaction">{dayjs(latestTransaction.bankTransaction.transactionDate).format('DD/MM/YYYY HH:mm:ss')}</Descriptions.Item>
                        <Descriptions.Item label="Montant">{latestTransaction.bankTransaction.amount}</Descriptions.Item>
                        <Descriptions.Item label="Type de transaction">{getTransactionTypeDescription(latestTransaction.bankTransaction.transactionType)}</Descriptions.Item>
                        <Descriptions.Item label="Méthode de notification">{latestTransaction.bankTransaction.notificationMethod}</Descriptions.Item>
                        <Descriptions.Item label="Statut de notification">{latestTransaction.bankTransaction.notificationStatus}</Descriptions.Item>
                        <Descriptions.Item label="Total Transactions">{latestTransaction.totalTransactions}</Descriptions.Item>
                        <Descriptions.Item label="Emails Réussis">{latestTransaction.successfulEmails}</Descriptions.Item>
                        <Descriptions.Item label="Emails Échoués">{latestTransaction.failedEmails}</Descriptions.Item>
                        <Descriptions.Item label="SMS Réussis">{latestTransaction.successfulSms}</Descriptions.Item>
                        <Descriptions.Item label="SMS Échoués">{latestTransaction.failedSms}</Descriptions.Item>
                        <Descriptions.Item label="Transactions Ignorées">{latestTransaction.skippedTransactions}</Descriptions.Item>
                    </Descriptions>
                ) : (
                    <p>Aucune transaction trouvée.</p>
                )}
            </Card>
        </div>
    );
};

export default TransactionDetails;
