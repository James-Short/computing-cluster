
export const devices = []
export let adminSocket = undefined;


export function adminRouter(ws, message){
    console.log('reached admin router')
    if(message.type == 'device'){
        if(message.action == 'get'){
            getDevices(ws);
        }
    }
}

export function setAdminSocket(value){
    adminSocket = value;
}

export function getAdminSocket(){
    return adminSocket;
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
    if(adminSocket != undefined)
        adminSocket.send(JSON.stringify({ type: 'update', target: 'new', data: { ip: deviceIP, status: 'open' } }));
}


function assignTask(){

}