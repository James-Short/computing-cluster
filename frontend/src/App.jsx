import './App.css'

import { useEffect, useRef, useState } from 'react';
import DeviceCard from './components/DeviceCard/DeviceCard';

function App() {
  const ws = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket(`ws://${window.location.hostname}:8080`);
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(data)
      if(data.type == 'connected'){
        if(data.isAdmin == true){
          setIsAdmin(true);
        }
      }
      else if(data.type == 'update'){
        if(data.target == 'all'){
          console.log('1')
          setDevices(data.data);
        }
        else if(data.target === 'new'){
          console.log('2')
          setDevices(prev => [...prev, data.data])
        }
      }
      console.log(data.type, data.target)
    }

    ws.current.onopen = () => {
      console.log('Successfully connected');
      ws.current.send(JSON.stringify({ type: 'device', action: 'get' }));
    }

  }, [])

  function sendTask(ip){
    ws.current.send(JSON.stringify({ type: "task", action: "assign", targetIP: ip, task: 'stuff' }));
  }

  return(
    <>
      {devices.map(({ip, status}, index) => (
        <DeviceCard key={index} ip={ip} busy={false} onClick={() => sendTask(ip)}/>
      ))}
    </>
  );
}

export default App;
