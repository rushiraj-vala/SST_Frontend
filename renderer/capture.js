window.tested.something((data)=>{
    console.log('You in capture');
    // console.log(data);
    document.getElementById('screenshot-imaged').src=data;
}
);

const overlayElement1 = document.getElementById('overlayTopLeft');
const overlayElement2 = document.getElementById('overlayTopRight');
const overlayElement3 = document.getElementById('overlayBottomLeft');
const overlayElement4 = document.getElementById('overlayBottomRight');
const verticalLine = document.getElementById('verticalLine');
const horizontalLine = document.getElementById('horizontalLine');

let captureStart = false;


// overlayElement.addEventListener('mousemove',(event)=>{
//     const mouseX = event.clientX;
//     const mouseY = event.clientY;

//     overlayElement.style.width = mouseX + 'px';
//     overlayElement.style.height = mouseY + 'px';

// });

window.addEventListener('mousedown',(event)=>{
    captureStart = !captureStart;
    console.log(captureStart);
});


window.addEventListener('mousemove',(event)=>{
        
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    verticalLine.style.left = mouseX+'px';
    horizontalLine.style.top = mouseY+'px';

    if (!captureStart){
    const windowWidth = window.screen.width
    const windowHeight = window.screen.height

    overlayElement1.style.width = mouseX + 'px';
    overlayElement1.style.height = mouseY + 'px';

    overlayElement2.style.width = (windowWidth-mouseX) + 'px';
    overlayElement2.style.height = mouseY + 'px';

    overlayElement3.style.width = mouseX + 'px';
    overlayElement3.style.height = ( windowHeight - mouseY) + 'px';

    overlayElement4.style.width = (windowWidth-mouseX) + 'px';
    overlayElement4.style.height = ( windowHeight - mouseY) + 'px';
    }

    else if (captureStart){

        const windowWidth = window.screen.width
        const windowHeight = window.screen.height
    
        // overlayElement1.style.width = mouseX + 'px';
        overlayElement1.style.height = mouseY + 'px';
    
        // overlayElement2.style.width = (windowWidth-mouseX) + 'px';
        // overlayElement2.style.height = mouseY + 'px';
    
        overlayElement3.style.width = mouseX + 'px';
        overlayElement3.style.height = ( windowHeight - mouseY) + 'px';
    
        overlayElement4.style.width = (windowWidth-mouseX) + 'px';
        // overlayElement4.style.height = ( windowHeight - mouseY) + 'px';
        }

})