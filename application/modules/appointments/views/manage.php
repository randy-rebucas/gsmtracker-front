<div class="row">
	<div class="col-xs-12 col-sm-7 col-md-7 col-lg-4">
		<h1 class="page-title txt-color-blueDark"><i class="fa fa-calendar fa-fw "></i> 
			<?php echo $module ;?>
		</h1>
	</div>
	<div class="col-xs-12 col-sm-5 col-md-5 col-lg-8">
		
	</div>
</div>
<!-- row -->

<div class="row">
	<div class="col-sm-12 col-md-12 col-lg-12">
		<table class="table table-striped" id="table-appointments">
			<thead>
				<tr>
					<th>&nbsp;</th>
					<th>Title</th>
					<th>Description</th>
					<th>Date</th>
					<th>Status</th>
					<th>Token</th>
					<th>Patient</th>
					<th>&nbsp;</th>
					<th>&nbsp;</th>
				</tr>
			</thead>
			<tbody>
				
			</tbody>
		</table>
	</div>
	<div class="hidden col-sm-12 col-md-4 col-lg-4">

		<!-- new widget -->
		<div class="jarviswidget jarviswidget-color-blueDark">

			<!-- widget options:
			usage: <div class="jarviswidget" id="wid-id-0" data-widget-editbutton="false">

			data-widget-colorbutton="false"
			data-widget-editbutton="false"
			data-widget-togglebutton="false"
			data-widget-deletebutton="false"
			data-widget-fullscreenbutton="false"
			data-widget-custombutton="false"
			data-widget-collapsed="true"
			data-widget-sortable="false"

			-->
			<header>
				<span class="widget-icon"> <i class="fa fa-calendar"></i> </span>
				<h2> My Calendar </h2>
				<div class="widget-toolbar">
					<!-- add: non-hidden - to disable auto hide -->
					<div class="btn-group">
						<button class="btn dropdown-toggle btn-xs btn-default" data-toggle="dropdown">
							Showing <i class="fa fa-caret-down"></i>
						</button>
						<ul class="dropdown-menu js-status-update pull-right">
							<li>
								<a href="javascript:void(0);" id="mt">Month</a>
							</li>
							<li>
								<a href="javascript:void(0);" id="ag">Agenda</a>
							</li>
							<li>
								<a href="javascript:void(0);" id="td">Today</a>
							</li>
						</ul>
					</div>
				</div>
			</header>

			<!-- widget div-->
			<div>

				<div class="widget-body no-padding">
					<!-- content goes here -->
					<div class="widget-body-toolbar">

						<div id="calendar-buttons">

							<div class="btn-group">
								<a href="javascript:void(0)" class="btn btn-default btn-xs" id="btn-prev"><i class="fa fa-chevron-left"></i></a>
								<a href="javascript:void(0)" class="btn btn-default btn-xs" id="btn-next"><i class="fa fa-chevron-right"></i></a>
							</div>
						</div>
					</div>
					
					<div id="calendar"></div>

					<!-- end content -->
				</div>

			</div>
			<!-- end widget div -->
		</div>
		<!-- end widget -->

	</div>

</div>

<!-- end row -->

