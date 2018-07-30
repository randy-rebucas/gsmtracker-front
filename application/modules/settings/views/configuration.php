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
							<li id="billing">
								<a href="#s5" data-toggle="tab">Billing</a>
							</li>
							<li class="active" id="configurations">
								<a href="#s6" data-toggle="tab">Configurations</a>
							</li>
							<li class="pull-right">
								<a href="javascript:void(0);">
								<div class="sparkline txt-color-pinkDark text-align-right" data-sparkline-height="18px" data-sparkline-width="90px" data-sparkline-barwidth="7"><canvas width="52" height="18" style="display: inline-block; width: 52px; height: 18px; vertical-align: top;"></canvas></div> </a>
							</li>
						</ul>

						<div id="settingsTabContent" class="tab-content padding-10">
							<div class="tab-pane fade in active" id="s6">
								
								<?php echo form_open_multipart('settings/doUpdateConfigurations/',array('id'=>'configuration-form','class'=>'smart-form', 'role'=>'form'));?>
								
								<legend>Business Details</legend>
								<fieldset>	
									
									<div class="row">
										<div class="col-md-9">
											
											<section>
												<label class="label"><?php echo $this->lang->line('setting_business_logo');?></label>
												<div class="input input-file">
													<span class="button"><input type="file" id="logo" name="logo" onchange="this.parentNode.nextSibling.value = this.value">Upload</span><input type="text" readonly="">
												</div>
											</section>
											
											<div class="row">
												<section class="col col-6">
													<label class="label"><?php echo $this->lang->line('setting_business_name'); ?></label>
													<label class="input">
														<input type="text" name="business_name" id="business_name" placeholder="Business Name" value="<?php echo $this->config->item('business_name');?>" class=""/>
													</label>
												</section>
												
												<section class="col col-6">
													<label class="label"><?php echo $this->lang->line('setting_business_owner'); ?></label>
													<label class="input">
														<input type="text" name="business_owner" id="business_owner" placeholder="Business Owner" value="<?php echo $this->config->item('business_owner');?>" class="form-control"/>
													</label>
												</section>
											</div>
											<section>
												<label class="label"><?php echo $this->lang->line('setting_business_address'); ?></label>
												<label class="textarea textarea-resizable">
													<textarea class="form-control" name="business_address" id="business_address" placeholder="Business Address" rows="3"><?php echo $this->config->item('business_address');?></textarea>
												</label>
											</section>
											
											<div class="row">
												<section class="col col-3">
													<label class="label"><?php echo $this->lang->line('setting_prc'); ?></label>
													<label class="input">
														<input type="text" name="prc" id="prc" value="<?php echo $this->config->item('prc');?>" class="form-control"/>
													</label>
												</section>
												
												<section class="col col-3">
													<label class="label"><?php echo $this->lang->line('setting_ptr'); ?></label>
													<label class="input">
														<input type="text" name="ptr" id="ptr" value="<?php echo $this->config->item('ptr');?>" class="form-control"/>
													</label>
												</section>

												<section class="col col-3">
													<label class="label"><?php echo $this->lang->line('setting_s2'); ?></label>
													<label class="input">
														<input type="text" name="s2" id="s2" value="<?php echo $this->config->item('s2');?>" class="form-control"/>
													</label>
												</section>

												<section class="col col-3">
													<label class="label">Consultation Fee (PF)</label>
													<label class="input">
														<input type="text" name="pf" id="pf" value="<?php echo $this->config->item('pf');?>" class="form-control text-right"/>
														<span class="help">No decimal</span>
													</label>
												</section>
											</div>
											
											<div class="row">
												<section class="col col-6">
													<label class="label"><?php echo $this->lang->line('setting_week_day_morning_open'); ?></label>
													<label class="input"> 
														<input type="text" name="morning_open_time" id="morning_open_time" value="<?php echo ($this->config->item('morning_open_time')) ? $this->config->item('morning_open_time') : '8:30 AM';?>" class="form-control timepicker timepicker-no-seconds">
													</label>
												</section>
												<section class="col col-6">
													<label class="label"><?php echo $this->lang->line('setting_week_day_morning_close'); ?></label>
													<label class="input"> 
														<input type="text" name="morning_close_time" id="morning_close_time" value="<?php echo ($this->config->item('morning_close_time')) ? $this->config->item('morning_close_time') : '11:30 AM';?>" class="form-control timepicker timepicker-no-seconds">
													</label>
												</section>
											</div>
											
											<div class="row">
												<section class="col col-6">
													<label class="label"><?php echo $this->lang->line('setting_week_day_afternoon_open'); ?></label>
													<label class="input"> 
														<input type="text" name="afternoon_open_time" id="afternoon_open_time" value="<?php echo ($this->config->item('afternoon_open_time')) ? $this->config->item('afternoon_open_time') : '1:00 PM';?>" class="form-control timepicker timepicker-no-seconds">
													</label>
												</section>
												<section class="col col-6">
													<label class="label"><?php echo $this->lang->line('setting_week_day_afternoon_close'); ?></label>
													<label class="input"> 
														<input type="text" name="afternoon_close_time" id="afternoon_close_time" value="<?php echo ($this->config->item('afternoon_close_time')) ? $this->config->item('afternoon_close_time') : '6:00 PM';?>" class="form-control timepicker timepicker-no-seconds">
													</label>
												</section>
											</div>
											
											<div class="row">
												<section class="col col-6">
													<label class="label"><?php echo $this->lang->line('setting_week_end_open'); ?></label>
													<label class="input"> 
														<input type="text" name="week_end_open_time" id="week_end_open_time" value="<?php echo ($this->config->item('week_end_open_time')) ? $this->config->item('week_end_open_time') : '10:00 AM';?>" class="form-control timepicker timepicker-no-seconds">
													</label>
												</section>
												<section class="col col-6">
													<label class="label"><?php echo $this->lang->line('setting_week_end_close'); ?></label>
													<label class="input"> 
														<input type="text" name="week_end_close_time" id="week_end_close_time" value="<?php echo ($this->config->item('week_end_close_time')) ? $this->config->item('week_end_close_time') : '3:00 PM';?>" class="form-control timepicker timepicker-no-seconds">
													</label>
												</section>
											</div>
											<p class="alert alert-info">Please note that all of details provided will be use in our listings module for patients want to have an appointments. Except on the consultation fee detail. Consultation fee only use in revenue tracking.</p>
											<button type="submit" id="submit" class="btn btn-primary btn-sm">Update configurations</button>
										</div>
										<div class="col-md-3 text-center">
											<?php if($this->config->item('company_logo')) { 
											echo '<img src="'. base_url().'uploads/'.$this->client_id.'/logo/sizes/250/'.$this->config->item('company_logo').'"/>';
											} ?>
											
										</div>
									</div>
								</fieldset>
								<fieldset class="hidden">
									<div class="row">
										<div class="col-md-9">
											<legend><?php echo $this->lang->line('setting_locale_configuration'); ?></legend>
											<section></section>
											<div class="row">
												<section class="col col-6">
													<label class="label"><?php echo $this->lang->line('setting_language'); ?></label>
													<label class="select">
														<?php echo form_dropdown('language', array(
														'english' => $this->lang->line('common_english')
														),
														$this->config->item('language'),'class="form-control" id="language"');
														?><i></i>
													</label>
												</section>
												
												<section class="col col-6">
													<label class="label"><?php echo $this->lang->line('setting_timezone'); ?></label>
													<label class="select">
														<?php echo form_dropdown('timezone', 
													 array(
														'Pacific/Midway'=>'(GMT-11:00) Midway Island, Samoa',
														'America/Adak'=>'(GMT-10:00) Hawaii-Aleutian',
														'Etc/GMT+10'=>'(GMT-10:00) Hawaii',
														'Pacific/Marquesas'=>'(GMT-09:30) Marquesas Islands',
														'Pacific/Gambier'=>'(GMT-09:00) Gambier Islands',
														'America/Anchorage'=>'(GMT-09:00) Alaska',
														'America/Ensenada'=>'(GMT-08:00) Tijuana, Baja California',
														'Etc/GMT+8'=>'(GMT-08:00) Pitcairn Islands',
														'America/Los_Angeles'=>'(GMT-08:00) Pacific Time (US & Canada)',
														'America/Denver'=>'(GMT-07:00) Mountain Time (US & Canada)',
														'America/Chihuahua'=>'(GMT-07:00) Chihuahua, La Paz, Mazatlan',
														'America/Dawson_Creek'=>'(GMT-07:00) Arizona',
														'America/Belize'=>'(GMT-06:00) Saskatchewan, Central America',
														'America/Cancun'=>'(GMT-06:00) Guadalajara, Mexico City, Monterrey',
														'Chile/EasterIsland'=>'(GMT-06:00) Easter Island',
														'America/Chicago'=>'(GMT-06:00) Central Time (US & Canada)',
														'America/New_York'=>'(GMT-05:00) Eastern Time (US & Canada)',
														'America/Havana'=>'(GMT-05:00) Cuba',
														'America/Bogota'=>'(GMT-05:00) Bogota, Lima, Quito, Rio Branco',
														'America/Caracas'=>'(GMT-04:30) Caracas',
														'America/Santiago'=>'(GMT-04:00) Santiago',
														'America/La_Paz'=>'(GMT-04:00) La Paz',
														'Atlantic/Stanley'=>'(GMT-04:00) Faukland Islands',
														'America/Campo_Grande'=>'(GMT-04:00) Brazil',
														'America/Goose_Bay'=>'(GMT-04:00) Atlantic Time (Goose Bay)',
														'America/Glace_Bay'=>'(GMT-04:00) Atlantic Time (Canada)',
														'America/St_Johns'=>'(GMT-03:30) Newfoundland',
														'America/Araguaina'=>'(GMT-03:00) UTC-3',
														'America/Montevideo'=>'(GMT-03:00) Montevideo',
														'America/Miquelon'=>'(GMT-03:00) Miquelon, St. Pierre',
														'America/Godthab'=>'(GMT-03:00) Greenland',
														'America/Argentina/Buenos_Aires'=>'(GMT-03:00) Buenos Aires',
														'America/Sao_Paulo'=>'(GMT-03:00) Brasilia',
														'America/Noronha'=>'(GMT-02:00) Mid-Atlantic',
														'Atlantic/Cape_Verde'=>'(GMT-01:00) Cape Verde Is.',
														'Atlantic/Azores'=>'(GMT-01:00) Azores',
														'Europe/Belfast'=>'(GMT) Greenwich Mean Time : Belfast',
														'Europe/Dublin'=>'(GMT) Greenwich Mean Time : Dublin',
														'Europe/Lisbon'=>'(GMT) Greenwich Mean Time : Lisbon',
														'Europe/London'=>'(GMT) Greenwich Mean Time : London',
														'Africa/Abidjan'=>'(GMT) Monrovia, Reykjavik',
														'Europe/Amsterdam'=>'(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
														'Europe/Belgrade'=>'(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
														'Europe/Brussels'=>'(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',
														'Africa/Algiers'=>'(GMT+01:00) West Central Africa',
														'Africa/Windhoek'=>'(GMT+01:00) Windhoek',
														'Asia/Beirut'=>'(GMT+02:00) Beirut',
														'Africa/Cairo'=>'(GMT+02:00) Cairo',
														'Asia/Gaza'=>'(GMT+02:00) Gaza',
														'Africa/Blantyre'=>'(GMT+02:00) Harare, Pretoria',
														'Asia/Jerusalem'=>'(GMT+02:00) Jerusalem',
														'Europe/Minsk'=>'(GMT+02:00) Minsk',
														'Asia/Damascus'=>'(GMT+02:00) Syria',
														'Europe/Moscow'=>'(GMT+03:00) Moscow, St. Petersburg, Volgograd',
														'Africa/Addis_Ababa'=>'(GMT+03:00) Nairobi',
														'Asia/Tehran'=>'(GMT+03:30) Tehran',
														'Asia/Dubai'=>'(GMT+04:00) Abu Dhabi, Muscat',
														'Asia/Yerevan'=>'(GMT+04:00) Yerevan',
														'Asia/Kabul'=>'(GMT+04:30) Kabul',
														'Asia/Baku'=>'(GMT+05:00) Baku',
														'Asia/Yekaterinburg'=>'(GMT+05:00) Ekaterinburg',
														'Asia/Tashkent'=>'(GMT+05:00) Tashkent',
														'Asia/Kolkata'=>'(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
														'Asia/Katmandu'=>'(GMT+05:45) Kathmandu',
														'Asia/Dhaka'=>'(GMT+06:00) Astana, Dhaka',
														'Asia/Novosibirsk'=>'(GMT+06:00) Novosibirsk',
														'Asia/Rangoon'=>'(GMT+06:30) Yangon (Rangoon)',
														'Asia/Bangkok'=>'(GMT+07:00) Bangkok, Hanoi, Jakarta',
														'Asia/Krasnoyarsk'=>'(GMT+07:00) Krasnoyarsk',
														'Asia/Hong_Kong'=>'(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
														'Asia/Irkutsk'=>'(GMT+08:00) Irkutsk, Ulaan Bataar',
														'Australia/Perth'=>'(GMT+08:00) Perth',
														'Australia/Eucla'=>'(GMT+08:45) Eucla',
														'Asia/Tokyo'=>'(GMT+09:00) Osaka, Sapporo, Tokyo',
														'Asia/Seoul'=>'(GMT+09:00) Seoul',
														'Asia/Yakutsk'=>'(GMT+09:00) Yakutsk',
														'Australia/Adelaide'=>'(GMT+09:30) Adelaide',
														'Australia/Darwin'=>'(GMT+09:30) Darwin',
														'Australia/Brisbane'=>'(GMT+10:00) Brisbane',
														'Australia/Hobart'=>'(GMT+10:00) Hobart',
														'Asia/Vladivostok'=>'(GMT+10:00) Vladivostok',
														'Australia/Lord_Howe'=>'(GMT+10:30) Lord Howe Island',
														'Etc/GMT-11'=>'(GMT+11:00) Solomon Is., New Caledonia',
														'Asia/Magadan'=>'(GMT+11:00) Magadan',
														'Pacific/Norfolk'=>'(GMT+11:30) Norfolk Island',
														'Asia/Anadyr'=>'(GMT+12:00) Anadyr, Kamchatka',
														'Pacific/Auckland'=>'(GMT+12:00) Auckland, Wellington',
														'Etc/GMT-12'=>'(GMT+12:00) Fiji, Kamchatka, Marshall Is.',
														'Pacific/Chatham'=>'(GMT+12:45) Chatham Islands',
														'Pacific/Tongatapu'=>'(GMT+13:00) Nuku\'alofa',
														'Pacific/Kiritimati'=>'(GMT+14:00) Kiritimati'
														), $this->config->item('timezone') ? $this->config->item('timezone') : date_default_timezone_get(), 'class="form-control" id="timezone" disabled');
														?><i></i>
													</label>
												</section>
											</div>
										
											
											
										</div>
										<div class="col-md-3">
										</div>
									</div>	
										
									</form>
							<!-- END FORM-->
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
	
	loadScript(BASE_URL+"js/bootbox.min.js");

	$("#delete-account").click(function (e) {
	   e.preventDefault();

		bootbox.prompt("<?php echo $this->lang->line('__common_please_enter_password');?>", function(result){ 
		   /* your callback code */ 
		   if (result != '') {
   				
			   	$.ajax({
					url: $(this).attr('href'),
					type: 'post', 
					data: {
						confirm_pass: result,
						recent_pass : '<?php echo $user_info->password;?>'
					},               
					dataType: 'json',
					success: function (response) {
						if(response.success)
						{
							$.smallBox({
								title : "Success",
								content : response.message,
								color : "#739E73",
								iconSmall : "fa fa-check",
								timeout : 3000
							});
							setTimeout(function () {
	                            window.location.href = BASE_URL+'auth/logout/';
	                        }, 2000);
						}
						else
						{
							$.smallBox({
								title : "Error",
								content : response.message,
								color : "#C46A69",
								iconSmall : "fa fa-warning shake animated",
								timeout : 3000
							});
							//alert(response.message);
						}  							
					}
				});
			   	
		    }else{
		   		return false;
		   	} 
		})
		
	   // if(confirm("Are you sure?")){           
		   	//var _password = prompt("<?php echo $this->lang->line('__common_please_enter_password');?>", "");
		   	
		   	
		// }
		// return false;
	});
	
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

		
		$("#configuration-form").validate({
			rules : {
                business_name : {
                    required : true,
                    maxlength: 300
                },
                business_owner : {
                    required : true,
                    maxlength: 300
                },
				business_address : {
                    required : true,
                    maxlength: 1000
                },
				prc : {
                    maxlength: 15
                },
				ptr : {
                    maxlength: 15
                },
				s2 : {
                    maxlength: 15
                },
                pf : {
                	currency : ["$", false],
                	required : true,
                    maxlength: 10
                },
				morning_open_time : {
                    required : true
                },
				morning_close_time : {
                    required : true
                },
				afternoon_open_time : {
                    required : true
                },
				afternoon_close_time : {
                    required : true
                },
				week_end_open_time : {
                    required : true
                },
				week_end_close_time : {
                    required : true
                },
            },
            // Messages for form validation
            messages : {
                business_name : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'business name');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 50);?></span>'
                },
                business_owner : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'owner name');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 50);?></span>'
                },
				business_address : {
                    required : '<i class="fa fa-exclamation-circle"></i><?php echo sprintf($this->lang->line('__validate_required'), 'address');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 150);?>'
                },
				prc : {
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 15);?>'
                },
                ptr : {
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 15);?>'
                },
				s2 : {
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 15);?>'
                },
                pf : {
                	required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'consultation fee (PF)');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 10);?>'
                },
                morning_open_time : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'morning open time');?>'
                },
				morning_close_time : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'morning close time');?>'
                },
				afternoon_open_time : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'afternoon open time');?>'
                },
                afternoon_close_time : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'afternoon close time');?>'
                },
				week_end_open_time : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'week end open time');?>'
                },
				week_end_close_time : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'week end close time');?>'
                },
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

		// Validation method for US currency
		$.validator.addMethod( "currency", function( value, element, param ) {
		    var isParamString = typeof param === "string",
		        symbol = isParamString ? param : param[ 0 ],
		        soft = isParamString ? true : param[ 1 ],
		        regex;

		    symbol = symbol.replace( /,/g, "" );
		    symbol = soft ? symbol + "]" : symbol + "]?";
		    regex = "^[" + symbol + "([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$";
		    regex = new RegExp( regex );
		    return this.optional( element ) || regex.test( value );

		}, "Please specify a valid currency" );
	}
	loadScript(BASE_URL+"js/plugin/jquery-validate/jquery.validate.min.js", function(){
		loadScript(BASE_URL+"js/plugin/jquery-form/jquery-form.min.js", validatefunction);
	});

	function runClockPicker(){
		$('#clockpicker').clockpicker({
			placement: 'top',
			donetext: 'Done'
		});
	}
	
	loadScript(BASE_URL+"js/plugin/clockpicker/clockpicker.min.js", runClockPicker);
	
	function runTimePicker() {
		$('.timepicker').timepicker();
	}
	
	loadScript(BASE_URL+"js/plugin/bootstrap-timepicker/bootstrap-timepicker.min.js", runTimePicker);

</script>
