import React, { useEffect, useState } from 'react';
import keycloak from "../../keycloak";
import { Table, Spin, Alert, Button, Select, Space, Input, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import './TransactionsList.css';

const { Option } = Select;

function TransactionsList() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactionTypes, setTransactionTypes] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [searchClientId, setSearchClientId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Nombre de transactions par page

    useEffect(() => {
        const token = keycloak.token;

        if (keycloak.isTokenExpired()) {
            keycloak.updateToken(30).then((refreshed) => {
                if (refreshed) {
                    console.log('Token was successfully refreshed');
                } else {
                    console.log('Token is still valid');
                }
                fetchTransactions(token);
                fetchTransactionTypes(token);
            }).catch(err => {
                console.error('Failed to refresh token', err);
                setError(err);
                setLoading(false);
            });
        } else {
            fetchTransactions(token);
            fetchTransactionTypes(token);
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
                console.log('Fetched transactions:', data);
                setTransactions(data);
                filterTransactions(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    const fetchTransactionTypes = (token) => {
        fetch('http://localhost:8081/api/transactions/filters', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch transaction types');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched transaction types:', data);
                setTransactionTypes(data.map(type => ({ text: type, value: type })));
            })
            .catch(error => {
                console.error('Failed to fetch transaction types', error);
            });
    };

    const handleYearChange = (value) => {
        setSelectedYear(value);
        filterTransactions(transactions, value, selectedMonth, selectedDay, selectedType, searchId, searchClientId);
    };

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
        filterTransactions(transactions, selectedYear, value, selectedDay, selectedType, searchId, searchClientId);
    };

    const handleDayChange = (value) => {
        setSelectedDay(value);
        filterTransactions(transactions, selectedYear, selectedMonth, value, selectedType, searchId, searchClientId);
    };

    const handleTypeChange = (value) => {
        setSelectedType(value);
        filterTransactions(transactions, selectedYear, selectedMonth, selectedDay, value, searchId, searchClientId);
    };

    const handleSearchIdChange = (e) => {
        setSearchId(e.target.value);
        filterTransactions(transactions, selectedYear, selectedMonth, selectedDay, selectedType, e.target.value, searchClientId);
    };

    const handleSearchClientIdChange = (e) => {
        setSearchClientId(e.target.value);
        filterTransactions(transactions, selectedYear, selectedMonth, selectedDay, selectedType, searchId, e.target.value);
    };

    const filterTransactions = (data, year, month, day, type, id, clientId) => {
        let filtered = data;

        if (year) {
            filtered = filtered.filter(transaction => dayjs(transaction.transactionDate).year() === year);
        }
        if (month) {
            filtered = filtered.filter(transaction => dayjs(transaction.transactionDate).month() + 1 === month);
        }
        if (day) {
            filtered = filtered.filter(transaction => dayjs(transaction.transactionDate).date() === day);
        }
        if (type) {
            filtered = filtered.filter(transaction => transaction.transactionTypeDescription.trim().toLowerCase() === type.trim().toLowerCase());
        }
        if (id) {
            filtered = filtered.filter(transaction => transaction.id.toString().includes(id));
        }
        if (clientId) {
            filtered = filtered.filter(transaction => transaction.bankClientID.toString().includes(clientId));
        }

        setFilteredTransactions(filtered);
        setCurrentPage(1); // Reset page to 1 when filtering
    };

    const resetFilters = () => {
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedDay(null);
        setSelectedType(null);
        setSearchId('');
        setSearchClientId('');
        filterTransactions(transactions);
    };

    const renderNotificationMethod = (methods) => {
        if (!methods) return 'N/A';

        const methodList = methods.split(' && ').map(method => method.trim());
        const uniqueMethods = new Set(methodList);

        if (uniqueMethods.size === 1) {
            const method = Array.from(uniqueMethods)[0];
            if (method === 'mail') {
                return (
                    <div className="notification-methods">
                        <span className="notification-method notification-method-mail">Mail</span>
                    </div>
                );
            } else if (method === 'sms') {
                return (
                    <div className="notification-methods">
                        <span className="notification-method notification-method-sms">SMS</span>
                    </div>
                );
            } else if (method === 'mail&&sms') {
                return (
                    <div className="notification-methods">
                        <span className="notification-method notification-method-both">Mail & SMS</span>
                    </div>
                );
            }
        }

        return 'N/A';
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Date',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : 'N/A',
        },
        {
            title: 'Type',
            dataIndex: 'transactionTypeDescription',
            key: 'transactionTypeDescription',
            filters: transactionTypes,
            onFilter: (value, record) => record.transactionTypeDescription.trim().toLowerCase() === value.trim().toLowerCase(),
            render: (text) => text || 'N/A',
        },
        {
            title: 'Montant',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Cheque Type',
            dataIndex: 'typeChequier',
            key: 'typeChequier',
        },
        {
            title: 'Référence Facture',
            dataIndex: 'referenceFacture',
            key: 'referenceFacture',
        },
        {
            title: 'Méthode de notification',
            dataIndex: 'notificationMethod',
            key: 'notificationMethod',
            render: (text) => renderNotificationMethod(text),
        },
        {
            title: 'Bank Client ID',
            dataIndex: 'bankClientID',
            key: 'bankClientID',
            render: (text) => (
                <div>
                    {text ? (
                        <Link to={`/client/${text}`}>
                            <Button type="link" className="custom-link-button">{text}</Button>
                        </Link>
                    ) : 'N/A'}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                let statusClass = '';
                let statusText = status ? status : 'N/A';
                let content;

                switch (status) {
                    case 'SUCCESS':
                        statusClass = 'status-success';
                        content = (
                            <Link to={`/statistiques/${record.id}`}>
                                <Button type="link" className="status-button">
                                    {statusText}
                                </Button>
                            </Link>
                        );
                        break;
                    case 'PENDING':
                        statusClass = 'status-pending';
                        content = (
                            <Link to={`/statistiques/${record.id}`}>
                                <Button type="link" className="status-button">
                                    {statusText}
                                </Button>
                            </Link>
                        );
                        break;
                    case 'FAILED':
                        statusClass = 'status-failed';
                        content = (
                            <Link to={`/statistiques/${record.id}`}>
                                <Button type="link" className="status-button">
                                    {statusText}
                                </Button>
                            </Link>
                        );
                        break;
                    default:
                        statusClass = 'status-default';
                        content = statusText;
                }

                return <span className={`status ${statusClass}`}>{content}</span>;
            },
        },
    ];

    return (
        <div className="transactions-list">
            <div className="filters">
                <Space>
                    <Input placeholder="Search ID" value={searchId} onChange={handleSearchIdChange} style={{ width: 200 }} />
                    <Input placeholder="Search Client ID" value={searchClientId} onChange={handleSearchClientIdChange} style={{ width: 200 }} />
                    <Select placeholder="Year" style={{ width: 120 }} onChange={handleYearChange} value={selectedYear}>
                        {Array.from(new Set(transactions.map(t => dayjs(t.transactionDate).year()))).map(year => (
                            <Option key={year} value={year}>{year}</Option>
                        ))}
                    </Select>
                    <Select placeholder="Month" style={{ width: 120 }} onChange={handleMonthChange} value={selectedMonth}>
                        {Array.from(new Set(transactions.map(t => dayjs(t.transactionDate).month() + 1))).map(month => (
                            <Option key={month} value={month}>{month}</Option>
                        ))}
                    </Select>
                    <Select placeholder="Day" style={{ width: 120 }} onChange={handleDayChange} value={selectedDay}>
                        {Array.from(new Set(transactions.map(t => dayjs(t.transactionDate).date()))).map(day => (
                            <Option key={day} value={day}>{day}</Option>
                        ))}
                    </Select>
                    <Select placeholder="Type" style={{ width: 120 }} onChange={handleTypeChange} value={selectedType}>
                        {transactionTypes.map(type => (
                            <Option key={type.value} value={type.value}>{type.text}</Option>
                        ))}
                    </Select>
                    <Button onClick={resetFilters}>Reset Filters</Button>
                </Space>
            </div>
            <Table
                columns={columns}
                dataSource={filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                pagination={false}
                rowKey="id"
            />
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredTransactions.length}
                onChange={page => setCurrentPage(page)}
                style={{ marginTop: 16, textAlign: 'center' }}
            />
        </div>
    );
}

export default TransactionsList;
