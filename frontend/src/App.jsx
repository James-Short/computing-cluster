import './App.css'

import { useEffect, useRef, useState } from 'react';
import DeviceCard from './components/DeviceCard/DeviceCard';

function App() {
  const ws = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(`ws://${window.location.hostname}:8080`);
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if(data.type == 'connected')
        setIsAdmin(true);
      console.log(data)
    }

    ws.current.onopen = () => {
      console.log('Successfully connected');
      ws.current.send(JSON.stringify({ type: 'device', action: 'get' }));
    }

  }, [])
  return(
    <DeviceCard ip="192.168.1.1" busy={false} />
  );
}

export default App
