function init() {
    // the next line makes it impossible to see Contacts on the HTC Evo since it
    // doesn't have a scroll button
    // document.addEventListener("touchmove", preventBehavior, false);
	
//	alert("Platform: " + device.platform);
	
	window.addEventListener('load', function () {
	    document.addEventListener('deviceready', onDeviceReady(), false);
	}, false);
//    document.addEventListener("deviceready", onDeviceReady, true);
	
    loadData(); // For web browsers. Devices will not be ready, and will do nothing.
    
	/* Load from the store, and create buttons */
	//$('#button_list').append('<li><a href="#">Test</a></li>');
	//$('#button_list').listview('refresh');  // Must be called after editing the list
	
	//var db = window.openDatabase("test", "1.0", "Test DB", 1000000);  // Name, version, display name, size
	//db.transaction(populateDB, errorBC, successCB);
}

//
// PhoneGap is ready
//

function onDeviceReady() {
}

function loadData() {

	var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);

	// For resetting the DB
//	db.transaction(populateDB, errorCB, loadButtonData);
	
	// This line restores buttons from saved
    db.transaction(createEmptyTablesIfNotPresent, errorCB, loadButtonData);
//	loadButtonData();
}

// Populate the database 
//

function createEmptyTablesIfNotPresent(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS BUTTONS (id unique, label, code, row, col)');
}

function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS BUTTONS');
    tx.executeSql('CREATE TABLE IF NOT EXISTS BUTTONS (id unique, label, code, code_type, row, col)');
    tx.executeSql('INSERT INTO BUTTONS (id, label, code, code_type, row, col) VALUES (1, "Database Refreshed", "", 0, 0, 0)');
}

//Populate the database 
//
function loadCodes(tx) {
    tx.executeSql('SELECT * FROM BUTTONS', [], loadCodesSuccess, errorCB);
}

function loadCodesSuccess(tx, results) {
    // this will be empty since no rows were inserted.
    //console.log("Insert ID = " + results.insertId);
    // this will be 0 since it is a select statement
    console.log("Rows Affected = " + results.rowAffected);
    // the number of rows returned by the select statement
    console.log("Insert ID = " + results.rows.length);
    
    var buttons = [];  // [cols][rows]
    
    for(var rows = 0; rows < 10; rows++){
    	buttons[rows] = [];
    }
    
    // Scrap whatever is in the UI, and reload from database
    for(var i = 0; i < results.rows.length; i++){
    	butt = results.rows.item(i);
    	buttons[butt.col][butt.row] = butt;
    }
    
    $('#button_grid').empty();
    $('#layout_button_grid').empty();
    
    for(var row = 0; row < 5; row++){
    	for(var col = 0; col < 2; col++){
    		if(col == 0){
    			block = 'a';
    		} else if (col == 1){
    			block = 'b';
    		} else if (col == 1){
    			block = 'c';
    		} else if (col == 1){
    			block = 'd';
    		} else {
    			block = 'a';
    		}
    		if(buttons[col][row]){
    			$('#button_grid').append('<div class="ui-block-'+ block +'"><button type="submit" data-theme="c" onclick="sendCode('+buttons[col][row].code_type+',\''+buttons[col][row].code+'\')">' + buttons[col][row].label + '</button></div>');
    			$('#layout_button_grid').append('<div class="ui-block-'+ block +'"><button type="submit" data-theme="b" onclick="editButton('+buttons[col][row].row+','+buttons[col][row].col+','+buttons[col][row].type+',\''+buttons[col][row].code+'\',\''+buttons[col][row].label+'\')">' + buttons[col][row].label + '</button></div>');
    		} else {
    			$('#button_grid').append('<div class="ui-block-'+ block +'"></div>');
    			$('#layout_button_grid').append('<div class="ui-block-'+ block +'"><button type="submit" data-theme="a" href="#options_add_button_popup" data-role="button" data-rel="dialog" data-transition="pop" onclick="setNextButtonLoc(' + row + ', ' + col + ');">+</button></div>');
    		}
    	}
    }
    
    // refresh all buttons
    buts = $('button').button();
}

function sendCode(type, code){
//	alert("sendCode: " + row + ", " + col)
//    $.get({
//        type: "GET",
//        url: "http://192.168.0.50/send?c=0x4B36D32C&p=1",
//        timeout:6000,
//        cache: false,
//        dataType: "html",
//        success: sendCodeSuccess,
//        error: sendCodeError
//      });
    
    var jqxhr = $.get("http://192.168.0.50/send?c=0x"+code+"&p=" + type, function(msg) {
    	// Code sent successfully
//        alert("Success: " + "http://192.168.0.50/send?c=0x"+code+"&p=" + type);
      })
      .error(function() { alert("Error sending code!"); });
}

