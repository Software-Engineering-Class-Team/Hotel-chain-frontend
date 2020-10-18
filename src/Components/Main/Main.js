import React from 'react';
import './Main.css';
import { Link } from 'react-router-dom';
class Main extends React.Component {
    render() {
        return (
            <div id="entire">
                <ul>
                    <Link className="link" to="login">
                        <li>Log in</li>
                    </Link>
                    <Link className="link" to="register">
                        <li>Register</li>
                    </Link>
                    <Link className="link" to="">
                        <li>Profile</li>
                    </Link>
                </ul>
                <h1>HotelBook</h1>
                <p>Welcome to HotelBook! Explore and book hotels near to you</p>
                <Link to="/home">
                    <button id="button-main">Book hotel</button>
                </Link>
            </div>
        );
    }
}

export default Main;