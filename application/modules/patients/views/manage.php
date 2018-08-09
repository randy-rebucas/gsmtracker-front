<style type="text/css">
	
	.widget-body {
			    border-top: 1px solid #ccc;
			}
</style>
<!-- Bread crumb is created dynamically -->
<!-- row -->
<div class="row">

	<!-- col -->
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<h1 class="page-title txt-color-blueDark">
			<?php echo sprintf($this->lang->line(strtolower($module).'_welcome'), $user_info->username);?> 
		</h1>
	</div>
	<!-- end col -->

</div>
<!-- end row -->

		<!-- NEW WIDGET START -->
		<article class="col-xs-12 col-sm-6 col-md-12 col-lg-12">
			<!-- Widget ID (each widget will need unique ID)-->
			<div class="jarviswidget jarviswidget-color-darken" id="wid-id-0" data-widget-colorbutton="true" data-widget-editbutton="false">
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
			<!-- 	<header>
					<h2><strong>Fixed</strong> <i>Height</i></h2>				
					
				</header> -->

				<!-- widget div-->
				<div>
					
					<!-- widget edit box -->
					<div class="jarviswidget-editbox">
						<!-- This area used as dropdown edit box -->
						<input class="form-control" type="text">
						<span class="note"><i class="fa fa-check text-success"></i> Change title to update and save instantly!</span>
						
					</div>
					<!-- end widget edit box -->
					
					<!-- widget content -->
					<div class="widget-body no-padding">
						<div class="widget-body-toolbar">
							
							<div class="row">
								
								<div class="col-xs-9 col-sm-5 col-md-5 col-lg-5">
									<!-- <div class="input-group">
										<span class="input-group-addon"><i class="fa fa-search"></i></span>
										<input class="form-control" id="prepend" placeholder="Filter" type="text">
									</div> -->
								</div>
								<div class="col-xs-3 col-sm-7 col-md-7 col-lg-7 text-right">
									<a href="<?php echo site_url('export/');?>" class="btn btn-warning btn-sm"><i class="fas fa-lg fa-fw fa-file-export"></i>&nbsp;<span class="hidden-mobile">Export</span> </a>

									<?php //if(($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('patients', $this->role_id, 'create',  $this->client_id) : true) { ?>
										<a href="<?php echo site_url('patients/ajax/modal_create_patient');?>" data-original-title="<?php echo $this->lang->line('__common_create_new');?>" class="preview btn btn-success btn-sm"><i class="fa fa-plus"></i>&nbsp;<span class="hidden-mobile"><?php echo $this->lang->line('__common_create');?></span> </a>
										
									<?php //} ?>
								</div>
								
							</div>
							
								

						</div>
						
						<div class="custom-scroll table-responsive" style="overflow-y: scroll;">

							<table class="table table-striped table-forum" id="table-patients">
								<thead>
									<tr>
										<th>&nbsp;</th>
										<th><?php echo $this->lang->line('common_fullname');?></th>
										<th>Birth Date</th>
										<th><?php echo $this->lang->line('common_address');?></th>
										<th><?php echo $this->lang->line('common_contacts');?></th>
										<th>&nbsp;</th>
										<th>&nbsp;</th>
										<th>&nbsp;</th>
										<th>&nbsp;</th>
										<th>&nbsp;</th>
										<th>&nbsp;</th>
									</tr>
								</thead>
								<tbody>
									
								</tbody>
							</table>
						
							
						</div>	
							
					</div>
					<!-- end widget content -->
					
				</div>
				<!-- end widget div -->
				
			</div>
			<!-- end widget -->

		</article>
		<!-- WIDGET END -->
	
