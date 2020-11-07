import React from 'react';
import { getFromStorage } from '../../utils/storage';
import './Home.css';
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            city: '',
            roomTypes: [],
            roomTypeID: -1,
            from: '',
            to: '',
            hotelID: -1,
            message: '',
            error: ''
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
            return;
        }
        fetch(`http://localhost:8080/api/hotel/about?Id=${id}`, { headers: { 'Content-type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
            .then(res => res.json())
            .then(json => {
                this.setState({
                    roomTypes: json,
                    hotelID: id
                });
            });
    }
    onChoose(i) {
        this.setState({ roomTypeID: i });
    }
    onChooseDates() {
        const { from,
            to,
            hotelID,
            roomTypeID } = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token)
            return;
        fetch('http://localhost:8080/api/room/book', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': 'X-Auth',
                'Authorization': `Bearer ${obj.token}`
            },
            body: JSON.stringify({
                from,
                to,
                hotelId: hotelID,
                roomId: roomTypeID
            })
        }).then(res => res.json())
            .then(json => {
                this.setState({ message: json.message });
            });
    }
    render() {
        const { roomTypes,
            roomTypeID,
            city,
            from,
            to,
            message,
            error } = this.state;
        if (message) {
            return <div className="home">
                <h1>Room successfully booked!</h1>
            </div>;
        }
        if (roomTypes.length === 0) {
            return <div className="home">
                <h1>Explore hotels</h1>
                {error ? (<p>{error}</p>) : null}
                <label>Where are you going?</label><br />
                <input value={city} onChange={this.onTexboxChangeCity}></input>
                <button onClick={this.onEnterCity}>Enter</button>
            </div>
        }
        if (roomTypeID === -1) {
            return <div className="home">
                <h1>Choose room type</h1>
                {roomTypes.map((el, i) => <div key={i}>
                    <p>{el.name}</p>
                    <p>Size (for how many people): {el.size}</p>
                    <p>Capacity (square meters): {el.capacity}</p>
                    <button onClick={() => this.onChoose(i + 1)}>Choose</button>
                </div>)}
            </div>
        }

        return <div className="home">
            <h1>Choose check-in and check-out dates</h1>
            {error ? (<p>{error}</p>) : null}
            <label>Check-in date</label><br />
            <input value={from} onChange={this.onTexboxChangeFrom}></input><br />
            <label>Check-out date</label><br />
            <input value={to} onChange={this.onTexboxChangeTo}></input><br />
            <button onClick={this.onChooseDates}>Choose</button>
        </div>
    }
}

export default Home;