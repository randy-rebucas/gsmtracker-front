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
	tr.current td span {
		background: #3276b1;
		float: right;
		padding: .1em 1em;
		color: #fff;
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
												<li <?php if($tab == 'vital-signs') echo 'class="active"';?>>

													<a data-toggle="tab" href="#vital-signs" data-id="vital-signs"> 
														<i class="fa fa-fw fa-gear"></i>
														<span class="hidden-mobile hidden-tablet"> Vital Signs </span> </a>
												</li>
												<li <?php if($tab == 'symptoms') echo 'class="active"';?>>
													<a data-toggle="tab" href="#symptoms" data-id="symptoms"> 
														<i class="fa fa-fw fa-gear"></i>
														<span class="hidden-mobile hidden-tablet"> Symptoms </span> </a>
												</li>
												<li <?php if($tab == 'investigation') echo 'class="active"';?>>
													<a data-toggle="tab" href="#investigation" data-id="investigation"> 
														<i class="fa fa-fw fa-gear"></i>
														<span class="hidden-mobile hidden-tablet"> Investigation </span> </a>
												</li>
												<li <?php if($tab == 'medication') echo 'class="active"';?>>
													<a data-toggle="tab" href="#medication" data-id="medication"> 
														<i class="fa fa-fw fa-gear"></i>
														<span class="hidden-mobile hidden-tablet"> Medication </span> </a>
												</li>
												
												<li class="dropdown">
													<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">More ... <b class="caret"></b></a>
													<ul class="dropdown-menu">
														<li <?php if($tab == 'advice') echo 'class="active"';?>>
															<a data-toggle="tab" href="#advice" data-id="advice"> Advice </a>
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
																		<input type="text" name="weight" id="weight" value="<?php echo (count($cur_vital_sign)) ? $cur_vital_sign[0]->records_vital_signs_weight : '';?>">
																	</label>
																</section>
																<section class="col col-6">
																	<label class="label">Height (Cm)</label>
																	<label class="input">
																		<input type="text" name="height" id="height" value="<?php echo (count($cur_vital_sign)) ? $cur_vital_sign[0]->records_vital_signs_height : '';?>">
																	</label>
																</section>
									                    	</div>
									                    	<div class="row">
										                        <section class="col col-6">
																	<label class="label">Tempature (F)</label>
																	<label class="input">
																		<input type="text" name="tempature" id="tempature" value="<?php echo (count($cur_vital_sign)) ? $cur_vital_sign[0]->records_vital_signs_temp : '';?>">
																	</label>
																</section>
																<section class="col col-6">
																	<label class="label">B.P. (mm, hg)</label>
																	<label class="input">
																		<input type="text" name="bp" id="bp" value="<?php echo (count($cur_vital_sign)) ? $cur_vital_sign[0]->records_vital_signs_bp : '';?>">
																	</label>
																</section>
									                    	</div>
									                    	<div class="row">
										                        <section class="col col-6">
																	<label class="label">Pulse (bpm)</label>
																	<label class="input">
																		<input type="text" name="pulse" id="pulse" value="<?php echo (count($cur_vital_sign)) ? $cur_vital_sign[0]->records_vital_signs_pulse : '';?>">
																	</label>
																</section>
																<section class="col col-6">
																	<label class="label">BMI (Kg/M^2)</label>
																	<label class="input">
																		<input type="text" name="bmi" id="bmi" value="<?php echo (count($cur_vital_sign)) ? $cur_vital_sign[0]->records_vital_signs_bmi : '';?>">
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
														<br/>
														<?php if(count($all_vital_sign)) { ?>				
														<table class="table">
															<thead>
																<tr>
																	<th>date</th>
																	<th class="text-center">weight</th>
																	<th class="text-center">height</th>
																	<th class="text-center">temp</th>
																	<th class="text-center">bp</th>
																	<th class="text-center">pulse</th>
																	<th class="text-center">bmi</th>
																</tr>
															</thead>
															<tbody>
																<?php foreach($all_vital_sign as $row) { ?>
																	<tr <?php if($row->records_vital_signs_date == date('Y-m-d')) echo 'class="current"';?>>
																		<td>
																			<?php echo $row->records_vital_signs_date;?>
																			<?php if($row->records_vital_signs_date == date('Y-m-d')) echo '<span>current</span>';?>
																		</td>
																		<td class="text-center"><?php echo $row->records_vital_signs_weight;?></td>
																		<td class="text-center"><?php echo $row->records_vital_signs_height;?></td>
																		<td class="text-center"><?php echo $row->records_vital_signs_temp;?></td>
																		<td class="text-center"><?php echo $row->records_vital_signs_bp;?></td>
																		<td class="text-center"><?php echo $row->records_vital_signs_pulse;?></td>
																		<td class="text-center"><?php echo $row->records_vital_signs_bmi;?></td>
																	</tr>
																<?php } ?>		
															</tbody>
														</table>
														<?php } ?>
													</div>
													<div class="tab-pane fade" id="symptoms">
														
														<?php echo form_open('records/ajax/save_symptoms','class="smart-form" id="symptoms-form"');?>
															<section>
																<label class="label">Signs and Symptoms</label>
																<label class="textarea"> 										
																	<textarea rows="3" class="custom-scroll" name="sign_symptoms" id="sign_symptoms"><?php echo (count($cur_symptoms)) ? $cur_symptoms[0]->records_symptoms_signs : '';?></textarea> 
																</label>
																<!-- <div class="note">
																	<strong>Note:</strong> height of the textarea depends on the rows attribute.
																</div> -->
															</section>
															<section>
																<label class="label">Diagnoses</label>
																<label class="textarea"> 										
																	<textarea rows="3" class="custom-scroll" name="diagnoses" id="diagnoses"><?php echo (count($cur_symptoms)) ? $cur_symptoms[0]->records_symptoms_diagnosis : '';?></textarea> 
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
														<br/>
														<?php if(count($all_symptoms)) { ?>				
														<table class="table">
															<thead>
																<tr>
																	<th>date</th>
																	<th>Signs / Symptoms</th>
																	<th>Diagnoses</th>
																</tr>
															</thead>
															<tbody>
																<?php foreach($all_symptoms as $row) { ?>
																	<tr <?php if($row->records_symptoms_date == date('Y-m-d')) echo 'class="current"';?>>
																		<td>
																			<?php echo $row->records_symptoms_date;?>
																			<?php if($row->records_symptoms_date == date('Y-m-d')) echo '<span>current</span>';?>
																		</td>
																		<td><?php echo $row->records_symptoms_signs;?></td>
																		<td><?php echo $row->records_symptoms_diagnosis;?></td>
																	</tr>
																<?php } ?>		
															</tbody>
														</table>
														<?php } ?>					
													</div>
													<div class="tab-pane fade" id="investigation">
														<?php echo form_open('records/ajax/save_investigation','class="smart-form" id="investigation-form"');?>
															<section>
																<label class="label">Investigation</label>
																<label class="textarea"> 										
																	<textarea rows="3" class="custom-scroll" name="investigations" id="investigations"><?php echo (count($cur_investigations)) ? $cur_investigations[0]->records_investigations_investigation : '';?></textarea> 
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

														<br/>
														<?php if(count($all_investigations)) { ?>				
														<table class="table">
															<thead>
																<tr>
																	<th>date</th>
																	<th>Investigations</th>
																</tr>
															</thead>
															<tbody>
																<?php foreach($all_investigations as $row) { ?>
																	<tr <?php if($row->records_investigations_date == date('Y-m-d')) echo 'class="current"';?>>
																		<td>
																			<?php echo $row->records_investigations_date;?>
																			<?php if($row->records_investigations_date == date('Y-m-d')) echo '<span>current</span>';?>
																		</td>
																		<td><?php echo $row->records_investigations_investigation;?></td>
																	</tr>
																<?php } ?>		
															</tbody>
														</table>
														<?php } ?>	
													</div>
													<div class="tab-pane fade" id="medication">

														<?php echo form_open('records/ajax/save_medication','class="smart-form" id="medication-form"');?>
															<fieldset>
																<section>
																	<label class="label">Medicine</label>
																	<label class="input">
																		<input type="text" name="medicine" id="medicine">
																	</label>
																</section>
																<div class="row">
																	<section class="col col-5">
																		<label class="label">Preparation</label>
																		<label class="input">
																			<input type="text" name="preparation"  id="preparation">
																		</label>
																	</section>
																	<section class="col col-5">
																		<label class="label">Sig</label>
																		<label class="input">
																			<input type="text" name="sig"  id="sig">
																		</label>
																	</section>
																	<section class="col col-2">
																		<label class="label">Quantiy</label>
																		<label class="input">
																			<input type="text" name="quantity"  id="quantity">
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
														<br/>
														<?php if(count($cur_medications)) { ?>				
															<div class="medication-items">
																<?php foreach($cur_medications as $row) { ?>
																	<div class="medication-item">
																		<table class="table">
																			<thead>
																				<tr>
																					<th>Medicine</th>
																					<th>Preparation</th>
																					<th>Sig</th>
																					<th>Qty</th>
																					<th>Maintenable</th>
																				</tr>
																			</thead>
																			<tbody>
																				<?php foreach($this->Mdl_records_medications->get_all($row->records_medications_date)->result() as $medicine) { ?>
																					<tr>
																						<td><?php echo $medicine->records_medications_medicine;?></td>
																						<td><?php echo $medicine->records_medications_preparation;?></td>
																						<td><?php echo $medicine->records_medications_sig;?></td>
																						<td><?php echo $medicine->records_medications_qty;?></td>
																						<td><?php echo ($medicine->records_medications_mainteinable == 1) ? 'Yes':'No';?></td>
																					</tr>
																				<?php } ?>		
																			</tbody>
																			<tfoot>
																				<tr>
																					<td colspan="4"><?php echo $row->records_medications_date;?></td>
																					<td class="text-right"><a href="" class="btn btn-xs btn-success">Print</a></td>
																				</tr>
																			</tfoot>
																		</table>
																	</div>
																<?php } ?>	
															</div>
														<?php } ?>					
														
													</div>
													<div class="tab-pane fade" id="advice">
														<?php echo form_open('records/ajax/save_advice','class="smart-form" id="advice-form"');?>
															<section>
																<label class="label">Advice</label>
																<label class="textarea"> 										
																	<textarea rows="3" class="custom-scroll" name="advices" id="advices"><?php echo (count($cur_advice)) ? $cur_advice[0]->records_advice_advice : '';?></textarea> 
																</label>
																<!-- <div class="note">
																	<strong>Note:</strong> height of the textarea depends on the rows attribute.
																</div> -->
															</section>
															<div class="row">
																	
																<section class="col col-4">
																	<label class="label">Follow-Up Date</label>
																	<label class="input"> 										
																		<input type="input" name="followup_date" id="followup_date" value="<?php echo (count($cur_advice)) ? $cur_advice[0]->records_advice_follow_up_date : '';?>" class="datepicker" data-dateformat="yy-mm-dd">
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

														<br/>
														<?php if(count($all_advice)) { ?>				
														<table class="table">
															<thead>
																<tr>
																	<th>date</th>
																	<th>Advice</th>
																	<th>Next visit</th>
																</tr>
															</thead>
															<tbody>
																<?php foreach($all_advice as $row) { ?>
																	<tr <?php if($row->records_advice_date == date('Y-m-d')) echo 'class="current"';?>>
																		<td>
																			<?php echo $row->records_advice_date;?>
																			<?php if($row->records_advice_date == date('Y-m-d')) echo '<span>current</span>';?>
																		</td>
																		<td><?php echo $row->records_advice_advice;?></td>
																		<td><?php echo $row->records_advice_follow_up_date;?></td>
																	</tr>
																<?php } ?>		
															</tbody>
														</table>
														<?php } ?>
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
												
													<?php if(count($all_record)){ ?>						
														<table class="table table-bordered">
															<thead>
																<tr>
																	<th>Date</th>
																	<th>Time</th>
																	<th>Status</th>
																</tr>
															</thead>
															<tbody>
																<?php foreach($all_record as $row){ ?>
																	<tr>
																		<td><?php echo $row->record_date;?></td>
																		<td><?php echo $row->record_time;?></td>
																		<td><?php echo ($row->record_status == 1) ? 'Finished':'Canceled';?></td>
																	</tr>
																<?php } ?>
															</tbody>
														</table>
													<?php } else { ?>
														<h2 class="text-center">no record histories found!</h2>
													<?php } ?>
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

	$( document ).ready(function() {

		$( "ul#widget-tab-2 li a" ).bind( "click", function() {
			var curtab = $(this).attr('data-id');
			$.post(BASE_URL+'records/ajax/set_tab', { tab: curtab} );
		});

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

		$("#symptoms-form").validate({
            // Rules for form validation
            rules : {
                sign_symptoms : {
                    required : true,
                    maxlength: 1000
                },
                diagnoses : {
                    required : true,
                    maxlength: 3000
                }
            },
            // Messages for form validation
            messages : {
                sign_symptoms : {
                    required : '<i class="fa fa-times-circle"></i> Please add symptoms',
                    maxlength: '<i class="fa fa-times-circle"></i> The symptoms can not exceed 1000 characters in length.'
                },
                diagnoses : {
                    required : '<i class="fa fa-times-circle"></i> Please add diagnoses',
                    maxlength: '<i class="fa fa-times-circle"></i> The diagnoses can not exceed 3000 characters in length.'
                }
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
                            mcs.init_smallBox("success", response.message);
                            checkURL();
                        }
                        else
                        {
                            mcs.init_smallBox("error", response.message);
                        }                   
                        $(form).find('#submit').text('Submit');
                        $(form).find('#submit').removeAttr("disabled");
                    },
                    dataType:'json'
                });
            }
        });
		
		$("#investigation-form").validate({
            // Rules for form validation
            rules : {
                investigations : {
                    required : true,
                    maxlength: 250
                }
            },
            // Messages for form validation
            messages : {
                investigations : {
                    required : '<i class="fa fa-times-circle"></i> Please add investigation',
                    maxlength: '<i class="fa fa-times-circle"></i> The investigation can not exceed 250 characters in length.'
                }
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
                            mcs.init_smallBox("success", response.message);
                            checkURL();
                        }
                        else
                        {
                            mcs.init_smallBox("error", response.message);
                        }                   
                        $(form).find('#submit').text('Submit');
                        $(form).find('#submit').removeAttr("disabled");
                    },
                    dataType:'json'
                });
            }
        });
		
		$("#medication-form").validate({
            // Rules for form validation
            rules : {
                medicine : {
                    required : true,
                    maxlength: 250
                },
				preparation : {
                    required : true,
					maxlength: 250
                },
				sig : {
                    required : true,
                    maxlength: 250
                },
				quantity : {
                    required : true,
					maxlength: 10
                }
            },
            // Messages for form validation
            messages : {
                medicine : {
                    required : '<i class="fa fa-times-circle"></i> Please add medicine',
                    maxlength: '<i class="fa fa-times-circle"></i> The medicine can not exceed 250 characters in length.'
                },
				preparation : {
                    required : '<i class="fa fa-times-circle"></i> Please add preparation',
					maxlength: '<i class="fa fa-times-circle"></i> The preparation can not exceed 250 characters in length.'
                },
				sig : {
                    required : '<i class="fa fa-times-circle"></i> Please add sig',
                    maxlength: '<i class="fa fa-times-circle"></i> The sig can not exceed 250 characters in length.'
                },
				quantity : {
                    required : '<i class="fa fa-times-circle"></i> Please add quantity',
					maxlength: '<i class="fa fa-times-circle"></i> The quantity can not exceed 5 characters in length.'
                }
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
                            mcs.init_smallBox("success", response.message);
                            checkURL();
                        }
                        else
                        {
                            mcs.init_smallBox("error", response.message);
                        }                   
                        $(form).find('#submit').text('Submit');
                        $(form).find('#submit').removeAttr("disabled");
                    },
                    dataType:'json'
                });
            }
        });

		$("#advice-form").validate({
            // Rules for form validation
            rules : {
                advices : {
                    required : true,
                    maxlength: 1000
                },
				followup_date : {
                    required : true
                }
            },
            // Messages for form validation
            messages : {
                advices : {
                    required : '<i class="fa fa-times-circle"></i> Please add advices',
                    maxlength: '<i class="fa fa-times-circle"></i> The advices can not exceed 1000 characters in length.'
                },
				followup_date : {
                    required : '<i class="fa fa-times-circle"></i> Please add followup date'
                }
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
                            mcs.init_smallBox("success", response.message);
                            checkURL();
                        }
                        else
                        {
                            mcs.init_smallBox("error", response.message);
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
