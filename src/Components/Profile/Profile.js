import React from 'react';
import { getFromStorage } from '../../utils/storage';
import './Profile.css';
import ReservationInfo from '../ReservationInfo/ReservationInfo';
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
    async fetchBookings() {
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\'t exist');
            return;
        }
        const res = await fetch('/api/profile/getallbookings', {
            headers: {
                'Authorization': `Bearer ${obj.token}`
            }
        });
        const json = await res.json();
        if (json["upcoming bookings: "])
            this.setState({
                isLoading: false,
                upcomingBookings: json["upcoming bookings: "],
                pastBookings: json["past reservations: "],
                ids: json["upcoming bookings: "].map(booking => booking.id)
            });
        else
            console.log('Something went wrong');
    }
    componentDidMount() {
        this.fetchBookings();
    }
    async onCancel(i) {
        const { ids } = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\'t exist');
            return;
        }
        const res = await fetch('/api/bookings/delete', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${obj.token}`
            },
            body: JSON.stringify({ Id: ids[i] })
        });
        const json = await res.json();
        if (json.message.startsWith('The reservation with id')) {
            this.state.ids.splice(i);
            this.fetchBookings();
        } else
            console.log('Something went wrong here');
    }
    render() {
        const {
            isLoading,
            upcomingBookings,
            pastBookings
        } = this.state;
        return isLoading ?
            <h3>Loading...</h3>
            :
            <div className="profile">
                <h1>Your reservations</h1>
                <h2>Your past reservations:</h2>
                {pastBookings.map((reservation, i) => <div key={i} className="booking">
                    <ReservationInfo reservation={reservation} />
                </div>)}
                <h2>Your upcoming reservations:</h2>
                {upcomingBookings.map((reservation, i) => <div key={i} className="booking">
                    <ReservationInfo reservation={reservation} />
                    <button onClick={() => this.onCancel(i)}>Cancel booking</button>
                </div>)}
            </div>
    }
}
export default Profile;