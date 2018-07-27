
<p class="h1"><?php echo lang('appointments'); ?></p>
<div class="action">	
	<a href="<?php echo site_url('appointments/form'); ?>" class="action-button">
		<span class="icon"><span class="mif-plus"></span></span>
	</a>
</div>
<!-- <div class="multi-action">
	
    <button class="action-button rotate-minus bg-red fg-white"
            onclick="$(this).toggleClass('active')">
        <span class="icon"><span class="mif-filter"></span></span>
    </button>
    <ul class="actions drop-right">
        <li class="bg-blue"><a href="#"><span class="mif-user-plus"></span></a></li>
        <li class="bg-teal"><a href="#"><span class="mif-library"></span></a></li>
        <li class="bg-pink"><a href="#"><span class="mif-alarm"></span></a></li>
        <li class="bg-orange"><a href="#"><span class="mif-lock"></span></a></li>
    </ul>
</div> -->
<table class="table striped table-border" id="table-appointments">
	<thead>
		<tr>
			<th>&nbsp;</th>
			<th>Date</th>
			<th>Time</th>
			<th>Subject</th>
			<th>Message</th>
			<th>From</th>
			<th>Status</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
		</tr>
	</thead>
	<tbody>
		
	</tbody>
</table>

<script>
	
	var pagefunction = function() {

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
		        "ajax": {
		            url: BASE_URL + 'appointments/load_ajax/',
		            type: 'POST',
		            data: {
		                filter: 0
		            }
		        },	
				"autoWidth" : true,
				"preDrawCallback" : function() {
					// Initialize the responsive datatables helper once.
					// if (!responsiveHelper_dt_basic) {
					// 	responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#table-patients'), breakpointDefinition);
					// }
				},
				"rowCallback" : function(nRow) {
					// responsiveHelper_dt_basic.createExpandIcon(nRow);
				},
				"drawCallback" : function(oSettings) {
					// responsiveHelper_dt_basic.respond();
					// $('#table-patients').find('td:first').css('width', '40px');
					$('#table-appointments').css('width', '100%');
					// $("[rel=tooltip]").tooltip();
				},
		        //run on first time when datatable create
		        "initComplete": function () {
					//mcs.init_dialog();
					//mcs.init_action();
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
				// {"appointment_id":"1","appointment_date":"2018-07-27","appointment_time":"12:00:09","appointment_subject":"jghj","appointment_message":"jghjghj","appointment_from":"2","appointment_to":"2","appointment_status":"Pending"}
				aoColumns: [
		            {mData: 'appointment_id'},   
		            {mData: 'appointment_date'},         
		            {mData: 'appointment_time'},
		            {mData: 'appointment_subject'},
		            {mData: 'appointment_message'},
					{mData: 'appointment_from'},
					{mData: 'appointment_to'},
					{mData: 'appointment_status'},
					{mData: null},
		        ],
		        "aoColumnDefs": [
		            {'bSearchable': true, 'aTargets': [3]},
		            {
		                "targets": [0],
		                "visible": false,
		                "searchable": false,
		            },
		            {
		                // The `data` parameter refers to the data for the cell (defined by the
		                // `data` option, which defaults to the column being worked with, in
		                // this case `data: 1`.
		                //row['statuses'] != 0
		                "render": function (data, type, row) {
		                    newData = "";
							
							// if(can_view){
								newData += '<a rel="tooltip" data-placement="top" data-original-title="<?php echo $this->lang->line('__common_details');?>" href="/'+row['appointment_id']+'">'+ row['appointment_date'] + '</a>';
							// }else{
							// 	newData += row['fullname']
							// }
		                   
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
		                    newData = "";
							
							// if(can_view){
								newData += '<a rel="tooltip" data-placement="top" data-original-title="<?php echo $this->lang->line('__common_details');?>" href="/'+row['appointment_id']+'">'+ row['appointment_date'] + '</a>';
							// }else{
							// 	newData += row['fullname']
							// }
		                   
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
		                    
							newData = row['appointment_time'];
							
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
							
							newData = row['appointment_subject'];
							
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
		                    
							newData = row['appointment_message'];
							
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
		                    
							newData = row['appointment_from'];
							
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
		                    
							newData = row['appointment_status'];
							
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

							// if(can_delete){
								newData += '<a rel="tooltip" data-placement="bottom" data-original-title="<?php echo $this->lang->line('__common_delete');?>" href="'+BASE_URL+'patients/delete/'+row['appointment_id']+'/" class="direct"><i class="far fa-trash-alt fa-lg"></i></a>&nbsp;';
							// }
							// if(can_update){
								newData += '<a rel="tooltip" data-placement="bottom" data-original-title="<?php echo $this->lang->line('__common_update');?>"  href="'+BASE_URL+'patients/view/'+row['appointment_id']+'/" class="preview"><i class="far fa-edit fa-lg"></i></a>&nbsp;';
							// }
							newData += '<a rel="tooltip" data-placement="bottom" data-original-title="Que" href="'+BASE_URL+'patients/patients/que/'+row['appointment_id']+'" class="preview"><i class="fas fa-book fa-lg"></i></a>&nbsp;';
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

	var pagedestroy = function() {

		/*
		 Example below:

		 $("#calednar").fullCalendar( 'destroy' );
		 if (debugState){
		 root.console.log("✔ Calendar destroyed");
		 }

		 For common instances, such as Jarviswidgets, Google maps, and Datatables, are automatically destroyed through the app.js loadURL mechanic

		 */
	}
	// end destroy
	

	loadScript("//cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js", pagefunction);

	
</script>