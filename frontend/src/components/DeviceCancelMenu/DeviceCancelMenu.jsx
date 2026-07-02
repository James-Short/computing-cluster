import './DeviceCancelMenu.css';

function DeviceCancelMenu(){
    return(
        <div className='device-cancel-menu-container'>
            <div className='device-cancel-menu'>
                <button className='device-cancel-menu-close-button'>X</button>
                <h1 className='device-cancel-menu-header'>192.168.1.161</h1>
                <h3 className='device-cancel-menu-confirmation'>Cancel task?</h3>
                <button className='device-cancel-menu-button'>Cancel</button>
            </div>
        </div>
    );
}

export default DeviceCancelMenu;