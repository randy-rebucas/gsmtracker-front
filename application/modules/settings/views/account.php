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
							<li class="active" id="account">
								<a href="#s2" data-toggle="tab">Account</a>
							</li>
							<li id="emails">
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
							<div class="tab-pane fade in active" id="s2">
								<?php echo form_open('settings/doUpdatePassword/',array('id'=>'account-form','class'=>'smart-form', 'role'=>'form'));?>
									<legend>Change password</legend>
									<fieldset>	
										<div class="row">
											<div class="col-md-4">

												<section>
													<label class="label">Old password</label>
													<label class="input">
														<input type="password" name="old_password" id="old_password" value="" class=""/>
													</label>
												</section>
												<section>
													<label class="label">New password</label>
													<label class="input">
														<input type="password" name="new_password" id="new_password" value="" class=""/>
													</label>
												</section>
												<section>
													<label class="label">Confirm password</label>
													<label class="input">
														<input type="password" name="confirm_password" id="confirm_password" value="" class=""/>
													</label>
												</section>
											
												
												<button type="submit" id="submit" class="btn btn-primary btn-sm">Update password</button>
											</div>
											<div class="col-md-3 text-center">
												
												
												
											</div>
										</div>
										
									</fieldset>
								</form>
								<legend>Change username</legend>
								<fieldset>
									
									<p>Changing your username can have unintended side effects.</p>
									<?php echo form_open('settings/doUpdateUsername/',array('id'=>'username-form','class'=>'smart-form', 'role'=>'form'));?>
										
										<fieldset>	
											<div class="row">
												<div class="col-md-4">

													<section>
														<label class="label">New Username</label>
														<label class="input">
															<input type="text" name="username" id="username" value="" class=""/>
														</label>
													</section>
													<section>
														<label class="label">Password</label>
														<label class="input">
															<input type="password" name="password" id="password" value="" class=""/>
														</label>
													</section>
													
													<button type="submit" id="username-submit" class="btn btn-default btn-sm">Update username</button>
												</div>
												<div class="col-md-3 text-center">

												</div>
											</div>
											
										</fieldset>
									</form>
									
								</fieldset>
								<legend>Delete Account</legend>
								<fieldset>
									<p>Once you delete your account, there is no going back. Please be certain.</p>
									
									<?php echo form_open('settings/doDeleteMe/',array('id'=>'delete-form','class'=>'smart-form', 'role'=>'form'));?>
									
										<fieldset>	
											<div class="row">
												<div class="col-md-4">
													<section>
														<label class="label">Recent password</label>
														<label class="input">
															<input type="password" name="recent_pass" id="recent_pass" value="" class=""/>
														</label>
													</section>
													
													<button type="submit" id="delete-submit" class="btn btn-danger btn-sm">Delete your account</button>
												</div>
												<div class="col-md-3 text-center">

												</div>
											</div>
											
										</fieldset>
									</form>	
								</fieldset>
							
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

		
		$("#account-form").validate({
			rules : {
                old_password : {
                    required : true,
                    maxlength: 10,
                    minlength: 6
                },
                new_password : {
                    required : true,
                    maxlength: 10,
                    minlength: 6
                },
				confirm_password : {
                    required : true,
                    maxlength: 10,
                    equalTo: "#new_password"
                }
            },
            // Messages for form validation
            messages : {
                old_password : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'old password');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 10);?></span>',
                    minlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_minlength'), 6);?></span>'
                },
                new_password : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'new password');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 10);?></span>',
                    minlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_minlength'), 6);?></span>'
                },
				confirm_password : {
                    required : '<i class="fa fa-exclamation-circle"></i><?php echo sprintf($this->lang->line('__validate_required'), 'confirm passwprd');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 10);?>',
                    equalTo: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_equalTo'), 'new password');?>'
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

		$("#username-form").validate({
			rules : {
                username : {
					required : true,
					maxlength: 50,
					remote: {
						url: BASE_URL+'auth/checkexistusername',
						type: "post",
						data: {
							username: function(){ 
								return $("#username").val();
							}
						}
					}
				},
                password : {
                    required : true,
                    maxlength: 10,
                    minlength: 6
                }
            },
            // Messages for form validation
            messages : {
                username : {
					required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'username');?>',
					maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 50);?>',
					remote: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_remote_exist'), 'username');?>'
				},
                password : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'password');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 10);?></span>',
                    minlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_minlength'), 6);?></span>'
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
						$(form).find('#username-submit').html('<?php echo $this->lang->line('__common_please_wait');?>');
						$(form).find('#username-submit').attr("disabled", "disabled");
					},
					success:function(response)
					{

						if(response.success)
						{
							mcs.init_smallBox("Success", response.message);
							location.reload();  
						}
						else
						{
							mcs.init_smallBox("Error", response.message);
							
						}                   
						$(form).find('#username-submit').text('<?php echo $this->lang->line('__common_update');?>');
						$(form).find('#username-submit').removeAttr("disabled");
					},
					dataType:'json'
				});
			}
		});

		$("#delete-form").validate({
			rules : {
				recent_pass : {
                    required : true,
                    maxlength: 10,
                    minlength: 6
                }
            },
            // Messages for form validation
            messages : {
                recent_pass : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'confirm password');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 10);?></span>',
                    minlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_minlength'), 6);?></span>'
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
						$(form).find('#delete-submit').html('<?php echo $this->lang->line('__common_please_wait');?>');
						$(form).find('#delete-submit').attr("disabled", "disabled");
					},
					success:function(response)
					{

						if(response.success)
						{
							mcs.init_smallBox("Success", response.message);
							location.reload();  
						}
						else
						{
							mcs.init_smallBox("Error", response.message);
							
						}                   
						$(form).find('#delete-submit').text('<?php echo $this->lang->line('__common_update');?>');
						$(form).find('#delete-submit').removeAttr("disabled");
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
