/* 
	The setUpApp initializes "base values" of the application (e.g., submenu ) and loads task items    

*/

var setUpApp = (function () { 
	

//**************** INSERTED START ******************
	
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
	]

	
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
			"taskList_name" :	"All List",
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
			"taskList_name" :	"Personal",
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
			"taskList_name" :	"Finished",
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
	// Sort taskItems by Date
	taskItemsTable.sort(function compare(a, b) {
		var dateA = new Date(a.taskItem_due_date);
		var dateB = new Date(b.taskItem_due_date);
		return dateA - dateB;
		});
	
	console.log(taskItemsTable);
	
	localStorage.setItem('presetTaskListsInfo', JSON.stringify(presetTaskListsInfo));	
	var presetTaskListsStuff = JSON.parse(localStorage.getItem('presetTaskListsInfo'));
	
	// There is no pre-defined method for inserting a node after another node...so this does it. 
	function insertAfter(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}
	
	// Get DOM "handle" of Navbar Submenu container (<ul>) for task list
    var taskListsSubMenuContainer = document.querySelector(".taskListsSubMenu");
	
	
	/************************************************************************************************************************************
	* 	FUNCTION addListElementsToSubmenu - Adds Tasks list to navbar taskListSubMenu
	*   - These tasks lists include:
	*		1) "Pre-set/hard-wired task lists -  which come with app/can't be modified by user. These are as follows:
	*			"All Lists", "Default", "Completed", NewTask); New Task is harcoded in html.. 
	* .     2) "Pre-configured task lists - come with app for convenience and can be modified (incl: deleted if desired);
	* 		3) "User-defined" task list - as the name implies these are defined as needed by the user;
	*
	*	The "Pre-set" task list are positioned in nav task list SubMenu in a specific position and order
	* 	and "Pre-configured" & "User-defined" are sandwiched between them. Ordering is as follows: 
	*	1) "All Lists"; 2) "Default";....3) "Pre-configured/User-defined" lists;....N+1) "Completed"; 
	*	
	*	Because of this specific ordering and the way this function was designed the task lists are added in two separate
	* 	invocations. First the "Pre-set/hardwired" task lists are added and then "Pre-configured"/"User defined" lists
	*	added in a separate call. 
	* .  
	**************************************************************************************************************************************/
	
	function addListElementsToSubMenu(subMenuTaskList, nextNode) {
		
		// Template to create ListName elements for nav's listSubmenu
		var genericSubMenuHtml = '<li><i class="fa fa-list-ul" aria-hidden="true"></i>%listName%<span class="overDue">&nbsp%overDueCount%</span><span class="listTotal">&nbsp%dueCount%</span></li>';
		
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
	}
	
	//********************************************************************************************************************************
	//	*	First load "Pre-set" task lists into taskSubMenu. "New Tasks" already in taskSubMenu as it is already hard coded in html 
	//	*	so it will occupy .childNodes[0] position initially. "Pre-set" lists will be added before "New task" item.	 
	//********************************************************************************************************************************
	
	
		
	addListElementsToSubMenu(presetTaskListsInfo, taskListsSubMenuContainer.childNodes[0]);
	
	
	/********************************************************************************************************************************	
	 Now we will add "Pre-configured"/"UserDefined" task lists that were previously saved by user (now retrieved from DB)  
	 These items will be inserted/sandwiched between "Pre-set" lists. 1) "All Lists" 2) "Default" ...insert here... n) "Completed
	 Specifically they are added after the "Default" task list item, which is now .childNodes[2] node.
	********************************************************************************************************************************/
	
	// Get position of "Default" list item in taskListSubmenu
	var insertPoint = taskListsSubMenuContainer.childNodes[2];
	//	var firstListElement = taskListsSubMenuContainer.firstElementChild;

	// Get the 2nd default list element ("Default List") position so that we can start adding user defined list after it
//		var nextNode = firstListElement.nextElementSibling;
	addListElementsToSubMenu(userDefinedTaskListsInfo, insertPoint);
	
	
	function displayTaskItems(key, taskItemList) {
		
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
			specificTaskItemHtml = specificTaskItemHtml.replace('%listName%', taskListTable.find(getListName).taskList_name);

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
		
	} //END displayTaskItems()

	// taskList_id determines which task list items will be displayed
	var taskList_id = "1"; // When taskList_id = 1 "All task items will be displayed
	
	var listItemsToCategorize = taskItemsTable.filter(function(taskItem){
		if (taskList_id === "1") {
			return taskItem;
		} else {
			return taskItem.taskList_id === taskList_id;
		}
//		return taskItem.taskList_id === "6";
	});
	console.log(listItemsToCategorize);

	
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
	

//	var dueDateCategories = {
//		"overDue": yesterday,
//		"today": today,
//		"tomorrow": tomorrow,
//		"within1Week": within1Week,
//		"within2Weeks": within2Weeks,
//		"within1Month": within1Month,
//		"within2Months": within2Months,
//		"later": later,
//		"noDate": noDate
//	}
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
//    var genericTaskDueDateOpeningHtml ='<article><h5 class="taskCategory %overDueValue%">%taskDueDateCategory%</h5>';
//	var genericTaskDueDateClosingHtml = '</article>';
	var aTaskInGroup = false;
	
// Check to see if Array contains an object. If so it returns true otherwise false	
// https://stackoverflow.com/questions/4587061/how-to-determine-if-object-is-in-array
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}
	
