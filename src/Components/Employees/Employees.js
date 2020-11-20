import React from 'react';
import { getFromStorage } from '../../utils/storage';
import { Link } from 'react-router-dom';
class Employees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            employees: []
        };
    }
    async componentDidMount() {
        const obj = getFromStorage('the_main_app');
        if (!obj || !obj.token) {
            console.log('Token doesn\'t exist');
            return;
        }
        const res = await fetch('/api/employee/getAll?hotelId=1', {
            headers: { 'Authorization': `Bearer ${obj.token}` }
        });
        const json = await res.json();
        this.setState({
            employees: json,
            isLoading: false
        });
    }
    render() {
        const {
            isLoading,
            employees
        } = this.state;
        return <div className="desk">
            <h1>List of employees</h1>
            {isLoading ?
                <h2>Loading...</h2>
                :
                employees.map((employee, i) => <div key={i} className="guest">
                    <p>{employee.name}</p>
                    <p>Address: {employee.address} | Phone number: {employee.phoneNumber} | Occupation: {employee.occupation}</p>
                    <Link to={{
                        pathname: `/employees/${employee.id}`,
                        state: {
                            schedule: employee.schedules,
                            name: employee.name,
                            len: employee.schedules.length
                        }
                    }}><button>See schedule</button></Link>
                </div>)}
        </div>
    }
}

export default Employees;