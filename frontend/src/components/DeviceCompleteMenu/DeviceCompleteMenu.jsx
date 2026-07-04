import './DeviceCompleteMenu.css';

function DeviceCompleteMenu({ setVisibility }){
    return(
        <div className='device-complete-menu-container'>
            <div className='device-complete-menu'>
                <button className='device-complete-menu-close-button' onClick={() => setVisibility(false)}>X</button>
                <h1 className='device-complete-menu-header'>192.168.1.161</h1>
                <h3 className='device-complete-menu-result-header'>Results</h3>
                <p className='device-complete-menu-result' name='device-complete-menu-result'>TTTTTTTTTTTTTT</p>
                <button className='device-complete-menu-button' onClick={() => setVisibility(false)}>OK</button>
            </div>
        </div>
    );
}

export default DeviceCompleteMenu;