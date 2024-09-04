const path = require('path');
const { app, BrowserWindow, ipcMain,screen,desktopCapturer, dialog }  = require('electron');
const { types } = require('util');
const { setTimeout } = require('timers');
const { globalShortcut } = require('electron/main');
const { exec, spawn } = require('child_process');
const fs =require('fs').promises;
const axios = require('axios');



let mainWindow;
let captureWindow;
let galleryWindow;
let installWindow;
let backendWindow;
let userData;
let appPath;
let connectionStatus = false;
let apiURL = 'https://sstbackend-production.up.railway.app';
// let apiURL = 'http://127.0.0.1:8765';

appPath = path.dirname(app.getAppPath());
//appPath=app.getAppPath();


let backendPath = path.join(appPath,'./backend');
let dataPath = path.join(appPath,'./backend/data.json');




// The installation window only launched for first time
async function createInstallWindow(){
    installWindow = new BrowserWindow({
        title: 'Installation Window',
        width: 500,
        height: 500,
        // minWidth:320,
        // minHeight:100,
        resizable: false,
        frame:true,
        autoHideMenuBar:true,
        webPreferences: {
            nodeIntegration:true,
            contextIsolation:true,
            sandbox:false,
            enableRemoteModule:true,
            preload:path.join(appPath,'./renderer/preloadInstall.js')
        },
    });

    installWindow.loadFile(path.join(appPath,'./renderer/install.html'));

}

// The main window that will be launched every time 
function  createMainWindow(){
    mainWindow = new BrowserWindow({
        title: 'Smart snipping tool',
        icon:appPath+'/assets/snipping_icon.png',
        width: 320,
        height: 100,
        // minWidth:320,
        // minHeight:100,
        resizable: false,
        frame:true,
        autoHideMenuBar:true,
        webPreferences: {
            nodeIntegration:false,
            contextIsolation:true,
            sandbox:false,
            enableRemoteModule:false,
            preload:path.join(appPath,'./renderer/preload.js')
        },
    });



    mainWindow.loadFile(path.join(appPath,'./renderer/index.html'));


    // mainWindow.removeMenu();

    mainWindow.on('close',()=>{
        globalShortcut.unregister('Escape');
        mainWindow=null;
    })

};

async function createCaptureWindow(window){
     captureWindow = new BrowserWindow({
        parent:window,
        icon:appPath+'/assets/snipping_icon.png',
        frame: false,
        fullscreen:true,
        webPreferences:{
        nodeIntegration:true,
        contextIsolation:true,
        enableRemoteModule:true,
        preload:path.join(appPath,'./renderer/capture/preloadCapture.js')
        }
    });

    captureWindow.loadFile(path.join(appPath,'./renderer/capture/capture.html'));


    const closeWindowShortcut  = globalShortcut.register('Escape',()=>{
        captureWindow.close();
        if(mainWindow){
            mainWindow.restore();
        }
        else if(galleryWindow){
            // galleryWindow.show();
            galleryWindow.restore();
        }
    })

    if(!closeWindowShortcut){
        console.error('There was a problem quitting')
    }

    captureWindow.on('close',()=>{
        globalShortcut.unregister('Escape');
        captureWindow=null;
    })

};

async function createGalleryWindow(window,event){
    galleryWindow = new BrowserWindow({
        parent:window,
        icon:appPath+'/assets/snipping_icon.png',
        frame: true,
        width: 1080,
        height: 720,
        minHeight:360,
        minWidth:540,
        
        autoHideMenuBar:true,
        webPreferences:{
        preload:path.join(appPath,'./renderer/gallery/preloadGallery.js'),
        nodeIntegration:true,
        contextIsolation:true,
        sandbox:false
        }
    });

    galleryWindow.loadFile(path.join(appPath,'./renderer/gallery/gallery.html'));
    
    galleryWindow.maximize();

    galleryWindow.on('close',()=>{
        galleryWindow = null;
    })
};


