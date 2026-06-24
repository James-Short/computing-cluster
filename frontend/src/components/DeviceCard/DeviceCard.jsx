import './DeviceCard.css';

function DeviceCard({ ip, busy, onClick }){
    return(
        <button className="device-card" onClick={onClick}>
            <h1>{ip}</h1>
            <h3>{busy ? 'Busy' : 'Open'}</h3>
        </button>
    )
}

export default DeviceCard;