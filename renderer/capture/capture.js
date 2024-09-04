
const overlayElement1 = document.getElementById('overlayTopLeft');
const overlayElement2 = document.getElementById('overlayTopRight');
const overlayElement3 = document.getElementById('overlayBottomLeft');
const overlayElement4 = document.getElementById('overlayBottomRight');
const verticalLine = document.getElementById('verticalLine');
const horizontalLine = document.getElementById('horizontalLine');
const borderrect = document.getElementById('borderRect');
const checkCircleButton = document.getElementById('checkCircleButton');
const crossCircleButton = document.getElementById('crossCircleButton');

let captureState = 0;

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

let captureStart = false;
let viewUpdate = true;



window.bridgedapi.grabImage((data)=>{
    // console.log('You in capture');
    // console.log(data);
    document.getElementById('screenshot-imaged').src=data;
}
);


window.addEventListener('mousedown',(event)=>{
    toggleCaptureState();
});


checkCircleButton.addEventListener('click',()=>{
    cropImage();

    // launch the gallery after 1 sec
    setTimeout(()=>{
        window.bridgedapi.launchGallery();
    },1000);

})


window.addEventListener('mousemove',(event)=>{
        
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        //
        const windowWidth = window.screen.width
        const windowHeight = window.screen.height

        if (captureState==0){

            //
            verticalLine.style.left = mouseX+'px';
            horizontalLine.style.top = mouseY+'px';
        
            // 
            borderrect.style.left = -10 + 'px';
            borderrect.style.top = -10 + 'px';
            borderrect.style.width = 0 + 'px';
            borderrect.style.height = 0 + 'px';

            //
            checkCircleButton.style.left = -80 +'px';
            checkCircleButton.style.top = -80 +'px';

            //
            crossCircleButton.style.left = -80 +'px';
            crossCircleButton.style.top = -80 +'px';


            overlayElement1.style.width = mouseX + 'px';
            overlayElement1.style.height = mouseY + 'px';

            overlayElement2.style.width = (windowWidth - mouseX) + 'px';
            overlayElement2.style.height = mouseY + 'px';

            overlayElement3.style.width = mouseX + 'px';
            overlayElement3.style.height = ( windowHeight - mouseY) + 'px';

            overlayElement4.style.width = (windowWidth-mouseX) + 'px';
            overlayElement4.style.height = ( windowHeight - mouseY) + 'px';

            startX = mouseX;
            startY = mouseY;

            viewUpdate = true;
        }

        else if (captureState==1){

            verticalLine.style.left = mouseX+'px';
            horizontalLine.style.top = mouseY+'px';

            if(mouseX>=startX && mouseY>=startY){
                            
            overlayElement1.style.height = mouseY + 'px';
            overlayElement3.style.width  = mouseX + 'px';
            overlayElement3.style.height = (windowHeight - mouseY) + 'px';        
            overlayElement4.style.width  = (windowWidth - mouseX) + 'px';

            viewUpdate = true;

        } else if(mouseX>=startX && mouseY<=startY){
            
            overlayElement1.style.height = startY + 'px';
            overlayElement2.style.height = mouseY + 'px';
            overlayElement3.style.width  = mouseX + 'px';
            overlayElement3.style.height = (windowHeight - startY) + 'px';        
            overlayElement4.style.width  = (windowWidth - mouseX) + 'px';
            overlayElement4.style.height  = (windowHeight - mouseY) + 'px';

            viewUpdate = true;

        } else if(mouseX<=startX && mouseY>=startY){
                
                overlayElement1.style.width = mouseX + 'px';
                overlayElement1.style.height = mouseY + 'px';
                overlayElement2.style.width = (windowWidth -mouseX) + 'px';
                overlayElement2.style.height = startY + 'px';
                overlayElement3.style.width  = startX + 'px';
                overlayElement3.style.height = (windowHeight - mouseY) + 'px';        
                overlayElement4.style.width  = (windowWidth - startX) + 'px';
                overlayElement4.style.height  = (windowHeight - startY) + 'px';

                viewUpdate = true;
            } else if(mouseX<=startX && mouseY <=startY){
                
                overlayElement1.style.width = mouseX + 'px';
                overlayElement1.style.height = startY + 'px';
                overlayElement2.style.width = (windowWidth -mouseX) + 'px';
                overlayElement2.style.height = mouseY + 'px';
                overlayElement3.style.width  = startX + 'px';
                overlayElement3.style.height = (windowHeight - startY) + 'px';        
                overlayElement4.style.width  = (windowWidth - startX) + 'px';
                overlayElement4.style.height  = (windowHeight - mouseY) + 'px';

                viewUpdate = true;
            }else{

            overlayElement1.style.width = mouseX + 'px';
            overlayElement1.style.height = mouseY + 'px';

            overlayElement2.style.width = (windowWidth - mouseX) + 'px';
            overlayElement2.style.height = mouseY + 'px';

            overlayElement3.style.width = mouseX + 'px';
            overlayElement3.style.height = ( windowHeight - mouseY) + 'px';

            overlayElement4.style.width = (windowWidth-mouseX) + 'px';
            overlayElement4.style.height = ( windowHeight - mouseY) + 'px';
            
            viewUpdate = true;

            }

        }
    
        else if(captureState==2 && viewUpdate==true){
            
            //
            const windowWidth = window.screen.width
            const windowHeight = window.screen.height
            
            //
            verticalLine.style.left = mouseX +'px';
            horizontalLine.style.top = mouseY +'px';

            //
            if(mouseX>=startX && mouseY >=startY){

                borderrect.style.left = startX + 'px';
                borderrect.style.top = startY + 'px';
                borderrect.style.width  = (mouseX - startX-10)+ 'px';
                borderrect.style.height = (mouseY - startY-10)+ 'px';
    
                //
                checkCircleButton.style.left = (mouseX - 30) +'px';
                checkCircleButton.style.top = (mouseY + 30) +'px';
    
                //
                crossCircleButton.style.left = (mouseX - 80) +'px';
                crossCircleButton.style.top = (mouseY + 30) +'px';
    
                //
                // overlayElement1.style.height = mouseY + 'px';        
            
                // overlayElement3.style.width = mouseX + 'px';
                // overlayElement3.style.height = ( windowHeight - mouseY) + 'px';
            
                // overlayElement4.style.width = (windowWidth-mouseX) + 'px';

            }else if(mouseX >=startX && mouseY<=startY){
                borderrect.style.left = startX + 'px';
                borderrect.style.top = mouseY + 'px';
                borderrect.style.width  = (mouseX - startX-10)+ 'px';
                borderrect.style.height = (startY-mouseY-10)+ 'px';
    
                //
                checkCircleButton.style.left = (mouseX - 30) +'px';
                checkCircleButton.style.top = (startY + 30) +'px';
    
                //
                crossCircleButton.style.left = (mouseX - 80) +'px';
                crossCircleButton.style.top = (startY + 30) +'px';                
            }else if(mouseX<=startX && mouseY<=startY){
                borderrect.style.left = mouseX + 'px';
                borderrect.style.top = mouseY + 'px';
                borderrect.style.width  = (startX-mouseX-10)+ 'px';
                borderrect.style.height = (startY-mouseY-10)+ 'px';
    
                //
                checkCircleButton.style.left = (startX - 30) +'px';
                checkCircleButton.style.top = (startY + 30) +'px';
    
                //
                crossCircleButton.style.left = (startX - 80) +'px';
                crossCircleButton.style.top = (startY + 30) +'px';                

            }else if(mouseX<=startX && mouseY>=startY){
                borderrect.style.left = mouseX + 'px';
                borderrect.style.top = startY + 'px';
                borderrect.style.width  = (startX-mouseX-10)+ 'px';
                borderrect.style.height = (mouseY-startY-10)+ 'px';
    
                //
                checkCircleButton.style.left = (startX - 30) +'px';
                checkCircleButton.style.top = (mouseY + 30) +'px';
    
                //
                crossCircleButton.style.left = (startX - 80) +'px';
                crossCircleButton.style.top = (mouseY + 30) +'px';                

            }



            viewUpdate = false;

            if(viewUpdate==false){
                endX = mouseX;
                endY = mouseY;
            }
        }


})

function toggleCaptureState(){
    switch(captureState){
        case 0:
            captureState = 1;
            console.log('capture started');
            break;

        case 1:
            captureState = 2;
            console.log('capture ongoing');
            break;

        case 2:
            captureState = 0;
            console.log('capture completed');
            break;

        default:
            console.log('Invalid state');
            break;
    }
}

function cropImage(){

    const img = document.getElementById('screenshot-imaged');
    
    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    console.log(startX,startY,endX,endY);

    ctx.drawImage(img,0,0);

    const croppedImageData = ctx.getImageData(startX,startY,(endX-startX),(endY-startY));
    
    canvas.width = endX-startX;
    canvas.height = endY-startY;
    ctx.putImageData(croppedImageData,0,0);

    // Convert it to blob objectg with specific image type as MIME argumetn and send it to the preload
    console.log('You were once here...');
    const imageUrl = canvas.toDataURL();
    window.bridgedapi.uploadImage(imageUrl);
    // canvas.toBlob((blob)=>{
    //     window.bridgedapi.uploadImage(blob);
    // },'image/png');

    canvas.remove();

}