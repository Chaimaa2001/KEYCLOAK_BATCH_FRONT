// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import TransactionsList from './components/transactions/TransactionsList';
import Profile from './components/Profile';
import ChangePassword from "./components/ChangePassword";
import ClientDetail from "./components/clients/ClientDetails";
function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<TransactionsList />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/client/:id" element={<ClientDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
