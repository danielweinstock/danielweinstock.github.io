/* --------- dispatch/index --------- */
/* --------- /js/context.js --------- */
/* 
 * Context.js
 * Copyright Jacob Kelley
 * MIT License
 */
var contextMenuClickedId = '';
var contextMenuClickedDate = '';
var contextMenuClickedIdChild = '';
var contextMenuClickedPosition;
var contextMenuClickedObj;
var context = context || (function () {
    
	var options = {
		fadeSpeed: 100,
		filter: function ($obj) {
			// Modify $obj, Do not return
		},
		above: 'auto',
		preventDoubleContext: true,
		compress: false
	};

	function initialize(opts) {
		
		options = $.extend({}, options, opts);
		
		$(document).on('click', 'html', function () {
			$('.dropdown-context').fadeOut(options.fadeSpeed, function(){
				$('.dropdown-context').css({display:''}).find('.drop-left').removeClass('drop-left');
			});
		});
		if(options.preventDoubleContext){
			$(document).on('contextmenu', '.dropdown-context', function (e) {
				e.preventDefault();
			});
		}
		$(document).on('mouseenter', '.dropdown-submenu', function(){
			var $sub = $(this).find('.dropdown-context-sub:first'),
				subWidth = $sub.width(),
				subLeft = $sub.offset().left,
				collision = (subWidth+subLeft) > window.innerWidth;
			if(collision){
				$sub.addClass('drop-left');
			}
		});
		
	}

	function updateOptions(opts){
		options = $.extend({}, options, opts);
	}

	function buildMenu(data, id, subMenu) {
		var subClass = (subMenu) ? ' dropdown-context-sub' : '',
			compressed = options.compress ? ' compressed-context' : '',
			$menu = $('<ul class="dropdown-menu dropdown-context' + subClass + compressed+'" id="dropdown-' + id + '"></ul>');
        var i = 0, linkTarget = '';
        for(i; i<data.length; i++) {
        	if (typeof data[i].divider !== 'undefined') {
				$menu.append('<li class="divider"></li>');
			} else if (typeof data[i].header !== 'undefined') {
				$menu.append('<li class="nav-header">' + data[i].header + '</li>');
			} else {
				if (typeof data[i].href == 'undefined') {
					data[i].href = '#';
				}
				if (typeof data[i].target !== 'undefined') {
					linkTarget = ' target="'+data[i].target+'"';
				}
				if (typeof data[i].subMenu !== 'undefined') {
					$sub = ('<li class="dropdown-submenu"><a tabindex="-1" href="' + data[i].href + '">' + data[i].text + '</a></li>');
				} else {
					$sub = $('<li><a tabindex="-1" href="' + data[i].href + '"'+linkTarget+'>' + data[i].text + '</a></li>');
				}
				if (typeof data[i].action !== 'undefined') {
					var actiond = new Date(),
						actionID = 'event-' + actiond.getTime() * Math.floor(Math.random()*100000),
						eventAction = data[i].action;
					$sub.find('a').attr('id', actionID);
					$('#' + actionID).addClass('context-event');
					$(document).on('click', '#' + actionID, eventAction);
				}
				$menu.append($sub);
				if (typeof data[i].subMenu != 'undefined') {
					var subMenuData = buildMenu(data[i].subMenu, id, true);
					$menu.find('li:last').append(subMenuData);
				}
			}
			if (typeof options.filter == 'function') {
				options.filter($menu.find('li:last'));
			}
		}
		return $menu;
	}

	function addContext(selector, data) {
		
		var d = new Date(),
			id = d.getTime(),
			$menu = buildMenu(data, id);
			
		$('body').append($menu);
		
		
		$(document).on('contextmenu', selector, function (event) {
			event.preventDefault();
			event.stopPropagation();

			if(event.target.nodeName=='STRONG'){
				contextMenuClickedIdChild = $(event.target).parent().parent().attr('id');
			}
			if(event.target.nodeName=='P'){
				contextMenuClickedIdChild = $(event.target).parent().parent().parent().attr('id');
			}

			contextMenuClickedId = event.target.id;
			if(!contextMenuClickedId) {
				contextMenuClickedId = $(event.target).parents('[id]').filter(function (i) {
					return $(this).attr('id').length > 0;
				});
				if(contextMenuClickedId.length)
					contextMenuClickedId = contextMenuClickedId[0].getAttribute('id');
				else
					contextMenuClickedId = '';
			}
			contextMenuClickedObj = event.target;
			contextMenuClickedPosition = [event.clientX,event.clientY];
			if($(event.target).children().length>0){
				contextMenuClickedObjTemp = $(event.target).children()[1];
				contextMenuClickedObj = $(contextMenuClickedObjTemp).children()[0];
				if(contextMenuClickedObj == undefined){
					contextMenuClickedObjTemp = $(event.target).children()[0];
					contextMenuClickedObjTemp = $(contextMenuClickedObjTemp).children()[1];
					contextMenuClickedObj = $(contextMenuClickedObjTemp).children()[0];
					if(contextMenuClickedObj == undefined)
						contextMenuClickedObj = event.target;
				}
			}
			$('.dropdown-context:not(.dropdown-context-sub)').hide();

			$dd = $('#dropdown-' + id);
			if (typeof options.above == 'boolean' && options.above) {
				$dd.addClass('dropdown-context-up').css({
					top: event.pageY - 20 - $('#dropdown-' + id).height(),
					left: event.pageX - 13
				}).fadeIn(options.fadeSpeed);
			} else if (typeof options.above == 'string' && options.above == 'auto') {
				$dd.removeClass('dropdown-context-up');
				var autoH = $dd.height() + 12;
				if ((event.pageY + autoH) > $('html').height()) {
					$dd.addClass('dropdown-context-up').css({
						top: event.pageY - 20 - autoH,
						left: event.pageX - 13
					}).fadeIn(options.fadeSpeed);
				} else {
					$dd.css({
						top: event.pageY + 10,
						left: event.pageX - 13
					}).fadeIn(options.fadeSpeed);
				}
			}
		});
	}
	
	function destroyContext(selector) {
		$(document).off('contextmenu', selector).off('click', '.context-event');
	}
	
	return {
		init: initialize,
		settings: updateOptions,
		attach: addContext,
		destroy: destroyContext
	};
})();

/* --------- /js/dispatch-grid.js --------- */
/*
 * author Binoy Venugopal
 *
 * Class used to create grid
 *
 */
