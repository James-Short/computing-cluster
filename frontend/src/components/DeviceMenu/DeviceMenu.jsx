import './DeviceMenu.css';
import { useState } from 'react';

function DeviceMenu({ setMenuVisible }){
    return(
        <div className='device-menu-container' >
            <div className='device-menu'>
                <button className='device-menu-close-button' onClick={() => setMenuVisible(false)}>X</button>
                <h1 className='device-menu-ip-header'>192.168.1.161</h1>
                <textarea name="" id="" className='device-menu-task-input'></textarea>
                <button className='device-menu-task-assign-button' title='test'>Assign Task</button>
            </div>
        </div>
    );
}

export default DeviceMenu;