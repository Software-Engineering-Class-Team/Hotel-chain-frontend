import React from 'react';
import { getFromStorage } from '../../utils/storage';
import './Guest.css';
import ReservationInfo from '../ReservationInfo/ReservationInfo';
class Guest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(props.match.params.id),
            username: props.location.state.username,
            reservations: [],
            reservationIds: [],
            changeState: [],
            newCheckIn: '',
            newCheckOut: ''
        };
        this.onTexboxChangeNewCheckIn = this.onTexboxChangeNewCheckIn.bind(this);
        this.onTexboxChangeNewCheckOut = this.onTexboxChangeNewCheckOut.bind(this);
    }
    async fetchReservations() {
        const { id } = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\'t exist');
            return;
        }
        const res = await fetch(`/api/clerkdesk/getActiveReservationsForUser?Id=${id}`, {
            headers: { 'Authorization': `Bearer ${obj.token}` }
        });
        const reservationIds = await res.json();
        const reservations = [];
        for (const reservationId of reservationIds) {
            const res = await fetch(`/api/bookings/get?Id=${reservationId}`);
            const json = await res.json();
            reservations.push(json);
        }
        this.setState({
            reservations,
            reservationIds,
            changeState: new Array(reservations.length).fill(false)
        });
    }
    componentDidMount() {
        this.fetchReservations();
    }
    async onDelete(i) {
        const { reservationIds } = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\t exist');
            return;
        }
        const res = await fetch(`/api/bookings/delete`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${obj.token}`
            },
            body: JSON.stringify({ Id: reservationIds[i] })
        });
        const json = await res.json();
        if (json.message.startsWith('T'))
            this.fetchReservations();
        else
            console.log('err');
    }
    onChange(i) {
        const { changeState } = this.state;
        const val = changeState[i];
        changeState.fill(false);
        changeState[i] = !val;
        this.setState({
            changeState,
            newCheckIn: '',
            newCheckOut: ''
        });
    }
    onTexboxChangeNewCheckOut(event) {
        this.setState({ newCheckOut: event.target.value });
    }
    onTexboxChangeNewCheckIn(event) {
        this.setState({ newCheckIn: event.target.value });
    }
    async onSubmit(i) {
        const {
            newCheckIn,
            newCheckOut,
            reservationIds,
            reservations
        } = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\'t exist');
            return;
        }
        console.log(reservationIds[i])
        const res = await fetch(`/api/bookings/editBooking`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${obj.token}`
            },
            body: JSON.stringify({
                reservationId: reservationIds[i],
                from: newCheckIn,
                to: newCheckOut,
                roomTypeId: reservations[i].roomType.id
            })
        });
        const json = await res.json();
        console.log(json.message)
        if(json.message.startsWith('succesfully'))
            this.fetchReservations();
        else
            console.log('Something went wrong here');
    }
    render() {
        const {
            username,
            reservations,
            changeState,
            newCheckIn,
            newCheckOut
        } = this.state;
        return <div className="guest">
            <h1>Bookings of {username}</h1>
            {reservations.map((reservation, i) => <div key={i} className="guest-el">
                <ReservationInfo reservation={reservation} />
                <button onClick={() => this.onDelete(i)}>Delete</button>
                <button onClick={() => this.onChange(i)}>Change</button><br />
                {changeState[i] ? <div>
                    <label>New check-in date</label><br />
                    <input value={newCheckIn} onChange={this.onTexboxChangeNewCheckIn} ></input><br />
                    <label>New check-out date</label><br />
                    <input value={newCheckOut} onChange={this.onTexboxChangeNewCheckOut} ></input><br />
                    <button onClick={() => this.onSubmit(i)}>Submit</button>
                </div> : null}
            </div>)}
        </div>;
    }
}
export default Guest;