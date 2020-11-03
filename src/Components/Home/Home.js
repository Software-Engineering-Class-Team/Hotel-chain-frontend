import React from 'react';
import './Home.css';
class Home extends React.Component {
    render() {
        return (
            <div className="home">
                <h1>Explore hotels</h1>
                <label>Where are you going?</label><br />
                <input></input><br />
                <label>Check-in date</label><br />
                <input></input><br />
                <label>Check-out date</label><br />
                <input></input><br />
                <label>Occupancy</label><br />
                <input></input><br />
                <button>FIND HOTEL</button>
                <h3>Explore cities</h3>
                <div className="images">
                    <div>
                        <img src={require('./an-expanse-of-city.png')} alt="Amsterdam" width="500px" height="350px" />
                        <div>Amsterdam</div>
                    </div>
                    <div>
                        <img src={require('./large-mountains-surround-a-city.png')} alt="Mountain" width="500px" height="350px" />
                        <div>Mountain city</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;