function DispatchGrid()
{
	// Parent div id
	this.parent = null;
	// Date to be shown
	//this.date = new Date();
	// Time format
	//this.timeFormat = '12';
	// Main container width
	this.containerWidth = '100%';
	// Main container height
	this.containerHeight = '100%';
	// Whether to collapse the left menu rows to a single row
	this.collapseLeftRows = false;
	// Whether to hide the top menu
	this.hideTopMenu = false;
	// Top menu height
	this.topMenuHeight = '30px';
	// Top menu min width
	this.topMenuMinWidth = '656px';
	// Top menu left submenu width
	this.topMenuLeftWidth = '222px';
	// Top menu right submenu width
	this.topMenuRightMinWidth = '400px';
	// Left menu height
	this.leftMenuHeight = '200px';
	// Left menu width
	this.leftMenuWidth = '222px';
	// Main content area height
	this.contentAreaHeight = '200px';
	// Main content area width
	this.contentAreaMinWidth = '400px';
	// Row height
	this.rowHeight = '40px';
	// Event height
	this.rowEventHeight = '34px';
	// Column width
	this.columnWidth = '30px';
	//table width
	this.tableWidth = '1584px';
	// Each row values object
	this.rowValues = [];
	// grid backgrouund color
	this.gridBackgroundColor = '';
	// Default worker status color
	this.defaultStatusColor = '#6c6c6c';
	// Default unscheduled status color
	this.defaultUnColor = '#ff0000';
	// Default event color
	this.eventColor = 'blue';
	// Deafult event font color
	this.eventFontColor = '#FFFFFF';
	// Boolean used to manage assigned and unassigned
	this.unAssigned = false;
	this.unAssignedString = 'false';
	// Boolean used to decide whether we have to update the event
	this.updateEvent = false;
	// Update drag function
	this.updateDragFunction;

	this.lineNos = 2;

	this.view = 'D';
	this.dailyGridLayout = '24';

	// Each row values unique user id
	//this.rowValues.userId = null;
	// Each row values user details object
	//this.rowValues.userDetails = [];
	// Each row values user events object
	//this.rowValues.userEvents = [];

	// Dropped columns array
	this.droppedCols = [];
	this.droppedHoveredCols = [];
	// Events present area....Not using now
	this.eventPresentArea = [];

	this.jobStatuses = [];

	this.columnDates = [];

	// Promises to call this.bindEvents() only after full redraw
	this.promises = [];
    this.rescheduleMessages = {
        time: {
            "10_CMP": "This job is completed so could not change time.",
            "default": "This job is in progress so time or date cannot be changed.",
            "estimate": "Time or date of this estimate cannot be changed."
        },
        tech: {
            "10_CMP": "This technician is Completed the job so cannot be unassigned from this job.",
            "05_OTW":"This technician is currently On The Way and cannot be unassigned from this job. Please change the status before attempting to unassign again.",
            "08_PAU":"This technician is currently Pause and cannot be unassigned from this job. Please change the status before attempting to unassign again.",
            "default":"This job is in progress and technician cannot be unassigned from it. Please change the status before attempting to unassign again.",
            "estimate":"Technician cannot be unassigned from estimates according to \"drag & drop\" settings in company preferences.",
			"CLOSED":"This job is closed and technician cannot be unassigned from it. Please reopen it change the status before attempting to unassign again.",
			"OPEN_ACTIVE":"This job is in progress and technician cannot be unassigned from it. Please change the status before attempting to unassign again.",
        },
    };
    this.displayRescheduleMessages = function(jobCode, code) {
        let txt = code === 'ESTIMATE' ? this.rescheduleMessages.tech.estimate : this.rescheduleMessages.tech.default;
        if(this.rescheduleMessages.tech.hasOwnProperty(jobCode))
            txt = this.rescheduleMessages.tech[jobCode];
        $.msgbox(txt);
    }
	/**
	 * Function which creates the grid. Grid heading,grid rows,grid columns are created from this method.
	 */
	this.createGrid = function () {
		let gridObj = this;

		if (!$('#' + gridObj.parent)) {
			return;
		}

		let unAssignedTableHide = "display:none;";
		dispatchView = gridObj.view;
		dispatchdailyGridLayout = gridObj.dailyGridLayout;
		let tableHeight = '';
		let cellPadding = 1;
		let leftHeadDivWidth = 220;
		let rightDivLeft = 226;
		let scrollBarWidth = parseInt($.position.scrollbarWidth());

		if (gridObj.view == 'W') {
			gridObj.columnWidth = '100%';
			gridObj.tableWidth = '100%';
			tableHeight = (gridObj.unAssigned) ? 'height:100%;' : "";
			cellPadding = 0;
			leftHeadDivWidth = 218;
			rightDivLeft = 224;
		} else {
			gridObj.columnWidth = (gridObj.dailyGridLayout == "12") ? "60px" : gridObj.columnWidth;
		}

		if (!gridObj.unAssigned) {
			unAssignedTableHide = "";
			$("<div style='border-bottom:1px solid #DDD;border-right:1px solid #DDD;position:absolute;overflow:hidden;width:" + leftHeadDivWidth + "px;padding-right:5px;margin-left:0;height:44px;z-index:2;' id='" + gridObj.parent + "-grid-left-head'></div>" +
				"<div style='border-bottom:1px solid #DDD;position:absolute;left:" + rightDivLeft + "px;overflow:hidden;width:calc(78.5% - " + scrollBarWidth + "px);margin-left:0%;height:44px;z-index:2;' id='" + gridObj.parent + "-grid-right-head'></div>")
				.appendTo($('#' + gridObj.parent));

			$("<table style='min-width:" + gridObj.tableWidth + ";' class='grid-table' cellpadding='" + cellPadding + "' cellspacing='0' id='" + gridObj.parent + "-grid-table-right-head'></table>").appendTo($('#' + gridObj.parent + '-grid-right-head'));

			gridObj.setGridHeading();
		}

		let parentHeight = $('#' + gridObj.parent).css('height');
		let gridTop = '0%';
		if ($('#' + gridObj.parent + '-grid-left-head')) {
			gridTop = $('#' + gridObj.parent + '-grid-left-head').css('height');
		}
		if ($('#' + gridObj.parent + '-grid-right-head')) {
			gridTop = $('#' + gridObj.parent + '-grid-right-head').css('height');
		}
		if (gridTop === undefined) {
			gridTop = '0%';
		}
		gridTop = (parseFloat(gridTop) + 1) + "px";
		parentHeight = parseInt(parentHeight) - parseInt(gridTop);

		let leftGridBorders = 'border-bottom:1px solid #DDD;';
		if (gridObj.unAssigned) {
			parentHeight = parentHeight - 1;
			leftGridBorders = 'border-bottom:1px solid #DDD;border-left:1px solid #DDD;border-right:1px solid #DDD;';
		}

		$("<div style='" + leftGridBorders + "position:absolute;overflow:hidden;width:"+(gridObj.parent=='dispatch-grid-div-unassignd'?'256':'226')+"px;margin-left:0;height:" + parentHeight + "px;top:" + gridTop + ";z-index:2;' id='" + gridObj.parent + "-grid-left'></div>" +
			"<div style='border-bottom:1px solid #DDD;position:absolute;left:" + (gridObj.parent=='dispatch-grid-div-unassignd'?rightDivLeft+30:rightDivLeft) + "px;"+(gridObj.parent=='dispatch-grid-div-unassignd'?'overflow-y:scroll;overflow-x:hidden;':'overflow:scroll;')+"width:78.5%;margin-left:0%;height:" + parentHeight + "px;top:" + gridTop + "' id='" + gridObj.parent + "-grid-right'></div>")
			.appendTo($('#' + gridObj.parent));


		$("<table style='" + tableHeight + unAssignedTableHide + "' class='grid-table popover-table-left' cellpadding='" + cellPadding + "' cellspacing='0' id='" + gridObj.parent + "-grid-table-left'></table>").appendTo($('#' + gridObj.parent + '-grid-left'));

		$("<table style='min-width:" + gridObj.tableWidth + ";" + tableHeight + "' class='grid-table popover-table-right' cellpadding='" + cellPadding + "' cellspacing='0' id='" + gridObj.parent + "-grid-table-right'></table>").appendTo($('#' + gridObj.parent + '-grid-right'));

		gridObj.setGridRows();

		/***** Code before unassigned tab system ******/
		/*if(gridObj.unAssigned){
			var unBottomDivTop = $('#dispatch-grid-div-unassignd').position().top + $('#dispatch-grid-div-unassignd').height();
			$("#"+gridObj.parent).after("<div id='un-asgnd-"+gridObj.parent+"' style='position:absolute;left:0px;top:"+unBottomDivTop+"px;width:100%;height:25px;'><div style='position:absolute;left:0px;top:0px;width:254px;height:25px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;border-left:1px solid #ddd'></div><button class='btn btn-small' style='position:absolute;left:294px;top:3px' onclick='showEarlierEvents()' id='dispatch-show-earlier'><i class='icol-arrow-left' style='margin-top:-2px'></i> Earlier Time</button><button class='btn btn-small' style='position:absolute;left:91%;top:3px' onclick='showLaterEvents()' id='dispatch-show-later'>Later Time <i class='icol-arrow-right' style='margin-top:-2px'></i></button></div>");
			var tabWidth = parseInt($('#dispatch-tab-content').css('width'));
			$('#un-asgnd-dispatch-grid-div-unassignd').css('width',(parseInt(tabWidth))+'px');
			$('#dispatch-show-later').css('left',(parseInt(tabWidth) - 147)+'px');
		}*/
		/***********************************************/

		if ($('#' + gridObj.parent + '-grid-right')[0].offsetWidth < $('#' + gridObj.parent + '-grid-right')[0].scrollWidth) {
			globalScroll = (gridObj.dailyGridLayout == "24") ? 462 : 882;
		}

		$('#' + gridObj.parent + '-grid-right').scrollLeft(globalScroll);
		$('#' + gridObj.parent + '-grid-right-head').scrollLeft(globalScroll);
		$('#' + gridObj.parent + '-grid-right').bind('scroll', function(e) {
			$('#'+$(this).attr('id')+'-head').scrollLeft($(this).scrollLeft());
		})
	};

	/**
	 * Function used to create the grid heading
	 */
	this.setGridHeading = function () {
		let gridObj = this;

		var dayName = gridObj.getDayName(gridObj.date.getDay());
		var monthName = gridObj.getMonthName(gridObj.date.getMonth());
		var date = gridObj.date.getDate();
		var dateDisplay = dayName+", "+monthName+" "+date;

		var thWidth = '';
		if(gridObj.view == 'W'){
			thWidth = 'width:14%;';
			//var weekDate = gridObj.date;
			//var first = weekDate.getDate() - weekDate.getDay();
			//var firstDay = new Date(weekDate.setDate(first+1));
			//var lastDay = new Date(weekDate.setDate(weekDate.getDate() + 6));
			var monthNameFirstDate = gridObj.getMonthName(gridObj.dateFrom.getMonth());
			var dateDayFirstDate = gridObj.dateFrom.getDate();
			var monthNameLastDate = gridObj.getMonthName(gridObj.dateTo.getMonth());
			var dateDayLastDate = gridObj.dateTo.getDate();
			dateDisplay = monthNameFirstDate+" "+dateDayFirstDate+" - "+monthNameLastDate+" "+dateDayLastDate;
		}
		else{
			var gridHeadMargin = "margin-top:90%;";
			gridHeadMargin = (gridObj.dailyGridLayout=="12")?"margin-top:45%;":gridHeadMargin;
		}

		$('<button onclick="dispatchDatePrevious()" style="float:left;width:27px;" class="btn btn-small btn-success"><i class="icon-caret-left"></i></button>').appendTo($('#'+gridObj.parent+'-grid-left-head'));
		$("<div id='date-display' onclick='showDispatchDate()' style='position:absolute;width:172px;margin-left:27px;height:44px;font-size:15px;font-weight:bold;text-align:center'>"+dateDisplay+"</div>")
			.appendTo($('#'+gridObj.parent+'-grid-left-head'));
		$('<button onclick="dispatchDateNext()" style="float:right;width:27px;" class="btn btn-small btn-success"><i class="icon-caret-right"></i></button>').appendTo($('#'+gridObj.parent+'-grid-left-head'));
		$('<input id="zebradp-dispatch" style="position:absolute;left:30px;top:0%;width:0px;opacity:0" readonly="readonly" type="text" class="date_input datepicker-cmy">').appendTo($('#'+gridObj.parent+'-grid-left-head'));

		$('#zebradp-dispatch').datepicker({
			dateFormat:dateFormat,
			changeMonth: true,
			changeYear: true,
			minDate: new Date(1910,0,1),
			//maxDate: "+0M +0D",
			//yearRange: '1910:'+new Date().getFullYear(),
			yearRange: '1910:'+(parseInt(new Date().getFullYear())+10),
			onSelect: function(selectedDate) {
				var date = new Date($(this).datepicker('getDate'));
				//$('#zebradp-dispatch-filter').datepicker('setDate', date);
				var dayName = gridObjAssigned.getDayName(date.getDay());
				var monthName = gridObjAssigned.getMonthName(date.getMonth());
				var dateDay = date.getDate();
				$("#date-display").html(dayName+", "+monthName+" "+dateDay);
				gridObjAssigned.date = date;
				gridObjUnAssigned.date = date;
				if(gridObj.view == 'W'){
					var weekDate = new Date($(this).datepicker('getDate'));
					var first = weekDate.getDate() - weekDate.getDay();
					first = (weekDate.getDay() == 0)?(parseFloat(first)-7):first;
					var firstDay = new Date(weekDate.setDate(first+1));
					var lastDay = new Date(weekDate.setDate(weekDate.getDate() + 6));

					var monthNameFirstDate = gridObj.getMonthName(firstDay.getMonth());
					var dateDayFirstDate = firstDay.getDate();
					var monthNameLastDate = gridObj.getMonthName(lastDay.getMonth());
					var dateDayLastDate = lastDay.getDate();
					dateDisplay = monthNameFirstDate+" "+dateDayFirstDate+" - "+monthNameLastDate+" "+dateDayLastDate;
					$("#date-display").html(dateDisplay);

					gridObjAssigned.dateFrom = firstDay;
					gridObjAssigned.dateTo = lastDay;

					var dateFromString = gridObjAssigned.dateFrom.getFullYear()+'/'+(parseInt(gridObjAssigned.dateFrom.getMonth())+1)+'/'+gridObjAssigned.dateFrom.getDate();
					var dateFrom = new Date(dateFromString);
					gridObjAssigned.columnDates=[];
					gridObjAssigned.columnDates.push(new Date(dateFromString));
					gridObjUnAssigned.columnDates=[];
					gridObjUnAssigned.columnDates.push(new Date(dateFromString));
					var dayName = gridObj.getDayNameWeekView(0);
					var monthName = gridObj.getMonthName(dateFrom.getMonth());
					var dateTemp = dateDayFirstDate;
					var monthDetails = monthName+' '+dateTemp;
					$('#grid-head-label-0').html("<p>"+dayName+"</p><a href='#' onclick='weeklyDateHeadClick("+'"'+dateFromString+'"'+")'><p class=''>"+monthDetails+"</p></a>");
					$.each(new Array(6),
						function(n){
							dayName = gridObj.getDayNameWeekView(n+1);
							dateFromObj = new Date(dateFrom.setDate(dateTemp+1));
							gridObjAssigned.columnDates.push(dateFromObj);
							gridObjUnAssigned.columnDates.push(dateFromObj);
							monthName = gridObj.getMonthName(dateFromObj.getMonth());
							dateTemp = dateFromObj.getDate();
							monthDetails = monthName+' '+dateTemp;
							$('#grid-head-label-'+(n+1)).html("<p>"+dayName+"</p><a href='#' onclick='weeklyDateHeadClick("+'"'+dateFromObj+'"'+")'><p class=''>"+monthDetails+"</p></a>");
						}
					);

				}

				filterDispatchGrid();
			}
		});
		//var currentDate = new Date();
		$("#zebradp-dispatch").datepicker("setDate",new Date(gridObj.date));

		$("<thead id='"+gridObj.parent+"-grid-head-right' class='grid-table-head'><tr id='"+gridObj.parent+"-grid-head-tr-right' class='grid-table-head-tr'></tr></thead>").appendTo($('#'+gridObj.parent+'-grid-table-right-head'));

		if(gridObj.view=='D'){
			var times = gridObj.getTimeIntervals(0);
			$("<th class='grid-table-th-right' style='border-right:1px solid #DDD;height:44px;'><div style='"+gridHeadMargin+"width:"+gridObj.columnWidth+"'>"+times+"</div></th>").appendTo($('#'+gridObj.parent+'-grid-head-tr-right'));
			$('.grid-table-th-right').last().after("<th class='grid-table-th-right' style='font-weight:normal;border-right:1px solid #DDD;'><div style='"+gridHeadMargin+"width:"+gridObj.columnWidth+"'></div>&nbsp</th>");

			var timeFormat = gridObj.timeFormat;
			$.each(new Array(23),
				function(n){
					times = gridObj.getTimeIntervals(n+1);
					$('.grid-table-th-right').last().after("<th class='grid-table-th-right' style='border-right:1px solid #DDD;'><div style='text-align:left;"+gridHeadMargin+"width:"+gridObj.columnWidth+"'>"+times+"</div></th>");
					$('.grid-table-th-right').last().after("<th class='grid-table-th-right' style='font-weight:normal;border-right:1px solid #DDD;'><div style='"+gridHeadMargin+"width:"+gridObj.columnWidth+"'>&nbsp;</div></th>");
				}
			);
		}
		else{
			var dateFromString = gridObj.dateFrom.getFullYear()+'/'+(parseInt(gridObj.dateFrom.getMonth())+1)+'/'+gridObj.dateFrom.getDate();
			var dateFrom = new Date(dateFromString);
			gridObj.columnDates =[];
			gridObj.columnDates.push(new Date(dateFromString));
			var monthName = gridObj.getMonthName(dateFrom.getMonth());
			var date = gridObj.dateFrom.getDate();
			var dayName = gridObj.getDayNameWeekView(0);
			var monthDetails = monthName+' '+date;
			$("<th class='grid-table-th-right' style='border-right:1px solid #DDD;"+thWidth+";height:44px;'><div id='grid-head-label-0' style='height:100%;cursor:pointer;width:"+gridObj.columnWidth+"'><p>"+dayName+"</p><a href='#' onclick='weeklyDateHeadClick("+'"'+dateFromString+'"'+")'><p class=''>"+monthDetails+"</p></a></div></th>").appendTo($('#'+gridObj.parent+'-grid-head-tr-right'));
			$.each(new Array(6),
				function(n){
					dayName = gridObj.getDayNameWeekView(n+1);
					dateFromObj = new Date(dateFrom.setDate(date+1));
					dateFromString = dateFromObj.getFullYear()+'/'+(parseInt(dateFromObj.getMonth())+1)+'/'+dateFromObj.getDate();
					monthName = gridObj.getMonthName(dateFromObj.getMonth());
					date = dateFromObj.getDate();
					monthDetails = monthName+' '+date;
					$('.grid-table-th-right').last().after("<th class='grid-table-th-right' style='border-right:1px solid #DDD;"+thWidth+"'><div id='grid-head-label-"+(n+1)+"' style='height:100%;cursor:pointer;width:"+gridObj.columnWidth+"'><p>"+dayName+"</p><a href='#' onclick='weeklyDateHeadClick("+'"'+dateFromString+'"'+")'><p class=''>"+monthDetails+"</p></a></div></th>");
					gridObj.columnDates.push(dateFromObj);
				}
			);
		}
	};

	this.createMultipleRowsForUsers = function (aroObj, arnRowNo, arnMaxRows) {
		let gridObj = this;

		let insertAfterRowNo = arnRowNo, i, k, trBgColor = "#ffffff";
		for (i = 1; i < arnMaxRows; i++) {
			k = arnRowNo + '-' + (parseInt(arnRowNo) + i);
			$('#user-' + gridObj.parent + '-left-' + insertAfterRowNo).after("<tr class='grid-table-tr-left' id='user-" + gridObj.parent + "-left-" + k + "'></tr>");
			$('#user-' + gridObj.parent + '-right-' + insertAfterRowNo).after("<tr class='grid-table-tr-right' bgColor='" + trBgColor + "' id='user-" + gridObj.parent + "-right-" + k + "'></tr>");

			$("<td class='grid-table-td-left' style='border-right:1px solid #DDD;border-left:1px solid #DDD;'><div class='rowNoForBreak' id='user-" + gridObj.parent + "-left-row-for-break-" + k + "' style='width:" + gridObj.leftMenuWidth + ";height:" + gridObj.rowHeight + "'></div></td>").appendTo($('#user-' + gridObj.parent + "-left-" + k));

			gridObj.createGridColumns(aroObj.id, k, false, arnRowNo);
		}
	};

	/**
	 * Function used to create the grid rows
	 */
	this.setGridRows = function () {
		let gridObj = this;

		gridObj.rowHeight = ((20 * gridObj.lineNos) + 15) + 'px';
		gridObj.rowEventHeight = (((20 * gridObj.lineNos) + 15) - 6) + 'px';

		var techHrsTitle = 'Tech\'s total number of hours worked for the day since clock-in';
		if (gridObj.view == 'W') {
			gridObj.rowHeight = ((20 * gridObj.lineNos) + 15) + 'px';
			gridObj.rowEventHeight = (((20 * gridObj.lineNos) + 15) - 6) + 'px';
			techHrsTitle = 'Tech\'s total number of hours worked for the week until now';
		}

		$('#' + gridObj.parent + '-grid-right').scrollLeft(0);
		$('#' + gridObj.parent + '-grid-right-head').scrollLeft(0);
		var obj = gridObj.rowValues;
		var userName;
		var trBgColor = "#FFF";
		var borderTopFirstRow;
		var dispatchGridDivAssigndGridLeftWidth = $('#dispatch-grid-div-assignd-grid-left').width();
		$.each(obj, function (index, values) {
			let dfd = $.Deferred();
			gridObj.promises.push(dfd.promise());

			if (gridObj.view == 'W' && gridObj.unAssigned && index != 0) {
				dfd.resolve();
				return false;
			}
			trBgColor = "#FFF";
			if (gridObj.collapseLeftRows) {
				$("<tr overlapRowNo='0' overlapRowNoTemp='0' class='grid-table-tr-left' id='user-" + gridObj.parent + "-left-" + index + "'></tr>").appendTo($('#' + gridObj.parent + '-grid-table-left'));
				$("<tr overlapRowNo='0' overlapRowNoTemp='0' class='grid-table-tr-right' id='user-" + gridObj.parent + "-right-" + index + "'></tr>").appendTo($('#' + gridObj.parent + '-grid-table-right'));
				if (index == 0) {
					$("<td class='grid-table-td-left' style='position:relative;border-right:1px solid #DDD;border-left:1px solid #DDD;'><div style='position:relative;width:" + gridObj.leftMenuWidth + ";height:" + gridObj.rowHeight + "'>" +
						"<div id='user-" + gridObj.parent + "-left-row-for-break-" + index + "' style='position:absolute;width:100%;height:70%;left:0%;top:15%;'>" +
						"</div>" +
						"</div></td>").appendTo($('#user-' + gridObj.parent + "-left-" + index));
					$("#user-" + gridObj.parent + "-left-row-for-break-" + index).data("Mon", 0);
					$("#user-" + gridObj.parent + "-left-row-for-break-" + index).data("Tue", 0);
					$("#user-" + gridObj.parent + "-left-row-for-break-" + index).data("Wed", 0);
					$("#user-" + gridObj.parent + "-left-row-for-break-" + index).data("Thu", 0);
					$("#user-" + gridObj.parent + "-left-row-for-break-" + index).data("Fri", 0);
					$("#user-" + gridObj.parent + "-left-row-for-break-" + index).data("Sat", 0);
					$("#user-" + gridObj.parent + "-left-row-for-break-" + index).data("Sun", 0);
				} else {
					$("<td class='grid-table-td-left' style='border-right:1px solid #DDD;border-left:1px solid #DDD;'><div style='width:" + gridObj.leftMenuWidth + ";height:" + gridObj.rowHeight + "'></div></td>").appendTo($('#user-' + gridObj.parent + "-left-" + index));
				}
			} else {
				if (index % 2 == 0 && gridObj.view == 'D') {
					trBgColor = "#f6f6f6";
				}
				$("<tr overlapRowNo='0' overlapRowNoTemp='0' class='grid-table-tr-left' id='user-" + gridObj.parent + "-left-" + index + "'></tr>").appendTo($('#' + gridObj.parent + '-grid-table-left'));
				$("<tr overlapRowNo='0' overlapRowNoTemp='0' bgColor='" + trBgColor + "' class='grid-table-tr-right' id='user-" + gridObj.parent + "-right-" + index + "'></tr>").appendTo($('#' + gridObj.parent + '-grid-table-right'));
				userName = values.userDetails.name;
				userNamePopover = userName;
				userPhone = values.userDetails.phone;
				userIsMobile = values.userDetails.mobile;
				dateTimeInfo = values.userDetails.dateTimeInfo;
				currentUserStatus = values.userDetails.currentUserStatus;
				enableSmstext = values.userDetails.enableSmstext;
				enableVoice = values.userDetails.enableVoice;
				let timeSpent = Math.floor(values.userDetails.timeSpent/3600)+':'+('0'+Math.floor((values.userDetails.timeSpent%3600)/60)).slice(-2)+'hrs';
				//alert(userName);
				userNameCutted = userName;
				if (userNameCutted != "" && typeof (userNameCutted) != 'undefined' && userNameCutted != null) {
					if (userNameCutted.length > 16) {
						userNameCutted = userNameCutted.substr(0, 15);
						userNameCutted = userNameCutted + '...';
					}
				}

				if (enableVoice == '1') {
					voiceIcon = "<button class='btn btn-mini callTwilio phoneNumber" + index + "' id='" + index + "' title='" + userPhone + "' data-toggle='modal'><i style='margin-top:-3px;' class='icos-phone-2'></i></button>"
				} else {
					voiceIcon = "<button class='btn btn-mini' disabled id='" + index + "' title='" + userPhone + "' ><i style='margin-top:-3px;' class='icos-phone-2'></i></button>"
				}

				/**
				 * COLORS Initilization
				 * 1097
				 */
				colorCode = '';
				userStatus = '';
				gray = '#6c6c6c';
				green = '#16a765';
				blue = '#009cff';
				red = '#ff0000';

				switch (currentUserStatus) {
					case "CLOCK_IN":
						colorCode = green;
						userStatus = 'CIN';
						break;
					case "CLOCK_OUT":
						colorCode = gray;
						userStatus = 'COUT';
						break;
					case "BREAK_START":
						colorCode = blue;
						userStatus = 'ONB';
						break;
					case "BREAK_END":
						colorCode = green; //colorCode=red;
						userStatus = 'ONBE';
						break;
					default:
						colorCode = gray;
						userStatus = 'OTHR';
				}
				/**
				 *  COLORS Initilization Ends Here
				 */

				borderTopFirstRow = (index == 0) ? "" : "border-top:1px solid #DDD;";

				var $td = $("<td class='grid-table-td-left' style='position:relative;" + borderTopFirstRow + "border-right:1px solid #DDD;border-left:1px solid #DDD;'>" +
					"<div class='rowNoForBreak' id='user-" + gridObj.parent + "-left-row-for-break-" + index + "' style='position:relative;width:" + gridObj.leftMenuWidth + ";height:" + gridObj.rowHeight + "'>" +
					"<div style='position:absolute;width:100%;height:70%;left:0%;top:15%;'>" +
					"<div class='userPopover workerspopover' data-container='body' rel='popover' style='height:100%; width:70%; float:left;'>" +
					"<div style='float:left;width:13%;height:85%;margin-top:3%;margin-left:2%;border:1px solid " + colorCode + ";border-radius:2px 2px 2px 2px;background:" + colorCode + "'></div>" +
					"<div style='float:left;width:76%;height:44%;margin-top:3%;margin-left:4%;font-weight:bold'></div>" +
					'<div data-toggle="tooltip" data-placement="right" style="float:left;margin-left:5px;text-align:center;font-size:0.8em;margin-top:3%;" title="'+techHrsTitle+'" class="time-spent">' +
					timeSpent +
					"</div>" +
					"</div>" +
					"<div style='float: left; width: 26%; margin-left: 2%; padding-right: 2%;'>" +
					"<div class='sms-icon' style='float:right;height:65%;margin-top:1%;margin-left:0%;'>" +
					"<button class='btn btn-mini' style='border-left-width: 0;' disabled><i style='margin-top:-3px;' class='icon-comments-2'></i></button>" +
					"</div>" +
					"<div style='float: right;height:65%;margin-top:1%;margin-left:0%;'>" +
					voiceIcon +
					"</div>" +
					"<div class='additional-icons' style='clear: both; padding-top: 5px;'></div>" +
					"</div>" +
					"</div>" +
					"</div>" +
					"</td>")
					.appendTo($('#user-' + gridObj.parent + "-left-" + index));

				let $usernameDiv = $td.find(".userPopover")
					.attr("id", values.id)
					.attr("data-row-id", values.userDetails.rowId)
					.attr("data-original-title", userNamePopover)
					.children("div:first").attr("id", "color-" + values.id)
					.next("div");
				let otherWidth = 0;
				$usernameDiv.siblings().each(function() { if($(this).hasClass('time-spent')) otherWidth += $(this).outerWidth(true); });
				otherWidth = dispatchGridDivAssigndGridLeftWidth - otherWidth;
				if(otherWidth > 0) {
					$usernameDiv.css({
						maxWidth: (otherWidth - 5) + 'px',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap'
					});
					$usernameDiv.empty().append($('<a class="workforce-name" target="_blank" href="'+baseUrl+'/companyWorkforceForm?id='+values.id+'"></a>').text(userName));
				} else {
					$usernameDiv.empty().append($('<a class="workforce-name" target="_blank" href="'+baseUrl+'/companyWorkforceForm?id='+values.id+'"></a>').text(userNameCutted));
				}
				$td.find('[data-toggle="tooltip"]').tooltip();


				if (userIsMobile == 1 && enableSmstext == '1') {
					$td.find(".sms-icon > button")
						.prop("disabled", false)
						.attr("id", index)
						.addClass("phoneNumber" + index)
						.attr("title", userPhone)
						.attr("data-toggle", "modal")
						.attr("data-target", "#twilioAutoSms-modal")
						.click(function (rowId, userName, userPhone) {
							return function () {
								$('#twilioAutoSms-modal #sms-job-div, #twilioAutoSms-modal #sms-template-div, #twilioAutoSms-modal #sms-techs-div, #twilioAutoSms-modal #sms-techs-phone-div').hide();
								$('#twilioAutoSms-modal #smsTextAuto').val('');
								getSmsToTechDetails(rowId, userName, userPhone);
							};
						}(values.userDetails.rowId, userName, userPhone));
				}

				$("#user-" + gridObj.parent + "-left-row-for-break-" + index)
					.data("rowNoForBreak", index)
					.data("userIdForBreak", values.id)
					.data("Mon", 0)
					.data("Tue", 0)
					.data("Wed", 0)
					.data("Thu", 0)
					.data("Fri", 0)
					.data("Sat", 0)
					.data("Sun", 0);

				$('#dispatch-grid-div-assignd')
					.attr('noOfRows', index)
					.attr('masterNoOfRows', index)
					.attr('masterOverlapRows', 0);
			}

			gridObj.createGridColumns(values.id, index, true, index);
			if (gridObj.view == 'D') {
					gridObj.setGridEvents(values, index);
					dfd.resolve();
			} else {
				if (!gridObj.unAssigned) {
					if (values.dayDetails.dayNosMax > 1) {
						gridObj.createMultipleRowsForUsers(values, index, values.dayDetails.dayNosMax);
					}

					setTimeout(function () {
						gridObj.setGridEventsWeek(values, index);
						dfd.resolve();
					}, 1);
				} else {
					dfd.resolve();
				}
			}
		});

		if (gridObj.view == 'W' && gridObj.unAssigned) {
			var rowNosInsert = 1;
			$.each(obj, function (index, values) {
				if (typeof (values.dayDetails) != 'undefined' && values.dayDetails.dayNosMax > rowNosInsert) {
					rowNosInsert = values.dayDetails.dayNosMax;
				}
			});

			if (rowNosInsert > 1) {
				gridObj.createBlankRows(1, rowNosInsert);
			}
			$.each(obj, function (index, values) {
				gridObj.setGridEventsWeek(values, 0);
			});
		}

		if (gridObj.unAssigned && obj.length < 3 && gridObj.view == 'D') {
			gridObj.createBlankRows(obj.length, 3);

		}
		/*.......Code to handle height in different resolutions.....*/
		var tabWidth = parseInt($('#dispatch-tab-content').css('width'));
		let scrollBarWidth = $.position.scrollbarWidth();
		let divAssignedWidthDiff = tabWidth - $('#dispatch-grid-div-assignd').width() + scrollBarWidth;
		let gridLeftWidth = $('#dispatch-grid-div-assignd-grid-left').width() + scrollBarWidth;
		let gridLeftWidthTop = gridLeftWidth + $.position.scrollbarWidth();
		if (!gridObj.unAssigned) {
			var tabsHidden = !!$('#hide-me').hasClass('active');

			var tabHeight = parseInt($('#dispatch-tab-content').css('height'));
			var heightForAssignedGrid = tabHeight - 450;
			if (tabsHidden) heightForAssignedGrid += 410;

			var noOfRowsForAssigned = parseInt(heightForAssignedGrid / 43);
			if (noOfRowsForAssigned < 7) {
				noOfRowsForAssigned = 7;
			}

			gridObj.createBlankRows(obj.length, noOfRowsForAssigned);

			$('#dispatch-grid-div-assignd').css('height', (heightForAssignedGrid - 44) + 'px');

			$('#dispatch-grid-div-assignd-grid-left').css('height', (heightForAssignedGrid - 360) + 'px');
			$('#dispatch-grid-div-assignd-grid-left').css('overflow-y', 'hidden');
			$('#dispatch-grid-div-assignd-grid-left').css('overflow-x', 'scroll');

			$('#dispatch-grid-div-assignd-grid-right').css('height', (heightForAssignedGrid - 360) + 'px');
			//$('#dispatch-grid-div-unassignd').css('top',(heightForAssignedGrid - 41)+'px');

			/****** Code for new tab change *********/
			$('#hide-me').css('top', (heightForAssignedGrid - 30) + 'px');
			if (tabsHidden) $('#hide-me').css({height: '40px', overflow: 'hidden'});

			/*$('#dispatch-grid-div-tabs').css('top',(heightForAssignedGrid - 30)+'px');
			$('#dispatch-grid-div-unscheduled').css('top',(heightForAssignedGrid - 41)+'px');
			$('#dispatch-grid-div-po').css('top',(heightForAssignedGrid - 41)+'px');
			$('#dispatch-grid-div-partcomplted').css('top',(heightForAssignedGrid - 41)+'px');
			$('#dispatch-grid-div-paused').css('top',(heightForAssignedGrid - 41)+'px');
			$('#dispatch-grid-div-followup').css('top',(heightForAssignedGrid - 41)+'px');*/
			/***************************************/

			$('#dispatch-grid-div-assignd-grid-right').css('width', (parseInt(tabWidth) - gridLeftWidth) + 'px');
			$('#dispatch-grid-div-assignd-grid-right-head').css('width', (parseInt(tabWidth) - gridLeftWidthTop) + 'px');
		} else {
			$('#dispatch-grid-div-unassignd-grid-right').css('width', (parseInt(tabWidth) - ($('#dispatch-grid-div-unassignd-grid-left').width() + scrollBarWidth)) + 'px');
			$('#dispatch-grid-div-unscheduled-right').css('width', (parseInt(tabWidth) - ($('#dispatch-grid-div-unscheduled-left').width() + scrollBarWidth)) + 'px');
			$('#dispatch-grid-div-po-right').css('width', (parseInt(tabWidth) - ($('#dispatch-grid-div-po-left').width() + scrollBarWidth)) + 'px');
			$('#dispatch-grid-div-partcomplted-right').css('width', (parseInt(tabWidth) - ($('#dispatch-grid-div-partcomplted-left').width() + scrollBarWidth)) + 'px');
			$('#dispatch-grid-div-paused-right').css('width', (parseInt(tabWidth) - ($('#dispatch-grid-div-paused-left').width() + scrollBarWidth)) + 'px');
			$('#dispatch-grid-div-followup-right').css('width', (parseInt(tabWidth) - ($('#dispatch-grid-div-followup-left').width() + scrollBarWidth)) + 'px');

			$('#dispatch-grid-div-unassignd-grid-right').scrollLeft($('#dispatch-grid-div-assignd-grid-right').scrollLeft());
		}

		/*..........................................................*/

		/*if(!gridObj.unAssigned && obj.length < 7){
			gridObj.createBlankRows(obj.length,7);
		}*/

		$('#' + gridObj.parent + '-grid-right').scrollLeft(globalScroll);
		$('#' + gridObj.parent + '-grid-right-head').scrollLeft(globalScroll);

		$('#' + gridObj.parent + '-grid-right').data('initialized', true);
		$.when.apply($, gridObj.promises).always(function () {
			gridObj.bindEvents();
			$('body').trigger('dispatch-refreshed', gridObj);
		});
	};

	/**
	 * Function used to create the blank grid rows. If users less than 7 are present then we have to create a minimum of seven rows.
	 * @param arnLength
	 * @param maxLength
	 */
	this.createBlankRows = function (arnLength, maxLength) {
		let gridObj = this;

		let k, border = true, userAttr, id;

		for (k = arnLength; k < maxLength; k++) {
			if (gridObj.collapseLeftRows) {
				$("<tr class='grid-table-tr-left' id='user-blank-" + gridObj.parent + "-left-" + k + "'></tr>").appendTo($('#' + gridObj.parent + '-grid-table-left'));
				$("<tr class='grid-table-tr-right' id='user-blank-" + gridObj.parent + "-right-" + k + "'></tr>").appendTo($('#' + gridObj.parent + '-grid-table-right'));

				$("<td class='grid-table-td-left' style='border-right:1px solid #DDD;border-left:1px solid #DDD;'><div style='width:" + gridObj.leftMenuWidth + ";height:" + gridObj.rowHeight + "'></div></td>").appendTo($('#user-blank-' + gridObj.parent + "-left-" + k));
			} else {
				$("<tr class='grid-table-tr-left' id='user-blank-" + gridObj.parent + "-left-" + k + "'></tr>").appendTo($('#' + gridObj.parent + '-grid-table-left'));
				$("<tr class='grid-table-tr-right' id='user-blank-" + gridObj.parent + "-right-" + k + "'></tr>").appendTo($('#' + gridObj.parent + '-grid-table-right'));

				$("<td class='grid-table-td-left' style='border-right:1px solid #DDD;border-top:1px solid #DDD;border-left:1px solid #DDD;'><div style='width:" + gridObj.leftMenuWidth + ";height:" + gridObj.rowHeight + "'></div></td>").appendTo($('#user-blank-' + gridObj.parent + "-left-" + k));
				$('#dispatch-grid-div-assignd').attr('noOfRows', k);
				$('#dispatch-grid-div-assignd').attr('masterNoOfRows', k);
				$('#dispatch-grid-div-assignd').attr('masterOverlapRows', 0);
			}
			border = true;
			userAttr = k;
			id = k;
			border = (gridObj.view == 'W' && gridObj.unAssigned) ? false : border;
			userAttr = (gridObj.view == 'W' && gridObj.unAssigned) ? 0 : userAttr;
			id = (gridObj.view == 'W' && gridObj.unAssigned) ? "" : id;

			gridObj.createBlankGridColumns(id, k, border, userAttr);
		}
	};

	/**
	 * Function used to create the blank grid columns
	 * @param arsId
	 * @param arnIndex
	 * @param arbBorder
	 * @param arnRowNoForUserAttr
	 */
	this.createBlankGridColumns = function (arsId, arnIndex, arbBorder, arnRowNoForUserAttr) {
		let gridObj = this;

		var columnDate = "";
		var tdWidth = '';
		var userAttr = arnRowNoForUserAttr;
		var tdBorderTop = (arbBorder && arnIndex != 0) ? 'border-top:1px solid #DDD;' : "";
		if (gridObj.view == 'W') {
			columnDate = gridObj.columnDates[0];
			tdWidth = 'width:14%;';
		}
		var draggableClassStr = '';
		if (gridObj.unAssigned) {
			draggableClassStr = 'class="grid-columns-' + gridObj.unAssignedString + '"';
		}
		$("<td class='grid-table-td-right' bgcolor='" + gridObj.gridBackgroundColor + "' style='border-right:1px solid #DDD;" + tdBorderTop + tdWidth + "'><div " + draggableClassStr + " userRowAttr='" + arsId + "-" + userAttr + "-0' id='column-div-" + gridObj.parent + '-' + arnIndex + "-0' style='position:relative;left:0px;top:0px;width:" + gridObj.columnWidth + ";height:" + gridObj.rowHeight + "'></div></td>").appendTo($('#user-blank-' + gridObj.parent + "-right-" + arnIndex));
		var setTimeForColumn = gridObj.getTimeIntervalsForColumn(0);
		if (gridObj.unAssigned) {
			$('#column-div-' + gridObj.parent + '-' + arnIndex + '-0').data('columnData', {
				user: '',
				unassigned: true,
				date: columnDate,
				time: setTimeForColumn
			});
		} else {
			$('#column-div-' + gridObj.parent + '-' + arnIndex + '-0').data('columnData', {
				user: arsId,
				unassigned: false,
				date: columnDate,
				time: setTimeForColumn
			});
		}
		if (gridObj.view == 'D') {
			$.each(new Array(47),
				function (n) {
					setTimeForColumn = gridObj.getTimeIntervalsForColumn(n + 1);
					$('#user-blank-' + gridObj.parent + '-right-' + arnIndex + ' td :last').after("<td class='grid-table-td-right' bgcolor='" + gridObj.gridBackgroundColor + "' style='border-right:1px solid #DDD;" + tdBorderTop + "'><div " + draggableClassStr + " id='column-div-" + gridObj.parent + '-' + arnIndex + "-" + (parseInt(n) + 1) + "' style='position:relative;left:0px;top:0px;width:" + gridObj.columnWidth + ";height:" + gridObj.rowHeight + "'></div></td>");
					if (gridObj.unAssigned) {
						$('#column-div-' + gridObj.parent + '-' + arnIndex + '-' + (parseInt(n) + 1)).data('columnData', {
							user: '',
							unassigned: true,
							date: '',
							time: setTimeForColumn
						});
					} else {
						$('#column-div-' + gridObj.parent + '-' + arnIndex + '-' + (parseInt(n) + 1)).data('columnData', {
							user: arsId,
							unassigned: false,
							date: '',
							time: setTimeForColumn
						});
					}
				}
			);
		} else {
			$.each(new Array(6),
				function (n) {
					columnDate = gridObj.columnDates[n + 1];
					$('#user-blank-' + gridObj.parent + '-right-' + arnIndex + ' td :last').after("<td class='grid-table-td-right' bgcolor='" + gridObj.gridBackgroundColor + "' style='border-right:1px solid #DDD;" + tdBorderTop + tdWidth + "'><div " + draggableClassStr + " userRowAttr='" + arsId + "-" + userAttr + "-" + (parseInt(n) + 1) + "' id='column-div-" + gridObj.parent + '-' + arnIndex + "-" + (parseInt(n) + 1) + "' style='position:relative;left:0px;top:0px;width:" + gridObj.columnWidth + ";height:" + gridObj.rowHeight + "'></div></td>");
					if (gridObj.unAssigned) {
						$('#column-div-' + gridObj.parent + '-' + arnIndex + '-' + (parseInt(n) + 1)).data('columnData', {
							user: '',
							unassigned: true,
							date: columnDate
						});
					} else {
						$('#column-div-' + gridObj.parent + '-' + arnIndex + '-' + (parseInt(n) + 1)).data('columnData', {
							user: arsId,
							unassigned: false,
							date: columnDate
						});
					}
				}
			);
		}
	};

	/**
	 * Function used to create the grid columns
	 * @param arsId
	 * @param arnIndex
	 * @param arbBorder
	 * @param arnRowNoForUserAttr
	 */
	this.createGridColumns = function (arsId, arnIndex, arbBorder, arnRowNoForUserAttr) {
		let gridObj = this;

		var columnDate = "";
		var tdWidth = '';
		var userAttr = arnRowNoForUserAttr;
		var tdBorderTop = (arbBorder && arnIndex != 0) ? 'border-top:1px solid #DDD;' : "";
		if (gridObj.view == 'W') {
			columnDate = gridObj.columnDates[0];
			tdWidth = 'width:14%;';
			tdBorderTop = (gridObj.unAssigned) ? "" : tdBorderTop;
		}
		$("<td class='grid-table-td-right' bgcolor='" + gridObj.gridBackgroundColor + "' style='border-right:1px solid #DDD;" + tdBorderTop + tdWidth + "'><div class='grid-columns-" + gridObj.unAssignedString + "' userRowAttr='" + arsId + "-" + userAttr + "-0' id='column-div-" + gridObj.parent + '-' + arnIndex + "-0' style='position:relative;left:0px;top:0px;width:" + gridObj.columnWidth + ";height:" + gridObj.rowHeight + "'></div></td>").appendTo($('#user-' + gridObj.parent + "-right-" + arnIndex));
		var setTimeForColumn = gridObj.getTimeIntervalsForColumn(0);
		if (gridObj.unAssigned) {
			$('#column-div-' + gridObj.parent + '-' + arnIndex + '-0').data('columnData', {
				user: '',
				unassigned: true,
				date: columnDate,
				time: setTimeForColumn
			});
		} else {
			$('#column-div-' + gridObj.parent + '-' + arnIndex + '-0').data('columnData', {
				user: arsId,
				unassigned: false,
				date: columnDate,
				time: setTimeForColumn
			});
		}
		if (gridObj.view == 'D') {
			$.each(new Array(47),
				function (n) {
					setTimeForColumn = gridObj.getTimeIntervalsForColumn(n + 1);
					$('#user-' + gridObj.parent + '-right-' + arnIndex + ' td :last').after("<td class='grid-table-td-right' bgcolor='" + gridObj.gridBackgroundColor + "' style='border-right:1px solid #DDD;" + tdBorderTop + "'><div class='grid-columns-" + gridObj.unAssignedString + "' id='column-div-" + gridObj.parent + '-' + arnIndex + "-" + (parseInt(n) + 1) + "' style='position:relative;left:0px;top:0px;width:" + gridObj.columnWidth + ";height:" + gridObj.rowHeight + "'></div></td>");
					if (gridObj.unAssigned) {
						$('#column-div-' + gridObj.parent + '-' + arnIndex + '-' + (parseInt(n) + 1)).data('columnData', {
							user: '',
							unassigned: true,
							date: columnDate,
							time: setTimeForColumn
						});
					} else {
						$('#column-div-' + gridObj.parent + '-' + arnIndex + '-' + (parseInt(n) + 1)).data('columnData', {
							user: arsId,
							unassigned: false,
							date: columnDate,
							time: setTimeForColumn
						});
					}
				}
			);
		} else {
			$.each(new Array(6),
				function (n) {
					columnDate = gridObj.columnDates[n + 1];
					$('#user-' + gridObj.parent + '-right-' + arnIndex + ' td :last').after("<td class='grid-table-td-right' bgcolor='" + gridObj.gridBackgroundColor + "' style='border-right:1px solid #DDD;" + tdBorderTop + tdWidth + "'><div class='grid-columns-" + gridObj.unAssignedString + "' userRowAttr='" + arsId + "-" + userAttr + "-" + (parseInt(n) + 1) + "' id='column-div-" + gridObj.parent + '-' + arnIndex + "-" + (parseInt(n) + 1) + "' style='position:relative;left:0px;top:0px;width:" + gridObj.columnWidth + ";height:" + gridObj.rowHeight + "'></div></td>");
					if (gridObj.unAssigned) {
						$('#column-div-' + gridObj.parent + '-' + arnIndex + '-' + (parseInt(n) + 1)).data('columnData', {
							user: '',
							unassigned: true,
							date: columnDate
						});
					} else {
						$('#column-div-' + gridObj.parent + '-' + arnIndex + '-' + (parseInt(n) + 1)).data('columnData', {
							user: arsId,
							unassigned: false,
							date: columnDate
						});
					}
				}
			);
		}
	};

	this.clearGridRows = function () {
		let gridObj = this;
		gridObj.clearEvents();
		$('#' + gridObj.parent + '-grid-right').scrollLeft(0);
		$('#' + gridObj.parent + '-grid-right-head').scrollLeft(0);
		$('#' + this.parent + '-grid-table-left tr.grid-table-tr-left').remove();
		$('#' + this.parent + '-grid-table-right tr.grid-table-tr-right').remove();
	};

	this.clearEvents = function () {
		let gridObj = this;
		$('#' + gridObj.parent + '-grid-right').scrollLeft(0);
		$('#' + gridObj.parent + '-grid-right-head').scrollLeft(0);
		$('#' + this.parent + '-grid-right > .dispatch-events').remove();
		gridObj.rowValues = [];
	};

	/**
	 * Function used to set the grid events. Draggable and resizable events are created from here.
	 * @param aroEvent
	 * @param arnIndex
	 */
	this.setGridEvents = function (aroEvent, arnIndex) {
		let gridObj = this;
		var length = Object.keys(aroEvent.events).length;
		var eventObjectInner = [];
		var scrollTop = $('#' + gridObj.parent + '-grid-right').scrollTop();
		let $_tbl = $('#column-div-' + gridObj.parent + '-' + arnIndex + '-0').parents('table');
		let updateTableHeight = $_tbl[0] && !$('#' + gridObj.parent + '-grid-right').data('initialized');
		if(!updateTableHeight) {
			$_tbl.css({height:'auto'});
		}
		for (var k = 0; k < length; k++) {
			eventObjectInner = aroEvent.events[Object.keys(aroEvent.events)[k]];
			var isCompleted = eventObjectInner.compCode;
			var masterBackground = eventObjectInner.masterBackground;
			var startMin = eventObjectInner.startMin;
			var startMinForSetEvent = (gridObj.dailyGridLayout == "24") ? eventObjectInner.startMin : parseFloat(eventObjectInner.startMin) * 2;
			var endMin = eventObjectInner.endMin;
			var endMinForEventSet = (gridObj.dailyGridLayout == "24") ? eventObjectInner.endMin : parseFloat(eventObjectInner.endMin) * 2;
			var arrivalDiffMin = eventObjectInner.arrivalDiff / 60;
			var noOfThirtysInMins = parseInt(arrivalDiffMin / 30);
			var columnMarginsWidth = 3;
			columnMarginsWidth = columnMarginsWidth * (noOfThirtysInMins - 1);
			arrivalDiffMin = (gridObj.dailyGridLayout == "24") ? arrivalDiffMin : (arrivalDiffMin * 2)
			var durMins = eventObjectInner.durMins;
			var durDisplay = eventObjectInner.durDisplay;
			var addDur = eventObjectInner.addDur;
			var isVisit = eventObjectInner.isVisit;
			var visitId = eventObjectInner.visitId;
			var duration = (endMinForEventSet - startMinForSetEvent) * 60;
			var firstColPosX = $('#column-div-' + gridObj.parent + '-' + arnIndex + '-0').position().left;
			var eventStartPosX = parseInt(startMinForSetEvent);
			var eventEndPosX = parseInt(endMinForEventSet);
			var remainder = endMin % 30;
			var colsPassedStart = parseInt(parseFloat(eventStartPosX) / parseFloat(gridObj.columnWidth));
			var colsPassedEnd = parseInt(parseFloat(eventEndPosX) / parseFloat(gridObj.columnWidth));
			eventStartPosX = eventStartPosX + (colsPassedStart * 3);
			if (remainder == 0) {
				eventEndPosX = (eventEndPosX + (colsPassedEnd * 3)) - 3;
			} else {
				eventEndPosX = (eventEndPosX + (colsPassedEnd * 3));
			}
			var firstColPosY = $('#column-div-' + gridObj.parent + '-' + arnIndex + '-0').position().top;

			if(updateTableHeight) {
				let height = $('#column-div-' + gridObj.parent + '-' + arnIndex + '-0').height();
				let rows = $_tbl.find('tr[id*='+gridObj.parent+']').length;
				$_tbl.height(height * rows + 3 * rows);
				firstColPosY = height * arnIndex + 3 * arnIndex;
			}
			var eventTop = firstColPosY + 3 + scrollTop;
			var eventStartPosX = eventStartPosX + parseInt(firstColPosX);
			var eventEndPosX = eventEndPosX + parseInt(firstColPosX);
			var eventWidth = eventEndPosX - eventStartPosX;
			var eventColor = gridObj.eventColor;
			if (eventObjectInner.eventColor) {
				eventColor = eventObjectInner.eventColor;
			}
			var eventTitle = eventObjectInner.title;
			var id = 'column-event-div-' + aroEvent.id + '-' + eventObjectInner.id;
			var jobStatusName = eventObjectInner.jobStatusName;
			var customerCity = eventObjectInner.customerCity;
			var customerName = eventObjectInner.customerName;
			var primaryName = eventObjectInner.primaryName;
			var jobNo = eventObjectInner.jobNo;
			var jobDesc = eventObjectInner.jobDesc;
			var jobId = eventObjectInner.jobId;
			var code = eventObjectInner.code;
			var jobCode = eventObjectInner.jobCode;
			var isTimeOff = eventObjectInner.isTimeOff;
			let jobSubStatus = eventObjectInner.jobSubStatus;
			let jobSubStatusColor = eventObjectInner.jobSubStatusColor;

			var jobStartDate = '';
			if (typeof eventObjectInner.jobStartDate !== 'undefined') {
				jobStartDate = eventObjectInner.jobStartDate;
			}

			var isRepeating = 0;
			if (typeof eventObjectInner.isRepeating !== 'undefined') {
				isRepeating = eventObjectInner.isRepeating;
			}

			var isRepeatingChild = 0;
			if (typeof eventObjectInner.isRepeatingChild !== 'undefined') {
				isRepeatingChild = eventObjectInner.isRepeatingChild;
			}

			var relPopover;
			var isAssigned;
			var dispatchClass = '';
			isAssigned = aroEvent.userDetails.assigned;
			if (isAssigned == true) {
				relPopover = "rel='popover'";
				dispatchClass = 'dispatch-events-assigned';
				if(rescheduleCompJobs == 0 && ['CLOSED','OPEN_ACTIVE'].indexOf(code) > -1) {
					dispatchClass += ' no-context';
				}
			} else {
				relPopover = "rel='popover'";
				dispatchClass = 'dispatch-events-unassigned';
			}

			var parentWidth = $('#' + gridObj.parent + '-grid-table-right').css('width');
			var parentLeft = $('#' + gridObj.parent + '-grid-table-right').css('left');
			var eventEndPos = parseFloat(eventStartPosX) + parseFloat(eventWidth);
			var eventResize = true;
			var borderRadius = 'border-radius:4px 4px 4px 4px';
			var borderRadiusLeftDiv = 'border-radius:4px 0px 0px 4px';
			var borderRadiusRightDiv = 'border-radius:4px 4px 4px 4px';
			var originalStartMin = 0;
			var originalEndMin = 0;
			var originalDuration = 0;
			var originalStartTime = 0;
			var parentWidthFloat = parseFloat(parentWidth);
			var diffWidth = eventEndPos - parentWidthFloat;
			if (parentWidthFloat && eventEndPos > parentWidthFloat) {
				eventWidth = eventWidth - (diffWidth + 4);
				eventResize = false;
				borderRadius = 'border-radius:4px 0px 0px 4px';
			}
			if (eventObjectInner.previousDay) {
				borderRadius = 'border-radius:0px 4px 4px 0px';
				borderRadiusRightDiv = 'border-radius:0px 4px 4px 0px';
				originalStartMin = eventObjectInner.originalStartMin;
				originalEndMin = eventObjectInner.originalEndMin;
				originalDuration = eventObjectInner.originalDuration;
				originalStartTime = eventObjectInner.originalStartTime;
			}
			if (!eventObjectInner.startDateFlag && eventObjectInner.code == "TASK") {
				borderRadius = 'border-radius:0px 4px 4px 0px';
			}
			if (!eventObjectInner.startDateFlag && !eventObjectInner.endDateFlag && eventObjectInner.code == "TASK") {
				borderRadius = 'border-radius:0px 0px 0px 0px';
			}
			if (diffWidth >= -5) {
				eventWidth = eventWidth - 2;
			}
			var leftDiv = "";
			var rightDiv = "";
			var titleDiv = "";
			var titleDivHeight = parseFloat(gridObj.rowEventHeight) - 4;
			durMins = eventWidth - 4;
			var leftDivMargin = '2';
			if (addDur == 1) {
				arrivalDiffMin = arrivalDiffMin + columnMarginsWidth;
				durMins = (eventWidth - arrivalDiffMin) - 4;
				leftDivMargin = parseFloat(arrivalDiffMin + 2);
				borderRadiusRightDiv = 'border-radius:0px 4px 4px 0px';
			}
			if (eventEndPos > parseFloat(parentWidth)) {
				borderRadiusRightDiv = 'border-radius:4px 0px 0px 4px';
			}
			if (eventObjectInner.code == "TASK") {
				originalDuration = eventObjectInner.originalDuration;
				originalStartTime = eventObjectInner.originalStartTime;
				dispatchClass = dispatchClass + " task-events";
				if(isTimeOff) {
					dispatchClass += ' time-off';
					eventColor = 'ransparent'
				}
				rightDiv = "<div id='" + id + "-inner' style='white-space:nowrap;text-overflow: ellipsis;overflow: hidden;text-align:center;'>" + "</div>";
			} else {
				if (addDur == 1) {
					leftDiv = "<div class='' id='" + id + "-inner-title' style='white-space:nowrap;position:absolute;z-index:5;float:left;margin-left:2px;margin-top:2px;padding-left:5px;width:" + arrivalDiffMin + "px;background:white;color:black;box-sizing:border-box; -moz-box-sizing:border-box;-webkit-box-sizing:border-box;" + borderRadiusLeftDiv + ";height:" + titleDivHeight + "px;'></div>";
				}
				if (eventObjectInner.previousDay) {
					leftDiv = "";
					leftDivMargin = '2';
					durMins = eventWidth - 4;
				}
				//rightDiv="<div id='"+id+"-inner' style='text-align:center;float:right;padding-right:5px;'>"+durDisplay+"</div>";
				rightDiv = "<div id='" + id + "-inner' style='position:absolute;z-index:4;opacity: .9;filter: alpha(opacity=90);text-align:center;margin-top:2px;margin-left:" + leftDivMargin + "px;width:" + durMins + "px;background:white;color:black;box-sizing:border-box; -moz-box-sizing:border-box;-webkit-box-sizing:border-box;" + borderRadiusRightDiv + ";height:" + titleDivHeight + "px;'></div>";
				titleDiv = "<div class='' id='" + id + "-inner-title-text' style='white-space:nowrap;text-overflow: ellipsis;overflow: hidden;position:absolute;z-index:6;float:left;margin-left:2px;margin-top:2px;padding-left:5px;width:" + (parseFloat(eventWidth) - 5) + "px;background:rgba(255,255,255,0);color:black;box-sizing:border-box; -moz-box-sizing:border-box;-webkit-box-sizing:border-box;" + borderRadiusLeftDiv + ";height:" + titleDivHeight + "px;'></div>";
				//rightDiv="<div id='"+id+"-inner' style='text-align:center;'>"+"</div>";
			}
			subStatusSpan = (jobSubStatus)
				? "<span class='badge sub-status' style='float:right;margin-right:5px;text-align:center;font-size:0.8em;padding:0px 6px;background-color:"+jobSubStatusColor+"'>"+jobSubStatus+"</span>"
				: '';
			var lineHeightClass = "";
			lineHeightClass = (gridObj.lineNos == 3) ? " dispatch-events-3" : lineHeightClass;
			lineHeightClass = (gridObj.lineNos == 2) ? " dispatch-events-2" : lineHeightClass;
			let iconInvoiced = iconReminders = '';
			if(eventObjectInner.compCode === '14_INV' || eventObjectInner.compCode === '15_PID') {
				iconInvoiced = '<i class="icon-invoiced ' + (eventObjectInner.isPaid == 1 ? 'green' : 'gray') + '"></i>';
				lineHeightClass += ' is-invoiced';
			}

			iconReminders += '<div class="additional-icons">';
			if(eventObjectInner.hasReminders && eventObjectInner.hasReminders > 0) {
				iconReminders += '<i class="icon-reminders-gray"></i>';
				lineHeightClass += ' has-reminders';
			}
			iconReminders += '</div>';

			$("<div data-start-hours='"+Math.floor(startMin/60)+"' data-start-minutes='"+Math.floor(startMin%60)+"' data-end-hours='"+Math.floor(endMin/60)+"' data-end-minutes='"+Math.floor(endMin%60)+"' rowNo='" + arnIndex + "' class='dispatch-events " + dispatchClass + lineHeightClass + " userPopover map-link' data-container='body' data-toggle='modal' " + relPopover + "  style='font-size:12px;line-height:14px;color:" + gridObj.eventFontColor + ";cursor:pointer;position:absolute;background:" + eventColor + ";left:" + eventStartPosX + "px;top:" + eventTop + "px;width:" + eventWidth + "px;height:" + gridObj.rowEventHeight + ";box-sizing:border-box; -moz-box-sizing:border-box;-webkit-box-sizing:border-box;" + borderRadius + "' originalLeft='" + eventStartPosX + "' originalTop='" + eventTop + "' id='column-event-div-" + aroEvent.id + '-' + eventObjectInner.id + "'>" + leftDiv + titleDiv + rightDiv + iconInvoiced + iconReminders + "</div>").appendTo($('#' + gridObj.parent + '-grid-right'));
			$('#column-event-div-' + aroEvent.id + '-' + eventObjectInner.id + ' .icon-reminders-gray').tooltip({
				animation: true,
				placement: 'top',
				title: (eventObjectInner.isJob ? 'Job' : 'Estimate') + ' has reminders'
			});
			if (eventObjectInner.code == "TASK") {
				$("#" + id + "-inner").html(eventTitle);
				if(isTimeOff)
					$("#"+id+"-inner").css('margin-bottom','2px').append($('<br />')).append(jobDesc);
			} else {
				if (eventObjectInner.arrivalDiff <= 0) {
					eventTitle = "";
				}
				eventTitle = subStatusSpan ? (eventTitle + "</br>" + subStatusSpan) : eventTitle;
				if(eventTitle.trim().substring(0, 5) != '<del>')
					eventTitle = '<span class="dtitle">'+eventTitle+'</span>';
				$("#" + id + "-inner-title-text").html(eventTitle);
			}

			$('#' + id).data('eventData', {
				lat: eventObjectInner.lat,
				lng: eventObjectInner.lng,
				address: eventObjectInner.address ? eventObjectInner.address : '',
				'eventId': id,
				unscheduled: false,
				'visitId': visitId,
				'isVisit': isVisit,
				'id': eventObjectInner.id,
				'jobId': jobId,
				'jobStartDate': jobStartDate,
				'isRepeating': isRepeating,
				'isRepeatingChild': isRepeatingChild,
				calJobId: eventObjectInner.calJobId,
				taskId: eventObjectInner.taskId,
				assigned: aroEvent.userDetails.assigned,
				'userId': aroEvent.id,
				'newUserId': aroEvent.id,
				'startMin': startMin,
				'endMin': endMin,
				'duration': duration,
				'arrivalDiff': eventObjectInner.arrivalDiff,
				'jobLocation': customerCity,
				'eventColor': eventColor,
				'jobStatusName': jobStatusName,
				'customerName': customerName,
				'primaryName': primaryName,
				'jobNo': jobNo,
				'jobDesc': jobDesc,
				'code': code,
				'jobCode': jobCode,
				'previousDay': eventObjectInner.previousDay,
				'originalStartMin': originalStartMin,
				'originalEndMin': originalEndMin,
				'originalDuration': originalDuration,
				'originalStartTime': originalStartTime,
				'changeDate': false,
				'isCompleted': isCompleted,
				startDateFlag: eventObjectInner.startDateFlag,
				endDateFlag: eventObjectInner.endDateFlag
			});

			$('#' + id).css('zIndex', 2);
			if (isCompleted == '10_CMP') {
				$('#' + id).css('zIndex', 1);
			}
			if (eventObjectInner.code == "TASK" && eventObjectInner.startDateFlag) {
				gridObj.setDraggableEvent(aroEvent.id, eventObjectInner.id);
			} else if (eventObjectInner.code != "TASK") {
				gridObj.setDraggableEvent(aroEvent.id, eventObjectInner.id);
			}
			if (eventResize && eventObjectInner.code == "TASK" && eventObjectInner.endDateFlag) {
				gridObj.setResizableEvent(aroEvent.id, eventObjectInner.id);
			} else if (eventResize && eventObjectInner.code != "TASK") {
				gridObj.setResizableEvent(aroEvent.id, eventObjectInner.id);
			}
		}
	};

	/**
	 * Function used to set the grid events in weekly view. Draggable and resizable events are created from here.
	 * @param aroEvent
	 * @param arnIndex
	 */
	this.setGridEventsWeek = function (aroEvent, arnIndex) {
		let gridObj = this;

		let getActualDomWidth = function(selector){
			let rect = $(selector)[0].getBoundingClientRect();
			let width;
			if (rect.width) {
				width = rect.width;
			} else {
				width = rect.right - rect.left;
			}

			width = Math.round(width * 100) / 100;
			return width;
		};

		/*.......Code to handle height in different resolutions.....*/
		var tabWidth = parseInt($('#dispatch-tab-content').css('width'));
		if (!gridObj.unAssigned) {
			$('#dispatch-grid-div-assignd-grid-right').css('width', (parseInt(tabWidth) - 244) + 'px');
			$('#dispatch-grid-div-assignd-grid-right-head').css('width', (parseInt(tabWidth) - 261) + 'px');

		} else {
			$('#dispatch-grid-div-unassignd-grid-right').css('width', (parseInt(tabWidth) - 276) + 'px');
			$('#dispatch-grid-div-unscheduled-right').css('width', (parseInt(tabWidth) - 276) + 'px');
		}

		/*..........................................................*/

		if (typeof columnSizes == "undefined")
			columnSizes = {};

		var gridParent = gridObj.parent;
		var length = Object.keys(aroEvent.events).length;
		var eventObjectInner = [];
		var scrollTop = $('#' + gridParent + '-grid-right').scrollTop();
		for (var k = 0; k < length; k++) {
			eventObjectInner = aroEvent.events[Object.keys(aroEvent.events)[k]];
            var isCompleted = eventObjectInner.compCode;
			var masterBackground = eventObjectInner.masterBackground;
			var startMin = eventObjectInner.startMin;
			var titleHeadWeekly = eventObjectInner.titleHeadWeekly;
			titleHeadWeekly = (!titleHeadWeekly) ? "<div><div style='float:left'><p style='padding-left:7px;margin:0px;'>No set time</p></div></div>" : titleHeadWeekly;

			var endMin = eventObjectInner.endMin;
			var jobStartDate = eventObjectInner.jobStartDate;
			var arrivalDiffMin = eventObjectInner.arrivalDiff / 60;
			var durMins = eventObjectInner.durMins;
			var durDisplay = eventObjectInner.durDisplay;
			var addDur = eventObjectInner.addDur;
			var multiDay = eventObjectInner.multiDay;
			var isVisit = eventObjectInner.isVisit;
			var visitId = eventObjectInner.visitId;
			var duration = (endMin - startMin) * 60;
			var dayNo = eventObjectInner.dayNo;
			var firstColPosX = $('#column-div-' + gridParent + '-' + arnIndex + '-0').position().left;
			var m;
			var columnWidth = 0;
			var columnWidthEventCol;
			for (m = 0; m < (dayNo - 1); m++) {
				if (!columnSizes.hasOwnProperty('column-div-' + gridParent + '-' + arnIndex + '-' + m)) {
					columnSizes['column-div-' + gridParent + '-' + arnIndex + '-' + m] = {
						"width": parseFloat(getActualDomWidth('#column-div-' + gridParent + '-' + arnIndex + '-' + m) + 1)
					};
				}
				columnWidth = columnWidth + columnSizes['column-div-' + gridParent + '-' + arnIndex + '-' + m].width
			}
			columnWidthEventCol = parseFloat($('#column-div-' + gridParent + '-' + arnIndex + '-' + m).width());

			var dayName = eventObjectInner.dayName;
			var eventPerDay = $("#user-" + gridParent + "-left-row-for-break-" + arnIndex).data(dayName);
			var actualIndex = $("#user-" + gridParent + "-left-" + arnIndex)[0].rowIndex;
			if(eventPerDay && $("#user-" + gridParent + "-left-" + arnIndex + '-' + (arnIndex + eventPerDay))[0])
				actualIndex = $("#user-" + gridParent + "-left-" + arnIndex + '-' + (arnIndex + eventPerDay))[0].rowIndex;
			var eventStartPosX = columnWidth + 1;

			var eventEndPosX = (eventStartPosX + parseInt(columnWidthEventCol)) - 2;
			var remainder = endMin % 30;
			var colsPassedStart = parseInt(parseFloat(eventStartPosX) / parseFloat(columnWidth));
			var colsPassedEnd = parseInt(parseFloat(eventEndPosX) / parseFloat(columnWidth));

			var firstColPosY = $('#column-div-' + gridParent + '-' + arnIndex + '-0').position().top;
			var eventTop = (firstColPosY + 3 + scrollTop) + ((parseInt(gridObj.rowEventHeight) + 6) * eventPerDay);

			eventPerDay = parseInt(eventPerDay) + 1;
			$("#user-" + gridParent + "-left-row-for-break-" + arnIndex).data(dayName, eventPerDay);

			eventStartPosX = eventStartPosX + parseInt(firstColPosX);
			eventEndPosX = eventEndPosX + parseInt(firstColPosX);
			var eventWidth = eventEndPosX - eventStartPosX;
			var eventColor = gridObj.eventColor;
			if (eventObjectInner.eventColor) {
				eventColor = eventObjectInner.eventColor;
			}
			var eventTitle = eventObjectInner.title;
			var id = 'column-event-div-' + aroEvent.id + '-' + eventObjectInner.id;
			var jobStatusName = eventObjectInner.jobStatusName;
			var customerCity = eventObjectInner.customerCity;
			var customerName = eventObjectInner.customerName;
			var primaryName = eventObjectInner.primaryName;
			var jobNo = eventObjectInner.jobNo;
			var jobDesc = eventObjectInner.jobDesc;
			var jobId = eventObjectInner.jobId;
            let jobSubStatus = eventObjectInner.jobSubStatus;
            let jobSubStatusColor = eventObjectInner.jobSubStatusColor;
			var code = eventObjectInner.code;
			var jobCode = eventObjectInner.jobCode;
			var isTimeOff = eventObjectInner.isTimeOff;
			var timeRange = eventObjectInner.timeRange;

			var jobStartDate = '';
			if (typeof eventObjectInner.jobStartDate !== 'undefined') {
				jobStartDate = eventObjectInner.jobStartDate;
			}

			var isRepeating = 0;
			if (typeof eventObjectInner.isRepeating !== 'undefined') {
				isRepeating = eventObjectInner.isRepeating;
			}

			var isRepeatingChild = 0;
			if (typeof eventObjectInner.isRepeatingChild !== 'undefined') {
				isRepeatingChild = eventObjectInner.isRepeatingChild;
			}

			var relPopover;
			var isAssigned;
			var dispatchClass = '';
			isAssigned = aroEvent.userDetails.assigned;
			if (isAssigned == true) {
				relPopover = "rel='popover'";
				dispatchClass = 'dispatch-events-assigned';
				if(rescheduleCompJobs == 0 && ['CLOSED','OPEN_ACTIVE'].indexOf(code) > -1) {
					dispatchClass += ' no-context';
				}
			} else {
				relPopover = "rel='popover'";
				dispatchClass = 'dispatch-events-unassigned';
			}

			var parentWidth = $('#' + gridParent + '-grid-table-right').css('width');
			var parentLeft = $('#' + gridParent + '-grid-table-right').css('left');
			var eventEndPos = parseFloat(eventStartPosX) + parseFloat(eventWidth);
			var eventResize = true;
			var borderRadius = 'border-radius:4px 4px 4px 4px';
			var borderRadiusLeftDiv = 'border-radius:4px 0px 0px 4px';
			var borderRadiusRightDiv = 'border-radius:4px 4px 4px 4px';
			var originalStartMin = 0;
			var originalEndMin = 0;
			var originalDuration = 0;
			var originalStartTime = 0;
			var diffWidth = eventEndPos - parseFloat(parentWidth);


			var leftDiv = "";
			var rightDiv = "";
			var titleDiv = "";
			var titleDivHeight = parseFloat(gridObj.rowEventHeight) - 19;
			durMins = eventWidth - 4;
			var leftDivMargin = '2';
			if (eventObjectInner.code == "TASK") {
				originalDuration = eventObjectInner.originalDuration;
				originalStartTime = eventObjectInner.originalStartTime;
				dispatchClass = dispatchClass + " task-events";

				var eventDivHeight = (titleHeadWeekly) ? gridObj.rowEventHeight : (parseFloat(gridObj.rowEventHeight) - 15) + "px";
				var marginTop = (titleHeadWeekly) ? "17px" : "2px";

				rightDiv = "<div id='" + id + "-inner' style='position:absolute;z-index:4;opacity: .9;filter: alpha(opacity=90);text-align:center;margin-top:" + marginTop + ";margin-left:" + leftDivMargin + "px;width:" + durMins + "px;background:white;color:black;box-sizing:border-box; -moz-box-sizing:border-box;-webkit-box-sizing:border-box;" + borderRadiusRightDiv + ";height:" + titleDivHeight + "px;overflow:hidden;text-overflow:ellipsis;"+(isTimeOff?'white-space:nowrap;':'')+"'></div>";
				titleDiv = "<div class='' id='" + id + "-inner-title-text' style='white-space:nowrap;text-overflow: ellipsis;overflow: hidden;position:absolute;z-index:6;float:left;margin-left:0px;"+(isTimeOff?'':"margin-top:" + marginTop + ";")+"padding-left:5px;width:" + (parseFloat(eventWidth) - 5) + "px;background:rgba(255,255,255,0);color:black;box-sizing:border-box; -moz-box-sizing:border-box;-webkit-box-sizing:border-box;" + borderRadiusLeftDiv + ";height:" + titleDivHeight + "px;'></div>";
			} else {
				var eventDivHeight = (titleHeadWeekly) ? gridObj.rowEventHeight : (parseFloat(gridObj.rowEventHeight) - 15) + "px";
				var marginTop = (titleHeadWeekly) ? "17px" : "2px";

				rightDiv = "<div id='" + id + "-inner' style='position:absolute;z-index:4;opacity: .9;filter: alpha(opacity=90);text-align:center;margin-top:" + marginTop + ";margin-left:" + leftDivMargin + "px;width:" + durMins + "px;background:white;color:black;box-sizing:border-box; -moz-box-sizing:border-box;-webkit-box-sizing:border-box;" + borderRadiusRightDiv + ";height:" + titleDivHeight + "px;'></div>";
				titleDiv = "<div class='' id='" + id + "-inner-title-text' style='white-space:nowrap;text-overflow: ellipsis;overflow: hidden;position:absolute;z-index:6;float:left;margin-left:0px;margin-top:" + marginTop + ";padding-left:5px;width:" + (parseFloat(eventWidth) - 5) + "px;background:rgba(255,255,255,0);color:black;box-sizing:border-box; -moz-box-sizing:border-box;-webkit-box-sizing:border-box;" + borderRadiusLeftDiv + ";height:" + titleDivHeight + "px;'></div>";
			}

			var lineHeightClass = "";
			lineHeightClass = (gridObj.lineNos == 3) ? " dispatch-events-3" : lineHeightClass;
			lineHeightClass = (gridObj.lineNos == 2) ? " dispatch-events-2" : lineHeightClass;
			let iconInvoiced = iconReminders = '';
			if(eventObjectInner.invoiced || eventObjectInner.compCode === '15_PID') {
				iconInvoiced = '<i class="icon-invoiced ' + (eventObjectInner.isPaid ? 'green' : 'gray') + '"></i>';
				lineHeightClass += ' is-invoiced';
			}
			if(eventObjectInner.hasReminders && eventObjectInner.hasReminders > 0) {
				iconReminders = '<i class="icon-reminders-gray"></i>';
				lineHeightClass += ' has-reminders';
			}
			if(isTimeOff)
				dispatchClass += ' time-off';
			if(titleHeadWeekly)
				dispatchClass += ' has-title-head';

			subStatusSpan = (jobSubStatus)
				? "<span class='badge sub-status' style='background-color:"+jobSubStatusColor+"'>"+jobSubStatus+"</span>"
				: '';
			// Main div container
			$("<div rowNo='" + arnIndex + "' dayNo='" + dayNo + "' actualRowIndex='" + actualIndex + "' class='dispatch-events " + dispatchClass + lineHeightClass + " userPopover map-link' data-container='body' data-toggle='modal' " + relPopover +
				"  style='font-size:12px;line-height:14px;color:" + gridObj.eventFontColor + ";cursor:pointer;position:absolute;"+(isTimeOff?'':"background:" + eventColor + ";")+"left:" + eventStartPosX + "px;top:" + eventTop + "px;width:" + eventWidth + "px;height:" + eventDivHeight + ";box-sizing:border-box; -moz-box-sizing:border-box;-webkit-box-sizing:border-box;" + borderRadius +
				"' originalLeft='" + eventStartPosX + "' originalTop='" + eventTop +
				"' id='column-event-div-" + aroEvent.id + '-' + eventObjectInner.id + "'" +
				">" +
				(isTimeOff?'':titleHeadWeekly) + leftDiv + titleDiv + rightDiv + iconInvoiced + "<div class='additional-icons'>" + iconReminders + "</div></div>"
			).appendTo($('#' + gridParent + '-grid-right'));

			$('#column-event-div-' + aroEvent.id + '-' + eventObjectInner.id + ' .icon-reminders-gray').tooltip({
				animation: true,
				placement: 'top',
				title: (eventObjectInner.isJob ? 'Job' : 'Estimate') + ' has reminders'
			});
			// subStatusSpan = '';

            eventTitle = subStatusSpan ? (eventTitle + "</br>" + subStatusSpan) : eventTitle;

			if (eventObjectInner.code == "TASK") {
				if(isTimeOff){
					$("#"+id+"-inner").css('margin-bottom','2px').html(jobDesc);
					$("#" + id + "-inner-title-text").html(eventTitle + timeRange);
				}else{
					$("#" + id + "-inner-title-text").html(eventTitle);
				}
			} else {
				if (eventObjectInner.arrivalDiff <= 0) {
					eventTitle = "";
				}
				if(eventTitle.trim().substring(0, 5) != '<del>')
					eventTitle = '<span class="dtitle">'+eventTitle+'</span>';
				$("#" + id + "-inner-title-text").html(eventTitle);
			}

			var eventDataObject = {
				lat: eventObjectInner.lat,
				lng: eventObjectInner.lng,
				address: eventObjectInner.address ? eventObjectInner.address : '',
				'multiDay': multiDay,
				unscheduled: false,
				'eventId': id,
				'visitId': visitId,
				'isVisit': isVisit,
				'id': eventObjectInner.id,
				'jobId': jobId,
				'jobStartDate': jobStartDate,
				'isRepeating': isRepeating,
				'isRepeatingChild': isRepeatingChild,
				calJobId: eventObjectInner.calJobId,
				taskId: eventObjectInner.taskId,
				assigned: aroEvent.userDetails.assigned,
				'userId': aroEvent.id,
				'newUserId': aroEvent.id,
				'startMin': startMin,
				'endMin': endMin,
				'duration': duration,
				'arrivalDiff': eventObjectInner.arrivalDiff,
				'jobLocation': customerCity,
				'eventColor': eventColor,
				'jobStatusName': jobStatusName,
				'customerName': customerName,
				'primaryName': primaryName,
				'jobNo': jobNo,
				'jobDesc': jobDesc,
				'code': code,
				'jobCode': jobCode,
				'previousDay': eventObjectInner.previousDay,
				'originalStartMin': originalStartMin,
				'originalEndMin': originalEndMin,
				'originalDuration': originalDuration,
				'originalStartTime': originalStartTime,
				'changeDate': false,
				'isCompleted': isCompleted,
				startDateFlag: eventObjectInner.startDateFlag,
				endDateFlag: eventObjectInner.endDateFlag,
				isTimeOff: isTimeOff,
				time: eventObjectInner.time,
			};

			if (eventObjectInner.address) {
				eventDataObject.address = eventObjectInner.address;
			}

			if (eventObjectInner.lat && eventObjectInner.lng) {
				eventDataObject.lat = eventObjectInner.lat;
				eventDataObject.lng = eventObjectInner.lng;
			}

			$('#' + id).data('eventData', eventDataObject);

			$('#' + id).css('zIndex', 2);
			if (isCompleted == '10_CMP') {
				$('#' + id).css('zIndex', 1);
			}
			/*if(eventObjectInner.code=="TASK" && eventObjectInner.startDateFlag){
				gridObj.setDraggableEventWeek(aroEvent.id,eventObjectInner.id);
			}
			else if(eventObjectInner.code!="TASK"){
				gridObj.setDraggableEventWeek(aroEvent.id,eventObjectInner.id);
			}*/
			gridObj.setDraggableEventWeek(aroEvent.id, eventObjectInner.id);
		}
	};

	this.setResizableEvent = function (arsEventId, arsEventObjInnerId) {
		let gridObj = this;

		jobCode = $("#column-event-div-" + arsEventId + '-' + arsEventObjInnerId).data('eventData').jobCode;

		$("#column-event-div-" + arsEventId + '-' + arsEventObjInnerId).resizable({
			//alsoResize: "#mirror" ,
			//containment : gridObj.parent,
			handles: "e",
			containment: "parent",
			start: function (event, ui) {
				$(".popover").remove();
				resizeTrue = 1;
				var width = ui.element.css('width');
				ui.element.attr('initialWidth', width);
				ui.element.css({
					position: 'absolute',
					top: ui.element.attr('originalTop') + 'px',
					left: ui.element.attr('originalLeft') + 'px'
				});
				//ui.element.css({ position: 'absolute', left: ui.element.attr('originalLeft')+'px' });
			},
			resize: function (event, ui) {
				ui.element.css({
					position: 'absolute',
					top: ui.element.attr('originalTop') + 'px',
					left: ui.element.attr('originalLeft') + 'px'
				});
				// resizeTrue = 0;
				//ui.element.css({ position: 'absolute', left: ui.element.attr('originalLeft')+'px' });
			},
			stop: function (event, ui) {
				jobCode = $("#column-event-div-" + arsEventId + '-' + arsEventObjInnerId).data('eventData').jobCode;
				//console.log(jobCode);
				var isCompleted = $("#column-event-div-" + arsEventId + '-' + arsEventObjInnerId).data('eventData').isCompleted;
				if (isCompleted == '10_CMP') {
					jobCode = '10_CMP';
				}
				if (jobCode == '10_CMP' && rescheduleCompJobs == '0') {
					$.msgbox("This job is completed so could not change time");
					ui.element.css('width', ui.element.attr('initialWidth'));
					return false;
				}
				ui.element.css({
					position: 'absolute',
					top: ui.element.attr('originalTop') + 'px',
					left: ui.element.attr('originalLeft') + 'px'
				});

				var id = ui.element.attr('id');
				var endPixel = parseFloat(ui.element.position().left) + ui.element.width();
				var startMin = $('#' + id).data('eventData').startMin;
				var endMin = calculateGridPixelTime(endPixel);
				var oldDuration = $('#' + id).data('eventData').duration;
				var duration = (endMin - startMin) * 60;
				if ($('#' + id).data('eventData').previousDay) {
					var newDuration = parseFloat(duration) - parseFloat(oldDuration);//console.log('newDuration = '+newDuration);
					duration = newDuration;
				}
				$('#' + id).data('eventData').duration = duration;
				$('#' + id).data('eventData').endMin = endMin;
				gridObj.calculateStartTimeAndDuration(id, 'resize');

				$('#' + id).data('eventData').divideDuration = false;
				gridObj.updateDrag($('#' + id).data('eventData'), 'resize');
			}
		});
	};

	/* Methods..................*/

	this.getTimeIntervals = getTimeIntervals;
	this.getTimeIntervalsForColumn = getTimeIntervalsForColumn;
	this.getDayIntervals = getDayIntervals;
	this.getDayName = getDayName;
	this.getDayNameWeekView = getDayNameWeekView;
	this.getMonthName = getMonthName;
	this.calculateGridPixelTime = calculateGridPixelTime;
	this.updateDrag = updateDrag;
	this.calculateStartTimeAndDuration = calculateStartTimeAndDuration;
	this.bindEvents = bindEvents;

	this.setDraggableEvent = setDraggableEvent;
	this.setDraggableEventWeek = setDraggableEventWeek;

	this.createRowForOverlapping = createRowForOverlapping;
	this.createRowForOverlappingNew = createRowForOverlappingNew;
	this.adjustEventsTop = adjustEventsTop;

	gridObj = this;

	globalScroll = 0;
	dispatchView = this.view;
	dispatchdailyGridLayout = this.dailyGridLayout;

	overlappArray = [];
}