/******************************************************************************** 
	Determines whether any of the task items in a list matches a grouping category 
	(e.g, "overdue"). If so then it saves those in "groupedTasks"
	Note: "groupedTasks" & "listItemsLeftToCategorize" are both global variables

**********************************************************************************/	
function groupTaskByDueDate (key, listItems) {

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
} 
	
function buildTaskDueDateHeader (key) {
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

}	
function addClosingTagToList () {
	var newNode; 
	newNode = document.createRange().createContextualFragment("</article>");
	
	mainPage.appendChild(newNode);
} // END addClosingTagToList
	/* Once you've filtered the taskItems by category (e.g., Work taskItems) you will then want
		group and display the taskItems based on their due date. An appropriate group heading (e.g., "Overdue", "Tomorrow", ) will need to be added in the HTML if there is at least one taskItem that falls into that grouping/category. Care must be take to not
	*/
function groupAndDisplayTaskItems () {
//	var dueDateCategories = {
//		"overDue": yesterday,
//		"today": today,
//		"tomorrow": tomorrow,
//		"within1Week": within1Week,
//		"within2Weeks": within2Weeks,
//		"within1Month": within1Month,
//		"within2Months": within2Months,
//		"later": later,
//		"noDate": noDate
//	}
	
	for ( key in dueDateCategories ) {
		console.log(key);
		console.log(dueDateCategories[key]);
		groupTaskByDueDate(key, listItemsToCategorize);
		if (aTaskInGroup) {
			// Build grouping a header i.e.,<article><h5></h5>
			buildTaskDueDateHeader(key); 
		}
		displayTaskItems(key,groupedTasks);
		// Insert closing article tag
		addClosingTagToList();
		
		listItemsToCategorize = listItemsLeftToCategorize;
	}
	
}
	
groupAndDisplayTaskItems();
	//**************** INSERTED END ******************
	
	
	
//****** COMMENT OUT START *******************	
//**var specificSubMenuElement, newNode;
// Generic HTML for subMenu elements with placeholders for data
//**var genericSubMenuHtml = '<li><i class="fa fa-list-ul" aria-hidden="true"></i>%listName%<span class="overDue">&nbsp%overDueCount%</span><span class="listTotal">&nbsp%dueCount%</span></li>';

// There is no predefined method for inserting elements after another element so this function was dev'd to do that.   
//**function insertAfter(newNode, referenceNode) {
//**referenceNode.parentNode.insertBefore(newNode, //**referenceNode.nextSibling);
//**}

//var List = function (name, dueCount, overDueCount) {
//	this.name = name;
//	this.count = dueCount;
//	this.overDueCount = overDueCount;
//};	
	
	
//**************************************************************************************
//
//  DATA ELEMENTS & LOAD INTO LOCAL STORAGE
//
//**************************************************************************************
// Array containing all predfinded list used in List Submenu. Currently, this List 
// is hardcoded in the HTML...but that will be changed in the future and this list will
// be used to populate the pre-defined list 
	
//**var fixedListSubmenuElements = [
//**	{	"listName": "All Lists",
//**		"overDue": 18,
//**        "total": 44
//**	}, 
	
//**	{
//**		"listName"	: "Default",
//**		"overDue"	: 4,
//**		"total" 	: 2
//**	},
	
//**	{
//**		"listName"	: "Finished",
//**		"overDue"	: 0,
//**		"total" 	: 72
//**	}

//**];
	
//**localStorage.setItem('fixedListSubmenuElements', JSON.stringify(fixedListSubmenuElements));	
	
//**var fixedListElements = JSON.parse(localStorage.getItem('fixedListSubmenuElements'));
	
//**console.log("Fixed List Items Rehydrated from local storage :");
//**console.log(fixedListElements);
	
