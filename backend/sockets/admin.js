
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
            assignTask(ws, message.targetIP, message.task);
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
    console.log(removedIP)
    devices.splice(deviceIndex, 1);
    messageAdmin({ type: 'update', target: removedIP, action: 'remove' });
}

function assignTask(ws, targetIP, task){
    let targetSocket = undefined;
    let device;
    devices.forEach((device) => {
        console.log(device.ip, targetIP)
        if(device.ip === targetIP){
            targetSocket = device.socket;
        }
    })
    if(targetSocket)
        targetSocket.send(JSON.stringify({ type: 'task', action: 'assign', task: task }));
}