//*****************************************
//
//  GLOBAL VARIABLE DECLARATION
//
//  Note: As part of refactor I need to consolidate all of these
//
//*****************************************


var previouslySelectedList;
var parentElem;
var initialInput = true;
var clearSearchClicked = false;

var listMenuElement = document.getElementById('taskListDropdown');
var sysMenuElement = document.querySelector('.sysMenu');
var clearSearchIcon = document.querySelector(".clearSearchIcon");
var searchInput = document.getElementById("search");


//function localStorageSupported() {
//	try {
//		return "localStorage" in window && window["localStorage"] !== null;
//	} catch (e) {
//		return false;
//	}
//}

function toggleClass(element, className) {
	if (!element || !className) {
		return;
	}

	var classString = element.className,
		nameIndex = classString.indexOf(className);
	if (nameIndex == -1) {
		classString += ' ' + className;
	} else {
		classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
	}
	element.className = classString;
}

function isEmpty(idValue) {
	if (document.getElementById(idValue).value.length === 0) {
		return true;
	} else {
		return false;
	}
}


// Clear the contents of the Search input area
function clearSearchContents() {
	searchInput.value = null;
}


function removeClearSearchIcon() {
	clearSearchIcon.style.display = "none";
}

function hideClearSearchIcon() {
	clearSearchIcon.style.visibility = "hidden";
}

function addClearSearchIcon() {
	clearSearchIcon.style.display = "inline-block";
}

function showClearSearchIcon() {
	clearSearchIcon.style.visibility = "visible";
}

removeClearSearchIcon();


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

//*********************************************************************
//
// User clicks on submenu element to make it current list in Navbar
//
//*********************************************************************
// Hardcoding childNode #'s is a brittle solution because simple changes to HTML can break this code.
// Need to find an alternative solution 

var handleSubMenuClick = function (event) {
	// Get name of submenu list selected
	var listNameSelected = event.target.childNodes[1].textContent;

	//	console.log("Event.target = ", event.target);
	// Get handle for current List Menu 


	// Get location of List menu title 
	var listMenuTitle = listMenuElement.childNodes[2];

	//	console.log(listMenuElement.childNodes);

	// Make the List menu title equal to submenu name selected
	listMenuTitle.nodeValue = listNameSelected;

	// Toggle previously selected list item to remove "selected" class & remove the darkended background
	toggleClass(previouslySelectedList, 'selected');

	// The selected list name will have the "selected" class added to darken background so when 
	// user hovers and gets the submenu to display the previously selected list will be distinguishable 
	toggleClass(event.target, 'selected');

	// Save the selected list element in previouslySelectedList variable 
	previouslySelectedList = event.target;

	// *****************************************************************************************
	// Code below was attempt to hide submenu once user click on one of the list in the submenu
	//******************************************************************************************	
	// Get the parent of submenu so that I can hide it
	parentElem = event.target.parentElement;
	//  Add hideIt class so that 	
	//	toggleClass(parentElem,"hideIt"); 
};


//*********************************************************************
//
// HANDLE SEARCH FOCUS:
// This function is called when the SearchIcon is clicked and Search input receives focus
//
//*********************************************************************

var handleSearchFocus = function (event) {
	console.log("In handleSearchFocus function");

	// Show original Nav bar settings if user clicked somewhere other than clearSearchIcon
	// Note: if the user clicked the clear search icon then you want the original Navbar elements to remain hidden (hence no else condition)
	if (!clearSearchClicked) {

		// Hide (via display:none) other elements of Navbar so Search is focus 
		toggleClass(listMenuElement, "hideIt");
		toggleClass(sysMenuElement, "hideIt");

		// Add the clearSearch icon to the navbar but hide it until user enters data in search bar
		addClearSearchIcon();
		hideClearSearchIcon();

		// Each time submit button (searchIcon) is clicked it will clear any previously
		searchInput.value = null;
	}
};


//*********************************************************************
//
// HANDLE SEARCH BLUR:
// This function is called when user clicks on area outside of search input area
//
//*********************************************************************


var handleSearchBlur = function (event) {

	// Assume that click was not on clearSearchIcon 
	clearSearchClicked = false;

	console.log("In handleSearchBlur function");

	console.log("Event: ", event);

	// NOTE: Unfortunately when focus is lost the blur method obscures the click event that  
	// caused it to lose focus (i.e., event.target). 
	// So to workaround this behavior a setTimeoutfunction is used. This allows the blur method
	// to complete and then the event handler for the click to run so that the event.target can
	// be captured/"noted" (via flags) and logic for handling the event can be added to the timeOut 
	// function. This was the only solution I couldfind on StackOverflow for this "well-known" //problem. 

	setTimeout(function () {
		console.log("----->EVENT THAT FIRED", document.activeElement);
		// If the user click on something other than the clearSearch icon you want to restore orig navBar elements.
		if (!clearSearchClicked) {
			// 2 toggles will cause the listMenu & sysMenu elements to reappear
			toggleClass(listMenuElement, "hideIt");
			toggleClass(sysMenuElement, "hideIt");
			// This will remove the clearSearch icon (display: none)
			removeClearSearchIcon();
		} else { // User wants to clear Search area and enter diff search criteria. So maintain focus on Search area.
			searchInput.focus();
		}
	}, 0);
};

//*********************************************************************
//
// DETECT SEARCH INPUT
// Called on "keyUp" event...so it's called after something has been entered in the search box
//
//*********************************************************************

var detectSearchInput = function (event) {

	// At this point at least one keystroke has been entered..if there is only one keystroke
	// then you know it was previously empty and this is the first character entered and thus
	// the clearSearchIcon should be displayed


	if (searchInput.value.length === 1) {
		addClearSearchIcon();
		showClearSearchIcon();

	}
	if (isEmpty("search")) {
		hideClearSearchIcon();
	}

};

//*********************************************************************
//
// CLEAR SEARCH FIELD 
// Called on "keyUp" event...so it's called after something has been entered in the search box
//
//*********************************************************************


var clearSearchField = function (event) {
	// Set flag so we know that clearSearchIcon was clicked
	clearSearchClicked = true;

	console.log("In ClearSearchField method");
	console.log("ClearSearchField target === ", event.target);


	// Clear the contents of the search area if user clicks clear search icon
	clearSearchContents();

	// Re-hide clear search box icon
	hideClearSearchIcon();

};
//*********************************************************************
//
//* SET UP EVENTLISTENERS
//
//*********************************************************************

// EventListener for List Submenu 
document.querySelector(".subMenuElements").addEventListener('click', handleSubMenuClick);

// Event Listener for Search onFocus and OnBlur
searchInput.addEventListener("focus", handleSearchFocus);
searchInput.addEventListener("blur", handleSearchBlur);
searchInput.addEventListener("keyup", detectSearchInput);
clearSearchIcon.addEventListener("click", clearSearchField);


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
