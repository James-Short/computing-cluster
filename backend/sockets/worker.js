import { addDevice, updateStatus, sendResult } from './admin.js';

export function workerRouter(ws, message){
    console.log('reached worker router : ', message);
    if(message.type == 'task'){
        handleStatus(ws, message)
    }
}

export function joinCluster(ws, reqIP){
    addDevice(ws, reqIP);
}

function handleStatus(ws, message){
    const curStatus = message.status;

    if(curStatus === 'active'){
        updateStatus(ws, curStatus);
    }
    else if(curStatus === 'complete'){
        sendResult(ws, message.data);
    }
    else if(curStatus === 'cancelled'){
        updateStatus(ws, 'open');
    }
    else if(curStatus === 'error'){
        sendResult(ws, message.data, true);
    }
}