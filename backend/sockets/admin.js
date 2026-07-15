
export const devices = []
export let adminSocket = undefined;
const messageQueue = [];


export function adminRouter(ws, message){
    if(message.type === 'device'){
        if(message.action === 'get'){
            getDevices(ws);
        }
    }
    else if(message.type === 'task'){
        if(message.action === 'assign'){
            assignTask(ws, message.target, message.task);
        }
        if(message.action === 'cancel'){
            cancelTask(ws, message.target)
        }
    }
}

export function setAdminSocket(value){
    adminSocket = value;
    while(messageQueue.length > 0){
        const message = messageQueue.pop();
        messageAdmin(message, true);
    }
}

export function getAdminSocket(){
    return adminSocket;
}

export function messageAdmin(message, queueIfNeeded=false){
    if(adminSocket){
        adminSocket.send(JSON.stringify(message));
    }
    else if(queueIfNeeded){
        messageQueue.push(message);
    }
}

function getDevices(ws){
    const returnDevices = [];
    let device;
    for(device of devices){
        returnDevices.push({ ip: device.ip, status: device.status });
    }
    messageAdmin({ type: 'update', target: 'all', data: returnDevices }, false);
}

export function addDevice(deviceSocket, deviceIP){
    if(devices.findIndex(d => d.ip === deviceIP) === -1){
        devices.push({ ip: deviceIP, status: 'open', socket: deviceSocket });
        messageAdmin({ type: 'update', target: 'new', data: { ip: deviceIP, status: 'open' } }, false);
    }
    else{
        deviceSocket.send(JSON.stringify({ type: 'error', data: "This device's IP is already connected." }));
    }
}

export function removeDevice(deviceSocket){
    let deviceIndex = devices.findIndex(d => d.socket === deviceSocket);
    if(deviceIndex != -1){
        const removedIP = devices[deviceIndex];
        devices.splice(deviceIndex, 1);
        messageAdmin({ type: 'update', target: removedIP, action: 'remove' }, false);
    }
}

export function updateStatus(deviceSocket, curStatus){
    let deviceIndex = devices.findIndex(d => d.socket === deviceSocket);
    if(deviceIndex != -1){
        devices[deviceIndex] = { ...devices[deviceIndex], status: curStatus };
        messageAdmin({ type: 'update', target: devices[deviceIndex].ip, status: curStatus }, false);
    }

    
}

export function sendResult(deviceSocket, result, isError = false){
    let deviceIndex = devices.findIndex(d => d.socket === deviceSocket);
    if(deviceIndex != -1){
        if(isError){
            messageAdmin({ type: 'update', target: devices[deviceIndex].ip, status: 'error', data: result }, true);
        }
        else{
            messageAdmin({ type: 'update', target: devices[deviceIndex].ip, status: 'complete', data: result }, true);
        }
    }
}

function assignTask(ws, targetIP, task){
    let deviceIndex = devices.findIndex(d => d.ip === targetIP);
    if(deviceIndex != -1){
        const targetSocket = devices[deviceIndex].socket;
        targetSocket.send(JSON.stringify({ type: 'task', action: 'assign', task: task }));
    }
    else{
        messageAdmin({ type: 'error', data: 'Target device was not found.' }, false);
    }
}

function cancelTask(ws, targetIP){
    let deviceIndex = devices.findIndex(d => d.socket === deviceSocket);
    let targetSocket = undefined;
    let targetIsBusy = false;
    let device;
    devices.forEach((device) => {
        if(device.ip === targetIP){
            targetSocket = device.socket;
            if(device.status === 'active'){
                targetIsBusy = true;
            }
        }
    });
    if(deviceIndex != -1){
        if(devices[deviceIndex].status === 'active'){
            const targetSocket = devices[deviceIndex].socket;
            targetSocket.send(JSON.stringify({ type: 'task', action: 'cancel' }));
        }
        else{
            messageAdmin({ type: 'error', data: 'Target device does not currently have a task to cancel.' }, false);
        }
    }
    else{
        messageAdmin({ type: 'error', data: 'Target device not found' }, false);
    }
}