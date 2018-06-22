//**************************************************************************************
//
//  GLOBAL VARIABLE DECLARATION
//
//  Note: As part of refactor I need to elimnate as many of these as possible
//
//**************************************************************************************

// Holds the node of the previously selected list item. If value is null then previous list is "All List"
var errorCount = 0;
var appInitialized = false;
var taskListId;
var previouslySelectedList = null;
var parentElem;
var initialInput = true;
var clearSearchClicked = false;
var searchExitClicked = false;
var searchIconClicked = false;
//var searchSubmitClick = false;

// Needed to restore active/"selected" list after completing search alternative would 
// be to get this value by search list DOM (class="selected") or saving value permanently
// in listTable and doing a lookup to get the active list. 
var activeListId = null;

var homeIcon = document.getElementById('homeIcon');
var backArrowSearch = document.getElementById('backArrowSearch');
//var listMenuElement = document.getElementById('taskListDropdown');
var sysMenuElement = document.querySelector('.sysMenu');
var clearSearchIcon = document.querySelector(".clearSearchIcon");
var searchInput = document.getElementById("search");
var searchIt = document.querySelector(".searchIt");
var searchForm = document.querySelector("#searches");
//var searchSubmit = document.getElementById("search_submit");
var taskCategoryHeader = document.querySelectorAll(".taskCategory");
var floatAddBtn = document.querySelector(".floatAddBtn");

var navBar = document.querySelector(".navBar");

var homePage = document.querySelector("#homePage");
var addNewTaskBtn = document.querySelector(".addNewTaskButton");
var addNewTaskPage = document.querySelector("#newTaskPage");
var newTaskBackArrow = document.querySelector(".newTaskBackArrow");

var editTaskPage = document.querySelector("#editTaskPage");
var editTaskBackArrow = document.querySelector(".editTaskBackArrow");


var formSaveNewTask = document.querySelector("#formSaveNewTask");
//var inputNewTaskTitle = document.getElementById("newTaskTitle");
//var formListSelectionDropDown = document.getElementById("newListNameSelection");
var addTaskSaveMenuButton = document.querySelector("#addTaskMenuSaveButton");

var addTaskSaveButton = document.querySelector("#addTaskSaveButton");
var addTaskResetButton = document.querySelector("#addTaskResetButton");

var searchString;
var userInput;
var listItemsToCategorize;


function isEmpty(str) {
	return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
}


/* 
	Manages steps to display a new set of task items (e.g, user choses to display a diff task list). 
*/
function updateTaskListDisplayed(taskListId) {

	var listName;
	var taskList2Display;
	var thereAreNoTaskItems2Display = true;

	// Clear the screen of any task previously displayed
	appUIController.clearOutExistingScreenContent(appUIController.getUIVars().mainPage, "dueTimeFrameLabel", "card");

	listName = utilMethods.lookUpTaskName(appModelController.getTaskListTable(), taskListId);

	if (listName === "Completed") {
		taskList2Display = appUIController.getTaskItemsMarkedAsComplete();
		if (taskList2Display.length > 0) {
			thereAreNoTaskItems2Display = false;
			appUIController.getUIVars().mainPageGeneralMsgLoc.innerHTML = "";
			appUIController.buildAndDisplayTaskItems("mainPage", taskList2Display);
		}
	} else {
		// Gather all taskItems related to the user selected list
		taskList2Display = getAllActiveMatchingTaskItemsWithId(taskListId);

		if (taskList2Display.length > 0) {
			thereAreNoTaskItems2Display = false;
			appUIController.getUIVars().mainPageGeneralMsgLoc.innerHTML = "";
			// Group and display all tasks items and their Group header (e.g, overdue, tomorrow, etc)
			appUIController.groupAndDisplayTaskItems(taskList2Display);
		}
	}


	if (thereAreNoTaskItems2Display) {


		switch (listName) {
			case "All Lists":
				// Display No task items in the list message
				appUIController.getUIVars().mainPageGeneralMsgLoc.innerHTML = '<i class="fa fa-info-circle"></i>' + '&nbsp;' + "Currently there are no task items defined." + '<br /><br />' + '<i class="fa fa-bullseye"></i>' + '&nbsp;' + "Click the Plus symbol to add a task to an existing list or to list you create";
				break;
			case "Completed":
				// Display No task items in the list message
				//			appUIController.getUIVars().mainPageGeneralMsgLoc.innerHTML = '<i class="fa fa-info-circle"></i>' + '&nbsp;' + "Currently there are no 'Complete' task items." + "<br /><br />" + '<i class="fa fa-bullseye"></i>' + '&nbsp;' + "Each time you mark a task item as 'Complete' it'll be added to this list."
				appUIController.getUIVars().mainPageGeneralMsgLoc.innerHTML = '<div><i class="fa fa-info-circle"></i> &nbsp; Currently there are no Complete task items<br /><br /><i class="fa fa-bullseye"></i>&nbsp;Each time you mark a task item as Complete it will be added to this list.</div>'

				break;
			default:
				// Display No task items in the list message
				appUIController.getUIVars().mainPageGeneralMsgLoc.innerHTML = '<i class="fa fa-info-circle"></i>' + '&nbsp;' + "Currently there are no task items in this list." + "<br /><br />" + '<i class="fa fa-bullseye"></i>' + '&nbsp;' + "Click the Plus symbol below to add some now.";
		}
	}
}

function getAllActiveMatchingTaskItemsWithId(taskList_id) {
	var listItemsToCategorize = appModelController.getTaskItemsTable().filter(function (taskItem) {
		if (taskList_id === "01" && taskItem.taskItem_completedDate === "") {
			return taskItem;
		} else if (taskItem.taskList_id === taskList_id && taskItem.taskItem_completedDate === "") {
			return taskItem;
		}
	});

	console.log("Returned listItemsToCategorize: ")
	console.log(listItemsToCategorize);
	console.log("number of taskItems: " + listItemsToCategorize.length);
	return listItemsToCategorize;
}

function getAllNonActiveMatchingTaskItemsWithId(taskList_id) {
	var listItemsToCategorize = appModelController.getTaskItemsTable().filter(function (taskItem) {
		if (taskList_id === "1" && taskItem.taskItem_completedDate !== "") {
			return taskItem;
		} else if (taskItem.taskList_id === taskList_id && taskItem.taskItem_completedDate !== "") {
			return taskItem;
		}
	});

	console.log("Returned listItemsToCategorize: ")
	console.log(listItemsToCategorize);
	console.log("number of taskItems: " + listItemsToCategorize.length);
	return listItemsToCategorize;
}



/* 
	Collect all task items of list the user selected  
*/
function getMatchingTaskItemsWithID(taskList_id) {
	console.log("In getMatchingTaskItemsWithID");


	var listItemsToCategorize = appModelController.getTaskItemsTable().filter(function (taskItem) {
		if (taskList_id === "1") {
			return taskItem;
		} else if (taskItem.taskList_id === taskList_id) {
			return taskItem;
		}
	});

	console.log("Returned listItemsToCategorize: ")
	console.log(listItemsToCategorize);
	console.log("number of taskItems: " + listItemsToCategorize.length);
	return listItemsToCategorize;
}



var today = new Date();
var todayYear = today.getFullYear();
var todayMonth = today.getMonth();
var todayDate = today.getDate();
var todayYMD = new Date(today.getFullYear(), today.getMonth(), today.getDate());


var yesterday = new Date(todayYear, todayMonth, todayDate - 1);
var today = new Date(todayYear, todayMonth, todayDate);

var tomorrow = new Date(todayYear, todayMonth, todayDate + 1);
var within1Week = new Date(todayYear, todayMonth, todayDate + 7);
var within2Weeks = new Date(todayYear, todayMonth, todayDate + 14);
var within1Month = new Date(todayYear, todayMonth, todayDate + 30);
var within2Months = new Date(todayYear, todayMonth, todayDate + 60);
var later = new Date(todayYear, todayMonth, todayDate + 3600);
var noDate = "";

var dueDateCategories = {
	"overDue": {
		"dueDate": yesterday,
		"categoryLabel": "Overdue"
	},
	"today": {
		"dueDate": today,
		"categoryLabel": "Due Today"
	},
	"tomorrow": {
		"dueDate": tomorrow,
		"categoryLabel": "Due Tomorrow"
	},
	"within1Week": {
		"dueDate": within1Week,
		"categoryLabel": "Due within 7 days"
	},
	"within2Weeks": {
		"dueDate": within2Weeks,
		"categoryLabel": "Due within 14 days"
	},
	"within1Month": {
		"dueDate": within1Month,
		"categoryLabel": "Due within 30 days"
	},
	"within2Months": {
		"dueDate": within2Months,
		"categoryLabel": "Due within 60 days"
	},
	"later": {
		"dueDate": later,
		"categoryLabel": "Due greater than 60 days"
	},
	"noDate": {
		"dueDate": "",
		"categoryLabel": "No due date"
	}
}
//	var aTaskInGroup = false;

// Get DOM "handle" of Navbar Submenu container (<ul>) for task list
var taskListsSubMenuContainer = document.querySelector(".taskListsSubMenu");

//function localStorageSupported() {
//	try {
//		return "localStorage" in window && window["localStorage"] !== null;
//	} catch (e) {
//		return false;
//	}
//}

//**************************************************************************************
//
//
// METHODS FOR IMPLEMENTING SEARCH FILTERING FEATURE
//
//
//**************************************************************************************
function getAllActiveTasks() {
	return getAllActiveMatchingTaskItemsWithId("01");
}


//**************************************************************************************
// Retrieve all task 
//**************************************************************************************
function getAllTasks() {
	// Get all taskItems 
	return getMatchingTaskItemsWithID("1");
	//	return document.querySelectorAll(".card");
}


//**************************************************************************************
// Traverse current DOM node to get task and return task name
// Note: technique is very fragile need to look for more 
//**************************************************************************************
function getTaskName(task) {
	//	return task.childNodes[2].childNodes[1].childNodes[2].nextSibling.innerHTML.toLowerCase();
	return task.taskItem_title;
}

//**************************************************************************************
// Search for a task that match the user search criteria (userInput)
// 
//**************************************************************************************

function searchForMatchingTask(userInput) {
	console.log("----->In searchForMatching");
	userInput = userInput.toLowerCase();
	var taskName;
	var matchingTaskItems = [];

	var allActiveTasks = getAllTasks();
	// Return all task items where the task Title contains the search input character
	return matchingTaskItems = allActiveTasks.filter(function (taskItem) {
		taskName = getTaskName(taskItem);
		if (taskName.toLowerCase().indexOf(userInput) !== -1) {
			return taskItem;
		}
	});
}

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


// Clear the contents of the Search input area
function clearSearchContents() {
	console.log("**> ClearSearchContents");
	searchInput.value = "";
}

function removeElement(elem) {
	console.log("**> RemoveElement", elem);
	elem.style.display = "none";
}

function addElement(elem) {
	console.log("**> AddElement", elem);
	elem.style.display = "inline-block";
}

function removeClearSearchIcon() {
	console.log("**> RemoveClearSearchIcon");
	clearSearchIcon.style.display = "none";
}

function hideClearSearchIcon() {
	console.log("**> HideClearSearchIcon");
	clearSearchIcon.style.visibility = "hidden";
}

function addClearSearchIcon() {
	console.log("**> AddClearSearchIcon");
	clearSearchIcon.style.display = "inline-block";
}

function showClearSearchIcon() {
	console.log("**> ShowClearSearchIcon");
	clearSearchIcon.style.visibility = "visible";
}

function removeFloatAddBtn() {
	console.log("**> RemoveFloatAddBtn");
	floatAddBtn.style.display = "none";
}

function showFloatAddBtn() {
	console.log("**> ShowFloatAddBtn");
	floatAddBtn.style.display = "inline-block";
}

function blockUserClicks(elem) {
	console.log("Block User Clicks");
	console.log(elem);
	elem.style.pointerEvents = "none";
}

function unblockUserClicks(elem) {
	console.log("**> unblockUserClicks");
	elem.style.pointerEvents = "auto";

}


// Resets the UI including navbar to original state
function resetUI2InitialState() {
	var taskListId;

	// Find the listId of the "active" list element (class = selected)
	taskListId = getListIdForActiveTaskList();

	// %%%%%
	//	toggleClass(appUIController.getUIVars().inputNewTaskRepeat,"hideIt");
	// Set taskListSubmenu dropdown title = the list name of the active list

	appUIController.getUIVars().listMenuTitle.childNodes[2].textContent = appUIController.getActiveTaskListName();

	// Use taskId to gather and display all task with that ID
	updateTaskListDisplayed(taskListId);


	showFloatAddBtn();
	addElement(appUIController.getUIVars().listMenuTitle);
	addElement(sysMenuElement);
	addElement(homeIcon);
	removeElement(backArrowSearch);
	removeClearSearchIcon();
	searchInput.value = "";

	//Search bar should be out of focus ("closed") on any screen other than "search screen".  
	searchInput.blur();

}

// CSS has clear search icon present so we must remove it until it is needed
//removeClearSearchIcon();



/**************************************************************************
	Get the list_id of the "active" task list selection.
	Once you have the listId you can then user other methods to get
	the taskItems for that list.
    
****************************************************************************/
function getListIdForActiveTaskList() {
	var activeTaskNode = document.querySelector(".selected");
	return activeTaskNode.getAttribute('data-id');
}

/***************************************************************************

	Get the current "active" task list (i.e., class="selected) 
	returns it's DOM node (<li>)  

****************************************************************************/
function getActiveTaskList() {
	var activeTaskNode = document.querySelector(".selected");
	if (activeTaskNode === null) {
		console.log("getActiveTaskList():::ERROR no activeListNode found ");
		activeTaskNode = appUIController.getUIVars().allListsElem;
		activeTaskNode.classList.add("selected");
	}
	return activeTaskNode

}

//**************************************************************************************
//
// User clicks on submenu element to make it current list in Navbar
//
//**************************************************************************************
// Hardcoding childNode #'s is a brittle solution because simple changes to HTML can break this code.
// Need to find an alternative solution 

var handleSubMenuClick = function (event) {

	// Get the current "active" task list Node 
	var currActiveList = getActiveTaskList();

	appModelController.updateListTaskTotals();

	// Get name of submenu list selected
	var listNameSelected = event.target.childNodes[1].textContent.trim();

	function getListId(taskList) {
		console.log(taskList)
		return taskList.taskList_name === listNameSelected;
	}

	// Look up listNameSelected in taskListTable and get it's taskList_id so that we can display all tasks that with that matching id
	//	console.log("******** List Name:  " + listNameSelected);
	//	console.log("******** List Id: " + taskListId);

	// Get the taskList record that with the selected list name
	var matchedTaskListRecord = appModelController.getTaskListTable().find(getListId);

	// If the "New List" option is selected on the task list subMenu you will want to skip performing all of the actions insid the if statement
	if (matchedTaskListRecord !== undefined) {

		// Get the taskListId of the list that was selected on the taskSubMenu so that I can display taskItems matching that listId
		taskListId = matchedTaskListRecord.taskList_id;

		// Get location of List menu title 
		var listMenuTitle = appUIController.getUIVars().listMenuTitle.childNodes[2];

		// Make the List menu title equal to submenu name selected
		listMenuTitle.nodeValue = listNameSelected;

		// Deactive the current active list by removing 'selected' class 
		toggleClass(currActiveList, 'selected');

		// The selected list name will have the "selected" class added to darken background so when 
		// user hovers and gets the submenu to display the previously selected list will be distinguishable 
		toggleClass(event.target, 'selected');


		// Now display the taskItems associates with the new "active" task list
		updateTaskListDisplayed(taskListId);

	}





};


//******************************************************************************************************
//
// HANDLE SEARCH FOCUS:
// This function is called when the SearchIcon is clicked and Search input receives focus.
// When the user clicks on the searchIcon a search field opens up (with placeholder txt)
// 
//
//
//	Global variables: (Line# where defined)
//		- searchInput
//		- searchIconClicked  (2)
//		- clearSearchClicked (10)
//		- homeIcon
//		- backArowSearch
//		- sysMenuElement
//		- listMenuTitle
//
//*******************************************************************************************************

var handleSearchFocus = function (event) {
	console.log("----->In handleSearchFocus function");
	console.log("==> event.target", event.target);

	searchIconClicked = true;

	// Show original Nav bar settings if user clicked somewhere other than clearSearchIcon
	// Note: if the user clicked the clear search icon then you want the original Navbar elements to remain hidden (hence no else condition)
	if (!clearSearchClicked) {

		// Hide (via display:none) other elements of Navbar so Search is focus 
		removeElement(appUIController.getUIVars().listMenuTitle);
		removeElement(sysMenuElement);
		removeElement(homeIcon);
		addElement(backArrowSearch);

		// Add the clearSearch icon to the navbar but hide it until user enters data in search bar
		addClearSearchIcon();
		hideClearSearchIcon();

		// Hide the floating add button
		removeFloatAddBtn();

		// Each time submit button (searchIcon) is clicked it will clear any previously
		// Commented out line below so if user clicks search icon it will retain searchInput value
		// and user can continue entering more search criteria. 
		searchInput.value = null;

		// Test XXX
		searchInput.focus();
		// Test if following line is needed &&& -- doesn't look like it is needed will delete in future
		//		blockUserClicks(searchSubmit);

	}

	if (searchInput.value !== "") {
		showClearSearchIcon();
	}

};


//**************************************************************************************
//
// HANDLE SEARCH BLUR:
// This function is called when user clicks on area outside of search input area
// 
//
//	Global Variables:
//	- clearSearchClicked 
//  - searchExitClicked
//  
//
//**************************************************************************************


var handleSearchBlur = function (event) {

	console.log("-----> In handleSearchBlur function");

	// Assume that click was not on clearSearchIcon 
	clearSearchClicked = false;

	// NOTE: Unfortunately when focus is lost the blur method obscures the click event that  
	// caused it to lose focus (i.e., event.target). 
	// So to workaround this behavior a setTimeoutfunction is used. This allows the blur method
	// to complete and then the event handler for the click to run so that the event.target can
	// be captured/"noted" (via flags) and logic for handling the event can be added to the timeOut 
	// function. This was the only solution I couldfind on StackOverflow for this "well-known" problem. 


	setTimeout(function () {

		console.log("----->SetTimeout function", document.activeElement);
		console.log("SearchExitClicked value: ", searchExitClicked);
		console.log("clearSearchClicked: ", clearSearchClicked);
		//		console.log("clearSearchClicked value: ", clearSearchClicked);

		// If the user click on something other than the clearSearch icon you want to restore orig navBar elements.
		if (searchExitClicked) {

			searchExitClicked = false;

			// Reset UI to initiat state
			resetUI2InitialState();

			// Test if still needed	- Doesn't seemed to be so will delete following line in near future once absolutely sure.		
			//			unblockUserClicks(searchSubmit);


		} else if (clearSearchClicked) {

			// reset clearSearchClicked flag
			clearSearchClicked = false;

			// Clicked outside input area but didn't click searchExitIcon. Need to make sure 
			// that you hide clearSearchIcon if user started entering search criteria
			hideClearSearchIcon();
			//			searchInput.focus();

			// Hide the floating add button
			removeFloatAddBtn();
		} else {
			// Test if still needed	- Doesn't seemed to be so will delete following line in near future once absolutely sure.		
			//			blockUserClicks(searchSubmit);
			searchInput.focus();
			//			blockUserClicks(mainPage);

		}

	}, 2);

};


//*************************************************************************************************
//  Detect Search Input - called whenever user enters key ('keyup' event) while in search area
//	Find and display tasks that match the search criteria
//
//  DETAILS:
//	- First clear out any taskItems currently displayed
//  * IF searchInput area is now empty (user deleted all prior search criteria) 
//	--> Hide the "clearSearchIcon" (icon that deletes all search criteria entered by user )
//  --> And redisplay taskItems that were displayed before user entered search criteria ("active" task list) 
//	--> To do this we must determine "active" task list (getListIdForActiveTaskList())
//  --> And redisplay the "active" task list items ()
//  * ELSE (searchInput area is NOT empty...it contains )
//	 	 ** if only one character in searchInput area then Add the clearSearchIcon (addClearSearchIcon) to screen and make it	
//			visible (showClearSearchIcon) 
//		** ENDIF
//	* ENDIF
//	- Search for any taskItems that match the entered search criteria (searchForMatchingTask(searchInput.value))
//	- Clear out any taskItems that were previously displayed (clearoutTaskItemsDisplayed)
//	- And display the new matches (appUIController.displayTaskItems)
//
//	GLOBAL VARIABLES:
//	- searchInput - this is the text are where user enters their search criteria ()
//	- clearSearchIcon - icon allows user to clear/delete all previously entered search criteria in searchInput 
//		NOTE 1: clearSearchIcon is only made visible when there is at least one character currently in searchInput area 
//		otherwise it is hidden. 
//		NOTE 2: Displaying clearSearchIcon is done in two separate steps (i.e., add to screen and then make visible on screen)
//				to avoid causing the searchIcon (magnifying glass -- located on the left of clearSearchIcon) from shifting
//				the searchIcon left and right as the clearSearchIcon is added (when search criteria exist) and removed (if user
//				deletes search criteria). Two steps are: 
//
//					1) addClearSearchIcon (style display: inline-block)
//					2) showClearSearchIcon () style visibility: visible)
//				
//
//*************************************************************************************************


var detectSearchInput = function (event) {
	console.log("----->In DetectSearchInput function");

	var matchingTaskItems = [];
	appUIController.clearOutExistingScreenContent(appUIController.getUIVars().mainPage, "dueTimeFrameLabel", "card");
	// At this point at least one keystroke has been entered..if there is only one keystroke
	// then you know it was previously empty and this is the first character entered and thus
	// the clearSearchIcon should be displayed

	if (isEmpty(searchInput.value)) {

		console.log("Search input is empty");

		// Set visibility of clearSearchIcon to hidden		
		hideClearSearchIcon();

		// Find the listId of the "active" list
		var activeTaskListId = getListIdForActiveTaskList();

		// Use taskId to gather and display all task with that ID
		updateTaskListDisplayed(activeTaskListId);


	} else {
		if (searchInput.value.length === 1) {
			addClearSearchIcon();
			showClearSearchIcon();
		} // ENDIF
		// ENDIF

		matchingTaskItems = searchForMatchingTask(searchInput.value);

		// Clear any existing task that are currently displayed
		appUIController.clearOutExistingScreenContent(appUIController.getUIVars().mainPage, "dueTimeFrameLabel", "card");

		// Display matching task items. 
		appUIController.buildAndDisplayTaskItems("mainPage", matchingTaskItems);
	}

};

//**************************************************************************************
//
// CLEAR SEARCH FIELD 
// Called on "keyUp" event...so it's called after something has been entered in the search box
//
//**************************************************************************************


var clearSearchField = function (event) {
	// Set flag so we know that clearSearchIcon was clicked
	clearSearchClicked = true;

	console.log("---> In ClearSearchField method");
	console.log("ClearSearchField target === ", event.target);


	// Clear the contents of the search area if user clicks clear search icon
	clearSearchContents();

	// Re-hide clear search box icon
	hideClearSearchIcon();

	// Find the listId of the "active" list
	var taskListId = getListIdForActiveTaskList();

	// Use taskId to gather and display all task with that ID
	updateTaskListDisplayed(taskListId);

	showFloatAddBtn();

	searchInput.focus();

};

var exitSearch = function (event) {
	console.log("----->In Search Exit function")
	searchExitClicked = true;

	//	searchExitClicked = false;
	// Reset Navbar to original state
	resetUI2InitialState();
};


//**************************************************************************************************************************
//
//                                                TASKIT UTILITY METHODS
//
//**************************************************************************************************************************

var utilMethods = ( function () {

	return {
		
		notificationChanged: function ( taskNotificationRecord, taskNotificationInput ) {
			
			if (( taskNotificationRecord.notification_type === taskNotificationInput.notificationType ) &&
				( taskNotificationRecord.notification_units === taskNotificationInput.notificationUnits ) &&
				( taskNotificationRecord.notification_unitType === taskNotificationInput.notificationUnitType ))
				{
					return false;
				
			} else {
				
				return true;
			}
			
		}, 


		contains: function (element) {
			Array.prototype.contains = function (element) {
				var i;
				for (i = 0; i < this.length; i++) {
					if (this[i] === element) {
						return true; //Returns element position, so it exists
					}
				}
				return false;
			}
		},

		hasElement: function (list, listName) {
			Array.prototype.hasElement = function (listName) {
				var i;
				for (i = 0; i < this.length; i++) {
					if (this[i].taskList_name === listName) {
						return i; //Returns element position, so it exists
					}
				}
				return -1; //The element isn't in your array
			}
			return list.hasElement(listName);
		},
		/* Given a DOM node (element) it returns the closest ancestor of that
			node with a specific class name										*/
		findAncestor: function (el, cls) {
			// First check to see if the node (el) is the ancestor I'm looking for
			if (el.className === cls) {
				return el
			} else { // loop through each parent to find the ancestor
				while ((el = el.parentElement) && !el.classList.contains(cls));
				return el;
			}
		},

		lookUpTaskName: function (list, taskListId) {
			Array.prototype.lookUpTaskName = function (taskListId) {
				var i;
				for (i = 0; i < this.length; i++) {
					if (this[i].taskList_id === taskListId) {
						return this[i].taskList_name; //Returns name of task List
					}
				}
				return -1;
			}
			return list.lookUpTaskName(taskListId);

		},

		lookUpTaskListRecord: function (list, taskListId) {
			Array.prototype.lookUpTaskListRecord = function (taskListId) {
				var i;
				for (i = 0; i < this.length; i++) {
					if (this[i].taskList_id === taskListId) {
						return this[i]; //Returns list record
					}
				}
				return -1;
			}
			return list.lookUpTaskListRecord(taskListId);

		},
		titleCase: function (str) {
			var splitStr = str.toLowerCase().split(' ');
			for (var i = 0; i < splitStr.length; i++) {
				splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
			}
			// Directly return the joined string
			return splitStr.join(' ');
		},


		equateTaskItemObjects: function (taskItemObject, inputTaskObject) {

			taskItemObject.taskList_id = appModelController.lookUpTaskListId(inputTaskObject.taskList);
			taskItemObject.taskItem_title = inputTaskObject.taskTitle;
			taskItemObject.taskItem_due_date = inputTaskObject.taskDueDate;
			//		taskItemObject.taskItem_repeat = inputTaskObject.taskRepeat.toLowerCase();
			taskItemObject.taskItem_completedDate = inputTaskObject.taskCompletedDate;
			taskItemObject.taskItem_notifications = inputTaskObject.taskNotificationsPresent;
		},


	}
})();


//$('#datepicker').datepicker();

// Note: that the taskItController & uiControllers are designed to be independent.
// This is done so that for example you can expand the capabilities of the
// taskItController without affecting the UI.
//**************************************************************************************************************************
//
//                                                TASKIT DATA MODEL CONTROLLER 
//
//**************************************************************************************************************************

