var items = []; //["item 1", "item 2", "item 3", "item 4", "item 5"];
let images;
let openedImage;
let isConnected;
let isAnyChecked=0;
let selectedItems=[];
let isAnyTrash;
let isAnyTrashChecked=0;
let globalState='gallery';

const mainPane = document.getElementById('mainPane');
var list = document.getElementById('list');

const previewBox  = document.getElementById('previewBox');
const listOverlay  = document.getElementById('listOverlay');
const addNavBar = document.getElementById('addNavBar');
const groupsNavBar = document.getElementById('groupsNavBar');
const trashNavBar = document.getElementById('trashNavBar');

previewBox.style.display='none';
listOverlay.style.display='none';

// Create a state change reciever
addNavBar.addEventListener('click',()=>{
    stateChange(state='gallery');
});
groupsNavBar.addEventListener('click',()=>{
    stateChange(state='groups');
});
trashNavBar.addEventListener('click',()=>{
    stateChange(state='trash');
});

// Function to fetch all images and store locally
async function getAllImages(){
    var imageList;
    try {
        const data = await window.bridgeDatabase.getImages();
        // console.log('Data in Get All Images',data)
        let firstKey=Object.keys(data)[0];

        //check if first key is an error
        if(firstKey!='Error'){
            Object.keys(data).forEach(key =>{
                // console.log(data[key]);
                // console.log('Hey');
                imageList = data[key];
            });

            // console.log(images);
            return imageList;
        }else{
            //Else if the first key is Error display an error
            console.log(data[Object.keys(data)[0]]);
            return null;
        }
    } catch (error) {
        return null;
    };
}

async function checkAnyTrash(items){
    let localCheck = false;
    items.forEach(function(item){
        if(item['trash']){
            localCheck=true;
        }
    });
    return localCheck;    
}

async function checkAnyInbox(items){
    let localCheck = false;
    items.forEach(function(item){
        if(!item['trash']){
            localCheck=true;
        }
    });
    return localCheck;    
}


// Function to create list item from locally stored data
function createdListItems(items,trash=false) {
    list.innerHTML = "";
    items.forEach(function (item) {
        if(!trash){
            if(!item['trash']){
                var div = document.createElement('div');
                div.id = item['name'].slice(0,-4);
                // console.log(div.id);
                div.className = 'list-item';
                div.setAttribute('is-trash',false);
                list.appendChild(div);
            }
        }else{
            if(item['trash']){
                var div = document.createElement('div');
                div.id = item['name'].slice(0,-4);
                // console.log(div.id);
                div.className = 'list-item';
                div.setAttribute('is-trash',true);
                list.appendChild(div);
            }
        }
    });
}

// Function to populate the list item
function populateListItems(items,trash=false) {

    items.forEach(
        function (item) {
            if(!item['trash'] && !trash){
                builderListItems(item);
            }else if(item['trash'] && trash ){
                builderListItems(item);
            }
        }
    );

};

function builderListItems(item){
    var parent = document.getElementById(item['name'].slice(0,-4));

    var div1 = document.createElement('input');
    div1.type = 'checkbox';
    div1.className = 'item-comp-checkbox';
    div1.setAttribute('data-isChecked','false');

    var leftDiv = document.createElement('div');
    leftDiv.className = 'leftDiv';
    leftDiv.appendChild(div1);

    var div2 = document.createElement('label');
    div2.innerHTML = "";
    let nameTag = item['name'].slice(0,-4);
    div2.textContent = (Number.isInteger(parseInt(nameTag.substring(0,9))))?`${nameTag.substring(0,4)} ${nameTag.substring(4,6)} ${nameTag.substring(6,8)} - ${nameTag.substring(9,11)}:${nameTag.substring(11,13)}:${nameTag.substring(13,15)}`:`${nameTag}`;
    div2.className = 'item-comp-name';
    div2.onclick = function(){openEditor(item['name']);};

    var div3 = document.createElement('label');
    div3.innerHTML="";
    div3.textContent = textBoxPopulator(JSON.parse(item['df']),inline=true);0
    div3.className='item-comp-text';
    div3.onclick = function(){openEditor(item['name']);};

    var div4 = document.createElement('i');
    div4.textContent = 'delete';
    div4.className = 'material-icons';
    div4.style.marginRight=15+'px';
    
    var div5 = document.createElement('i');
    div5.textContent = 'archive';
    div5.className = 'material-icons';
    div5.style.marginRight=15+'px';
    
    var rightDiv = document.createElement('div');
    rightDiv.className='rightDiv';
    rightDiv.appendChild(div4);
    rightDiv.appendChild(div5);

    parent.appendChild(leftDiv);
    parent.appendChild(div2);
    parent.appendChild(div3);
    parent.appendChild(rightDiv);
}