function createContextMenuOnEvents(arsClass) {
	context.attach('.' + arsClass, [
		{header: 'OPTIONS:'},
		{
			text: 'Clear Tech(s) Assigned', action: function (e) {
				selectContextMenuOnEvents('techs');
			}
		},
		{
			text: 'Clear Date(s)', action: function (e) {
				selectContextMenuOnEvents('date');
			}
		},
		{
			text: 'Clear Time(s)', action: function (e) {
				selectContextMenuOnEvents('time');
			}
		},
		{
			text: 'Clear Date(s) & Time(s)', action: function (e) {
				selectContextMenuOnEvents('datetime');
			}
		},
		{
			text: 'Clear All', action: function (e) {
				selectContextMenuOnEvents('all');
			}
		},
	]);

	context.settings({compress: true});
}

function selectContextMenuOnEvents(arsOption) {
	var id = (typeof ($('#' + contextMenuClickedId).parent() != 'undefined')) ? $('#' + contextMenuClickedId).parent().attr('id') : "";
	id = (contextMenuClickedId) ? id : contextMenuClickedIdChild;
	contextMenuClickedId = (contextMenuClickedId) ? contextMenuClickedId : contextMenuClickedIdChild;

	// Updates an event data
	var clearEventData = function (jobId, isVisit, visitId, arsOption, code, updateChildrenJobs, exceptJobs) {
		var $loader = $('#loader').show();
		$.ajax({
			url: baseUrl + "/dispatch/clearEventData",
			type: 'POST',
			data: {
				jobId: jobId,
				isVisit: isVisit,
				visitId: visitId,
				option: arsOption,
				code: code,
				updateChildrenJobs: updateChildrenJobs ? 1 : 0,
				exceptJobs: exceptJobs || ''
			},
			success: function () {
				$loader.hide();
				filterDispatchGrid();
			},
			error: function () {
				$loader.hide();
				$.msgbox('An error occurs while updating, please try again later.', {}, function () {
					filterDispatchGrid();
				});
			}
		});
	};

	/**
	 * Clear task attributes
	 * @param taskId
	 * @param arsOption
	 * @param repeat_choice 0 - current, 1 - following, 2 - all
	 */
	var clearTaskEventData = function (taskId, arsOption, dispatch_date, repeat_choice) {
		var $loader = $('#loader').show();
		$.ajax({
			url: baseUrl + "/dispatch/clearTaskEventData",
			type: 'POST',
			data: {
				taskId: taskId,
				option: arsOption,
				dispatch_date: dispatch_date,
				repeat_choice: repeat_choice
			},
			success: function () {
				$loader.hide();
				filterDispatchGrid();
			},
			error: function () {
				$loader.hide();
				$.msgbox('An error occurs while updating, please try again later.', {}, function () {
					filterDispatchGrid();
				});
			}
		});
	};

	if (id) {
		var eventData = {
			jobId: "",
			isVisit: "",
			visitId: "",
			code: "",
			taskId: ""
		};
		$.extend(eventData, $('#' + id).data('eventData') || {});

		var jobId = eventData.jobId;
		var isVisit = eventData.isVisit;
		var visitId = (isVisit == 1) ? eventData.visitId : 0;
		var code = eventData.code;

		if (eventData.code === 'TASK') {
			jobId = eventData.taskId;
			isVisit = "";
			visitId = "";
			code = 'TASK';
		} else if ($('#' + contextMenuClickedId).hasClass('task-events')) {
			id = contextMenuClickedId;
			jobId = (typeof ($('#' + id).data('eventData')) != 'undefined') ? $('#' + id).data('eventData').taskId : "";
			isVisit = "";
			visitId = "";
			code = 'TASK';
		}

		var isRepeating = 0;
		if (typeof eventData.isRepeating !== 'undefined') {
			isRepeating = eventData.isRepeating;
		}

		var isRepeatingChild = 0;
		if (typeof eventData.isRepeatingChild !== 'undefined') {
			isRepeatingChild = eventData.isRepeatingChild;
		}

		// A repeating job has been changed
		if (code === 'TASK') {
			if (isRepeating === 1) {
				$.msgbox(
					"Would you like to change only this event, all following events in the series, or all events in the series?",
					{
						type: "confirm",
						buttons: [
							{type: "submit", value: "Only this"},
							{type: "submit", value: "Following"},
							{type: "submit", value: "All"},
							{type: "submit", value: "Cancel"}
						]
					},
					function (result) {
						if (result === 'Only this') {
							clearTaskEventData(jobId, arsOption, eventData.jobStartDate, 0);
						} else if (result === "Following") {
							if ((arsOption === 'date') || (arsOption === 'datetime') || (arsOption === 'all')) {
								$.msgbox("You are trying to unschedule a repeating task, it will stop repeating. Are you sure you want to stop repeating this task? Doing this will not affect any past events.", {
										type: "confirm",
										buttons: [
											{type: "submit", value: "Yes"},
											{type: "submit", value: "No"}
										]
									}, function (result) {
										if (result === 'Yes') {
											clearTaskEventData(jobId, arsOption, eventData.jobStartDate, 1);
										} else {
											filterDispatchGrid();
										}
									}
								);
							} else {
								clearTaskEventData(jobId, arsOption, eventData.jobStartDate, 1);
							}
						} else if (result === "All") {
							if ((arsOption === 'date') || (arsOption === 'datetime') || (arsOption === 'all')) {
								$.msgbox("You are trying to unschedule a repeating task, it will stop repeating. Are you sure you want to stop repeating this task?", {
										type: "confirm",
										buttons: [
											{type: "submit", value: "Yes"},
											{type: "submit", value: "No"}
										]
									}, function (result) {
										if (result === 'Yes') {
											clearTaskEventData(jobId, arsOption, eventData.jobStartDate, 2);
										} else {
											filterDispatchGrid();
										}
									}
								);
							} else {
								clearTaskEventData(jobId, arsOption, eventData.jobStartDate, 2);
							}
						} else {
							filterDispatchGrid();
						}
					}
				);
			} else {
				clearTaskEventData(jobId, arsOption, eventData.jobStartDate, 2);
			}
		} else if ((isVisit != 1) && (isRepeating === 1)) {
			if ((arsOption === 'techs') || (arsOption === 'time')) {
				// User/Times has been changed
				$.msgbox(
					"You have changed a repeating job. Do you want to make changes to all future repeating jobs as well?",
					{
						type: "confirm",
						buttons: [
							{type: "submit", value: "All Future Jobs"},
							{type: "submit", value: "Only This Job"},
							{type: "submit", value: "Cancel"}
						]
					},
					function (result) {
						if (result === 'All Future Jobs') {
							// jobs.childrenChangesDialogConfirm.js
							jobsChildrenChangesDialogConfirm_dispatchGridClearData(
								jobId, arsOption,
								function (exceptJobs) {
									clearEventData(jobId, isVisit, visitId, arsOption, code, true, exceptJobs || '');
								},
								function () {
									filterDispatchGrid();
								}
							);
						} else if (result === "Only This Job") {
							clearEventData(jobId, isVisit, visitId, arsOption, code, false);
						} else {
							filterDispatchGrid();
						}
					}
				);
			} else if (isRepeatingChild === 0) {
				$.msgbox("You are trying to unschedule a repeating job, it will stop repeating. Are you sure you want to stop repeating this job? Doing this will not affect any past jobs.", {
						type: "confirm",
						buttons: [
							{type: "submit", value: "Yes"},
							{type: "submit", value: "No"}
						]
					}, function (result) {
						if (result === 'Yes') {
							confirmIfExistRecurringTemplateByJob(jobId, 'children').done(function(confirmed) {
								if (confirmed) {
									clearEventData(jobId, isVisit, visitId, arsOption, code, true);
								} else {
									filterDispatchGrid();
								}
							}).fail(function() {
								filterDispatchGrid();
							});
						} else {
							filterDispatchGrid();
						}
					}
				);
			} else {
				clearEventData(jobId, isVisit, visitId, arsOption, code, false);
			}
		} else {
			clearEventData(jobId, isVisit, visitId, arsOption, code, false);
		}
	}
}