var appModelController = (function () {
	var userDb, taskListDb, taskItemDb, taskItemNotificationDb;
	var userDefinedTaskListInfo1 = [];
	var userTable1 = [];
	var taskListTable1 = [];
	var taskItemsTable1 = [];
	var taskItemNotificationsTable = [];



	var TaskList = function (listId, listName, userId, totalItemCount, overDueItemCount, completedCount, listCreateTime, taskListIsArchived) {
		this.taskList_id = listId;
		this.taskList_name = listName;
		this.user_id = userId;
		this.taskList_totalCount = totalItemCount;
		this.taskList_overDueCount = overDueItemCount;
		this.taskList_completedCount = completedCount;
		this.taskList_createTime = listCreateTime;
		this.taskList_isArchived = taskListIsArchived;
	}

	var TaskItem = function (id, listId, title, dueDate, repeat, completedDate, createTime, notificationsPresent) {
		this._id = id;
		this.taskList_id = listId;
		this.taskItem_title = title;
		this.taskItem_due_date = dueDate;
		this.taskItem_repeat = repeat;
		this.taskItem_completedDate = completedDate;
		this.taskItem_createTime = createTime;
		this.taskItem_notifications = notificationsPresent;
	}
	
	var TaskItemDbRecord = function (listId, title, dueDate, repeat, completedDate, createTime, notificationsPresent) {
		this.taskList_id = listId;
		this.taskItem_title = title;
		this.taskItem_due_date = dueDate;
		this.taskItem_repeat = repeat;
		this.taskItem_completedDate = completedDate;
		this.taskItem_createTime = createTime;
		this.taskItem_notifications = notificationsPresent;
	}

	var TaskItemNotification = function (id, taskItemId, notificationType, notificationUnits, notificationUnitType, notificationCreateTime) {
		this.notification_id = id;
		this.taskItem_id = taskItemId;
		this.notification_type = notificationType;
		this.notification_units = notificationUnits;
		this.notification_unitType = notificationUnitType;
		this.notification_createTime = notificationCreateTime;
	}
	/******************************************************************************************************************************
		getUniqueId():  Used to generate unique ID's for various objects (e.g., taskItems)
		
		Got this method from StackOverFlow (https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript)
		Per stackOverflow contributor's comments here are the characteristics/uniqueness of IDs generated with this algorithm:
		- If ID's are generated more than 1 milliseconds apart, they are 100% unique.
		- If two ID's are generated at shorter intervals, and assuming that the random method is truly random, this would generate
			ID's that are 99.99999999999999% likely to be globally unique.
		You can increase this number by adding more digits, but to generate 100% unique ID's you will need to use a global counter.
	*******************************************************************************************************************************/
	var getUniqueId = function () {
		var uniqueId;
		return uniqueId = Math.random().toString(36).substring(2) +
			(new Date()).getTime().toString(36);
	}

	/******************************************************************************************************************************
		lookUpTaskListId(listName) - Provided a taskListName it will lookUp it's corresponding taskListId
	*******************************************************************************************************************************/
	var lookUpTaskListId = function (listName) {
		var matchingListRecord = appModelController.getTaskListTable().filter(function (listItem) {
			return listItem.taskList_name === listName;
		});
		return matchingListRecord[0].taskList_id;

	}

	var getTimeStamp = function () {
		return Date.now();
	}


	var userDefinedTaskListsInfo = [
		{
			"taskList_id": "4",
			"listName": "Shopping",
			"taskList_name": "Shopping",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0,
			"overDue": 5,
			"totalTasks": 8
		},
		{
			"taskList_id": "6",
			"listName": "Work",
			"taskList_name": "Work",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0,

			"overDue": 2,
			"totalTasks": 19
		},
		{
			"taskList_id": "3",
			"listName": "School",
			"taskList_name": "School",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0,
			"overDue": 3,
			"totalTasks": 6
		},
		{
			"taskList_id": "5",
			"user_id": "1",
			"taskList_name": "Wish List",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0
		}
//		{
//			"listName" : "Home Projects",
//			"overDue"  : 3, 
//			"totalTasks": 12			
//		}
	]
//***********************************************************
	
// Key Table definitions for tables without DB. 
// Another similar set has been defined below for use with DB
	
//***********************************************************
	var userTable = [
		{
			"user_id": "1",
			"user_name": "Jet Martin",
			"user_password": "123"
		}
	];

	var taskListTable = [

	];
	
	var taskListTable1 = [
	{
		"taskList_id": "1",
		"user_id": "1",
		"taskList_name": "All Lists",
		"taskList_totalCount": 0,
		"taskList_overDueCount": 0,
		"taskList_completedCount": 0,
		"taskList_createTime": "",
		"taskList_isArchived": ""
	},
	{
		"taskList_id": "2",
		"user_id": "1",
		"taskList_name": "Default",
		"taskList_totalCount": 0,
		"taskList_overDueCount": 0,
		"taskList_completedCount": 0,
		"taskList_createTime": "",
		"taskList_isArchived": ""
	},
	{
		"taskList_id": "3",
		"user_id": "1",
		"taskList_name": "School",
		"taskList_totalCount": 0,
		"taskList_overDueCount": 0,
		"taskList_completedCount": 0,
		"taskList_createTime": "",
		"taskList_isArchived": ""
	},
	{
		"taskList_id": "4",
		"user_id": "1",
		"taskList_name": "Shopping",
		"taskList_totalCount": 0,
		"taskList_overDueCount": 0,
		"taskList_completedCount": 0,
		"taskList_createTime": "",
		"taskList_isArchived": ""
	},
	{
		"taskList_id": "5",
		"user_id": "1",
		"taskList_name": "Wish List",
		"taskList_totalCount": 0,
		"taskList_overDueCount": 0,
		"taskList_completedCount": 0,
		"taskList_createTime": "",
		"taskList_isArchived": ""
	},
	{
		"taskList_id": "6",
		"user_id": "1",
		"taskList_name": "Work",
		"taskList_totalCount": 0,
		"taskList_overDueCount": 0,
		"taskList_completedCount": 0,
		"taskList_createTime": "",
		"taskList_isArchived": ""
	},
	{
		"taskList_id": "7",
		"user_id": "",
		"taskList_name": "Completed",
		"taskList_totalCount": 0,
		"taskList_overDueCount": 0,
		"taskList_completedCount": 0,
		"taskList_createTime": "",
		"taskList_isArchived": ""
	}

];
	var taskItemsTable = [];
	
	var taskItemsTable1 = [
		{
			"taskItem_id": "1",
			"taskList_id": "6",
			"taskItem_title": "Task item 1.0",
			"taskItem_description": "",
			"taskItem_due_date": "2018-03-01 15:30",
			"taskItem_due_time": "5:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "2",
			"taskList_id": "3",
			"taskItem_title": "Task item 2",
			"taskItem_description": "",
			"taskItem_due_date": "",
			"taskItem_due_time": "12:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "3",
			"taskList_id": "4",
			"taskItem_title": "Task item 2.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-21 23:55",
			"taskItem_due_time": "5:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "weekly",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "4",
			"taskList_id": "3",
			"taskItem_title": "Task item 2.2",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-25 11:00",
			"taskItem_due_time": "9:00am",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""

		},
		{
			"taskItem_id": "5",
			"taskList_id": "5",
			"taskItem_title": "Task item 3",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-14 12:00",
			"taskItem_due_time": "2:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "6",
			"taskList_id": "6",
			"taskItem_title": "Task item 3.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-17 14:00",
			"taskItem_due_time": "4:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "7",
			"taskList_id": "6",
			"taskItem_title": "Task item 4",
			"taskItem_description": "",
			"taskItem_due_date": "2018-01-12 17:00",
			"taskItem_due_time": "12:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "daily",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "8",
			"taskList_id": "6",
			"taskItem_title": "Task item 4.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-12-12 17:00",
			"taskItem_due_time": "7:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "monthly",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "9",
			"taskList_id": "2",
			"taskItem_title": "Task item 5",
			"taskItem_description": "",
			"taskItem_due_date": "2017-12-15 17:00",
			"taskItem_due_time": "6:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "10",
			"taskList_id": "5",
			"taskItem_title": "Task item 5.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-16 17:00",
			"taskItem_due_time": "3:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "11",
			"taskList_id": "3",
			"taskItem_title": "Task item 6",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-17 17:00",
			"taskItem_due_time": "5:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "12",
			"taskList_id": "5",
			"taskItem_title": "Task item 6.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-22 17:30",
			"taskItem_due_time": "",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "13",
			"taskList_id": "2",
			"taskItem_title": "Task item 7",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-23 17:30",
			"taskItem_due_time": "",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"taskItem_id": "14",
			"taskList_id": "2",
			"taskItem_title": "Task item 7.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-30 10:30",
			"taskItem_due_time": "",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		}
	];
	
	
	
//*******************************************

// Tables used to build Pouch DB Databases 


//*******************************************

	
	
	
	var userTableDb = [
		{
			"_id": "01",
			"user_id": "Jet Martin",
			"user_password": "123"
		}
	];
	
	
	var systemDefinedTaskListTableDb = [
		{
			"_id": "01",
			"user_id": "01",
			"taskList_name": "All Lists",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0,
			"taskList_createTime": "",
			"taskList_isArchived": ""
		},
		{
			"_id": "02",
			"user_id": "01",
			"taskList_name": "Default",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0,
			"taskList_createTime": "",
			"taskList_isArchived": ""
		},
		
		{
			"_id": "07",
			"user_id": "01",
			"taskList_name": "Completed",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0,
			"taskList_createTime": "",
			"taskList_isArchived": ""
		}
		
	];
	
	var taskListTableDb = [

		{
			"_id": "03",
			"user_id": "01",
			"taskList_name": "School",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0,
			"taskList_createTime": "",
			"taskList_isArchived": ""
		},
		{
			"_id": "04",
			"user_id": "01",
			"taskList_name": "Shopping",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0,
			"taskList_createTime": "",
			"taskList_isArchived": ""
		},
		{
			"_id": "05",
			"user_id": "01",
			"taskList_name": "Wish List",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0,
			"taskList_createTime": "",
			"taskList_isArchived": ""
		},
		{
			"_id": "06",
			"user_id": "01",
			"taskList_name": "Work",
			"taskList_totalCount": 0,
			"taskList_overDueCount": 0,
			"taskList_completedCount": 0,
			"taskList_createTime": "",
			"taskList_isArchived": ""
		}
//		,
//		{
//			"_id": "07",
//			"user_id": "01",
//			"taskList_name": "Completed",
//			"taskList_totalCount": 0,
//			"taskList_overDueCount": 0,
//			"taskList_completedCount": 0,
//			"taskList_createTime": "",
//			"taskList_isArchived": ""
//		}

	];
	var taskItemsTableDb = [
		{
			"_id": "01",
			"taskList_id": "06",
			"taskItem_title": "Task item 1.0",
			"taskItem_description": "",
			"taskItem_due_date": "2018-03-01 15:30",
			"taskItem_due_time": "5:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "02",
			"taskList_id": "03",
			"taskItem_title": "Task item 2",
			"taskItem_description": "",
			"taskItem_due_date": "",
			"taskItem_due_time": "12:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "03",
			"taskList_id": "04",
			"taskItem_title": "Task item 2.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-21 23:55",
			"taskItem_due_time": "5:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "weekly",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "04",
			"taskList_id": "03",
			"taskItem_title": "Task item 2.2",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-25 11:00",
			"taskItem_due_time": "9:00am",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""

		},
		{
			"_id": "05",
			"taskList_id": "05",
			"taskItem_title": "Task item 3",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-14 12:00",
			"taskItem_due_time": "2:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "06",
			"taskList_id": "06",
			"taskItem_title": "Task item 3.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-17 14:00",
			"taskItem_due_time": "4:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "07",
			"taskList_id": "06",
			"taskItem_title": "Task item 4",
			"taskItem_description": "",
			"taskItem_due_date": "2018-01-12 17:00",
			"taskItem_due_time": "12:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "daily",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "08",
			"taskList_id": "06",
			"taskItem_title": "Task item 4.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-12-12 17:00",
			"taskItem_due_time": "7:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "monthly",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "09",
			"taskList_id": "02",
			"taskItem_title": "Task item 5",
			"taskItem_description": "",
			"taskItem_due_date": "2017-12-15 17:00",
			"taskItem_due_time": "6:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "10",
			"taskList_id": "05",
			"taskItem_title": "Task item 5.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-16 17:00",
			"taskItem_due_time": "3:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "11",
			"taskList_id": "03",
			"taskItem_title": "Task item 6",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-17 17:00",
			"taskItem_due_time": "5:00pm",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "12",
			"taskList_id": "05",
			"taskItem_title": "Task item 6.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-22 17:30",
			"taskItem_due_time": "",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "13",
			"taskList_id": "02",
			"taskItem_title": "Task item 7",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-23 17:30",
			"taskItem_due_time": "",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		},
		{
			"_id": "14",
			"taskList_id": "02",
			"taskItem_title": "Task item 7.1",
			"taskItem_description": "",
			"taskItem_due_date": "2017-11-30 10:30",
			"taskItem_due_time": "",
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "",
			"taskItem_isArchived": "",
			"taskItem_notifications": false,
			"taskItem_calendar": "",
			"taskItem_completedDate": "",
			"taskItem_createTime": ""
		}
	];
	
	//*******  END Table Definition for DBs ******

	var formValidationObject = [
  	//***********************************
	/*   Nav List Modal                */
  	//***********************************		  
		{
			pageName: "navListModal",
			formName: "formNavTaskListModal",
			formError: false,
			formSubmitErrorMsgLoc: document.getElementById("navTaskListModalMsg"),
			formSubmitSuccessMsgLoc: document.getElementById("mainPageSuccessMsg"),
			formSubmitSuccessMsg: "list created!",
			formSubmitErrorMsg: "List NOT saved." + " Correct Error",

			fieldsToValidate: [
				{
					fieldName: document.getElementById("navListModalListName"),
					fieldErrorMsgLocation: document.getElementById("navListModalListNameErrorMsg"),
					fieldErrMsg: "List name can't be blank",
					isNotValid: function (str) {
						return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
					}
		  }
		]
	},
  	//***********************************
	/* New Task Item List Modal         */
  	//***********************************	  
		{
			pageName: "newTaskItemListModal",
			formName: "newTaskFormListModalForm",
			formError: false,
			formSubmitErrorMsgLoc: document.getElementById("newTaskFormListModalMsg"),
			formSubmitSuccessMsgLoc: document.getElementById("newTaskListCreateMsg"),
			formSubmitSuccessMsg: "list created!",
			formSubmitErrorMsg: "List NOT saved." + " Correct Error",

			fieldsToValidate: [
				{
					fieldName: document.getElementById("newTaskFormListName"),
					fieldErrorMsgLocation: document.getElementById("newTaskFormModalListNameErrorMsg"),
					fieldErrMsg: "List name can't be blank",
					isNotValid: function (str) {
						return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
					}
		  }
		]
	},
  	//***********************************
	/* Edit Task Item List Modal       */
  	//***********************************

		{
			pageName: "editTaskItemListModal",
			formName: "editTaskFormListModalForm",
			formError: false,
			formSubmitErrorMsgLoc: document.getElementById("editTaskFormListModalMsg"),
			formSubmitSuccessMsgLoc: document.getElementById("editTaskListCreateMsg"),
			formSubmitSuccessMsg: "list created!",
			formSubmitErrorMsg: "List NOT saved." + " Correct Error",

			fieldsToValidate: [
				{
					fieldName: document.getElementById("editTaskModalFormListName"),
					fieldErrorMsgLocation: document.getElementById("editTaskFormModalListNameErrorMsg"),
					fieldErrMsg: "List name can't be blank",
					isNotValid: function (str) {
						return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
					}
		  }
		]
	},

	  //***********************************
	  /*   Manage Task List Modal Forms   */
	  //***********************************

	  /*   Nav Add New List Modal Form   */

		{
			pageName: "manageListsAddNewListModal",
			formName: "manageListsAddNewListModalForm",
			formError: false,
			fieldDefaultValue: "",
			formSubmitErrorMsgLoc: document.getElementById("manageListsAddNewListModalMsg"),
			formSubmitSuccessMsgLoc: document.getElementById("manageTaskListsMsg"),
			formSubmitSuccessMsg: "list created!",
			formSubmitErrorMsg: "List NOT saved." + " Correct Error",

			fieldsToValidate: [
				{
					fieldName: document.getElementById("manageListsAddNewListModalFormListName"),
					fieldErrorMsgLocation: document.getElementById("manageListsAddNewListModalListNameErrorMsg"),
					fieldErrMsg: "List name can't be blank",
					isNotValid: function (str) {
						return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
					}
		  }
		]
	},

	/*   Edit List Modal Forms   */

		{
			pageName: "manageListsEditListModal",
			formName: "manageListsEditListModal",
			formError: false,
			fieldDefaultValue: "",
			formSubmitErrorMsgLoc: document.getElementById("manageListsEditListModalMsg"),
			formSubmitSuccessMsgLoc: document.getElementById("manageTaskListsMsg"),
			formSubmitSuccessMsg: "list updated!",
			formSubmitErrorMsg: "List NOT saved." + " Correct Error",

			fieldsToValidate: [
				{
					fieldName: document.getElementById("manageListsEditListModalFormListName"),
					fieldErrorMsgLocation: document.getElementById("manageListsEditListModalListNameErrorMsg"),
					fieldErrMsg: "List name can't be blank",
					isNotValid: function (str) {
						return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
					}
		  }
		]
	},


	  //***********************************
	  /* NEW Task Form Validation Object */
	  //***********************************
		{
			pageName: "newTaskPage",
			formName: "formSaveNewTask",
			formHasError: false,
			formSubmitErrorMsgLoc: document.getElementById("newTaskSaveMsg"),
			//		formSubmitSuccessMsgLoc : document.getElementById("editTaskSaveMsg"),
			formSubmitSuccessMsgLoc: document.getElementById("mainPageSuccessMsg"),
			formSubmitSuccessMsg: "Task Created!",
			formSubmitErrorMsg: "Task Update Failed" + " See Form Error(s)",

			fieldsToValidate: [

				{ // Task Item Title Field
					fieldName: document.getElementById("newTaskTitle"),
					fieldInError: false,
					fieldDefaultValue: "",
					fieldErrorMsgLocation: document.getElementById("newTaskFormErrorMsg"),
					fieldErrMsg: "Task Title is required/Cannot be blank",
					//				fieldErrMsg: '<i class="fa fa-times-circle"></i>' + '&nbsp;' + "Task Title is required/Cannot be blank",

					isNotValid: function (str) {
						return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
					},
			},

				{ // Due Date Time field
					fieldName: document.getElementById("newTaskDateTime"),
					fieldInError: false,
					fieldDefaultValue: "",
					fieldErrorMsgLocation: document.getElementById("newTaskDueDateErrorMsg"),
					fieldErrMsg: null,
					isNotValid: function (str) {}
			},

//			{	// Repeat Option
//				fieldName: document.getElementById("newTaskRepeatOption"),
//				fieldInError: false,
//				fieldDefaultValue: "1",
//				fieldErrorMsgLocation: document.getElementById("repeatErrorMsgDiv"),
//				fieldErrMsg: "Must have a due date to make a task repeatable",
//				isNotValid: function(str) {
//					var dateValue = document.getElementById("newTaskDateTime").value;
//					if (str !== "none" && !dateValue.replace(/^\s+/g, '').length) {
//						return true;
//					} else {
//						return false;
//					}
//				}
//			},
				{ // List Selection Option
					fieldName: document.getElementById("newTaskListNameSelect"),
					fieldInError: false,
					fieldDefaultValue: "Default",
					fieldErrorMsgLocation: document.getElementById("newTaskListSelectErrorMsg"),
					fieldErrMsg: null,
					isNotValid: function (str) {}
			},
				{ // Notification 
					fieldName: document.getElementById("newTaskFormNotificationArea"),
					fieldInError: false,
					fieldDefaultValue: "",
					fieldErrorMsgLocation: document.getElementById("newTaskNotificationError"),
					fieldErrMsg: "Must set Due Date to use Notifications",
					isNotValid: function (str) {
						var dateValue = document.getElementById("newTaskDateTime").value;
						var notifications = document.getElementsByClassName("notification").length;
						if (notifications !== 0 && !dateValue.replace(/^\s+/g, '').length) {
							return true;
						} else {
							return false;
						}
					}
			},

//			{	// Date Time Field
//				fieldName: document.getElementById("newTaskDueTime"),
//				fieldInError: false,
//				fieldDefaultValue: "",
//				fieldErrorMsgLocation: document.getElementById("newTaskDueTimeErrorMsg"),
//				fieldErrMsg: "Must set Due Time to use Notifications",
//				isNotValid: function(str) {
//					var timeValue = document.getElementById("newTaskDateTime").value;
//					var notifications = document.getElementsByClassName("notification").length;
//					if (notifications !== 0 && !timeValue.replace(/^\s+/g, '').length) {
//						return true;
//					} else {
//						return false;
//					}
//				}
//			}

		]
	},
	  /* Edit Task Form Validation Object */
		{
			pageName: "editTaskPage",
			formName: "formEditNewTask",
			formError: false,
			formSubmitErrorMsgLoc: document.getElementById("editTaskSaveMsg"),
			//		formSubmitSuccessMsgLoc : document.getElementById("editTaskSaveMsg"),
			formSubmitSuccessMsgLoc: document.getElementById("mainPageSuccessMsg"),
			formSubmitSuccessMsg: "Task Updated!",
			formSubmitErrorMsg: "Task Update Failed" + " See Form Error(s)",

			fieldsToValidate: [
				{
					fieldName: document.getElementById("editFormTaskItemName"),
					fieldInError: false,
					fieldDefaultValue: "",
					fieldErrorMsgLocation: document.getElementById("editFormTaskItemNameErrorMsg"),
					fieldErrMsg: "Task Title is required/Cannot be blank",
					isNotValid: function (str) {
						return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
					}
			},
				{ // Due Date Field
					fieldName: document.getElementById("editTaskDateTime"),
					fieldInError: false,
					fieldDefaultValue: "",
					fieldErrorMsgLocation: document.getElementById("editTaskDueDateErrorMsg"),
					fieldErrMsg: null,
					isNotValid: function (str) {}
			},
//			{	// Repeat Option
//				fieldName: document.getElementById("editFormRepeatSelect"),
//				fieldErrorMsgLocation: document.getElementById("editRepeatErrorMsgDiv"),
//				fieldErrMsg: "Must have a due date to make a task repeatable",
//				isNotValid: function(str) {
//					var dateValue = document.getElementById("editTaskDateTime").value;
//					if (str !== "none" && !dateValue.replace(/^\s+/g, '').length) {
//						return true;
//					} else {
//						return false;
//					}
//				}
//			},
				{ // List Selection Option
					fieldName: document.getElementById("editTaskFormListSelect"),
					fieldInError: false,
					fieldDefaultValue: "Default",
					fieldErrorMsgLocation: document.getElementById("editTaskListSelectErrorMsg"),
					fieldErrMsg: null,
					isNotValid: function (str) {}
			},
				{ // Notification 
					fieldName: document.getElementById("editTaskFormNotificationArea"),
					fieldInError: false,
					fieldDefaultValue: "",
					fieldErrorMsgLocation: document.getElementById("editTaskNotificationError"),
					fieldErrMsg: "Must set Due Date to use Notifications",
					isNotValid: function (str) {
						var dateValue = document.getElementById("editTaskDateTime").value;
						var notifications = document.getElementsByClassName("notification").length;
						if (notifications !== 0 && !dateValue.replace(/^\s+/g, '').length) {
							return true;
						} else {
							return false;
						}
					}
			}
		]
	}
  ]

	//	Array.prototype.contains = function(element) {
	//	var i;
	//	for (i = 0; i < this.length; i++) {
	//		if (this[i] === element) {
	//			return i; //Returns element position, so it exists
	//		}
	//	}
	//		return -1;
	//	}

	Array.prototype.contains = function (element) {
		var i;
		for (i = 0; i < this.length; i++) {
			if (this[i] === element) {
				return true; //Returns element position, so it exists
			}
		}
		return false;
	}
	
	// 
	

		

//		userTableDb.forEach( function (user, index){
//			return userDb.put(user).then( function ( users ) {
//				console.log("Users: ", users);
//				return users;
//			})
//			.catch(function (err) {
//				console.log("Error: " + err);
//			});
//
//		});	

		// System Defined TaskList 
//		systemDefinedTaskListTableDb.forEach(function (taskList, index )	{
//			taskListDb.put(taskList).then( function ( systemDefinedTaskList ) {
//				console.log("System Defined Task Lists: ", systemDefinedTaskList);
//				return systemDefinedTaskList;
//			})
//			.catch(function (err) {
//				console.log("Error: " + err);
//			});
//
//		});
					

		
		



	

	return {
		
		addUserSeedDataToDbs: function (taskListDb, taskItemDb) {	
			var seedDataPromises = []
			var allPromises = [];

			var seedTaskListPromises = taskListTableDb.map(function (taskList, index )	{
				return taskListDb.put(taskList).then( function ( result ) {
					console.log("addUserSeedDataToDbs::insidePromise::TaskList Items: ", result);
					return result;
					})
				.catch(function (err) {
					console.log("TaskList Index: " + index + " Error: " + err);
				});
			});

			var seedTaskItemPromises = taskItemsTableDb.map(function (taskItem, index) {
				return taskItemDb.put(taskItem).then( function (result ) {
					console.log("addUserSeedDataToDbs::inside promise:TaskItems: ", result);
					return result;
				})
				.catch(function (err) {
					console.log("TaskItem Index: " + index + " Error: " + err);
				});
			})


			seedDataPromises = seedTaskListPromises.concat(seedTaskItemPromises);
			console.log("addUserSeedDataToDbs::All Seed Promises: ", seedDataPromises);

			return seedDataPromises;
			
		},

		
		createDbIndexes: function (userDb, taskListDb, taskItemDb, taskItemNotificationDb) {
			var indexPromises = []

			var userDbIndex = userDb.createIndex({

					index: {
						fields: ['user_name']
					}
				})
			console.log("createDbIndexes::userDbIndex: ", userDbIndex);

			var taskListIndex =	taskListDb.createIndex({

					index: {
						fields: ['taskList_name']
					}
				})

			console.log("createDbIndexes::taskListIndex: ", taskListIndex);

			var taskItemIndex =	taskItemDb.createIndex({

					index: {
						fields: ['taskList_id', 'taskItem_name']
					}
				})
			
			var taskItemNotificationIndex = taskItemNotificationDb.createIndex({
				
				index: {
					fields: ['taskItem_id']
				}
			})


			indexPromises = [userDbIndex, taskListIndex, taskItemIndex, taskItemNotificationIndex ];

			console.log("createDbIndexes::indexPromises: ", indexPromises);

			return indexPromises;
		},
			
		initializeSystemDBs: function ( userDb, taskListDb ) {
			console.log(" Start initializeUserDb");
			var promises = [];
			var promises1 = [];
			var dbInitializations = [];

			var userDbInitialization = userTableDb.map( function (user, index){
				return userDb.put(user).then( function ( users ) {
					console.log("initializeSystemDBs::inside promise = Users: ", users);
					return users;
				})
				.catch(function (err) {
					console.log("Error: " + err);
				});

			});	

			console.log("initializeSystemDBs::UserDbInitialization: ", userDbInitialization);

			var systemTaskListDbInitialization = systemDefinedTaskListTableDb.map(function (taskList, index )	{
				return taskListDb.put(taskList).then( function ( systemDefinedTaskList ) {
					console.log("initializeSystemDBs::inside promise = System Defined Task Lists: ", systemDefinedTaskList);
					return systemDefinedTaskList;
				})
				.catch(function (err) {
					console.log("Error: " + err);
				});

			});

			console.log("initializeSystemDBs::SystemTaskListDbInitialization ", systemTaskListDbInitialization);


			console.log("initializeSystemDBs::userDbInitializations: ",  userDbInitialization);

			console.log(" initializeSystemDBs::End initializeUserDb");
			dbInitializations = userDbInitialization.concat(systemTaskListDbInitialization);

			console.log ("initializeSystemDBs::dbInitializations:::", dbInitializations);
			return dbInitializations; 

		},
		
		
		getMatchingTaskNotifications: function (taskItemId) {
			var allTaskNotifications = appModelController.getTaskItemNotificationsTable();
			var matchingTaskNotifications = allTaskNotifications.filter(function (notification) {
				return notification.taskItem_id === taskItemId;
			})
			return matchingTaskNotifications;
		},


		getAllTaskItemsForTaskList: function (taskListId) {
			var allTaskItems = appModelController.getTaskItemsTable();
			var taskItemsAssociatesWithTaskList = allTaskItems.filter(function (taskList) {
				return taskList.taskList_id === taskListId;
			})
			return taskItemsAssociatesWithTaskList;
		},

		deleteTaskItem: function (taskItemId) {
			var taskItems = appModelController.getTaskItemsTable();
			
			return appModelController.taskItemDb.get(taskItemId).then(function(doc) {
				return appModelController.taskItemDb.remove(doc._id, doc._rev);
			}).then(function (result) {
				// handle result
				console.log("Delete TaskItem Result: ", result);
				taskItems.splice(taskItems.findIndex(function (item) {
					return item._id === taskItemId;
				}), 1);

				
			}).catch( function (err) {
			  console.log(err);
			});
			
			

		},

		deleteTaskItemNotificationRecord: function (taskItemNotificationId) {
			var taskItemNotifications = appModelController.getTaskItemNotificationsTable();			
			return appModelController.taskItemNotificationDb.get(taskItemNotificationId)
				.then(function(doc) {
					return appModelController.taskItemNotificationDb.remove(doc._id, doc._rev);
			}).then(function (result) {
				// handle result
				console.log("Delete TaskNotification Result: ", result);
				taskItemNotifications.splice(taskItemNotifications.findIndex(function (notification) {
					return notification.notification_id === taskItemNotificationId;
				}), 1);
			}).catch(function (err) {
			  console.log(err);
			});
	
			

		},

		deleteTaskList: function (taskListId) {
			var taskLists = appModelController.getTaskListTable();
			return appModelController.taskListDb.get(taskListId).then(function(doc) {
  				appModelController.taskListDb.remove(doc._id, doc._rev);
			}).then(function (result) {
				console.log("TaskList Delete: ", result);

				taskLists.splice(taskLists.findIndex(function (list) {
					return list.taskList_id === taskListId;
				}), 1);
			}).catch(function (err) {
				console.log(err);
			});
			
			
//			taskLists.splice(taskLists.findIndex(function (list) {
//				return list.taskList_id === taskListId;
//			}), 1);
		},

		wereChangesMadeToTaskItem: function (obj1, obj2) {

			var obj1TaskCompletedDatePresent = false;
			var obj2TaskCompletedDatePresent = false;

			/* If user changes the completed status by unchecking completed checkbox and then rechecking it again before updating the taskItem it will result in a new taskCompletedDate being generated thus making it appear that the taskItem had been changed resulting in an unnecessary save of taskItem to DB an an incorrect status message to user ("Task updated"). To prevent this from happening we only check to whether the DB version of the record and the form input both indicate that a completedDate is present...hence the "present" variables an the if test to set the "present" values. 
			 */
			if (obj1.taskCompletedDate) {
				obj1TaskCompletedDatePresent = true;
			}
			if (obj2.taskCompletedDate) {
				obj2TaskCompletedDatePresent = true;
			}

			// Check to see if values on input match to determine whether there have been any changes and hence whether the task really needs to be save to local/remote storage
			if ((obj1.taskDueDate === obj2.taskDueDate) &&
				(obj1TaskCompletedDatePresent === obj2TaskCompletedDatePresent) &&
				(obj1.taskList === obj2.taskList) &&
//				(obj1.taskRepeat === obj2.taskRepeat) &&
				(obj1.taskTitle === obj2.taskTitle) &&
				(obj1.taskNotifications === obj2.taskNotificationsPresent)) {
				return false;
			} else {
				return true;
			}
		},

		/* 
			A taskItem Record has more values then are in the editTaskPage form (e.g., createTime). You want to extract only the core values (ones that will be input on editTaskPage form) so that we can later compare the input on the editTaskPage form so that we can compare those core values to the input values to determine if the taskItem has been "updated" and therefore needs to be saved to storage
		*/

		extractCoreTaskItemValues: function (fullTaskItemRecord) {


			return coreTaskItemRecord = {
				taskDueDate: fullTaskItemRecord.taskItem_due_date,
				taskCompletedDate: fullTaskItemRecord.taskItem_completedDate,
				taskId: fullTaskItemRecord._id,
//				taskList: appModelController.lookUpTaskListName(fullTaskItemRecord._id),
				taskList: appModelController.lookUpTaskListName(fullTaskItemRecord.taskList_id),
				taskRepeat: fullTaskItemRecord.taskItem_repeat,
				taskTitle: fullTaskItemRecord.taskItem_title,
				taskNotifications: fullTaskItemRecord.taskItem_notifications
			}
		},


		getModalWindowIndex: function (modalFormName) {
			switch (modalFormName) {
				case "navTaskListModalForm":
					return 0;

				case "newTaskListModalForm":
					return 1;

				case "editTaskListModalForm":
					return 2;

				case "manageListsAddNewListModalForm":
					return 3;

				case "manageListsEditListModalForm":
					return 4;

				default:
					console.log("getModalWindowIndex() error...no matching TaskListModal form: return -1 value)");
					return -1;


			}
		},

		getFormValidationObject: function (pageName) {
			var formObj;
			return formObj = formValidationObject.filter(function (formObject) {
				return formObject.pageName === pageName;
			})
		},

		getUserDefinedTaskListInfo: function () {
			return userDefinedTaskListsInfo
		},

		getPreDefinedTaskListNames: function () {
			return ["All Lists", "Default", "Completed"];
		},


		getTaskItemsTable: function () {
			//			var taskItemsTable = [];
			return taskItemsTable;
		},

		getTaskItemNotificationsTable: function () {
			return taskItemNotificationsTable;
		},

		getTaskListTable: function () {
//			var taskList = appModelController.taskListDb.allDocs({include_docs: true})
//				.then(function (result) {
//					console.log(result);
//					return result;
//				})
			return taskListTable;
		},
		
		loadTaskListDataFromDb: function (taskListDb) {
			var listId, listName, totalItemCount, overDueItemCount, completedCount, listCreateTime, userId, taskListIsArchived;
			var taskListAttributes;  
			return taskListPromise = taskListDb.allDocs({include_docs: true})
				.then(function (results) {
					var taskListTable = appModelController.getTaskListTable(); 
					results.rows.map(function (taskList, index) {
						if (taskList.doc.taskList_name !== undefined) {
									
							
							listId = taskList.doc._id;
							listName = taskList.doc.taskList_name;
							totalItemCount = taskList.doc.taskList_totalCount;
							overDueItemCount = taskList.doc.taskList_overDueCount
							completedCount = taskList.doc.taskList_completedCount;	
							listCreateTime = getTimeStamp();
							userId = taskList.doc.user_id;
							taskListIsArchived = false;
//							listId, listName, userId, totalItemCount, overDueItemCount, completedCount, listCreateTime, taskListIsArchived
							taskListAttributes = new TaskList(listId, listName, userId, totalItemCount, overDueItemCount, completedCount, listCreateTime, taskListIsArchived);
							taskListTable.push(taskListAttributes);
						}
					})
					return results;
			})
		},
		
		loadTaskItemDataFromDb: function (taskItemDb) {
			var id, listId, title, description, dueDate, dueTime, priority, status, isComplete, repeat, isArchived, notificationsPresent, calendar, completedDate, createTime;
			var taskItemAttributes; 
			
			return taskItemPromise = taskItemDb.allDocs({include_docs: true})
				.then(function (results) {
				var taskItemsTable = appModelController.getTaskItemsTable();
				results.rows.map(function (taskItem, index ) {
					if (taskItem.doc.taskItem_title != undefined) {
						id = taskItem.doc._id
						listId = taskItem.doc.taskList_id
						title = taskItem.doc.taskItem_title 
						description = taskItem.doc.taskItem_description
						dueDate = taskItem.doc.taskItem_due_date
						dueTime = taskItem.doc.taskItem_due_time
						priority = taskItem.doc.taskItem_priority
						status = taskItem.doc.taskItem_status
						isComplete = taskItem.doc.taskItem_isCompleted
						repeat = taskItem.doc.taskItem_repeat
						isArchived = taskItem.doc.taskItem_isArchived
						notificationsPresent = taskItem.doc.taskItem_notifications
						calendar = taskItem.doc.taskItem_calendar
						completedDate = taskItem.doc.taskItem_completedDate
						createTime = getTimeStamp();
						
						taskItemAttributes = new TaskItem (id, listId, title, dueDate, repeat, completedDate, createTime, notificationsPresent);
						
						taskItemsTable.push(taskItemAttributes);
					}
				})
				return results;
			});
		}, 
	
		loadTaskItemNotificationsDataFromDb: function (taskItemNotificationDb) {
			var taskItemNotificationAttributes;
			var notificationId, taskItemId, notificationType, notificationUnits, notificationUnitType, createTime;
			
			
			return taskItemNotificationPromise = taskItemNotificationDb.allDocs({include_docs: true})
				.then(function (results) {
				
				var taskItemNotificationsTable = appModelController.getTaskItemNotificationsTable();
				
				results.rows.map(function (taskItemNotification) {
					
					if (taskItemNotification.doc.notification_type != undefined) {
						
						createTime = taskItemNotification.doc.notification_createTime;
						notificationType = taskItemNotification.doc.notification_type;
						notificationUnitType = taskItemNotification.doc.notification_unitType;
						notificationUnits = taskItemNotification.doc.notification_units;
						taskItemId = taskItemNotification.doc.taskItem_id;
						notificationId = taskItemNotification.doc._id;

						taskItemNotificationAttributes = new TaskItemNotification (
							notificationId,
							taskItemId,
							notificationType,
							notificationUnits,
							notificationUnitType,
							createTime );

						taskItemNotificationsTable.push(taskItemNotificationAttributes);
					}
				})
				return results;
			});
		}, 		
		


		loadDataFromDb: function (taskListDb, taskItemDb, taskItemNotificationDb) {
			var loadTaskListPromises = appModelController.loadTaskListDataFromDb(taskListDb);
			var loadTaskItemPromises = appModelController.loadTaskItemDataFromDb(taskItemDb);
			var loadTaskItemNotificationsPromises = appModelController.loadTaskItemNotificationsDataFromDb(taskItemNotificationDb); 
			return Promise.all([loadTaskListPromises, loadTaskItemPromises, loadTaskItemNotificationsPromises]).then( function ( updateResults ){
				console.log(">>>>>>>Update Results from loadDataFromDb: ", updateResults);
				return updateResults;
				
			})
		},

		/* Returns an array containing just the User defined Task table entries from TaskListTable.
		   It does this by filtering out any of the taskListTable entries whose names are in the 
		   System/Predefined Task Task List Names..thus you end up with a a table containing only the 
		   User Defined TaskList table entries
		*/
		getUserDefinedTaskList: function () {
			var taskListTable = appModelController.getTaskListTable();
			return userDefinedTaskLists = taskListTable.filter(function (taskItem) {
				if (!appModelController.getPreDefinedTaskListNames().contains(taskItem.taskList_name)) {
					return taskItem;
				}
			});

		},

		getPreDefinedTaskListIds: function () {
			var preDefinedTaskListTable = appModelController.getPreDefinedTaskList();
			return preDefinedTaskListIdArray = preDefinedTaskListTable.reduce(function (taskIdList, taskList) {
				taskIdList.push(taskList.taskList_id);
				return taskIdList;
			}, []);
			return preDefinedTaskListIdArray;
		},

		getPreDefinedTaskList: function () {
			var taskListTable = appModelController.getTaskListTable();
			return preDefinedTaskList = taskListTable.filter(function (taskList) {
				if (appModelController.getPreDefinedTaskListNames().contains(taskList.taskList_name)) {
					return taskList;
				}
			});
		},


		getTaskListNames: function () {
			var sortedTaskListTable = appModelController.sortListByName(taskListTable);
			var listNamesArray = taskListTable.reduce(function (namesList, listObj) {
				namesList.push(listObj.taskList_name);
				return namesList;
			}, []);
			return listNamesArray;
		},

		lookupTaskItemNotification: function (notificationId) {
			var matchingNotificationRecord = null;
			var taskNotifications = appModelController.getTaskItemNotificationsTable();
			matchingNotificationRecord = taskNotifications.filter(function (notification) {
				return notification.notification_id === notificationId;
			});
			return matchingNotificationRecord[0];
		},

		lookUpTaskListId: function (listName) {
			var matchingListRecord = appModelController.getTaskListTable().filter(function (listItem) {
				return listItem.taskList_name === listName;
			});
			return matchingListRecord[0].taskList_id;

		},

		lookupTaskListRecordByListId: function (listId) {
			var matchingListRecord = appModelController.getTaskListTable().filter(function (listItem) {
				return listItem.taskList_id === listId;
			});
			return matchingListRecord[0]
		},

		/****************************************************************************************
			MODULE: Model Controller
			METHOD: lookUpTaskItemRecord
		*****************************************************************************************/


		lookUpTaskItemRecord: function (taskItemId) {
			var taskItemsTable = appModelController.getTaskItemsTable();
			var matchingTaskItemRecord = taskItemsTable.filter(function (taskItem) {
				return taskItem._id === taskItemId;
			})
			return matchingTaskItemRecord[0];
		},

		lookUpTaskListName: function (taskListId) {
			var taskListTable = appModelController.getTaskListTable();
			var matchingTaskListName = taskListTable.filter(function (taskList) {
				return taskList.taskList_id === taskListId;
			})
			return matchingTaskListName[0].taskList_name;
		},
		/****************************************************************************************
			MODULE: Model Controller
			
			METHOD: createNewTaskItem - 

			Trigger(s): 
			Summary: 

			UI Behavior: NA 

		*****************************************************************************************/

		//{newTaskTitle: "1234", newTaskDateTime: "12/22/2017 - 10:14 AM", newTaskRepeateOptionTxt: "None", newTaskListOptionTxt: "Default"}
		createNewTaskItem: function (taskItemInput) {
			console.log("*************** createNewTaskItem()");
			console.log("TaskItemInput", taskItemInput);
			var newTaskItem;

			var notificationsPresent = false;


			// 1. Generate taskItem_Id and assign
			var taskItemId = getUniqueId();
			console.log("TaskItem ID: ", taskItemId);

			// 2. Look up taskListId based on taskListName
			var taskListId = lookUpTaskListId(taskItemInput.newTaskListOptionTxt);

			// 3. Generate createTime
			var createTime = getTimeStamp();

			var taskCompletedDate = "";
			
			// 
			if (taskItemInput.newTaskNotifications.length > 0) {
				notificationsPresent = true;
			}

			
			return appModelController.taskItemDb.put({
				"_id": taskItemId,
				"taskList_id":taskListId,
				"taskItem_title":taskItemInput.newTaskTitle,
				"taskItem_description": "",
				"taskItem_due_date":taskItemInput.newTaskDueDate,
				"taskItem_completedDate": "",
				"taskItem_priority": "",
				"taskItem_status": "",
				"taskItem_isCompleted": "",
				"taskItem_repeat": taskItemInput.newTaskRepeateOptionTxt,
				"taskItem_isArchived": "",
				"taskItem_notifications": notificationsPresent,
				"taskItem_calendar": "",
				"taskItem_completedDate": "",
				"taskItem_createTime": createTime.toString()
				
				
			}).then(function (response) {
				
				console.log("TaskItemPut response: ", response)
				newTaskItem = new TaskItem(
					taskItemId,
					taskListId,
					taskItemInput.newTaskTitle,
					taskItemInput.newTaskDueDate,
					taskItemInput.newTaskRepeateOptionTxt,
					taskCompletedDate,
					createTime,
					notificationsPresent
				)
				
				// Add New task object to New TaskItem table
				appModelController.getTaskItemsTable().push(newTaskItem);
				
				return newTaskItem;
				
			}).catch(function (err) {
				
				console.log(err);
				
			});

		},

		createNewNotificationObject: function (newTaskNotification, taskItemId) {
			console.log("createNewNotificationObject");
			// Generate a uniqued Id for the notification
			var notificationId = getUniqueId();


			// Generate createTime
			var createTime = getTimeStamp();

			return appModelController.taskItemNotificationDb.put({
				"_id": notificationId,
				"taskItem_id": taskItemId,
				"notification_type": newTaskNotification.notificationType,
				"notification_units": newTaskNotification.notificationUnits,
				"notification_unitType": newTaskNotification.notificationUnitType,
				"notification_createTime": createTime
				
			}).then(function (response) {
				
				console.log("TaskItemNotification response: ", response)
				return newTaskNotification = new TaskItemNotification(
					notificationId,
					taskItemId,
					newTaskNotification.notificationType,
					newTaskNotification.notificationUnits,
					newTaskNotification.notificationUnitType,
					createTime
				)
				
			}).catch(function (err) {
				
				console.log(err);
			});

//			return newTaskNotification = new TaskItemNotification(
//				notificationId,
//				taskItemId,
//				newTaskNotification.notificationType,
//				newTaskNotification.notificationUnits,
//				newTaskNotification.notificationUnitType,
//				createTime
//			)
			
			
		},

		/****************************************************************************************
			MODULE: Model Controller
			
			METHOD: createNewTaskList - 

			Trigger(s): 
			Summary: 

			UI Behavior: NA 

		*****************************************************************************************/
		createNewTaskList: function (taskListInput) {
			var overDueCount = 0;
			var totalListCount = 0;
			var completedCount = 0;
			var newTaskList = null;
			var taskListIsArchived;
			console.log("*************** createNewTaskList()");
			console.log("TaskListInput", taskListInput);


			// 1. Generate taskItem_Id and assign
			var taskListId = getUniqueId();
			console.log("TaskList ID: ", taskListId);

			// 2. Set is_Archived
			taskListIsArchived = false;

			// 3. Generate createTime
			var createTime = getTimeStamp();

			// 4. Task list userId
			var userId = "01";
			
			return appModelController.taskListDb.put({
				_id: taskListId,
				taskList_completedCount: completedCount, 
				taskList_createTime: createTime,
				taskList_isArchived: taskListIsArchived, 
				taskList_name: taskListInput,
				taskList_overDueCount: overDueCount,
				taskList_totalCount: totalListCount, 
				user_id: userId		
				
			}).then(function (response) {
				
				console.log("TaskList Put response: ", response);
				newTaskList = new TaskList(
					taskListId,
					taskListInput,
					userId,
					totalListCount,
					overDueCount,
					completedCount,
					createTime,
					taskListIsArchived
				);
				
				// Add New task List object to New TaskList table	
				appModelController.getTaskListTable().push(newTaskList);
				
				return newTaskList;
				

			}); 
			
// Not sure if I need this catch given there is a catch in the calling method
//				
//			}).catch(function (err) {		
//				console.log(err);		
//				
//			});
//			
//			return newTaskList;

		},

		/****************************************************************************************
			MODULE: Model Controller
			
			METHOD updateListTaskTotals - recalculates the taskItem totals for all lists (Pre-defined and Userdefined)
			that are displayed on the taskList subMenu dropdown on Nav bar

			Trigger(s): This function will be called each time any of the following events occurs:
				1) A new taskitem is SAVED on newTaskForm
				2) An existing Task is EDITED on editTaskForm 
				3) A taskItem is marked as COMPLETED
				4) A taskItem is DELETED 

			Summary: 
				Recalculates the TaskList taskItem totals for both Pre-defined and UnserDefined list items
				And save those updated values in appropriate TaskListTable variable
				Note: It does not update the the totals on the UI. That is responssibility
				of a UI method.


			UI Behavior: NA 

		*****************************************************************************************/

		updateListTaskTotals: function () {
			console.log("----UpdateListTaskTotals() function");
			var taskListId;
			var listTotals = [];
			var taskDueDateYMD, currDateYMD;
			var matchingTaskItems = [];
			var overDueCount = 0;
			var taskListTable;


			Array.prototype.hasElement = function (element) {
				var i;
				for (i = 0; i < this.length; i++) {
					if (this[i].taskList_name === element) {
						return i; //Returns element position, so it exists
					}
				}
				return -1; //The element isn't in your array
			};

			var convertDateString2DateObject = function (dateString) {
				var date;
				date = new Date(dateString);
				return new Date(date.getFullYear(), date.getMonth(), date.getDate());
			}

			// Create an array containing all of the TaskList Names
			var taskListNames = appModelController.getTaskListNames();

			//		- For each list in taskListNamesArray (built in init()) 
			//       	- Get the taskListId associated with the list name
			//          - matchingTaskItems = Get all the taskItems with the matching listId (filter)
			//          - For each taskItem count the number of items that are overDue
			//          - Add the overDueCount and matchingTaskItems.length to userDefinedTaskListsInfo
			//     - END For EACH

			taskListNames.forEach(function (taskListName) {
				taskListId = appModelController.lookUpTaskListId(taskListName);
				if (taskListName !== 'Completed') {
					matchingTaskItems = getAllActiveMatchingTaskItemsWithId(taskListId);
					overDueCount = matchingTaskItems.reduce(function (overDue, taskItem) {
						if (taskItem.taskItem_due_date !== "") {
							taskDueDateYMD = convertDateString2DateObject(taskItem.taskItem_due_date);
							currDateYMD = convertDateString2DateObject(new Date());
							// If taskItem's Due date is before Today's Date & time then increment overDueCount
							if (JSON.stringify(taskDueDateYMD) < JSON.stringify(currDateYMD)) {
								overDue++
							}
						}
						return overDue;
					}, 0);

				} else { // listname = 'Complete'  
					matchingTaskItems = appUIController.getTaskItemsMarkedAsComplete();
					overDueCount = 0;
				}



				console.log("Task: " + taskListName + " OverDueCount: " + overDueCount + " Total List Count " + matchingTaskItems.length);

				taskListTable = appModelController.getTaskListTable();
				var tableIndex = utilMethods.hasElement(taskListTable, taskListName);
				if (tableIndex > -1) {
					//				console.log("Table Index: " + tableIndex )
					taskListTable[tableIndex].taskList_overDueCount = overDueCount;
					taskListTable[tableIndex].taskList_totalCount = matchingTaskItems.length;
				} else {
					console.log("ERROR: No match found");
				}

			})

			// Create a count of "complete" task in each list and update that lists complete count 

			return taskListTable;
		},



		sortListByName: function (listToSort) {
			// Sort all List alphabetically
			listToSort.sort(function (a, b) {
				var nameA = a.taskList_name.toUpperCase(); // ignore upper and lowercase
				var nameB = b.taskList_name.toUpperCase(); // ignore upper and lowercase
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}

				// names must be equal
				return 0;
			});

		}
	}
})();


