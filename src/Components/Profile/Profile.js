import React from 'react';
import { getFromStorage } from '../../utils/storage';
import './Profile.css';
class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            upcomingBookings: [],
            pastBookings: [],
            ids: []
        };
    }
    fetchBookings() {
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token)
            return;
        fetch('/api/profile/getallbookings', {
            headers: {
                'Authorization': `Bearer ${obj.token}`
            }
        }).then(res => res.json())
            .then(json => {
                if (json["upcoming bookings: "]) {
                    this.setState({
                        isLoading: false,
                        upcomingBookings: json["upcoming bookings: "],
                        pastBookings: json["past reservations: "],
                        ids: json["upcoming bookings: "].map(booking => booking.id)
                    });
                }
            })
    }
    componentDidMount() {
        this.fetchBookings();
    }
    onCancel(i) {
        const {ids} = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token)
            return;
        fetch('/api/bookings/delete', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${obj.token}`
            },
            body: JSON.stringify({Id: ids[i]})
        }).then(res => res.json())
        .then(json => {
            if(json.message.startsWith('C')) {
                this.state.ids.splice(i);
                this.fetchBookings();
            }
        })
    }
    render() {
        const {
            isLoading,
            upcomingBookings,
            pastBookings
        } = this.state;
        if (isLoading) {
            return <div className="profile">
                <h1>Your reservations</h1>
                <h2>Your upcoming reservations:</h2>
                <h3>Loading...</h3>
            </div>
        }
        return <div className="profile">
            <h1>Your reservations</h1>
            <h2>Your past reservations:</h2>
            {pastBookings.map((el, i) => <div key={i} className="booking">
                <p>{el.hotel.name}, {el.hotel.address}</p>
                <p>{el.room.roomtype.name} room | Size: {el.room.roomtype.size} | Capacity: {el.room.roomtype.capacity}</p>
                <p>Check in: {el.checkin.substring(0, 10)}</p>
                <p>Check out: {el.checkout.substring(0, 10)}</p><br/>
            </div>)}
            <h2>Your upcoming reservations:</h2>
            {upcomingBookings.map((el, i) => <div key={i} className="booking">
                <p>{el.hotel.name}, {el.hotel.address}</p>
                <p>{el.room.roomtype.name} room | Size: {el.room.roomtype.size} | Capacity: {el.room.roomtype.capacity}</p>
                <p>Check in: {el.checkin.substring(0, 10)}</p>
                <p>Check out: {el.checkout.substring(0, 10)}</p><br/>
                <button onClick={() => this.onCancel(i)}>Cancel booking</button>
            </div>)}
        </div>
    }
}
export default Profile;