import './DeviceCard.css';

function DeviceCard({ ip, busy }){
    return(
        <div className="device-card">
            <h1>{ip}</h1>
            <h3>{busy ? 'Busy' : 'Open'}</h3>
        </div>
    )
}

export default DeviceCard;