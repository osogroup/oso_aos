$(document).ready(function(){
  // outputHTML();
  doTheStringify();
});


// pull in data from objectList.JSON and configuration JSON file 
const configData = async () => {
  var listConfig = await fetch("../tempData/objectConfig.json").then(response=>{return response.json();});
  return listConfig;
}
  

// gets all the Objects/Arrays from listOfObjects.json and returns them
const tempData = async () => {
  var objVars = await fetch("../tempData/listOfObjects.json").then(response=>{return response.json();});
  return objVars;
}


// gets data from GitHub according to the URL's type
const typeData = async () => {
  var typeVars = await fetch("../tempData/"+objType+".json").then(response=>{return response.json();});
  return typeVars;
}


// function that is called when the Update button is pressed, it displays 
// the value that is being edited in the console
function showValue() {
  var superKey = objType+ '_' +objItemid;
  var superObject = JSON.parse(localStorage.getItem(superKey));
  console.log(superObject);
}


// function that is called when you blur a textbox, I use this in my onchange
// attribute so I don't see the console log until I click away from an input
function showData() {
  console.log(localStorage);
}


// function that is linked to the oninput attribute in the input box, every time
// the value in the box is changed, this function will update the localStorage
function anyChange(str) {
  var superKey = objType+ '_' +objItemid;
  // console.log("This is the str: ", str);
  var myString = localStorage.getItem(superKey);
  // console.log("This is myString", myString);
  var myObject = JSON.parse(myString);
  // console.log("This is myObject: ", myObject);
  var change = document.getElementById('input'+str);
  var changeValue = change.value;
  myObject[str] = changeValue;
  // console.log("this is myObject[str]", myObject[str]);
  backToString = JSON.stringify(myObject);
  // console.log("This is backToString ", backToString);
  addToLocalStorage(superKey, backToString);
}


// -------------------------------------------- Clear localStorage --------------------------------------------


function clearLocalStorage() {
  localStorage.clear();
}


// -------------------------------------------- Check localStorage --------------------------------------------


function checkLocalStorage(check) {

  var objItem = {};
  var objectKeys = objType + '_' + objItemid;

  if (localStorage.getItem(objectKeys) != null) {
    // console.log("This is localStorage.getItem(objectKeys)", localStorage.getItem(objectKeys));
    var forOfLoop = JSON.parse(localStorage.getItem(objectKeys));
    console.log("objectKeys exists..!");
    // console.log(localStorage);

    // pull item from localStorage
    localStorage.getItem(objType+'_'+objItemid);

    console.log(localStorage);

    // create HTML header and fields
  }
  else {
    var forOfLoop = check.objTypeData[objItemid];
    console.log("objectKeys was just created..!");
    var repositoryItem = check.data[objType];
    // console.log("This is the repositoryItem..", repositoryItem);
    // console.log("This is repositoryItem[0]", repositoryItem[0]);

    //   pull item from repository (get item by using "var objTypeData = data[objType]";)

    //   if object id is equal to the one im searching for
    for(const[repositoryKey, repositoryValue] of Object.entries(check.data[objType])) {
      // console.log("This is repositoryKey: ", repositoryKey); // this is the id number 
      // console.log("This is repositoryValue: ", repositoryValue); // this is the object
      if (objType+'_'+repositoryKey == objectKeys) {
        objItem = repositoryItem[repositoryKey];
        // console.log("This is objItem: ", objItem);
        var objItemString = JSON.stringify(objItem);
        // console.log("This is objItemString: ", objItemString);
        addToLocalStorage(objectKeys, objItemString);
        console.log(localStorage);
      }
    }
  }
  // this is either coming from localStorage or from the 
  return forOfLoop;
}


// -------------------------------------------- Add To localStorage --------------------------------------------


function addToLocalStorage(position, value) {
  localStorage.setItem(position, value);
}


// ------------------------------------------------- Stringify -------------------------------------------------


