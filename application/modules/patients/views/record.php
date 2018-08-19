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
		float: right;
	}
	.patient_details_wrap {
		display: grid;
		grid-template-columns: 30% 70%;
		grid-gap: 1em;
		padding-bottom: 1em;
	}
	.patient_details h3 {
		margin: 0;
	}
	.widget-body .well {
		margin-bottom: 1em;
	}
	.jarviswidget.well header {
		display: block;
	}
	.jarviswidget.well header button {
		float: right;
		width: 25px;
		height: 25px;
		padding: 3px 0;
		margin: 4px;
	}
	.jarviswidget .widget-body .list-group li {
		position: relative;
	}
	.jarviswidget .widget-body .list-group li a {
		position: absolute;
		right: 3%;
		visibility: hidden;
	}
	.jarviswidget .widget-body .list-group li:hover a {
		visibility: visible;
	}
	
</style>
<link href="<?php echo base_url();?>vendor/select2/select2/dist/css/select2.min.css" rel="stylesheet" />
<style type="text/css">
	.select2-container .select2-choice .select2-arrow b:before, .select2-selection__arrow b:before {
	    content: "";
	    display: none;
	}
	.select2-container--default .select2-selection--single {
	    border-radius: 0;
	    height: 32px;
    	padding: 1px 0px;
	}
	.select2-container--open .select2-dropdown, .select2-drop-active {
	    border: 1px solid #a9a9a9;
	    border-bottom-width: 1px;
	    border-radius: 0;
	}
	.select2-container--default .select2-selection--single .select2-selection__arrow {
	    height: 28px;
	}
	.select2-container {
	    min-width: 100%;
	}

	.select2-container--default.select2-container--focus .select2-selection--multiple {
	    border: solid #cbcbcb 1px;
	    border-radius: 0;
	}
	.select2-container--default .select2-selection--multiple {
	    border-radius: 0;
	}
	.select2-container--default .select2-selection--multiple .select2-selection__choice {
	    background-color: #79a0cd;
	    border: 1px solid #758ba3;
	    border-radius: 0;
	}
	.select2-container--default .select2-selection--multiple .select2-selection__choice {
	    background-color: #79a0cd;
	    border: 1px solid #758ba3;
	    border-radius: 0;
	    padding: 0 20px 0 5px;
	}
	.select2-container--default .select2-selection--multiple .select2-selection__choice__remove {
	    color: red;
	    margin-right: -4px;
	}
	.select2-container-multi .select2-search-choice-close:hover, .select2-selection__choice__remove:hover {
	    background: none;
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
		<article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
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
									
									<a href="<?php echo site_url('queings/ajax/move_in/'.$this->uri->segment(3));?>" class="btn btn-warning btn-sm" id="move-in"><i class="fas fa-lg fa-fw fa-users"></i>&nbsp;<span class="hidden-mobile">Que</span> </a>
							
								</div>
								
							</div>
							
								

						</div>
						
						<div class="custom-scroll">
							<div class="row">
								
								<div class="col-md-4">
				
									<div class="patient_details_wrap">
										<div class="patient_details">
											<?php $img = ($info->avatar != '') ? base_url().'uploads/profile-picture/'.$info->avatar : $this->gravatar->get($info->email, 200);?>
											<img src="<?php echo $img;?>" class="img-fluid"/>
										</div>
										<div class="patient_details">
											<h3><?php echo $info->firstname.' '.$info->mi.', '.$info->lastname;?></h3>
											<dl class="row">
											
												<dt class="col-sm-3">Age</dt>
												<dd class="col-sm-9 text-truncate"><?php echo (date("md", date("U", mktime(0, 0, 0, $info->bMonth, $info->bDay, $info->bYear))) > date("md")
												? ((date("Y") - $info->bYear) - 1)
												: (date("Y") - $info->bYear)); ?> - <?php echo ($info->bYear < date('Y')) ? 'years': (date('m') - $info->bMonth) .' month old';?></dd>

												<dt class="col-sm-3">Gender</dt>
												<dd class="col-sm-9"><?php echo ($info->gender == 1) ? 'Male': 'Female';?></dd>

												<dt class="col-sm-3">Birthdate</dt>
												<dd class="col-sm-9 text-truncate"><?php echo date('M', mktime(0,0,0,$info->bMonth)).' '.str_pad($info->bDay, 2, "0", STR_PAD_LEFT).', '.$info->bYear;?></dd>

												<dt class="col-sm-3">Address</dt>
												<dd class="col-sm-9">
													<address>
														<?php echo $info->address;?><br>
														<?php echo $this->Mdl_countries->get_by_id($info->country)->name.', '.$this->Mdl_cities->get_by_id($info->city)->name.' '.$this->Mdl_states->get_by_id($info->state)->name;?><br>
														<?php echo $info->zip;?><br>
														<abbr title="Mobile">M:</abbr> <?php echo $info->mobile;?><br>
														<abbr title="Work Phone">WP:</abbr> <?php echo $info->work_phone;?>
													</address>
												</dd>
												
											</dl>

										</div>
									</div>

									<!-- Widget ID (each widget will need unique ID)-->
									<div class="jarviswidget well" id="wid-allergies" data-widget-colorbutton="true" data-widget-editbutton="true" data-widget-togglebutton="false" data-widget-deletebutton="false" data-widget-fullscreenbutton="false" data-widget-custombutton="false" data-widget-sortable="false">
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
											<span class="widget-icon"> <i class="fa fa-comments"></i> </span>
											<h2>Allergies</h2>
											<button class="btn btn-success btn-xs btn-circle" data-toggle="collapse" data-target="#collapseallergies" aria-expanded="false" aria-controls="collapseallergies"><i class="fa fa-plus"></i></button>
										</header>
						
										<!-- widget div-->
										<div>
						
											<!-- widget edit box -->
											<div class="jarviswidget-box collapse" id="collapseallergies">
												<!-- This area used as dropdown edit box -->
												<?php echo form_open('records/ajax/save_allergies','class="smart-form" id="allergies-form"');?>
													<input type="hidden" name="patient_id" id="patient_id" value="<?php echo $this->uri->segment(3);?>">
													<section>
														<label class="input">
															<input type="text" name="allergies" id="allergies" value="" placeholder="press ENTER">
														</label>
													</section>
												</form>
											</div>
											<!-- end widget edit box -->
						
											<!-- widget content -->
											<div class="widget-body">
											
						
											</div>
											<!-- end widget content -->
						
										</div>
										<!-- end widget div -->
						
									</div>
									<!-- end widget -->

									<!-- Widget ID (each widget will need unique ID)-->
									<div class="jarviswidget well" id="wid-family-history" data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-togglebutton="false" data-widget-deletebutton="false" data-widget-fullscreenbutton="false" data-widget-custombutton="false" data-widget-sortable="false">
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
											<span class="widget-icon"> <i class="fa fa-comments"></i> </span>
											<h2>Family histories </h2>
											<button class="btn btn-success btn-xs btn-circle float-right" data-toggle="collapse" data-target="#collapsehistories" aria-expanded="false" aria-controls="collapsehistories"><i class="fa fa-plus"></i></button>
										</header>
						
										<!-- widget div-->
										<div>
						
											<!-- widget edit box -->
											<div class="jarviswidget-box collapse" id="collapsehistories">
												<!-- This area used as dropdown edit box -->
												<?php echo form_open('records/ajax/save_family_hitories','class="smart-form" id="family-hitories-form"');?>
													<input type="hidden" name="patient_id" id="patient_id" value="<?php echo $this->uri->segment(3);?>">
													<section>
														<label class="input">
															<input type="text" name="family_hitories" id="family_hitories" value="" placeholder="press ENTER">
														</label>
													</section>
												</form>
											</div>
											<!-- end widget edit box -->
						
											<!-- widget content -->
											<div class="widget-body">
												
											</div>
											<!-- end widget content -->
						
										</div>
										<!-- end widget div -->
						
									</div>
									<!-- end widget -->
								</div>
								<div class="col-md-8">
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
												
													<div class="tab-pane fade <?php if($tab == 'vital-signs') echo 'active in';?>" id="vital-signs">
														<?php echo form_open('records/ajax/save_vital_signs','class="smart-form" id="vital-signs-form"');?>
															<input type="hidden" name="record_id" value="<?php echo $record_id;?>"/>
															<?php if(!$this->Mdl_queings->in_que($info->id)->get()->num_rows()) { ?>	
																<div class="alert alert-info">
																	<p>Please move first in que to continue!</p>
																</div>
															<?php } ?>
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
																
																<button type="submit" class="btn btn-primary" <?php if(!$this->Mdl_queings->in_que($info->id)->get()->num_rows()) echo 'disabled="disabled"';?>>
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
																	<th></th>
																</tr>
															</thead>
															<tbody>
																<?php foreach($all_vital_sign as $row) { ?>
																	<tr <?php if($row->records_vital_signs_date == date('Y-m-d')) echo 'class="current"';?>>
																		<td>
																			<?php echo $row->records_vital_signs_date;?>
																			<?php if($row->records_vital_signs_date == date('Y-m-d')) echo '<span class="label label-success">current</span>';?>
																		</td>
																		<td class="text-center"><?php echo $row->records_vital_signs_weight.' (kg)';?></td>
																		<td class="text-center"><?php echo $row->records_vital_signs_height.' (Cm)';?></td>
																		<td class="text-center"><?php echo $row->records_vital_signs_temp.' (F)';?></td>
																		<td class="text-center"><?php echo $row->records_vital_signs_bp.' (mm, hg)';?></td>
																		<td class="text-center"><?php echo $row->records_vital_signs_pulse.' (bpm)';?></td>
																		<td class="text-center"><?php echo $row->records_vital_signs_bmi.' (Kg/M^2)';?></td>
																		<td class="text-right"><a class="remove" href="records/ajax/remove_vital_signs/<?php echo $row->records_vital_signs_id;?>"><i class="far fa-trash-alt fa-lg"></i></a></td>
																	</tr>
																<?php } ?>		
															</tbody>
														</table>
														<?php } ?>
													</div>
													<div class="tab-pane fade <?php if($tab == 'symptoms') echo 'active in';?>" id="symptoms">
														
														<?php echo form_open('records/ajax/save_symptoms','class="smart-form" id="symptoms-form"');?>
															<input type="hidden" name="record_id" id="record_id" value="<?php echo $record_id;?>"/>
															<?php if(!$this->Mdl_queings->in_que($info->id)->get()->num_rows()) { ?>	
																<div class="alert alert-info">
																	<p>Please move first to que to continue!</p>
																</div>
															<?php } ?>
															<section>
																<label class="label">Signs and Symptoms</label>
																<label class="input"> 	
																	<select name="sign_symptoms" id="sign_symptoms" class="select2-multiple" multiple="multiple"></select>									
																</label>
																<!-- <div class="note">
																	<strong>Note:</strong> height of the textarea depends on the rows attribute.
																</div> -->
															</section>
															<section>
																<label class="label">Diagnosis</label>
																<label class="input"> 										
																	<select name="diagnosis" id="diagnosis" class="select2-multiple" multiple="multiple"></select>
																</label>
																<!-- <div class="note">
																	<strong>Note:</strong> height of the textarea depends on the rows attribute.
																</div> -->
															</section>
															<footer>
																<button type="submit" id="symptoms-submit" class="btn btn-primary" <?php if(!$this->Mdl_queings->in_que($info->id)->get()->num_rows()) echo 'disabled="disabled"';?>>
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
																	<th>Diagnosis</th>
																	<th></th>
																</tr>
															</thead>
															<tbody>
																<?php foreach($all_symptoms as $row) { ?>
																	<tr <?php if($row->records_symptoms_date == date('Y-m-d')) echo 'class="current"';?>>
																		<td>
																			<?php echo $row->records_symptoms_date;?>
																			<?php if($row->records_symptoms_date == date('Y-m-d')) echo '<span class="label label-success">current</span>';?>
																		</td>
																		<td><?php echo $row->records_symptoms_signs;?></td>
																		<td><?php echo $row->records_symptoms_diagnosis;?></td>
																		<td class="text-right"><a class="remove" href="records/ajax/remove_symptoms/<?php echo $row->records_symptoms_id;?>"><i class="far fa-trash-alt fa-lg"></i></a></td>
																	</tr>
																<?php } ?>		
															</tbody>
														</table>
														<?php } ?>					
													</div>
													<div class="tab-pane fade <?php if($tab == 'investigation') echo 'active in';?>" id="investigation">
														<?php echo form_open('records/ajax/save_investigation','class="smart-form" id="investigation-form"');?>
															<input type="hidden" name="record_id" value="<?php echo $record_id;?>"/>
															<?php if(!$this->Mdl_queings->in_que($info->id)->get()->num_rows()) { ?>	
																<div class="alert alert-info">
																	<p>Please move first in que to continue!</p>
																</div>
															<?php } ?>
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
																<button type="submit" class="btn btn-primary" <?php if(!$this->Mdl_queings->in_que($info->id)->get()->num_rows()) echo 'disabled="disabled"';?>>
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
																	<th></th>
																</tr>
															</thead>
															<tbody>
																<?php foreach($all_investigations as $row) { ?>
																	<tr <?php if($row->records_investigations_date == date('Y-m-d')) echo 'class="current"';?>>
																		<td>
																			<?php echo $row->records_investigations_date;?>
																			<?php if($row->records_investigations_date == date('Y-m-d')) echo '<span class="label label-success">current</span>';?>
																		</td>
																		<td><?php echo $row->records_investigations_investigation;?></td>
																		<td class="text-right"><a class="remove" href="records/ajax/remove_investigations/<?php echo $row->records_investigations_id;?>"><i class="far fa-trash-alt fa-lg"></i></a></td>
																	</tr>
																<?php } ?>		
															</tbody>
														</table>
														<?php } ?>	
													</div>
													<div class="tab-pane fade <?php if($tab == 'medication') echo 'active in';?>" id="medication">

														<?php echo form_open('records/ajax/save_medication','class="smart-form" id="medication-form"');?>
															<input type="hidden" name="record_id" value="<?php echo $record_id;?>"/>
															<?php if(!$this->Mdl_queings->in_que($info->id)->get()->num_rows()) { ?>	
																<div class="alert alert-info">
																	<p>Please move first in que to continue!</p>
																</div>
															<?php } ?>
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
																<button type="submit" class="btn btn-primary" <?php if(!$this->Mdl_queings->in_que($info->id)->get()->num_rows()) echo 'disabled="disabled"';?>>
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
																					<th></th>
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
																						<td class="text-right"><a class="remove" href="records/ajax/remove_medications/<?php echo $row->records_medications_id;?>"><i class="far fa-trash-alt fa-lg"></i></a></td>
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
													<div class="tab-pane fade <?php if($tab == 'advice') echo 'active in';?>" id="advice">
														<?php echo form_open('records/ajax/save_advice','class="smart-form" id="advice-form"');?>
															<input type="hidden" name="record_id" value="<?php echo $record_id;?>"/>
															<?php if(!$this->Mdl_queings->in_que($info->id)->get()->num_rows()) { ?>	
																<div class="alert alert-info">
																	<p>Please move first in que to continue!</p>
																</div>
															<?php } ?>
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
																<button type="submit" class="btn btn-primary" <?php if(!$this->Mdl_queings->in_que($info->id)->get()->num_rows()) echo 'disabled="disabled"';?>>
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
																	<th></th>
																</tr>
															</thead>
															<tbody>
																<?php foreach($all_advice as $row) { ?>
																	<tr <?php if($row->records_advice_date == date('Y-m-d')) echo 'class="current"';?>>
																		<td>
																			<?php echo $row->records_advice_date;?>
																			<?php if($row->records_advice_date == date('Y-m-d')) echo '<span class="label label-success">current</span>';?>
																		</td>
																		<td><?php echo $row->records_advice_advice;?></td>
																		<td><?php echo $row->records_advice_follow_up_date;?></td>
																		<td class="text-right"><a class="remove" href="records/ajax/remove_advice/<?php echo $row->records_advice_id;?>"><i class="far fa-trash-alt fa-lg"></i></a></td>
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
																	<th>ID</th>
																	<th>Date</th>
																	<th>Time</th>
																	<th>Status</th>
																</tr>
															</thead>
															<tbody>
																<?php foreach($all_record as $row){ ?>
																	<tr>
																		<td><?php echo $row->record_id;?></td>
																		<td><?php echo $row->record_date;?></td>
																		<td><?php echo $row->record_time;?></td>
																		<td><?php echo ($row->record_status == 1) ? 'Finished':'Progress...';?></td>
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
	
	$.fn.enterKey = function (fnc) {
		return this.each(function () {
			$(this).keypress(function (ev) {
				var keycode = (ev.keyCode ? ev.keyCode : ev.which);
				if (keycode == '13') {
					fnc.call(this, ev);
				}
			})
		})
	}

	$("#allergies").enterKey(function () {
		
		$("#allergies-form").validate({
            // Rules for form validation
            rules : {
                allergies : {
                    required : true,
                    maxlength: 150
                }
            },
            // Messages for form validation
            messages : {
                allergies : {
                    required : '<i class="fa fa-times-circle"></i> Please add allergies',
                    maxlength: '<i class="fa fa-times-circle"></i> The allergies can not exceed 150 characters in length.'
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
                        $(form).find('input').attr("disabled", "disabled");
                    },
                    success:function(response)
                    {
                        if(response.success)
                        {
                            checkURL();
                        }             
                    },
                    dataType:'json'
                });
            }
        });
	});

	$("#family_hitories").enterKey(function () {
		
		$("#family-hitories-form").validate({
            // Rules for form validation
            rules : {
                family_hitories : {
                    required : true,
                    maxlength: 150
                }
            },
            // Messages for form validation
            messages : {
                family_hitories : {
                    required : '<i class="fa fa-times-circle"></i> Please add family hitories',
                    maxlength: '<i class="fa fa-times-circle"></i> The family hitories can not exceed 150 characters in length.'
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
                        $(form).find('input').attr("disabled", "disabled");
                    },
                    success:function(response)
                    {
                        if(response.success)
                        {
                            checkURL();
                        }             
                    },
                    dataType:'json'
                });
            }
        });
	});

	var can_view = 	'<?php echo ($this->admin_role_id != $this->role_id) ? $this->Mdl_roles->has_permission('patients', $this->role_id, 'view') : true; ?>';
	var can_update = '<?php echo ($this->admin_role_id != $this->role_id) ? $this->Mdl_roles->has_permission('patients', $this->role_id, 'update') : true; ?>';
	var can_delete = '<?php echo ($this->admin_role_id != $this->role_id) ? $this->Mdl_roles->has_permission('patients', $this->role_id, 'delete') : true; ?>';

	pageSetUp();

	$( document ).ready(function() {
		var patient_id = '<?php echo $info->id;?>';

		$( "ul#widget-tab-2 li a" ).bind( "click", function() {
			var curtab = $(this).attr('data-id');
			$.post(BASE_URL+'records/ajax/set_tab', { tab: curtab} );
		});

		$(document).on('click','#move-in',function(e) {
		    var href = $(this).attr('href');
			
			$.ajax({
				url: href,
				type: 'post',
				dataType: "json",
				success: function (response)
				{
					console.log(response.message);
					if(response)
					{
						mcs.init_smallBox("success", response.message);
						checkURL();
					}
					else
					{
						mcs.init_smallBox("error", response.message);
					}  
				}
			});

			e.preventDefault();
		});
		
		get_allergies();
		
		function get_allergies(){

			$.getJSON(BASE_URL+'records/ajax/get_allergies', { patient_id: patient_id }, function(data) {
				var temp = '<ul class="list-group">';
				if(data.length > 0){
					$.each(data, function(index, element) {
						temp += '<li class="list-group-item">'+element.records_allergies_medicine+'<a class="remove" href="'+BASE_URL+'records/ajax/remove_allergies/'+element.records_allergies_id+'"><i class="far fa-trash-alt fa-lg"></i></a></li>';
						console.log(element);
					});
				} else {
					temp += '<p>No record!</p>';
				}
				$('#wid-allergies').find('.widget-body').html('').append(temp);
			});
		}
		
		get_hestories();

		function get_hestories(){

			$.getJSON(BASE_URL+'records/ajax/get_hestories', { patient_id: patient_id }, function(data) {
				var temp = '<ul class="list-group">';
				if(data.length > 0){
					$.each(data, function(index, element) {
						temp += '<li class="list-group-item">'+element.records_family_histories_hitory+'<a class="remove" href="'+BASE_URL+'records/ajax/remove_histories/'+element.records_family_histories_id+'"><i class="far fa-trash-alt fa-lg"></i></a></li>';
						console.log(element);
					});
				} else {
					temp += '<p>No record!</p>';
				}
				$('#wid-family-history').find('.widget-body').html('').append(temp);
			});
		}

		$(document).on('click','.remove',function(e) {
			e.preventDefault();
            $.ajax({
                url: $(this).attr('href'),
                success: function(response) {
                    var obj = JSON.parse(response);
                    console.log(response);
                    if (obj.success) {
                        checkURL();
                    } else {
                        mcs.init_smallBox("error", obj.message);
                    }
                }
            });
		});
		$(document).on('click','#symptoms-submit',function(e) {
			
			$('#symptoms-form').submit(function(event) {

				$.ajax({
		            type : 'POST', // define the type of HTTP verb we want to use (POST for our form)
		            url : BASE_URL+'records/ajax/save_symptoms', // the url where we want to POST
		            data : {
			            record_id: $('#record_id').val(),
			            sign_symptoms: $('#sign_symptoms').select2('data'),
			            diagnosis: $('#diagnosis').select2('data')
			        }, // our data object
		            dataType :'json'
		        })
	            // using the done promise callback
	            .done(function(data) {

	                // log data to the console so we can see
	                console.log(data); 

	                // here we will handle errors and validation messages
	            });
		       	event.preventDefault();
	    	});
	    });
	});

	var select = function() {

		$('#sign_symptoms').select2({
		  	ajax: {
	          	url: BASE_URL+'symptoms/ajax/get_suggest_symptoms',
	          	dataType: 'json',
	          	delay: 250,
	          	data: function (params) {
			      	var queryParameters = {
				      	q: params.term
				    }

				    return queryParameters;
			    },
	          	processResults: function (data) {
	            	return {
	              		results: data
	            	};
	          	},
	          	cache: true	
	        },
	        tags: "true",
  			allowClear: true,
	        placeholder: 'Select Symptoms',
			minimumInputLength: 1
		});

		$('#diagnosis').select2({
		  	ajax: {
	          	url: BASE_URL+'diagnosis/ajax/get_suggest_diagnosis',
	          	dataType: 'json',
	          	delay: 250,
	          	data: function (params) {
			      	var queryParameters = {
				      	q: params.term
				    }

				    return queryParameters;
			    },
	          	processResults: function (data) {
	            	return {
	              		results: data
	            	};
	          	},
	          	cache: true	
	        },
	        tags: "true",
  			allowClear: true,
	        placeholder: 'Select Diagnosis',
			minimumInputLength: 1
		});
		
	}

	loadScript(BASE_URL+'vendor/select2/select2/dist/js/select2.min.js', select);

	var typeahead = function() {

		$('#medicine').typeahead({
			ajax: {
				url: BASE_URL+'records/ajax/get_medicines',//var type = $(this).attr('id');
				timeout: 500,
				displayField: "name",
				valueField: "id",
				triggerLength: 1,
				method: "get",
				dataType: "json",
				preDispatch: function (query) {
					//showLoadingMask(true);
					return {
						search: query
					}
				},
				preProcess: function (data) {

					if (data.success === false) {
						return false;
					}else{
						return data;    
					}                
				}               
			}
		});

		$('#preparation').typeahead({
			ajax: {
				url: BASE_URL+'records/ajax/get_preparation',//var type = $(this).attr('id');
				timeout: 500,
				displayField: "name",
				valueField: "id",
				triggerLength: 1,
				method: "get",
				dataType: "json",
				preDispatch: function (query) {
					//showLoadingMask(true);
					return {
						search: query
					}
				},
				preProcess: function (data) {

					if (data.success === false) {
						return false;
					}else{
						return data;    
					}                
				}               
			}
		});

		$('#sig').typeahead({
			ajax: {
				url: BASE_URL+'records/ajax/get_sig',//var type = $(this).attr('id');
				timeout: 500,
				displayField: "name",
				valueField: "id",
				triggerLength: 1,
				method: "get",
				dataType: "json",
				preDispatch: function (query) {
					//showLoadingMask(true);
					return {
						search: query
					}
				},
				preProcess: function (data) {

					if (data.success === false) {
						return false;
					}else{
						return data;    
					}                
				}               
			}
		});

	}

	loadScript(BASE_URL+"js/plugin/bootstrap-ajax-typeahead/js/bootstrap-typeahead.min.js", typeahead);

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
