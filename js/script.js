//**************************************************************************************
//
//  GLOBAL VARIABLE DECLARATION
//
//  Note: As part of refactor I need to consolidate all of these
//
//**************************************************************************************


var previouslySelectedList;
var parentElem;
var initialInput = true;
var clearSearchClicked = false;
var searchExitClicked = false;
var searchIconClicked = false;
var mainPageClick = false;
var navBarClick = false;
var searchSubmitClick = false;

var homeIcon = document.getElementById('homeIcon');
var backArrowSearch = document.getElementById('backArrowSearch');
var listMenuElement = document.getElementById('taskListDropdown');
var sysMenuElement = document.querySelector('.sysMenu');
var clearSearchIcon = document.querySelector(".clearSearchIcon");
var searchInput = document.getElementById("search");
var searchIt = document.querySelector(".searchIt");
var searchForm = document.querySelector("#searches");
var searchSubmit = document.getElementById("search_submit");
var taskCategoryHeader = document.querySelectorAll(".taskCategory");
var floatAddBtn = document.querySelector(".floatAddBtn");
var mainPage = document.querySelector("#mainPage");
var navBar = document.querySelector(".navBar");
var searchString;
var userInput;
var listItemsToCategorize;



/* Removes all taskItems on screen */

function clearoutTaskItemsDisplayed () {
	console.log("In clearOutCurrentTaskList");
	
	
	var children = mainPage.children; // Returns nodeList..not an array;
	// Convert nodeList (children) to true array so I can use .forEach()
	var childrenArray = Array.prototype.slice.call(children);
	childrenArray.forEach(function(item){
    	if (item.nodeName === "ARTICLE") {
			/* Two ways to delete nodes: Directly via .remove() or via it's parent;
				Directly is more intutive but it may have browser support limitations
				Via the parent is less intuitive but more widely supported
		 	*/
			// Delete Via parent
			//	item.parentNode.removeChild(item)

			// Delete directly via .remove()
			item.remove();
		}
	});
}

/* 
	Manages steps to display a new set of task items (e.g, user choses to display a diff task list). 
*/
function updateTaskListDisplayed (taskListId) {
	
	// Clear the screen of any task previously displayed
	clearoutTaskItemsDisplayed();
	
	// Gather all taskItems related to the user selected list
	var taskList2Display = setListItemsToCategorize (taskListId); 
	
	// Group and display all tasks items and their Group header (e.g, overdue, tomorrow, etc)
	appUIController.groupAndDisplayTaskItems(taskList2Display);	
}

/* 
	Collect all tasks in the  
*/
function setListItemsToCategorize (taskList_id) {
	console.log("In setListItemsToCategorize");

	var listItemsToCategorize = appModelController.getTaskItemsTable().filter(function(taskItem){
		if (taskList_id === "1") {
			return taskItem;
		} else if (taskItem.taskList_id === taskList_id) {			
			return taskItem;
		}
	});

	console.log("Returned listItemsToCategorize: " + listItemsToCategorize );
	return listItemsToCategorize;
}


	
	var today = new Date();
	var todayYear = today.getFullYear();
	var todayMonth = today.getMonth();
	var todayDate = today.getDate();
	var todayYMD = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	
	var groupedTasks;  // Task items that match grouping criteria
	var listItemsLeftToCategorize = [] 
	
	

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
	var aTaskInGroup = false;

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

//**************************************************************************************
// Retrieve all task 
//**************************************************************************************
function getAllTasks() {
	return document.querySelectorAll(".card");
}

//**************************************************************************************
// Unhide task items that have been hidden
//**************************************************************************************
function unhideTasks() {
	console.log("----->In unhideTasks method");
	var allTasks = getAllTasks();
	allTasks.forEach(function (node) {
		if (window.getComputedStyle(node).display === "none") {
			node.style.display = "flex";
			//			console.log("Nodenode.style.display", node.style.display);
		}
	});
}

//**************************************************************************************
// Get and return all task that are not hidden (display: none)
//**************************************************************************************
function getVisibleTasks() {
	var visibleTasks = [];
	var allTasks = getAllTasks();
	allTasks.forEach(function (node) {
		if (window.getComputedStyle(node).display !== "none") {
			visibleTasks.push(node);
		}
	});
	return visibleTasks;
}
//**************************************************************************************
// Traverse current DOM node to get task and return task name
// Note: technique is very fragile need to look for more 
//**************************************************************************************
function getTaskName(task) {
	return task.childNodes[2].childNodes[1].childNodes[2].nextSibling.innerHTML.toLowerCase();
}