function placeHolderText(connected){

    // clear the list
    list.innerHTML = "";
    var div = document.createElement('div');
    div.id = 'emptyList';
    div.style.justifyContent='center';
    div.className = 'list-item';
    list.appendChild(div);

    // add a new empty list place holder
    var div2 = document.createElement('h2');
    div2.innerHTML = "";
    div2.textContent = connected ?'No Items found here...!':'Cannot reach server... Check Internet Connectivity!';
    // div2.className = 'item-comp-name';
    
    div.appendChild(div2);
    div2.style.fontSize='small';

}

// Function to handle selection
document.addEventListener('DOMContentLoaded',()=>{
    const container = document.getElementById('list');
    // console.log(container);

    // Get menuBar menus...
    const masterCheckBox = document.getElementById('masterCheckBox');
    const masterTrashButton = document.getElementById('containerMasterTrashButton');
    const masterDeleteButton = document.getElementById('containerMasterDeleteButton');
    
    //Function to handle selection
    function handleSelection(event){

        // on change pass the event target that is checkbox here
        const selectedCheckbox = event.target;
        // console.log('Event is registered at:')
        // console.log(selectedCheckbox);

        // if check
        if(selectedCheckbox.classList.contains('item-comp-checkbox')){
            if(selectedCheckbox.checked){
                // checkbox <- left div <- list item
                const grandParent = selectedCheckbox.parentElement.parentElement;
                grandParent.style.backgroundColor='lightblue';
                const children = Array.from(grandParent.children);

                children.forEach(element => {
                    element.style.backgroundColor='lightblue';
                });

                selectedCheckbox.setAttribute('data-isChecked','true');
                if(grandParent.getAttribute('is-trash')){
                    isAnyTrashChecked+=1;
                }else{
                    isAnyChecked+=1;
                }
                selectedItems.push(grandParent);
            }else{
                // checkbox <- left div <- list item
                const grandParent = selectedCheckbox.parentElement.parentElement;
                grandParent.style.backgroundColor='white';
                const children = Array.from(grandParent.children);
                
                children.forEach(element => {
                    element.style.backgroundColor='white';
                });

                selectedCheckbox.setAttribute('data-isChecked','false');
                if(grandParent.getAttribute('is-trash')){
                    isAnyTrashChecked-=1;
                }else{
                    isAnyChecked-=1;
                }
                selectedItems = selectedItems.filter(item => item.id!==grandParent.id);
            }
        }
    }

    function handleMasterMenu(event){

        if(isAnyChecked>0){
            masterTrashButton.style.display='flex';
        }else{
            masterTrashButton.style.display='none';
        }

        if(isAnyTrashChecked>0){
            masterDeleteButton.style.display='flex';
        }else{
            masterDeleteButton.style.display='none';
        }

    }

    // hangle the master delete button
    function handleMasterDelete(){
        // console.log(selectedItems);
     if(selectedItems.length>0){
        let selectedItemsName = [];
        selectedItems.forEach((item)=>{
            selectedItemsName.push(item.id+'.png');
        });
        let confirmCheck = confirm('move '+selectedItemsName.length+' items to trash?!');
        if(confirmCheck){
            // console.log(selectedItemsName);
            let deleteType;
            if(globalState=='gallery'){deleteType='trash'}
            else{deleteType='delete'}
            const response = window.bridgeDatabase.trashMultipleImages(selectedItemsName,deleteType);
            if(response){
                if(deleteType=='trash'){
                    stateChange('gallery');
                }else{
                    stateChange('trash');
                }
                // reset checkbox and selectedItem
                masterCheckBox.checked=false;
                selectedItems=[];
            }
        }else{
            alert('Deletion is aborted by user');
            console.log('Deletion is aborted by user');
        }
     }else{
        alert('No items Selected');
     } 
    };

    // this makes it so any change is happening at container
    container.addEventListener('change',handleSelection);
    container.addEventListener('change',handleMasterMenu);

    // Handle master Delete Button
    masterDeleteButton.onclick = handleMasterDelete;

    // Handle master checkbox
    masterCheckBox.addEventListener('change',(event)=>{
        console.log('Inside mastercheckbox');
        console.log(images);
        selectedItems = [];
        if(event.target.checked){
            // add all checkbox items
            isAnyChecked=0;
            isAnyTrashChecked=0;
            images.forEach(function(item) {
                const div = document.getElementById(item['name'].slice(0,-4));
                // console.log(div);
                div.style.backgroundColor='lightblue';
                const children = Array.from(div.children);

                children.forEach(element => {
                    element.style.backgroundColor='lightblue';
                });

                const checkBox = div.querySelector('input[type="checkbox"]');
                checkBox.checked=true;
                if(div.getAttribute('is-trash')){
                    isAnyTrashChecked+=1;
                }else{
                    isAnyChecked+=1;
                }
                selectedItems.push(div);
                // checkBox.click();
            });
        }else{
            // remove all checks
            images.forEach(function(item) {
                const div = document.getElementById(item['name'].slice(0,-4));
                div.style.backgroundColor='white';
                const children = Array.from(div.children);
                
                children.forEach(element => {
                    element.style.backgroundColor='white';
                });
                
                const checkBox = div.querySelector('input[type="checkbox"]');
                // console.log(checkBox);
                checkBox.checked=false;
                selectedItems = selectedItems.filter(item => item !==div);
                // checkBox.click();
            });
            isAnyChecked=0;
            isAnyTrashChecked=0;
        }
        console.log('Selected Items:');
        console.log(selectedItems);
    });

    masterCheckBox.addEventListener('change',handleMasterMenu);

});

