<!-- Bread crumb is created dynamically -->
<!-- row -->
<div class="row">

	<!-- col -->
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<h1 class="page-title txt-color-blueDark"><!-- PAGE HEADER --><?php echo $module;?> <small><?php //echo $this->lang->line('module_settings_desc');?></small></h1>
	</div>
	<!-- end col -->

</div>
<!-- end row -->

<!--
The ID "widget-grid" will start to initialize all widgets below
You do not need to use widgets if you dont want to. Simply remove
the <section></section> and you can use wells or panels instead
-->

<!-- widget grid -->
<section id="widget-grid" class="">

	<!-- row -->

	<div class="row">
		<div class="col-sm-12 col-lg-12">
			<div class="jarviswidget well" id="wid-id-3" data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-togglebutton="false" data-widget-deletebutton="false" data-widget-fullscreenbutton="false" data-widget-custombutton="false" data-widget-sortable="false" role="widget">
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
				<header role="heading">
					<span class="widget-icon"> <i class="fa fa-comments"></i> </span>
					<h2>Default Tabs with border </h2>

				<span class="jarviswidget-loader"><i class="fa fa-refresh fa-spin"></i></span></header>

				<!-- widget div-->
				<div role="content">

					<!-- widget edit box -->
					<div class="jarviswidget-editbox">
						<!-- This area used as dropdown edit box -->

					</div>
					<!-- end widget edit box -->

					<!-- widget content -->
					<div class="widget-body">

						<ul id="settingsTab" class="nav nav-tabs bordered">
							<li id="profile">
								<a href="#s1" data-toggle="tab">Profile</a>
							</li>
							<li id="account">
								<a href="#s2" data-toggle="tab">Account</a>
							</li>
							<li id="emails">
								<a href="#s3" data-toggle="tab">Emails</a>
							</li>
							<li id="notifications">
								<a href="#s4" data-toggle="tab">Notifications</a>
							</li>
							<li class="active" id="billing">
								<a href="#s5" data-toggle="tab">Billing</a>
							</li>
							<li id="configurations">
								<a href="#s6" data-toggle="tab">Configurations</a>
							</li>
							<li class="pull-right">
								<a href="javascript:void(0);">
								<div class="sparkline txt-color-pinkDark text-align-right" data-sparkline-height="18px" data-sparkline-width="90px" data-sparkline-barwidth="7"><canvas width="52" height="18" style="display: inline-block; width: 52px; height: 18px; vertical-align: top;"></canvas></div> </a>
							</li>
						</ul>

						<div id="settingsTabContent" class="tab-content padding-10">
							<div class="tab-pane fade in active" id="s5">
								<legend>Billing overview</legend>

								<table class="table">
									<tbody>
										<tr>
											<th>Plan</th>
											<td><?php echo $client_info->client_plan;?> plan</td>
											<td><a href="<?php echo site_url('account/upgrade');?>" class="btn btn-success btn-sm">Update plan</a></td>
											<td></td>
										</tr>
										<!-- <tr>
											<th>Payment</th>
											<td>No payment method on file.</td>
											<td><a href="" class="btn btn-default btn-sm">Add payment method</a></td>
											<td></td>
										</tr> -->
										
 
									</tbody>
								</table>

								<legend>Payment history</legend>
								<table class="table">
									<tbody>
										<tr>
											<td colspan="4" class="text-center">You have not made any payments.</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

					</div>
					<!-- end widget content -->

				</div>
				<!-- end widget div -->

			</div>
			
		</div>
		
	</div>

	<!-- end row -->

</section>
<!-- end widget grid -->

<script type="text/javascript">
	
	
	$('#settingsTab li a').on('click', function(e) {
		var _self = $(this);
		var val = _self.parent('li').attr('id');
		var title = _self.text();

		var url = '<?php echo site_url();?>settings/'+val;
		history.pushState(null, null, url);
		checkURL();
		// change page title from global var
		document.title = (title || document.title);
		
		e.preventDefault();
		
	});
	// pagefunction

	var pagefunction = function() {
		// clears the variable if left blank
	};

	// end pagefunction

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

	// run pagefunction
	pagefunction();
	
	
</script>