<script type="text/javascript">
	var can_view = 	'<?php echo ($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('appointments', $this->role_id, 'view',   $this->client_id) : true; ?>';
	var can_update = '<?php echo ($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('appointments', $this->role_id, 'update',   $this->client_id) : true; ?>';
	var can_delete = '<?php echo ($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('appointments', $this->role_id, 'delete',   $this->client_id) : true; ?>';
	
	var admin_role_id = '<?php echo $this->admin_role_id;?>';
	var patient_role_id = '<?php echo $this->patient_role_id;?>';

	var fullviewcalendar;

	pageSetUp();

	var pagefunction = function() {

		var date = new Date();
	    var d = date.getDate();
	    var m = date.getMonth();
	    var y = date.getFullYear();
	
	    var hdr = {
	        left: 'title',
	        center: 'month,agendaWeek,agendaDay',
	        right: 'prev,today,next'
	    };
	
	    var initDrag = function (e) {
	        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
	        // it doesn't need to have a start or end
	
	        var eventObject = {
	            title: $.trim(e.children().text()), // use the element's text as the event title
	            description: $.trim(e.children('span').attr('data-description')),
	            icon: $.trim(e.children('span').attr('data-icon')),
	            className: $.trim(e.children('span').attr('class')) // use the element's children as the event class
	        };
	        // store the Event Object in the DOM element so we can get to it later
	        e.data('eventObject', eventObject);
	
	        // make the event draggable using jQuery UI
	        e.draggable({
	            zIndex: 999,
	            revert: true, // will cause the event to go back to its
	            revertDuration: 0 //  original position after the drag
	        });
	    };
	
	    var addEvent = function (title, priority, description, icon) {
	        title = title.length === 0 ? "Untitled Event" : title;
	        description = description.length === 0 ? "No Description" : description;
	        icon = icon.length === 0 ? " " : icon;
	        priority = priority.length === 0 ? "label label-default" : priority;
	
	        var html = $('<li><span class="' + priority + '" data-description="' + description + '" data-icon="' +
	            icon + '">' + title + '</span></li>').prependTo('ul#external-events').hide().fadeIn();
	
	        $("#event-container").effect("highlight", 800);
	
	        initDrag(html);
	    };
	
	    /* initialize the external events
		 -----------------------------------------------------------------*/
	
	    $('#external-events > li').each(function () {
	        initDrag($(this));
	    });
	
	    $('#add-event').click(function () {
			//implement ajax
	        var title = $('#title').val(),
	            priority = $('input:radio[name=priority]:checked').val(),
	            description = $('#description').val(),
	            icon = $('input:radio[name=iconselect]:checked').val();
	
	        addEvent(title, priority, description, icon);
	    });
	
	    /* initialize the calendar
		 -----------------------------------------------------------------*/
		var event_collection = function () {
			var appointments = [];
			$.ajax({
				async: false,
				type: 'POST', 
				url: BASE_URL +'appointments/get', 
				data: {}, 
				success: function (res) { 
					response = $.parseJSON(res);

					$.each(response, function (index, value) {
						appointments.push({"id" : value.id, "title" : value.title, "description": value.description, "start": value.start, "allDay": false, "className": '["event", "bg-color-blue"]', "icon": 'fa-clock-o'});
					});
					
				}
			});
			return appointments;
		}();
		
	    fullviewcalendar = $('#calendar').fullCalendar({
	
					header: hdr,
			        editable: true,
			        droppable: true, // this allows things to be dropped onto the calendar !!!
					eventLimit: true, // allow "more" link when too many events
			
			        drop: function (date, allDay) { // this function is called when something is dropped
			
			            // retrieve the dropped element's stored Event Object
			            var originalEventObject = $(this).data('eventObject');
						
			            // we need to copy it, so that multiple events don't have a reference to the same object
			            var copiedEventObject = $.extend({}, originalEventObject);
			
			            // assign it the date that was reported
			            copiedEventObject.start = date;
			            copiedEventObject.allDay = allDay;
						
						console.log(copiedEventObject);
			            // render the event on the calendar
			            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
			            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
			
			            // is the "remove after drop" checkbox checked?
			            if ($('#drop-remove').is(':checked')) {
			                // if so, remove the element from the "Draggable Events" list
			                $(this).remove();
			            }
			
			        },
			
			        select: function (start, end, allDay) {
			            var title = prompt('Event Title:');
			            if (title) {
			                calendar.fullCalendar('renderEvent', {
			                        title: title,
			                        start: start,
			                        end: end,
			                        allDay: allDay
			                    }, true // make the event "stick"
			                );
			            }
			            calendar.fullCalendar('unselect');
			        },
					events: event_collection,
			        eventRender: function (event, element, icon) {
			            if (!event.description == "") {
			                element.find('.fc-title').append("<br/><span class='ultra-light'>" + event.description +
			                    "</span>");
			            }
			            if (!event.icon == "") {
			                element.find('.fc-title').append("<i class='air air-top-right fa " + event.icon +
			                    " '></i>");
			            }
			        },
					
					eventClick: function(calEvent, jsEvent, view) {

						alert('Event: ' + calEvent.title);
						alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
						alert('View: ' + view.name);
						//implement ajax
						//bootbox event details
						// change the border color just for fun
						$(this).css('border-color', 'red');

					},
			        windowResize: function (event, ui) {
			            $('#calendar').fullCalendar('render');
			        }
			    });
		
		    /* hide default buttons */
		    $('.fc-right, .fc-center').hide();

		
			$('#calendar-buttons #btn-prev').click(function () {
			    $('.fc-prev-button').click();
			    return false;
			});
			
			$('#calendar-buttons #btn-next').click(function () {
			    $('.fc-next-button').click();
			    return false;
			});
			
			$('#calendar-buttons #btn-today').click(function () {
			    $('.fc-today-button').click();
			    return false;
			});
			
			$('#mt').click(function () {
			    $('#calendar').fullCalendar('changeView', 'month');
			});
			
			$('#ag').click(function () {
			    $('#calendar').fullCalendar('changeView', 'agendaWeek');
			});
			
			$('#td').click(function () {
			    $('#calendar').fullCalendar('changeView', 'agendaDay');
			});	
	};
	var table = function() {
		/* BASIC ;*/
		var responsiveHelper_dt_basic = undefined;
		var responsiveHelper_datatable_fixed_column = undefined;
		var responsiveHelper_datatable_col_reorder = undefined;
		var responsiveHelper_datatable_tabletools = undefined;
		
		var breakpointDefinition = {
			tablet : 1024,
			phone : 480
		};
		
		$('#table-appointments').dataTable({
			'destroy': true,
			'filter': true,
			'processing': true, 
			"serverSide": true,        
			"paging": true,
			"bSort" : false,
			"sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs'l>r>"+
					"t"+
					"<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
			"ajax": {
				url: BASE_URL + 'appointments/load_ajax/',
				type: 'POST',
			},
			"oLanguage": {
				"sSearch": '<span class="input-group-addon"><i class="fa fa-search"></i></span>',
				"sProcessing": '<i class="fa fa-spinner fa-pulse fa-fw"></i> <?php echo $this->lang->line('__dt_sLoadingRecords');?>', //add a loading image,simply putting <img src="/img/ajax-loader.gif" /> tag.
				"sInfo": '<?php echo $this->lang->line('__dt_sInfo');?>',
				"sEmptyTable": '<?php echo $this->lang->line('__dt_sEmptyTable');?>',
				"sInfoEmpty": '<?php echo $this->lang->line('__dt_sInfoEmpty');?>',
				"sInfoFiltered": '<?php echo $this->lang->line('__dt_sInfoFiltered');?>',
				"sLengthMenu": '<?php echo $this->lang->line('__dt_sLengthMenu');?>',
				"sLoadingRecords": '<?php echo $this->lang->line('__dt_sLoadingRecords');?>',
				"sProcessing": '<?php echo $this->lang->line('__dt_sProcessing');?>',
				"sZeroRecords": '<?php echo $this->lang->line('__dt_sZeroRecords');?>'
			},		
			"autoWidth" : true,
			"preDrawCallback" : function() {
				// Initialize the responsive datatables helper once.
				if (!responsiveHelper_dt_basic) {
					responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#table-appointments'), breakpointDefinition);
				}
			},
			"rowCallback" : function(nRow) {
				responsiveHelper_dt_basic.createExpandIcon(nRow);
			},
			"drawCallback" : function(oSettings) {
				responsiveHelper_dt_basic.respond();
				$('#table-appointments').find('td:first').css('width', '40px');
				$('#table-appointments').css('width', '100%');
				
				mcs.init_dialog();
				mcs.init_action();

				$("[rel=tooltip]").tooltip();
			},
			//run on first time when datatable create
			"initComplete": function (row) {
				
			},
			//End
			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			
			"order": [
				[0, 'asc']
			],
			"aLengthMenu": [
				[10, 20, 30, 40, 50],
				[10, 20, 30, 40, 50] // change per page values here
			],
			// set the initial value
			"pageLength": 10,
			//{"appointment_id":"2","client_id":"00000000010","appointment_date":"2018-08-13 00:00:00","appointment_title":"test","appointment_description":"terdt","appointment_patient_id":"13","appointment_doctor_id":"13","appointment_status":"1","appointment_token":"fser5543w"}
			aoColumns: [
				{mData: 'appointment_id'},   
				{mData: 'appointment_title'},
				{mData: 'appointment_description'},         
				{mData: 'appointment_date'},
				{mData: 'appointment_status'},
				{mData: 'appointment_token'},
				{mData: 'fullname'},
				{mData: null}, //appointment_doctor_id
				{mData: 'client_id'},
			],
			"aoColumnDefs": [
				{'bSearchable': false, 'aTargets': [0]},
				{'bSearchable': true, 'aTargets': [1]},
				{
					"targets": [0, 5, 8],
					"visible": false,
					"searchable": false,
				},
				
				{
					// The `data` parameter refers to the data for the cell (defined by the
					// `data` option, which defaults to the column being worked with, in
					// this case `data: 0`.
					"render": function (data, type, row) {
	
						newData =  row['appointment_id'];
						
						return newData;
					},
					"targets": 0
				},
				{
					// The `data` parameter refers to the data for the cell (defined by the
					// `data` option, which defaults to the column being worked with, in
					// this case `data: 1`.
					//row['statuses'] != 0
					"render": function (data, type, row) {

						newData = '<a rel="tooltip" data-placement="bottom" data-original-title="<?php echo $this->lang->line('__common_details');?>" href="'+BASE_URL+'appointments/details/'+row['appointment_id']+'" class="preview link">'+row['appointment_title']+'</a>';
						return newData;

					},
					"targets": 1
				},
				{
					// The `data` parameter refers to the data for the cell (defined by the
					// `data` option, which defaults to the column being worked with, in
					// this case `data: 1`.
					//row['statuses'] != 0
					"render": function (data, type, row) {
						newData = row['appointment_description'];
						return newData;

					},
					"targets": 2
				},
				{
					// The `data` parameter refers to the data for the cell (defined by the
					// `data` option, which defaults to the column being worked with, in
					// this case `data: 1`.
					//row['statuses'] != 0
					"render": function (data, type, row) {
						
						newData  = row['appointment_date'];
						return newData;

					},
					"targets": 3
				},
				{
					// The `data` parameter refers to the data for the cell (defined by the
					// `data` option, which defaults to the column being worked with, in
					// this case `data: 1`.
					//row['statuses'] != 0
					"render": function (data, type, row) {
						newData = "";
						if(row['appointment_status'] == 0){
							s = '<span class="label label-success">Confirmed</span>';
						}else if(row['appointment_status'] == 1) {
							s = '<span class="label label-danger">Cancel</span>';
						}else {
							s = '<span class="label label-danger">Pending</span>';
						}
						
						newData  = s;
						
						return newData;

					},
					"targets": 4
				},
				{
					// The `data` parameter refers to the data for the cell (defined by the
					// `data` option, which defaults to the column being worked with, in
					// this case `data: 1`.
					//row['statuses'] != 0
					"render": function (data, type, row) {

						newData = row['appointment_token'];
						
						return newData;

					},
					"targets": 5
				},
				{
					// The `data` parameter refers to the data for the cell (defined by the
					// `data` option, which defaults to the column being worked with, in
					// this case `data: 1`.
					//row['statuses'] != 0
					"render": function (data, type, row) {

						newData = row['fullname'];
						
						return newData;

					},
					"targets": 6
				},
				{
					// The `data` parameter refers to the data for the cell (defined by the
					// `data` option, which defaults to the column being worked with, in
					// this case `data: 4`.
					"render": function (data, type, row) {
						newData = "";

						if(can_delete){
							newData = '<a rel="tooltip" data-placement="bottom" data-original-title="<?php echo $this->lang->line('__common_delete');?>" href="'+BASE_URL+'appointments/delete/'+row['appointment_id']+'" class="direct"><i class="far fa-trash-alt fa-lg"></i></a>&nbsp;';
						}
						if(can_update){
							newData += '<a rel="tooltip" data-placement="bottom" data-original-title="<?php echo $this->lang->line('__common_update');?>"  href="'+BASE_URL+'appointments/view/'+row['appointment_id']+'/" class="preview"><i class="far fa-edit fa-lg"></i></a>';
						}
						
						return newData;
					},
					"targets": 7
				},
			],
			"createdRow": function (row, data, index)
			{
				//var temp_split = data['temp_rad'].split(':rad:');
				
			}
		
		});

		/* END BASIC */
	};
	
	// end pagefunction
	
	
	var pagedestroy = function(){

		fullviewcalendar.fullCalendar( 'destroy' );
		fullviewcalendar = null;
		$("#add-event").off();
		$("#add-event").remove();

		$('#external-events > li').off();
		$('#external-events > li').remove();
		$('#add-event').off();
		$('#add-event').remove();
		$('#calendar-buttons #btn-prev').off();
		$('#calendar-buttons #btn-prev').remove();
		$('#calendar-buttons #btn-next').off();
		$('#calendar-buttons #btn-next').remove();
		$('#calendar-buttons #btn-today').off();
		$('#calendar-buttons #btn-today').remove();
		$('#mt').off();
		$('#mt').remove();
		$('#ag').off();
		$('#ag').remove();
		$('#td').off();
		$('#td').remove();

		if (debugState){
			root.console.log("✔ Calendar destroyed");
		} 
	}

	// end destroy

	// loadscript and run pagefunction
	loadScript(BASE_URL+"js/plugin/moment/moment.min.js", function(){
		loadScript(BASE_URL+"js/plugin/fullcalendar/jquery.fullcalendar.min.js", pagefunction);
	});

	loadScript(BASE_URL+"js/bootbox.min.js", function(){
		loadScript(BASE_URL+"js/plugin/datatables/jquery.dataTables.min.js", function(){
			loadScript(BASE_URL+"js/plugin/datatables/dataTables.bootstrap.min.js", function(){
				loadScript(BASE_URL+"js/plugin/datatable-responsive/datatables.responsive.min.js", table)
			});
		});
	});

</script>
