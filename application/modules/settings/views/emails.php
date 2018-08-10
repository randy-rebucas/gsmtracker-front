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
							<li class="active" id="emails">
								<a href="#s3" data-toggle="tab">Emails</a>
							</li>
							<li id="notifications">
								<a href="#s4" data-toggle="tab">Notifications</a>
							</li>
							<li id="billing">
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
							<div class="tab-pane fade in active" id="s3">
								<legend>Emails</legend>
								<p><code><?php echo $user_info->email;?></code> will be used for account-related notifications and for any operations inside myclinicsoft. </p>
								<?php echo form_open('settings/doUpdateEmailPref/','class="smart-form" id="emails-form"');?>
								<legend>Emails preferences</legend>
								<br/>
									<section>
										<label class="radio">
											<input type="radio" name="email_pref" value="1" <?php 
											
											if($this->Mdl_settings->setting('email_pref')) {
												if($this->Mdl_settings->setting('email_pref') == 1) {
													echo 'checked="checked"';
												} 
											}else{
												echo 'checked="checked"';
											} ;?>>
											<i></i>Only receive account related emails, and those I subscribe to.
										</label>
										<label class="radio">
											<input type="radio" name="email_pref" value="2" 
											<?php 
											if($this->Mdl_settings->setting('email_pref')) {
												if($this->Mdl_settings->setting('email_pref') == 2) {
													echo 'checked="checked"';
												} 
											} ;?>>
											<i></i>Receive all emails, except those I unsubscribe from.
										</label>
										
									</section>
								<button type="submit" id="submit" class="btn btn-primary btn-sm">Update preferences</button>
								</form>
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
	
	pageSetUp();
	runAllForms();
	
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
	
	
	var validatefunction = function() {

		
		$("#emails-form").validate({
			rules : {
                email_pref : {
                    required : true
                }
            },
            // Messages for form validation
            messages : {
                email_pref : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'email preferences');?>'
                }
            },
            highlight: function(element) {
                $(element).closest('section').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).closest('section').removeClass('has-error');
            },
            errorElement: 'div',
            errorClass: 'note',
            errorPlacement: function(error, element) {
                if(element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                }else{
                    error.insertAfter(element);
                }
            },
			// Ajax form submition
			submitHandler : function(form) {
				
				$(form).ajaxSubmit({
					beforeSend: function () {
						$(form).find('#submit').html('<?php echo $this->lang->line('__common_please_wait');?>');
						$(form).find('#submit').attr("disabled", "disabled");
					},
					success:function(response)
					{
						console.log(response);
						if(response.success)
						{
							mcs.init_smallBox("Success", response.message);
							checkURL();
						}
						else
						{
							mcs.init_smallBox("Error", response.message);
						}                   
						$(form).find('#submit').text('<?php echo $this->lang->line('__common_update');?>');
						$(form).find('#submit').removeAttr("disabled");
					},
					dataType:'json'
				});
			}
		});
	}
	loadScript(BASE_URL+"js/plugin/jquery-validate/jquery.validate.min.js", function(){
		loadScript(BASE_URL+"js/plugin/jquery-form/jquery-form.min.js", validatefunction);
	});


</script>
