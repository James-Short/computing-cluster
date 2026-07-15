import './App.css'

import { useEffect, useRef, useState } from 'react';
import DeviceCard from './components/DeviceCard/DeviceCard';
import { adminHandler } from './handler/admin';
import { workerHandler } from './handler/worker';
import DeviceMenu from './components/DeviceMenu/DeviceMenu';
import DeviceCancelMenu from './components/DeviceCancelMenu/DeviceCancelMenu';
import DeviceCompleteMenu from './components/DeviceCompleteMenu/DeviceCompleteMenu';


function App() {
  const ws = useRef(null);
  const isAdmin = useRef(false);
  const [devices, setDevices] = useState([]);
  const [deviceMenuVisible, setDeviceMenuVisible] = useState(false);
  const [cancelMenuVisible, setCancelMenuVisible] = useState(false);
  const [completeMenuVisible, setCompleteMenuVisible] = useState(false);
  const [curIP, setCurIP] = useState("");
  const [curResult, setCurResult] = useState("");
  const devicesRef = useRef(devices);

  useEffect(() => { devicesRef.current = devices; }, [devices]);

  useEffect(() => {
    ws.current = new WebSocket(`ws://${window.location.hostname}:8080`);
    if(window.location.hostname === 'localhost'){
      isAdmin.current = true;
    }
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if(isAdmin.current){
        adminHandler(data, devicesRef, setDevices, sendMessage);
      }
      else{
        workerHandler(data, sendMessage);
      }
    }

    ws.current.onopen = () => {
      console.log('Successfully connected');
      ws.current.send(JSON.stringify({ type: 'device', action: 'get' }));
    }

  }, [])

  function sendMessage(message){
    console.log('reached send message', message);
    ws.current.send(JSON.stringify(message));
  }

  function sendTask(ip){
    ws.current.send(JSON.stringify({ type: "task", action: "assign", targetIP: ip, task: 'return 2 + 2 + 2;' }));
  }

  function setDeviceOpen(deviceIP){
    const currentDevices = devicesRef.current;
    const index = currentDevices.findIndex(d => d.ip === deviceIP);
    const updatedDevice = {...currentDevices[index], status: "open" }
    const newDevices = [...currentDevices];
    newDevices[index] = updatedDevice;
    setDevices(newDevices)
  }

  return(
    <>
      {devices.map(({ip, status, result}, index) => (
        <DeviceCard key={index} ip={ip} status={status} result={result} onClick={() => { setCurIP(ip); setCurResult(result); (status == "open") ? setDeviceMenuVisible(true) : (status == "busy") ? setCancelMenuVisible(true) : ( status == "complete" || status == "error") ? setCompleteMenuVisible(true): null;  }}/>
      ))}
      {deviceMenuVisible ? <DeviceMenu setVisibility={setDeviceMenuVisible} sendMessage={sendMessage} deviceIP={curIP}/> : <></>}
      {completeMenuVisible ? <DeviceCompleteMenu setVisibility={setCompleteMenuVisible} sendMessage={sendMessage} deviceIP={curIP} result={curResult} setDeviceOpen={setDeviceOpen}/> : <></>}
      {cancelMenuVisible ? <DeviceCancelMenu setVisibility={setCancelMenuVisible} sendMessage={sendMessage} deviceIP={curIP}/> : <></>}
    </>
    );
  
}

export default App;
