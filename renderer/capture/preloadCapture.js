const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('bridgedapi', 
    {
        // testing:(callback)=>{callback('Testing...')},
        grabImage: (callback)=>{            
            ipcRenderer.on('apikey',(event,message)=>{callback(message)});
        },

        launchGallery: ()=>
        {
            ipcRenderer.send('launch-gallery-window');
        },

        sendImageCropped: (data)=>{
            ipcRenderer.send('send-image-backend',data);
        },

        uploadImage: async (dataURL)=>{

            const fileName = getDateTimeString();
            const serialFileName = JSON.stringify(fileName);

            const response = await ipcRenderer.invoke('upload-Image',serialFileName,dataURL);

            if(response) {
                console.log(JSON.parse(response));
                return JSON.parse(response);
            } else {
                console.error('Error : Null value recieved');
                return {'Error':'Null value recieved'};       
            }
        }
    
});


function getDateTimeString(){
    const currentDate = new Date();

    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth()+1).toString().padStart(2,'0');
    const day = currentDate.getDate().toString().padStart(2,'0');
    const hour = currentDate.getHours().toString().padStart(2,'0');
    const minutes = currentDate.getMinutes().toString().padStart(2,'0');
    const seconds = currentDate.getSeconds().toString().padStart(2,'0');

    return year+month+day+'_'+hour+minutes+seconds+'.png'
}