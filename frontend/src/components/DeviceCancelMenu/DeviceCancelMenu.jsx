import './DeviceCancelMenu.css';

function DeviceCancelMenu({ setVisibility, sendMessage, deviceIP }){

    function submitCancel(){
        sendMessage({ type: "task", action: "cancel", target: deviceIP });
        setVisibility(false);
    }

    return(
        <div className='device-cancel-menu-container'>
            <div className='device-cancel-menu'>
                <button className='device-cancel-menu-close-button' onClick={() => setVisibility(false)}>X</button>
                <h1 className='device-cancel-menu-header'>{deviceIP}</h1>
                <h3 className='device-cancel-menu-confirmation'>Cancel task?</h3>
                <button className='device-cancel-menu-button' onClick={() => submitCancel()}>Cancel</button>
            </div>
        </div>
    );
}

export default DeviceCancelMenu;