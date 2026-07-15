let ww;
let isBusy = false;

export function workerHandler(data, sendMessage){
    console.log('worker: ', data)
    
    if(data.type === 'task'){
        if(data.action === 'assign'){
            sendMessage({ type: 'task', status: 'accepted' });
            const blobCode = `postMessage((function() { ${data.task} })());`
            const blob = new Blob([blobCode], { type: 'application/javascript' });
            ww = new Worker(URL.createObjectURL(blob));
            isBusy = true;
            sendMessage({ type: "task", status: "active" });
            
            ww.onmessage = (e) => {
                isBusy = false;
                sendMessage({ type: "task", status: "complete", data: e.data });
            }
            ww.onerror = (error) => {
                isBusy = false;
                sendMessage({ type: "task", status: "error", data: error.message });
            }

        }
        if(data.action === 'cancel'){
            console.log("Isbusy: ", isBusy);
            if(isBusy){
                ww.terminate();
                isBusy = false;
                sendMessage({ type: "task", status: "cancelled" });
            }
            else{
                sendMessage({ type: "error", data: "Target device does not currently have a task to cancel." });
            }
        }
    }
}