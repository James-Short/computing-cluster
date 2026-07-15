import { WebSocketServer } from 'ws';
import { setAdminSocket, adminRouter, removeDevice } from './sockets/admin.js';
import { workerRouter, joinCluster } from './sockets/worker.js';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws, req) => {
    const reqIP = req.socket.remoteAddress.replace(/^::ffff:/, '');
    const isAdmin = reqIP === '127.0.0.1' || reqIP === '::1';

    if(isAdmin)
        setAdminSocket(ws);
    else
        joinCluster(ws, reqIP);

    ws.send(JSON.stringify({ type: 'connected', isAdmin: isAdmin }));
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(isAdmin)
        if(isAdmin)
            adminRouter(ws, data);
        else
            workerRouter(ws, data, reqIP);
    });

    ws.on('close', () => {
        console.log('device disconnected', isAdmin)
        if(isAdmin){
            setAdminSocket(undefined);
        }
        else{
            removeDevice(ws)
        }
    })
})