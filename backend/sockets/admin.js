
export const devices = []
export let adminSocket = undefined;


export function adminRouter(ws, message){
    console.log('reached admin router')
    if(message.type == 'device'){
        if(message.action == 'get'){
            getDevices(ws);
        }
    }
    else if(message.type == 'task'){
        if(message.action == 'assign'){
            console.log("Got this 1: ", message)
            assignTask(ws, message.target, message.task);
        }
    }
}

export function setAdminSocket(value){
    adminSocket = value;
}

export function getAdminSocket(){
    return adminSocket;
}

export function messageAdmin(message){
    console.log('reached messageAdmin')
    if(adminSocket)
        adminSocket.send(JSON.stringify(message));
}

function getDevices(ws){
    const returnDevices = [];
    let device;
    for(device of devices){
        returnDevices.push({ ip: device.ip, status: device.status });
    }
    ws.send(JSON.stringify({ type: 'update', target: 'all', data: returnDevices }))
}

export function addDevice(deviceSocket, deviceIP){
    devices.push({ ip: deviceIP, status: 'open', socket: deviceSocket })
    messageAdmin({ type: 'update', target: 'new', data: { ip: deviceIP, status: 'open' } });
}

export function removeDevice(deviceSocket){
    let removedIP;
    let deviceIndex = 0;
    while(deviceIndex < devices.length){
        if(devices[deviceIndex].socket === deviceSocket){
            removedIP = devices[deviceIndex].ip;
            break;
        }
        deviceIndex++;
    }
    devices.splice(deviceIndex, 1);
    messageAdmin({ type: 'update', target: removedIP, action: 'remove' });
}

export function updateStatus(deviceSocket, curStatus){
    let deviceIndex = 0;
    while(deviceIndex < devices.length){
        if(devices[deviceIndex].socket === deviceSocket){
            devices[deviceIndex] = { ...devices[deviceIndex], status: curStatus };
            return;
        }
        deviceIndex++;
    };
}

export function sendResult(deviceSocket, result){
    let deviceIP;
    let deviceIndex = 0;
    while(deviceIndex < devices.length){
        if(devices[deviceIndex].socket === deviceSocket){
            deviceIP = devices[deviceIndex].ip;
            break;
        }
        deviceIndex++;
    }
    if(deviceIP){
        messageAdmin({ type: "update", target: deviceIP, status: "complete", data: result });
    }

    
}

function assignTask(ws, targetIP, task){
    console.log("Got this: ", targetIP)
    let targetSocket = undefined;
    let device;
    devices.forEach((device) => {
        if(device.ip === targetIP){
            targetSocket = device.socket;
        }
    });
    if(targetSocket){
        targetSocket.send(JSON.stringify({ type: 'task', action: 'assign', task: task }));
    }
    else{
        ws.send(JSON.stringify({ type: "error", data: "Target device was not found." }));
    }
}

function cancelTask(ws, targetIP, task){
    let targetSocket = undefined;
    let targetIsBusy = false;
    let device;
    devices.forEach((device) => {
        if(device.ip === targetIP){
            targetSocket = device.socket;
            if(device.status === "busy"){
                targetIsBusy = true;
            }
        }
    });
    if(targetSocket){
        if(targetIsBusy){
            targetSocket.send(JSON.stringify({ type: 'task', action: 'cancel' }));
        }
        else{
            ws.send(JSON.stringify({ type: "error", data: "Target device does not currently have a task to cancel." }));
        }
    }
    else{
        ws.send(JSON.stringify({ type: "error", data: "Target device not found" }));
    }
}