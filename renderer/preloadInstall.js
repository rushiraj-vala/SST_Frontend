const {ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('bridgeApi',{
    getMessage: (callback)=>{
        ipcRenderer.on('console-message',(event,message)=>{callback(message)});
    },
});
