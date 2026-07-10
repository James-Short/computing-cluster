
export function adminHandler(data, devices, setDevices, sendMessage){
    console.log('admin: ', data)
    if(data.type === 'update'){
        if(data.target === 'all')
            setDevices(data.data)
        else if(data.target === 'new'){
            setDevices(prev => [...prev, data.data])
        }
        else if(data.action === 'remove'){
            const currentDevices = devices.current;
            const index = currentDevices.findIndex(d => d.ip === data.target);
            if (index !== -1) {
                setDevices(currentDevices.filter((_, i) => i !== index));
            }
        }
        else if(data.status === 'complete'){
            const currentDevices = devices.current;
            const index = currentDevices.findIndex(d => d.ip === data.target);
            const updatedDevice = {...devices[index], status: "complete" }
        }

    }
    
}

