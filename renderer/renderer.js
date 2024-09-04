window.launchWindow.fetchData().then(data =>{
    console.log(JSON.stringify(data,null,2));
});

async function openCaptureWindow(){
    await window.launchWindow.launchCaptureWindow()
}

async function openGalleryWindow(){
    await window.launchWindow.launchGalleryWindow();
}

async function closeMainWindow(){
    await window.launchWindow.closeMainWindow();
}

document.getElementById("Button1").addEventListener('click',()=>{
    openCaptureWindow();
});

document.getElementById("Button2").addEventListener('click',async()=>{
    // closeMainWindow();
    await window.launchWindow.launchUploadWindow();
});


document.getElementById("Button3").addEventListener('click',()=>{
    openGalleryWindow();
});


function openFileDialogue(){
    dialog
}