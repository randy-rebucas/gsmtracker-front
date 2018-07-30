<style type="text/css">
	section#bod .select {
    margin-right: .6em;
}
</style>
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
							<li class="active" id="profile">
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
							<div class="tab-pane fade in active" id="s1">
								<?php echo form_open_multipart('settings/doUpdateProfile/',array('id'=>'profile-form','class'=>'smart-form', 'role'=>'form'));?>
									<input type="hidden" name="token" value="<?php echo $user_info->token;?>">
									<input type="hidden" name="avatar" value="<?php echo $user_info->avatar;?>">
									<legend>Public profile</legend>
									<fieldset>	
										<div class="row">
											<div class="col-md-9">
												<section>
													<label class="label">Profile Picture</label>
													<div class="input input-file">
														<span class="button"><input type="file" id="profile_pic" name="profile_pic" value="" onchange="this.parentNode.nextSibling.value = this.value">Upload new picture</span><input type="text" readonly="">
													</div>
												</section>
												<div class="row">
													<section class="col col-4">
														<label class="label">First Name</label>
														<label class="input">
															<input type="text" name="firstname" id="firstname" value="<?php echo $user_info->firstname;?>" class=""/>
														</label>
													</section>
													<section class="col col-4">
														<label class="label">Middle Initial</label>
														<label class="input">
															<input type="text" name="mi" id="mi" value="<?php echo $user_info->mi;?>" class=""/>
														</label>
													</section>
													<section class="col col-4">
														<label class="label">Last Name</label>
														<label class="input">
															<input type="text" name="lastname" id="lastname" value="<?php echo $user_info->lastname;?>" class=""/>
														</label>
													</section>
												</div>

												<div class="row">
													<section class="col col-2">
														<label class="label">Gender</label>
														<label class="select">
				
															<?php $gender = array(
																''=>'select',
																'1'=> $this->lang->line('__common_male'),
																'2'=> $this->lang->line('__common_female')
															);
															echo form_dropdown('gender',$gender, $user_info->gender,'tabindex="18" id="gender"'); ?>
															<i></i>

														</label>
													</section>
													<section class="col col-4"  id="bod">
														<label class="label">Birth date</label>
														<label class="select col-md-3">
															<?php 
															 $cutoff = 1910;

														    // current year
														    $now = date('Y');
															// build years menu
														    echo '<select name="year" id="year">' . PHP_EOL;
														    echo '  <option value="">select</option>' . PHP_EOL;
														    for ($y=$now; $y>=$cutoff; $y--) {
														    	$selected = ($y == $user_info->bYear) ? 'selected="selected"' : '';
														        echo '  <option value="' . $y . '" '.$selected.'>' . $y . '</option>' . PHP_EOL;
														    }
														    echo '</select>' . PHP_EOL;
															?>
															<i></i>

														</label>
														<label class="select col-md-3">
															
														<?php 
														    // build months menu
														    echo '<select name="month" id="month">' . PHP_EOL;
														    echo '  <option value="">select</option>' . PHP_EOL;
														    for ($m=1; $m<=12; $m++) {
														    	$selected = ($m == $user_info->bMonth) ? 'selected="selected"' : '';
														        echo '  <option value="' . $m . '" '.$selected.'>' . date('M', mktime(0,0,0,$m)) . '</option>' . PHP_EOL;
														    }
														    echo '</select>' . PHP_EOL;
														    ?>
														    <i></i>
														</label>
														<label class="select col-md-3">
															
														<?php 
														    // build days menu
														    echo '<select name="day" id="day">' . PHP_EOL;
														    echo '  <option value="">select</option>' . PHP_EOL;
														    for ($d=1; $d<=31; $d++) {
														    	$selected = ($d == $user_info->bDay) ? 'selected="selected"' : '';
														        echo '  <option value="' . $d . '" '.$selected.'>' . str_pad($d, 2, "0", STR_PAD_LEFT) . '</option>' . PHP_EOL;
														    }
														    echo '</select>' . PHP_EOL;
														    ?>
														    <i></i>
														</label>


													</section>
													<section class="col col-3">
														<label class="label">Tel Number</label>
														<label class="input">
															<input type="text" name="work_phone" id="work_phone" value="<?php echo $user_info->work_phone;?>" class=""/>
														</label>
													</section>
													<section class="col col-3">
														<label class="label">Phone Number</label>
														<label class="input">
															<input type="text" name="mobile" id="mobile" value="<?php echo $user_info->mobile;?>" class=""/>
														</label>
													</section>
												</div>
												<p class="alert alert-info">All of the fields on this page are optional and can be deleted at any time, and by filling them out, 
													you're giving us consent to share this data wherever your user profile appears. 
												Please see our <a href="">privacy statement</a> to learn more about how we use this information.</p>
												
												
												<button type="submit" id="submit" class="btn btn-primary btn-sm"><?php echo $this->lang->line('common_update');?></button>
													
												
											</div>
											<div class="col-md-3 text-center">
												
												<?php if($user_info->avatar){
													echo '<img src="'. base_url().'/uploads/'.$this->client_id.'/profile-picture/sizes/150/'.$user_info->avatar.'"/>';
												}else{
													echo '<img src="' . $this->gravatar->get($user_info->email, 150) . '" />';
												}?>
												
											</div>
										</div>
										
									</fieldset>
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

		
		$("#profile-form").validate({
			rules : {
                firstname : {
                    required : true,
                    maxlength: 50
                },
                mi : {
                    required : true,
                    maxlength: 1
                },
				lastname : {
                    required : true,
                    maxlength: 50
                },
				gender : {
                    required : true
                },
				year : {
                    required : true
                },
				month : {
                    required : true
                },
				day : {
                    required : true
                },
				work_phone : {
					required : true,
                    maxlength: 15
                },
				mobile : {
					required : true,
                    maxlength: 15
                }
            },
            // Messages for form validation
            messages : {
                firstname : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'firstname');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 50);?></span>'
                },
                mi : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'middle initial');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 1);?></span>'
                },
				lastname : {
                    required : '<i class="fa fa-exclamation-circle"></i><?php echo sprintf($this->lang->line('__validate_required'), 'lastname');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 50);?>'
                },
				gender : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'gender');?>'
                },
                year : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'year');?>'
                },
				month : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'month');?>'
                },
				day : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'day');?>'
                },
                work_phone : {
                	required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'work phone');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 15);?>'
                },
				mobile : {
					required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'mobile');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 15);?>'
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