//----Need to figure out how insert first node....process for adding first not different than other nodes.
//---- Maybe add this check document.getElementById('items').getElementsByTagName('li').length >= 1

	
//**function addListElementsToSubmenu(subList, nextNode) {
//	var genericSubMenuHtml = '<li><i class="fa fa-list-ul" aria-hidden="true"></i>%listName%<span class="overDue">&nbsp%overDueCount%</span><span class="listTotal">&nbsp%dueCount%</span></li>';
//	for (var i = 0; i < subList.length; i++) {
//		
//		// Insert the list name
//		specificSubMenuHtml = genericSubMenuHtml.replace('%listName%', localStorage.getItem(userDefinedTaskListName[i]));
//
//		// Insert the overdue task list count in HTML
//		// If count is zero you want to add class to overdue item so that 0 count and "+" sign do not appear
//		if (localStorage.getItem("overDue" + i) !== "0") {
//			specificSubMenuHtml = specificSubMenuHtml.replace('%overDueCount%', localStorage.getItem("overDue" + i));
//		} else { // Else the count is zero then don't display it (hideIt)
//		//-->		specificSubMenuHtml = specificSubMenuHtml.replace('%overDueCount%', localStorage.getItem("overDue" + i));
//			specificSubMenuHtml = specificSubMenuHtml.replace("overDue", "overDue hideIt");
//		//		addHideIt(specificSubMenuElement);
//		}
//
//		// Insert the task list count due (but not overdue) in HTML
//		if (localStorage.getItem("count" + i) !== "0") {
//			specificSubMenuHtml = specificSubMenuHtml.replace('%dueCount%', localStorage.getItem("count" + i));
//		} else { // Else the count is zero then don't display it (hideIt) 
//		//-->		specificSubMenuHtml = specificSubMenuHtml.replace('%dueCount%', localStorage.getItem("count" + i));
//			specificSubMenuHtml = specificSubMenuHtml.replace("listTotal", "listTotal hideIt");
//			//		addHideIt(specificSubMenuElement);
//		}
//
//		//* Convert HTML string into DOM node so it can be inserted
//		newNode = document.createRange().createContextualFragment(specificSubMenuHtml);
//
//		// Insert new list node after the "All List" element
//		insertAfter(newNode, nextNode);
//
//		// Now make the node we just inserted the nextNode
//		nextNode = nextNode.nextElementSibling;
//	}
//}
//		

	
// User defined list data
//**var userDefinedTaskListName = ["Personal", "Shopping", "Wishlist", "Work"];
//**var numOfTasks = [2, 1, 3, 0];
//**var overDueCount = [0, 8, 10, 18];

// Load the user defined task list names into local storage 
//**for (var i = 0; i < userDefinedTaskListName.length; i++) {
//**	localStorage.setItem(userDefinedTaskListName[i], userDefinedTaskListName[i]);
//**	localStorage.setItem("count" + i, numOfTasks[i]);
//**	localStorage.setItem("overDue" + i, overDueCount[i]);
//**}

//**************************************************************************************
//
// First two List elements are predefied in app. User defined list inserted after those two lists
// Code below identifies starting point where user defined list will start
//
//**************************************************************************************

// Parent Element <ul> of list submenu
//**var parentElement =
//**	document.querySelector(".subMenuElements");


// Get first default list element ("All List")
//**var firstListElement = parentElement.firstElementChild;

// Get the 2nd default list element ("Default List") position so that we can start adding user defined list after it
//**var nextNode = firstListElement.nextElementSibling;


//**************************************************************************************
//
// Create submenu elements and add them to drop down menu
//
//**************************************************************************************
//for (var i = 0; i < userDefinedTaskListName.length; i++) {
//
//	// Insert the list name
//	specificSubMenuHtml = genericSubMenuHtml.replace('%listName%', localStorage.getItem(userDefinedTaskListName[i]));
//
//	// Insert the overdue task list count in HTML
//	// If count is zero you want to add class to overdue item so that 0 count and "+" sign do not appear
//	if (localStorage.getItem("overDue" + i) !== "0") {
//		specificSubMenuHtml = specificSubMenuHtml.replace('%overDueCount%', localStorage.getItem("overDue" + i));
//	} else { // Else the count is zero then don't display it (hideIt)
////-->		specificSubMenuHtml = specificSubMenuHtml.replace('%overDueCount%', localStorage.getItem("overDue" + i));
//		specificSubMenuHtml = specificSubMenuHtml.replace("overDue", "overDue hideIt");
//		//		addHideIt(specificSubMenuElement);
//	}
//
//	// Insert the task list count due (but not overdue) in HTML
//	if (localStorage.getItem("count" + i) !== "0") {
//		specificSubMenuHtml = specificSubMenuHtml.replace('%dueCount%', localStorage.getItem("count" + i));
//	} else { // Else the count is zero then don't display it (hideIt) 
////-->		specificSubMenuHtml = specificSubMenuHtml.replace('%dueCount%', localStorage.getItem("count" + i));
//		specificSubMenuHtml = specificSubMenuHtml.replace("listTotal", "listTotal hideIt");
//		//		addHideIt(specificSubMenuElement);
//
//	}
//
//	//* Convert HTML string into DOM node so it can be inserted
//	newNode = document.createRange().createContextualFragment(specificSubMenuHtml);
//
//	// Insert new list none after the "All List" element
//	insertAfter(newNode, nextNode);
//
//	// Now make the node we just inserted the nextNode
//	nextNode = nextNode.nextElementSibling;
//}


})();