<script type="text/javascript">
	// var can_view = 	'<?php //echo ($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('patients', $this->role_id, 'view',   $this->client_id) : true; ?>';
	// var can_update = '<?php //echo ($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('patients', $this->role_id, 'update',   $this->client_id) : true; ?>';
	// var can_delete = '<?php //echo ($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('patients', $this->role_id, 'delete',   $this->client_id) : true; ?>';

	pageSetUp();

	// run pagefunction
	var user_link = '<?php echo site_url('settings/encryptID/');?>';
	
	var pagefunction = function() {
		//console.log("cleared");
		var module = '<?php echo $module;?>';
		/* // DOM Position key index //
		
			l - Length changing (dropdown)
			f - Filtering input (search)
			t - The Table! (datatable)
			i - Information (records)
			p - Pagination (paging)
			r - pRocessing 
			< and > - div elements
			<"#id" and > - div with an id
			<"class" and > - div with a class
			<"#id.class" and > - div with an id and class
			
			Also see: http://legacy.datatables.net/usage/features
		*/	

		/* BASIC ;*/
			var responsiveHelper_dt_basic = undefined;
			var responsiveHelper_datatable_fixed_column = undefined;
			var responsiveHelper_datatable_col_reorder = undefined;
			var responsiveHelper_datatable_tabletools = undefined;
			
			var breakpointDefinition = {
				tablet : 1024,
				phone : 480
			};
			
			$('#table-patients').dataTable({
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
		            url: BASE_URL + 'patients/ajax/get_data/',
		            type: 'POST',
		            data: {
		                filter: 0
		            }
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
						responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#table-patients'), breakpointDefinition);
					}
				},
				"rowCallback" : function(nRow) {
					responsiveHelper_dt_basic.createExpandIcon(nRow);
				},
				"drawCallback" : function(oSettings) {
					responsiveHelper_dt_basic.respond();
					$('#table-patients').find('td:first').css('width', '40px');
					$('#table-patients').css('width', '100%');
					
					
					
					$("[rel=tooltip]").tooltip();
				},
		        //run on first time when datatable create
		        "initComplete": function () {
					mcs.init_dialog();
					mcs.init_action();
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
		        //{"id":"2","username":"Randy","email":"rebucasrandy1986@gmail.com","rolename":"Administrator","created":"February 08, 2017","fullname":"Randy, Rebucas"}
		        aoColumns: [
		            {mData: 'id'},   
		            {mData: 'fullname'},         
		            {mData: 'username'},
		            {mData: 'email'},
		            {mData: 'created'},
		            {mData: 'avatar'},
					{mData: 'birthday'},
					{mData: 'address'},
					{mData: 'mobile'},
					{mData: 'client_id'},
					{mData: null},
		        ],
		        "aoColumnDefs": [
		            {'bSearchable': true, 'aTargets': [0, 1, 2, 3, 8, 9]},
		            {
		                "targets": [6,7,8,9,10],
		                "visible": false,
		                "searchable": false,
		            },
		            {
		                // The `data` parameter refers to the data for the cell (defined by the
		                // `data` option, which defaults to the column being worked with, in
		                // this case `data: 0`.
		                "render": function (data, type, row) {
							if(row['avatar']){
								newData =  '<img src="'+BASE_URL+'uploads/'+row['client_id']+'/profile-picture/'+row['avatar']+'" alt="'+row['username']+'" style="width:25px; height:25px;" />';
							}else{ 
								newData =  '<img src="<?php echo $this->gravatar->get("'+row['email']+'", 25);?>" />';
							}
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
								newData += '<a rel="tooltip" data-placement="top" data-original-title="<?php echo $this->lang->line('__common_details');?>" href="'+user_link+'/'+row['id']+'">'+ row['fullname'] + '</a>';
							// }else{
								// newData += row['fullname']
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
		                    newData = "";
		                   
		                   if(row['birthday']){
								newData = row['birthday'];
							}else{
								newData = '--';
							}
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
		                    newData = "";

							if(row['address']){
								address = row['address'];
							}else{
								address = '--';
							}
		                    newData  = address;
							
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

							if(row['mobile']){
								mobile = row['mobile'];
							}else{
								mobile = '--';
							}
							
		                    newData = mobile ;

		                    return newData;

		                },
		                "targets": 4
		            }, 
		            {
		                // The `data` parameter refers to the data for the cell (defined by the
		                // `data` option, which defaults to the column being worked with, in
		                // this case `data: 4`.
		                "render": function (data, type, row) {
		                    newData = "";

							// if(can_delete){
								newData += '<a rel="tooltip" data-placement="bottom" data-original-title="<?php echo $this->lang->line('__common_delete');?>" href="'+BASE_URL+'patients/delete/'+row['id']+'/" class="direct"><i class="far fa-trash-alt fa-lg"></i></a>&nbsp;';
							// }
							// if(can_update){
								newData += '<a rel="tooltip" data-placement="bottom" data-original-title="<?php echo $this->lang->line('__common_update');?>"  href="'+BASE_URL+'patients/ajax/modal_edit_patient/'+row['id']+'/" class="preview"><i class="far fa-edit fa-lg"></i></a>&nbsp;';
							// }
							newData += '<a rel="tooltip" data-placement="bottom" data-original-title="Que" href="'+BASE_URL+'patients/patients/que/'+row['id']+'" class="preview"><i class="fas fa-book fa-lg"></i></a>&nbsp;';
		                    return newData;
		                },
		                "targets": 5
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

	loadScript(BASE_URL+"js/bootbox.min.js", function(){
		loadScript(BASE_URL+"js/plugin/datatables/jquery.dataTables.min.js", function(){

			loadScript(BASE_URL+"js/plugin/datatables/dataTables.bootstrap.min.js", function(){
				loadScript(BASE_URL+"js/plugin/datatable-responsive/datatables.responsive.min.js", pagefunction)
			});
				
		});
	});

</script>
