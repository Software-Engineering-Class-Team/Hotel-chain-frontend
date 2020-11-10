import React from 'react';
import { getFromStorage } from '../../utils/storage';
import './Profile.css';
class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            upcomingBookings: []
        };
    }
    componentDidMount() {
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token)
            return;
        fetch('http://localhost:8080/api/profile/getallbookings', { 
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': 'X-Auth',
                'Authorization': `Bearer ${obj.token}`
            }
        }).then(res => res.json())
            .then(json => {
                if (json["upcoming bookings: "]) {
                    this.setState({
                        isLoading: false,
                        upcomingBookings: json["upcoming bookings: "]
                    });
                }
            })
    }
    render() {
        const {
            isLoading,
            upcomingBookings
        } = this.state;
        if (isLoading) {
            return <div className="profile">
                <h1>Your reservations</h1>
                <h2>Your upcoming reservations:</h2>
                <h3>Loading...</h3>
            </div>
        }
        return <div>
            <h1>Your reservations</h1>
            <h2>Your upcoming reservations:</h2>
            {upcomingBookings.map((el, i) => <div key={i}>
                <p>{el.hotel.name}, {el.hotel.address}</p>
                <p>{el.room.roomtype.name} room | Size: {el.room.roomtype.size} | Capacity: {el.room.roomtype.capacity}</p>
                <p>Check in: {el.checkin.substring(0, 10)}</p>
                <p>Check out: {el.checkout.substring(0, 10)}</p>
            </div>)}
        </div>
    }
}
export default Profile;