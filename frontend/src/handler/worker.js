
export function workerHandler(data, sendMessage){
    console.log('worker: ', data)
    let ww;
    let isBusy = false;
    if(data.type === 'task'){
        if(data.action === 'assign'){
            sendMessage({ type: 'task', status: 'accepted' });
            const blobCode = `postMessage((function() { ${data.task} })());`
            const blob = new Blob([blobCode], { type: 'application/javascript' });
            ww = new Worker(URL.createObjectURL(blob));
            isBusy = true;
            sendMessage({ type: "task", status: "active" });
            
            ww.onmessage = (e) => {
                if(e.data.type === 'result'){
                    isBusy = false;
                    sendMessage({ type: "task", status: "complete", data: e.data });
                }
                console.log(e.data)
            }

        }
        if(data.action === 'cancel'){
            if(isBusy){
                ww.terminate();
                isBusy = false;
                sendMessage({ type: "task", status: "cancelled" });
            }
            else{
                sendMessage({ type: error, data: "Target device does not currently have a task to cancel." });
            }
        }
    }
}