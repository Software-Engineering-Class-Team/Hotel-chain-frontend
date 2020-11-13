import React from 'react';
import './Schedule.css';
import { getFromStorage } from '../../utils/storage';
class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schedule: [],
            name: props.location.state.name,
            changeState: new Array(props.location.state.len).fill(false),
            start: '',
            end: '',
            id: parseInt(props.match.params.id)
        };
        this.onTexboxChangeStart = this.onTexboxChangeStart.bind(this);
        this.onTexboxChangeEnd = this.onTexboxChangeEnd.bind(this);
    }
    onTexboxChangeStart(event) {
        this.setState({ start: event.target.value });
    }
    onTexboxChangeEnd(event) {
        this.setState({ end: event.target.value });
    }
    async fetchSchedule(i) {
        const { id } = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\'t exist');
            return;
        }
        const res = await fetch(`/api/employee/getschedule?employeeId=${id}`, {
            headers: { 'Authorization': `Bearer ${obj.token}` }
        });
        const json = await res.json();
        if (!json.error) {
            if(typeof i !== "undefined")
                this.state.changeState[i] = false;
            console.log(json)
            this.setState({ schedule: json.sort((a, b) => (a.id > b.id) ? 1 : -1) });
        } else
            console.log('Something went wrong');
    }
    componentDidMount() {
        this.fetchSchedule();
    }
    onAdjust(i) {
        const { changeState } = this.state;
        const val = changeState[i];
        changeState.fill(false);
        changeState[i] = !val;
        this.setState({
            changeState,
            start: '',
            end: ''
        });
    }
    async onSubmit(i) {
        const {
            start,
            end,
            schedule
        } = this.state;
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\'t exist');
            return;
        }
        const res = await fetch(`/api/employee/adjustSchedule`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${obj.token}`
            },
            body: JSON.stringify({
                dayOfTheWeek: schedule[i].dayOfTheWeek,
                startTime: start,
                endTime: end,
                id: schedule[i].id
            })
        });
        const json = await res.json();
        if (json.message === 'Schedule and working hours were successfully adjusted')
            this.fetchSchedule(i);
        else
            console.log('Something went wrong');
    }
    render() {
        const {
            name,
            schedule,
            changeState,
            start,
            end
        } = this.state;
        return <div className="guest">
            <h1>Schedule of {name}</h1>
            {schedule.map((el, i) => <div key={i} className="employee-el">
                <p>Day of the week: {el.dayOfTheWeek}</p>
                <p>Start time: {el.startTime} | End time: {el.endTime}</p>
                <button onClick={() => this.onAdjust(i)}>Adjust hours</button><br />
                {changeState[i] ? <div>
                    <label>New start time</label><br />
                    <input value={start} onChange={this.onTexboxChangeStart} ></input><br />
                    <label>New end time</label><br />
                    <input value={end} onChange={this.onTexboxChangeEnd} ></input><br />
                    <button onClick={() => this.onSubmit(i)}>Submit</button>
                </div> : null}
            </div>)}
        </div>;
    }
}

export default Schedule;