function learnCode(){
	$("#layout_learn_button").text("Waiting...");
//	$("#layout_learn_button").button();
	
	$( "#layout_learn_button" ).bind( "click", function(event, ui) {
		  // Do nothing, for now
		});
	
    var jqxhr = $.get("http://192.168.0.50/learn", function(msg) {
//        alert("Learned: " + msg);
        var remoteCode = "";
        var type = -1;
        if(msg.indexOf("unknown") >= 0){
        	remoteCode = "Unknown";
        	type = -1;
        } else {
        	remoteCode = msg.substring(msg.indexOf("<h2>") + 4, msg.indexOf("</h2>"));
        	type = msg.substring(msg.indexOf("[") + 1, msg.indexOf("]"));
        }
        
        $("#button_remote_code").val(remoteCode);
        $("#button_type").val(type);

//    	$( "#layout_learn_button" ).bind( "click", function(event, ui) {
//  		  	alert("Too late!");
//  		});
      })
      .error(function(msg) { alert("Error learning code! " + msg); })
      .complete(function() { 
      	$("#layout_learn_button").text("LEARN...");
//    	$("#layout_learn_button").button();
      });
    
    
//	$("#layout_learn_button").text("LEARN...");
//	$("#layout_learn_button").button();

}

function editButton(row, col, type, code, label){
//	alert("Edit Button: " + row + ", " + col + ", " + code + ", " + label)
	// Choices:  rename, move, delete
	$("#edit_type").val(type);
	$("#edit_code").val(code);
	$("#edit_label").val(label);
	$("#edit_row").val(row);
	$("#edit_col").val(col);
	$.mobile.changePage("#edit_button", "pop", false, false);
}

function renameButton(){
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(renameButtonInDB, errorCB);
    db.transaction(loadCodes, errorCB, toLayout); // Refresh
}

function renameButtonInDB(tx) {
	var row = $("#edit_row").val();
	var col = $("#edit_col").val();
	var newName = $("#rename_button_name").val();

    tx.executeSql('UPDATE BUTTONS SET label = "' + newName + '" WHERE ROW = ' + row + ' AND COL = ' + col);
}

function moveButton() {
	alert("Not yet implemented"); // TODO BRAD
}

function deleteButton(){
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(deleteEditedCodeFromDB, errorCB);
    db.transaction(loadCodes, errorCB, toLayout); // Refresh
}

function deleteEditedCodeFromDB(tx) {
//	var type = $("#edit_type").val();
//	var code = $("#edit_code").val();
//	var label = $("#edit_label").val();
	var row = $("#edit_row").val();
	var col = $("#edit_col").val();
	
    tx.executeSql('DELETE FROM BUTTONS WHERE ROW = ' + row + ' AND COL = ' + col);
}

function setNextButtonLoc(row, col){
	$("#button_col").val(col);
	$("#button_row").val(row);
	
	$.mobile.changePage("#options_add_button_popup", "pop", true, false);
}


// Transaction error callback
//
function errorCB(tx, err) {
    alert("Error processing SQL: " + tx.message);
}

// Transaction success callback
//
function loadButtonData() {
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(loadCodes, errorCB);
}

function addButtonData(){
	var name = $("#button_name").val();
	var code = $("#button_remote_code").val();
	
	if(name == null || name == ""){
		alert("Please enter a button name");
		return;
	}
	
	if(code == null || code == ""){
		alert("Please enter a button code");
		return;
	}
	
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(addCode, errorCB);
    db.transaction(loadCodes, errorCB, toLayout);
}

function toLayout(){
	$.mobile.changePage("#layout", "flip", true, false);
}

function addCode(tx){
	var col = $("#button_col").val();
	var row = $("#button_row").val();
	
	var name = $("#button_name").val();
	var code = $("#button_remote_code").val();
	
//    tx.executeSql('INSERT INTO BUTTONS (label, code, code_type, row, col) VALUES ("fdsa", 4444, 0, 3, 1)');
    tx.executeSql('INSERT INTO BUTTONS (label, code, code_type, row, col) VALUES ("' + name + '", "' + code + '", 1, ' + row +', ' + col + ' )');
}

function purgeAllData(){
	var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
	db.transaction(populateDB, errorCB, loadButtonData);
}
