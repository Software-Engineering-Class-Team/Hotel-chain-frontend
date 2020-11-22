import React from 'react';
import { getFromStorage } from '../../utils/storage';
import { Link } from 'react-router-dom';
import './Desk.css';
class Desk extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            guests: []
        };
    }
    async componentDidMount() {
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\'t exist');
            return;
        }
        const res = await fetch('/api/clerkdesk/getAllGuests', {
            headers: { 'Authorization': `Bearer ${obj.token}` }
        });
        const json = await res.json();
        this.setState({
            guests: json,
            isLoading: false
        });
    }
    render() {
        const {
            isLoading,
            guests
        } = this.state;
        return <div className="desk">
            <h1>List of guests</h1>
            {isLoading ?
                <h2>Loading...</h2>
                :
                guests.map((user, i) => <div key={i} className="guest">
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Mobile phone number: {user.mobile_phone_number}</p>
                    <p>Home phone number: {user.home_phone_number}</p>
                    <p>ID type: {user.identification_type}</p>
                    <p>ID number: {user.it_number}</p>
                    <Link to={{
                        pathname: `/desk/${user.id}`,
                        state: { username: user.username }
                    }}><button>See bookings</button></Link>
                </div>)
            }
        </div>
    }
}
export default Desk;