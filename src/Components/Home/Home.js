import React from 'react';
import { getFromStorage } from '../../utils/storage';
import './Home.css';
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            city: '',
            roomTypes: [],
            from: '',
            to: '',
            hotelID: -1,
            message: '',
            error: '',
            advisory: '',
            selectedCity: false
        };
        this.onTexboxChangeCity = this.onTexboxChangeCity.bind(this);
        this.onEnterCity = this.onEnterCity.bind(this);
        this.onChoose = this.onChoose.bind(this);
        this.onTexboxChangeFrom = this.onTexboxChangeFrom.bind(this);
        this.onTexboxChangeTo = this.onTexboxChangeTo.bind(this);
        this.onChooseDates = this.onChooseDates.bind(this);
    }
    cities = [
        'Amsterdam',
        'Mountain City'
    ];
    onTexboxChangeCity(event) {
        this.setState({ city: event.target.value });
    }
    onTexboxChangeFrom(event) {
        this.setState({ from: event.target.value });
    }
    onTexboxChangeTo(event) {
        this.setState({ to: event.target.value });
    }
    onEnterCity() {
        const { city } = this.state;
        const id = 1 + this.cities.indexOf(city);
        if (id === 0) {
            this.setState({ error: "No such city!" });
            return;
        }
        this.setState({
            selectedCity: true,
            error: '',
            hotelID: id
        });
    }
    async onChoose(id) {
        const { from,
            to,
            hotelID } = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\'t exist');
            return;
        }
        const res = await fetch('/api/bookings/reserve', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${obj.token}`
            },
            body: JSON.stringify({
                from,
                to,
                hotelId: hotelID,
                roomId: id
            })
        });
        const json = await res.json();
        this.setState({ message: json.message });
    }
    async onChooseDates() {
        const { from,
            to,
            hotelID } = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\'t exist');
            return;
        }
        const res = await fetch('/api/bookings/availableRoomTypes', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                from,
                to,
                hotelId: hotelID
            })
        });
        const json = await res.json();
        if (!json.error)
            this.setState({ roomTypes: json });
        else
            console.log('Something went wrong');
    }
    async componentDidMount() {
        const res = await fetch(`/api/season/getadvisory`);
        const json = await res.json();
        if (json.message)
            this.setState({ advisory: json.message });
        else
            console.log('Something went wrong');
    }
    render() {
        const { roomTypes,
            city,
            from,
            to,
            message,
            advisory,
            selectedCity,
            error } = this.state;
        if (message)
            return <div className="home">
                <h1>Room successfully booked!</h1>
            </div>;
        if (!selectedCity)
            return <div className="home">
                <h1>Explore hotels</h1>
                <label>Where are you going?</label><br />
                {error ? (<p style={{ 'color': "red" }}>{error}</p>) : null}
                <input value={city} onChange={this.onTexboxChangeCity}></input>
                <button onClick={this.onEnterCity}>Enter</button><br />
                {advisory}
            </div>;
        if (roomTypes.length === 0)
            return <div className="home">
                <h1>Choose check-in and check-out dates</h1>
                {error ? (<p>{error}</p>) : null}
                <label>Check-in date</label><br />
                <input value={from} onChange={this.onTexboxChangeFrom}></input><br />
                <label>Check-out date</label><br />
                <input value={to} onChange={this.onTexboxChangeTo}></input><br />
                <button onClick={this.onChooseDates}>Choose</button>
            </div>
        return <div className="home">
            <h1>Choose room type</h1>
            {roomTypes.map(el => <div key={el.id}>
                <p>{el.name}</p>
                <p>Size (for how many people): {el.size}</p>
                <p>Capacity (square meters): {el.capacity}</p>
                <p>Price for a night: {el.price}</p>
                <button onClick={() => this.onChoose(el.id)}>Choose</button>
            </div>)}
        </div>;
    }
}

export default Home;