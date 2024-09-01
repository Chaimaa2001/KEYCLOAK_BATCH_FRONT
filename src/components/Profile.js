import React from 'react';
import { Layout, Row, Col, Button } from 'antd';
import keycloak from '../keycloak';
import 'antd/dist/reset.css'; // Importer le style Ant Design

const { Header, Content } = Layout;

const Profile = () => {
    const { token, tokenParsed } = keycloak;

    if (!token) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <Header style={{ background: '#fff', padding: '0 20px' }}>
                <h1>Profile</h1>
            </Header>
            <Content style={{ padding: '20px' }}>
                <Row>
                    <Col span={12} style={{ textAlign: 'center' }}>
                        <img
                            src={"../assets/logo.png"}
                            alt="Profile"
                            style={{ width: '100%', maxWidth: '300px' }}
                        />
                    </Col>
                    <Col span={12}>
                        <div style={{ padding: '20px' }}>
                            <p><strong>Username:</strong> {tokenParsed.preferred_username}</p>
                            <p><strong>Email:</strong> {tokenParsed.email}</p>
                            <Button
                                type="primary"
                                onClick={() => keycloak.logout()}
                            >
                                Logout
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Profile;
