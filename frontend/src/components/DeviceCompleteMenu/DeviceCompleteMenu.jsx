import './DeviceCompleteMenu.css';

function DeviceCompleteMenu(){
    return(
        <div className='device-complete-menu-container'>
            <div className='device-complete-menu'>
                <h1 className='device-complete-menu-header'>192.168.1.161</h1>
                <h3 className='device-complete-menu-result-header'>Results</h3>
                <p className='device-complete-menu-result' name='device-complete-menu-result'>TTTTTTTTTTTTTT</p>
                <button className='device-complete-menu-button'>OK</button>
            </div>
        </div>
    );
}

export default DeviceCompleteMenu;