function unSetResizableEvent(arsEventId, arsEventObjInnerId) {
	$("#column-event-div-" + arsEventId + '-' + arsEventObjInnerId).resizable("destroy");
}

function unSetDraggableEvent(arsEventId, arsEventObjInnerId) {
	$("#column-event-div-" + arsEventId + '-' + arsEventObjInnerId).draggable("destroy");
}

function setDraggableEvent(arsEventId, arsEventObjInnerId) {
	gridObj = this;
	$("#column-event-div-" + arsEventId + '-' + arsEventObjInnerId).draggable({
		//containment : gridObj.parent,
		revert: 'invalid',
		scroll: false,
		zIndex: 9999999,
		helper: 'clone',
		appendTo: 'body',
		drag: function (event, ui) {
			var helperLeft = ui.helper.position().left;
			var helperTop = ui.helper.position().top;
			var scrollLeft = $('#' + gridObj.parent).scrollLeft();
			var parentLeft = $('#' + gridObj.parent).offset().left;
			var parentTop = $('#' + gridObj.parent).parent().offset().top;
			var parentWidth = $('#' + gridObj.parent).css('width');
			var parentHeight = $('#' + gridObj.parent).parent().css('height');
			if (helperLeft > (parseInt(parentLeft) + parseInt(parentWidth)) || helperTop < parentTop || helperTop > (parseInt(parentTop) + parseInt(parentHeight))) {
				return;
			}
			var actualLeft = (parseInt(helperLeft) - parseInt(parentLeft)) + parseInt(scrollLeft);
			var toolTipTime = gridObj.calculateGridPixelTime(actualLeft, 'T');
			//$('#column-event-div-'+arsEventId+'-'+arsEventObjInnerId).attr('title',toolTipTime);
		},
		start: function (event, ui) {
			var eventLeft = $(this).offset().left;
			var eventTop = $(this).offset().top;
			var gridParent = $('#' + gridObj.parent).parent().attr('id');
			var childs = $('#' + gridParent).children();
			var assignedDivId = childs[0].id;
			var unAssignedDivId = childs[1].id;
			var parentLeft = $('#' + gridParent).offset().left;
			var parentTop = $('#' + gridParent).offset().top;
			var parentWidth = $('#' + gridParent).css('width');
			parentWidth = parseInt(parentWidth) - 290;
			var assignedHeight = $('#' + assignedDivId).css('height');
			var unAssignedHeight = $('#' + unAssignedDivId).css('height');
			var parentHeight = parseInt(assignedHeight) + parseInt(unAssignedHeight);
			eventLeft = eventLeft - parentLeft;
			eventTop = (eventTop - parentTop) - 23;
			eventTopEnd = eventTop + ((20 * gridObj.lineNos) + 3);
			var eventWidth = $(this).css('width');
			var eventEndPos = eventLeft + parseFloat(eventWidth);
            var eventData = $("#column-event-div-" + arsEventId + '-' + arsEventObjInnerId).data('eventData');

			var isCompleted = eventData.isCompleted;
			var jobCode = eventData.jobCode;
			if (isCompleted == '10_CMP') {
				jobCode = '10_CMP';
			}
            if(rescheduleCompJobs == '0' && (['ESTIMATE','OPEN_ACTIVE'].indexOf(eventData.code) > -1 || jobCode == '10_CMP')) {
                gridObj.displayRescheduleMessages(jobCode, eventData.code);
                return false;
            }

			gridObj.droppedCols = [];
			$(this).hide();
		},
		stop: function (event, ui) {
			if ($('#dispatch-grid-div-unscheduled-right').attr("unscheduled") == 'true') {
				$(this).show();
				$('#dispatch-grid-div-unscheduled-right').attr("unscheduled", "");
				var droppedEventLeft = ui.helper.position().left;
				var droppedEventTop = ui.helper.position().top;
				var parentDivOffsetLeft = $('#dispatch-grid-div-unscheduled-right').offset().left;
				var parentDivOffsetTop = $('#dispatch-grid-div-unscheduled-right').offset().top;
				droppedEventTop = droppedEventTop - parentDivOffsetTop;
				droppedEventLeft = droppedEventLeft - parentDivOffsetLeft;
				$(this).appendTo("#dispatch-grid-div-unscheduled-right");
				$(this).css('position', 'absolute');
				$(this).css('zIndex', 99999999);
				$(this).css('left', droppedEventLeft + "px");
				$(this).css('top', droppedEventTop + "px");

				return;
			}
			$(this).show();
			var id = ui.helper.context.id;
			var endPixel = parseFloat(ui.helper.position().left) + ui.helper.width();
			var endMin = calculateGridPixelTime(endPixel);
			$('#' + id).data('eventData').endMin = endMin;
			if (gridObj.updateEvent) {
				gridObj.calculateStartTimeAndDuration(id, 'drag');
				$('#' + id).data('eventData').divideDuration = (dispatchdailyGridLayout == "12") ? true : false;
				gridObj.updateDrag($('#' + id).data('eventData'));
				gridObj.updateEvent = false;
			}
		},
	});
}

