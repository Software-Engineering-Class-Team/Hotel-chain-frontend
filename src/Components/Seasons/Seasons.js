import React from 'react';
import { getFromStorage } from '../../utils/storage';
class Seasons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            seasons: [],
            seasonalRate: '',
            from: '',
            to: ''
        };
        this.onTexboxChangeSeasonalRate = this.onTexboxChangeSeasonalRate.bind(this);
        this.onTexboxChangeFrom = this.onTexboxChangeFrom.bind(this);
        this.onTexboxChangeTo = this.onTexboxChangeTo.bind(this);
        this.onCreate = this.onCreate.bind(this);
    }
    onTexboxChangeSeasonalRate(event) {
        this.setState({ seasonalRate: event.target.value });
    }
    onTexboxChangeFrom(event) {
        this.setState({ from: event.target.value });
    }
    onTexboxChangeTo(event) {
        this.setState({ to: event.target.value });
    }
    async fetchSeasons() {
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token || !obj.hotelId) {
            console.log('Token or hotelId doesn\'t exist');
            return;
        }
        const res = await fetch(`/api/season/getSeasonsOfTheHotel?hotelId=${obj.hotelId}`);
        const json = await res.json();
        if (!json.error)
            this.setState({
                seasons: json,
                isLoading: false
            });
        else
            console.log('Something went wrong');
    }
    componentDidMount() {
        this.fetchSeasons();
    }
    async onCancel(id) {
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token || !obj.hotelId) {
            console.log('Token or hotelId doesn\'t exist');
            return;
        }
        const res = await fetch(`/api/season/cancel`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${obj.token}`
            },
            body: JSON.stringify({
                seasonId: id,
                hotelId: obj.hotelId
            })
        });
        const json = await res.json();
        if(!json.error) {
            this.fetchSeasons();
        } else
            console.log('Something went wrong');
    }
    async onCreate() {
        const {
            seasonalRate,
            from,
            to
        } = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token || !obj.hotelId) {
            console.log('Token or hotelId doesn\'t exist');
            return;
        }
        const res = await fetch(`/api/season/create`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${obj.token}`
            },
            body: JSON.stringify({
                seasonalRate: parseInt(seasonalRate),
                startDate: from,
                endDate: to
            })
        });
        const json = await res.json();
        console.log(json)
        if (Number.isInteger(json)) {
            const res1 = await fetch(`/api/season/addSeasonToHotel?hotelId=${obj.hotelId}&seasonId=${json}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${obj.token}`
                }
            });
            const json1 = await res1.json();
            if (!json1.error) {
                this.setState({
                    isLoading: true,
                    from: '',
                    seasonalRate: '',
                    to: ''
                });
                this.fetchSeasons();
            } else
                console.log('Something went wrong');
        } else
            console.log('Something went wrong й');
    }
    render() {
        const {
            isLoading,
            seasons,
            seasonalRate,
            from,
            to
        } = this.state;
        return <div className="desk">
            <h1>Seasonal rates of Hotel 1</h1>
            {isLoading ?
                <h2>Loading...</h2>
                :
                <div>
                    {seasons.map(season => <div key={season.id} className="guest">
                        <p>Seasonal rate: {season.seasonalRate}</p>
                        <p>Start date: {season.startDate.substr(0, 10)} | End date: {season.endDate.substr(0, 10)}</p>
                        <button onClick={() => this.onCancel(season.id)}>Cancel</button>
                    </div>)}
                    <h2>Create seasonal rate</h2>
                    <label>Seasonal rate</label><br />
                    <input value={seasonalRate} onChange={this.onTexboxChangeSeasonalRate} /><br />
                    <label>Start date</label><br />
                    <input value={from} onChange={this.onTexboxChangeFrom} /><br />
                    <label>End date</label><br />
                    <input value={to} onChange={this.onTexboxChangeTo} /><br />
                    <button onClick={this.onCreate}>Create</button>
                </div>}
        </div>
    }
}
export default Seasons;