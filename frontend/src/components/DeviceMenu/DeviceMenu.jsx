import './DeviceMenu.css';

function DeviceMenu(){
    return(
        <div className='device-menu'>
            <button className='device-menu-close-button'>X</button>
            <h1 className='device-menu-ip-header'>192.168.1.161</h1>
            <textarea name="" id="" className='device-menu-task-input'></textarea>
            <button className='device-menu-task-assign-button'>Assign Task</button>
        </div>
    );
}

export default DeviceMenu;