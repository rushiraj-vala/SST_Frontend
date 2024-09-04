const outputDiv = document.getElementById('output');

outputDiv.textContent='';

window.bridgeApi.getMessage((message)=>{
    outputDiv.textContent += message + '\n';
    outputDiv.scrollTop =outputDiv.scrollHeight;
    outputDiv.style.height = outputDiv.scrollHeight+'px';
});