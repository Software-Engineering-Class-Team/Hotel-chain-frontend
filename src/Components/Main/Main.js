import React from 'react';
import './Main.css';
import { getFromStorage, clear } from '../../utils/storage';
import { Link } from 'react-router-dom';
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: '',
            state: ''
        };
        this.onLogout = this.onLogout.bind(this);
    }
    componentDidMount() {
        const obj = getFromStorage('the_main_app');
        if (obj && obj.role)
            this.setState({ role: obj.role })
    }
    onLogout() {
        clear();
        this.setState({ role: '' });
    }
    render() {
        const {
            role
        } = this.state;

        if (!role)
            return <div id="entire">
                <ul>
                    <Link className="link" to="/login">
                        <li>Log in</li>
                    </Link>
                    <Link className="link" to="/register">
                        <li>Register</li>
                    </Link>
                </ul>
                <h1>HotelBook</h1>
                <p>Welcome to HotelBook! Explore and book hotels near to you</p>
                <Link to="/home">
                    <button id="button-main">Book hotel</button>
                </Link>
            </div>;
        else if (role === "ROLE_USER")
            return <div id="entire">
                <ul>
                    <Link className="link" to="/profile">
                        <li>Profile</li>
                    </Link>
                    <li className="link" id="logout" onClick={this.onLogout}>Log Out</li>
                </ul>
                <h1>HotelBook</h1>
                <p>Welcome to HotelBook! Explore and book hotels near to you</p>
                <Link to="/home">
                    <button id="button-main">Book hotel</button>
                </Link>
            </div>;
        else if (role === "ROLE_MODERATOR")
            return <div id="entire">
                <ul>
                    <Link className="link" to="/desk">
                        <li>Manage bookings</li>
                    </Link>
                    <li className="link" id="logout" onClick={this.onLogout}>Log Out</li>
                </ul>
                <h1>HotelBook</h1>
                <p>Welcome to HotelBook! Explore and book hotels near to you</p>
            </div>;
        else
            return <div id="entire">
                <ul>
                    <Link className="link" to="/employees">
                        <li>Manage schedules</li>
                    </Link>
                    <li className="link" id="logout" onClick={this.onLogout}>Log Out</li>
                </ul>
                <h1>HotelBook</h1>
                <p>Welcome to HotelBook! Explore and book hotels near to you</p>
            </div>;
    }
}

export default Main;