const doTheStringify = async () => {

  var arrayFields = [];
  var arrayOfOptions = [];
  var arrayOfOptionsNames = [];
  var statusOptions = [];


  if(objType == null || objItemid == null) {
    alert('Enter "?type=task&itemid=0" at the end of the current URL');
  }
  else {
    var data = await tempData();
    var config = await configData();
    var typeStuff = await typeData();
    var objTypeData = data[objType];
    var tagTypeData = data['tags']; // objTypeData specifically for tags
    var configTypeData = config[objType];
    console.log("This is typeStuff: ", typeStuff);

    var checkLocalStorageParams = {
      data : data,
      objTypeData : objTypeData
    };

    // filling arrayOfOptions[]
    var tagData = data.tags;
    console.log("This is tagData (data.tags): ", tagData);
    

    // -------------------------------------------- Navigation Bar --------------------------------------------


    var HTMLoutput = '<div id="contacts">'
    + '<div class="row">'
      + '<p id="header" class="col-12">'
        + '<img id="imageSpacing" src="MindfulMeasuresLogo.png" alt="LogoImage" width="80">';
    
    // creating the links for the header
    for(const [headerKey, headerValue] of Object.entries(data)) {
      HTMLoutput += '<a class="headerLinks" href="../listObjects/?type='+headerKey+'">'+headerKey.toUpperCase()+'</a>';
    }
  
    // closing header row
    HTMLoutput += '</p>';

    // H1 header to let the user know which object they're editing
    HTMLoutput += '<h1>Edit '+objType+' Item</h1>'
              + '</div>';

    var forOfLoop = checkLocalStorage(checkLocalStorageParams);


    // --------------------------------------- Item Header and Inputs ---------------------------------------


    // creating item header row
    HTMLoutput += '<div class="row">';

    // create HTML header and fields
    for (const [headerKey, headerValue] of Object.entries(forOfLoop)) {
      // console.log("This is headerKey", headerKey); // id, name, ... tags
      // console.log("This is headerValue", headerValue); // 1, COI: Static Site HTML Structure, ... [0]
      if (headerKey == 'id') {
        HTMLoutput += '<div class="col-4 minHeight">'
                      + '<div class="col-12">'+headerKey+'</div>';

      }
      else {
      HTMLoutput += '<div class="col-4 minHeight">';
                    // + '<div class="col-12">'+headerKey+'</div>';
      }
      
      if (configTypeData.editable.includes(headerKey) == true) {

        // making object item an input textbox

        var typeHeader = typeStuff[headerKey];
        
        // filling up the statusOptions array before calling selectAttribute()
        for (const [stuffKey, stuffValue] of Object.entries(typeHeader)) {
          if (headerKey == 'status' && stuffKey == 'opts') {
            statusOptions.push(stuffValue);
            // console.log("This is statusOptions: ", statusOptions);
          }
        }

        for (const [stuffKey, stuffValue] of Object.entries(typeHeader)) {
          // console.log("This is stuffKey: ", stuffKey); // (required, type, inpType)
          // console.log("This is stuffValue: ", stuffValue); // (true, string, text)


            // #####################################################################################################################


          if (stuffKey == "inpType") {
            // stuffValue: text, textarea, text, array, date, number

            // filling arrayOfOptions
            if (stuffValue == 'array') {

              // console.log("The information lines up..");
              for (const [tagKey, tagValue] of Object.entries(headerValue)) {
                // console.log("This is tagKey: ", tagKey); // positions in array
                // console.log("This is tagValue: ", tagValue); // values in those positions
                arrayOfOptions.push(tagValue);
              }
              // console.log("This is arrayOfOptions post-filled: ", arrayOfOptions);
              
              // Taking info from arrayOfOptions and using them to get the names from the list
              for (const [tagTypeKey, tagTypeValue] of Object.entries(tagTypeData)) {
                // console.log("This is tagTypeKey: ", tagTypeKey); // 0, 1, 2
                // console.log("This is tagTypeValue: ", tagTypeValue); // object 0, object 1, object 2
                // console.log("This is tagTypeValue['name']: ", tagTypeValue['name']);
                arrayFields.push(tagTypeValue['name']);
                // console.log("This is arrayFields: ", arrayFields);

                // filling arrayOfOptionsNames with tag names if arrayOfOptions includes the tag's ID number
                if (arrayOfOptions.includes(tagTypeValue['id'])) {
                  arrayOfOptionsNames.push(tagData[tagTypeValue['id']].name);
                }
              }
              // console.log("This is arrayOfOptionsNames: ", arrayOfOptionsNames);

            }

            var parameters = {
              sVal : stuffValue,  // text, textarea, array, ...
              hKey : headerKey, // id, name, description, ...
              hVal : headerValue,  // 1, COI: Static Site HTML Structure, ...
              fields : arrayFields,
              options: arrayOfOptions, // 0,1
              names: arrayOfOptionsNames, // Design Wireframes, Code Structure & Style
              scripts : "scripts",
              statOpts : statusOptions
            };
            HTMLoutput += inputFunction(parameters);
          }
        }
        
        // HTMLoutput += '<br><input class="col-12" id="input'+headerKey+'" type="textarea" value="'+headerValue+'" placeholder="'+headerKey+'" oninput="anyChange(this.placeholder)" onchange="showData()">';
      }
      else
      {

        // making object item a regular div
        HTMLoutput += '<br><div class="col-12">'+headerValue+'</div>';
      }

      // closing object item column
      HTMLoutput += '</div>';
    }

    // closing item header row
    HTMLoutput += '</div>';

    // Update button that will activate a function that outputs the value to the console
    HTMLoutput += '<div class="row">';

    HTMLoutput += '<div class="col-10"></div>'
                + '<div class="col-2"><button onclick="showValue()">Update</button></div>';

    HTMLoutput += '</div>';

    $('#HTMLdiv').append(HTMLoutput);
  }
}


