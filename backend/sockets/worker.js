import { addDevice } from "./admin.js";

export function workerRouter(ws, message){
    console.log('reached worker router : ', message);
}

export function joinCluster(ws, reqIP){
    addDevice(ws, reqIP);
}