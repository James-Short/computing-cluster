
export function adminHandler(data, devices, setDevices){
    console.log('admin: ', data)
    if(data.type === 'update'){
        if(data.target === 'all')
            setDevices(data.data)
        else if(data.target === 'new')
            setDevices(prev => [...prev, data.data])
        else if(data.action === 'remove'){
            console.log('action remove');
            const currentDevices = devices.current;
            console.log('devices:', currentDevices);
            console.log('target:', data.target);
            const index = currentDevices.findIndex(d => d.ip === data.target);
            if (index !== -1) {
                console.log('found');
                setDevices(currentDevices.filter((_, i) => i !== index));
            }
        }
    }
    
}

