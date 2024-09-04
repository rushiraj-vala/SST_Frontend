const { ipcRenderer } = require("electron");
const { contextBridge } = require("electron/renderer");

contextBridge.exposeInMainWorld('bridgeDatabase', {

    getImages:async()=> 
    {
      const jsonData = await ipcRenderer.invoke('get-Images');
      if (jsonData){
         return JSON.parse(jsonData);
      }else{
         return {'Error':'ipcMain sent NULL:GET IMAGEs'};
      }
    },

    getImageByName: async(imageName)=>{
      const jsonData = await ipcRenderer.invoke('get-Image-By-Name',imageName);
         if(jsonData){
            return JSON.parse(jsonData);
         }else{
            return {'Error':'ipcMain sent NULL: getImageByName'}
         }
    },

    reloadImage: async(imageName)=>{
      const jsonData = await ipcRenderer.invoke('get-Image-By-Name',imageName);
      if(jsonData){
         return JSON.parse(jsonData);
      }else{
         return {'Error':'ipcMain sent NULL: Reload Images'};
      }
    },

    trashMultipleImages: async(imageNameList,type)=>{
      const jsonInput = JSON.stringify(imageNameList);
      const jsonData = await ipcRenderer.send('trash-Multiple-Images',imageNameList,type);
      if(jsonData){
         if(jsonData=='Server-Success'){
            return true;
         }else{
            return false;
         }
      }else{
         return {'Error':'ipcMain sent NULL: trash Multiple Image'};
      }
    },    

    captureNew: async()=>ipcRenderer.send('capture-New'),

    checkStatus: async()=>{
      const response = await ipcRenderer.invoke('check-status')
      console.log(response);
      if (response){
         return true;
      }else{
         return false;
      }
    },

    uploadImage: async (dataURL)=>{

      const fileName = getDateTimeString();
      const serialFileName = JSON.stringify(fileName);
      console.log('You were here');
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