// this function populates the textArea based on text recieved in json
function textBoxPopulator (textJSON,inline=false){
    
    // first used heap or dicts to get line nums...

    // Start with current index and go through each index
    // DF is sorted based on line num, so if line_num changes append a new row index
    let rows = {};
    if(!inline){
        console.log('Text Json is:',textJSON);
    }
    // get the first index
    let row_index=textJSON[0]['line_num'];

    // rows[1]=textJSON[0];
    let temp_row=[];
    // Group the rows based on index

    for (let i=0;i<textJSON.length;i++){
        if (textJSON[i]['line_num']==row_index){
            temp_row.push(textJSON[i]);
        }else{
            rows[row_index]=temp_row;
            row_index=textJSON[i]['line_num'];
            temp_row=[];
            temp_row.push(textJSON[i]); 
        }
        // if no further change in row index
        rows[row_index]=temp_row;

    }

    // go through each group and attach the strings
    let finalText = '';
    for(let row in rows ){
        let temp_row =  rows[row]

        // sort the array based on the json key value
        // temp_row.sort((a,b)=>parseInt(a.word_num)-parseInt(b.word_num));
        // add the first indent
        let indent = temp_row[0]['left'];
        // get the character width using TEXT LENGTH and WIDTH
        let charWidth = (temp_row[0]['width'] / temp_row[0]['text'].length);
        temp_str = '';

        for (let i=0;i<temp_row.length;i++){
            // find the spaces between each word
            //
            if (i<temp_row.length-1){

                // first left - // next left
                let charLength = temp_row[i+1]['left'] - temp_row[i]['left']
                
                // get the number of characters in between // get the characters in the first word
                let emptySpaces = (Math.floor(charLength/charWidth)-temp_row[i]['text'].length);
                emptySpaces = emptySpaces< 0 ? 1 :emptySpaces;
                // get the blank spaces needed
                let str = temp_row[i]['text']; 
                
                // add the blank spaces to the word 
                str = str + new Array(emptySpaces+1).join(" ");
                
                // add the word to the to temp str
                temp_str+=str;

            }else{
                let str = temp_row[i]['text'];
                temp_str+=str;
            }
        }

        // add a new line
        if(inline){
            temp_str += ", "; 
        }else{
            temp_str += "\n"; 
        }
        // append the word in final string
        finalText+=(temp_str);	
    }
        return finalText;
};

