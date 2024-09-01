import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import keycloak from '../keycloak';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Button, Avatar, Drawer } from 'antd';
import { DownOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import './Navbar.css';
import logoImage from '../assets/logo.png'; // Importez votre image ici

const Navbar = () => {
    const user = useContext(UserContext);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        keycloak.logout();
    };

    const handleLogin = () => {
        keycloak.login();
    };

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
        setIsMenuOpen(!isMenuOpen); // Change l'état de l'icône
    };

    const menu = (
        <Menu>
            {user ? (
                <>
                    <Menu.Item key="logout">
                        <Button type="link" onClick={handleLogout}>Logout</Button>
                    </Menu.Item>
                    <Menu.Item key="change-password">
                        <Link to="/change-password">Change Password</Link>
                    </Menu.Item>
                </>
            ) : (
                <Menu.Item key="login">
                    <Button type="link" onClick={handleLogin}>Login</Button>
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <nav className="navbar-container">
            <div className="navbar-content">
                <Link className="navbar-brand" to="/">
                    <img src={logoImage} alt="Logo" className="navbar-logo" /> {/* Utilisez l'image ici */}
                </Link>
                <Menu mode="horizontal" className="navbar-menu">
                    <Menu.Item key="clients">
                        <Link to="/clients">Clients</Link>
                    </Menu.Item>
                    <Menu.Item key="transactions">
                        <Link to="/">Transactions</Link>
                    </Menu.Item>
                    <Menu.Item key="Statistics">
                        <Link to="/statistiques">Statistics</Link>
                    </Menu.Item>
                </Menu>
                <div className="navbar-right">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button type="link" className="user-avatar-button">
                            <Avatar
                                icon={user ? <UserOutlined /> : null}
                                src={user?.avatarUrl}
                                alt={user?.fullName}
                                className="user-avatar"
                            />
                            <DownOutlined />
                        </Button>
                    </Dropdown>
                    <Button type="primary" className="navbar-toggler" onClick={toggleDrawer}>
                        {isMenuOpen ? <span className="close-icon">✖</span> : <MenuOutlined />}
                    </Button>
                    <Button type="primary" className="navbar-hamburger" onClick={toggleDrawer}>
                        <MenuOutlined />
                    </Button>
                </div>
            </div>

            <Drawer
                title="Menu"
                placement="left" // Changez cela pour le placer à gauche
                onClose={toggleDrawer}
                visible={drawerVisible}
                className="navbar-drawer"
            >
                <Menu mode="vertical">
                    <Menu.Item key="home">
                        <Link to="/profile">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="clients">
                        <Link to="/clients">Clients</Link>
                    </Menu.Item>
                    <Menu.Item key="transactions">
                        <Link to="/">Transactions</Link>
                    </Menu.Item>
                    <Menu.Item key="settings">
                        <Link to="/settings">Settings</Link>
                    </Menu.Item>
                </Menu>
            </Drawer>
        </nav>
    );
};

export default Navbar;