// ------------------------------------------------ Add function ------------------------------------------------


function addFunction(variable) {
  console.log("This is variable: ", variable);
  var select = document.getElementById('scripts');
  elementIDNum = select.options[select.selectedIndex].id.replace(/optionValue_/, '');

  console.log("This is elementVal: ", elementIDNum);
  
  // use this value (0/1/2) from elementVal to add the values to task_0.tag
  var HTMLelement = '<div class="row"><div class="col-10">'+JSON.parse(localStorage.getItem(objType+'_'+objItemid)).tags[elementIDNum]+'</div><div class="col-2"><input type="button" id="remvBtn_'+elementIDNum+'" value="-" onclick="removeFunction('+elementIDNum+')"></div></div>';



}


// ----------------------------------------------- Remove function -----------------------------------------------


function removeFunction(val) {

}































// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% GOD %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


// takes the inpType and sends new parameters to the proper function
function inputFunction(params) {
  var newParams = {
    newHKey : params.hKey,
    newHVal : params.hVal
  };
  var arrayParams = {
    newHKey : params.hKey,
    newHVal : params.hVal,
    newScripts : params.scripts,
    newFields : params.fields,
    newNames: params.names
  };
  var optParams = {
    newHKey : params.hKey,
    newHVal : params.hVal,
    newStatOpts : params.statOpts,
    newFields : params.fields
  };

  // options: arrayOfOptions, // 0,1

  if (params.sVal == "text") {
    return textAttribute(newParams);
  }
  if (params.sVal == "textarea") {
    return textareaAttribute(newParams);
  }
  if (params.sVal == "number") {
    return numberAttribute(newParams);
  }
  if (params.sVal == "date") {
    return calendarAttribute(newParams);
  }
  if (params.sVal == "array") {
    return arrayList(arrayParams);
  }
  if (params.sVal == "option") {
    return selectAttribute(optParams);
  }
}


// ----------------------------------------------- Text Attribute -----------------------------------------------


function textAttribute(text) {
  var textHTML = '';

  textHTML  +='<div class="col-12">'
              + '<form action="#" method="post" class="demoForm">'
                + '<fieldset class="minHeight">'
                  + '<legend>'+text.newHKey+'</legend>'
                  + '<input type="text" class="col-12 textInput" id="input'+text.newHKey+'" value="'+text.newHVal+'" placeholder="'+text.newHKey+'" oninput="anyChange(this.placeholder)" onchange="showData()">'
                + '</fieldset>'
              + '</form>'
            + '</div>';

  return textHTML;
}


