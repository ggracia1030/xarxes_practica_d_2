var Character = require("./character");
var config = require('./config.js');
//var fs = require('fs');

var characters = [];

const { Pool, Client } = require('pg')
function query(query, params, callback, finalCallback) {
    const connectionString = "postgres://" + config.config.db.username + ":" + config.config.db.password + "@" + config.config.db.host + ":" + config.config.db.port + "/" + config.config.db.name + "?ssl=true";
    
    console.log(connectionString);
    const client = new Client({
      connectionString: connectionString,
    })
    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack);
            callback(err, finalCallback);
        }
    })
 
    client.query(query, params, (err, res) => {
        if (err) {
            console.log(err.stack)
            callback(err, finalCallback);
        } else {
            callback(err, res, finalCallback);
            client.end(); /*Aquesta funció te la vas deixar i  per tant, petava ja que 
            heroku nomes permet 20 connexions i constantment estas obrint connexions pero
            no les tanques (una molt mala pràctica) i aleshores es queden infinites connexions
            escoltant pero sense utilitzar-les. Encara que utilitzar la mateixa connexió reutilitzant-la
            seria molt més òptim.
            */
        }
    });
};

function AddCharacter(_name, _power, _type) {
    for(var i = 0; i < characters.length; i++){
        if(characters[i].name.toString() == _name.toString()) {
            console.log("This character already exists.");
            return;
        }
    }
    characters.push(new Character(_name, _power, _type));
    console.log("Character " + _name + " | power: " + _power + " | type: " + _type + " added to list.");
}

function DeleteCharacter(_name) {
    for(var i = 0; i < characters.length; i++) {
        if(characters[i].name.toString() == _name.toString()) {
            characters.splice(i, 1);
            console.log("Character " + _name + " deleted from list.");
            return;
        }
    }
    console.log("Character " + _name + " does not exists.");
}

function List() {
    return characters;
}

function ClearDB(_console) {
    var queryString = "delete from characters;";
    query(queryString, [], SaveDB, _console);
}

function SaveDB(err, data, _console) {
    if(err) {
        console.log("Error clearing DB...");
    }
    else {
        var queryString = "insert into characters(name, power, type) values ";
        for(var i = 0; i < characters.length; i++) {

            queryString += ("('" + characters[i].name + "', " + characters[i].power + ", '" + characters[i].type+ "')");
            if(i < characters.length - 1) queryString += ", ";
        }
        queryString += ";";
        console.log(queryString);
        query(queryString, [], onSave, _console);
    }
    return;
}

function LoadDB(_console) {
    var queryString = "";
    queryString = "select * from characters";
    
    query(queryString, [], onLoad, _console);
    
    return;
}

function onSave(err, data, callback) {
    if(err) {
        console.log("Error Saving...");
    }
    else {
        console.log("Saved Correctly");
        callback();
    }
}

function onLoad(err, data, callback) {
    if(err) {
        console.log("Error on Load");
    }
    else {
        characters = [];
        for(var i = 0; i < data.rows.length; i++) {
            AddCharacter(data.rows[i].name, data.rows[i].power, data.rows[i].type);
        }
        callback();
    }
}


exports.List = List;
exports.DeleteCharacter = DeleteCharacter;
exports.AddCharacter = AddCharacter;
exports.SaveFile = ClearDB;
exports.LoadFile = LoadDB;