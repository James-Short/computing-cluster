import './DeviceCard.css';

function DeviceCard({ ip, status, onClick }){
    return(
        <button className="device-card" onClick={onClick}>
            <h1>{ip}</h1>
            <h3>{status}</h3>
        </button>
    )
}

export default DeviceCard;