// --------------------------------------------- Textarea Attribute ---------------------------------------------


function textareaAttribute(textarea) {
  var textareaHTML = '';

  textareaHTML  +='<div class="col-12">'
                  + '<form action="#" method="post" class="demoForm">'
                    + '<fieldset class="minHeight">'
                      + '<legend>'+textarea.newHKey+'</legend>'
                      + '<textarea class="textareaInput" id="input'+textarea.newHKey+'" placeholder="'+textarea.newHKey+'" oninput="anyChange(this.placeholder)" onchange="showData()" rows="6" cols="20">'+textarea.newHVal+'</textarea>'
                    + '</fieldset>'
                  + '</form>'
                + '</div>';

  return textareaHTML;
}


// ------------------------------------------------ Select Attr ------------------------------------------------


function selectAttribute(options) {
  var selectHTML = '';
  var superKey = objType+ '_' +objItemid;
  var myString = localStorage.getItem(superKey);
  var myObject = JSON.parse(myString);
  var myObjectStatus = myObject[options.newHKey]; // in-progress

  selectHTML  +='<div class="col-12">'
                + '<form action="#" method="post" class="demoForm">'
                  + '<fieldset class="minHeight">'
                    + '<legend>'+options.newHKey+'</legend>'
                    + '<select id="input'+options.newHKey+'" name="'+options.newHKey+'" value="optionDisp" onchange="selectedOption(this.name)">';

  for (const [varsKey, varsValue] of Object.entries(options.newStatOpts[0])) {

    // checking if the option is the one existing in the localStorage... if it is then it puts the 'selected' attribute in the tag
    if (varsValue == myObjectStatus) {
      selectHTML      +='<option value="'+varsValue+'" selected>'+varsValue+'</option>';
    }
    else {
      selectHTML      +='<option value="'+varsValue+'">'+varsValue+'</option>';
    }
  }
  selectHTML        +='</select>'
                  + '</fieldset>'
                + '</form>'
              + '</div>';

  return selectHTML;
}


function selectedOption(str) {
  var selected = $('#inputstatus').find(':selected').text();
  var superKey = objType+ '_' +objItemid;
  var myString = localStorage.getItem(superKey);
  var myObject = JSON.parse(myString);
  var change = selected;
  myObject[str] = change;
  backToString = JSON.stringify(myObject);
  addToLocalStorage(superKey, backToString);
  console.log("status is now ", change);
  
}


// ------------------------------------------------ Number Attr ------------------------------------------------


function numberAttribute(num) {
  var numberHTML = '';

  numberHTML  +='<div class="col-12">'
                + '<form action="#" method="post" class="demoForm">'
                  + '<fieldset class="minHeight">'
                    + '<legend>'+num.newHKey+'</legend>'
                    + '<input type="number" id="input'+num.newHKey+'" value="'+num.newHVal+'" placeholder="'+num.newHKey+'" oninput="anyChange(this.placeholder)" onchange="showData()">'
                  + '</fieldset>'
                + '</form>'
              + '</div>';
  return numberHTML;
}


// ----------------------------------------------- Calendar Attr -----------------------------------------------


function calendarAttribute(date) {
  var calendarHTML = '';

  calendarHTML  +='<div class="col-12">'
                  + '<form action="#" method="post" class="demoForm">'
                    + '<fieldset class="minHeight">'
                      + '<legend>'+date.newHKey+'</legend>'
                      + '<input type="date" id="input'+date.newHKey+'" value="'+date.newHVal+'" name="'+date.newHKey+'" onchange="newDate(this.name)">'
                    + '</fieldset>'
                  + '</form>'
                + '</div>';

  return calendarHTML;
}


function newDate(date) {
  var selected = $('#inputdueDate').val();
  var superKey = objType+ '_' +objItemid;
  var myString = localStorage.getItem(superKey);
  var myObject = JSON.parse(myString);
  var change = selected;
  myObject[date] = change;
  backToString = JSON.stringify(myObject);
  addToLocalStorage(superKey, backToString);
  console.log("dueDate is now ", change);
  
}


