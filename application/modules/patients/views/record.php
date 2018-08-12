<style type="text/css">
	
	.widget-body {
	    border-top: 1px solid #ccc;
	}
	.custom-scroll {
	    padding: .8em;
	}
	img.img-fluid {
	    width: 100%;
	}
	.widget-body {
	    border-top: none;
	}
	.smart-form footer {
	    display: block;
	    padding: unset;
	    border-top: unset;
	    background: unset;
	}
	.jarviswidget header:first-child .nav-tabs ul li ul li a {
	    color: #fff !important;
	}
	.dropdown-menu>li>a:focus, .dropdown-menu>li>a:hover {
	    text-decoration: none;
	    color: #fff !important;
	    background-color: #3276b1;
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
			<div class="jarviswidget" id="wid-id-0" data-widget-colorbutton="true" data-widget-editbutton="false">
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
									<a href="<?php echo site_url('queings/create');?>" class="btn btn-warning btn-sm"><i class="fas fa-lg fa-fw fa-users"></i>&nbsp;<span class="hidden-mobile">Que</span> </a>

								</div>
								
							</div>
							
								

						</div>
						
						<div class="custom-scroll">
							<div class="row">
								
								<div class="col-md-3">
									<img src="<?php echo base_url();?>img/avatar.png" class="img-fluid"/>
									
									<h3><?php echo $info->firstname.' '.$info->mi.', '.$info->lastname;?></h3>
									<dl class="row">
									  	<dt class="col-sm-3">Token</dt>
									  	<dd class="col-sm-9 text-truncate">: <?php echo $info->token;?></dd>

									  	<dt class="col-sm-3">Gender</dt>
									  	<dd class="col-sm-9">: <?php echo ($info->gender == 1) ? 'Male': 'Female';?></dd>

									  	<dt class="col-sm-3">Birthdate</dt>
									  	<dd class="col-sm-9 text-truncate">: <?php echo date('M', mktime(0,0,0,$info->bMonth)).' '.str_pad($info->bDay, 2, "0", STR_PAD_LEFT).', '.$info->bYear;?></dd>

									  	<dt class="col-sm-3">Country</dt>
									  	<dd class="col-sm-9">: <?php echo ($info->country) ? $info->country: '--';?></dd>

									  	<dt class="col-sm-3">City</dt>
									  	<dd class="col-sm-9">: <?php echo ($info->city) ? $info->city: '--';?></dd>

									  	<dt class="col-sm-3">State</dt>
									  	<dd class="col-sm-9">: <?php echo ($info->state) ? $info->state: '--';?></dd>

									  	<dt class="col-sm-3">Zip</dt>
									  	<dd class="col-sm-9">: <?php echo ($info->zip) ? $info->zip: '--';?></dd>

									  	<dt class="col-sm-3">Address</dt>
									  	<dd class="col-sm-9">: <?php echo ($info->address) ? $info->address: '--';?></dd>

									  	<dt class="col-sm-3">Mobile</dt>
									  	<dd class="col-sm-9">: <?php echo ($info->mobile) ? $info->mobile: '--';?></dd>
									</dl>

								</div>
								<div class="col-md-9">
									<div class="jarviswidget" id="widget-records" role="widget">
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
											<h2>Records</h2>
											<ul id="widget-tab-2" class="nav nav-tabs pull-right">
												<li class="active">

													<a data-toggle="tab" href="#vital-signs"> 
														<i class="fa fa-fw fa-gear"></i>
														<span class="hidden-mobile hidden-tablet"> Vital Signs </span> </a>
												</li>
												<li>
													<a data-toggle="tab" href="#symptoms"> 
														<i class="fa fa-fw fa-gear"></i>
														<span class="hidden-mobile hidden-tablet"> Symptoms </span> </a>
												</li>
												<li>
													<a data-toggle="tab" href="#investigation"> 
														<i class="fa fa-fw fa-gear"></i>
														<span class="hidden-mobile hidden-tablet"> Investigation </span> </a>
												</li>
												<li>
													<a data-toggle="tab" href="#medication"> 
														<i class="fa fa-fw fa-gear"></i>
														<span class="hidden-mobile hidden-tablet"> Medication </span> </a>
												</li>
												
												<li class="dropdown">
													<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">More ... <b class="caret"></b></a>
													<ul class="dropdown-menu">
														<li>
															<a data-toggle="tab" href="#advice"> Advice </a>
														</li>
													</ul>
												</li>
											</ul>
											<span class="jarviswidget-loader"><i class="fa fa-refresh fa-spin"></i></span>
										</header>

										<!-- widget div-->
										<div role="content">

											<!-- widget edit box -->
											<div class="jarviswidget-editbox">
												<!-- This area used as dropdown edit box -->

											</div>
											<!-- end widget edit box -->

											<!-- widget content -->
											<div class="widget-body">
												<div class="tab-content padding-10-0">
													
													<div class="tab-pane fade active in" id="vital-signs">
														<?php echo form_open('records/ajax/save_vital_signs','class="smart-form" id="vital-signs-form"');?>
															<div class="row">
										                        <section class="col col-6">
																	<label class="label">Weight (kg)</label>
																	<label class="input">
																		<input type="text" name="weight" id="weight" value="">
																	</label>
																</section>
																<section class="col col-6">
																	<label class="label">Height (Cm)</label>
																	<label class="input">
																		<input type="text" name="height" id="height" value="">
																	</label>
																</section>
									                    	</div>
									                    	<div class="row">
										                        <section class="col col-6">
																	<label class="label">Tempature (F)</label>
																	<label class="input">
																		<input type="text" name="tempature" id="tempature" value="">
																	</label>
																</section>
																<section class="col col-6">
																	<label class="label">B.P. (mm, hg)</label>
																	<label class="input">
																		<input type="text" name="bp" id="bp" value="">
																	</label>
																</section>
									                    	</div>
									                    	<div class="row">
										                        <section class="col col-6">
																	<label class="label">Pulse (bpm)</label>
																	<label class="input">
																		<input type="text" name="pulse" id="pulse" value="">
																	</label>
																</section>
																<section class="col col-6">
																	<label class="label">BMI (Kg/M^2)</label>
																	<label class="input">
																		<input type="text" name="bmi" id="bmi" value="">
																	</label>
																</section>
									                    	</div>
															<div class="row">
																<?php foreach ($custom_fields as $custom_field) { ?>
											                        <section class="col col-6">
																		<label class="label"><?php echo $custom_field->custom_field_label; ?></label>
																		<label class="<?php echo $custom_field->custom_field_type; ?>">
																			<input type="text" name="custom[<?php echo $custom_field->custom_field_column; ?>]" id="<?php echo $custom_field->custom_field_column; ?>" value="<?php echo form_prep($this->Mdl_records_vital_signs->form_value('custom[' . $custom_field->custom_field_column . ']')); ?>">
																		</label>
																	</section>
										                        <?php } ?>
									                    	</div>
									                    	<footer>
																<button type="submit" class="btn btn-primary">
																	Submit
																</button>
															</footer>
									                    </form>
													</div>
													<div class="tab-pane fade" id="symptoms">
														
														<form action="" class="smart-form" _lpchecked="1">
															<section>
																<label class="label">Signs and Symptoms</label>
																<label class="textarea"> 										
																	<textarea rows="3" class="custom-scroll" name="sign_symptoms" id="sign_symptoms"></textarea> 
																</label>
																<!-- <div class="note">
																	<strong>Note:</strong> height of the textarea depends on the rows attribute.
																</div> -->
															</section>
															<section>
																<label class="label">Diagnoses</label>
																<label class="textarea"> 										
																	<textarea rows="3" class="custom-scroll" name="diagnoses" id="diagnoses"></textarea> 
																</label>
																<!-- <div class="note">
																	<strong>Note:</strong> height of the textarea depends on the rows attribute.
																</div> -->
															</section>
															<footer>
																<button type="submit" class="btn btn-primary">
																	Submit
																</button>
															</footer>
														</form>
						
													</div>
													<div class="tab-pane fade" id="investigation">
														<form action="" class="smart-form" _lpchecked="1">
															<section>
																<label class="label">Investigation</label>
																<label class="input">
																	<input type="text" class="input-sm">
																</label>
																<!-- <div class="note">
																	<strong>Note:</strong> height of the textarea depends on the rows attribute.
																</div> -->
															</section>
															<footer>
																<button type="submit" class="btn btn-primary">
																	Submit
																</button>
															</footer>
														</form>
													</div>
													<div class="tab-pane fade" id="medication">
														<form action="" id="checkout-form" class="smart-form" novalidate="novalidate">

															<fieldset>
																<section>
																	<label class="label">Medicine</label>
																	<label class="input">
																		<input type="text" name="name">
																	</label>
																</section>
																<div class="row">
																	
																	<section class="col col-5">
																		<label class="label">Preparation</label>
																		<label class="input">
																			<input type="email" name="email">
																		</label>
																	</section>
																	<section class="col col-5">
																		<label class="label">Sig</label>
																		<label class="input">
																			<input type="url" name="url">
																		</label>
																	</section>
																	<section class="col col-2">
																		<label class="label">Quantiy</label>
																		<label class="input">
																			<input type="url" name="url">
																		</label>
																	</section>
																</div>

																<section>
																	<label class="checkbox">
																		<input type="checkbox" name="maintenanble" id="maintenanble">
																		<i></i>Maintenable</label>
																</section>

															</fieldset>

															<footer>
																<button type="submit" class="btn btn-primary">
																	Submit
																</button>
															</footer>
														</form>
													</div>
													<div class="tab-pane fade" id="advice">
														<form action="" class="smart-form" _lpchecked="1">
															<section>
																<label class="label">Advice</label>
																<label class="textarea"> 										
																	<textarea rows="3" class="custom-scroll" name="advices" id="advices"></textarea> 
																</label>
																<!-- <div class="note">
																	<strong>Note:</strong> height of the textarea depends on the rows attribute.
																</div> -->
															</section>
															<div class="row">
																	
																<section class="col col-4">
																	<label class="label">Follow-Up Date</label>
																	<label class="input"> 										
																		<input type="input" name="followup_date" class="datepicker" data-dateformat="dd/mm/yy">
																	</label>
																	<!-- <div class="note">
																		<strong>Note:</strong> height of the textarea depends on the rows attribute.
																	</div> -->
																</section>

															</div>
															<footer>
																<button type="submit" class="btn btn-primary">
																	Submit
																</button>
															</footer>
														</form>
													</div>
												</div>
											</div>
											<!-- end widget content -->

										</div>
										<!-- end widget div -->

									</div>
									<!-- history-->
									<div class="jarviswidget jarviswidget-sortable" id="wid-id-18" data-widget-colorbutton="false" data-widget-editbutton="false" role="widget">
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
										<header role="heading" class="ui-sortable-handle">
											

											<h2><strong>History </strong> <i></i></h2>				
											
										<span class="jarviswidget-loader"><i class="fa fa-refresh fa-spin"></i></span></header>

										<!-- widget div-->
										<div role="content">
											
											<!-- widget edit box -->
											<div class="jarviswidget-editbox">
												<!-- This area used as dropdown edit box -->
												<input class="form-control" type="text">
												<span class="note"><i class="fa fa-check text-success"></i> Change title to update and save instantly!</span>
												
											</div>
											<!-- end widget edit box -->
											
											<!-- widget content -->
											<div class="widget-body no-padding">
												
												
												<div class="custom-scroll table-responsive" style="height:290px; overflow-y: scroll;">
													

													<table class="table table-bordered">
														<thead>
															<tr>
																<th><i class="fa fa-key text-warning"></i> License Key</th>
																<th>Username <i class="text-danger">!</i></th>
																<th>Date</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>C87E48EF-605A-B4FF</td>
																<td>erat@montesnasceturridiculus.org</td>
																<td>10/03/13</td>
															</tr>
															
														</tbody>
													</table>
												
												</div>
												
												
											
											</div>
											<!-- end widget content -->
											
										</div>
										<!-- end widget div -->
										
									</div>
								</div>
							</div>
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

	var can_view = 	'<?php echo ($this->admin_role_id != $this->role_id) ? $this->Mdl_roles->has_permission('patients', $this->role_id, 'view') : true; ?>';
	var can_update = '<?php echo ($this->admin_role_id != $this->role_id) ? $this->Mdl_roles->has_permission('patients', $this->role_id, 'update') : true; ?>';
	var can_delete = '<?php echo ($this->admin_role_id != $this->role_id) ? $this->Mdl_roles->has_permission('patients', $this->role_id, 'delete') : true; ?>';

	pageSetUp();

	$(document).on('click', '.ajaxify', function(e) {


		e.preventDefault();

    });

	var validatefunction = function() {

        $("#vital-signs-form").validate({
            // Rules for form validation
            rules : {
                weight : {
                    required : true,
                    maxlength: 5
                },
                height : {
                    required : true,
                    maxlength: 5
                },
                tempature : {
                    required : true,
                    maxlength: 5
                },
                bp : {
                    required : true,
                    maxlength: 5
                },
                pulse : {
                    required : true,
                    maxlength: 5
                },
                bmi : {
                    required : true,
                    maxlength: 5
                }
            },
            // Messages for form validation
            messages : {
                weight : {
                    required : '<i class="fa fa-times-circle"></i> Please add weight',
                    maxlength: '<i class="fa fa-times-circle"></i> The weight can not exceed 5 characters in length.'
                },
                height : {
                    required : '<i class="fa fa-times-circle"></i> Please add height',
                    maxlength: '<i class="fa fa-times-circle"></i> The height can not exceed 5 characters in length.'
                },
                tempature : {
                    required : '<i class="fa fa-times-circle"></i> Please add tempature',
                    maxlength: '<i class="fa fa-times-circle"></i> The tempature can not exceed 5 characters in length.'
                },
                bp : {
                    required : '<i class="fa fa-times-circle"></i> Please add bp',
                    maxlength: '<i class="fa fa-times-circle"></i> The bp can not exceed 5 characters in length.'
                },
                pulse : {
                    required : '<i class="fa fa-times-circle"></i> Please add pulse',
                    maxlength: '<i class="fa fa-times-circle"></i> The pulse can not exceed 5 characters in length.'
                },
                bmi : {
                    required : '<i class="fa fa-times-circle"></i> Please add bmi',
                    maxlength: '<i class="fa fa-times-circle"></i> The bmi can not exceed 5 characters in length.'
                },
            },
            highlight: function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorElement: 'span',
            errorClass: 'text-danger',
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
                        $(form).find('#submit').html('Please wait...');
                        $(form).find('#submit').attr("disabled", "disabled");
                    },
                    success:function(response)
                    {
                        if(response.success)
                        {
                            mcs.init_smallBox("Success", response.message);
							$('.bootbox-close-button').trigger('click');
                            checkURL();
                        }
                        else
                        {
                            mcs.init_smallBox("Error", response.message);
                        }                   
                        $(form).find('#submit').text('Submit');
                        $(form).find('#submit').removeAttr("disabled");
                    },
                    dataType:'json'
                });
            }
        });

		$('.is_required').each(function() {
		    $(this).rules('add', {
		        required: true,  // example rule
		        // another rule, etc.
		    });
		});
    }

	loadScript(BASE_URL+"js/plugin/jquery-validate/jquery.validate.min.js", function(){
		loadScript(BASE_URL+"js/plugin/jquery-form/jquery-form.min.js", validatefunction);
	});

	var pagefunction = function() {
		
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
