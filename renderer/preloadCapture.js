const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('tested', 
    {
        // testing:(callback)=>{callback('Testing...')},
        something: (callback)=>{
            ipcRenderer.on('apikey',(event,message)=>{callback(message)});
        },
    }
);