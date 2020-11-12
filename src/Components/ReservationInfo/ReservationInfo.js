import React from 'react';
import './ReservationInfo.css';
class ReservationInfo extends React.Component {
    render() {
        const { reservation } = this.props;
        return <div className="reservation-info">
            <p>{reservation.hotel.name}, {reservation.hotel.address}</p>
            <p>{reservation.roomType.name} room | Size: {reservation.roomType.size} | Capacity: {reservation.roomType.capacity}</p>
            <p>Check in: {reservation.checkin.substring(0, 10)}</p>
            <p>Check out: {reservation.checkout.substring(0, 10)}</p><br />
        </div>;
    }
}
export default ReservationInfo;