// ------------------------------------------------- Array List -------------------------------------------------


function arrayList(array) {
  
  // console.log("This is the input for arrayList(array): ", array);

  var i = 0;
  var HTMLoutput = '';
  var HTMLarrayValues = '';
  var objectKeyNames = objType+'_'+objItemid+'_name';
  var name = [];

  HTMLoutput  +='<div class="col-12">'
                + '<form action="#" method="post" class="demoForm">'
                  + '<fieldset class="minHeight">'
                    + '<legend>'+array.newHKey+'</legend>'
                      + '<div id="outerDiv">'
                        + '<div id="appendTo">';

  // if objectKeyNames_name exists in localStorage {
    if (localStorage.getItem(objectKeyNames) != null) {
      // pull from localStorage
      itemValueNames = JSON.parse(localStorage.getItem(objectKeyNames));
      console.log("This is itemValueNames: ", itemValueNames);
    }
  else {
    // pull from array.newNames
    itemValueNames = array.newNames;
    console.log("This is array.newNames: ", array.newNames);
  }


  // showing all the items in the arrayOfOptionsNames array (none if the array is preset as empty)
  for (const[arrayKey, arrayValue] of Object.entries(itemValueNames)) {
    HTMLarrayValues       +='<div class="row"><div class="col-10">'+arrayValue+'</div><div class="col-2"><input type="button" id="remvBtn_'+arrayKey+'" value="-" onclick="removeFunction('+i+')"></div></div>';
    name.push(arrayValue);
    // counts up the indices if there's any preset values in the array
    i++;
  }
  addToLocalStorage(objectKeyNames, JSON.stringify(name));
  // removing the extra i++ that is called
  i--;
  
  HTMLoutput = HTMLoutput+HTMLarrayValues;

  // creating the select tag
  HTMLoutput            +='</div>'
                      + '</div>'
                      + '<br><select id="scripts" name="scripts">';

  // creating all the options from the arrayOfOptions array in the select tag
  var optionCount = 0;
  for (const [optionKey, optionValue] of Object.entries(array.newFields)) {
    HTMLoutput          +='<option id="optionValue_'+optionCount+'" value="'+optionValue+'">'+optionValue+'</option>';
    optionCount++;
  }

  // closing the form tags and creating the add button

  HTMLoutput          +='</select>'
                      + '<div id="buttonSpot">'
                      + '<input type="button" id="showTxt" value="Add" onclick="addFunction(this)"/>'
                    + '</div>'
                  + '</fieldset>'
                + '</form>'
              + '</div>';


  // HTMLoutput          +='</select>'
  //                     + '<div id="buttonSpot">'
  //                     + '<input type="button" id="showTxt_'+i+'" value="Add" onclick="addFunction(this)"/>'
  //                   + '</div>'
  //                 + '</fieldset>'
  //               + '</form>'
  //             + '</div>';

  return HTMLoutput;
}





// ----------------------------------------------- Old Add and Remove  -----------------------------------------------


// function addFunction(variable) {
//   // console.log("This is variable: ", variable); // <input type="button" id="....
//   // console.log("This is the variable.id: ", variable.id); // showTxt_3

//   var tagArray = [];
//   var superKey = objType+'_'+objItemid;
//   var superObjLoop = JSON.parse(localStorage.getItem(superKey));
//   // console.log("This is superObjLoop: ", superObjLoop);
//   var superKeyTags = superObjLoop.tags;
//   // console.log("This is superKeyTags: ", superKeyTags);

//   // populate tagArray with superKeyTags
//   for (const [tagKey, tagValue] of Object.entries(superKeyTags)) {
//     tagArray.push(tagValue);
//   }
//   console.log("This is tagArray post-population: ", tagArray);

//   var addArray = [];
//   var storageKey = objType+'_'+objItemid+'_name';
//   // console.log("This is storageKey: ", storageKey);
//   var objLoop = localStorage.getItem(storageKey);
//   // console.log("This is objLoop: ", objLoop);
//   var parseObjLoop = JSON.parse(objLoop);
//   // console.log("This is parseObjLoop: ", parseObjLoop);

