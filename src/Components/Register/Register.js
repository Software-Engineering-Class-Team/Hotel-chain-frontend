import React from 'react';
import './Register.css';
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            error: '',
            fname: '',
            lname: '',
            username: '',
            idType: false,
            homePhone: '',
            idNum: ''
        };
        this.onTextboxChangeEmail = this.onTextboxChangeEmail.bind(this);
        this.onTextboxChangePassword = this.onTextboxChangePassword.bind(this);
        this.onTextboxChangeConfirmPassword = this.onTextboxChangeConfirmPassword.bind(this);
        this.onTextboxChangePhone = this.onTextboxChangePhone.bind(this);
        this.onTextboxChangeUsername = this.onTextboxChangeUsername.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.onTextboxChangeIdNum = this.onTextboxChangeIdNum.bind(this);
        this.onTextboxChangeHomePhone = this.onTextboxChangeHomePhone.bind(this);
    }
    onTextboxChangeEmail(event) {
        this.setState({ email: event.target.value });
    }
    onTextboxChangeIdNum(event) {
        this.setState({ idNum: event.target.value });
    }
    onTextboxChangeUsername(event) {
        this.setState({
            username: event.target.value,
            error: ''
        });
    }
    onTextboxChangePassword(event) {
        this.setState({ password: event.target.value });
    }
    onTextboxChangePhone(event) {
        this.setState({ phone: event.target.value });
    }
    onTextboxChangeHomePhone(event) {
        this.setState({
            homePhone: event.target.value,
            error: ''
        });
    }
    onTextboxChangeConfirmPassword(event) {
        this.setState({
            confirmPassword: event.target.value,
            error: ''
        });
    }
    onchangeRadio(val) {
        this.setState({ idType: val });
    }
    async onRegister() {
        const { email,
            password,
            phone,
            confirmPassword,
            username,
            idType,
            homePhone,
            idNum } = this.state;
        if (!email || !password || !phone || !confirmPassword || !username || !homePhone || !idNum) {
            this.setState({ error: 'Fill all fields' });
            return;
        }
        if (password !== confirmPassword) {
            this.setState({ error: 'Passwords don\'t match' });
            return;
        }
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                username,
                password,
                role: ["user"],
                identification_type: idType ? "Driving licence" : "Passport",
                home_phone_number: homePhone,
                IT_number: parseInt(idNum),
                mobile_phone_number: phone,
                email
            })
        });
        const json = await res.json();
        if (json.message === 'User registered successfully!')
            this.setState({
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                error: json.message,
                username: '',
                homePhone: '',
                idNum: ''
            });
        else
            this.setState({ error: json.message });
    }
    render() {
        const {
            email,
            password,
            phone,
            error,
            confirmPassword,
            username,
            idType,
            idNum,
            homePhone
        } = this.state;
        let errorColor = { 'color': 'red' };
        if (error.startsWith('User r'))
            errorColor = { 'color': 'blue' };
        return <div className="entire-register">
            <div className="box">
                <h3>Registration</h3>
                {error ? (<p style={errorColor}>{error}</p>) : null}
                <label>Username</label><br />
                <input value={username} onChange={this.onTextboxChangeUsername} /><br />
                <label>Mobile phone number</label><br />
                <input value={phone} onChange={this.onTextboxChangePhone} /><br />
                <label>Home phone number</label><br />
                <input value={homePhone} onChange={this.onTextboxChangeHomePhone} /><br />
                <label>Email</label><br />
                <input value={email} onChange={this.onTextboxChangeEmail} /><br />
                <label>Password</label><br /><br />
                <label>Identification type</label><br />
                <div className="idType">
                    <label id="radio">Passport</label>
                    <input type="radio" checked={!idType} onChange={() => this.onchangeRadio(false)} />
                    <label id="radio1">Driving licence</label>
                    <input type="radio" checked={idType} onChange={() => this.onchangeRadio(true)} /><br />
                </div>
                <label>ID number</label><br />
                <input value={idNum} onChange={this.onTextboxChangeIdNum} /><br />
                <label>Password</label><br />
                <input type="password" value={password} onChange={this.onTextboxChangePassword} /><br />
                <label>Repeat Password</label><br />
                <input type="password" value={confirmPassword} onChange={this.onTextboxChangeConfirmPassword}></input>
                <button id="button-register" onClick={this.onRegister}>Register</button>
            </div>
        </div>;
    }
}
export default Register;