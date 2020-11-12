import React from 'react';
import { setInStorage } from '../../utils/storage';
import '../Register/Register.css';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: ''
        };
        this.onTexboxChangeUsername = this.onTexboxChangeUsername.bind(this);
        this.onTexboxChangePassword = this.onTexboxChangePassword.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }
    onTexboxChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onTexboxChangePassword(event) {
        this.setState({ password: event.target.value });
    }
    async onLogin() {
        const { username,
            password } = this.state;
        if (!username || !password) {
            this.setState({ error: 'Fill all fields' });
            return;
        }
        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-type': 'application/json', },
            body: JSON.stringify({
                username,
                password
            })
        });
        const json = await res.json();
        if (json.accessToken) {
            this.setState({ error: `You successfully logged in. Your token is ${json.accessToken}` });
            setInStorage('the_main_app', {
                token: json.accessToken,
                role: json.roles[0]
            });
        } else
            this.setState({ error: 'Username or password aren\'t correct' });
    }
    render() {
        const { username,
            password,
            error } = this.state;
        let errorColor = { 'color': 'red' };
        if (error.startsWith('You succ'))
            errorColor = { 'color': 'blue' };
        return <div className="entire-register">
            <div className="box">
                <h3>Log in</h3>
                {error ? (<p style={errorColor}>{error}</p>) : null}
                <label>Phone</label><br />
                <input value={username} onChange={this.onTexboxChangeUsername} /><br />
                <label>Password</label><br />
                <input type="password" value={password} onChange={this.onTexboxChangePassword} /><br />
                <button id="button-register" onClick={this.onLogin}>Enter</button>
            </div>
        </div>;
    }
}
export default Login;