//**************************************************************************************
// Search for a task that match the user search criteria (userInput)
// If search criteria can't be found in the task name simply hide that task
//**************************************************************************************

function searchForMatchingTask(userInput) {
	console.log("----->In searchForMatching");
	userInput = userInput.toLowerCase();
	var taskName;
	var visibleTasks = getVisibleTasks();
	//	console.log("Visible Tasks: ", visibleTasks);
	visibleTasks.forEach(function (task) {
		taskName = getTaskName(task);
		//		console.log("TaskName: ", taskName);
		//		console.log("UserInput", userInput);
		if (taskName.indexOf(userInput) === -1) {
			task.style.display = "none";
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

function isEmpty(idValue) {
	if (document.getElementById(idValue).value.length === 0) {
		return true;
	} else {
		return false;
	}
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
	console.log("**> BlockUserClicks");
	elem.style.pointerEvents = "none";
}

function unblockUserClicks(elem) {
	console.log("**> unblockUserClicks");
	elem.style.pointerEvents = "auto";



}


// Resets the UI including navbar to original state
function resetUI2InitialState() {
	unhideTasks();
	unhideCategoryNames();
	showFloatAddBtn();
	addElement(listMenuElement);
	addElement(sysMenuElement);
	addElement(homeIcon);
	removeElement(backArrowSearch);
	removeClearSearchIcon();
	searchInput.value = "";

}

// CSS has clear search icon present so we must remove it until it is needed
removeClearSearchIcon();



//**************************************************************************************
//
// User clicks on submenu element to make it current list in Navbar
//
//**************************************************************************************
// Hardcoding childNode #'s is a brittle solution because simple changes to HTML can break this code.
// Need to find an alternative solution 

var handleSubMenuClick = function (event) {
	
	// Get name of submenu list selected
	var listNameSelected = event.target.childNodes[1].textContent.trim();
	
	function getListId(taskList) {
		//			console.log(taskListTable)
		return taskList.taskList_name === listNameSelected;
	}
	// Look up listNameSelected in taskListTable and get it's taskList_id so that we can display all tasks that with that matching id
	console.log("******** List Name:  " + listNameSelected);
	console.log("******** List Id: " + taskListId);
	var taskListId = appModelController.getTaskListTable().find(getListId).taskList_id;

	
	// Get location of List menu title 
	var listMenuTitle = listMenuElement.childNodes[2];

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
//	//  Add hideIt class so that 	
//	toggleClass(parentElem, "hideIt"); 
//	toggleClass(taskListsSubMenuContainer, "hideIt");
//	taskListsSubMenuContainer.setAttribute("style", "display: none;");
	
	
	clearoutTaskItemsDisplayed();
	updateTaskListDisplayed (taskListId);


};


//**************************************************************************************
//
// HANDLE SEARCH FOCUS:
// This function is called when the SearchIcon is clicked and Search input receives focus
//
//**************************************************************************************

var handleSearchFocus = function (event) {
	console.log("----->In handleSearchFocus function");
	console.log("==> event.target", event.target);

	//	searchSubmit.onmousedown = new function ("return false");
	searchIconClicked = true;

	// Show original Nav bar settings if user clicked somewhere other than clearSearchIcon
	// Note: if the user clicked the clear search icon then you want the original Navbar elements to remain hidden (hence no else condition)
	if (!clearSearchClicked) {

		// Hide (via display:none) other elements of Navbar so Search is focus 
		removeElement(listMenuElement);
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
		blockUserClicks(searchSubmit);
		//		toggleClass(searchSubmit, "noPointerEvents");

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
	// function. This was the only solution I couldfind on StackOverflow for this "well-known" //problem. 


	setTimeout(function () {

		console.log("----->SetTimeout function", document.activeElement);
		console.log("SearchExitClicked value: ", searchExitClicked);
		console.log("clearSearchClicked: ", clearSearchClicked);
		console.log("mainPageClicked: ", mainPageClick);
		console.log("navBarClicked: ", navBarClick);
		//		console.log("clearSearchClicked value: ", clearSearchClicked);
		// If the user click on something other than the clearSearch icon you want to restore orig navBar elements.
		if (searchExitClicked) {

			searchExitClicked = false;

			// Reset UI to initiat state
			resetUI2InitialState();
			//			toggleClass(searchSubmit, "noPointerEvents");
			unblockUserClicks(searchSubmit);

		} else if (clearSearchClicked) {
			clearSearchClicked = false;

			// Clicked outside input area but didn't click searchExitIcon. Need to make sure 
			// that you hide clearSearchIcon if user started entering search criteria
			hideClearSearchIcon();
			//			searchInput.focus();
		} else if (searchSubmit) {
			searchSubmitClick = false;
			blockUserClicks(searchSubmit);
//			searchInput.focus();
		} else if (navBarClick) {
			navBarClick = false;
			blockUserClicks(navBar);
//						searchInput.focus();
		} else if (mainPageClick) {
			mainPageClick = false;
			//			searchInput.focus();
		} else {
			//			blockUserClicks(searchSubmit);
			// TEST to see if I can make focus stay on input area
			//			toggleClass(searchSubmit, "noPointerEvents");
			//			setTimeout(function () {
			//				searchInput.focus();
			//			}, 10);

		}
	}, 200);
};

//**************************************************************************************
//
// DETECT SEARCH INPUT
// Called on "keyUp" event...so it's called after something has been entered in the search box
//
//**************************************************************************************


function deleteKey(event) {
	console.log("----->In deleteKey function")
	var key = event.keyCode || event.charCode;
	if (key == 8 || key == 46)
		return true;
	else {
		return false;
	}
}

function hideCategoryNames() {
	console.log("----->In hideCategoryNames function");
	taskCategoryHeader.forEach(function (categoryHeader) {
		categoryHeader.style.display = "none";
	});
}

function unhideCategoryNames() {
	console.log("----->In UnhideCategoryNames function");
	taskCategoryHeader.forEach(function (categoryHeader) {
		categoryHeader.style.display = "inline-block";
	});
}

var detectSearchInput = function (event) {
	console.log("----->In DetectSearchInput function");

	// At this point at least one keystroke has been entered..if there is only one keystroke
	// then you know it was previously empty and this is the first character entered and thus
	// the clearSearchIcon should be displayed


	if (searchInput.value.length === 1) {
		addClearSearchIcon();
		showClearSearchIcon();

		hideCategoryNames();
		if (deleteKey(event)) {
			unhideTasks();
		}
		searchForMatchingTask(searchInput.value);

	} else if (isEmpty("search")) {
		hideClearSearchIcon();
		unhideTasks();
		unhideCategoryNames();

	} else { // Not first character and not empty
		// if keystroke is delete key need to reset task that may have been previously hidden
		if (deleteKey(event)) {
			unhideTasks();
		}
		searchForMatchingTask(searchInput.value);
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

	unhideTasks();
	unhideCategoryNames();
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

//TEST
var disableSearchSubmit = function (event) {
	console.log("----->DisableSearchSubmit");
	//	blockUserClicks(searchSubmit);
	//		toggleClass(searchSubmit, "noPointerEvents");
	//			setTimeout(function () {
	//				searchInput.focus();
	//			}, 12);
};


var handleMainPageClicks = function (event) {
	console.log("------>HandleMainPageClicks");
	mainPageClick = true;
};

var handleNavBarClicks = function (event) {
	console.log("------>HandleNavBarClicks");
//	blockUserClicks(navBar);
	navBarClick = true;

};



//************************
//	fnSaveNewTask()
//************************
function fnSaveNewTask(event) {
	event.preventDefault(); 
	
}




//$('#datepicker').datepicker();

// Note: that the taskItController & uiControllers are designed to be independent.
// This is done so that for example you can expand the capabilities of the
// taskItController without affecting the UI.
//**************************************************************************************
//
// TASKIT DATA MODEL CONTROLLER 
//
//**************************************************************************************

var appModelController = (function () {
	

	var presetTaskListsInfo = [
		{
			"listName" : "All List",
			"overDue"  : 22, 
			"totalTasks": 74			
		},
		{
			"listName" : "Default",
			"overDue"  : 2, 
			"totalTasks": 12			
		},
		{
			"listName" : "Completed",
			"overDue"  : 3, 
			"totalTasks": 22			
		}
	];
		var userDefinedTaskListsInfo = [
		{
			"listName" : "Shopping",
			"overDue"  : 5, 
			"totalTasks": 8		
		},
		{
			"listName" : "Work",
			"overDue"  : 2, 
			"totalTasks": 19			
		},
		{
			"listName" : "School",
			"overDue"  : 3, 
			"totalTasks": 6			
		},
//		{
//			"listName" : "Home Projects",
//			"overDue"  : 3, 
//			"totalTasks": 12			
//		}
	]
	
	var userTable = [
		{
			"user_id" : "1",
			"user_name" : "Jet Martin",
			"user_password": "123"
		}
	];
	
	var taskListTable = [
		{
			"taskList_id" : "1",
			"user_id" : "1",
			"taskList_name" :	"All Lists",
			"taskList_totalCount" : 44,
			"taskList_overDueCount" : 18, 
			"taskList_createTime": "",
			"taskList_isArchived": ""
		},
		{
			"taskList_id" : "2",
			"user_id" : "1",
			"taskList_name" :	"Default",
			"taskList_totalCount" : 4,
			"taskList_overDueCount" : 2, 
			"taskList_createTime": "",
			"taskList_isArchived": ""
		},
		{
			"taskList_id" : "3",
			"user_id" : "1",
			"taskList_name" :	"School",
			"taskList_totalCount" : 2,
			"taskList_overDueCount" : 0, 
			"taskList_createTime": "",
			"taskList_isArchived": ""
		},
		{
			"taskList_id" : "4",
			"user_id" : "1",
			"taskList_name" :	"Shopping",
			"taskList_totalCount" : 8,
			"taskList_overDueCount" : 1, 
			"taskList_createTime": "",
			"taskList_isArchived": ""
		}, 
		{
			"taskList_id" : "5",
			"user_id" : "1",
			"taskList_name" :	"Wish List",
			"taskList_totalCount" : 10,
			"taskList_overDueCount" : 3, 
			"taskList_createTime": "",
			"taskList_isArchived": ""
		},
		{
			"taskList_id" : "6",
			"user_id" : "1",
			"taskList_name" :	"Work",
			"taskList_totalCount" : 18,
			"taskList_overDueCount" : 0, 
			"taskList_createTime": "",
			"taskList_isArchived": ""
		},
		{
			"taskList_id" : "7",
			"user_id" : "",
			"taskList_name" :	"Completed",
			"taskList_totalCount" : 72,
			"taskList_overDueCount" : 0, 
			"taskList_createTime": "",
			"taskList_isArchived": ""
		}
		
	];
	var taskItemsTable = [
		{
			"taskItem_id" : "1",
			"taskList_id" : "6",
			"taskItem_title": "Task item 1.0",
			"taskItem_description": "", 
			"taskItem_due_date": "2018-03-01 15:30",
			"taskItem_due_time": "5:00pm",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "2",
			"taskList_id" : "3",
			"taskItem_title": "Task item 2",
			"taskItem_description": "", 
			"taskItem_due_date": "",
			"taskItem_due_time": "12:00pm",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "3",
			"taskList_id" : "4",
			"taskItem_title": "Task item 2.1",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-11-21 23:55",
			"taskItem_due_time": "5:00pm",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "weekly", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "4",
			"taskList_id" : "3",
			"taskItem_title": "Task item 2.2",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-11-25 11:00",
			"taskItem_due_time": "9:00am",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "5",
			"taskList_id" : "5",
			"taskItem_title": "Task item 3",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-11-14 12:00",
			"taskItem_due_time": "2:00pm",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "6",
			"taskList_id" : "6",
			"taskItem_title": "Task item 3.1",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-11-17 14:00",
			"taskItem_due_time": "4:00pm",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "7",
			"taskList_id" : "6",
			"taskItem_title": "Task item 4",
			"taskItem_description": "", 
			"taskItem_due_date": "2018-01-12 17:00",
			"taskItem_due_time": "12:00pm",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "daily", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "8",
			"taskList_id" : "6",
			"taskItem_title": "Task item 4.1",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-12-12 17:00",
			"taskItem_due_time": "7:00pm",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "monthly", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "9",
			"taskList_id" : "2",
			"taskItem_title": "Task item 5",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-12-15 17:00",
			"taskItem_due_time": "6:00pm",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "10",
			"taskList_id" : "5",
			"taskItem_title": "Task item 5.1",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-11-16 17:00",
			"taskItem_due_time": "3:00pm",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "none", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "11",
			"taskList_id" : "3",
			"taskItem_title": "Task item 6",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-11-17 17:00",
			"taskItem_due_time": "5:00pm",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "12",
			"taskList_id" : "5",
			"taskItem_title": "Task item 6.1",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-11-22 17:30",
			"taskItem_due_time": "",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "13",
			"taskList_id" : "2",
			"taskItem_title": "Task item 7",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-11-23 17:30",
			"taskItem_due_time": "",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		},
		{
			"taskItem_id" : "14",
			"taskList_id" : "2",
			"taskItem_title": "Task item 7.1",
			"taskItem_description": "", 
			"taskItem_due_date": "2017-11-30 10:30",
			"taskItem_due_time": "",		
			"taskItem_priority": "",
			"taskItem_status": "",
			"taskItem_isCompleted": "",
			"taskItem_repeat": "", 
			"taskItem_isArchived": "",
			"taskItem_notification": "",
			"taskItem_calendar": "",
			"taskItem_createTime": ""	
		}
	];
	return {
		getPresetTaskListInfo: function() {
			return presetTaskListsInfo;
		},
		getUserDefinedTaskListInfo: function() {
			return userDefinedTaskListsInfo
		},
		getTaskItemsTable: function(){
//			var taskItemsTable = [];
			return taskItemsTable;
		},
		getTaskListTable: function() {
			return taskListTable;
		}
	}
})();


//**************************************************************************************
//
// TASKIT UI CONTROLLER
//
//**************************************************************************************
// Examples of tasks:
// 1: Define Methods to Return values entered in via the UI 
// 

var appUIController = (function () {
	var DOMstrings = {

	};
	
	// There is no pre-defined method for inserting a node after another node...so this does it. 
	function insertAfter(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}

	
	function containsObject(obj, list) {
		var i;
		for (i = 0; i < list.length; i++) {
			if (list[i] === obj) {
				return true;
			}
		}

		return false;
	} // END containsObject()
	
	return {
		getNewTaskInputData: function (event) {
			console.log("The Event is: " + event);
			event.preventDefault();
			return {
				taskTitle: document.querySelector('#inTaskTitle').value,
				taskDueDate: document.querySelector('#inTaskDueDate').value,
				taskDueTime: document.querySelector('#inTaskTimeDue').value,
				// Option values: None, Daily, Weekly, Monthly, Yearly 
				taskRepeatOption:
				document.querySelector('#inTaskRepeatOption').value
			}
		},
		addListInfoToMenu: function (subMenuTaskList, nextNode) {
			// Template to create ListName elements for nav's listSubmenu
			var genericSubMenuHtml = '<li><i class="fa fa-list-ul" aria-hidden="true"></i>%listName%<span class="overDue">&nbsp%overDueCount%</span><span class="listTotal">&nbsp%dueCount%</span></li>';

			
			// Sort all List alphabetically
			subMenuTaskList.sort(function(a, b) {
			  var nameA = a.listName.toUpperCase(); // ignore upper and lowercase
			  var nameB = b.listName.toUpperCase(); // ignore upper and lowercase
			  if (nameA < nameB) {
				return -1;
			  }
			  if (nameA > nameB) {
				return 1;
			  }

			  // names must be equal
			  return 0;
			});
			
			for (var i = 0; i < subMenuTaskList.length; i++) {	

				// Insert the list name in HTML
				specificSubMenuHtml = genericSubMenuHtml.replace('%listName%', subMenuTaskList[i].listName);

				// Insert the overdue task list count in HTML
				// If count is zero you want to add class to overdue item so that 0 count and "+" sign do not appear
				if (subMenuTaskList[i].overDue !== "0") {
					specificSubMenuHtml = specificSubMenuHtml.replace('%overDueCount%', subMenuTaskList[i].overDue);
				} else { // Else the count is zero then don't display it (hideIt)
					specificSubMenuHtml = specificSubMenuHtml.replace("overDue", "overDue hideIt");
				}

				// Insert the total task list count due (excluding overdue tasks count) in HTML
				if (subMenuTaskList[i].totalTasks !== "0") {
					specificSubMenuHtml = specificSubMenuHtml.replace('%dueCount%', subMenuTaskList[i].totalTasks);
				} else { // Else the count is zero then don't display it (hideIt) 
					specificSubMenuHtml = specificSubMenuHtml.replace("listTotal", "listTotal hideIt");
				}

				//* Convert completed HTML string into DOM node so it can be inserted
				newNode = document.createRange().createContextualFragment(specificSubMenuHtml);

				// Insert new node into taskListsubmenu
				insertAfter(newNode, nextNode);

				// Now make the node we just inserted the nextNode so that other nodes will be inserted after it
				nextNode = nextNode.nextElementSibling;
			}
		
		}, // END addListInfoToMenu
		displayTaskItems: function (key, taskItemList) {
			/*******************************************************************************
			 Build Tasks to display on screen
			*********************************************************************************/

			// Global variable whose value is set in for loop below
			var taskListId;
			var taskGroup = document.getElementById(key);
			var specificTaskItemHtml, newNode;


			// Callback function for .find(). Returns the taskListTable object with matching taskListId 
			// Similar to example provided MDN webdocs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
			function getListName(taskList) {
	//			console.log(taskListTable)
				return taskList.taskList_id === taskListId;
			}

			var mainPage = document.getElementById("mainPage"); 
			var repeatSymbol = '<i class="fa fa-repeat taskDetails floatLeft" aria-hidden="true"></i>';

			var genericTaskItemHtml = '<div class="card"><a href="editTask.html"><div class="card-block"><div><a data-toggle="modal" data-target="#markCompleteConfirmModal"><label class="checkBoxLabel"><input class="checkbox" type="checkbox" id="" name="taskTitle" value="taskTitle">Completed?</label></a><span class="card-subtitle mb-2 text-muted" for="">%taskTitle%</span></div><h6 class="card-text taskDue floatLeft">%date%</h6>%repeatSymbol%<h6 class="taskListName clearBoth">%listName%</h6></div></a></div>'

			for (var i = 0; i < taskItemList.length; i++) {
				// Insert the list name in HTML
				specificTaskItemHtml = genericTaskItemHtml.replace('%taskTitle%', taskItemList[i].taskItem_title);

				specificTaskItemHtml = specificTaskItemHtml.replace('%date%', taskItemList[i].taskItem_due_date);
				specificTaskItemHtml = specificTaskItemHtml.replace('%time%', taskItemList[i].taskItem_due_time);


				if (taskItemList[i].taskItem_repeat === "none" || taskItemList[i].taskItem_repeat  === "") {
					specificTaskItemHtml = specificTaskItemHtml.replace('%repeatSymbol%', "");
				} else {
					specificTaskItemHtml = specificTaskItemHtml.replace('%repeatSymbol%', repeatSymbol);
				}

				// Save the taskListId from the current taskItem..Will use this in find() callback function
				taskListId = taskItemList[i].taskList_id;

				// Get the name of task list by doing lookup of task_id in taskListTable 
				specificTaskItemHtml = specificTaskItemHtml.replace('%listName%', appModelController.getTaskListTable().find(getListName).taskList_name);

				//* Convert completed HTML string into DOM node so it can be inserted
				newNode = document.createRange().createContextualFragment(specificTaskItemHtml);


			//		if(tasksArea.childElementCount !== 0)  {
			//			// Insert new node into taskListsubmenu
			//			insertAfter(newNode, nextNode);
			//		} else {
			//			var nextNode = tasksArea.appendChild(newNode);
			//		}
				taskGroup.appendChild(newNode);
				// Now make the node we just inserted the nextNode so that other nodes will be inserted after it
			//		nextNode = nextNode.nextElementSibling;
			}

		}, //END displayTaskItems()
		buildTaskDueDateHeader: function (key) {
			var genericTaskDueDateHeader ='<article id="%key%"><h5 class="taskCategory %overDueAttr%">%taskDueDateCategory%</h5>';
			var specificDueDateHeader;
			var newNode;
			specificDueDateHeader = genericTaskDueDateHeader.replace("%key%",key);
			if (key === "overDue") {
				specificDueDateHeader = specificDueDateHeader.replace("%overDueAttr%", "overDue");
			} else {
				specificDueDateHeader = specificDueDateHeader.replace("%overDueAttr%", "");
			}
			specificDueDateHeader = specificDueDateHeader.replace('%taskDueDateCategory%', dueDateCategories[key].categoryLabel);
			//* Convert completed HTML string into DOM node so it can be inserted
			newNode = document.createRange().createContextualFragment(specificDueDateHeader);

			mainPage.appendChild(newNode);

		},	// End buildTaskDueDateHeader
		addClosingTagToList: function () {
			var newNode; 
			newNode = document.createRange().createContextualFragment("</article>");
			mainPage.appendChild(newNode);
		}, // END addClosingTagToList
		
		/******************************************************************************** 
			METHOD: groupTaskByDueDate()
			Determines whether any of the task items in a list matches a grouping category 
			(e.g, "overdue"). If so then it saves those in "groupedTasks"
			Note: "groupedTasks" & "listItemsLeftToCategorize" are both global variables
		**********************************************************************************/	
		groupTaskByDueDate: function (key, listItems){
			// Identify all taskItems in list that match grouping dueDate
			// All matching task are saved in groupedTasks
			aTaskInGroup = false;
			groupedTasks = listItems.filter(function(taskItem){
				if (key === "later") { 
					console.log(taskItem);
					var x = 1;
				}
				if (taskItem.taskItem_due_date !== "") {
					// Convert the taskItem_due_date into Date object so that it can be compared to date for grouping criteria
					taskDueDate = new Date(taskItem.taskItem_due_date);
					console.log("Task Due Date: " + taskDueDate);
					taskDueDateYMD = new Date (taskDueDate.getFullYear(), 
										   taskDueDate.getMonth(),
										   taskDueDate.getDate());
				} else {
					taskDueDateYMD = "";
					console.log("Due Date is empty");
					console.log(taskItem.taskItem_title,  taskItem.taskItem_due_date);
				} 	
				/* Using JSON.stringify to easly see if objects are equal without having to do "deep" comparison of all properties. This technique works on simple objects (e.g., no methods)
				*/

				if (((taskDueDateYMD === "" ) && (key === "noDate"))
				|| ((taskDueDateYMD !== "") &&  (JSON.stringify(taskDueDateYMD) <= JSON.stringify(dueDateCategories[key].dueDate))) )	{

					aTaskInGroup = true;
					/* If the current taskItem matches the grouping criteria (date) then check to see if the task is in list of items left to categorize ("listItemsLeftToCategorize")..if so then remove it from that list (by filtering it) so we don't continue to check for matches 
					*/
					if (containsObject(taskItem, listItemsLeftToCategorize)) {
						// Remove the taskItem by filtering out the taskItem by it's id. 
						listItemsLeftToCategorize = listItemsLeftToCategorize.filter(function(el) {
							return el.taskItem_id != taskItem.taskItem_id; }); 
					}

					return taskItem; 


				} else { 
					/* Else taskItem_due_date doesn't match this particular grouping criteria so 
					we'll need to retain the task for comparison with the next grouping criteria 
					*/
					if (!containsObject(taskItem, listItemsLeftToCategorize )) {
						listItemsLeftToCategorize.push(taskItem);
					}
				}

			});
			
		}, //END groupTaskByDueDate()
		
		
		/**********************************************************************************************
			METHOD: groupAndDsiplayTaskItems()
			Once you've filtered the taskItems by category (e.g., Work taskItems) you will then want
			group and display the taskItems based on their due date. An appropriate group heading (e.g., "Overdue", "Tomorrow", ) will need to be added in the HTML if there is at least one taskItem that falls into that grouping/category. Care must be take to not
		**********************************************************************************************/	
		groupAndDisplayTaskItems: function (listItemsToCategorize) {
			for ( key in dueDateCategories ) {
				console.log(key);
				console.log(dueDateCategories[key]);
				appUIController.groupTaskByDueDate(key, listItemsToCategorize);
				if (aTaskInGroup) {
					// Build grouping a header i.e.,<article><h5></h5>
					appUIController.buildTaskDueDateHeader(key); 
				}
				appUIController.displayTaskItems(key,groupedTasks);
				// Insert closing article tag
				appUIController.addClosingTagToList();

				listItemsToCategorize = listItemsLeftToCategorize;
			}
		} // END groupAndDisplayTaskItems
	} 

})();



// AppController connects the taskItModel and UIcontrollers together;
// It wasn't necessary to pass other controllers in as params but doing so
// creates more independence and separation of control. Also note that 
// taskIt and ui controller param names are slightly diff than names of these controllers

//**************************************************************************************
//
// TASKIT APP CONTROLLER
//
//**************************************************************************************

var appController = (function (appModelCtrl, appUICtrl) {
	var setupEventListeners = function () {


		// EventListener for List Submenu 
		var taskList_id = document.querySelector(".taskListsSubMenu").addEventListener('click', handleSubMenuClick);
		

		// Event Listeners for Search 
		searchInput.addEventListener("focus", handleSearchFocus);
		searchInput.addEventListener("blur", handleSearchBlur);
		searchInput.addEventListener("keyup", detectSearchInput);
		clearSearchIcon.addEventListener("click", clearSearchField);
		backArrowSearch.addEventListener("click", exitSearch);
		mainPage.addEventListener("click", handleMainPageClicks);
		navBar.addEventListener("click", handleNavBarClicks);


		// TEST  -- Need to figure out if this is still needed
		searchSubmit.addEventListener("mousedown", disableSearchSubmit);
		
		
		// Event Listener for Adding a Task 
		//**		var newTaskForm = document.querySelector("#formSaveNewTask").addEventListener('submit', function(event) { appUICtrl.getNewTaskInputData(event);});

	}
	
	// Save new task list input
//	var newTaskInput = appUICtrl.getNewTaskInputData(event);
	
	
//	console.log(newTaskInput);
	return {
		// Initialize data objects and set up all event listeners
		init: function () {
			console.log('Application has started');
			// Load data into app
			// 1. Load task list
			/********************************************************************************************************************************
				*	First load "Pre-set" task lists into taskSubMenu. "New Tasks" already in taskSubMenu as it is already hard coded in html 
				*	so it will occupy .childNodes[0] position initially. "Pre-set" lists will be added before "New task" item.	 
			********************************************************************************************************************************/
//			appUIController.addListInfoToMenu(appModelController.getPresetTaskListInfo(), taskListsSubMenuContainer.childNodes[0]);
			
			/********************************************************************************************************************************	
			 Now we will add "Pre-configured"/"UserDefined" task lists that were previously saved by user (now retrieved from DB)  
			 These items will be inserted/sandwiched between "Pre-set" lists. 1) "All Lists" 2) "Default" ...insert here... n) "Completed
			 Specifically they are added after the "Default" task list item, which is now .childNodes[2] node.
			********************************************************************************************************************************/

			// Get the 2nd default list element ("Default List") position so that we can start adding user defined list after it
			
			var listInsertPoint = document.getElementById("listInsertPoint");
			appUIController.addListInfoToMenu(appModelController.getUserDefinedTaskListInfo(), listInsertPoint);
				
			// 2. Load task items
			var taskList_id = "1";
			var taskList2Display = setListItemsToCategorize (taskList_id); 
			appUIController.groupAndDisplayTaskItems(taskList2Display);
			setupEventListeners();
		}
	};
})(appModelController, appUIController);

// Main App flow
appController.init();

// Notes: TODOS for App
/* 
(1) I made need to allow data entry (maybe form submission) by allowing user to just hit enter key rather than having to click a specific button in the UI.  To do this I'll need the following logic in addition to the normal button event listener. Note: ctrlAddItem is method that provides logic for 
handling the click event regardless of whether it were a button click or user hit return key. 

function ctrlAddItem( ) {
	// logic to handle button click or return key press
}

document.addEventListener('keypress', function(event) {
	// Note: event.which is used to accomodate older browsers
	// 13 is value of return key press
	if (event.keyCode === 13 || event.which === 13 ) {
		ctrlAddItem(); 
	}

})
-- Event listener for button click would be as follows:
document.querySelector('.add_btn').addEventListener('click', crlAddItem)

====> Method to generate "unique id" https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
var uniqueId = Math.random().toString(36).substring(2) 
               + (new Date()).getTime().toString(36);

*/
