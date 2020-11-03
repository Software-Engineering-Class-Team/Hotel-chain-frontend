import React from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            error: '',
            success: '',
            fname: '',
            lname: ''
        };
        this.onTexboxChangeEmail = this.onTexboxChangeEmail.bind(this);
        this.onTexboxChangePassword = this.onTexboxChangePassword.bind(this);
        this.onTexboxChangeConfirmPassword = this.onTexboxChangeConfirmPassword.bind(this);
        this.onTexboxChangePhone = this.onTexboxChangePhone.bind(this);
        this.onTexboxChangeFname = this.onTexboxChangeFname.bind(this);
        this.onTexboxChangeLname = this.onTexboxChangeLname.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }
    onTexboxChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onTexboxChangePassword(event) {
        this.setState({ password: event.target.value });
    }
    onTexboxChangePhone(event) {
        this.setState({ phone: event.target.value });
    }
    onTexboxChangeConfirmPassword(event) {
        this.setState({ confirmPassword: event.target.value });
    }
    onTexboxChangeLname(event) {
        this.setState({ lname: event.target.value });
    }
    onTexboxChangeFname(event) {
        this.setState({ fname: event.target.value });
    }
    onRegister() {
        const { email,
            password,
            phone,
            confirmPassword,
            fname,
            lname } = this.state;
        if(!email || !password || !phone || !confirmPassword || !fname || lname) {
            this.setState({error: 'Fill all fields'});
            return;
        }
        if(password !== confirmPassword) {
            this.setState({error: 'Passwords don\'t match'});
            return;
        }
        fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-type': 'application/json',
            'Access-Control-Allow-Origin': 'X-Auth' },
            body: JSON.stringify({
                username: phone,
                email,
                password,
                fname,
                lname
            })
        }).then(res => res.json())
         .then(json => {
             if(json.message === 'User registered successfully!') {
                this.setState({email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                fname: '',
                lname: '',
                success: json.message});
             } else {
                this.setState({error: json.message});
             }
         })
    }
    render() {
        const {
            email,
            password,
            phone,
            error,
            success,
            fname,
            lname,
            confirmPassword } = this.state;
        return (
            <div className="entire-register">
                <div className="box">
                    <h3>Registration</h3>
                    {error ? (<p>{error}</p>) : null}
                    {success ? (<p style={{color: 'blue'}}>{success}</p>) : null}
                    <label>Phone</label><br />
                    <input value={phone} onChange={this.onTexboxChangePhone} /><br />
                    <label>Email</label><br />
                    <input value={email} onChange={this.onTexboxChangeEmail} /><br />
                    <label>First name</label><br />
                    <input value={fname} onChange={this.onTexboxChangeFname} /><br />
                    <label>Last name</label><br />
                    <input value={lname} onChange={this.onTexboxChangeLname} /><br />
                    <label>Password</label><br />
                    <input type="password" value={password} onChange={this.onTexboxChangePassword} /><br />
                    <label>Repeat Password</label><br />
                    <input type="password" value={confirmPassword} onChange={this.onTexboxChangeConfirmPassword}></input>
                    <button id="button-register" onClick={this.onRegister}>Register</button>
                    <Link className="link" to="/login">
                        <div>Log in</div>
                    </Link>
                </div>
            </div>
        );
    }
}
export default Register;