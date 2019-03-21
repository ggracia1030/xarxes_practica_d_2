var db = require("./database.js");


printWelcomeMessage();
interactiveConsole();

function input(question, callback)
{
  var stdin = process.stdin, stdout = process.stdout;
  stdin.resume();
  stdout.write(question);
  stdin.once('data', function(data)
  {
    data = data.toString().trim();
    callback(data);
  });
}

function interactiveConsole()
{
  input( ">> ", function(data) {

    var parts=data.trim().split(' ');
    if (parts[0]) parts[0]=parts[0].toUpperCase();

    switch (true) {
        case (parts[0]=="Q"):
          process.exit(0);
          break;
        case(parts[0] == "LIST"):
          printList(db.List());
          interactiveConsole();
          break;
        case(parts[0] == "ADD"):
          addCharacter(parts[1], parts[2], parts[3]);
          interactiveConsole();
          break;
        case(parts[0] == "DEL"):
          delCharacter(parts[1]);
          interactiveConsole();
          break;
        case(parts[0] == "SAVE"):
          saveFile(parts[1]);
          break;
        case(parts[0] == "LOAD"):
          loadFile(parts[1]);
          break;
        default:
          console.log("Incorrect command");
          interactiveConsole();
          break;
      }
  });
}

function printWelcomeMessage() {
          console.log(`Avaialble commands:
  Q     Exits the program
  ADD   Add a character to list
  LIST  Prints the list of characters
  DEL   Deletes a character from list
  SAVE  Saves the current list to a file
  LOAD  Load the list from a file`);
}

function printList(list) {
  console.log("------------------\n  List of characters:");
  for(var i = 0; i < list.length; i++) {
    console.log("-" + list[i].name.toString());
  }
  console.log("------------------");
}

function delCharacter(tempName) {
  if(tempName == undefined || tempName == null) {
      console.log(`Error. You have to write the name. Like this: 
      DEL name`);
      return;
    }
  db.DeleteCharacter(tempName);
}

function addCharacter(tempName, tempPower, tempType) {
  if(tempName == undefined || tempPower == undefined || tempType == undefined ||
    tempName == null || tempPower == null || tempType == null) {
      console.log(`Error. You have to write the name, the power and the type like this: 
      ADD name power type `);
      return;
    }
  db.AddCharacter(tempName, tempPower, tempType);
}

function saveFile(fileName) {
  /*if(fileName == undefined || fileName == null) {
    console.log(`Error. You have to write the file name. Like this: 
    SAVE fileName`);
    return;
  }*/
  db.SaveFile(interactiveConsole);
}

function loadFile(fileName) {
  /*if(fileName == undefined || fileName == null) {
    console.log(`Error. You have to write the file name. Like this: 
    LOAD fileName`);
    return;
  }*/
  db.LoadFile(interactiveConsole);
}