// when clicked on any list item
async function openEditor(itemName){

    // assign item name to  global open image
    openedImage = itemName; 

    // create the div and 
    const editor = document.createElement('div');

    // hide the list or delete ?
    // document.getElementById('list').style.display = 'none';   


    // Get the image using the URL 
    const imageURL = await window.bridgeDatabase.getImageByName(itemName);

    // show the editor div
    listOverlay.style.display='block';
    previewBox.style.display='flex';

    // document.getElementById('imageBoxArea').src = `http://127.0.0.1:8000${imageURL['url']}`;
    document.getElementById('imageBoxArea').src = imageURL['imageByte'];

    // call the text box populator
    let finalText = textBoxPopulator(JSON.parse(imageURL['df']));
    document.getElementById('textArea').value=finalText;

    document.addEventListener('keydown',event =>{
        if(event.key==='Escape'){
            listOverlay.style.display='none';
            previewBox.style.display='none';
            // document.getElementById('imageBoxImage').style.display='none';
            delete editor;
            openedImage=null;
        }
    });

    document.getElementById('closeEditorButton').addEventListener('click',event =>{
            listOverlay.style.display='none';
            previewBox.style.display='none';
            // document.getElementById('imageBoxImage').style.display='none';
            delete editor;
            openedImage=null;
    });

};

// reRecognize the image
document.getElementById('reRecognizeButton').addEventListener('click',async()=>{
    if (openedImage != null){
         const image_df =  await window.bridgeDatabase.reloadImage(openedImage);   
         // call the text box populator
         console.log("The image df response is: ",image_df['df']);
         let finalText = textBoxPopulator(JSON.parse(image_df['df']));
         document.getElementById('textArea').value=finalText;
    }else{
        console.error('No image open or cannot get name')
    }
});

// reLoad the list
document.getElementById('containerRefreshButton').addEventListener('click',async()=>{
    stateChange(null);
})

// reLoad the list
document.getElementById('containerAddNew').addEventListener('click',async()=>{
    await window.bridgeDatabase.captureNew();
})