//**************************************************************************************
//
// CONTROLLER: TASKIT APP UI CONTROLLER
//
//**************************************************************************************
// Examples of tasks:
// 1: Define Methods to Return values entered in via the UI 
// 

var appUIController = (function () {
	var DOMstrings = {

	};

	/* While grouping taskItems by due date category, this array holds the list of taskItems that have not yet been grouped into their appropriate Due Date Category 
	 */
	var listItemsLeftToCategorize = [];

	/* MainPage Elements */
	var mainPage = document.querySelector("#mainPage");
	var subMenuListDOMNode = document.querySelector(".taskListsSubMenu");
	var completedDateStyling = document.querySelector(".completedDateStyling");
	var completedDateHeader = document.querySelector(".completedDateHeader");

	/* New Task Form Elements*/
	var inputNewTaskListName = document.getElementById("newTaskListName");
	var inputNewTaskTitle = document.getElementById("newTaskTitle");
	var inputNewTaskDateTime = document.querySelector("#newTaskDateTime");
	var inputNewTaskDueTime = document.querySelector("#newTaskDueTime");
	var inputNewTaskListSelection = document.querySelector("#newTaskListNameSelect");
	var inputNewTaskRepeat = document.querySelector("#newTaskRepeatOption");
	var addNewFormNotifications = document.querySelector("#addNewFormNotifications");
	var newTaskFormNotificationArea = document.querySelector("#newTaskFormNotificationArea");
	var newTaskNotificationError = document.querySelector("#newTaskNotificationError");
	//	var addEditFormNotification = document.querySelector("#addEditFormNotification");
	//	var deleteNotification = document.querySelector(".deleteNotificationIcon")


	/* Edit Task Form Elements*/
	var formEditNewTask = document.getElementById("formEditNewTask");
	var inputEditFormTaskItemName = document.getElementById("editFormTaskItemName");
	var inputEditFormTaskItemId =
		document.getElementById("editFormTaskItemId");
	var inputEditFormCompletedSetting = document.getElementById("editFormCompletedSetting");
	var inputEditCompletedDate = document.getElementById("completedDate");
	var inputEditFormTaskItemDueDate = document.getElementById("editTaskDateTime");
	var inputEditFormRepeatSelect = document.getElementById("editFormRepeatSelect");
	var inputEditFormListSelect = document.getElementById("editTaskFormListSelect");
	var editFormCancelButton = document.getElementById("editFormCancelButton");
	var editFormUpdateTaskNavButton = document.getElementById("updateTaskNavBtn");
	var editTaskSaveMessage = document.getElementById("editTaskSaveMsg");
	var addEditFormNotifications = document.getElementById("addEditFormNotifications");
	var editTaskFormNotificationArea = document.getElementById("editTaskFormNotificationArea");
	var editTaskNotificationError = document.getElementById("editTaskNotificationError");


	/* Manage Task Lists Page elements */
	var manageTaskListsMsg = document.getElementById("manageTaskListsMsg")
	var manageTaskListsIcon = document.getElementById("manageTaskListsIcon");
	var manageTaskListsBackArrow = document.getElementById("manageTaskListsBackArrow");
	var manageTaskListsContent = document.getElementById("manageTaskListsContent");
	var manageListsEditListModalForm = document.getElementById("manageListsEditListModalForm");

	/* Modal Form Lists Page elements */
	var modalFormEditTaskListId = document.getElementById("modalFormEditTaskListId");


	//$$$$$
	var addDueDateBtn = document.querySelector(".addDueDateBtn");
	var clearDueDateBtn = document.querySelector(".clearDueDateBtn");
	//	var clearDueTimeBtn = document.querySelector(".clearDueTimeBtn");

	var inputNavListModalListName = document.querySelector("#navListModalListName");
	var modalListInput = document.querySelector(".modalListInput");


	var newTaskFormErrorMsg = document.getElementById("newTaskFormErrorMsg");
	var newTaskSaveMessage = document.querySelector("#newTaskSaveMsg");
	var addTaskResetButton = document.querySelector("#addTaskResetButton");
	var navTaskListModalMessage = document.querySelector("#navTaskListModalMsg");
	var newTaskFormListModalMessage = document.querySelector("#newTaskFormListModalMsg");
	var editTaskFormListModalMessage = document.querySelector("#editTaskFormListModalMsg");
	////////

	// Modal Form Listeners 
	var formNavTaskListModal = document.querySelector("#formNavTaskListModal");
	var navListModalListNameErrorMsg = document.querySelector("#navListModalListNameErrorMsg");
	var addNewTaskListModal = document.querySelector("addNewTaskListModal");
	var inputEditListName = document.getElementById("manageListsEditListModalFormListName")
	var deleteTaskItemId = document.getElementById("deleteTaskItemId");
	var deleteModalTaskItemName = document.getElementById("deleteModalTaskItemName");
	var deleteTaskItemModalForm = document.getElementById("deleteTaskItemModalForm");



	var allListsElem = document.querySelector("#allListsElem");
	var completedListElem = document.querySelector("#completedListElem");
	var defaultListElem = document.querySelector(".defaultListElem");
	var newListCancelBtn = document.querySelectorAll(".newListCancelBtn");

	var listMenuTitle = document.getElementById('taskListDropdown');
	var formDatetimeInputBox = document.querySelector(".form_datetime");
	var repeatErrorMsgDiv = document.getElementById('repeatErrorMsgDiv');
	var editRepeatErrorMsgDiv = document.getElementById('editRepeatErrorMsgDiv');
	var newTaskRepeatGroup = document.getElementById('newTaskRepeatGroup');
	//	var taskListMenuTitle = document.getElementById('taskListMenuTitle');
	var addTaskResetButton = document.getElementById("addTaskResetButton");
	var mainPageSuccessMsg = document.getElementById("mainPageSuccessMsg");
	var mainPageGeneralMsgLoc = document.getElementById("mainPageGeneralMsgLoc");
	var expandTaskActions = document.querySelector(".expandTaskActions");



	/* aTaskInGroup - flag used when displaying a user selected task list to facilitate display of that list into "Due Date Groups". It's a flag (initially set to false) that is set to true if at least one taskItem in a user selected task is found that matches a Due Date Grouping category. A true value signals that the Due Date HTML header (e.g., "Over Due") and closing tag need to be generated for that Due Date Group.  This flag is reset to false each time the controller is invoked it is invoked because each invocation means that 	you have a new key/category. 
	 */
	var aTaskInGroup = false;

	// NewTask form flag, not to be confused with "formErrors" CSS class
	var formError = false;


	function isEmpty(str) {
		return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
	}



	function resetFormError1(formValidationObj) {
		// Reset formError 
		formValidationObj.formError = false;

		// Clear out any prior success/error messages 
		//		formValidationObj.formSubmitErrorMsgLoc.innerHTML = "";
		//		formValidationObj.formSubmitSuccessMsgLoc.innerHTML = "";

		// For each field on the form remove any error messages/styling 
		formValidationObj.fieldsToValidate.forEach(function (field) {
			field.fieldErrorMsgLocation.innerHTML = "";
			field.fieldName.classList.remove("filled");
			field.fieldName.classList.remove("formErrors");
		});
	}


	function removeNewTaskFormInputStyle() {
		inputNewTaskTitle.classList.remove("filled");
		inputNewTaskRepeat.classList.remove("filled");
		inputNewTaskListSelection.classList.remove("filled");
		inputNewTaskDateTime.classList.remove("filled");

	}

	/* Gets the Active List Task Name */
	//	function getActiveTaskListName() {
	//		return getActiveTaskList().childNodes[1].textContent.trim();	
	//	}

	function clearOutSelectList(selectNode) {
		var length = selectNode.options.length;
		while (length--) {
			selectNode.remove(length);
		}
	}



	/********************************************************************************
		METHOD:  insertAfter()
		There is no pre-defined method for inserting a node after another node...so this does it. 
	*********************************************************************************/

	function insertAfter(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	} // END insertAter()

	/********************************************************************************
		METHOD:  containsObject()
		Determines whether object is found in an array. 
		Returns TRUE if a match was found
	*********************************************************************************/
	function containsObject(obj, list) {
		var i;
		for (i = 0; i < list.length; i++) {
			if (list[i] === obj) {
				return true;
			}
		}

		return false;
	} // END containsObject()

	Array.prototype.hasElement = function (element) {
		var i;
		for (i = 0; i < this.length; i++) {
			if (this[i].taskList_name === element) {
				return i; //Returns element position, so it exists
			}
		}
		return -1; //The element isn't in your array
	};

	function disableRepeatInputAndSetErrors(event) {
		var pageId = utilMethods.findAncestor(event.currentTarget, 'container-fluid').id;

		// Page Id is used to identify the appropirate validationObject
		var formValidationObj = appModelController.getFormValidationObject(pageId);

		formValidationObj[0].formError = true;
		appUIController.getUIVars().repeatErrorMsgDiv.innerHTML = '<i class="fa fa-times-circle"></i>' + " Must enter Due Date to make repeatable";
		appUIController.getUIVars().repeatErrorMsgDiv.classList.add("errorMsg");
		appUIController.getUIVars().formDatetimeInputBox.classList.add("formErrors");
		//		inputNewTaskRepeat.disabled = true;
		// Changing disabled value causes field to be changed and .filled class to be added...so I have to remove it. 
		//		inputNewTaskRepeat.classList.remove("filled");

	}



	/****************************************************************************************************************/
	/* 					           ****** APP UI CONTROLLER METHODS ********										*/
	/****************************************************************************************************************/
	return {
		clearDueDate: function (event) {
			console.log("clearDueDate");
			var pageId = utilMethods.findAncestor(event.currentTarget, 'container-fluid').id;

			var validationObj = appModelController.getFormValidationObject(pageId);

			// Change the DueDate field styling to show user changed it. 
			validationObj[0].fieldsToValidate[1].fieldName.value = "";


		},
		//		clearDueTime: function (event) {
		//			console.log("clearDueTime");
		//			var pageId = utilMethods.findAncestor(event.currentTarget, 'container-fluid').id;
		//			
		//			var validationObj = appModelController.getFormValidationObject(pageId);
		//			
		//			// Change the DueDate field styling to show user changed it. 
		//			validationObj[0].fieldsToValidate[5].fieldName.value = "";
		//			
		//			
		//		}, 
		styleNotificationInput: function (event) {
			console.log("styleNotficationInput");


			switch (event.target.nodeName) {
				case "INPUT":
				case "SELECT":
					if (event.target.classList.contains("notificationType")) {
						if (event.target.value != "notification") {
							event.target.classList.add("filled");
						}

					} else if (event.target.classList.contains("notificationUnits")) {
						if (event.target.value != "10") {
							event.target.classList.add("filled");
						}

					} else if (event.target.classList.contains("notificationUnitType")) {
						if (event.target.value != "minutes") {
							event.target.classList.add("filled");
						}
					}

				default:
					console.log("Didn't click on input field")
			}

			//			event.target.classList
			//			event.target.nodeName
			//			event.target.value
			//			event.target.classList.contains("notificationType")
			//			event.target.classList.contains("notificationUnits")
			//			event.target.classList.contains("notificationUnits")
			//			event.target.classList.contains("notificationUnitType")




		},

		// **** COMMENTED OUT BECAUSE I REMOVED REPEAT OPTION
		// ***** NOTE: ALSO CHANGED fieldsToValidate index from 4 to 3 given i removed 
		clearFormRepeatAndNotificationErrors: function (validationObj) {

			// Clear error styling from Repeat field
			//			validationObj[0].fieldsToValidate[2].fieldName.classList.remove("formErrors");
			//			validationObj[0].fieldsToValidate[2].fieldErrorMsgLocation.innerHTML = "";

			// Clear error styling from Notfication area 
			validationObj[0].fieldsToValidate[3].fieldName.classList.remove("formErrors");
			validationObj[0].fieldsToValidate[3].fieldErrorMsgLocation.innerHTML = "";

		},

		/* This method is called anytime there is an actual change in the datetime. This change could be the result of the user clicking on the addDueDateBtn or clicking on the input area to make a change...but in either case the event isn't triggered unless the dateTime is actually changed or set regardless of what they clicked on. 
		
		The event listener is set via the following jQuery statement:
		
			$('.form_datetime').datetimepicker().on('changeDate', function(e) {
				appUIController.dueDateUpdate(e);
				console.log(e);	
			});
		Eventually I want to convert this to a JS call rather than jQuery.
		
		This method handles styling the field (change font-style & color to show user changed the field in some way) and clearing error messages that occured on the form upon submission. Specifically a user must set a Due Date in order to make a task "repeating" (repeat set to something other than none) and a Due date must be present to set notifications. After submission if the user sets a Due Date then we will immediately clear these error messages on the form.  

		*/
		dueDateUpdate: function (event) {
			console.log("dueDateUpdate");
			// Calendar Entry fields (addCalendarBtn or inputArea)

			// For calendar events (event.type = "changeDate") event.target doesn't give you the specific field to apply styling to show user changed something (add 'filled' class) so pageId must be derived to determine specific field	
			var pageId = utilMethods.findAncestor(event.currentTarget, 'container-fluid').id;

			var validationObj = appModelController.getFormValidationObject(pageId);

			// Determine which DatePicker field changed and style to indicate it changed
			if (event.currentTarget.id === "newTaskDatePicker" || event.currentTarget.id === "editTaskDatePicker") {
				validationObj[0].fieldsToValidate[1].fieldName.classList.add("filled");
			}

			//			else {
			//				validationObj[0].fieldsToValidate[5].fieldName.classList.add("filled");
			//			}

			//			 **** COMMENTED OUT BECAUSE I ELIMINATED REPEAT OPTION 
			// Now a DueDate has been added we need to clear any error messages were caused when the form was submitted without a dueDate (e.g., repeat & notifications set)

			appUIController.clearFormRepeatAndNotificationErrors(validationObj);


		},


		// DELETE THIS METHOD -- ENDED UP NOT NEEDING IT
		displayNotificationIcon: function (taskItemId) {

			var matchingCardNode;
			var notificationNode;
			var cardNodes;
			console.log("displayNotficationIcon");

			cardNodes = document.getElementsByClassName("card");

			// Get the task card for the taskItem
			matchingCardNode = Array.prototype.filter.call(cardNodes, function (cardNode) {
				if (cardNode.dataset.id === taskItemId) {
					return cardNode
				}
			});
			notificationNode = matchingCardNode[0].childNodes[0].childNodes[2];
			notificationNode.classList.remove("hideIt");
		},

		buildAndDisplayTaskItemNotifications: function (taskItemNotifications) {
			var genericTaskItemNotificationHTML, specificTaskItemNotificationHTML;
			var newNode;
			var insertNodeLocation = appUIController.getUIVars().addEditFormNotifications.parentNode;

			taskItemNotifications.forEach(function (taskItemNotification) {

				var genericTaskItemNotificationHTML = '<div class="form-group notification" data-id="%notificationId%"><div class="row col-4 notificationComponent"><select class="form-control notificationType" name="notificationType" id="notificationType"><option value="notification" %notificationOption%>Notification</option><option value="email" %emailOption%>Email</option></select></div><div class="row col-3 notificationComponent"><input class="form-control notificationUnits" id="notificationUnits" type="number" name="notificationUnits" min="1" max="999" value="%notificationUnits%"></div><div class="row col-3 notificationComponent"><select class="form-control notificationUnitType" id="notificationUnitType" name="notificationUnitType"><option value="minutes" %minutesOption%>Minutes</option><option value="hours" %hoursOption%>Hours</option><option value="days" %daysOption%>Days</option><option value="weeks" %weeksOption%>Weeks</option></select></div><div class="row col-2 notificationComponent deleteNotificationIcon" onclick="appUIController.deleteNotification(this)"><i class="fa fa-trash-o"></i></div></div>';

				specificTaskItemNotificationHTML = genericTaskItemNotificationHTML.replace("%notificationId%", taskItemNotification.notification_id);


				switch (taskItemNotification.notification_type) {
					case "notification":
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%notificationOption%", "selected");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%emailOption%", "");
						break;
					case "email":
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%notificationOption%", "");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%emailOption%", "selected");
						break;
					default:
						console.log("Error: No matching notification type");
				}

				specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%notificationUnits%", taskItemNotification.notification_units);


				switch (taskItemNotification.notification_unitType) {
					case "minutes":
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%minutesOption%", "selected");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%hoursOption%", "");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%daysOption%", "");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%weeksOption%", "");
						break;
					case "hours":
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%minutesOption%", "");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%hoursOption%", "selected");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%daysOption%", "");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%weeksOption%", "");
						break;
					case "days":
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%minutesOption%", "");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%hoursOption%", "");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%daysOption%", "selected");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%weeksOption%", "");
						break;
					case "weeks":
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%minutesOption%", "");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%hoursOption%", "");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%daysOption%", "");
						specificTaskItemNotificationHTML = specificTaskItemNotificationHTML.replace("%weeksOption%", "selected");
						break;
					default:
						console.log("Error: No matching notification Unit Type");
				}
				newNode = document.createRange().createContextualFragment(specificTaskItemNotificationHTML);
				insertNodeLocation.append(newNode);
			})

		},

		deleteNotification: function (event) {
			console.log("deleteNotification");
			var pageId = utilMethods.findAncestor(event, 'container-fluid').id
		

			// If the parentNode has an ID for the taskNotification we need to delete the notification from the table also
			if (event.parentNode.dataset.id !== "") {
				appModelController.deleteTaskItemNotificationRecord(event.parentNode.dataset.id)
				.then (function (taskItemNotification) {
					console.log ("TaskItemNotification Deleted Successfully: ", taskItemNotification);
					
				})
			}
			var parentNode =
				event.parentElement;
			parentNode.remove();

			/* If the notification validation object shows there is an error (no due date was entered) and the user has deleted the last notfication on the page 
			 */


			var validationObj = appModelController.getFormValidationObject(pageId)
			var notificationsOnPage = document.getElementsByClassName("notification").length;
			//			if ((validationObj[0].fieldsToValidate[4].fieldInError) && (notificationsOnPage === 0)) {

			// ***** MODIFIED BECAUSE I ELIMINATED REPEAT OPTION CHANGED fieldsToValidate Index from 4 to 3
			if (notificationsOnPage === 0) {
				validationObj[0].fieldsToValidate[3].fieldName.classList.remove("formErrors");
				validationObj[0].fieldsToValidate[3].fieldErrorMsgLocation.innerHTML = "";
				validationObj[0].fieldsToValidate[3].fieldInError = false;

			}

		},


		addNewNotification: function (event) {
			console.log("addNewNotification()");

			// Need to get the div's node that wraps the icon & span 
			var divNode = event.target.closest('div');

			// Now need to get parent node for the notificationArea
			var insertNodeLocation = divNode.parentNode;

			//			var insertNodeLocation = appUIController.getUIVars().notificationArea;

			var newNotificationHTML = '<div class="form-group notification"><div class="row col-4 notificationComponent"><select class="form-control notificationType" name="notificationType" id=""><option value="notification">Notification</option><option value="email">Email</option></select></div><div class="row col-3 notificationComponent"><input class="form-control notificationUnits" type="number" name="notificationUnits" min="1" max="999" value="10"></div><div class="row col-3 notificationComponent"><select class="form-control notificationUnitType" name="notificationUnitType" id=""><option value="minutes">Minutes</option><option value="hours">Hours</option><option value="days">Days</option><option value="weeks">Weeks</option></select></div><div class="row col-2 notificationComponent deleteNotificationIcon" onclick="appUIController.deleteNotification(this)"><i class="fa fa-trash-o"></i></div></div>'
			//* Convert completed HTML string into DOM node so it can be inserted
			newNode = document.createRange().createContextualFragment(newNotificationHTML);

			insertNodeLocation.append(newNode);

			//			var deleteNotification = document.querySelector(".deleteNotificationIcon");
			//			
			//			deleteNotification.addEventListener("click", function(event) {appUIController.deleteNotification(event)});

		},


		deleteTaskList: function (event) {
			console.log("deleteTaskList");
			event.preventDefault();
			event.stopPropagation();
			
			// Get taskListId stored in form tag
			var taskListId = event.target.dataset.listid;
					
			
			// Get all TaskItems associated with the taskList
			var taskItemsAssociatedWithTaskList = appModelController.getAllTaskItemsForTaskList(taskListId);

			taskItemsAssociatedWithTaskList.forEach(function (taskItemRecord) {

				appModelController.deleteTaskItem(taskItemRecord._id);
			});


			var currActiveListId = getListIdForActiveTaskList();

			/* If the list you want to delete is the current active task list then you'll need to reset the active task list to another list as you'll be deleting the now current list that you know will be present (PreDefinedTaskList)...as a default I chose
			to make the new ActiveList the "All List"
			*/
			if (currActiveListId === taskListId) {
				
				// Set the active list to "All List ("1")
				toggleClass(appUIController.getUIVars().allListsElem, "selected");

			}

			appModelController.deleteTaskList(taskListId)
			.then (function (taskList) {
				
				
				// Remove existing UserDefined Task list from TaskListSubmenu
				appUIController.clearOutExistingScreenContent(appUIController.getUIVars().subMenuListDOMNode, 'userDefinedList');

				// Update the List Task Totals in the Model
				appModelController.updateListTaskTotals();

				// Now update the UI (subMenu list dropdown) list totals
				appUIController.refreshTaskListSubMenuTotals(appModelController.getTaskListTable());

				// Now rebuild the UserDefined Task List subMenu drop down
				appUIController.buildAndDisplayUserDefinedTaskList(currActiveListId);

				var querySearchStrTemplate = ".card[data-listid='%taskListId%']";

				var querySearchStrWithTaskItemId = querySearchStrTemplate.replace('%taskListId%', taskListId);


				// Get the DOM node of the card that will be removed
				var cardListNode2Remove = document.querySelector(querySearchStrWithTaskItemId);

				cardListNode2Remove.classList.add("vanish");
				var vanishPresent = cardListNode2Remove.classList.contains("vanish");
				


				$('#manageListsDeleteListModal').modal('hide');
				
				appUIController.getUIVars().manageTaskListsMsg.classList.remove("hideIt");
			
				appUIController.getUIVars().manageTaskListsMsg.innerHTML = '<i class="fa fa-thumbs-o-up"></i>&nbsp;Task List deleted';

				appUIController.getUIVars().manageTaskListsMsg.classList.add("success-message");


				setTimeout(function () {
					appUIController.getUIVars().manageTaskListsMsg.classList.remove("success-message");

				}, 3000);

			});


		},


		deleteTaskItem: function (event) {
			event.preventDefault();

			console.log("confirmDelete()");
			var taskItemId = appUIController.getUIVars().deleteTaskItemId.value;
			
			
			appModelController.deleteTaskItem(taskItemId)
			.then (function (taskitem) {
				
				// Update the List Task Totals in the Model
				appModelController.updateListTaskTotals();

				// Now update the UI (subMenu list dropdown) list totals
				appUIController.refreshTaskListSubMenuTotals(appModelController.getTaskListTable());


				var querySearchStrTemplate = ".card[data-id='%taskItemId%']";

				var querySearchStrWithTaskItemId = querySearchStrTemplate.replace('%taskItemId%', taskItemId);


				// Get the DOM node of the card that will be removed
				var cardNode2Remove = document.querySelector(querySearchStrWithTaskItemId);

				cardNode2Remove.classList.add("vanish");
				// Not sure I need line below
				var vanishPresent = cardNode2Remove.classList.contains("vanish");


				// Get the Parent Node of card that was marked for deletion (i.e., the event)
				var parentArticleNode = cardNode2Remove.closest("article");

				var moreActiveTaskInDueDateCategory = false;

				// Check childNode to see if they contain a "card" 
				parentArticleNode.childNodes.forEach(function (childNode) {

					// Due date category is not a card so skip it
					if (!childNode.classList.contains("card")) {

						return;

					// The node is a task card and doesn't contain "vanish	
					} else if (!childNode.classList.contains("vanish")) {

						// If the card doesn't contain "vanish" then it's still an active task in the category
						moreActiveTaskInDueDateCategory = true;
					}

				});					
					




				// If there are no more active task in that dueDate category (e.g., every card has class 'vanish') then delete the dueDate header 

				if (!moreActiveTaskInDueDateCategory) {
					var dueDateNode = parentArticleNode.firstChild;
					parentArticleNode.removeChild(dueDateNode);
				}
				
				// Now get the next node that might contain another card
				var nextNode = parentArticleNode.nextSibling;

				if (!nextNode)  {
					// Now that the page is empty display the empty taskList message

					appUIController.getUIVars().mainPageGeneralMsgLoc.innerHTML = '<div id="emptyPageMessage"><i class="fa fa-info-circle"></i>&nbsp;Currently there are no task items in this list<br /><br /><i class="fa fa-bullseye"></i>&nbsp;Click the Plus symbol below to add some now.<br /><br /><i class="fa fa-bullseye"></i>&nbsp;Or delete it via "Manage Lists" feature (see NavBar menu) if you don\'t need it anymore.</div>';

					var emptyPageMsg = document.getElementById("emptyPageMessage");
					setTimeout(function () {
						emptyPageMsg.classList.add("fadeIn");
					}, 1);					
					
				}


				$('#deleteTaskItemModal').modal('hide');

				mainPageSuccessMsg.classList.remove("success-message");
				mainPageSuccessMsg.innerHTML = '<i class="fa fa-thumbs-up"></i>&nbsp;Task Deleted';
				mainPageSuccessMsg.classList.add("success-message");
				setTimeout(function () {
					mainPageSuccessMsg.classList.remove("success-message");
				}, 3000);				



				});

		},

		getTaskItemsMarkedAsComplete: function () {
			console.log("getTaskItemsMarkedAsComplete");

			//			var matchingTaskItems = [];

			var allTaskItems = appModelController.getTaskItemsTable();
			// Return all task items where the task Title contains the search input character
			return matchingTaskItems = allTaskItems.filter(function (taskItem) {
				if (taskItem.taskItem_completedDate !== "") {
					return taskItem;
				}
			});

		},
		/***********************************************************************************
			MODULE:  appUIController???

			FUNCTION validateFormUpdate - validates form input upon submission and if errors
				it applies appropriate error messages & styling to errant fields 

			Trigger: Only triggered when user hits submit button on form

			Summary: 


			UI Behavior: 



		***********************************************************************************/

		validateFormInput: function (formValidationObject) {
			console.log("========> validateFormInput")

			var validationObject = formValidationObject[0];
			validationObject.formError = false;
			var firstField = true;
			var firstFieldInError = true;


			// Reset formSubmitError and formSubmit Success messages to ensure they will appear after validation completed
			validationObject.formSubmitErrorMsgLoc.classList.remove("error-message");
			validationObject.formSubmitSuccessMsgLoc.classList.remove("success-message");
			validationObject.formSubmitSuccessMsgLoc.classList.remove("warning-message");



			// For each field on the form validate each field's input and 
			// generate and style error messages
			validationObject.fieldsToValidate.forEach(function (field) {

				// Error found in input field - Set error message and error styling
				if (field.isNotValid(field.fieldName.value)) {

					if (firstField) {
						field.fieldName.focus();
						field.fieldName.setSelectionRange(0, 0);

					} else if (firstFieldInError) {
						field.fieldName.focus();
						firstFieldInError = false;
					}

					// Set form validationObject to true to indicate that
					// at least one error was found 
					field.fieldInError = true;
					validationObject.formError = true;

					// If error message hasn't been set then add to form and style it
					if (field.fieldErrorMsgLocation.innerHTML.trim() == "") {

						// Set error message for field on form
						field.fieldErrorMsgLocation.innerHTML = '<i class="fa fa-times-circle"></i>' + '&nbsp;' + field.fieldErrMsg;

						// Input box border red
						toggleClass(field.fieldName, "formErrors");

						// Error message text red
						//					toggleClass(field.fieldErrorMsgLocation, "errorMsg");

					}
					//					field.fieldName.focus();
					//					if (field.fieldName.tagName === "TEXT") { 
					//						// Keep focus on error field
					//						field.fieldName.focus();
					//						field.fieldName.setSelectionRange(0,0);
					//					}

					firstFieldInError = false;

				} else { // No error was
					field.fieldInError = false;
					if (field.fieldName.nodeName !== 'DIV') {
						// Get rid of any preceding or trailing blanks and resave
						field.fieldName.value = field.fieldName.value.trim();
						// Change color of List name text to differentiate it from placeholder text
						if (field.fieldName.value !== field.fieldDefaultValue) {
							field.fieldName.classList.add("filled");
						}

					}

				}
				firstField = false;

			});

		},

		setUpEditTaskListModal: function (event) {
			console.log("setUpEditTaskListName");
			var taskListId = event.dataset.id;

			appUIController.getUIVars().modalFormEditTaskListId.value = taskListId;

			var listName = utilMethods.lookUpTaskName(appModelController.getTaskListTable(), taskListId);
			appUIController.getUIVars().inputEditListName.value = listName;

		},


		setUpDeleteTaskItemModal: function (event) {
			console.log("setUpDeleteTaskItemModal");

			var taskItemId = event.dataset.id;

			appUIController.getUIVars().deleteTaskItemId.value = taskItemId;

			var taskItemName = appModelController.lookUpTaskItemRecord(taskItemId).taskItem_title;

			appUIController.getUIVars().deleteModalTaskItemName.innerHTML = taskItemName;

			var taskitemcard = utilMethods.findAncestor(event, "card");


		},
		setUpDeleteTaskListModal: function (event) {
			console.log("setUpDeleteTaskListModal");

			var taskListId = event.dataset.id;

			document.getElementById("deleteTaskListModalForm").dataset.listid = taskListId;

			//			appUIController.getUIVars().manageListModalDeleteTaskListId.value = taskListId;

			var taskListName = appModelController.lookUpTaskListName(taskListId).toUpperCase();

			var taskListRecord = appModelController.lookupTaskListRecordByListId(taskListId);
			var associatedTaskItemCount = taskListRecord.taskList_totalCount + taskListRecord.taskList_completedCount;

			document.getElementById("deleteListModalListName").innerHTML = taskListName;

			document.getElementById("deleteListModalTotalTaskItemCount").innerHTML = associatedTaskItemCount;

			document.getElementById("deleteListModalActiveItemCount").innerHTML = taskListRecord.taskList_totalCount;


			document.getElementById("deleteListModalNonActiveItemCount").innerHTML = taskListRecord.taskList_completedCount

		},
		/****************************************************************************
		 * METHOD:  clearOutExistingScreenContent ()
		 *
		 * This method removes existing screen content so that it can be refreshed
		 * with new content (e.g., taskItems, taskLists, etc). It uses the .remove() 
		 * method to accomplish this. 
		 * 
		 * When calling this method callee must provide the parentNode along with className(s)
		 * to identify the children nodes that should be deleted
		 *
		 * Params: 
		 *		parentNode: in this case that happens to be the node containing the pageId;
		 *		className(s): used to identify the child node(s) under parentNode to remove
		 *     		note: the classNames are passed in arguments. This method can be called   
		 *			with multiple arguments 
		 *
		 * Note: Two ways to delete nodes: Directly via .remove() or via it's parent;
		 *		Directly is more intutive but it may have browser support limitations
		 *		Deleting via the parent is less intuitive but more widely supported
		 *		Deleting via parent would be done via node.parentNode.removeChild(node)
		 *
		 ****************************************************************************/

		clearOutExistingScreenContent: function (parentNode) {
			console.log("ClearOutExistingScreenContent()");

			// Identifying class names are passed in by via arguments list..Need to convert those
			//   arguments to a "true" array so they can be used in a loop. 
			var nodeClassNames = Array.prototype.slice.call(arguments);

			// Get all the parentNode's children 
			var children = parentNode.children; // Returns nodeList..not an array;

			// Convert nodeList that is returned (children) into a true array so I it can be used in loop
			var childNodes = Array.prototype.slice.call(children);

			// Search the childNodes to see if any of them contain a className that identifies them
			nodeClassNames.slice(1).forEach(function (nodeClassName) {
				childNodes.forEach(function (node) {
					if (node.classList.contains(nodeClassName)) {
						node.remove(); // Delete node directly via .remove()
					}
				});
			});
		},

		/* 
		
		
		*/

		markTaskAsCompleted: function (event) {
			console.log("markTaskAsCompleted()");
			var taskItemId = event.dataset.id;
			var completeDate = "";

			var options = {
				weekday: 'short',
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric'
			};

			// Get the location of the span where completed date will be inserted
			var completedDateLoc = utilMethods.findAncestor(event, "card").firstChild.firstChild.firstChild;

			// Get the location of the div that contains the completeDate span
			var completedDateHeaderLoc = utilMethods.findAncestor(event, "card").firstChild.firstChild;

			var taskItemRecord = appModelController.lookUpTaskItemRecord(taskItemId);
			// Make the card that was marked as complete "vanish" (via animation) 
			var cardNode = utilMethods.findAncestor(event, "card");
			toggleClass(cardNode, "vanish");

			// Get the taskList record so I can increment/decrement taskList_completedCount as needed
			var taskListId = taskItemRecord.taskList_id;
			var taskListRecord = appModelController.lookupTaskListRecordByListId(taskListId);


			/* If user is marking item as completed then get system time stamp and assign that value to the taskItem_completedDate value 
			 */
			if (event.checked) { // event is checkbox

				completeDate = new Date().toLocaleString('en-US', options);

				// Update the completed total count for the current list

				taskItemRecord.taskItem_completedDate = completeDate;
				taskListRecord.taskList_completedCount++;

				completedDateLoc.innerHTML = "<i class='far fa-calendar-check'></i>" + completeDate;
				toggleClass(completedDateHeaderLoc, "hideIt");

				mainPageSuccessMsg.classList.remove("success-message");
				mainPageSuccessMsg.innerHTML = '<i class="fa fa-thumbs-up"></i> Moved to Complete';
				mainPageSuccessMsg.classList.add("success-message");


				// Get the Parent Node of card that was marked as complete (i.e., the event)
				var parentArticleNode = event.closest("article");


				/* After marking the task as completed determine if there are any more
					cards left in the due date category. 
				*/

				var activeTaskInDueDateCategory = false;
				parentArticleNode.childNodes.forEach(function (childNode) {
					// Due date category is not a card so skip it
					if (!childNode.classList.contains("card")) {
						return;

						// The node is a task card	
					} else if (!childNode.classList.contains("vanish")) {
						// If the card doesn't contain "vanish" then it's still an active task
						activeTaskInDueDateCategory = true;
					}
				});

				// If there are no more active task in that dueDate category (e.g., every card has class 'vanish') then delete the dueDate header 

				if (!activeTaskInDueDateCategory) {
					var dueDateNode = parentArticleNode.firstChild;
					parentArticleNode.removeChild(dueDateNode);

					// If there are no active taskItems on the page then display the empty taskList message

					if (taskListRecord.taskList_totalCount === 0) {

						// Now that the page is empty display the empty taskList message

						appUIController.getUIVars().mainPageGeneralMsgLoc.innerHTML = '<div id="emptyPageMessage"><i class="fa fa-info-circle"></i>&nbsp;Currently there are no task items in this list<br /><br /><i class="fa fa-bullseye"></i>&nbsp;Click the Plus symbol below to add some now.<br /><i class="fa fa-bullseye"></i>&nbsp;Or delete it via "Manage Lists" feature (see NavBar menu) if you don\'t need it anymore.</div>';

						var emptyPageMsg = document.getElementById("emptyPageMessage");
						setTimeout(function () {
							emptyPageMsg.classList.add("fadeIn");
						}, 1);
					}
				}



			} else { // User is "re-activating" the task item

				completedDateLoc.innerHTML = "";
				taskListRecord.taskList_completedCount--;
				taskItemRecord.taskItem_completedDate = "";
				toggleClass(completedDateHeaderLoc, "hideIt");
				mainPageSuccessMsg.innerHTML = "Task 'Re-activated'";
				mainPageSuccessMsg.classList.add("success-message");

				// If user is currently on the "Completed" list page and there are no more complete tasks left then display the standard Completed list is empty message.


				var activeTaskListPage = appUIController.getActiveTaskListName();
				if (activeTaskListPage === "Completed") {
					// Get it's taskListId so we can get it's record 
					var taskListId = appModelController.lookUpTaskListId(activeTaskListPage);
					// Retrieve the associated taskList record

					var taskListRecord = appModelController.lookupTaskListRecordByListId(taskListId)
					// 
					if ((taskListRecord.taskList_totalCount - 1) === 0) {

						appUIController.getUIVars().mainPageGeneralMsgLoc.innerHTML = '<div id="emptyPageMessage"><i class="fa fa-info-circle"></i> &nbsp; Currently there are no Complete task items<br /><br /><i class="fa fa-bullseye"></i>&nbsp;Each time you mark a task item as Complete it will be added to this list.</div>';
						var emptyPageMsg = document.getElementById("emptyPageMessage");
						setTimeout(function () {
							emptyPageMsg.classList.add("fadeIn");
						}, 1000);

					}

				}

			}

			appModelController.updateListTaskTotals();
			appUIController.refreshTaskListSubMenuTotals(appModelController.getTaskListTable());



			//			var cardNode = utilMethods.findAncestor(event, "card");
			//			toggleClass(cardNode, "vanish");

			// Must remove success-message class so that animation will occur each time a message is generated..otherwise message will not be displayed 
			setTimeout(function () {
				mainPageSuccessMsg.innerHTML = "";
				mainPageSuccessMsg.classList.remove("success-message")
			}, 3001);

		},
		showHideTaskActions: function (event) {
			console.log("showHideTaskActions()");
			var nodeContainingIconToRotate = event.firstElementChild;
			toggleClass(nodeContainingIconToRotate, "rotateIt");
			var parentNodeOfClick = utilMethods.findAncestor(event.parentNode, "showHideActionRow");
			var taskActionsRowToShowHide = parentNodeOfClick.nextSibling;
			toggleClass(taskActionsRowToShowHide, "materialize");
			//			toggleClass(nodeContainingIconToRotate, "rotateIt");
		},
		//		styleTaskFormFieldAsChanged: function (event) {
		//			var pageId;
		//			console.log("************** styleTaskFormFieldAsChanged");
		//			switch(event.target.id) {
		//				case "editFormTaskItemName":
		//					inputEditFormTaskItemName.classList.add("filled");
		//					break;
		//				case "editFormRepeatSelect":
		//					inputEditFormRepeatSelect.classList.add("filled");
		//					break;
		//				case "editTaskFormListSelect":
		//					inputEditFormListSelect.classList.add("filled");
		//					break;
		//				case "datetimepicker":
		//					console.log("DateTimePicker Event");
		//					pageId = utilMethods.findAncestor(event.currentTarget, 'container-fluid').id;
		//					if (pageId === "newTaskPage") {
		//						console.log("Page where clicked: ", pageId);
		//						inputNewTaskDateTime.classList.add("filled");
		//						appUIController.clearOrSetRepeatFieldErrors();
		//					} else { // "editTaskPage"
		//						console.log("Page where clicked: ", pageId);
		//						inputEditFormTaskItemDueDate.classList.add("filled");
		//					}	
		//					break;
		//				default:
		//					console.log("No matching event found");
		//			}
		//		},


		displayEditTaskPage: function (event) {

			console.log("************** displayEditTaskPage");

			// This line added to test calling resetTaskForm before the editTaskPage is displayed 

			var formValidationObject = appModelController.getFormValidationObject("editTaskPage");
			appUIController.resetTaskForm1(formValidationObject[0]);

			// Use the taskItem_id (event.dataset.id) to retrieve the taskItem record. Note: taskItem_id was stored in a custom attribute (data-id) of span when the taskItem card was created
			var taskItemId = event.dataset.id;
			var selectedTaskItemRecord = appModelController.lookUpTaskItemRecord(taskItemId);

			//------ Set the fields in the EditTaskForm -----

			// Set the taskItem name/title
			inputEditFormTaskItemName.value = selectedTaskItemRecord.taskItem_title;

			// Item Id is stored in a hidden field on TaskItem editForm
			inputEditFormTaskItemId.value = taskItemId;


			// Set the Completed checkbox based on whether a completedDate exist

			if (selectedTaskItemRecord.taskItem_completedDate !== "") {
				inputEditFormCompletedSetting.checked = true;
			} else {
				inputEditFormCompletedSetting.checked = false;
			}

			// Set completedDate in the hidden field 
			inputEditCompletedDate.value = selectedTaskItemRecord.taskItem_completedDate;

			// Set the dueDate value
			inputEditFormTaskItemDueDate.value = selectedTaskItemRecord.taskItem_due_date;

			// Set the repeat value

			// Some test records may have "" instead of "none"
			//			if (selectedTaskItemRecord.taskItem_repeat === "") {
			//				inputEditFormRepeatSelect.value = "none"
			//			} else { // values on form input are all lower case
			//				inputEditFormRepeatSelect.value = selectedTaskItemRecord.taskItem_repeat.toLowerCase();
			//			}

			// Populate the list select on the Edit Task Page
			appUIController.populateFormWithListNames(inputEditFormListSelect);

			// Set the list select value
			inputEditFormListSelect.value = appModelController.lookUpTaskListName(selectedTaskItemRecord.taskList_id);

			// Get the notifications associated with this taskItem
			var currentTaskItemNotifications = appModelController.getMatchingTaskNotifications(taskItemId);

			// Build And Display Existing Task Notifications 
			appUIController.buildAndDisplayTaskItemNotifications(currentTaskItemNotifications);


			// Hide the mainPage and show the editTaksPage
			toggleClass(homePage, "hideIt");
			toggleClass(editTaskPage, "hideIt");

			// Set the focus on TaskItem field
			appUIController.getUIVars().inputEditFormTaskItemName.focus();

			// Set the cursor position within the TaskItem field to the first positions
			appUIController.getUIVars().inputEditFormTaskItemName.setSelectionRange(0, 0);
		},

		exitEditTaskPage: function (event) {
			console.log("exitEditTaskPage()");
			toggleClass(homePage, "hideIt");
			toggleClass(editTaskPage, "hideIt");

			// Restore main page UI elements and update the list of task items to ensure that any new tasks that were added are present
			resetUI2InitialState();
		},


		/*******************************************************************
		 *            
		 *          MANAGE TASK LISTS PAGE METHODS
		 *
		 *********************************************************************/
		displayManageTaskListsPage: function (event) {
			console.log("displayManageTaskPage()");
			appUIController.clearOutExistingScreenContent(appUIController.getUIVars().manageTaskListsContent, "card");
			appUIController.buildAndDisplayTaskListCards(appUIController.getUIVars().manageTaskListContent, "card");
			// Hide the mainPage and show the editTaksPage
			toggleClass(homePage, "hideIt");
			toggleClass(manageTaskListsPage, "hideIt");
		},

		editTaskList: function (event) {
			event.preventDefault();
			event.stopPropagation();
			console.log("editTaskList()");
			console.log(appUIController.getUIVars().inputEditListName.value);
			var taskListId = appUIController.getUIVars().modalFormEditTaskListId.value;

			var predefinedTaskListTable = appModelController.getPreDefinedTaskList();
			var predefinedTaskListIds = appModelController.getPreDefinedTaskListIds();

			var matchedTaskListRecord = utilMethods.lookUpTaskListRecord(appModelController.getTaskListTable(), taskListId);

			var listNamePriorToUpdate = matchedTaskListRecord.taskList_name;

			// Find the "root" node of the modal page so that I can get ID of which modal fired 
			var modalPageId = utilMethods.findAncestor(event.currentTarget, 'modal').id;

			// Using the modal page ID look up the form validation object
			var formValidationObj = appModelController.getFormValidationObject(modalPageId);


			appUIController.validateFormInput(formValidationObj);


			// If all input was valid (e.g., formError = false)
			if (!formValidationObj[0].formError) {
				
				matchedTaskListRecord.taskList_name = appUIController.getUIVars().inputEditListName.value;
				
				appModelController.taskListDb.get(taskListId).then(function(doc) {
					return appModelController.taskListDb.put({
						_id: taskListId,
						_rev: doc._rev,
						taskList_name: matchedTaskListRecord.taskList_name
					});
				}).then(function(response) {
					console.log("Update TaskList in editTaskList(): ", response)
				}).catch(function (err) {
					console.log(err);
				});

				// NEED TO REVSIT THIS AS IT IS SPECIFIC TO ONLY ONE FORM
				// Style the newly added list selection input to reflect list selection had changed (add class="filled")
				appUIController.getUIVars().inputEditFormListSelect.classList.add("filled");

				// Style the success message
				formValidationObj[0].formSubmitSuccessMsgLoc.classList.add("success-message");

				// Insert Submit Success Message
				formValidationObj[0].formSubmitSuccessMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-up"></i>' + '&nbsp;' + '"' + matchedTaskListRecord.taskList_name + '"' + ' ' + formValidationObj[0].formSubmitSuccessMsg;
				formValidationObj[0].formSubmitSuccessMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-up"></i>' + '&nbsp;' + '"' + listNamePriorToUpdate + '"' + ' ' + formValidationObj[0].formSubmitSuccessMsg;



				var userDefinedTaskLists = appModelController.getUserDefinedTaskList();

				// Sort the userDefinedTask List
				appModelController.sortListByName(userDefinedTaskLists);

				var currActiveListNode = getActiveTaskList();

				// Added this because I may need to use currActiveListId rather than currActiveListName in buildAndDisplayUserDefinedTaskList() as currActiveListName can be changed whereas the id will not be changed. 
				var currActiveListId = getListIdForActiveTaskList();

				var currActiveListName = appUIController.getActiveTaskListName();


				// Remove existing UserDefined Task list from TaskListSubmenu
				appUIController.clearOutExistingScreenContent(appUIController.getUIVars().subMenuListDOMNode, 'userDefinedList');

				// Regenerate UserDefined Task List on taskListSubmenu and make new list the active task list 
				appUIController.buildAndDisplayUserDefinedTaskList(currActiveListId);


				// Clearout prior TaskList cards  on the ManageTaskListPage
				appUIController.clearOutExistingScreenContent(appUIController.getUIVars().manageTaskListsContent, "card");

				// Now rebuild the TaskList cards so that they will include any edits made to the the task List 
				appUIController.buildAndDisplayTaskListCards(appUIController.getUIVars().manageTaskListContent, "card");

				var modalWindowIndex = appModelController.getModalWindowIndex(event.target.getAttribute('id'));
				appUIController.getUIVars().newListCancelBtn[modalWindowIndex].click();


				// After fadeout animation ends we need to reset message 
				setTimeout(function () {
					// Must remove the success-message class otherwise it will not appear on future saves 
					formValidationObj[0].formSubmitSuccessMsgLoc.innerHTML = "";
					formValidationObj[0].formSubmitSuccessMsgLoc.classList.remove("success-message");
					formValidationObj[0].formSubmitErrorMsgLoc.classList.remove("error-message");
					formValidationObj[0].formSubmitErrorMsgLoc.classList.remove("warning-message");
				}, 3000);


			} else {

				console.log("Error was detected with Task List Entry ");
				// Create log entry if failure
				// TBD

				// Insert Submit Success Message
				formValidationObj[0].formSubmitErrorMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-down"></i>' + '&nbsp;' + formValidationObj[0].formSubmitErrorMsg;

				// Style the errorSubmitMsg
				formValidationObj[0].formSubmitErrorMsgLoc.classList.add("error-message");
			}

		},


		exitManageTaskListsPage: function (event) {
			console.log("exitManageTaskListsPage()");
			toggleClass(homePage, "hideIt");
			toggleClass(manageTaskListsPage, "hideIt");
			// Restore main page UI elements and update the list of task items to ensure that any new tasks that were added are present
			resetUI2InitialState();

		},

		// Will need to make this more general if I want to use on EditTask form too.
		reEnableRepeatInputAndRemoveErrors: function (event) {
			appUIController.getUIVars().inputNewTaskRepeat.disabled = false;
			//			appUIController.getUIVars().inputNewTaskRepeat.value = "1";

			appUIController.getUIVars().repeatErrorMsgDiv.innerHTML = "";
			//			appUIController.getUIVars().repeatErrorMsgDiv.classList.remove("errorMsg"); 
			appUIController.getUIVars().formDatetimeInputBox.classList.remove("formErrors");

		},

		//		clearDueDateBtnClicked: function (event) {
		//			
		//			// If the repeat value not set to "none" (value="1") then set  
		//			if (inputNewTaskRepeat.value !== "1" && !inputNewTaskRepeat.classList.contains("formErrors")) {
		//				// Set Error msg & formatting on Repeat field
		//				appUIController.clearOrSetRepeatFieldErrors(event);
		//			} 
		//		}, 

		//%%%%%%%% NOT USED NOW --- DELETE this function
		//		hideRepeatOption: function (event) {
		//			console.log("-------> Hide Repeat Option"); 
		//			var repeatOptionFormGroup = utilMethods.findAncestor(event.currentTarget, 'form-group');
		//			if (!repeatOptionFormGroup.nextElementSibling.classList.contains("hideIt")) {
		//				repeatOptionFormGroup.nextElementSibling.classList.add("hideIt");
		//			}
		//		},

		//%%%%%%%
		//		showHideDueDateField: function (event) {
		//			console.log("-----> showHideDueDateField");
		//			var repeatOptionFormGroup = utilMethods.findAncestor(event.currentTarget, 'form-group');
		//			
		//			/* If cursor in Due date field or user clicked on Calendar button then get the parent formgroup for the Due dat so that we can then get 
		//			*/
		//			if ((event.type === "mouseout") && (appUIController.getUIVars().inputNewTaskDateTime.value === "") ) {
		//				console.log("====>MouseOut event", event.currentTarget);
		//				if (!repeatOptionFormGroup.nextElementSibling.classList.contains("hideIt")) {
		////					setTimeout(function () {
		//					repeatOptionFormGroup.nextElementSibling.classList.add("hideIt");
		////					}, 3000);
		//				}
		//			} 
		//			
		//			// Cursor focus on DueDate input field or clicked on Add Due Date button
		//			else if ((event.currentTarget === appUIController.getUIVars().inputNewTaskDateTime) || (event.currentTarget === appUIController.getUIVars().addDueDateBtn) ) {
		//				console.log("====> Input field or AddDueDateBtn");
		//				var currTarget = event.currentTarget;
		//				appUIController.reEnableRepeatInputAndRemoveErrors();
		//				repeatOptionFormGroup = utilMethods.findAncestor(currTarget, 'form-group')
		//				repeatOptionFormGroup.nextElementSibling.classList.remove("hideIt");
		//				
		////					setTimeout(function () {
		////						if (inputNewTaskDateTime.value !== "") {
		////							inputNewTaskRepeat.disabled = false;
		////						}
		////					}, 5000);
		//			} 
		//			
		//			// User clicks on Clear Due Date Button
		//			else if ((event.currentTarget === appUIController.getUIVars().clearDueDateBtn) && (!repeatOptionFormGroup.nextElementSibling.classList.contains("hideIt"))) {
		//				console.log("====> ClearDueDateBtn");
		//				// Hide repleat option if the user removes the date
		//				repeatOptionFormGroup.nextElementSibling.classList.add("hideIt");
		//				
		//				/* Reset Repeat option to 'None' (value = "1") to prevent form from inadvertenally being set with wrong Repeat option
		//				*/
		//				appUIController.getUIVars().inputNewTaskRepeat.value = "1";
		//				
		//				
		//			} else {
		//				console.log(event, event.currentTarget)
		//			}
		//		}, 

		/* If no due date present then disable the Repeat opton field 
			and set error messages to advise user that Due date is required
			must be entered if you want to make task repeatable
		*/
		checkForDueDate: function (event) {
			// Determine form that triggered event and get it's formObject
			switch (event.target.id) {
				case "editFormRepeatSelect":
					if (inputEditFormTaskItemDueDate.value === "") {
						disableRepeatInputAndSetErrors(event);
					}
					break;
				case "newTaskRepeatOption":
					if (inputNewTaskDateTime.value === "") {
						disableRepeatInputAndSetErrors(event);
					}
					break;
				default:
					console.log("Event didn't match");
			}

			//			if (inputNewTaskDateTime.value === "") {
			//				disableRepeatInputAndSetErrors(); 
			//			}

		},




		// $$$ Currently the fields are specific to newTaskForm..this needs
		// to be made more generic formObject needs to be passed as input
		// param once I can conver newTaskForm to use form object. 
		setTaskListSelect: function (taskItemFormListSelect, listName) {

			//			var activeTaskListName = appUIController.getActiveTaskListName();

			console.log("===========LIST NAME: " + listName);

			if (listName === "All Lists" || listName === 'Completed') {
				taskItemFormListSelect.value = "Default"

			} else {
				taskItemFormListSelect.value = listName;
				console.log("=============TASK LIST VALUE: " + taskItemFormListSelect.value);
			}

		},
		/* Gets the Active List Task Name */
		getActiveTaskListName: function () {
			return getActiveTaskList().childNodes[1].textContent.trim();
		},
		getUIVars: function () {
			return {
				/* Main Page Elements */
				mainPage: mainPage,
				subMenuListDOMNode: subMenuListDOMNode,
				completedDateHeader: completedDateHeader,
				completedDateStyling: completedDateStyling,

				/* New Task Form Elements */
				inputNewTaskListName: inputNewTaskListName,
				inputNewTaskTitle: inputNewTaskTitle,
				inputNewTaskDateTime: inputNewTaskDateTime,
				inputNewTaskDueTime: inputNewTaskDueTime,
				inputNewTaskListSelection: inputNewTaskListSelection,
				inputNewTaskRepeat: inputNewTaskRepeat,
				inputNavListModalListName: inputNavListModalListName,
				newTaskFormErrorMsg: newTaskFormErrorMsg,
				newTaskSaveMessage: newTaskSaveMessage,
				navListModalListNameErrorMsg: navListModalListNameErrorMsg,
				addNewFormNotifications: addNewFormNotifications,
				newTaskFormNotificationArea: newTaskFormNotificationArea,
				newTaskNotificationError: newTaskNotificationError,
				//				deleteNotification: deleteNotification, 

				// Edit Task Form Elements
				editTaskSaveMessage: editTaskSaveMessage,
				formNavTaskListModal: formNavTaskListModal,
				navTaskListModalMessage: navTaskListModalMessage,
				newTaskFormListModalMessage: newTaskFormListModalMessage,
				editTaskFormListModalMessage: editTaskFormListModalMessage,
				allListsElem: allListsElem,
				completedListElem: completedListElem,
				defaultListElem: defaultListElem,
				newListCancelBtn: newListCancelBtn,
				addEditFormNotifications: addEditFormNotifications,
				editTaskFormNotificationArea: editTaskFormNotificationArea,
				editTaskNotificationError: editTaskNotificationError,

				// Manage Task List Form Vars
				manageTaskListsMsg: manageTaskListsMsg,
				manageTaskListsIcon: manageTaskListsIcon,
				manageTaskListsBackArrow: manageTaskListsBackArrow,
				manageTaskListsContent: manageTaskListsContent,
				manageListsEditListModalForm: manageListsEditListModalForm,
				inputEditListName: inputEditListName,

				listMenuTitle: listMenuTitle,
				addDueDateBtn: addDueDateBtn,
				clearDueDateBtn: clearDueDateBtn,
				//				clearDueTimeBtn: clearDueTimeBtn, 
				formDatetimeInputBox: formDatetimeInputBox,
				repeatErrorMsgDiv: repeatErrorMsgDiv,
				editRepeatErrorMsgDiv: editRepeatErrorMsgDiv,
				newTaskRepeatGroup: newTaskRepeatGroup,
				addTaskResetButton: addTaskResetButton,
				mainPageSuccessMsg: mainPageSuccessMsg,
				mainPageGeneralMsgLoc: mainPageGeneralMsgLoc,

				// EditForm Fields
				formEditNewTask: formEditNewTask,
				inputEditFormTaskItemName: inputEditFormTaskItemName,
				inputEditFormTaskItemId: inputEditFormTaskItemId,
				inputEditFormCompletedSetting: inputEditFormCompletedSetting,
				inputEditCompletedDate: inputEditCompletedDate,
				inputEditFormTaskItemDueDate: inputEditFormTaskItemDueDate,
				inputEditFormRepeatSelect: inputEditFormRepeatSelect,
				inputEditFormListSelect: inputEditFormListSelect,
				editFormCancelButton: editFormCancelButton,
				editFormUpdateTaskNavButton: editFormUpdateTaskNavButton,
				expandTaskActions: expandTaskActions,

				// Modal Form Fields
				modalFormEditTaskListId: modalFormEditTaskListId,
				deleteTaskItemId: deleteTaskItemId,
				deleteModalTaskItemName: deleteModalTaskItemName,
				deleteTaskItemModalForm: deleteTaskItemModalForm
			}

		},
		displaySaveMessage: function (msgLocation, msg) {
			console.log("************** displaySaveMessage method");
			if (msg.type === "success") {
				msgLocation.innerHTML = msg.text;
				msgLocation.classList.add("success-message");

				// After fadeout animation ends we need to reset message so animation will work on subsequent saves
				setTimeout(function () {
					// Must remove the success-message class otherwise it will not appear on future saves
					msgLocation.classList.remove("success-message");
					// Also must clear out the message otherwise the message will reappear after fadeout animation ends
					msgLocation.innerHTML = "";
				}, 3000);

			} else { // msg.type = "error"
				msgLocation.innerHTML = msg.text;
				msgLocation.classList.add("error-message");

				// After fadeout animation ends we need to reset message so animation will work on subsequent saves
				setTimeout(function () {
					// Must remove the success-message class otherwise it will not appear on future saves
					msgLocation.classList.remove("error-message");
					// Also must clear out the message otherwise the message will reappear after fadeout animation ends
					msgLocation.innerHTML = "";
				}, 3000);
			}

		},


		clearTaskTitleError1: function (event) {
			// Look up the page ID where this form is located so I can get associated validateObj
			var pageId = utilMethods.findAncestor(event.currentTarget, 'container-fluid').id;

			// Page Id is used to identify the appropirate validationObject
			var formValidationObj = appModelController.getFormValidationObject(pageId);

			// Removes error formatting and clears error messages on 
			if (formValidationObj[0].fieldsToValidate[0].fieldName.classList.contains("formErrors")) {
				formValidationObj[0].fieldsToValidate[0].fieldName.classList.remove("formErrors");
				formValidationObj[0].fieldsToValidate[0].fieldName.innerHTML = "";
				formValidationObj[0].fieldsToValidate[0].fieldName.setSelectionRange(0, 0);
				formValidationObj[0].fieldsToValidate[0].fieldErrorMsgLocation.innerHTML = "";
			}

		},

		/*******************************************************************************************************
		
		clearOrSetRepeatFieldErrors method is invoked when: 

		1) User makes a selection on the repeat field (via "input" event in inputNewTaskRepeat field);
		2) User clicks the clearDueDateBtn element
		3) A dueDate is entered (input event) via addDueDateBtn or clicking on dueDate input field
		
		With that in mind the code address the following scenarios:
		
		1) If user has entered a repeat value but there is no date then set error msg and error formating;
		
		2) If the repeat field is already in error (due date empty but repeat value other than "none" ) and user now enters value of "none" remove error formatting and msg;
		
		3) If the user had entered a repeat value and there is no due date (so repeat is marked with an error (formErrors class present) but now a due date has been entered then remove the errors on the repeat field because now having a repeat value other than none is valid;
		
		4) If the user has entered notifications but no due date is on form...if a dueDate is entered then we need to clear the notificationArea error messages. 
	
		********************************************************************************************************/



		/* $$$$ WILL NEED TO MAKE THIS METHOD MORE GENERIC 
		
			Specifically need to use event to get the Modals div id OR the id of the form and that needs
			to be passed into getformValidationObject() method to the retrieve the right formValidationOject
		
		*/

		clearTaskListModalFormErrors: function (event) {
			var modalPage, modalPageId;
			console.log("=========> clearTaskListModalFormErrors");

			// $$$$$$ TEMP SOLUTION - Need to general purpose solution
			if (event.target.id === "editFormTaskItemName") {
				modalPage = utilMethods.findAncestor(event.currentTarget, 'container-fluid');
			} else {
				modalPage = utilMethods.findAncestor(event.currentTarget, 'modal');
			}

			if (modalPage) {
				modalPageId = modalPage.id;

				var taskListModalFormObj = appModelController.getFormValidationObject(modalPageId);


				// When user enters data in list modal form (on 'input') style to show data is new/changed.

				// NOTE: This isn't really about clearing Form errors but I put it hear for now until I redesign form errors to be cleared when are launched. 
				taskListModalFormObj[0].fieldsToValidate[0].fieldName.classList.add("filled");



				/* If no matching taskModalFormObj record found then skip logic below...
				In theory there should always be a match but for some reason this method is called
				*/
				//			if (taskListModalFormObj.length > 0 ) {
				var taskListModalFormObject = taskListModalFormObj[0];
				if (taskListModalFormObject.formError) {
					taskListModalFormObject.formError = false;
					//????
					taskListModalFormObject.formSubmitErrorMsgLoc.innerHTML = "";

					toggleClass(taskListModalFormObject.formSubmitErrorMsgLoc, 'error-message');
					taskListModalFormObject.fieldsToValidate[0].fieldErrorMsgLocation.innerHTML = "";
					// Input box border red
					toggleClass(taskListModalFormObject.fieldsToValidate[0].fieldName, "formErrors");

					// When user enters data in list modal form (on 'input') style to show data is new/changed. 
					taskListModalFormObject.fieldsToValidate[0].fieldName.classList.add("filled");

					// Error message text red
					//						toggleClass(taskListModalFormObject.fieldsToValidate[0].fieldErrorMsgLocation, "errorMsg");
				}
				//			}

			}

		},

		/********************************************************************************************
			METHOD:  exitTaskPage()  -- Primary method 
			- Clear any form error messages, formatting and reset forValidationObj.formError to false
			- Clear any form formatting (e.g., "filled" class)
			- Clear any values entered on form
			- Reset the values on the mainPage (e.g., navBar icons, etc)
			- Hide the new
			
		********************************************************************************************/
		exitNewTaskPage: function (event) {
			console.log("********************** exitNewTaskPage");

			// IS THIS STILL NEEDED.....Get the current "active" task list Node 
			var currActiveList = getActiveTaskList();


			// Restore main page UI elements and update the list of task items to ensure that any new tasks that were added are present
			resetUI2InitialState()

			toggleClass(homePage, "hideIt");
			toggleClass(addNewTaskPage, "hideIt");

		},
		/******************************************************************
		Populates add New Task From List Drop down with list names (TaskListTable).
	
		Note: TaskListTable contains "All List" and "Completed". Don't want to 
		include those two list names (which happen to be first and last list name)
		so the for loop params have been modified (loop starts at 2 and ends at length-1) to eliminate those two list names. 
		Note 2: Need to determine if I want to create a sepearate global list 
		for just user defined list names and use that instead of TaskListTable
		that is inclusive of system defined lists (e.g., "All List", "Default" and "Completed) 
		******************************************************************/

		populateFormWithListNames: function (taskItemFormListSelect) {

			// Create an array containing all of the TaskList Names
			var taskListNames = appModelController.getTaskListNames();

			// Build the listNames to display on New Task Form...
			// Don't want to include "All Lists" or "Completed"
			var editedTaskListNames = taskListNames.filter(function (listName) {
				if (listName !== "All Lists" && listName !== "Completed") {
					return listName;
				}
			})

			// Clear out existing Select list options each time to ensure that if any new list items 
			clearOutSelectList(taskItemFormListSelect);


			// Populate list selector with TaskList Names: 
			for (var i = 0; i < editedTaskListNames.length; i++) {
				var opt = editedTaskListNames[i];
				taskItemFormListSelect.innerHTML += "<option value=\"" + opt + "\">" + opt + "</option>";
			}
		},
		/****************************************************************************************
			FUNCTION displayAddNewTaskForm - builds the new task item form and displays it,
				modifies the nav bar and hides other parts of the UI (e.g., main page) 
			
			Trigger: User clicks the Floating PLUS symbol on main page
			
			Summary: 
				New taskItem Form "List" drop down must be populated with ListNames but 
				minus "All Lists" and "Completed" listnames
	
			UI Behavior: 
				App is really a Single Page App (SPA) where parts of the app are displayed hidden
					or shown as needed.

		*****************************************************************************************/

		displayAddNewTaskForm: function () {
			console.log("************** appUIController.displayAddNewTaskForm()");

			// Reset the New Task Form when displayed to remove any residual formatting / errors

			// First get the form validation object
			var formValidationObj = appModelController.getFormValidationObject("newTaskPage");


			// Call method to reset the form 
			appUIController.resetTaskForm1(formValidationObj[0]);


			// Hide the main page and display the addTaskForm page
			toggleClass(homePage, "hideIt");
			toggleClass(addNewTaskPage, "hideIt");



			// Now reset (clear) input fields to original values
			formSaveNewTask.reset();

			// When form opens you want the focus to be on newTaskTitle field with cursor at position 1
			appUIController.getUIVars().inputNewTaskTitle.focus();
			appUIController.getUIVars().inputNewTaskTitle.setSelectionRange(0, 0);

			// Populate List Selection dropdown on new task item for
			appUIController.populateFormWithListNames(inputNewTaskListSelection);

			// Need to set newTask Form list selct dropdown to "active" task list value
			appUIController.setTaskListSelect(inputNewTaskListSelection, appUIController.getActiveTaskListName());

		},

		/* 
		
		Provides real time styling and error detection/formatting of fields on BOTH New Task & Edit Task forms. 
		It does this for the Task Title and the Repeat field (via clearOrSetRepeatFieldErrors) on the forms. 
		
		*/

		styleUserFormInput: function (event) {
			// Any of the input non-date fields (TaskTitle, RepeatSelect, ListSelect)
			if (event.type === "input") {
				event.target.classList.remove("filled"); //event.target gives you specific field of form
				if (event.target.value !== "") {
					event.target.classList.add("filled");
				}
			}

		},

		/***********************************************************************************
			METHOD:  getNewTaskFormInput()  -- Get TaskItem data entered on form (New or Edit Task)
			Potential replacement for getTaskItemInput() method 
		***********************************************************************************/
		getNewTaskFormUserInput: function () {
			// Event should indicate which form we are dealing with.
			var notificationChildNodes;
			var notificationType, notificationUnits, notificationUnitType;
			var notifications = [];
			var Notification = function (notificationId, notificationType, notificationUnits, notificationUnitType) {
				this.notification_id = notificationId;
				this.notificationType = notificationType;
				this.notificationUnits = notificationUnits;
				this.notificationUnitType = notificationUnitType;
			}

			var notificationNodes = document.getElementsByClassName('notification');

			if (notificationNodes.length >= 0) {
				Array.prototype.forEach.call(notificationNodes, function (notificationNode, index) {
					notificationId = null;
					notificationChildNodes = notificationNode.childNodes;
					var notificationTypeNode = notificationChildNodes[0].firstElementChild;
					var notificationUnitsNode = notificationChildNodes[1].firstElementChild;
					var notificationUnitTypeNode = notificationChildNodes[2].firstElementChild;

					notificationType = notificationTypeNode.options[notificationTypeNode.selectedIndex].value;
					notificationUnits = notificationUnitsNode.value;
					notificationUnitType = notificationUnitTypeNode.options[notificationUnitTypeNode.selectedIndex].value;

					var notification = new Notification(notificationId, notificationType, notificationUnits, notificationUnitType);

					notifications[index] = notification;
				})

			}

			return {
				newTaskTitle: inputNewTaskTitle.value.trim(),
				newTaskDueDate: inputNewTaskDateTime.value,
				// ***** DISABLED REPEAT OPTION
				//				newTaskRepeateOptionTxt: inputNewTaskRepeat.options[inputNewTaskRepeat.selectedIndex].text,
				newTaskListOptionTxt: inputNewTaskListSelection.options[inputNewTaskListSelection.selectedIndex].text,
				newTaskNotifications: notifications
			}
		},



		/********************************************************************************
			METHOD:  getTaskItemEditInput()  -- Primary method 
		********************************************************************************/

		getTaskItemEditInput: function (event) {
			// Event should indicate which form we are dealing with.
			var notificationChildNodes;
			var notificationId, notificationType, notificationUnits, notificationUnitType;
			var notifications = [];
			var Notification = function (notificationId, notificationType, notificationUnits, notificationUnitType) {
				this.notificationId = notificationId;
				this.notificationType = notificationType;
				this.notificationUnits = notificationUnits;
				this.notificationUnitType = notificationUnitType;
			}
			var notificationsPresent = false;
			var notificationNodes = document.getElementsByClassName('notification');



			if (notificationNodes.length > 0) {
				notificationsPresent = true;
				Array.prototype.forEach.call(notificationNodes, function (notificationNode, index) {
					/* If it is a new notification we want to set the value to null so we can test for that
						later otherwise it will contain the notificationId that was previously assigned to
						it upon creation
					*/
					notificationId = null;
					notificationChildNodes = notificationNode.childNodes;
					var notificationTypeNode = notificationChildNodes[0].firstElementChild;
					var notificationUnitsNode = notificationChildNodes[1].firstElementChild;
					var notificationUnitTypeNode = notificationChildNodes[2].firstElementChild;

					// Want to set the notificationId to null if not present for future checks
					if (notificationNode.dataset.id === undefined) {
						notificationId = null;
					} else {
						notificationId = notificationNode.dataset.id;
					}

					notificationType = notificationTypeNode.options[notificationTypeNode.selectedIndex].value;
					notificationUnits = notificationUnitsNode.value;
					notificationUnitType = notificationUnitTypeNode.options[notificationUnitTypeNode.selectedIndex].value;

					var notification = new Notification(notificationId, notificationType, notificationUnits, notificationUnitType);

					notifications[index] = notification;
				})

			}
			return {
				taskItemId: inputEditFormTaskItemId.value.trim(),
				taskTitle: inputEditFormTaskItemName.value.trim(),
				taskCompletedCheckbox: inputEditFormCompletedSetting.checked,
				taskCompletedDate: inputEditCompletedDate.value,
				taskDueDate: inputEditFormTaskItemDueDate.value,
				//				taskRepeat: inputEditFormRepeatSelect.options[inputEditFormRepeatSelect.selectedIndex].value,
				taskList: inputEditFormListSelect.options[inputEditFormListSelect.selectedIndex].value,
				taskNotifications: notifications,
				taskNotificationsPresent: notificationsPresent

			}
		},


		/********************************************************************************
			METHOD:  resetNewTaskForm1()  - called when user hits the reset button on new task form
			- Retrieves the formValidation Object and then calls resetTaskForm1 method to:
			- Removes/resets formValidation.formError flag and removes error formating error messages
			- Removes special user input formatting that might have been applied previously (via 'filled'CSS class)
			- Clears all values entered on form field
		********************************************************************************/


		resetNewTaskForm1: function (event) {

			// Look up the page ID where this form is located so I can get associated validateObj
			var pageId = utilMethods.findAncestor(event.currentTarget, 'container-fluid').id;

			// Page Id is used to identify the appropirate validationObject
			var formValidationObj = appModelController.getFormValidationObject(pageId);


			// Remove error messages & styling (including "filled" class)
			appUIController.resetTaskForm1(formValidationObj[0]);


			appUIController.getUIVars().inputNewTaskTitle.value = "";
			appUIController.getUIVars().inputNewTaskDateTime.value = "";

			// **** DELETED REPEAT FIELD so no need for this for now
			//			appUIController.getUIVars().inputNewTaskRepeat.value = "none";

			appUIController.getUIVars().inputNewTaskListSelection.value = "Default";


			appUIController.getUIVars().inputNewTaskTitle.focus();
			appUIController.getUIVars().inputNewTaskTitle.setSelectionRange(0, 0)

			// Remove any notification nodes that may be present



		},


		/********************************************************************************
			METHOD:  resetTaskForm1() 
			- clear form level items (e.g., formError, submit success/error messages) 
			- clear field level items (e.g., field formatting, error msg& formatting)
			- reset field level input
			
			This method would be called each time before the a taskForm is displayed (via 
			displayAddNewTaskForm & displayEditTaskPage). 
			
			Questions:
			1) Do I only formValidationObject and perform other actions (reset values via
			call to form.reset() and setting focus to the caller of this method )
			2) Alternatively pass the pageId as input and then let this method lookUp the appropriate validation and then use the pageId to determine which virtual reset needs to be used (form.reset())
				
			********************************************************************************/


		resetTaskForm1: function (formValidationObj) {
			var notificationNodes;
			var numberOfNotificationNodes;
			// Reset formError 
			formValidationObj.formError = false;

			//Clear out any prior success/error messages and styling 
			formValidationObj.formSubmitErrorMsgLoc.innerHTML = "";
			formValidationObj.formSubmitSuccessMsgLoc.innerHTML = "";
			formValidationObj.formSubmitSuccessMsgLoc.classList.remove("success-message");
			formValidationObj.formSubmitErrorMsgLoc.classList.remove("error-message");
			formValidationObj.formSubmitErrorMsgLoc.classList.remove("warning-message");


			// For each field on the form remove any error messages/styling 
			formValidationObj.fieldsToValidate.forEach(function (field) {
				field.fieldErrorMsgLocation.innerHTML = "";
				field.fieldName.classList.remove("filled");
				field.fieldName.classList.remove("formErrors");
			});

			// Remove any residiual notification nodes that might 
			notificationNodes = document.getElementsByClassName('notification');

			if (notificationNodes.length > 0) {
				while (notificationNodes.length > 0) {
					notificationNodes[notificationNodes.length - 1].remove()
				}
			}
		},



		// Builds and displays the UsrDefined Task Lists on taskList Submenu

		buildAndDisplayUserDefinedTaskList: function (currActiveListId) {
			var newNode;

			var userDefinedTaskList = appModelController.getUserDefinedTaskList();

			// Sort the userDefinedTask List
			appModelController.sortListByName(userDefinedTaskLists);

			//			var currActiveListId = getListIdForActiveTaskList();
			// ++++++ 
			var preDefinedTaskListIds = appModelController.getPreDefinedTaskListIds();

			// Get the 2nd predefined list element ("Default List") position so that we can start adding user defined list after it
			var nextNode = document.getElementById("listInsertPoint");


			// Template to create ListName elements for nav's listSubmenu
			var genericSubMenuHtml = '<li class="userDefinedList" data-id="%listId%"><i class="fa fa-list-ul" aria-hidden="true"></i>%listName%<span class="listTotal">%dueCount%</span><span class="overDueCount overDueItemsPresent">%overDueCount%</span></li>';
			var specificSubMenuHtml;
			//*****************************************************************************************************
			// Loop for building the User Defined Task Lists HTML/Nodes and inserting them into the Nav bar
			//*****************************************************************************************************

			for (var i = 0; i < userDefinedTaskList.length; i++) {

				// Insert the taskList's id
				specificSubMenuHtml = genericSubMenuHtml.replace('%listId%', userDefinedTaskList[i].taskList_id);

				// Insert the list name in HTML
				specificSubMenuHtml = specificSubMenuHtml.replace('%listName%', userDefinedTaskList[i].taskList_name);

				// Insert the overdue task list count in HTML
				// If count is zero you want to add class to overdue item so that 0 count and "+" sign do not appear
				if (userDefinedTaskList[i].taskList_overDueCount > 0) {
					specificSubMenuHtml = specificSubMenuHtml.replace('%overDueCount%', userDefinedTaskList[i].taskList_overDueCount);
				} else { // Else the count is zero then remove styling
					specificSubMenuHtml = specificSubMenuHtml.replace('%overDueCount%', "");
					specificSubMenuHtml = specificSubMenuHtml.replace("overDueCount overDueItemsPresent", "overDueCount");
				}

				// Insert the total task list count due (excluding overdue tasks count) in HTML
				specificSubMenuHtml = specificSubMenuHtml.replace('%dueCount%', userDefinedTaskList[i].taskList_totalCount);


				//* Convert completed HTML string into DOM node so it can be inserted
				newNode = document.createRange().createContextualFragment(specificSubMenuHtml);


				// Insert new node into taskListsubmenu
				insertAfter(newNode, nextNode);

				// Now make the node we just inserted the nextNode so that other nodes will be inserted after it
				nextNode = nextNode.nextElementSibling;

				// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

				/* If this userDefined task list element is the new list the user just added we'll need to make it the active list element
				 */

				//				if (userDefinedTaskList[i].taskList_name === newListName) {
				//					
				//					/* The active list node (currActiveListNode) will  be null if the prior activelistNode had been a userdefinedTaskList. Why? because in the calling function the userDefinedList DOM nodes were removed (via removeUserDefinedTaskLists() function) so that we could re-create the userDefined DOM nodes here inclusive of the new list that user just added. However, if the
				//					the previous Active List was a system defined task list then it will still be present
				//					and we need to make it no longer the active list by toggling off the 'selected' class
				//					so that we don't end up with two active lists
				//					*/
				//					
				//					if (currActiveListNode) {  // not null 
				//						toggleClass(currActiveListNode, 'selected');
				//					}
				//					// Make the new list the active list by adding class 'selected' 
				//					toggleClass(nextNode, 'selected');
				//			
				//				}
				// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

				/* There will not be an active list node found in userDefinedTaskList if the prior active list was a User Defined TaskList element. Why? because in the calling function the userDefinedList DOM nodes had to be removed (via removeUserDefinedTaskLists() function) so that we could re-create the userDefined DOM nodes here inclusive of the new list that user just added. However, if the the previous Active List was a System Defined task list then it will still be present so we don't want to toggle off the selected class and and end up with no active list...so hence the check to see if the previously active node was a User Defined List item (and if it was we need to make it active by toggling on 'selected' class) 
				 */

				//				if (userDefinedTaskList[i].taskList_name === currActiveListName && 
				//					!appModelController.getPreDefinedTaskListNames().contains(userDefinedTaskList[i].taskListName) ) {
				//						toggleClass(nextNode, 'selected');
				//					}

				// +++++ New Logic
				if (userDefinedTaskList[i].taskList_id === currActiveListId &&
					!preDefinedTaskListIds.contains(userDefinedTaskList[i].taskList_id)) {
					toggleClass(nextNode, 'selected');
				}

			} // END FOR LOOP for building and adding UserDefined List to dropdown						

		},

		/********************************************************************************
			METHOD:  buildAndDisplayTaskListCards()
		********************************************************************************/

		buildAndDisplayTaskListCards: function () {
			var newNode;
			var userDefinedTaskLists = appModelController.getUserDefinedTaskList();

			// Sort the userDefinedTask List
			appModelController.sortListByName(userDefinedTaskLists);

			// Template to build TaskList Cards for manageTaskLists page
			var genericTaskListsCardHtml = '<div class="card card-taskList" data-listid="%taskListId%"><div class="card-block"><div><p class="card-taskList-subtitle text-muted taskListName">%taskListName%</p></div><div class="floatRight"><a onclick="appUIController.setUpEditTaskListModal(this)" data-id="%taskListId%" data-toggle="modal" data-target="#manageListsEditListModal"><i class="fa fa-pencil-square-o editTaskIcon" aria-hidden="true"></i></a><a onclick="appUIController.setUpDeleteTaskListModal(this)"data-id="%taskListId%" data-toggle="modal" data-target="#manageListsDeleteListModal"><i class="fa fa-trash-o deleteTaskIcon floatRight" aria-hidden="true"></i></a></div><p class="card-taskList-text text-muted taskListTotalsLine"><span class="taskTotalLabel">Tasks:</span><span class="taskTotalCount">%taskTotalCount%</span><span class="overDue">(<span class="taskOverDueCount">%taskOverDueCount%</span>overdue)</span></p><p class="text-muted taskListTotalsLine">Completed:  <span id="nonActiveTaskItemCount">%nonActiveTaskCount%</span></p></div></div>';

			var specificTaskListsCardHtml;


			var insertNodeLocation = document.getElementById("manageTaskListsContent");
			var newNode;

			//*****************************************************************************************************
			// Loop for building the User Defined Task Lists HTML/Nodes and inserting them into manageTaskListPage
			//*****************************************************************************************************

			for (var i = 0; i < userDefinedTaskLists.length; i++) {
				// Insert the record ID in the special data attribute data-id="recordId"

				specificTaskListsCardHtml = genericTaskListsCardHtml.replace('%taskListName%', userDefinedTaskLists[i].taskList_name);

				specificTaskListsCardHtml = specificTaskListsCardHtml.replace(/%taskListId%/g, userDefinedTaskLists[i].taskList_id);

				specificTaskListsCardHtml = specificTaskListsCardHtml.replace('%taskTotalCount%', userDefinedTaskLists[i].taskList_totalCount);

				specificTaskListsCardHtml = specificTaskListsCardHtml.replace('%taskOverDueCount%', userDefinedTaskLists[i].taskList_overDueCount);

				specificTaskListsCardHtml = specificTaskListsCardHtml.replace('%nonActiveTaskCount%', userDefinedTaskLists[i].taskList_completedCount);

				//* Convert completed HTML string into DOM node so it can be inserted
				newNode = document.createRange().createContextualFragment(specificTaskListsCardHtml);

				insertNodeLocation.appendChild(newNode)
			}

		},
		/*****************************************************************************************************
			MODULE: appUIModule;
			METHOD: updateAndDisplayPreDefinedTaskListTotals - Insert OverDueCount and TotalCounts into list totals 
			from TaskListTable 
			
			
		*****************************************************************************************************/

		updateAndDisplayPreDefinedTaskListTotals: function (taskListTable) {

			var preDefinedListRecord;

			// Get the taskListTable record for the "All List"
			preDefinedListRecord = taskListTable.hasElement("All Lists");

			allListsElem.childNodes[4].classList.remove("overDueItemsPresent");
			if (taskListTable[preDefinedListRecord].taskList_overDueCount > 0) {
				allListsElem.childNodes[4].classList.add("overDueItemsPresent");
				// OverDueTotal count
				allListsElem.childNodes[4].innerText = taskListTable[preDefinedListRecord].taskList_overDueCount;
			}

			// TotalList count
			allListsElem.childNodes[2].innerText = taskListTable[preDefinedListRecord].taskList_totalCount;


			preDefinedListRecord = taskListTable.hasElement("Default");
			//			defaultListElem.childNodes[4].classList.remove("overDueItemsPresent");
			if (taskListTable[preDefinedListRecord].taskList_overDueCount > 0) {
				// OverDueTotal count
				defaultListElem.childNodes[4].classList.add("overDueItemsPresent");
				defaultListElem.childNodes[4].innerText = taskListTable[preDefinedListRecord].taskList_overDueCount;
			}

			// TotalList count
			defaultListElem.childNodes[2].innerText = taskListTable[preDefinedListRecord].taskList_totalCount;

			preDefinedListRecord = taskListTable.hasElement("Completed");
			//			completedListElem.childNodes[4].classList.remove("overDueItemsPresent");
			// OverDueTotal count
			if (taskListTable[preDefinedListRecord].taskList_overDueCount > 0) {
				completedListElem.childNodes[4].classList.add("overDueItemsPresent");
				completedListElem.childNodes[4].innerText = taskListTable[preDefinedListRecord].taskList_overDueCount;
			}

			// TotalList count
			completedListElem.childNodes[2].innerText = taskListTable[preDefinedListRecord].taskList_totalCount;

		},


		/********************************************************************************
			METHOD:  addListInfoToMenu()
			
			Summary: 
			 - Builds the User Defined Task List HTML based on info in TaskListTable and inserts into the Nav's Task List Dropdown 
			 Note: The Pre Defined Task List nodes are hardcoded in the HTML so no need to build their HTML and insert nodes;
			 Note: Each list's TotalList and OverDue counts from the TaskListTable are updated in another method and simply inserted in this method  
			
			ARGUMENTS:
			- userDefinedTaskList - array containing just the User Defined Task Lists (subset of TaskListTable) 
			- nextNode: is specific DOM location within userDefinedTaskList where these user defined taskList need to be inserted. Note: Specifically userDefined list names need to be inserted starting after the system defined List name: Default. 
			(i.e., "All List, "Default", <- userDefinedTaskListInfo, "Completed ->)
			
		********************************************************************************/

		//		addListInfoToMenu: function (taskListTable, userDefinedTaskList) {
		//			
		//			
		//			appModelController.sortListByName(userDefinedTaskList); 
		//
		//			// Build the HTML/DOM nodes for UserDefined Task List and insert in DOM for display on subMenuTaskList
		//			appUIController.buildAndDisplayUserDefinedTaskList(userDefinedTaskList);
		//
		//			// Update task list totals and add them to DOM for display on subMenuTaskList 
		//			appUIController.updateAndDisplayPreDefinedTaskListTotals(taskListTable);
		//
		//		
		//		}, // END addListInfoToMenu


		/********************************************************************************
			METHOD:  buildAndDisplayTaskItemsToDisplay()
				
			Builds the html to display the taskList that is passed as an input parameter
				
			ARGUMENTS:
			- taskItemList - the tasks for which you want to build the html for display
				
		********************************************************************************/

		buildAndDisplayTaskItems: function (idOfInsertLocation, taskItemList) {

			/*******************************************************************************
			 Build Tasks to display on screen
			*********************************************************************************/


			var taskListId; // Global variable whose value is set in for loop below
			var insertNodeLocation = document.getElementById(idOfInsertLocation);
			var specificTaskItemHtml, newNode;


			// Callback function for .find(). Returns the taskListTable object with matching taskListId 
			// Similar to example provided MDN webdocs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find

			function getListName(taskList) {
				//				console.log("--------->getListName()" );
				//				console.log(taskList);
				return taskList.taskList_id === taskListId;
			}
			// Should need this any longer now that defined in AppUIController
			//			var mainPage = document.getElementById("mainPage"); 
			var repeatSymbol = '<i class="fa fa-repeat taskDetails" aria-hidden="true"></i>';

			//			var genericTaskItemHtml = '<div class="card" data-id="%taskItemId%"><div class="card-block"><div class="completedDateHeader %hideIt%" ><span class="completedDateStyling">%completedDate%</span><hr></div><div class="taskTitleDiv"><a data-toggle="modal" data-target="#markCompleteConfirmModal"></a><span onclick="appUIController.displayEditTaskPage(this)" class="card-subtitle mb-2" data-id="%taskItemId%" for="">%taskTitle%</span></div><h6 class="card-text taskDue">%date%</h6><h6 class="card-text">%repeatSymbol%%repeatOption%</h6><div><h6 class="taskListName floatLeft">%listName%</h6></div></div><div class="row showHideActionRow"><div class="col"><hr></div><div class="col-auto"><span class="actionTaskLabel" onclick="appUIController.showHideTaskActions(this)"><i class="fa fa-plus expandTaskActions" aria-hidden="true"></i>TASK ACTIONS</span></div><div class="col"><hr></div></div><div class="row taskActionRow"><div class="col"><a class="editTaskAction" onclick="appUIController.displayEditTaskPage(this)" data-id="%taskItemId%"><label><i class="fa fa-pencil-square-o editTaskIcon" aria-hidden="true"></i>Edit</label></a></div><div class="col taskActionRowCompletCheckbox"><label><input onclick="appUIController.markTaskAsCompleted(this)" data-id="%taskItemId%" class="checkbox" type="checkbox" name="taskCompleteStatus" value="taskCompleteStatus" %checkedValue%><span class="taskActionCompleteLabel">Complete</span></label></div><div class="col"><a onclick="appUIController.setUpDeleteTaskItemModal(this)" class="floatRight" data-toggle="modal" data-target="#deleteTaskItemModal" data-id="%taskItemId%"><label class=""><i class="fa fa-trash-o deleteTaskIcon" aria-hidden="true"></i>Delete</label></a></div></div></div>';
			var genericTaskItemHtml = '<div class="card" data-id="%taskItemId%"><div class="card-block"><div class="completedDateHeader %hideIt%" ><span class="completedDateStyling">%completedDate%</span><hr></div><div class="taskTitleDiv"><a data-toggle="modal" data-target="#markCompleteConfirmModal"></a><span onclick="appUIController.displayEditTaskPage(this)" class="card-subtitle mb-2" data-id="%taskItemId%" for="">%taskTitle%</span></div><div class="%notificationsPresent% notificationIcon"><i class="notificationIconPosition floatLeft fa fa-bell-o"></i></div><h6 class="card-text taskDue">%date%</h6><h6 class="card-text">%repeatSymbol%%repeatOption%</h6><div><h6 class="taskListName floatLeft">%listName%</h6></div></div><div class="row showHideActionRow"><div class="col"><hr></div><div class="col-auto"><span class="actionTaskLabel" onclick="appUIController.showHideTaskActions(this)"><i class="fa fa-plus expandTaskActions" aria-hidden="true"></i>TASK ACTIONS</span></div><div class="col"><hr></div></div><div class="row taskActionRow"><div class="col"><a class="editTaskAction" onclick="appUIController.displayEditTaskPage(this)" data-id="%taskItemId%"><label><i class="fa fa-pencil-square-o editTaskIcon" aria-hidden="true"></i>Edit</label></a></div><div class="col taskActionRowCompletCheckbox"><label><input onclick="appUIController.markTaskAsCompleted(this)" data-id="%taskItemId%" class="checkbox" type="checkbox" name="taskCompleteStatus" value="taskCompleteStatus" %checkedValue%><span class="taskActionCompleteLabel">Complete</span></label></div><div class="col"><a onclick="appUIController.setUpDeleteTaskItemModal(this)" class="floatRight deleteAction" data-toggle="modal" data-target="#deleteTaskItemModal" data-id="%taskItemId%"><label class=""><i class="fa fa-trash-o deleteTaskIcon" aria-hidden="true"></i>Delete</label></a></div></div></div>';

			for (var i = 0; i < taskItemList.length; i++) {

				// Insert the record ID in the special data attribute data-id="recordId"
				specificTaskItemHtml = genericTaskItemHtml.replace(/%taskItemId%/g, taskItemList[i]._id);


				/* Determines whether task is completed & if so it shows the completed date otherwise div is hidden */

				if (taskItemList[i].taskItem_completedDate) {

					specificTaskItemHtml = specificTaskItemHtml.replace('%completedDate%', "<i class='far fa-calendar-check'></i>" + taskItemList[i].taskItem_completedDate);
					specificTaskItemHtml = specificTaskItemHtml.replace('%hideIt%', '');

				} else { //No completed date so "hideIt" completedDateHeader make sure completed date that may have been present previously is cleared

					specificTaskItemHtml = specificTaskItemHtml.replace('%completedDate%', "");
					specificTaskItemHtml = specificTaskItemHtml.replace('%hideIt%', "hideIt");
				}


				// Insert the list name in HTML
				specificTaskItemHtml = specificTaskItemHtml.replace('%taskTitle%', taskItemList[i].taskItem_title);

				//Display the displayNotificationIcon if notifications are present for taskItem

				// Notifications present so remove %notificationsPresent% 
				if (taskItemList[i].taskItem_notifications) {
					specificTaskItemHtml = specificTaskItemHtml.replace("%notificationsPresent%", "");
				} else { // Notifications not present so we want to hide notificationIcon
					specificTaskItemHtml = specificTaskItemHtml.replace("%notificationsPresent%", "hideIt");

				}

				specificTaskItemHtml = specificTaskItemHtml.replace('%date%', taskItemList[i].taskItem_due_date);
				specificTaskItemHtml = specificTaskItemHtml.replace('%time%', taskItemList[i].taskItem_due_time);

				// **** DISABLED REPEAT OPTION
				// Insert the repeat option selected
				//				if (taskItemList[i].taskItem_repeat.toLowerCase() === "none" || taskItemList[i].taskItem_repeat  === "") {
				specificTaskItemHtml = specificTaskItemHtml.replace('%repeatSymbol%', "");
				specificTaskItemHtml = specificTaskItemHtml.replace('%repeatOption%', "");

				//				} else {
				//					
				//					specificTaskItemHtml = specificTaskItemHtml.replace('%repeatOption%', utilMethods.titleCase(taskItemList[i].taskItem_repeat));
				//					specificTaskItemHtml = specificTaskItemHtml.replace('%repeatSymbol%', repeatSymbol);
				//				}

				// if task Item is complete (has complete date ) then make sure completed checkbox is checked
				if (taskItemList[i].taskItem_completedDate !== "") {

					specificTaskItemHtml = specificTaskItemHtml.replace('%checkedValue%', "checked");

				} else { // No complete date so the item is not completed so make sure Completed checkbox is not checked. 

					specificTaskItemHtml = specificTaskItemHtml.replace('%checkedValue%', "");
				}

				/* A taskItem object doesn't include it's list's Name but instead it contains the id for the it's list name (taskList_id). But with the taskList_id you can look up the List Name in the taskListTable.  
				 */
				taskListId = taskItemList[i].taskList_id;

				// Look up the taskList Name in taskListTable and insert in in the html.  
				specificTaskItemHtml = specificTaskItemHtml.replace('%listName%', appModelController.getTaskListTable().find(getListName).taskList_name);

				//* Convert completed HTML string into DOM node so it can be inserted
				newNode = document.createRange().createContextualFragment(specificTaskItemHtml);

				// If a TaskItem is determined to be overDue then you want taksItem Title text to be red
				if (idOfInsertLocation === "overDue") {
					newNode.querySelector('.card-subtitle').classList.add('overDue');
				}


				var activeListName = appUIController.getActiveTaskListName();

				/* If you attempting to view the "Completed" list then you only want to display items in that list that have a completed date Otherwise if you are viewing any other list you only want to see taskItems that are not marked as complete 
				 */
				if ((activeListName === "Completed" && taskItemList[i].taskItem_completedDate !== "") || (activeListName !== "Completed" && taskItemList[i].taskItem_completedDate === "")) {
					insertNodeLocation.appendChild(newNode);
				}

			}

		}, //END buildAndDisplayTaskItems()


		/******************************************************************************** 
			METHOD: buildTaskDateHeader():
			
			Creates and inserts the appropriate Due Date Header for taskItems to be displayed
	
			 VARIABLES: 
		**********************************************************************************/

		buildTaskDueDateHeader: function (key) {

			var genericTaskDueDateHeader = '<article id="%key%" class="dueTimeFrameLabel"><h5 class="taskCategory %overDueAttr%">%taskDueDateCategory%</h5>';
			var specificDueDateHeader;
			var newNode;

			specificDueDateHeader = genericTaskDueDateHeader.replace("%key%", key);
			if (key === "overDue") {
				specificDueDateHeader = specificDueDateHeader.replace("%overDueAttr%", "overDue");
			} else {
				specificDueDateHeader = specificDueDateHeader.replace("%overDueAttr%", "");
			}
			specificDueDateHeader = specificDueDateHeader.replace('%taskDueDateCategory%', dueDateCategories[key].categoryLabel);

			//* Convert completed HTML string into DOM node so it can be inserted
			newNode = document.createRange().createContextualFragment(specificDueDateHeader);

			// Add the header to the DOM 
			appUIController.getUIVars().mainPage.appendChild(newNode);

		}, // End buildTaskDueDateHeader

		/******************************************************************************** 
			METHOD: addClosingTagToList():
			
			Builds the appropriate Due Date Header for taskItems to be displayed
	
			 VARIABLES: 
		**********************************************************************************/
		addClosingTagToList: function () {
			var newNode;
			newNode = document.createRange().createContextualFragment("</article>");
			appUIController.getUIVars().mainPage.appendChild(newNode);
		}, // END addClosingTagToList



		/******************************************************************************** 
			METHOD: groupTaskByDueDate():
			
			Determines whether any of the task items in listItems "pool" matches the current key (e.g, "overdue, dueIn1Week, etc") timeframe criteria . If so it returns all the matching taskItems for that key. Note: any taskItems that are matched must be removed from the listItem pool so that we don't continue to search through already matched task. More IMPORTANTLY the algorithm 
			used RELIES on the fact that these matching items are removed from the pool at the time of match (only checks if date is less than key's date)...otherwise previously taskItems will be inappropriately displayed multiple times under the wrong categories.

				
			 VARIABLES: 
			 
			- "listItemsLeftToCategorize" - contains ONLY taskItems that have NOT been matched yet to a Due Date category.
			
			- aTaskInGroup - a flag that is set to true if at least one taskItem is found that falls within the due date period for the current key. This flag is reset with each new category/key (i.e., each time the function is called).
 
		**********************************************************************************/

		groupTaskByDueDate: function (key, listItems) {



			// Identify all taskItems in list that match grouping dueDate
			// All matching task are saved in groupedTasks
			aTaskInGroup = false;


			/* Task that fall within the dates for a given key (e.g., 'DueWithIn1Week') will be returned in groupedTask using filter method
			 */
			return listItems.filter(function (taskItem) {

				/* If user specified due date we must convert task date string
					to a Date object so that it can be compared to Date objects
					for grouping criteira
				*/
				if (taskItem.taskItem_due_date !== "") {

					//					taskDueDateYMD = convertDateString2DateObject(taskItem.taskItem_due_date);
					// Convert the taskItem_due_date into Date object so that it can be compared to date for grouping criteria
					taskDueDate = new Date(taskItem.taskItem_due_date);
					taskDueDateYMD = new Date(taskDueDate.getFullYear(),
						taskDueDate.getMonth(),
						taskDueDate.getDate());
				} else { // User didn't specify a due date so just set to ""
					taskDueDateYMD = "";
				}

				/* 
				Determines whether task due date falls within timeframe of category group dates specified via current key value (e.g., 'overDue', dueWithin1Week, etc) 
				
				Since we are comparing Date objects we use JSON.stringify to see if date objects are equal without having to do "deep" comparison of all properties. This technique works on simple objects (e.g., no methods)
				
				Note: Task matches if no due date specified on task and the category(ie., key) = "noDate.
				Also when checking 
				*/

				if (((taskDueDateYMD === "") && (key === "noDate")) ||
					((taskDueDateYMD !== "") && (JSON.stringify(taskDueDateYMD) <= JSON.stringify(dueDateCategories[key].dueDate)))) {

					aTaskInGroup = true;
					/* If the current taskItem matches the grouping criteria (date) then check to see if the task is in list of items left to categorize ("listItemsLeftToCategorize")..if so then remove it from that list (by filtering it) so we don't continue to check for matches 
					 */
					if (containsObject(taskItem, listItemsLeftToCategorize)) {
						// Remove the taskItem by filtering out the taskItem by it's id. 
						listItemsLeftToCategorize = listItemsLeftToCategorize.filter(function (el) {
							return el._id != taskItem._id;
						});
					}


					return taskItem;


				} else {
					/* Else taskItem_due_date doesn't match this particular grouping criteria so 
					we'll need to retain the task for comparison with the next grouping criteria 
					*/
					if (!containsObject(taskItem, listItemsLeftToCategorize)) {
						listItemsLeftToCategorize.push(taskItem);
					}
				}

			});

		}, //END groupTaskByDueDate()


		/**********************************************************************************************
			METHOD: groupAndDisplayTaskItems()
			
			Once you've filtered the taskItems down to the list that the user selected (e.g., Work taskItems), this method will loop through the taskItems once for each key (due date period) and collect any taskItems that fit the due date period for that key.
			
			1) Call a method to search and "collect" any taskItems that fall within the key's due date period (e.g. OverDue, dueIn1Week, etc) timeframe;
			
			2) Call a method to build and insert the html "due date label" (e.g., "Due within 14 Days") if at least one taskItems exists for the due date group. If no taskItems match the due date group then the the header/content/closing tag will not be generated for that due date group/key; 
			
			3) Call a method to build and display the taskItems that were "collected" for a given due date period;
			
			4) Call a method to insert the closing tag for a given due date label 
		
			
			APPUICONTROLLER GLOBAL VARIABLES: 
			
			- "listItemsLeftToCategorize" - contains ONLY taskItems that have NOT been matched yet to a Due Date category.
			
			- aTaskInGroup - a flag that is set to true if at least one taskItem is found that falls within the due date period for the current key. This flag is reset with each new category/key (i.e., each time the function is called). 
		**********************************************************************************************/

		groupAndDisplayTaskItems: function (listItemsToCategorize) {
			var groupedTasks;

			for (key in dueDateCategories) {
				// Group the taskListItems into groups based on due date
				groupedTasks = appUIController.groupTaskByDueDate(key, listItemsToCategorize);

				// If there is at least one taskItem that falls within a "due date" period then we will need to build a html header for it
				if (aTaskInGroup) {
					// Build grouping a header i.e.,<article><h5></h5>
					appUIController.buildTaskDueDateHeader(key);
				}
				// Now display the taskItems in this due date period 
				appUIController.buildAndDisplayTaskItems(key, groupedTasks);

				// Insert closing article tag
				appUIController.addClosingTagToList();

				listItemsToCategorize = listItemsLeftToCategorize;
			}
		}, // END groupAndDisplayTaskItems

		/******************************************************************************** 
			METHOD: refreshTaskListSubMenuTotals():
			
			Summary; Refresh the OverDue and ListTotal counts on the taskListSubMenu on Nav bar list selector
			- For each DOM list element on the taskListSubmenu
				- Extract the list name from the DOM
				- Find that list's matching record in the TaskListTable 
				- Use the OverDueCount and ListTotalcounts values from the matching TaskListTable to update the DOM list totals
	
			 VARIABLES:
			 	input: taskListTable - table that contains all information about 
			 	
		**********************************************************************************/

		refreshTaskListSubMenuTotals: function (taskListTable) {

			console.log("in appUIController.refreshTaskListSubMenuTotals() method");
			var index; // index of taskListTable record that match list name from DOM element


			// Get all of the taskList from the taskListSubmenu 
			var subMenuListDOMNodes = document.querySelector(".taskListsSubMenu").querySelectorAll('li');

			// For each subMenuTask List element search for a matching listname in the taskListTable
			// If a match is found update the DOM listcounts with those from the taskListTable
			// Note: subMenuListDOMNodes is a NodeList and in some browsers forEach() doesn't work with NodeList so
			// statment below allows you to use forEach() on NodeList
			Array.prototype.forEach.call(subMenuListDOMNodes, function (listNode) {

				// Using the innerText method will return the list name, totals & any blank characters 
				// In order to isolate the name we use replace (to eliminate numbers) and trim(to remove extra space chars)
				var listName = listNode.innerText.replace(/[0-9]/g, '').trim();

				// hasElement method returns the index of the matching taskListTable records, if no match returns -1
				// NOTE: The subMenuListDOMNodes will include some members that will not have an entry in the taskListTable (e.g., "New List)
				index = taskListTable.hasElement(listName);

				if (index >= 0) {
					if (taskListTable[index].taskList_overDueCount > 0) {
						// Update DOM subMenu totals with value from TaskListTable
						listNode.querySelector(".overDueCount").innerHTML = taskListTable[index].taskList_overDueCount;
						if (!listNode.querySelector(".overDueCount").classList.contains("overDueItemsPresent")) {
							listNode.querySelector(".overDueCount").classList.add("overDueItemsPresent")
						}

					} else if (listNode.querySelector(".overDueCount").classList.contains("overDueItemsPresent")) {
						listNode.querySelector(".overDueCount").classList.remove("overDueItemsPresent");
						listNode.querySelector(".overDueCount").innerHTML = "";
					}
					listNode.querySelector(".listTotal").innerHTML = taskListTable[index].taskList_totalCount;
				}
			}); // End forEach Loop

		},
		removeUserDefinedTaskLists: function (userDefinedTaskLists) {
			var subMenuListDOMNodes = document.querySelector(".taskListsSubMenu").getElementsByTagName("li");

			// Got the following for;Each solution from https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/
			// forEach method, could be shipped as part of an Object Literal/Module
			var forEach = function (array, callback, scope) {
				for (var i = 0; i < array.length; i++) {
					callback.call(scope, i, array[i]); // passes back stuff we need
				}
			};


			userDefinedTaskLists.forEach(function (udtlRecord) {
				var udtlListName = udtlRecord.taskList_name;
				forEach(subMenuListDOMNodes, function (index, listNode) {
					var listName = listNode.innerText.replace(/[0-9]/g, '').trim();
					if (udtlListName === listName) {
						listNode.parentNode.removeChild(listNode);
					}
				});

			});


		}
	}
})();



