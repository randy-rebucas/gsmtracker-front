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
						<div class="row">
							
					        <div class="col-xs-12 col-sm-6 col-md-3">
					            <div class="panel panel-success pricing-big">
					            	
					                <div class="panel-heading">
					                    <h3 class="panel-title">
					                        Basic</h3>
					                </div>
					                <div class="panel-body no-padding text-align-center">
					                    <div class="the-price">
					                        <h1>
					                            <strong>FREE</strong></h1>
					                    </div>
										<div class="price-features">
											<ul class="list-unstyled text-left">
									          <li><i class="fa fa-check text-success"></i> 2 years access <strong> to all storage locations</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Unlimited</strong> storage</li>
									          <li><i class="fa fa-check text-success"></i> Limited <strong> download quota</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Cash on Delivery</strong></li>
									          <li><i class="fa fa-check text-success"></i> All time <strong> updates</strong></li>
									          <li><i class="fa fa-times text-danger"></i> <strong>Unlimited</strong> access to all files</li>
									          <li><i class="fa fa-times text-danger"></i> <strong>Allowed</strong> to be exclusing per sale</li>
									        </ul>
										</div>
					                </div>
					                <div class="panel-footer text-align-center">
					                	<?php if($client_info->client_plan == 'Free') {?>
					                    <a href="javascript:void(0);" class="btn btn-success btn-block disabled" role="button">Current plan</a>
					                	<?php } ?>
										<!-- <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
											<input type="hidden" name="cmd" value="_s-xclick">
											<input type="hidden" name="hosted_button_id" value="4FWJVHQDQMLJA">
											<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
											<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
										</form> -->

					                </div>
					            </div>
					        </div>
					        
					        <div class="col-xs-12 col-sm-6 col-md-3">
					            <div class="panel panel-teal pricing-big">
					            	
					                <div class="panel-heading">
					                    <h3 class="panel-title">
					                        Standard</h3>
					                </div>
					                <div class="panel-body no-padding text-align-center">
					                    <div class="the-price">
					                        <h1>
											&#8369; 1,500<span class="subscript">/ mo</span></h1>
					                    </div>
										<div class="price-features">
											<ul class="list-unstyled text-left">
									          <li><i class="fa fa-check text-success"></i> 2 years access <strong> to all storage locations</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Unlimited</strong> storage</li>
									          <li><i class="fa fa-check text-success"></i> Superbig <strong> download quota</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Cash on Delivery</strong></li>
									          <li><i class="fa fa-check text-success"></i> All time <strong> updates</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Unlimited</strong> access to all files</li>
									          <li><i class="fa fa-check text-success"></i> <strong>Allowed</strong> to be exclusing per sale</li>
									        </ul>
										</div>
					                </div>
					                <div class="panel-footer text-align-center">
					                    <?php if($client_info->client_plan == 'Basic') {?>
						                    <a href="javascript:void(0);" class="btn btn-success btn-block disabled" role="button">Current plan</a>
						                <?php }else{ ?>
											<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
												<input type="hidden" name="cmd" value="_s-xclick">
												<input type="hidden" name="hosted_button_id" value="FTE2CY34P8MXW">
												<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
												<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
											</form>

						                	<!-- <a href="javascript:void(0);" class="btn btn-primary btn-block" role="button">Purchase <span>via Paypal</span></a> -->
						                <?php } ?>
					                </div>
					            </div>
					        </div>
					        
					        <div class="col-xs-12 col-sm-6 col-md-3">
					            <div class="panel panel-primary pricing-big">
					            	<img src="<?php echo base_url();?>img/ribbon.png" class="ribbon">
					                <div class="panel-heading">
					                    <h3 class="panel-title">
					                        Premium</h3>
					                </div>
					                <div class="panel-body no-padding text-align-center">
					                    <div class="the-price">
					                        <h1>
											&#8369; 2,200<span class="subscript">/ mo</span></h1>
					                    </div>
										<div class="price-features">
											<ul class="list-unstyled text-left">
									          <li><i class="fa fa-check text-success"></i> 2 years access <strong> to all storage locations</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Unlimited</strong> storage</li>
									          <li><i class="fa fa-check text-success"></i> Superbig <strong> download quota</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Cash on Delivery</strong></li>
									          <li><i class="fa fa-check text-success"></i> All time <strong> updates</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Unlimited</strong> access to all files</li>
									          <li><i class="fa fa-check text-success"></i> <strong>Allowed</strong> to be exclusing per sale</li>
									        </ul>
										</div>
					                </div>
					                <div class="panel-footer text-align-center">
					                    <?php if($client_info->client_plan == 'Premium') {?>
						                    <a href="javascript:void(0);" class="btn btn-success btn-block disabled" role="button">Current plan</a>
						                <?php }else{ ?>
						                	<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
												<input type="hidden" name="cmd" value="_s-xclick">
												<input type="hidden" name="hosted_button_id" value="HWWU6WPXECYFC">
												<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
												<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
											</form>

											<!-- <a href="javascript:void(0);" class="btn btn-primary btn-block" role="button">Purchase <span>via Paypal</span></a> -->
						                <?php } ?>
					                </div>
					            </div>
					        </div>
					        
					        <div class="col-xs-12 col-sm-6 col-md-3">
					            <div class="panel panel-darken pricing-big">
					            	
					                <div class="panel-heading">
					                    <h3 class="panel-title">
					                        Ultimate</h3>
					                </div>
					                <div class="panel-body no-padding text-align-center">
					                    <div class="the-price">
					                        <h1>
											&#8369; 3,000<span class="subscript">/ mo</span></h1>
					                    </div>
										<div class="price-features">
											<ul class="list-unstyled text-left">
									          <li><i class="fa fa-check text-success"></i> Lifetime access <strong> to all storage locations</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Unlimited</strong> storage</li>
									          <li><i class="fa fa-check text-success"></i> Superbig <strong> download quota</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Cash on Delivery</strong></li>
									          <li><i class="fa fa-check text-success"></i> All time <strong> updates</strong></li>
									          <li><i class="fa fa-check text-success"></i> <strong>Unlimited</strong> access to all files</li>
									          <li><i class="fa fa-check text-success"></i> <strong>Allowed</strong> to be exclusing per sale</li>
									        </ul>
										</div>
					                </div>
					                <div class="panel-footer text-align-center">
					                    <?php if($client_info->client_plan == 'Ultimate') {?>
						                    <a href="javascript:void(0);" class="btn btn-success btn-block disabled" role="button">Current plan</a>
						                <?php }else{ ?>
						                	<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
												<input type="hidden" name="cmd" value="_s-xclick">
												<input type="hidden" name="hosted_button_id" value="3QDVQRQSLNYDU">
												<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
												<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
											</form>


											<!-- <a href="javascript:void(0);" class="btn btn-primary btn-block" role="button">Purchase <span>via Paypal</span></a> -->
						                <?php } ?>
					                </div>
					            </div>
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

		
		$("#general_udate").validate({
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
				business_phone : {
                    required : true,
                    maxlength: 12
                },
				business_email : {
                    required : true,
                    maxlength: 300
                },
				business_fax : {
                    required : true,
                    maxlength: 12
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
				business_phone : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'phone');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 12);?>'
                },
                business_email : {
                    required : '<i class="fa fa-exclamation-circle"></i> Please add business email</span>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 50);?>'
                },
				business_fax : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'fax');?>',
                    maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 12);?>'
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
						$('#general-submit').html('<?php echo $this->lang->line('__common_please_wait');?>');
						$('#general-submit').attr("disabled", "disabled");
					},
					success:function(response)
					{
						console.log(response);
						if(response.success)
						{
							$.smallBox({
								title : "Success",
								content : response.message,
								color : "#739E73",
								iconSmall : "fa fa-check",
								timeout : 3000
							});
							
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
							
						}                   
						$('#general-submit').text('<?php echo $this->lang->line('__common_update');?>');
						$('#general-submit').removeAttr("disabled");
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