//   // filling addArray with localStorage values
//   for(const [addKey, addValue] of Object.entries(parseObjLoop)) {
//     // addKey: 0, 1
//     // addValue: Design Wireframes, Code Structure & Style
//     addArray.push(addValue);
//   }

//   // grab only the number from the button's ID
//   var variableID = variable.id.replace(/showTxt_/, '');
//   variableID++;

//   // change input's id
//   variable.id = 'showTxt_'+variableID;

//   // access text property of selected option
//   var select = document.getElementById('scripts');
//   selOpt = select.options[select.selectedIndex];
//   elementVal = select.options[select.selectedIndex].text;

//   console.log("This is selOpt: ", selOpt);

//   var tagNumber = selOpt.id.replace(/optionValue_/, '');
//   console.log("This is tagNumber: ", tagNumber);

//   if (addArray.includes(elementVal)) {
//     console.log(elementVal+' exists in addArray already');
//   }
//   else {
//     addArray.push(elementVal);
//     tagArray.push(Number(tagNumber));
    
//     console.log("This is the new addArray: ", addArray);
//     console.log("This is the new tagArray: ", tagArray);

//     superObjLoop.tags = JSON.stringify(tagArray);

//     console.log("This is superObjLoop: ", superObjLoop);
  
//     // adding a new row and columns to the HTML
//     var HTMLelement = '<div class="row"><div class="col-10">'+elementVal+'</div><div class="col-2"><input type="button" id="remvBtn_'+variableID+'" value="-" onclick="removeFunction('+variableID+')"></div></div>';
//     $('#appendTo').append(HTMLelement);
//     addToLocalStorage(storageKey, JSON.stringify(addArray));
//   }
// }


// function removeFunction(val) {
//   console.log("This is val: ", val);
//   var superKey = objType+'_'+objItemid;
//   var storageKey = objType+'_'+objItemid+'_name';
//   var tagArray = [];
//   var removeArray = [];
//   var HTMLelement = '';
//   var i = 0;

//   // get the localStorage
//   var stringThing = localStorage.getItem(storageKey);

//   // parse
//   var parseThing = JSON.parse(stringThing);

//   // put localStorage into removeArray
//   removeArray = parseThing;

//   // getting the remove button at index 'val'
//   var element = document.querySelector('#remvBtn_'+val);

//   // deleting the whole area
//   element.parentNode.parentNode.parentNode.remove(element.parentNode.parentNode.parentNode);

//   // splice array and console.log()
//   removeArray.splice(val, 1);

//   // reshowing all the items
//   for (const [itemKey, itemValue] of Object.entries(removeArray)) {
//     HTMLelement += '<div class="row"><div class="col-10">'+itemValue+'</div><div class="col-2"><input type="button" id="remvBtn_'+itemKey+'" value="-" onclick="removeFunction('+itemKey+')"></div></div>';
//     i++;
//   }
//   i--;

//   // removing the child of buttonSpot
//   var buttonSpot = document.getElementById('buttonSpot');
//   var child = buttonSpot.firstChild;
//   buttonSpot.removeChild(child);

//   // recreating Add button
//   var addButton = '<input type="button" id="showTxt_'+i+'" value="Add" onclick="addFunction(this)"/>';
//   $('#buttonSpot').append(addButton);

//   // stringify removeArray into localStorage
//   addToLocalStorage(storageKey, JSON.stringify(removeArray));

//   // next 4 lines create a new div within outerDiv that has the id="appendTo"
//   var tag = document.createElement('div');
//   tag.setAttribute("id", "appendTo");
//   var elm = document.getElementById("outerDiv");
//   // console.log("This is elm: ", elm);
//   elm.appendChild(tag);

//   var superObjLoop = JSON.parse(localStorage.getItem(superKey));
//   var superKeyTags = superObjLoop.tags;
//   tagArray = superKeyTags;
//   console.log("This is tagArray: ", tagArray);
//   tagArray.splice(val, 1);
  
//   // append HTMLelement to created div
//   $('#appendTo').append(HTMLelement);
// }