function setDraggableEventWeek(arsEventId, arsEventObjInnerId) {
	gridObj = this;
	$("#column-event-div-" + arsEventId + '-' + arsEventObjInnerId).draggable({
		//containment : gridObj.parent,
		revert: 'invalid',
		scroll: false,
		zIndex: 9999999,
		helper: 'clone',
		appendTo: 'body',
		drag: function (event, ui) {
			var helperLeft = ui.helper.position().left;
			var helperTop = ui.helper.position().top;

			var idForHover;
			var left = helperLeft;
			var top = helperTop;
			$('.grid-columns-false').each(function () {
				var id = $(this).attr("id");
				var colLeft = parseFloat($("#" + id).offset().left);
				var colTop = parseFloat($("#" + id).offset().top);
				var rightEnd = colLeft + parseFloat($("#" + id).width());
				var bottomEnd = colTop + parseFloat($("#" + id).height());
				idForHover = ((colLeft <= left && left <= rightEnd) && (colTop <= top && top <= bottomEnd)) ? id : idForHover;

			});
			$('.grid-columns-true').each(function () {
				var id = $(this).attr("id");
				var colLeft = parseFloat($("#" + id).offset().left);
				var colTop = parseFloat($("#" + id).offset().top);
				var rightEnd = colLeft + parseFloat($("#" + id).width());
				var bottomEnd = colTop + parseFloat($("#" + id).height());

				var droppedColParentDiv = $('#' + id).parent().parent().parent().parent().parent().parent().attr('id');
				var droppedColParentGrid = $('#' + id).parent().parent().parent().parent().parent().attr('id');
				var parentDivTop = $("#" + droppedColParentGrid).offset().top;
				var droppedColTop = $("#" + id).offset().top;
				if ((parseFloat(droppedColTop)) < parseFloat(parentDivTop)) {
					return true;
				}
				idForHover = ((colLeft <= left && left <= rightEnd) && (colTop <= top && top <= bottomEnd)) ? id : idForHover;

			});
			$('.grid-columns-false').removeClass('dispatch-droppable-hover');
			$('.grid-columns-true').removeClass('dispatch-droppable-hover');
			var userAttr = $("#" + idForHover).attr("userRowAttr");
			$("[userRowAttr=" + userAttr + "]").addClass('dispatch-droppable-hover');

			var scrollLeft = $('#' + gridObj.parent).scrollLeft();
			var parentLeft = $('#' + gridObj.parent).offset().left;
			var parentTop = $('#' + gridObj.parent).parent().offset().top;
			var parentWidth = $('#' + gridObj.parent).css('width');
			var parentHeight = $('#' + gridObj.parent).parent().css('height');
			if (helperLeft > (parseInt(parentLeft) + parseInt(parentWidth)) || helperTop < parentTop || helperTop > (parseInt(parentTop) + parseInt(parentHeight))) {
				return;
			}
			var actualLeft = (parseInt(helperLeft) - parseInt(parentLeft)) + parseInt(scrollLeft);
		},
		start: function (event, ui) {

			var eventLeft = $(this).offset().left;
			var eventTop = $(this).offset().top;
			var gridParent = $('#' + gridObj.parent).parent().attr('id');
			var childs = $('#' + gridParent).children();
			var assignedDivId = childs[0].id;
			var unAssignedDivId = childs[1].id;
			var parentLeft = $('#' + gridParent).offset().left;
			var parentTop = $('#' + gridParent).offset().top;
			var parentWidth = $('#' + gridParent).css('width');
			parentWidth = parseInt(parentWidth) - 290;
			var assignedHeight = $('#' + assignedDivId).css('height');
			var unAssignedHeight = $('#' + unAssignedDivId).css('height');
			var parentHeight = parseInt(assignedHeight) + parseInt(unAssignedHeight);
			eventLeft = eventLeft - parentLeft;
			eventTop = (eventTop - parentTop) - 23;
			//eventTopEnd = eventTop + 43;
			eventTopEnd = eventTop + ((20 * gridObj.lineNos) + 3);
			var eventWidth = $(this).css('width');
			var eventEndPos = eventLeft + parseFloat(eventWidth);
			var eventData = $("#column-event-div-" + arsEventId + '-' + arsEventObjInnerId).data('eventData');
			var multiDay = eventData.multiDay;
			var itemType = eventData.code;
			if (itemType == "TASK") {
				var itemName =  eventData.isTimeOff ? "time off" : "task";
			} else {
				var itemName = "job";
			}
			if (multiDay) {
				$.msgbox("A multi-day " + itemName + " cannot be modified from the Weekly Dispatch view. Please edit the " + itemName + " instead.");
				return false;
			}

			var isCompleted = eventData.isCompleted;
			var jobCode = eventData.jobCode;
			if (isCompleted == '10_CMP') {
				jobCode = '10_CMP';
			}
            if(rescheduleCompJobs == '0' && (['ESTIMATE','OPEN_ACTIVE', 'CLOSED'].indexOf(eventData.code) > -1 || jobCode == '10_CMP')) {
                gridObj.displayRescheduleMessages(jobCode, eventData.code);
                return false;
            }

			gridObj.droppedCols = [];
			$(this).hide();
		},
		stop: function (event, ui) {
			$(this).show();
			var id = ui.helper.context.id;
			var endPixel = parseFloat(ui.helper.position().left) + ui.helper.width();
			//var endMin = calculateGridPixelTime(endPixel);
			//$('#'+id).data('eventData').endMin = endMin;
			if (gridObj.updateEvent) {
				//gridObj.calculateStartTimeAndDuration(id,'drag');//console.log($('#'+id).data('eventData'));//return;
				gridObj.updateDrag($('#' + id).data('eventData'));
				gridObj.updateEvent = false;
			}
		},
	});
}

