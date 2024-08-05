// src/components/Navbar.js
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import keycloak from '../keycloak';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const user = useContext(UserContext);

    const handleLogout = () => {
        keycloak.logout();
    };

    const handleLogin = () => {
        keycloak.login();
    };

    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Logo</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse d-flex justify-content-between" id="collapsibleNavbar">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/clients">Clients</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/transactions">Transactions</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                {user ? user.fullName : 'Login'}
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                {user ? (
                                    <>
                                        <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                                        <li><Link className="dropdown-item" to="/change-password">Change Password</Link></li>
                                    </>
                                ) : (
                                    <li><a className="dropdown-item" href="#" onClick={handleLogin}>Login</a></li>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