async function sendImageGrab(){
    const screenShotInfo = await captureScreen();
    const dataURL = screenShotInfo.toDataURL();
    return dataURL;
};

async function readJSON(dataPath){
    try {
        const jsonData = await fs.readFile(dataPath, {encoding:'utf-8'});
        return JSON.parse(jsonData);
    } catch (error) {
        console.log('Error reading file',error);   
    }
};




app.whenReady().then(async ()=>{
    // Read Json file
    userData = await readJSON(dataPath);

    console.log('userData is:',userData);


    setTimeout(()=>{
        createMainWindow();
    },1000);

    app.on('activate',()=>{
        if(BrowserWindow.getAllWindows().length==0){
            createMainWindow();
        }
    })

    app.on('before-quit',()=>{
        // djangoServer.kill();
        // backendWindow.kill();
    })
})

app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin'){
        // backendWindow.kill();
        app.quit();
    }
});

ipcMain.on('launch-capture-window',async(event)=>{
    mainWindow.minimize();
    setTimeout(async()=>{
        await createCaptureWindow(mainWindow);
        dataImage = await sendImageGrab();
        captureWindow.webContents.on('did-finish-load',()=>{
            captureWindow.webContents.send('apikey',dataImage);
        });    
    },1000);

});

ipcMain.on('close-Main-window',async(event)=>{
    if (mainWindow){
        mainWindow.close();
    }
});

ipcMain.on('launch-gallery-window',async(event)=>{
    // console.log('launching gallery window');
    if(!galleryWindow){
        if(captureWindow){
            captureWindow.close();
        }

        mainWindow.minimize();

        setTimeout(async()=>{
            await createGalleryWindow(mainWindow,event);
        },1000);
        
    }else{
        // galleryWindow.show();
        if(captureWindow){
            captureWindow.close();
        }

        mainWindow.minimize();

        galleryWindow.restore();

    }
});

ipcMain.on('capture-New',async(event)=>{
    if(galleryWindow){
        galleryWindow.minimize();
    }

    setTimeout(async() => {
        // await createCaptureWindow(mainWindow);
        // dataImage = await sendImageGrab();
        
        // captureWindow.webContents.on('did-finish-load',()=>{
        //     captureWindow.webContents.send('apikey',dataImage);
        // });
        mainWindow.restore();
    }, 1000);

});

ipcMain.handle('upload-Image',async(event,stringFileName,dataURL)=>{    
    const formData = new FormData();
    const fileName = JSON.parse(stringFileName);
    const blob = await dataURLToBlob(dataURL);    
    const config = {
        headers: {
            'Content-Type':'multipart/form-data',
        } 
    };

    formData.append('name',fileName);
    formData.append('image',blob,fileName);

    try {
        const response = await axios.post(`${apiURL}/upload/`,formData,config);                

        return JSON.stringify(response.data);

    } catch (error) {
        console.error('Error uploading image:',error);
        return {error:'Error uploading image'};       
    }
});

ipcMain.handle('check-status',async()=>{
    try {
        const response = await axios.post(`${apiURL}/`);                

        if(response.status==200){
            return true;
        }else{
            return false;
        }

    } catch (error) {
        // console.error('Error uploading image:',error);
        // return {error:'Error uploading image'};
        return false;
    }
});

ipcMain.handle('fetch-data',async()=>{
    try {
        const response = await axios.get(`${apiURL}/`);

        return JSON.stringify(response.data);
    } catch (error) {
        console.error('Error fetching the data:',error);
        return null;
    }
});

ipcMain.handle('get-Images',async()=>{
    try {
          const response = await axios.get(`${apiURL}/imageList`);
          return JSON.stringify(response.data);
       } catch (error) {
          return JSON.stringify(error);            
       }
});

