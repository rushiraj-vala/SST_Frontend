// const axios = require('axios');
// import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('launchWindow',
{
    launchCaptureWindow:()=>ipcRenderer.send('launch-capture-window'),

    launchGalleryWindow: ()=>ipcRenderer.send('launch-gallery-window'),

    launchUploadWindow: ()=>ipcRenderer.invoke('get-Image-from-drive'),

    fetchData: async()=>{
            const response = await ipcRenderer.invoke('fetch-data');
            if(response){
                return JSON.parse(response);
            }else{
                return {'data':'error'};
            }
            // console.log(JSON.stringify(data));
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

})