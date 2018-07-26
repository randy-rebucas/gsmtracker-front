<style>
.content-error{
	color:red !important;
}
.chat-body ul li.message img {
    width: 50px;
    height: auto;
}
.editable.editable-click {
    color: #383838 !important;
    border-bottom: dashed 1px #383838;
}
.connections-list img, .followers-list img {
    width: 35px;
    height: auto;
}

.chart-large {
    height: 300px;
    width: 100%;
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

<!--
The ID "widget-grid" will start to initialize all widgets below
You do not need to use widgets if you dont want to. Simply remove
the <section></section> and you can use wells or panels instead
-->
<!-- <div id="chart_div" style="width: 100%; height: 500px;"></div>  -->
<div class="row">
	<div class="col-sm-12 col-md-9 col-lg-9">
		<!-- new widget -->
		<div class="jarviswidget jarviswidget-color-blue" id="wid-id-5" data-widget-editbutton="false" data-widget-colorbutton="false">

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
				<span class="widget-icon"> <i class="fa fa-users txt-color-white"></i> </span>
				<h2> Today's Encounter </h2>
				<!-- <div class="widget-toolbar">
				add: non-hidden - to disable auto hide

				</div>-->
			</header>

			<!-- widget div-->
			<div>
				<!-- widget edit box -->
				<div class="jarviswidget-editbox">
					<div>
						<label>Title:</label>
						<input type="text" />
					</div>
				</div>
				<!-- end widget edit box -->

				<div class="widget-body no-padding">
					<!-- content goes here -->
					<div class="alert alert-info fade in">
				
						<strong id="encounter-count">0 </strong>
						<i class="fa-fw fa fa-info-circle pull-right"></i>
					</div>

					<div id="encounter"></div>
					<!-- end content -->
				</div>

			</div>
			<!-- end widget div -->
		</div>
		<!-- end widget -->
		<!-- new widget -->
		<div class="jarviswidget jarviswidget-color-blueDark" id="wid-id-3" data-widget-colorbutton="false">

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
				<h2> Appointments</h2>
				<div class="widget-toolbar">
					<!-- add: non-hidden - to disable auto hide -->
					
				</div>
			</header>

			<!-- widget div-->
			<div>
				<!-- widget edit box -->
				<div class="jarviswidget-editbox">
					<div>
						<label>Title:</label>
						<input type="text" />
					</div>
				</div>
				<!-- end widget edit box -->

				<div class="widget-body no-padding">
					<!-- content goes here -->
					<div class="alert alert-info fade in">
				
						<strong id="appointments-count">0 </strong>
						<i class="fa-fw fa fa-info-circle pull-right"></i>
					</div>
					<div id="appointments"></div>
					<!-- end content -->
				</div>

			</div>
			<!-- end widget div -->
		</div>
		<!-- end widget -->

	</div>

	<div class="col-sm-12 col-md-3 col-lg-3">
		<div class="row">
			<div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> 
				<span class="text"> My Tasks <span class="pull-right">130/200</span> </span>
				<div class="progress">
					<div class="progress-bar bg-color-blueDark" style="width: 65%;"></div>
				</div> 
			</div>
			<div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> 
				<span class="text"> Transfered <span class="pull-right">440 GB</span> </span>
				<div class="progress">
					<div class="progress-bar bg-color-blue" style="width: 34%;"></div>
				</div> 
			</div>
			<div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> 
				<span class="text"> Bugs Squashed<span class="pull-right">77%</span> </span>
				<div class="progress">
					<div class="progress-bar bg-color-blue" style="width: 77%;"></div>
				</div> 
			</div>
			<div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> 
				<span class="text"> User Testing <span class="pull-right">7 Days</span> </span>
				<div class="progress">
					<div class="progress-bar bg-color-greenLight" style="width: 84%;"></div>
				</div>
			</div>

		</div>

		<div class="show-stat-microcharts">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

				<div class="easy-pie-chart txt-color-orangeDark" data-percent="33" data-pie-size="50">
					<span class="percent percent-sign">35</span>
				</div>
				<span class="easy-pie-title"> Server Load <i class="fa fa-caret-up icon-color-bad"></i> </span>
				<ul class="smaller-stat hidden-sm pull-right">
					<li>
						<span class="label bg-color-greenLight"><i class="fa fa-caret-up"></i> 97%</span>
					</li>
					<li>
						<span class="label bg-color-blueLight"><i class="fa fa-caret-down"></i> 44%</span>
					</li>
				</ul>
				<div class="sparkline txt-color-greenLight hidden-sm hidden-md pull-right" data-sparkline-type="line" data-sparkline-height="33px" data-sparkline-width="70px" data-fill-color="transparent">
					130, 187, 250, 257, 200, 210, 300, 270, 363, 247, 270, 363, 247
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="easy-pie-chart txt-color-greenLight" data-percent="78.9" data-pie-size="50">
					<span class="percent percent-sign">78.9 </span>
				</div>
				<span class="easy-pie-title"> Disk Space <i class="fa fa-caret-down icon-color-good"></i></span>
				<ul class="smaller-stat hidden-sm pull-right">
					<li>
						<span class="label bg-color-blueDark"><i class="fa fa-caret-up"></i> 76%</span>
					</li>
					<li>
						<span class="label bg-color-blue"><i class="fa fa-caret-down"></i> 3%</span>
					</li>
				</ul>
				<div class="sparkline txt-color-blue hidden-sm hidden-md pull-right" data-sparkline-type="line" data-sparkline-height="33px" data-sparkline-width="70px" data-fill-color="transparent">
					257, 200, 210, 300, 270, 363, 130, 187, 250, 247, 270, 363, 247
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="easy-pie-chart txt-color-blue" data-percent="23" data-pie-size="50">
					<span class="percent percent-sign">23 </span>
				</div>
				<span class="easy-pie-title"> Transfered <i class="fa fa-caret-up icon-color-good"></i></span>
				<ul class="smaller-stat hidden-sm pull-right">
					<li>
						<span class="label bg-color-darken">10GB</span>
					</li>
					<li>
						<span class="label bg-color-blueDark"><i class="fa fa-caret-up"></i> 10%</span>
					</li>
				</ul>
				<div class="sparkline txt-color-darken hidden-sm hidden-md pull-right" data-sparkline-type="line" data-sparkline-height="33px" data-sparkline-width="70px" data-fill-color="transparent">
					200, 210, 363, 247, 300, 270, 130, 187, 250, 257, 363, 247, 270
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="easy-pie-chart txt-color-darken" data-percent="36" data-pie-size="50">
					<span class="percent degree-sign">36 <i class="fa fa-caret-up"></i></span>
				</div>
				<span class="easy-pie-title"> Temperature <i class="fa fa-caret-down icon-color-good"></i></span>
				<ul class="smaller-stat hidden-sm pull-right">
					<li>
						<span class="label bg-color-red"><i class="fa fa-caret-up"></i> 124</span>
					</li>
					<li>
						<span class="label bg-color-blue"><i class="fa fa-caret-down"></i> 40 F</span>
					</li>
				</ul>
				<div class="sparkline txt-color-red hidden-sm hidden-md pull-right" data-sparkline-type="line" data-sparkline-height="33px" data-sparkline-width="70px" data-fill-color="transparent">
					2700, 3631, 2471, 2700, 3631, 2471, 1300, 1877, 2500, 2577, 2000, 2100, 3000
				</div>
			</div>
		</div>

	</div>
</div>

<script type="text/javascript">

	/* DO NOT REMOVE : GLOBAL FUNCTIONS!
	 *
	 * pageSetUp(); WILL CALL THE FOLLOWING FUNCTIONS
	 *
	 * // activate tooltips
	 * $("[rel=tooltip]").tooltip();
	 *
	 * // activate popovers
	 * $("[rel=popover]").popover();
	 *
	 * // activate popovers with hover states
	 * $("[rel=popover-hover]").popover({ trigger: "hover" });
	 *
	 * // activate inline charts
	 * runAllCharts();
	 *
	 * // setup widgets
	 * setup_widgets_desktop();
	 *
	 * // run form elements
	 * runAllForms();
	 *
	 ********************************
	 *
	 * pageSetUp() is needed whenever you load a page.
	 * It initializes and checks for all basic elements of the page
	 * and makes rendering easier.
	 *
	 */
	pageSetUp();

	/*
	 * PAGE RELATED SCRIPTS
	 */

	// pagefunction
	
	var pagefunction = function() {

		//load all patients encounter today	
		$.ajax({
			url: BASE_URL+'patients/load_ajax/',
			type: 'post', 
			data: {
				filter: '<?php echo date('Y-m-d');?>'
			},               
			dataType: 'json',
			success: function (response) {
				
				var items = [];
				$.each(response.data, function(index, val) {
					
					if(val.avatar){
						picture =  '<img src="'+BASE_URL+'uploads/'+client_id+'/profile-picture/'+val.avatar+'" alt="'+val.username+'" style="width:50px;" />';
					}else{
						picture =  '<img src="<?php echo $this->gravatar->get("'+row['email']+'", 50);?>" />';
					}
						
					item =	'<div class="user" title="'+val.email+'">'+
								picture+'<a href="javascript:void(0);">'+val.fullname+'</a>'+
								'<div class="email">'+val.email+'</div>'+
							'</div>';	

					items.push(item);
				});

				$('#encounter-count').html(response.recordsTotal +' encounter as of today!');
				$('#encounter').append(items);

			}
		});

		//load all patients appointments
		$.ajax({
			url: BASE_URL+'appointments/get/',
			type: 'post', 
			data: {
				filter: '<?php echo date('Y-m-d');?>'
			},               
			dataType: 'json',
			success: function (response) {
				
				console.log(response);
				var items = [];
				//[{"id":"1","title":"Test","description":"sample only","start":"2018-06-24"}]
				$.each(response.data, function(index, val) {
					
					if(val.avatar){
						picture =  '<img src="'+BASE_URL+'uploads/'+client_id+'/profile-picture/'+val.avatar+'" alt="'+val.username+'" style="width:50px;" />';
					}else{
						picture =  '<img src="<?php echo $this->gravatar->get("'+row['email']+'", 50);?>" />';
					}
						
					item =	'<div class="user" title="'+val.email+'">'+
								picture+'<a href="javascript:void(0);">'+val.fullname+'</a>'+
								'<div class="email">'+val.email+'</div>'+
							'</div>';	

					items.push(item);
				});

				$('#appointments-count').html('No appointments as of today!');
				$('#appointments').append(items);

			}
		});
	};
	
	// end pagefunction

	// destroy generated instances 
	// pagedestroy is called automatically before loading a new page
	// only usable in AJAX version!

	var pagedestroy = function(){
		
		
		// debug msg
		if (debugState){
			root.console.log("✔ Calendar, Flot Charts, Vector map, misc events destroyed");
		} 


	}

	// end destroy
	
	// run pagefunction on load
	pagefunction();
	
	
</script>


