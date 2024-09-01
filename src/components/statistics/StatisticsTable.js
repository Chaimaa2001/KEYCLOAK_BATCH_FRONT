import React, { useEffect, useState } from 'react';
import keycloak from "../../keycloak";
import { Table, Spin, Alert, Card } from 'antd';
import { Pie, Column } from '@ant-design/charts';

const StatisticsTable = () => {
    const [statistics, setStatistics] = useState([]);
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
                fetchStatistics(token);
            }).catch(err => {
                console.error('Failed to refresh token', err);
                setError(err);
                setLoading(false);
            });
        } else {
            fetchStatistics(token);
        }
    }, []);

    const fetchStatistics = async (token) => {
        try {
            const response = await fetch('http://localhost:8081/api/statistics', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStatistics(data);
            } else {
                console.error('Failed to fetch statistics:', response.statusText);
                setError(new Error(`Failed to fetch statistics: ${response.statusText}`));
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
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

    // Process data for charts
    const chartData = [
        { type: 'Emails Réussis', value: statistics.reduce((acc, curr) => acc + curr.successfulEmails, 0) },
        { type: 'Emails Échoués', value: statistics.reduce((acc, curr) => acc + curr.failedEmails, 0) },
        { type: 'SMS Réussis', value: statistics.reduce((acc, curr) => acc + curr.successfulSms, 0) },
        { type: 'SMS Échoués', value: statistics.reduce((acc, curr) => acc + curr.failedSms, 0) },
    ];

    // Pie chart config
    const pieConfig = {
        appendPadding: 10,
        data: chartData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,

        interactions: [{ type: 'element-active' }],
    };

    // Column chart config
    const columnConfig = {
        data: chartData,
        xField: 'type',
        yField: 'value',
        label: {
            position: 'top',
            style: {
                fill: '#000',
                opacity: 0.6,
            },
        },
        color: ({ type }) => {
            switch (type) {
                case 'Emails Échoués': return '#FF4D4F';
                case 'SMS Échoués': return '#FF6E6F';
                default: return '#00A859';
            }
        },
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Statistiques des Notifications</h2>
            <Card title="Répartition des Notifications" style={{ marginBottom: '20px' }}>
                <Pie {...pieConfig} />
            </Card>
            <Card title="Statistiques Détailées" style={{ marginBottom: '20px' }}>
                <Column {...columnConfig} />
            </Card>
            <Table
                columns={[
                    {
                        title: 'Transaction ID',
                        dataIndex: ['bankTransaction', 'id'],
                        key: 'transactionId',
                    },
                    {
                        title: 'Date de traitement',
                        dataIndex: 'processingDate',
                        key: 'processingDate',
                        render: date => new Date(date).toLocaleString(),
                    },
                    {
                        title: 'Total Transactions',
                        dataIndex: 'totalTransactions',
                        key: 'totalTransactions',
                    },
                    {
                        title: 'Emails Réussis',
                        dataIndex: 'successfulEmails',
                        key: 'successfulEmails',
                    },
                    {
                        title: 'Emails Échoués',
                        dataIndex: 'failedEmails',
                        key: 'failedEmails',
                    },
                    {
                        title: 'SMS Réussis',
                        dataIndex: 'successfulSms',
                        key: 'successfulSms',
                    },
                    {
                        title: 'SMS Échoués',
                        dataIndex: 'failedSms',
                        key: 'failedSms',
                    },
                    {
                        title: 'Transactions Ignorées',
                        dataIndex: 'skippedTransactions',
                        key: 'skippedTransactions',
                    },
                ]}
                dataSource={statistics}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default StatisticsTable;