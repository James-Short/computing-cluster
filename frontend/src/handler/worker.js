
export function workerHandler(data, sendMessage){
    console.log('worker: ', data)
    if(data.type == 'task'){
        if(data.action == 'assign'){
            sendMessage({ type: 'task', status: 'accepted' });
            const blobCode = `postMessage((function() { ${data.task} })());`
            const blob = new Blob([blobCode], { type: 'application/javascript' });
            const ww = new Worker(URL.createObjectURL(blob));
            
            ww.onmessage = (e) => {
                console.log(e.data)
            }

        }
    }
}