// AppController connects the taskItModel and UIcontrollers together;
// It wasn't necessary to pass other controllers in as params but doing so
// creates more independence and separation of control. Also note that 
// taskIt and ui controller param names are slightly diff than names of these controllers

//**************************************************************************************
//
// 									TASKIT APP CONTROLLER
//
//**************************************************************************************

var appController = (function (appModelCtrl, appUICtrl, utilMthds) {

	var userDefinedTaskLists = appModelController.getUserDefinedTaskList()
	var setupEventListeners = function () {


		// EventListener for List Submenu 
		var taskList_id = document.querySelector(".taskListsSubMenu").addEventListener('click', handleSubMenuClick);


		// Event Listeners for Search 
		searchInput.addEventListener("focus", handleSearchFocus);
		searchInput.addEventListener("blur", handleSearchBlur);
		searchInput.addEventListener("keyup", detectSearchInput);
		clearSearchIcon.addEventListener("click", clearSearchField);
		backArrowSearch.addEventListener("click", exitSearch);


		//****************************************************************************		
		// NEW TASK FORM EVENT LISTENERS 		
		//****************************************************************************

		// Display the add new task form
		floatAddBtn.addEventListener("click", appUIController.displayAddNewTaskForm);

		// Nav Bar Back Arrow on New Task Form
		newTaskBackArrow.addEventListener("click", function (event) {
			appUIController.exitNewTaskPage(event)
		});

		// Reset button on New Task Form
		addTaskResetButton.addEventListener("click", function (event) {
			appUIController.resetNewTaskForm1(event)
		});

		// Submit for Add New Task Form Save button at bottom of form	
		formSaveNewTask.addEventListener("submit", function (event) {
			ctrlAddTaskItem1(event)
		}, true);

		// Save Button for New Task Form on Nav Bar 
		addTaskSaveMenuButton.addEventListener("click", function (event) {
			ctrlAddTaskItem1(event)
		});

		appUIController.getUIVars().inputNewTaskTitle.addEventListener("keydown", function (event) {
			appUIController.clearTaskTitleError1(event)
		});


		// ***** DISABLED REPEAT OPTION
		//			
		//		appUIController.getUIVars().inputNewTaskRepeat.addEventListener("input", function(event) {appUIController.styleUserFormInput(event)});

		appUIController.getUIVars().addNewFormNotifications.addEventListener("click", function (event) {
			appUIController.addNewNotification(event)
		});

		// Event Listener to style notifications input
		appUIController.getUIVars().newTaskFormNotificationArea.addEventListener("click",
			function (event) {
				appUIController.styleNotificationInput(event)
			}, true);

		//*******************************************************
		// "Input" events on all fields on newTask Form
		//*******************************************************


		appUIController.getUIVars().inputNewTaskTitle.addEventListener("input", function (event) {
			appUIController.styleUserFormInput(event)
		});

		appUIController.getUIVars().inputNewTaskListSelection.addEventListener("input", function (event) {
			appUIController.styleUserFormInput(event)
		});

		// **** DISABLED REPEAT OPTION
		//		appUIController.getUIVars().inputNewTaskRepeat.addEventListener("input", function(event) {appUIController.styleUserFormInput(event)});



		//		appUIController.getUIVars().clearDueTimeBtn.addEventListener('click', function(event) {appUIController.clearDueTime(event)});


		//****************************************************************************		
		// EDIT TASK FORM EVENT LISTENERS  		
		//****************************************************************************

		editTaskBackArrow.addEventListener("click", function (event) {
			appUIController.exitEditTaskPage(event)
		});

		appUIController.getUIVars().editFormCancelButton.addEventListener("click", function (event) {
			appUIController.exitEditTaskPage(event)
		});

		// Clears any existing error formatting when user starts entering a new taskname
		appUIController.getUIVars().inputEditFormTaskItemName.addEventListener("keydown", function (event) {
			appUIController.clearTaskTitleError1(event)
		});

		appUIController.getUIVars().inputEditFormTaskItemName.addEventListener('input', function (event) {
			appUIController.styleUserFormInput(event);
		});


		// Need to re-enable this event listener if I turn on Repeat option


		//		appUIController.getUIVars().inputEditFormRepeatSelect.addEventListener('input',  function(event) { appUIController.styleUserFormInput(event)
		//		});

		appUIController.getUIVars().inputEditFormListSelect.addEventListener('input',
			function (event) {
				appUIController.styleUserFormInput(event)
			});

		appUIController.getUIVars().addEditFormNotifications.addEventListener("click", function (event) {
			appUIController.addNewNotification(event)
		});

		// Event Listener to style notifications input
		appUIController.getUIVars().editTaskFormNotificationArea.addEventListener("click",
			function (event) {
				appUIController.styleNotificationInput(event)
			}, true);

		appUIController.getUIVars().clearDueDateBtn.addEventListener('click', function (event) {
			appUIController.clearDueDate(event)
		});


		// Submit button for editTaskPage
		appUIController.getUIVars().formEditNewTask.addEventListener("submit", function (event) {
			ctrlUpdateTaskItem(event)
		});

		// Nav Bar Menu Update Button
		appUIController.getUIVars().editFormUpdateTaskNavButton.addEventListener("click", function (event) {
			ctrlUpdateTaskItem(event)
		});



		//****************************************************************************		
		// MANAGE TASK LIST FORM EVENT LISTENERS		
		//*******************************************************************

		appUIController.getUIVars().manageTaskListsIcon.addEventListener("click", function (event) {
			appUIController.displayManageTaskListsPage(event)
		});

		appUIController.getUIVars().manageTaskListsBackArrow.addEventListener("click", function (event) {
			appUIController.exitManageTaskListsPage(event)
		});


		// Form on ManageTaskLists Edit List Modal form
		appUIController.getUIVars().manageListsEditListModalForm.addEventListener("submit", function (event) {
			appUIController.editTaskList(event)
		}, true);

		appUIController.getUIVars().inputEditListName.addEventListener('keydown', function (event) {
			appUIController.clearTaskListModalFormErrors(event)
		})





		//****************************************************************************		
		// LIST MODAL FORM EVENT LISTENERS		
		//****************************************************************************

		// Clears ALL Modal form input fields when form is closed
		// Also clears error messages and error formatting

		$('#navListModal').on('hidden.bs.modal', function (e) {
			$(this)
				.find("input,textarea,select")
				.val('')
				.end()
				.find("input[type=checkbox], input[type=radio]")
				.prop("checked", "")
				.end();
			// Clear any error messages and error formatting
			var test = document.querySelector("div").closest(".modal");
			appUIController.clearTaskListModalFormErrors(e);

		});

		$('#newTaskItemListModal').on('hidden.bs.modal', function (e) {
			$(this)
				.find("input,textarea,select")
				.val('')
				.end()
				.find("input[type=checkbox], input[type=radio]")
				.prop("checked", "")
				.end();
			// Clear any error messages and error formatting
			var test = document.querySelector("div").closest(".modal");
			appUIController.clearTaskListModalFormErrors(e);

		});

		$('#editTaskItemListModal').on('hidden.bs.modal', function (e) {
			$(this)
				.find("input,textarea,select")
				.val('')
				.end()
				.find("input[type=checkbox], input[type=radio]")
				.prop("checked", "")
				.end();
			// Clear any error messages and error formatting
			var test = document.querySelector("div").closest(".modal");
			appUIController.clearTaskListModalFormErrors(e);

		});

		/* Edit List Modal Form */
		$('#manageListsAddNewListModal').on('hidden.bs.modal', function (e) {
			$(this)
				.find("input,textarea,select")
				.val('')
				.end()
				.find("input[type=checkbox], input[type=radio]")
				.prop("checked", "")
				.end();
			// Clear any error messages and error formatting
			var test = document.querySelector("div").closest(".modal");
			appUIController.clearTaskListModalFormErrors(e);

		});


		/* Manage Task List Modal Form */
		$('#manageListsEditListModalForm').on('hidden.bs.modal', function (e) {
			$(this)
				.find("input,textarea,select")
				.val('')
				.end()
				.find("input[type=checkbox], input[type=radio]")
				.prop("checked", "")
				.end();
			// Clear any error messages and error formatting
			var test = document.querySelector("div").closest(".modal");
			appUIController.editTaskList(e);
		});


		/* Manage Task List Modal Form */
		$('#manageListsEditListModalForm').on('hidden.bs.modal', function (e) {
			$(this)
				.find("input,textarea,select")
				.val('')
				.end()
				.find("input[type=checkbox], input[type=radio]")
				.prop("checked", "")
				.end();
			// Clear any error messages and error formatting
			var test = document.querySelector("div").closest(".modal");
			appUIController.editTaskList(e);

		});

		$(function () {
			$('#newTaskDatePicker, #newTaskTimePicker').on("change.datetimepicker", function (e) {
				appUIController.dueDateUpdate(e);
			});
		});

		$(function () {
			$('#editTaskDatePicker, #editTaskTimePicker').on("change.datetimepicker", function (e) {
				appUIController.dueDateUpdate(e);
			});
		});


		//		$('.clearDueDateBtn').on( "click", function( event ) {	
		//  			$('#datetimepicker3').datetimepicker('clear');
		//			console.log("Clear Due Date input")
		//			
		//		});


		// Got the following solution from stackoverflow:
		// https://stackoverflow.com/questions/15474862/twitter-bootstrap-modal-input-field-focus/20435473
		$('.modal').on('shown.bs.modal', function () {
			$(this).find('input:text:visible:first').focus();
		});



		// Method to addEventListener to every item with className 
		function addEventListenerByClass(className, event, fn) {
			var list = document.getElementsByClassName(className);
			for (var i = 0, len = list.length; i < len; i++) {
				list[i].addEventListener(event, fn, true);
			}
		}

		appUIController.getUIVars().clearDueDateBtn.addEventListener('click', function (event) {
			appUIController.clearDueDate(event)
		});
		// Assign eventListener to all occurrences of clearDueDateBtn on Forms

		addEventListenerByClass('clearDueDateBtn', 'click', function (event) {
			appUIController.clearDueDate(event)
		});

		// Assign event listener to form on all modal forms
		addEventListenerByClass('addNewTaskListModal', 'submit', function (event) {
			ctrlAddTaskList(event)
		});

		addEventListenerByClass('modalListInput', 'keydown', function (event) {
			appUIController.clearTaskListModalFormErrors(event)
		});

		addEventListenerByClass('newListCancelBtn', 'click', function (event) {
			appUIController.clearTaskListModalFormErrors(event)
		});

		// Submit of Delete TaskItem confirmation form 
		addEventListenerByClass('deleteTaskItemModalForm', 'submit', function (event) {
			appUIController.deleteTaskItem(event)
		});

		// Submit of Delete Task List confirmation form 
		addEventListenerByClass('deleteTaskListModalForm', 'submit', function (event) {
			appUIController.deleteTaskList(event)
		});

		// Date Time Picker from :https://www.malot.fr/bootstrap-datetimepicker/	
		//		$(".form_datetime").datetimepicker({
		//        format: "mm/dd/yyyy  H:ii P",
		//        showMeridian: true,
		//        autoclose: true,
		//        todayBtn: true,
		//		pickerPosition: "bottom-left"
		//    	});


		//		$('.form_datetime').datetimepicker().on('changeDate', function(e) {
		//			appUIController.dueDateUpdate(e);
		//			console.log(e);	
		//		});

	}

	/***********************************************************************************
		MODULE:  appController
		
		FUNCTION ctrlUpdateTaskItem - manages process of updating an existing task item
		
		Trigger: User hits submit button on Edit Task Form
		
		Summary: 
			Validate user data and styles form as needed 
			Create new task record
			Add it to newTask table
			Generate "new taskItem added" success message or failure message
			Display success/failure message
			
		UI Behavior: 
			User will remain on new task form until they explicitly navigate off of this page. This approach allows the
			user to sequentially enter multiple new task without having to navigate back to the new task window between entries. 

	***********************************************************************************/
	var ctrlUpdateTaskItem = function (event) {

		console.log("*=======> ctrlUpdateTaskItem");
		var taskNotificationObject, taskNotificationRecord;
		var notificationHasChanged = false;
		
		// Indicates whether update was successfully save to perm storage. Value set based on return code from save operation
		var coreTaskItemElementsUpdatedSuccessfully = true;
		var taskNotificationsUpdatedSucccessfully = true; 

		// Get the taskItemId that was stored in a hiddenInput field on edit form
		var taskItemId = appUIController.getUIVars().inputEditFormTaskItemId.value


		event.preventDefault();
		event.stopPropagation();

		var taskItemInputRecord = appUIController.getTaskItemEditInput(event);

		// If task has been newly marked as completed then we need to populate the taskItemInput record with a completed date
		if (taskItemInputRecord.taskCompletedCheckbox && taskItemInputRecord.taskCompletedDate === "") {

			// Create a CompletedDate
			taskItemInputRecord.taskCompletedDate = new Date().toLocaleString();


			// If task is marked as not completed but it had been marked complete before then we need to change the value of the taskItemInputRecord completedDate to ""

		} else if (!taskItemInputRecord.taskCompletedCheckbox &&
			taskItemInputRecord.taskCompletedDate !== "") {
			
			taskItemInputRecord.taskCompletedDate = "";
		}


		
		// Look up the page ID where this form is located so I can get associated validateObj
		var pageId = utilMethods.findAncestor(event.currentTarget, 'container-fluid').id;

		// Note: If I modify getFormValidationObject I can just leverage event to get valObj
		//		var formValidationObj = appModelController.getFormValidationObject(event.target.id);

		// Page Id is used to identify the appropirate validationObject
		var formValidationObj = appModelController.getFormValidationObject(pageId);

		// Validate the data entered on the form
		appUIController.validateFormInput(formValidationObj);

		// If all input was valid (e.g., formError = false)
		if (!formValidationObj[0].formError) {
		

			// Find the taskItem in memory object (using Id in hidden input field) and update it with values	
			var taskItemRecord = appModelController.lookUpTaskItemRecord(taskItemId);

			var coreTaskItemRecordValues = appModelController.extractCoreTaskItemValues(taskItemRecord);
			
			/*
				Process each taskNotification 
			*/
			if (taskItemInputRecord.taskNotifications.length > 0) {
				
				// Display the notification Icon on mainPage taskItem card
				appUIController.displayNotificationIcon(taskItemId);

				taskItemInputRecord.taskNotifications.forEach(function (taskNotificationInput) {

					// Check to see if notification is newly added (i.e. notification_id = null)
					if (taskNotificationInput.notificationId === null) {

						// Since a taskNotification is being added then need to mark notification changed
						notificationHasChanged = true;

						//	taskNotificationObject = appModelController.createNewNotificationObject(taskNotification, taskItemInputRecord.taskItemId)

						// Add the newly create notification to DB and return a notification object					
						appModelController.createNewNotificationObject(taskNotificationInput, taskItemInputRecord.taskItemId)
						.then (function (taskNotificationObject) {	
							
							appModelController.getTaskItemNotificationsTable().push(taskNotificationObject);
							
						})

						// Add the new notification the taskItemNotfication table
	//					appModelController.getTaskItemNotificationsTable().push(taskNotificationObject);

					} else { // Otherwise if taskNotification already exist it will have a notificationId != null

						// Retrieve the existing notification record from the notification table usiing the notificationId 
						taskNotificationRecord = appModelController.lookupTaskItemNotification(taskNotificationInput.notificationId)


						if ( utilMethods.notificationChanged( taskNotificationRecord, taskNotificationInput) ) {

							notificationHasChanged = true;

							// Now update the taskNotification record in the taskItemNotification tables
							taskNotificationRecord.notification_type = taskNotificationInput.notificationType;
							taskNotificationRecord.notification_units = taskNotificationInput.notificationUnits;
							taskNotificationRecord.notification_unitType = taskNotificationInput.notificationUnitType;

							// Write the updated values into the Database  
							appModelController.taskItemNotificationDb.get(taskNotificationInput.notificationId).then(function(doc) {
								return appModelController.taskItemNotificationDb.put({
									_id: taskNotification.notificationId,
									_rev: doc._rev,
									notification_units: taskNotificationInput.notificationUnits,
									notification_type: taskNotificationInput.notificationType,
									notification_unitType: taskNotificationInput.notificationUnits					
								});
							}).then(function(response) {

								console.log("ctrlUpdateTaskItem: Notification updated successfully: ", response)

							}).catch(function (err) {
								
								console.log(err);
								taskNotificationsUpdatedSucccessfully = false;

							});
						}
					}
				})
			}			
			
			/* If the data entered on the editTaskForm differs from the original taskItem record then save the updates otherwise no need to save just create a message telling user not updates were detected nor saved.
		
			*/
			if ( appModelController.wereChangesMadeToTaskItem(coreTaskItemRecordValues, taskItemInputRecord ) || 
				( notificationHasChanged ) ) {


				// Update the TaskItem record with values input on editTaskItem form
				utilMethods.equateTaskItemObjects(taskItemRecord, taskItemInputRecord);

				// Save the updated taskItem record to the DB (or local storage)
				
				appModelController.taskItemDb.get(appUIController.getUIVars().inputEditFormTaskItemId.value)
				.then(function(doc) {
					return appModelController.taskItemDb.put({
						_id: taskItemId,
						_rev: doc._rev,
						taskItem_title: taskItemRecord.taskItem_title,
						taskList_id: taskItemRecord.taskList_id,
						taskItem_completedDate: taskItemRecord.taskItem_completedDate,
						taskItem_due_date: taskItemRecord.taskItem_due_date,
						taskItem_notifications: taskItemRecord.taskItem_notifications,
						taskItem_repeat: taskItemRecord.taskItem_repeat
					});
				}).then(function(response) {
					console.log("ctrlUpdateTaskItem: TaskItem successfully update in DB: ", response)
					
				}).catch(function (err) {
					coreTaskItemElementsUpdatedSuccessfully = false;
					console.log(err);
				});

				
				if ( coreTaskItemElementsUpdatedSuccessfully && taskNotificationsUpdatedSucccessfully ) {

					// Style the success message
					formValidationObj[0].formSubmitSuccessMsgLoc.classList.add("success-message");

					formValidationObj[0].formSubmitSuccessMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-up"></i>' + '&nbsp;' + formValidationObj[0].formSubmitSuccessMsg;

					// Refresh the TaskItem List
					var activeTaskId = getListIdForActiveTaskList();
					updateTaskListDisplayed(activeTaskId);

					// Upadate ALL totals on all lists.  Note this method does not update the totals on the UI
					var taskListTable = appModelController.updateListTaskTotals();


					// Update UI overDue and listTotals on the taskListSubmenu (Pre-defined and UserDefined lists)
					appUIController.refreshTaskListSubMenuTotals(taskListTable);

					// ADDED
					appUIController.getUIVars().editFormCancelButton.click();

					setTimeout(function () {
						//							appUIController.getUIVars().editFormCancelButton.click();

						// Must remove the success-message class otherwise it will not appear on future saves 
						formValidationObj[0].formSubmitSuccessMsgLoc.innerHTML = "";
						formValidationObj[0].formSubmitSuccessMsgLoc.classList.remove("success-message");
						formValidationObj[0].formSubmitErrorMsgLoc.classList.remove("warning-message");

						//							formValidationObj[0].formSubmitErrorMsgLoc.classList.remove("error-message");				
					}, 5000);

				} else {
					// Log an error message "Update could not be saved to permananent storage and try again
					// If this is the first time it failed then
					// -- create error message asking user to try again
					// else if this is second or greater time this has failed
					// -- Log an error code in system log
					// -- Based on error code make some recommendations on how they could fix the problem
					// -- Ask user if they would like to send their log info to app creator for diagnosis
					// -- If they agree and user has registered app (we have their email)
					// ---- Collect log info and send it via email
					// ---- Confirm email has been sent and let them know I will follow up
					// -- else (we don't have their email address)
					// ---- present dialog to prompt them for their email & register them
					// ---- Confirm email has been sent and let them know someone will follow up
					// -- endIf
				}
			} else { // Nothing was actually updated on the field

				// Update the success message to indicate "No updates detected"

				// Style the success message
				formValidationObj[0].formSubmitSuccessMsgLoc.classList.add("warning-message");

				// Insert Submit Success Message
				formValidationObj[0].formSubmitSuccessMsgLoc.innerHTML = '<i class="fa fa-minus-circle" aria-hidden="true"></i>' + '&nbsp;' + "No updates detected";

				appUIController.getUIVars().editFormCancelButton.click();

			}

		} else { // Some form input was found in error formValidationObj[0].formError = true
			console.log("Error was detected Updating TaskItem ");
			// Create log entry if failure
			// TBD

			// Insert Failsure Message
			formValidationObj[0].formSubmitErrorMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-down"></i>' + '&nbsp;' + formValidationObj[0].formSubmitErrorMsg;

			// Style the errorSubmitMsg
			formValidationObj[0].formSubmitErrorMsgLoc.classList.add("error-message");
		}

	}
	/***********************************************************************************
		MODULE:  appController
		
		FUNCTION ctrlAddTaskItem1 - manages process of adding a new taskItem to the app
		
		Trigger: User hits submit button on New Task Form
		
		Summary: 
			Validate user data and styles form as needed 
			Create new task record
			Add it to newTask table
			Generate "new taskItem added" success message or failure message
			Display success/failure message
			
		UI Behavior: 
			User will remain on new task form until they explicitly navigate off of this page. This approach allows the
			user to sequentially enter multiple new task without having to navigate back to the new task window between entries. 

	***********************************************************************************/

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	var ctrlAddTaskItem1 = function (event) {

		event.preventDefault();
		event.stopPropagation();

		console.log("++++++++++++ ctrlAddTaskItem1()");
		var newTaskItemInput, newTaskItemObject;
		var taskListTable = appModelController.getTaskListTable();
		var taskItemRecord; 
		var newNotificationObject;

		// ----------------- New ----------------------

		// Indicates whether update was successfully save to perm storage. Value set based on return code from save operation
		var saveToPermStorageWasSuccessful = true;

		// Look up the page ID where this form is located so I can get associated validateObj
		var pageId = utilMethods.findAncestor(event.currentTarget, 'container-fluid').id;

		// Page Id is used to identify the appropirate validationObject
		var formValidationObj = appModelController.getFormValidationObject(pageId);

		// Validate the data entered on the form
		appUIController.validateFormInput(formValidationObj);

		// If all input was valid (e.g., formError = false)
		if (!formValidationObj[0].formError) {

			//	Get user input from newTaskForm
			newTaskItemInput = appUIController.getNewTaskFormUserInput();

			/* CreateNewTaskItem adds the newTaskItem to the pouchDB, creates a taskItem object and adds it to the taskItemTable. If successful it returns the taskItemObject
			*/
			appModelController.createNewTaskItem( newTaskItemInput )	
			.then (function (newTaskItemObject) {
				
				if (newTaskItemInput.newTaskNotifications.length > 0 ) {
					
					// Display the notification Icon on mainPage taskItem card
					
					taskItemRecord = appModelController.lookUpTaskItemRecord(newTaskItemObject._id);
					
					taskItemRecord.taskItem_notifications = true;

					newTaskItemInput.newTaskNotifications.forEach(function (newTaskNotification, index) {

						appModelController.createNewNotificationObject(newTaskNotification, newTaskItemObject._id)
						.then(function ( newNotificationObject ) {
							
							console.log("New Notification Added to DB");
							
							appModelController.getTaskItemNotificationsTable().push(newNotificationObject);
							
							console.log("New Notification Added to TaskItemNotificationTable");
							 
							
						})
					})					
					
				}
					
					
				console.log("%%%%%%  ctrlAddTaskItem: Continue code after DB puts ");
			
				// Style the success message
				formValidationObj[0].formSubmitSuccessMsgLoc.classList.add("success-message");

				// Insert Submit Success Message
				formValidationObj[0].formSubmitSuccessMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-up"></i>' + '&nbsp;' + formValidationObj[0].formSubmitSuccessMsg;

				// Refresh the TaskItem List
				var activeTaskId = getListIdForActiveTaskList();
				updateTaskListDisplayed(activeTaskId);

				// Upadate ALL totals on all lists.  Note this method does not update the totals on the UI
				taskListTable = appModelController.updateListTaskTotals();

				// Update UI overDue and listTotals on the taskListSubmenu (Pre-defined and UserDefined lists)
				appUIController.refreshTaskListSubMenuTotals(taskListTable);

				// Update UI overDue and listTotals on the taskListSubmenu (Pre-defined and UserDefined lists)
				appUIController.refreshTaskListSubMenuTotals(taskListTable);

				// ADDED
				appUIController.exitNewTaskPage(event);

				setTimeout(function () {

					// Must remove the success-message class otherwise it will not appear on future saves 
					formValidationObj[0].formSubmitSuccessMsgLoc.innerHTML = "";
					formValidationObj[0].formSubmitSuccessMsgLoc.classList.remove("success-message");
					formValidationObj[0].formSubmitSuccessMsgLoc.classList.remove("warning-message");


				}, 5000)

			
			}).catch ( function (err) {

					// Log an error message "Update could not be saved to permananent storage and try again
					// If this is the first time it failed then
					// -- create error message asking user to try again
					// else if this is second or greater time this has failed
					// -- Log an error code in system log
					// -- Based on error code make some recommendations on how they could fix the problem
					// -- Ask user if they would like to send their log info to app creator for diagnosis
					// -- If they agree and user has registered app (we have their email)
					// ---- Collect log info and send it via email
					// ---- Confirm email has been sent and let them know I will follow up
					// -- else (we don't have their email address)
					// ---- present dialog to prompt them for their email & register them
					// ---- Confirm email has been sent and let them know someone will follow up
					// -- endIf

					console.log("Error when creating an New Task Item: ", err)
					//Some thing failed in Save process....either writing to DB or local storage

					// Create log entry if failure
					// TBD

					// Insert Submit Error Message
					formValidationObj[0].formSubmitErrorMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-down"></i>' + '&nbsp;' + formValidationObj[0].formSubmitErrorMsg;

					// Style the errorSubmitMsg
					formValidationObj[0].formSubmitErrorMsgLoc.classList.add("error-message");

				})	


		} else { // Some form input was found in error formValidationObj[0].formError = true

			console.log("Error was detected Updating TaskItem ");
			// Create log entry if failure
			// TBD

			// Insert Failsure Message
			formValidationObj[0].formSubmitErrorMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-down"></i>' + '&nbsp;' + formValidationObj[0].formSubmitErrorMsg;

			// Style the errorSubmitMsg
			formValidationObj[0].formSubmitErrorMsgLoc.classList.add("error-message");

		}

	}



	/***********************************************************************************
		MODULE:  appController
		
		FUNCTION ctrlAddTaskList - manages process of adding a new Task List to the app
		
		Trigger: User hits submit button on one of the New Task Modal Windows
			- subMenuTaskList menu
			- newTaskForm
			- editTaskForm
		
		Summary: 
			Validate user data and styles form as needed 
			Create new task record
			Add it to newTask table
			Generate "new taskItem added" success message or failure message
			Display success/failure message
			
		UI Behavior: 
			- When user "submits" a valid Task List a success message is displayed
			on the modal window for several seconds and then the modal is closed.
			- An alternative approach could be to immediately close the modal if a
			a valid Task List Name is entered and display the success message at the 
			top of the Main page. Consideration: Consistency of this behaviour with other forms (e.g., AddNewTaskItem/EditItem form)
			- After the modal is closed the main page is re-displayed
				- As currently designed the the newly created list becomes the active task list and
				as a result the task items for that new list are displayed...but of course there are 
				no task items to display with a newly created task list 
				- Alternatively the design could be to create the new list but not make it the active list.
				That may be the better approach. 

	***********************************************************************************/
	var ctrlAddTaskList = function (event) {
		console.log("++++++++++++ ctrlAddTaskList()");
		event.preventDefault();
		event.stopPropagation();

		// Represents results from attempting to save Task List record to DB/local storage
		var newTaskListNameInput;
		var newTaskListObject;
		var userDefinedList;
		var newTaskListPromise;


		var taskItemFormListSelect;

		var currActiveListNode = getActiveTaskList();
		var currActiveListName = appUIController.getActiveTaskListName();

		// ++++++ Added so I could use in buildAndDisplayUserDefinedTaskList() method
		var currActiveListId = getListIdForActiveTaskList();

		// Find the "root" node of the modal page so that I can get ID of which modal fired 
		var modalPageId = utilMethods.findAncestor(event.currentTarget, 'modal').id;

		// Using the modal page ID look up the form validation object
		var formValidationObj = appModelController.getFormValidationObject(modalPageId);

		var taskListTable = appModelController.getTaskListTable();

		appUIController.validateFormInput(formValidationObj);

		// If all input was valid (e.g., formError = false)
		if (!formValidationObj[0].formError) {
			
			userDefinedTaskLists = appModelController.getUserDefinedTaskList();

			/*  Create new taskList object and save it to pouchDB. This method returns a promise if the write to DB
				was successful it returns a taskListObject otherwise an erro will be returned in the catch branch
			*/
			appModelController.createNewTaskList(formValidationObj[0].fieldsToValidate[0].fieldName.value)
			.then (function (taskListObject) {
				
				console.log("Creating Task List was successful: ", taskListObject);

				// Style the newly added list selection input to reflect list selection had changed (add class="filled")
				appUIController.getUIVars().inputEditFormListSelect.classList.add("filled");
				appUIController.getUIVars().inputNewTaskListSelection.classList.add("filled");

				formValidationObj[0].fieldsToValidate[0].fieldName.classList.add("filled");

				// First we need to unhide the success message so it will appear
				formValidationObj[0].formSubmitSuccessMsgLoc.classList.remove("hideIt");


				// Style the success message
				formValidationObj[0].formSubmitSuccessMsgLoc.classList.add("success-message");

				// Insert Submit Success Message
				formValidationObj[0].formSubmitSuccessMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-up"></i>' + '&nbsp;' + '"' + taskListObject.taskList_name + '"' + ' ' + formValidationObj[0].formSubmitSuccessMsg;


				var modalWindowIndex = appModelController.getModalWindowIndex(event.target.id);
				appUIController.getUIVars().newListCancelBtn[modalWindowIndex].click();


				// Remove existing UserDefined Task list from TaskListSubmenu
				appUIController.removeUserDefinedTaskLists(userDefinedTaskLists);

				appUIController.buildAndDisplayUserDefinedTaskList(currActiveListId);

				// Perform specific actions need based on Modal form involved 
				// e.g., clear screen content, rebuild the list selection on the form, etc.
				
				switch (modalPageId) {

					case "manageListsAddNewListModal":
						appUIController.clearOutExistingScreenContent(appUIController.getUIVars().manageTaskListsContent, "card");
						appUIController.buildAndDisplayTaskListCards(appUIController.getUIVars().manageTaskListContent, "card");
						break;

					case "editTaskItemListModal":
						taskItemFormListSelect = appUICtrl.getUIVars().inputEditFormListSelect;
						// Rebuild values in List selection on form
						appUIController.populateFormWithListNames(taskItemFormListSelect)

						// Make newly added list the "active" list selection on taskItem form
						appUIController.setTaskListSelect(taskItemFormListSelect, taskListObject.taskList_name);
						break;

					case "newTaskItemListModal":
						taskItemFormListSelect = appUICtrl.getUIVars().inputNewTaskListSelection;
						// Rebuild values in List selection on form
						appUIController.populateFormWithListNames(taskItemFormListSelect)

						// Make newly added list the "active" list selection on taskItem form
						appUIController.setTaskListSelect(taskItemFormListSelect, taskListObject.taskList_name);
						break;

					case "navListModal":

						// Nothing extra to do here...the key stuff is done in ctrAddTaskList();

						break;

					default:
						console.log("ctrAddTaskList()...no matching modal page)");

				}

				// After fadeout animation ends we need to reset message 
				setTimeout(function () {
					var modalWindowIndex = appModelController.getModalWindowIndex(event.target.id);

					// Close the form by virtually clicking on cancel button
					appUIController.getUIVars().newListCancelBtn[modalWindowIndex].click();


					// Must remove the success-message class otherwise it will not appear on future saves 
					formValidationObj[0].formSubmitSuccessMsgLoc.innerHTML = "";
					formValidationObj[0].formSubmitSuccessMsgLoc.classList.remove("success-message");
					// ????
					formValidationObj[0].formSubmitErrorMsgLoc.classList.remove("error-message");
					formValidationObj[0].formSubmitErrorMsgLoc.classList.remove("warning-message");


					// Rehide the success message so it doesn't obstruct input on the newTask or editTask forms
					toggleClass(formValidationObj[0].formSubmitSuccessMsgLoc, "hideIt");


					// Remove the 'filled' styling on exit from form.
					formValidationObj[0].fieldsToValidate[0].fieldName.classList.remove("filled");
				}, 3000);


				
			}).catch ( function (err) {
				
				console.log("Error when creating an New Task List: ", err)
				//Some thing failed in Save process....either writing to DB or local storage

				// Create log entry if failure
				// TBD

				// Insert Submit Error Message
				formValidationObj[0].formSubmitErrorMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-down"></i>' + '&nbsp;' + formValidationObj[0].formSubmitErrorMsg;

				// Style the errorSubmitMsg
				formValidationObj[0].formSubmitErrorMsgLoc.classList.add("error-message");

			})				

		} else { // newTaskListNameInput = null
			
			console.log("Task List entered was not valid ");
			// Create log entry if failure
			// TBD

			// Insert Submit Success Message
			formValidationObj[0].formSubmitErrorMsgLoc.innerHTML = '<i class="fa fa-thumbs-o-down"></i>' + '&nbsp;' + formValidationObj[0].formSubmitErrorMsg;

			// Style the errorSubmitMsg
			formValidationObj[0].formSubmitErrorMsgLoc.classList.add("error-message");
		}

	}
	/****************************************************************************************
		FUNCTION buildAndDisplayTaskItemForm - builds the new task item form and displays it,
			modifies the nav bar and hides other parts of the UI (e.g., main page) 
		
		Trigger: User clicks the Floating PLUS symbol on main page
		
		Summary: 
			New taskItem Form "List" drop down must be populated with ListNames but 
			minus "All Lists" and "Completed" listnames
	
		UI Behavior: 
			App is really a Single Page App (SPA) where parts of the app are displayed hidden
				or shown as needed.

	****************allListsElem*************************************************************************/
	var buildAndDisplayTaskItemForm = function () {

		// Build and Display the New task form  
		appUICtrl.displayAddNewTaskForm();

	}


	return {
		// Initialize data objects and set up all event listeners


		loadAndDisplayDataOnStartup: function (taskListDb, taskItemDb, taskItemNotificationDb) {
			
			appModelController.loadDataFromDb(taskListDb, taskItemDb, taskItemNotificationDb)
				.then( function ( results ){
				var userDefinedTaskLists = appModelController.getUserDefinedTaskList();

				// Sort the userDefinedTask List
				appModelController.sortListByName(userDefinedTaskLists);


				// Update the taskListTable data structure with the latest list totals (listTotal & overDue count) 
				appModelController.updateListTaskTotals();

				// ++++++ Added so I could use in buildAndDisplayUserDefinedTaskList() method
				var currActiveListId = getListIdForActiveTaskList();

				// Build the HTML/DOM nodes for UserDefined Task List and insert in DOM for display on subMenuTaskList
				appUIController.buildAndDisplayUserDefinedTaskList(currActiveListId);

				var taskListTable = appModelController.getTaskListTable(taskListDb);

				// Update task list totals  for PreDefinedTaskListTotals and add them to DOM for display on subMenuTaskList 
				appUIController.updateAndDisplayPreDefinedTaskListTotals(taskListTable);


				// 2. Load task items

				// Find the listId of the "active" list
				var taskListId = getListIdForActiveTaskList();

				// Use taskId to gather and display all task with that ID
				var taskList_id = updateTaskListDisplayed(taskListId);

				var taskList2Display = getAllActiveMatchingTaskItemsWithId(taskList_id);
				appUIController.groupAndDisplayTaskItems(taskList2Display);

			}); 
		
		}, 

		init: function () {

			var preDefinedListNames = appModelController.getPreDefinedTaskListNames();
			var currActiveListNode = getActiveTaskList();
			var currActiveListName = appUIController.getActiveTaskListName();

			var addUserSeedData = true;
			var dbInitializationResults;			
			var initializeDbs, createIndexes, seedUserData, allPromises = []; 
			
			console.log('Application has started');

			/* If a 'taskIt' DB already exist this will return pointer to that DB otherwise
				a new empty DB will be returned.	
			*/
			appModelController.userDb = new PouchDB('userDb');
			

			/* Determine if DB already exist and if not then initialize it */
			/* If the DB is empty then we know this is the first time DB was
				created and therefore we need to initialiaze it. */
			
			appModelController.userDb.info().then(function (details) {
		
				// if there is no data in the user DB then the DB has never been started
				if (details.doc_count === 0 && details.update_seq === 0) {	
					appModelController.userDb.destroy().then(function ( results ) {
						
						
					console.log('test db removed', results);

					// Create/get pointers to Databases 
					appModelController.userDb = new PouchDB('userDb');

					appModelController.taskListDb = new PouchDB('taskListDb');

					appModelController.taskItemDb = new PouchDB('taskItemDb');

					appModelController.taskItemNotificationDb = new PouchDB ('taskItemNotificationDb')

					console.log('initializeDBs::created new databases');

					// Create indexes for Db and add system data to DBs
					var initializeSystemDbPromises = appModelController.initializeSystemDBs(appModelController.userDb, appModelController.taskListDb);

					console.log("initializeDBs::$$$initializeSystemDbPromises: ", initializeSystemDbPromises);

					var createIndexPromises = appModelController.createDbIndexes(appModelController.userDb, appModelController.taskListDb, appModelController.taskItemDb, appModelController.taskItemNotificationDb)


					console.log("initializeDBs::$$$createIndexPromises: ", createIndexPromises);


					// Adds user seed data 
					if (addUserSeedData) {						
						userSeedPromises = appModelController.addUserSeedDataToDbs(appModelController.taskListDb, appModelController.taskItemDb);
					}


					allPromises = initializeSystemDbPromises.concat(createIndexPromises,userSeedPromises);

					console.log("initializeDBs::$$$allPromises: ", allPromises);

					Promise.all(allPromises)
						.then( function (results) {	
							console.log("!!!!!!! initializeDBs::allDBInitializePromises from then()", results);
						

							// Load Data from DB and Display UI 
							appController.loadAndDisplayDataOnStartup(appModelController.taskListDb, appModelController.taskItemDb, appModelController.taskItemNotificationDb);

						})	 
						
					})
					
				} else {
					
					console.log('database already exists');
					
					// Create/get pointers to Databases 
					appModelController.userDb = new PouchDB('userDb');
					

					appModelController.taskListDb = new PouchDB('taskListDb');
					

					appModelController.taskItemDb = new PouchDB('taskItemDb');

					appModelController.taskItemNotificationDb = new PouchDB ('taskItemNotificationDb')

					appController.loadAndDisplayDataOnStartup(appModelController.taskListDb, appModelController.taskItemDb, appModelController.taskItemNotificationDb);
					
				}
			})
            ////////////////////////////////////////////////////////////////////////////
			// Only perform actions in "if" statement when the app is first initialized
//			if (!appInitialized) {
//
//				appInitialized = true;
//				console.log('Application has started');
//
//				/* 
//					Checks if DataBases have been initialized and if not it creates them,
//					generates indexes and adds seedData 
//				*/
//				
//				
//				appModelController.initializeDBs(addSeedData);
//				console.log("^^^^dbInitializationResults = ", dbInitializationResults);
				



				/********************************************************************************************************************************	
				 Now we will add "Pre-configured"/"UserDefined" task lists that were previously saved by user (now retrieved from DB)  
				 These items will be inserted/sandwiched between "Pre-set" lists. 1) "All Lists" 2) "Default" ...insert here... n) "Completed
				 Specifically they are added after the "Default" task list item, which is now .childNodes[2] node.
				*/
				setupEventListeners();
//			}
		}
	}
})(appModelController, appUIController, utilMethods);



// Main App flow
appController.init();


// Notes: TODOS for App
/* 
(1) I made need to allow data entry (maybe form submission) by allowing user to just hit enter key rather than having to click a specific button in the UI.  To do this I'll need the following logic in addition to the normal button event listener. Note: ctrlAddTaskItem is method that provides logic for 
handling the click event regardless of whether it were a button click or user hit return key. 

function ctrlAddTaskItem( ) {
	// logic to handle button click or return key press
}

document.addEventListener('keypress', function(event) {
	// Note: event.which is used to accomodate older browsers
	// 13 is value of return key press
	if (event.keyCode === 13 || event.which === 13 ) {
		ctrlAddTaskItem(); 
	}

})
*/
