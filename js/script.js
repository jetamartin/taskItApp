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


})(taskItController, uiController);
