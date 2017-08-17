//function localStorageSupported() {
//	try {
//		return "localStorage" in window && window["localStorage"] !== null;
//	} catch (e) {
//		return false;
//	}
//}


// There is no standard method for inserting elements after another element so this function does this  
function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

//var List = function (name, dueCount, overDueCount) {
//	this.name = name;
//	this.count = dueCount;
//	this.overDueCount = overDueCount;
//};
//*****************************************
//
//  DATA ELEMENTS & LOAD INTO LOCAL STORAGE
//
//*****************************************
// Array containing all predfinded list - Not using this right now.
var defaultTaskListNames = ["All Lists", "Default", "Finished", "New List"];

// User defined list data
var userDefinedTaskListName = ["Personal", "Shopping", "Wishlist", "Work"];
var numOfTasks = [2, 1, 3, 0];
var overDueCount = [0, 8, 10, 18];

// Load the user defined task list names into local storage 
for (var i = 0; i < userDefinedTaskListName.length; i++) {
	localStorage.setItem(userDefinedTaskListName[i], userDefinedTaskListName[i]);
	localStorage.setItem("count" + i, numOfTasks[i]);
	localStorage.setItem("overDue" + i, overDueCount[i]);
}

//**************************
//
// First two List elements are predefied in app. User defined list inserted after those two lists
// Code below identifies starting point where user defined list will start
//
//**************************

// Parent Element <ul> of list submenu
var parentElement =
	document.querySelector(".subMenuElements");


// Get first default list element ("All List")
var firstListElement = parentElement.firstElementChild;

// Get the 2nd default list element ("Default List") so we can add after 
var nextNode = firstListElement.nextElementSibling;


var blankSubMenuElement, specificSubMenuElement, newNode;

// Generic HTML for subMenu elements with placeholders for data
var genericSubMenuHtml = '<li><i class="fa fa-list-ul" aria-hidden="true"></i>%listName%<span class="overDue">&nbsp%overDueCount%</span><span class="listTotal">&nbsp%dueCount%</span></li>';

//***********************************************************
//
// Create submenu elements and add them to drop down menu
//
//***********************************************************
for (var i = 0; i < userDefinedTaskListName.length; i++) {

	// Insert the list name
	specificSubMenuHtml = genericSubMenuHtml.replace('%listName%', localStorage.getItem(userDefinedTaskListName[i]));

	// Insert the overdue task list count in HTML
	// If count is zero you want to add class to overdue item so that 0 count and "+" sign do not appear
	if (localStorage.getItem("overDue" + i) !== "0") {
		specificSubMenuHtml = specificSubMenuHtml.replace('%overDueCount%', localStorage.getItem("overDue" + i));
	} else { // Else the count is zero then don't display it (hideIt)
		specificSubMenuHtml = specificSubMenuHtml.replace('%overDueCount%', localStorage.getItem("overDue" + i));
		specificSubMenuHtml = specificSubMenuHtml.replace("overDue", "overDue hideIt");
		//		addHideIt(specificSubMenuElement);
	}

	// Insert the task list count due (but not overdue) in HTML
	if (localStorage.getItem("count" + i) !== "0") {
		specificSubMenuHtml = specificSubMenuHtml.replace('%dueCount%', localStorage.getItem("count" + i));
	} else { // Else the count is zero then don't display it (hideIt) 
		specificSubMenuHtml = specificSubMenuHtml.replace('%dueCount%', localStorage.getItem("count" + i));
		specificSubMenuHtml = specificSubMenuHtml.replace("listTotal", "listTotal hideIt");
		//		addHideIt(specificSubMenuElement);

	}

	//* Convert HTML string into DOM node so it can be inserted
	newNode = document.createRange().createContextualFragment(specificSubMenuHtml);

	// Insert new list none after the "All List" element
	insertAfter(newNode, nextNode);

	// Now make the node we just inserted the nextNode
	nextNode = nextNode.nextElementSibling;

}



//$('#datepicker').datepicker();

// Note: that the taskItController & uiControllers are designed to be independent.
// This is done so that for example you can expand the capabilities of the
// taskItController without affecting the UI.
//*********************************************************************
//
// TASKIT CONTROLLER 
//
//*********************************************************************

var taskItModel = (function () {

})();


//*********************************************************************
//
// UI CONTROLLER
//
//*********************************************************************

var uiController = (function () {
	var DOMstrings = {

	};

})();



// AppController connects the taskItModel and UIcontrollers together;
// It wasn't necessary to pass other controllers in as params but doing so
// creates more independence and separation of control. Also note that 
// taskIt and ui controller param names are slightly diff than names of these controllers

//*********************************************************************
//
// GENERAL APP CONTROLLER
//
//*********************************************************************

var appController = (function (taskItMdl, UICtrl) {
	var setupEventListeners = function () {

	};

	return {
		// Initialize data objects and set up all event listeners
		init: function () {
			setupEventListeners();
		}
	};
})(taskItModel, uiController);

// Main App flow
appController.init();
