import './DeviceMenu.css';
import { useState } from 'react';

function DeviceMenu({ setVisibility, sendMessage, deviceIP }){
    const [taskInput, setTaskInput] = useState("");

    function submitTask(){
        sendMessage({ type: "task", action: "assign", target: deviceIP, task: taskInput });
    }

    return(
        <div className='device-menu-container' >
            <div className='device-menu'>
                <button className='device-menu-close-button' onClick={() => setVisibility(false)}>X</button>
                <h1 className='device-menu-ip-header'>{deviceIP}</h1>
                <textarea name="" id="" className='device-menu-task-input' onChange={(e) => setTaskInput(e.target.value)} value={taskInput} spellCheck="false"></textarea>
                <button className='device-menu-task-assign-button' title='test' onClick={() => submitTask()}>Assign Task</button>
            </div>
        </div>
    );
}

export default DeviceMenu;