// Call all the sub functions in order
async function stateChange(state=null){
    // wait for the Images varible to be set
    globalState = state;
    if(isConnected){
        images = await getAllImages();
    }else{
        images = images;
    }
    // console.log('images are:',images);

    if(state==null || state=='gallery'){
        // console.log('The value of the images is:',images)
        // console.log(images);
        // console.log(images[0]['url']);
        let isAnyInbox;

        if(images){
            isAnyInbox = await checkAnyInbox(images);
        }

        addNavBar.style.backgroundColor='rgb(' + 200 + ',' + 200 + ',' + 200 + ')';
        groupsNavBar.style.backgroundColor='transparent';
        trashNavBar.style.backgroundColor='transparent';

        groupsNavBar.addEventListener('mouseenter',()=>{
            groupsNavBar.style.backgroundColor='rgb(' + 210 + ',' + 210 + ',' + 210 + ')';
        });
        groupsNavBar.addEventListener('mouseleave',()=>{
            groupsNavBar.style.backgroundColor='transparent';
        });

        trashNavBar.addEventListener('mouseenter',()=>{
            trashNavBar.style.backgroundColor='rgb(' + 210 + ',' + 210 + ',' + 210 + ')';
        });
        trashNavBar.addEventListener('mouseleave',()=>{
            trashNavBar.style.backgroundColor='transparent';
        });

        addNavBar.addEventListener('mouseenter',()=>{
            addNavBar.style.backgroundColor='rgb(' + 200 + ',' + 200 + ',' + 200 + ')';
        });

        addNavBar.addEventListener('mouseleave',()=>{
            addNavBar.style.backgroundColor='rgb(' + 200 + ',' + 200 + ',' + 200 + ')';
        });

        if (isAnyInbox && isConnected){
            createdListItems(images);
            populateListItems(images);
        }
        else{
            placeHolderText(isConnected);
        }
    }
    else if(state=='groups'){

        addNavBar.style.backgroundColor='transparent';
        groupsNavBar.style.backgroundColor='rgb(' + 200 + ',' + 200 + ',' + 200 + ')';
        trashNavBar.style.backgroundColor='transparent';

        addNavBar.addEventListener('mouseenter',()=>{
            addNavBar.style.backgroundColor='rgb(' + 210 + ',' + 210 + ',' + 210 + ')';
        });
        addNavBar.addEventListener('mouseleave',()=>{
            addNavBar.style.backgroundColor='transparent';
        });

        trashNavBar.addEventListener('mouseenter',()=>{
            trashNavBar.style.backgroundColor='rgb(' + 210 + ',' + 210 + ',' + 210 + ')';
        });
        trashNavBar.addEventListener('mouseleave',()=>{
            trashNavBar.style.backgroundColor='transparent';
        });


        groupsNavBar.addEventListener('mouseenter',()=>{
            groupsNavBar.style.backgroundColor='rgb(' + 200 + ',' + 200 + ',' + 200 + ')';
        });

        groupsNavBar.addEventListener('mouseleave',()=>{
            groupsNavBar.style.backgroundColor='rgb(' + 200 + ',' + 200 + ',' + 200 + ')';
        });

            placeHolderText();
    }
    else if(state=='trash'){

        if(images){
            isAnyTrash = await checkAnyTrash(images);
        }else{
            isAnyTrash = isAnyTrash;
        }

        addNavBar.style.backgroundColor='transparent';
        trashNavBar.style.backgroundColor='rgb(' + 200 + ',' + 200 + ',' + 200 + ')';
        groupsNavBar.style.backgroundColor='transparent';

        addNavBar.addEventListener('mouseenter',()=>{
            addNavBar.style.backgroundColor='rgb(' + 210 + ',' + 210 + ',' + 210 + ')';
        });
        addNavBar.addEventListener('mouseleave',()=>{
            addNavBar.style.backgroundColor='transparent';
        });

        groupsNavBar.addEventListener('mouseenter',()=>{
            groupsNavBar.style.backgroundColor='rgb(' + 210 + ',' + 210 + ',' + 210 + ')';
        });
        groupsNavBar.addEventListener('mouseleave',()=>{
            groupsNavBar.style.backgroundColor='transparent';
        });


        trashNavBar.addEventListener('mouseenter',()=>{
            trashNavBar.style.backgroundColor='rgb(' + 200 + ',' + 200 + ',' + 200 + ')';
        });

        trashNavBar.addEventListener('mouseleave',()=>{
            trashNavBar.style.backgroundColor='rgb(' + 200 + ',' + 200 + ',' + 200 + ')';
        });

        if (isAnyTrash && isConnected){
            createdListItems(images,trash=true);
            populateListItems(images,trash=true);
        }
        else{
            placeHolderText(isConnected);
        }
    }
};

// setInterval(stateChange(state=globalState),5000);
stateChange(state=globalState)



// monitor connection
async function checkConnection(){
   const result = await window.bridgeDatabase.checkStatus();
   if(result){
        document.getElementById('connection status').style.backgroundColor='green'
    }else{
       document.getElementById('connection status').style.backgroundColor='pink'
   }
   if(result!=isConnected){
    isConnected = result;
    stateChange(state=globalState)
   }
}


function connectionStatus(){
    setInterval(()=>{
        checkConnection();
    },10000);
}

// initialize for first check
checkConnection();

// Turn on the listeners...
connectionStatus();