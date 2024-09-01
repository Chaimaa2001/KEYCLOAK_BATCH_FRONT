import React from 'react';
import './Footer.css'; // Importez le fichier CSS pour le pied de page

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>Email: support@example.com</p>
                    <p>Phone: +123-456-7890</p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a><br />
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a><br />
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