ipcMain.handle('get-Image-By-Name', async(event,imageName)=>{
    try {
        const formData = new FormData();

        const config = {
           headers: {
              'Content-Type':'multipart/form-data',
           }
        };
        const response = await axios.get(`${apiURL}/imageList/?name=${imageName}`);
        // console.log(response.data);
        return JSON.stringify(response.data);

    } catch (error) {

        console.log('Problem connecting to server:');
        console.error(error);
        return {'Error':error}
     }      
})


ipcMain.handle('reload-Images',async()=>{
    try {
        // const axios = await import('axios');         
        const response = await axios.get(`${apiURL}/reRecognize/?name=${imageName}`);        
        // console.log('recieved data',response.data);
        return JSON.stringify(response.data);
     } catch (error) {
        console.log('Failed to get from server: reload images');
        console.error(error);
        return null;    
     }
    }
)

ipcMain.on('trash-Multiple-Images',async(event,imageNameList,type)=>{
    try {
        //convert the list to json
        imageNameList = imageNameList.join(',');

        let imageListStruct ={
            imageList:imageNameList,
            commandType:type
        }

        const response = await axios.get(`${apiURL}/imageList/?nameList=${JSON.stringify(imageListStruct)}`);
        return JSON.stringify(response.data);
     } catch (error) {
        console.log('Problem deleting images');
        return null;
     }
});


ipcMain.handle('get-Image-from-drive',async()=>{
        dialog.showOpenDialog(mainWindow,{
            properties:['openFile'],
            filters:[
                {name:"Image",extensions:["png"]},
            ]
        }).then(async(filePaths)=>{
            let fileName = filePaths.filePaths[0]
            fileName = fileName.substring(fileName.lastIndexOf('\\')+1,fileName.length);
            const imageBytes = await fs.readFile(filePaths.filePaths[0],(err,data)=>{
                if(err){
                    console.log('Error',err);
                    return null;
                }

                return data;
            });
            return {fileName, imageBytes};
        }).then(async (result)=>{
            
            // Launch the window after 1s
            setTimeout(async()=>{
                if(!galleryWindow){
                    await createGalleryWindow(mainWindow);
                }else{
                    galleryWindow.restore();
                }   
            },1000);

            console.log('result.imagebtyes', result.imageBytes)

            // If binary image found try uploading to server
            if(result.imageBytes ){
                mainWindow.minimize();
                const imageString = Buffer.from(result.imageBytes).toString('base64');
                const dataURL = `data:image/png;base64,${imageString}`;
                const formData = new FormData();
                // const fileName = JSON.parse(stringFileName);
                const blob = await dataURLToBlob(dataURL);    
                const config = {
                    headers: {
                        'Content-Type':'multipart/form-data',
                    } 
                };

                formData.append('name',result.fileName);
                formData.append('image',blob,result.fileName);

                try {
                    const response = await axios.post(`${apiURL}/upload/`,formData,config);                
                    console.log('Upload Response:',response)
                    return JSON.stringify(response.data);

                } catch (error) {
                    console.error('Error uploading image:',error);
                    return {error:'Error uploading image'};       
                }

            }else{
                console.log('No binary image received for uploading');
            }
        });


});




// To grab the screen and pass it to the snipping windo
async function captureScreen() {
    // From screens get primary display
    const primaryDisplay =  screen.getPrimaryDisplay();

    // get the size of display
    const {width, height} = primaryDisplay.size;
    
    // set a variable name opitons
    const options = {
        types: ['screen'],
        thumbnailSize: { width,height},
    };

    // await 
    const sources = await desktopCapturer.getSources(options);

    // get the primary source incase if more than one then
    const primarySource = sources.find(({display_id})=>display_id==primaryDisplay.id);
    
    // get the primary thumbnail
    const screenGrab = primarySource.thumbnail;

    // return the image

    return screenGrab;
}


// Convert the dataURL to blob
async function dataURLToBlob(dataURL) {
  
    const [prefix, base64] = dataURL.split(',');
    const contentType = prefix.match(/:(.*?);/)[1]; // Extract format
    
    const byteString = atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([uint8Array], { type: contentType });
  }