function dispatchDroppableColumns() {
	$(".grid-columns-true").droppable({
		accept: function (draggable) {
			return !$(draggable).hasClass("modal");
		},
		/** tolerance:fit means, the moveable object has to be inside the dropable object area **/
		tolerance: 'touch',
		hoverClass: "ui-state-active",
		/** This is the drop event, when the draggable object is moved on the top of the dropable object area **/
		drop: function (event, ui) {
			$('.grid-columns-false').removeClass('dispatch-droppable-hover');
			$('.grid-columns-true').removeClass('dispatch-droppable-hover');

			gridObj.droppedCols.push($(this).attr('id'));
			var droppedColParentDiv;
			var droppedColParentGrid;
			var divScrollTop = 0;
			var divScrollLeft = 0;
			var visibleDivBottom;
			var droppedColTop;
			var droppedColBottom;
			var parentDivTop;
			var droppedColId = "";

			$.each(gridObj.droppedCols, function (index, values) {
				droppedColParentDiv = $('#' + gridObj.droppedCols[index]).parent().parent().parent().parent().parent().parent().attr('id');
				droppedColParentGrid = $('#' + gridObj.droppedCols[index]).parent().parent().parent().parent().parent().attr('id');

				divScrollTop = $('#' + droppedColParentGrid).scrollTop();
				divScrollLeft = $('#' + droppedColParentGrid).scrollLeft();

				parentDivTop = $("#" + droppedColParentGrid).offset().top;

				droppedColId = gridObj.droppedCols[index];

				droppedColTop = $("#" + droppedColId).offset().top;

				if ((parseFloat(droppedColTop)) < parseFloat(parentDivTop)) {
					droppedColId = "";
					return true;
				}
				return false;
			});

			gridObj.droppedCols = [];

			if (!droppedColId) {
				return;
			}

			droppedColParentDiv = $('#' + droppedColId).parent().parent().parent().parent().parent().parent().attr('id');
			droppedColParentGrid = $('#' + droppedColId).parent().parent().parent().parent().parent().attr('id');
			divScrollTop = $('#' + droppedColParentGrid).scrollTop();
			divScrollLeft = $('#' + droppedColParentGrid).scrollLeft();

			parentDivTop = $("#" + droppedColParentGrid).offset().top;
			parentDivTop = parentDivTop + divScrollTop;

			visibleDivBottom = parentDivTop + $("#" + droppedColParentGrid).height();

			droppedColTop = $("#" + droppedColId).offset().top;
			droppedColBottom = droppedColTop + $("#" + droppedColId).height();

			/***********************************************************************************************/
			if ((parseInt(droppedColTop) + parseInt(divScrollTop)) >= visibleDivBottom) {
				ui.draggable.css('left', ui.draggable.attr('originalLeft') + "px");
				ui.draggable.css('top', ui.draggable.attr('originalTop') + "px");
				return false;
			}
			var droppedColLeft = $('#' + droppedColId).position().left + divScrollLeft;
			var droppedColTop = $('#' + droppedColId).position().top + divScrollTop;
			var droppedColWidth = parseInt($('#' + droppedColId).css('width'));
			var droppedColHeight = parseInt($('#' + droppedColId).css('height'));
			var droppedColLeftEnd = droppedColLeft + droppedColWidth;
			var droppedColTopEnd = droppedColTop + droppedColHeight;
			var droppedEventLeft = ui.helper.position().left;
			var droppedEventTop = ui.helper.position().top;
			var parentDivOffsetLeft = $('#' + droppedColParentDiv).offset().left;

			var parentDivOffsetTop = $('#' + droppedColParentDiv).offset().top;
			droppedEventTop = droppedEventTop - parentDivOffsetTop;

			droppedEventLeft = droppedEventLeft - $('#' + droppedColParentGrid).offset().left;
			droppedEventTop = droppedEventTop + divScrollTop;
			if ($('#' + droppedColParentDiv).attr('assigned') == 'true') {
				droppedEventTop = droppedEventTop - 44;
			} else {
				droppedEventTop = droppedEventTop;
			}

			droppedEventLeft = droppedEventLeft + divScrollLeft;
			var droppedEventHeight = ui.helper.css('height');
			var droppedEventTopEnd = parseInt(droppedEventTop) + parseInt(droppedEventHeight);
			droppedColLeft = droppedColLeft - 2;
			if (droppedColLeft <= droppedEventLeft && droppedEventLeft <= droppedColLeftEnd && droppedColTop <= droppedEventTop) {
				/***********************************************************************************************/
				ui.draggable.appendTo("#" + droppedColParentGrid);
				ui.draggable.attr('originalLeft', droppedEventLeft);
				ui.draggable.attr('originalTop', droppedEventTop);
				ui.draggable.css('left', droppedEventLeft + "px");
				ui.draggable.css('top', droppedEventTop + "px");
				var userId = $('#' + droppedColId).data('columnData').user;
				ui.draggable.data('eventData').newUserId = userId;
				if (gridObj.view == 'W') {
					var date = $('#' + droppedColId).data('columnData').date;
					date = date.getFullYear() + '/' + (parseInt(date.getMonth()) + 1) + '/' + date.getDate();
					ui.draggable.data('eventData').date = date;
				}
				gridObj.updateEvent = true;

				ui.draggable.css('position', 'absolute');
			} else {
				ui.draggable.css('left', ui.draggable.attr('originalLeft') + "px");
				ui.draggable.css('top', ui.draggable.attr('originalTop') + "px");
			}
		}
	});

	$(".grid-columns-false").droppable({
		accept: function (draggable) {
			return !$(draggable).hasClass("modal");
		},
		/** tolerance:fit means, the moveable object has to be inside the dropable object area **/
		tolerance: 'touch',
		/** This is the drop event, when the draggable object is moved on the top of the dropable object area **/
		drop: function (event, ui) {
			$('.grid-columns-false').removeClass('dispatch-droppable-hover');
			$('.grid-columns-true').removeClass('dispatch-droppable-hover');

			gridObj.droppedCols.push($(this).attr('id'));
			var droppedColParentDiv;
			var droppedColParentGrid;
			var divScrollTop = 0;
			var divScrollLeft = 0;
			var visibleDivBottom;
			var droppedColTop;
			var droppedColBottom;
			var parentDivTop;
			var droppedColId = gridObj.droppedCols[0];

			droppedColParentDiv = $('#' + gridObj.droppedCols[0]).parent().parent().parent().parent().parent().parent().attr('id');
			droppedColParentGrid = $('#' + gridObj.droppedCols[0]).parent().parent().parent().parent().parent().attr('id');
			divScrollTop = $('#' + droppedColParentGrid).scrollTop();
			divScrollLeft = $('#' + droppedColParentGrid).scrollLeft();

			parentDivTop = $("#" + droppedColParentGrid).offset().top;
			parentDivTop = parentDivTop + divScrollTop;

			droppedColId = gridObj.droppedCols[0];

			visibleDivBottom = parentDivTop + $("#" + droppedColParentGrid).height();

			droppedColTop = $("#" + droppedColId).offset().top;
			droppedColBottom = droppedColTop + $("#" + droppedColId).height();
			var droppedEventLeft = ui.helper.position().left;
			var droppedEventTop = ui.helper.position().top;
			/***********************************************************************************************/
			if (
				(parseInt(droppedColTop) + parseInt(divScrollTop)) >= visibleDivBottom ||
				(droppedEventTop + parseInt(divScrollTop)) >= visibleDivBottom
			) {
				ui.draggable.css('left', ui.draggable.attr('originalLeft') + "px");
				ui.draggable.css('top', ui.draggable.attr('originalTop') + "px");
				return false;
			}
			var droppedColLeft = $('#' + droppedColId).position().left + divScrollLeft;
			var droppedColTop = $('#' + droppedColId).position().top + divScrollTop;
			var droppedColWidth = parseInt($('#' + droppedColId).css('width'));
			var droppedColHeight = parseInt($('#' + droppedColId).css('height'));
			var droppedColLeftEnd = droppedColLeft + droppedColWidth;
			var droppedColTopEnd = droppedColTop + droppedColHeight;
			var parentDivOffsetLeft = $('#' + droppedColParentDiv).offset().left;

			var parentDivOffsetTop = $('#' + droppedColParentDiv).offset().top;
			droppedEventTop = droppedEventTop - parentDivOffsetTop;

			droppedEventLeft = droppedEventLeft - $('#' + droppedColParentGrid).offset().left;
			droppedEventTop = droppedEventTop + divScrollTop;
			if ($('#' + droppedColParentDiv).attr('assigned') == 'true') {
				droppedEventTop = droppedEventTop - 44;
			} else {
				droppedEventTop = droppedEventTop;
			}

			droppedEventLeft = droppedEventLeft + divScrollLeft;
			var droppedEventHeight = ui.helper.css('height');
			var droppedEventTopEnd = parseInt(droppedEventTop) + parseInt(droppedEventHeight);
			droppedColLeft = droppedColLeft - 2;
			if (droppedColLeft <= droppedEventLeft && droppedEventLeft <= droppedColLeftEnd && droppedColTop <= droppedEventTop) {
				/***********************************************************************************************/
				ui.draggable.appendTo("#" + droppedColParentGrid);
				ui.draggable.attr('originalLeft', droppedEventLeft);
				ui.draggable.attr('originalTop', droppedEventTop);
				ui.draggable.css('left', droppedEventLeft + "px");
				ui.draggable.css('top', droppedEventTop + "px");
				var userId = $('#' + droppedColId).data('columnData').user;
				ui.draggable.data('eventData').newUserId = userId;
				if (gridObj.view == 'W') {
					var date = $('#' + droppedColId).data('columnData').date;
					date = date.getFullYear() + '/' + (parseInt(date.getMonth()) + 1) + '/' + date.getDate();
					ui.draggable.data('eventData').date = date;
				}
				gridObj.updateEvent = true;

				ui.draggable.css('position', 'absolute');
			} else {
				ui.draggable.css('left', ui.draggable.attr('originalLeft') + "px");
				ui.draggable.css('top', ui.draggable.attr('originalTop') + "px");
			}

		}
	});
}

