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
  const [menuVisible, setMenuVisible] = useState(false);
  const devicesRef = useRef(devices);

  useEffect(() => { devicesRef.current = devices; }, [devices]);

  useEffect(() => {
    ws.current = new WebSocket(`ws://${window.location.hostname}:8080`);
    if(window.location.hostname == 'localhost'){
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

  return(
    <>
      {devices.map(({ip, status}, index) => (
        <DeviceCard key={index} ip={ip} busy={false} onClick={() => sendTask(ip)}/>
      ))}
      {menuVisible ? <DeviceMenu setMenuVisible={setMenuVisible}/> : <></>}
      <DeviceCompleteMenu/>
    </>
  );
}

export default App;