var statusListIntervals = {};
function loadJobStatusList($el, jobId, userId, visitId) {
	for(let k in statusListIntervals) {
		if(!$('#'+k)[0]) {
			clearTimeout(statusListIntervals[k]);
			delete statusListIntervals[k];
		}
	}
	if (!globalAjaxInstances['jobStatusList']) {
		$el.find('.popover .popover-content')
			.empty()
			.append($('<table class="table table-striped">\
				<thead><tr><td>Status</td><td style="border-top:0">Created At</td></tr></thead>\
				<tbody><tr class="row-loader"><td colspan="2"><img src="' + baseUrl + '/template/assets/images/preloaders/13.gif"></td></tr></tbody>\
			</table>'));
		var $tableBody = $el.find('.popover .popover-content table > tbody');
		let data = {'jobId': jobId, 'userId': userId};
		if(visitId)
			data.visitId = visitId;
		globalAjaxInstances['jobStatusList'] = $.ajax({
			url: baseUrl + '/jobs/loadJobRollbackStatusChanges'+(visitId?'Visits':''),
			data: data,
			type: 'post',
			dataType: 'json',
			success: function (data) {
				$tableBody.empty();
				if(data.length) {
					for (let k in data) {
						let $tr = $('<tr></tr>');
						$tr.append($('<td><div>' + $('<div/>').text(data[k].name).html() + '</div></td>'));
						$tr.append($('<td>' + data[k].created_at + '</td>'));
						$tableBody.append($tr);
					}
				}
				delete globalAjaxInstances['jobStatusList'];
			},
			error: function (response) {
				delete globalAjaxInstances['jobStatusList'];
			},
		});
	}
}
function onIconTimeHover(jobId, userId, visitId) {
	let $el = $(event.target);
	if(!$el.hasClass('icon-time'))
		$el = $el.parents('.icon-time');
	if (!$el[0] || $el.find('.popover:visible')[0]) {
		return;
	}
	$el.find('.popover').css('display', 'block').popover('show');
	loadJobStatusList($el, jobId, userId, visitId);
	if (!$el.data('load-job-status-list-interval')) {
		if(!$el.attr('id')) {
			$el.attr('id', 'icon-time-'+Math.random().toString(36).replace(/[^a-z]+/g, '-'));
		}
		let interval = setInterval(function () {
			loadJobStatusList($el, jobId, userId, visitId);
		}, 60000);
		statusListIntervals[$el.attr('id')] = interval;
		$el.data('load-job-status-list-interval', interval);
	}
}
if(!$('body').data('popoverclosinglisteneradded')) {
	$(document).bind('click', function (e) {
		let $target = $(e.target);
		$children = $('.popover.dispatch-status-list:visible');
		$children.each(function() {
			if(!$(this)[0].contains($target[0])) {
				let $it = $children.find('.icon-time');
				if($it[0]) {
					if($it.data('load-job-status-list-interval')) {
						clearInterval($it.data('load-job-status-list-interval'));
						$it.data('load-job-status-list-interval', false);
					}
				}
				$(this).find('> .popover-content').empty();
				$(this).css({'display': 'none'});
			}
		});
	});
	$('body').data('popoverclosinglisteneradded', true);
}
function bindEvents()
{
	gridObj = this;

	$('.userPopover').unbind('click');
	$('.map-link, .unscheduled-popup').off("dblclick click touchend");
	$('.dblclick').unbind('click');
	$('.workerspopover').unbind('click');

	/**
	 * Following are added for fix popover issue in Dispatch grid
	 * Binoy
	 * 09-12-2013
	 */
	$("[rel=popover]").popover({placement:'bottom', html:true});

	/**
	 * Hide popover if another opens
	 * 1097
	 * 10-12-2013
	 */

	$('.userPopover').click(function(){
		$('.userPopover, .phoneNumberPopover').not(this).popover('hide'); //all but this
	});

	/**
	 * Double click job trigger Map
	 */
	$(".map-link, .unscheduled-popup").dblclick(function() {

		$('#map-modal').html("");

		$('#map-modal').css({
            'width': '1140px',
            'left': '50%',
            'margin-left': '-570px'
		});
		//$('#map-modal').addClass('web-disp-modal-cls');
		var date = gridObjUnAssigned.date; /* Get Current Dispatch date*/
		var date = date.getFullYear()+'/'+(parseInt(date.getMonth())+1)+'/'+date.getDate();
		var id = $(this).attr('id');
		if($("#"+id).data('eventData').code != 'TASK'){
			var jobId = $("#"+id).data('eventData').jobId;
			var visitId = $("#"+id).data('eventData').visitId;
			var isVisit = $("#"+id).data('eventData').isVisit;
			var userId =  $("#"+id).data('eventData').userId;
			$("#map-modal").modal();
            $('#loader').show();
			idleTime = 0;
			if($("#"+id).data('eventData').multiDay === true && $("#"+id).data('eventData').jobStartDate) {
				date = new Date($("#"+id).data('eventData').jobStartDate.split(' ')[0] + ' 00:00:01'); // prevent date (without time part) converting to previous date
				date = date.getFullYear()+'/'+(parseInt(date.getMonth())+1)+'/'+date.getDate();
			}
			$.ajax({
				url: baseUrl+"/dispatch/showMapPopup",
				type: "POST",
				data:'jobId='+jobId+'&userId='+userId+'&date='+date+'&visitId='+visitId+'&isVisit='+isVisit,
				success: function(data) {
					$('#map-modal').html(data);
                    $('#loader').hide();

					$("body").trigger('show-map-popup');
				}
			});
		}

	});
	if(isMobile()){
		$(".map-link, .unscheduled-popup").on("click touchend",function(){
			$('#map-modal').html("");
			$('#map-modal').css({
				   'width' : '85%',
				   'left' : '35%'
			});
			var date = gridObjUnAssigned.date; // Get Current Dispatch date
			var date = date.getFullYear()+'/'+(parseInt(date.getMonth())+1)+'/'+date.getDate();
			var id = $(this).attr('id');
			if($("#"+id).data('eventData').code != 'TASK'){
				var jobId = $("#"+id).data('eventData').jobId;
				var userId =  $("#"+id).data('eventData').userId;
				$("#map-modal").modal();
                $('#loader').show();
				idleTime = 0;
				$.ajax({
					url: baseUrl+"/dispatch/showMapPopup",
					type: "POST",
					data:'jobId='+jobId+'&userId='+userId+'&date='+date,
					success: function(data) {
						$('#map-modal').html(data);
                        $('#loader').hide();

						$("body").trigger('show-map-popup');
					}
				});
			}
		});
	}
	$(".map-link").click(function() {
		event.stopImmediatePropagation();
		var popoverTitle = 'Job';
		var id = $(this).attr('id');
		if (resizeTrue) {
			return;
		}
		if($("#"+id).data('eventData').code != 'TASK'){
			var userId =  $("#"+id).data('eventData').userId;
			var jobNo  =  $("#"+id).data('eventData').jobNo;
			var jobCode = $("#"+id).data('eventData').code;
			var isVisit = $("#"+id).data('eventData').isVisit;
			var visitId = $("#"+id).data('eventData').visitId;
			var jobId = $("#"+id).data('eventData').jobId;
			var urlToPage = baseUrl+'/jobs/jobView?id='+jobId;
			if(jobCode=='ESTIMATE'){
				popoverTitle = 'Estimate';
				urlToPage = baseUrl+'/estimate/estimateView?id='+jobId;
			}
			if(userId!=""){
				$("#"+id).attr('data-original-title', '<span style="display:inline-block;" class="job-title">'+popoverTitle+'#<a class="job-number" href="'+urlToPage+'" target="_blank" title="'+jobNo.replace(/['"]/g, '`')+'">'+jobNo+'</a></span>'+
					(displayDriveLaborTime?'<i style="inline-block" class="icon-time" data-placement="bottom" onmouseover="onIconTimeHover(\''+jobId+'\',\''+userId+'\',\''+visitId+'\')"><div class="popover fade bottom in dispatch-status-list" style="display:none" data-toggle="popover"><div class="arrow"></div><div class="popover-content"><table></table></div></div></i>':'')+
					'<button id="popovercloseid" type="button" onclick="popoverClose()" class="close" data-dismiss="popover">&times;</button>');
			}
				if(userId!=""){
					var date = gridObjUnAssigned.date; /* Get Current Dispatch date*/
					var date = date.getFullYear()+'/'+(parseInt(date.getMonth())+1)+'/'+date.getDate();
					var multiday = $("#"+id).data('eventData').multiDay;
					if(gridObj.view == 'W' && multiday == true){
						date = $("#"+id).data('eventData').jobStartDate;
					}
					$("#"+id).popover('show');
					let $popover = $('.main-popover.popover')[0]?$('.main-popover.popover'):$($('.popover')[0]);
					$popover.addClass('main-popover');
					$popover.find('> .popover-content').html("<div  style='margin: 8% auto 0 auto; text-align: center;'><img src='"+baseUrl+"/template/assets/images/preloaders/13.gif'></div>");

					idleTime = 0;
					$popover.css('word-wrap','break-word');
					$popover.css('width','300px');
					//$('.popover').css('height','auto');
					if(isVisit == 1){
						if(globalAjaxInstances['showJobPopover'])
							globalAjaxInstances['showJobPopover'].abort();
						globalAjaxInstances['showJobPopover'] = $.ajax({
							url: baseUrl+"/dispatch/showJobPopoverVisit",
							type: "POST",
							data:'jobId='+jobId+'&userId='+userId+'&date='+date+'&fromGrid=1'+'&visitId='+visitId,
							success: function(data) {
								let $popover = $('.popover.main-popover.in:visible')[0]?$('.popover.main-popover.in:visible'):$('.popover.in:visible');
								if($popover.parents('.popover:visible')[0])
									$popover = $popover.parents('.popover:visible');
								$popover.css('min-width', '300px');
								let $popoverContent = $popover.find(' > .popover-content');
								$('a[rel=popover]').popover({
								   html: true,
								   content: $popoverContent.html(data)
								});
								$popoverContent.data('eventBlockId',id);
							}
						});
					}else{
						var showJobPopoverFunctionAjax = function() {
							if(globalAjaxInstances['showJobPopover'])
								globalAjaxInstances['showJobPopover'].abort();
							globalAjaxInstances['showJobPopover'] = $.ajax({
								url: baseUrl+"/dispatch/showJobPopover",
								type: "POST",
								data:'jobId='+jobId+'&userId='+userId+'&date='+date+'&fromGrid=1&accept=html',
								success: function(data) {
									let $popover = $('.popover.main-popover.in:visible')[0]?$('.popover.main-popover.in:visible'):$('.popover.in:visible');
									if($popover.parents('.popover:visible')[0])
										$popover = $popover.parents('.popover:visible');
									$popover.css('min-width', '300px');
									let $popoverContent = $popover.find(' > .popover-content');
									$('a[rel=popover]').popover({
										   html: true,
										   content: $popoverContent.html(data)
								   });
									 $('[data-clickaction="refreshJobsData"]').unbind().bind('click', function() { showJobPopoverFunctionAjax(); });
									$popoverContent.data('eventBlockId',id);
								}
							});
						};
						showJobPopoverFunctionAjax();
					}
			}
		}
	});


	$(".workerspopover").click(function() {
		event.stopImmediatePropagation();
		$('.userContents').remove();
		var id = $(this).attr('id');
		$("#"+id).popover('show');
		$('.popover').css('left','16px');
		$('.popover-content').html(" ");
		$('.popover-content').html("<div  style='margin: 11% auto 0 auto; text-align: center;'><img src='"+baseUrl+"/template/assets/images/preloaders/13.gif'></div>");
		$('.popover-title').append('<button id="popovercloseid" type="button" onclick="popoverClose()" class="close">&times;</button>');
		idleTime = 0;
		$.ajax({
			url: baseUrl+"/dispatch/showWorkerPopover",
			type: "POST",
			data:'userID='+id,
			success: function(data) {
				 $('a[rel=popover]').popover({
		               html: true,
		               content: $('.popover-content').html(data)

		       });

			}
		});

	});
	$('#dispatch-grid-div-assignd-grid-right').bind('scroll', function(event) {
		$('#dispatch-grid-div-unassignd-grid-right').scrollLeft($(this).scrollLeft());
	});
	/* End Map Model */
}

/*
 * Function used to update the events
 */
function updateDrag(aroEvent,arsEvent) {
	if(arsEvent === 'resize'){
		aroEvent.resize = true;
	}

	var updateDragFunction = window[gridObj.updateDragFunction];
    if (typeof updateDragFunction === "function") {
        updateDragFunction.call(gridObj, aroEvent);
    }
}

/*
 * Function used to calculate time from pixels
 */
function calculateGridPixelTime(arnPixelLeft,arsFormat)
{
	var columnFactor = (gridObj.dailyGridLayout=="24")?30:60;
	var columnFactorWithBorders = (gridObj.dailyGridLayout=="24")?33:63;
	var parent = gridObj.parent;
	/***** This was added when tab system was introduced. The gridObj will be unassined object by default. But when unassigned tab is not active the left position will be 0 for the first column of unassigned grid. So we are changing it to assigned object parent. ***/
	if(!$('#'+gridObj.parent).is(':visible')){
		parent = gridObjAssigned.parent;
	}
	var time = '12:00';
	var startLeft = parseFloat($('#column-div-'+parent+'-0-0').position().left);
	var endLeft = parseFloat($('#column-div-'+parent+'-0-47').position().left);
	var actualLeft = parseInt(arnPixelLeft) - startLeft;
	if(arnPixelLeft < 0){
		actualLeft = actualLeft - 1;
	}
	if(actualLeft < 0){
		return '';
	}
	if(actualLeft == 0){
		time = formatTime(0);
	}
	/*var modulusRem = actualLeft%(parseFloat(columnFactorWithBorders));
	var decimalPortion = 0;
	decimalPortion = modulusRem%1;
	if(decimalPortion != 0){
		modulusRem = parseInt(modulusRem) + 1;
	}
	if(modulusRem > 30){
		modulusRem = 30;
	}
	var columnsPassed = parseInt(actualLeft/(parseFloat(columnFactorWithBorders)));

	var minutes = (columnsPassed * 30) + modulusRem;*/
	var columnsPassed = parseFloat(actualLeft/(parseFloat(columnFactorWithBorders)));

	var minutes = columnsPassed * 30;
	minutes = parseInt(minutes);
	if(arsFormat == 'T'){
		time = formatTime(minutes);
	}
	else{
		time = minutes;
	}

	return time;


}

/*
 * Function used to calculate start time and duration
 */

function calculateStartTimeAndDuration(arsId,arsAction)
{

	var eventObj = $('#'+arsId).data('eventData');
	var duration = eventObj.duration;
	var pixelLeft = $('#'+arsId).position().left;
	var startMinutes = gridObj.calculateGridPixelTime(pixelLeft);
	var startTime = gridObj.calculateGridPixelTime(pixelLeft,'T');
	var pixelWidth = $('#'+arsId).width();
	var endTime = gridObj.calculateGridPixelTime((parseFloat(pixelLeft)+parseFloat(pixelWidth)),'T');
	var endMinutesTemp = gridObj.calculateGridPixelTime((parseFloat(pixelLeft)+parseFloat(pixelWidth)));
	if($('#'+arsId).data('eventData').code == "TASK"){
		$('#'+arsId).data('eventData').endTime = endTime;
		if(endMinutesTemp > 1440){
			$('#'+arsId).data('eventData').endTime = "23:59";
		}
	}
	if($('#'+arsId).data('eventData').previousDay){
		var startMinBeforeDrag = $('#'+arsId).data('eventData').startMin;
		var diff = startMinutes - startMinBeforeDrag;
		var originalStartMin = $('#'+arsId).data('eventData').originalStartMin;
		var originalDuration = $('#'+arsId).data('eventData').originalDuration;
		var originalStartTime = $('#'+arsId).data('eventData').originalStartTime;
		var startMinTemp = originalStartMin + diff;
		if(arsAction == 'drag'){
			duration = parseInt(originalDuration);
			if(startMinTemp <= 1440){
				var startTimeNew = addTime(originalStartTime,diff);
				startTime = startTimeNew;
				startMinutes = startMinTemp;
			}
			else{
				//var $picker = $("#zebradp-dispatch");
			    //var date=new Date($picker.datepicker('getDate'));
				var endMin = eventObj.endMin;
				startMinutes = endMin - (duration/60);
				$('#'+arsId).data('eventData').changeDate = true;
			}
		}
		else{
			startMinutes = originalStartMin;
			startTime = originalStartTime;
			duration = parseInt(originalDuration) + parseFloat(duration);
		}
		//startMinutes = startMinutes + startMin;
		//var startTimeNew = addTime(startTime,arsTime2);
		//$('#'+arsId).data('eventData').startMin = startMin;
		//var newDuration = duration - oldDuration;
		//$('#'+arsId).data('eventData').duration = newDuration;
	}
	$('#'+arsId).data('eventData').startTime = startTime;
	$('#'+arsId).data('eventData').startMin = startMinutes;
	$('#'+arsId).data('eventData').endMin = startMinutes + (duration/60);
	$('#'+arsId).data('eventData').duration = duration;

}

function addTime(arsTime,arsMinutes){

	var tempTime = arsTime.split(':');
	var hours = tempTime[0];
	var minutes = tempTime[1];
	var minutesFromHrs = parseInt(hours) * 60;
	/*if(gridObj.timeFormat == '24'){
		var minutesFromHrs = parseInt(hours) * 60;
	}
	else{
		var minutesFromHrs = (parseInt(hours) + 12) * 60;
	}*/
	var totalMinutes = parseInt(minutesFromHrs) + parseInt(minutes) + parseInt(arsMinutes);

	var newTime = formatTime(totalMinutes);
	return newTime;

}

/*
 * Function used to get the day name from day no
 */

function getDayName(arnDay)
{
	var weekday=new Array();
	weekday[0]="Sun";
	weekday[1]="Mon";
	weekday[2]="Tue";
	weekday[3]="Wed";
	weekday[4]="Thu";
	weekday[5]="Fri";
	weekday[6]="Sat";

	return weekday[arnDay];
}

/*
 * Function used to get the day name from day no
 */

function getDayNameWeekView(arnDay)
{
	var weekday=new Array();

	weekday[0]="Monday";
	weekday[1]="Tuesday";
	weekday[2]="Wednesday";
	weekday[3]="Thursday";
	weekday[4]="Friday";
	weekday[5]="Saturday";
	weekday[6]="Sunday";

	return weekday[arnDay];
}

/*
 * Function used to get month name from month no
 */

function getMonthName(arnMonth)
{
	var month=new Array();
	month[0]="Jan";
	month[1]="Feb";
	month[2]="Mar";
	month[3]="Apr";
	month[4]="May";
	month[5]="Jun";
	month[6]="Jul";
	month[7]="Aug";
	month[8]="Sep";
	month[9]="Oct";
	month[10]="Nov";
	month[11]="Dec";

	return month[arnMonth];
}

/*
 * Function used to get time intervals for setting the heading
 */

function getTimeIntervals(arnTimeFactor)
{
	if(gridObj.timeFormat == '24'){
		return arnTimeFactor;
	}
	else if(gridObj.timeFormat == '12'){
		if(arnTimeFactor == 0)
			return (gridObj.dailyGridLayout=="24")?'12a':"12am";

		if(arnTimeFactor == 12)
			return (gridObj.dailyGridLayout=="24")?'12p':"12pm";

		if(arnTimeFactor > 12)
			return (gridObj.dailyGridLayout=="24")?arnTimeFactor - 12+'p':arnTimeFactor - 12+'pm';

		return (gridObj.dailyGridLayout=="24")?arnTimeFactor+'a':arnTimeFactor+'am';
	}
	else{
		return arnTimeFactor;
	}
}

function getTimeIntervalsForColumn(arnTimeFactor)
{
	var time = parseInt(arnTimeFactor/2);
	var remainder = arnTimeFactor%2;
	if(remainder>0){
		time = time+':30'
	}
	return time;
}

/*
 * Function used to get day intervals for setting the heading
 */

function getDayIntervals(arnTimeFactor)
{
	if(gridObj.timeFormat == '24'){
		return arnTimeFactor;
	}
	else if(gridObj.timeFormat == '12'){
		if(arnTimeFactor == 0)
			return '12a';

		if(arnTimeFactor == 12)
			return '12p';

		if(arnTimeFactor > 12)
			return arnTimeFactor - 12+'p';

		return arnTimeFactor+'a';
	}
	else{
		return arnTimeFactor;
	}
}

/*
 * Function used to format the minutes to am/pm time
 */

function formatTime(arnMinutes)
{

	var hours = parseInt(arnMinutes/60);
	var minutes = arnMinutes % 60;
	var amPm = 'am';
	if(gridObj.timeFormat == '24'){
		if(hours.toString().length<2){
			hours = '0'+hours;
		}
		if(minutes.toString().length<2){
			minutes = '0'+minutes;
		}
		return hours+":"+minutes;
	}
	else{
		if(hours > 12){
			hours = hours - 12;
			amPm = 'pm';
		}
		if(hours == 12){
			amPm = 'pm';
		}
		if(hours.toString().length<2){
			hours = '0'+hours;
		}
		if(minutes.toString().length<2){
			minutes = '0'+minutes;
		}
		return hours+":"+minutes+' '+amPm;
	}
}

function showDispatchDate()
{
	$("#zebradp-dispatch").focus();
}

function manageOverlappingEvents()
{
	var selEventRowNo;
	var selEvtLeft;
	var selEvtTop;
	var selEvntEnd;
	var selEventAssigned;
	var selEventId;
	var eventsRowNo = '';
	var eventsLeft = '';
	var eventsTop = '';
	var eventsId = '';
	var eventsAssigned = '';
	var selObj = [];
	var innerObj = [];
	var overlap = false;

	$( ".dispatch-events-assigned" ).each(function( index ,element) {
		$(element).attr('checkOverlapRowNo',$(element).attr('rowNo'));
		$("#user-"+gridObj.parent+"-left-row-for-break-"+$(element).attr('rowNo')).data("rowNosToInsert",$(element).attr('rowNo'));

	});
	let overlapFix = function( index ,element) {
		selObj = $(element);
		overlap = false;
		if(selObj.attr('id')){
			selEventRowNo = selObj.attr('rowNo');
			var selObjRowNoForOverlap = selObj.attr('checkOverlapRowNo');
			selEvtLeft = parseFloat(selObj.attr('originalleft'));
			selEvtTop = parseFloat(selObj.attr('originalTop'));
			selEvntEnd = parseInt(selEvtLeft) + parseInt(selObj.css('width'));
			selEventAssigned = selObj.data('eventData').assigned;
			selEventId = selObj.attr('id');
			/*if(selObj.attr('overlapping') == 'true'){
    			return true;
    		}*/
			$( ".dispatch-events-assigned" ).each(function( index ,innerElem) {
				innerObj = $(innerElem);
				overlap = false;
				if(innerObj.attr('id')){
					eventsRowNo = innerObj.attr('rowNo');
					eventsId = innerObj.attr('id');//console.log(eventsId);
					eventsLeft = parseFloat(innerObj.attr('originalleft'));
					eventsTop = parseFloat(innerObj.attr('originalTop'));
					eventsAssigned = innerObj.data('eventData').assigned;
					if(selObj.attr('overlapping') == 'true' || innerObj.attr('overlapping') == 'true'){
						//if(innerObj.attr('overlapping') == 'true'){
						//return true;
					}
					if(selEventId != eventsId && selEventRowNo == eventsRowNo && selEvtLeft <= eventsLeft && selEvntEnd >= eventsLeft && selEventAssigned == eventsAssigned && selEvtTop == eventsTop){

						var innerObjRowNoForOverlap = innerObj.attr('checkOverlapRowNo');
						if(selObjRowNoForOverlap == innerObjRowNoForOverlap){
							//gridObj.createRowForOverlapping(innerObj);
							innerObj.attr('checkOverlapRowNo',parseInt(innerObj.attr('checkOverlapRowNo'))+1);
							if(parseInt(innerObj.attr('checkOverlapRowNo')) >= parseInt($("#user-"+gridObj.parent+"-left-row-for-break-"+eventsRowNo).data("rowNosToInsert"))){
								$("#user-"+gridObj.parent+"-left-row-for-break-"+eventsRowNo).data("rowNosToInsert",innerObj.attr('checkOverlapRowNo'));
							}
						}
						innerObj.attr('overlapping','true');


					}
				}
			});
		}
	};

	let currentLoop = 0, maxLoop = 4;
	while(currentLoop < maxLoop) {
		$( ".dispatch-events-assigned" ).each(function(index ,element) {
			overlapFix(index, element);
		});
		currentLoop++;
	}
	$( ".dispatch-events-assigned" ).each(function( index ,element) {
		//if($(element).attr('checkOverlapRowNo') != $(element).attr('rowNo')){
			//gridObj.createRowForOverlapping(innerObj);
			$(element).attr('overlapRowNo',$(element).attr('checkOverlapRowNo'));
		//}

	});

	$(".rowNoForBreak").each(function( index ,element) {
		var diff = $(element).data('rowNosToInsert') - $(element).data('rowNoForBreak');
		if(diff>0){
			for(i=0;i<diff;i++){
				gridObj.createRowForOverlappingNew(parseInt($(element).data('rowNoForBreak')),$(element).data('userIdForBreak'));
			}
		}

	});
	gridObj.adjustEventsTop();
}

/*
 * Function used to create the blank grid rows. If users less than 7 are present then we have to create a minimum of seven rows.
 */

function createRowForOverlappingNew(rowNo,userId)
{
	var k = parseInt($('#dispatch-grid-div-assignd').attr('noOfRows')) + 1;
	var masterNoOfRows = parseInt($('#dispatch-grid-div-assignd').attr('masterNoOfRows'));
	var masterOverlapRows = parseInt($('#dispatch-grid-div-assignd').attr('masterOverlapRows')) + 1;
	$('#dispatch-grid-div-assignd').attr('masterOverlapRows',masterOverlapRows);
	$('#dispatch-grid-div-assignd').attr('noOfRows',k);
	var rowNo = rowNo;
	var userId = userId;
	var insertAfterRowNo = rowNo;
	var overlapRowNo = $('#user-'+gridObj.parent+'-left-'+rowNo).attr('overlapRowNo');
	var overlapRowNoTemp = $('#user-'+gridObj.parent+'-left-'+rowNo).attr('overlapRowNoTemp');
	overlapRowNoTemp = parseInt(overlapRowNoTemp) + 1;
	//$('#user-'+gridObj.parent+'-left-'+rowNo).attr('overlapRowNo',overlapRowNo);
	//aroObj.attr('overlapRowNo',overlapRowNoTemp);
	$('#user-'+gridObj.parent+'-left-'+rowNo).attr('overlapRowNoTemp',overlapRowNoTemp);

			trBgColor = "";
			if (rowNo%2 == 0){
				trBgColor = "#f6f6f6";
			}
			$('#user-'+gridObj.parent+'-left-'+insertAfterRowNo).after("<tr class='grid-table-tr-left' id='user-"+gridObj.parent+"-left-"+k+"'></tr>");
			$('#user-'+gridObj.parent+'-right-'+insertAfterRowNo).after("<tr class='grid-table-tr-right' bgColor='"+trBgColor+"' id='user-"+gridObj.parent+"-right-"+k+"'></tr>");

			$("<td class='grid-table-td-left' style='border-right:1px solid #DDD;border-top:1px solid #FFF;border-left:1px solid #DDD;'><div class='rowNoForBreak' id='user-"+gridObj.parent+"-left-row-for-break-"+k+"' style='width:"+gridObj.leftMenuWidth+";height:"+gridObj.rowHeight+"'></div></td>").appendTo($('#user-'+gridObj.parent+"-left-"+k));
		//}
		gridObj.createGridColumns(userId,k,true,k);
		$("#user-"+gridObj.parent+"-left-row-for-break-"+k).data("rowNoForBreak",k);
		$("#user-"+gridObj.parent+"-left-row-for-break-"+k).data("userIdForBreak",userId);
		//dispatchDroppableColumns();

		var length = parseInt(rowNo)+1;
		var i;
		//alert(length+'and'+masterNoOfRows);
		for(i=length;i<=masterNoOfRows;i++){
			$('#user-'+gridObj.parent+'-left-'+i).attr('overlapRowNo',masterOverlapRows);//alert(i+'------'+masterOverlapRows);
		}
		//overlappArray.push({rowNo:rowNo,overlapRowNo:overlapRowNo,overlapRowNoEvent:overlapRowNoTemp,left:aroObj.attr('originalleft'),width:parseFloat(aroObj.css('width'))});
		//overlappArray[rowNo]['overlapRowNo'] = overlapRowNo;
		//overlappArray[rowNo]['left'] = aroObj.attr('originalleft');
		//overlappArray[rowNo]['left'] = aroObj.attr('originalleft');
		//aroObj.css('top',parseFloat(aroObj.css('top')) + (overlapRowNo * 43));
	//}
}

function createRowForOverlapping(aroObj)
{
	var k = parseInt($('#dispatch-grid-div-assignd').attr('noOfRows')) + 1;
	var masterNoOfRows = parseInt($('#dispatch-grid-div-assignd').attr('masterNoOfRows'));
	var masterOverlapRows = parseInt($('#dispatch-grid-div-assignd').attr('masterOverlapRows')) + 1;
	$('#dispatch-grid-div-assignd').attr('masterOverlapRows',masterOverlapRows);
	$('#dispatch-grid-div-assignd').attr('noOfRows',k);
	var rowNo = aroObj.attr('rowNo');
	var userId = aroObj.data("eventData").userId;
	var insertAfterRowNo = rowNo;
	var overlapRowNo = $('#user-'+gridObj.parent+'-left-'+rowNo).attr('overlapRowNo');
	var overlapRowNoTemp = $('#user-'+gridObj.parent+'-left-'+rowNo).attr('overlapRowNoTemp');
	overlapRowNoTemp = parseInt(overlapRowNoTemp) + 1;
	//$('#user-'+gridObj.parent+'-left-'+rowNo).attr('overlapRowNo',overlapRowNo);
	aroObj.attr('overlapRowNo',overlapRowNoTemp);
	$('#user-'+gridObj.parent+'-left-'+rowNo).attr('overlapRowNoTemp',overlapRowNoTemp);
	//$('#dispatch-grid-div-assignd').data('overlapRowNo-'+rowNo,overlapRowNo);
	//console.log(aroObj);
	//for(k=arnLength;k<maxLength;k++){
	/*	if(gridObj.collapseLeftRows){
			$("<tr class='grid-table-tr-left' id='user-blank-"+gridObj.parent+"-left-"+k+"'></tr>").appendTo($('#'+gridObj.parent+'-grid-table-left'));
			$("<tr class='grid-table-tr-right' id='user-blank-"+gridObj.parent+"-right-"+k+"'></tr>").appendTo($('#'+gridObj.parent+'-grid-table-right'));

			$("<td class='grid-table-td-left' style='border-right:1px solid #DDD;border-left:1px solid #DDD;'><div style='width:"+gridObj.leftMenuWidth+";height:"+gridObj.rowHeight+"'></div></td>").appendTo($('#user-blank-'+gridObj.parent+"-left-"+k));
		}
		else{*/
			//$("<tr class='grid-table-tr-left' id='user-blank-"+gridObj.parent+"-left-"+k+"'></tr>").appendTo($('#'+gridObj.parent+'-grid-table-left'));
			//$("<tr class='grid-table-tr-right' id='user-blank-"+gridObj.parent+"-right-"+k+"'></tr>").appendTo($('#'+gridObj.parent+'-grid-table-right'));
			trBgColor = "";
			if (rowNo%2 == 0){
				trBgColor = "#f6f6f6";
			}
			$('#user-'+gridObj.parent+'-left-'+insertAfterRowNo).after("<tr class='grid-table-tr-left' id='user-"+gridObj.parent+"-left-"+k+"'></tr>");
			$('#user-'+gridObj.parent+'-right-'+insertAfterRowNo).after("<tr class='grid-table-tr-right' bgColor='"+trBgColor+"' id='user-"+gridObj.parent+"-right-"+k+"'></tr>");

			$("<td class='grid-table-td-left' style='border-right:1px solid #DDD;border-top:1px solid #FFF;border-left:1px solid #DDD;'><div class='rowNoForBreak' id='user-"+gridObj.parent+"-left-row-for-break-"+k+"' style='width:"+gridObj.leftMenuWidth+";height:"+gridObj.rowHeight+"'></div></td>").appendTo($('#user-'+gridObj.parent+"-left-"+k));
		//}
		gridObj.createGridColumns(userId,k,true,k);
		$("#user-"+gridObj.parent+"-left-row-for-break-"+k).data("rowNoForBreak",k);
		$("#user-"+gridObj.parent+"-left-row-for-break-"+k).data("userIdForBreak",userId);
		//dispatchDroppableColumns();

		var length = parseInt(rowNo)+1;
		var i;
		//alert(length+'and'+masterNoOfRows);
		for(i=length;i<=masterNoOfRows;i++){
			$('#user-'+gridObj.parent+'-left-'+i).attr('overlapRowNo',masterOverlapRows);//alert(i+'------'+masterOverlapRows);
		}
		overlappArray.push({rowNo:rowNo,overlapRowNo:overlapRowNo,overlapRowNoEvent:overlapRowNoTemp,left:aroObj.attr('originalleft'),width:parseFloat(aroObj.css('width'))});
		//overlappArray[rowNo]['overlapRowNo'] = overlapRowNo;
		//overlappArray[rowNo]['left'] = aroObj.attr('originalleft');
		//overlappArray[rowNo]['left'] = aroObj.attr('originalleft');
		//aroObj.css('top',parseFloat(aroObj.css('top')) + (overlapRowNo * 43));
	//}
}

function adjustEventsTop()
{
	var scrollTop = $('#'+gridObj.parent+'-grid-right').scrollTop();
	var firstColPosY;
	var eventTop;
	var obj;var rowNo;var overlapRowNo;var overlapRowNoObj;
	$( ".dispatch-events-assigned" ).each(function( index ,element) {
		obj = $(element);
		overlapRowNo = 0;
		overlapRowNoObj = 0;
		rowNo = parseInt(obj.attr('rowNo'));
		//firstColPosY = $('#column-div-'+gridObj.parent+'-'+rowNo+'-0').position().top;
		//eventTop = firstColPosY + 3 + scrollTop;
		overlapRowNo = parseInt($('#user-'+gridObj.parent+'-left-'+rowNo).attr('overlapRowNo'));
		overlapRowNoObj = parseInt(obj.attr('overlapRowNo'));
		if(!overlapRowNoObj){
			overlapRowNoObj = 0;
		}
		//console.log(overlapRowNo +':'+ overlapRowNoObj);
		/*if(rowNo > 0){
			overlapRowNo = overlapRowNo + parseInt($('#user-'+gridObj.parent+'-left-'+(rowNo-1)).attr('overlapRowNo'));
		}*/
		/*if(obj.attr('overlapping') == 'true'){
			return true;
		}*/
		//obj.css('top',eventTop);
		//console.log(obj);
		var tempRowSubtract = rowNo*1;
		eventTop = parseFloat(obj.css('top')) + (((overlapRowNo + overlapRowNoObj)-tempRowSubtract) * ((gridObj.lineNos * 20) + 3 + 15));
		obj.css('top',eventTop);
		obj.attr('originalTop',eventTop);
	});
}

function convertJobEstimateToUnscheduled(jobId, code, isVisit, visitId, unscheduled, eventData) {
    if (unscheduled && unscheduled == true) {
        $('#dispatch-grid-div-unscheduled-right').attr("unscheduled", "");
        return;
    }

	// Updates an event data, uses jobId,code,isVisit,visitId,unscheduled variables
    var updateEvent = function(stopRepeating) {
        var $loader = $('#loader').show();
        $.ajax({
            url: baseUrl + "/dispatch/convertJobEstimateToUnscheduled",
            type: "POST",
            data: {
                jobId: jobId,
                code: code,
                isVisit: isVisit,
                visitId: visitId,
                unscheduled: unscheduled,
                stopRepeating: stopRepeating ? 1 : 0
			},
            success: function (data) {
                $loader.hide();
                var result = JSON.parse(data);

                if (!result.success) {
                    var $errorMessage = 'An error occurs while updating, please try again later.';
                    if ((typeof result.message !== 'undefined') && (result.message.length > 0)) {
                        $errorMessage = result.message;
                    }

                    $.msgbox($errorMessage, {}, function(){
                        filterDispatchGrid();
                    });
                }
                else {
                    $('#dispatch-grid-div-unscheduled-right').attr("unscheduled", "");
                    filterDispatchGrid();
                }
            },
            error: function () {
                $loader.hide();
                $.msgbox('An error occurs while updating, please try again later.', {}, function(){
                    filterDispatchGrid();
                });
            }
        });
	};

    if ((typeof eventData !== 'undefined') && (eventData !== null)) {
        var isRepeating = 0;
        if (typeof eventData.isRepeating !== 'undefined') {
            isRepeating = eventData.isRepeating;
        }

        var isRepeatingChild = 0;
        if (typeof eventData.isRepeatingChild !== 'undefined') {
            isRepeatingChild = eventData.isRepeatingChild;
        }

        // A parent job has been changed
        if ((isVisit != 1) && (isRepeating === 1) && (isRepeatingChild === 0)) {
            $.msgbox("You are trying to unschedule a repeating job, it will stop repeating. Are you sure you want to stop repeating this job? Doing this will not affect any past jobs.", {
                    type: "confirm",
                    buttons: [
                        {type: "submit", value: "Yes"},
                        {type: "submit", value: "No"}
                    ]
                }, function (result) {
                    if (result === 'Yes') {
												confirmIfExistRecurringTemplateByJob(jobId, 'children').done(function(confirmed) {
														if (confirmed) {
																updateEvent(true);
														} else {
																filterDispatchGrid();
														}
												}).fail(function() {
														filterDispatchGrid();
												});
                    }
                    else {
                        filterDispatchGrid();
                    }
                }
            );
		}
		else {
            updateEvent(false);
		}
	}
	else {
        updateEvent(false);
	}
}

function getSmsToTechDetails(techId, techName, techPhone) {
	$('#sms-techs-div').html('');
	$('#sms-techs-phone-div').html('');
	if (typeof(techId) !== 'undefined' && techId) {
		$('<select class="multiselect" multiple="multiple" id="sms-techs"></select>').appendTo($('#sms-techs-div'));
		$('<select class="multiselect" multiple="multiple" id="sms-techs-phone"></select>').appendTo($('#sms-techs-phone-div'));
		$('<option selected="selected"/>').text(techName).val(techId).appendTo($('#sms-techs'));
		$('<option selected="selected"/>').text(techPhone).val(techId).appendTo($('#sms-techs-phone'));
		setSmsToNos();
	}
}

