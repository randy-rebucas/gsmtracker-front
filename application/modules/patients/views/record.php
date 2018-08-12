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
			<div class="jarviswidget jarviswidget-color-darken" id="wid-id-0" data-widget-colorbutton="true" data-widget-editbutton="false">
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
													<a data-toggle="tab" href="#symptoms"> <span class="hidden-mobile hidden-tablet"> Symptoms </span> </a>
												</li>
												<li>
													<a data-toggle="tab" href="#investegation"> <span class="hidden-mobile hidden-tablet"> Investegation </span> </a>
												</li>
												<li>
													<a data-toggle="tab" href="#medication"> <span class="hidden-mobile hidden-tablet"> Medication </span> </a>
												</li>
												<li>
													<a data-toggle="tab" href="#advice"> <span class="hidden-mobile hidden-tablet"> Advice </span> </a>
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
														<form action="" class="smart-form" _lpchecked="1">
															<div class="row">
										                        <section class="col col-6">
																	<label class="label"></label>
																	<label class="input">
																		<input type="text" name="" id="" value="">
																	</label>
																</section>
																<section class="col col-6">
																	<label class="label"></label>
																	<label class="input">
																		<input type="text" name="" id="" value="">
																	</label>
																</section>
									                    	</div>
									                    	<div class="row">
										                        <section class="col col-6">
																	<label class="label"></label>
																	<label class="input">
																		<input type="text" name="" id="" value="">
																	</label>
																</section>
																<section class="col col-6">
																	<label class="label"></label>
																	<label class="input">
																		<input type="text" name="" id="" value="">
																	</label>
																</section>
									                    	</div>
									                    	<div class="row">
										                        <section class="col col-6">
																	<label class="label"></label>
																	<label class="input">
																		<input type="text" name="" id="" value="">
																	</label>
																</section>
																<section class="col col-6">
																	<label class="label"></label>
																	<label class="input">
																		<input type="text" name="" id="" value="">
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
													<div class="tab-pane fade" id="investegation">
														<form action="" class="smart-form" _lpchecked="1">
															<section>
																<label class="label">Investigations</label>
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
															<tr>
																<td>5DDA79E7-890F-064D</td>
																<td>Nunc.lectus@ipsum.co.uk</td>
																<td>28/12/13</td>
															</tr>
															<tr>
																<td>468459AA-7933-C017</td>
																<td>vitae.mauris.sit@tempordiamdictum.net</td>
																<td>25/02/14</td>
															</tr>
															<tr>
																<td>C3006C18-4677-D2CE</td>
																<td>nec.urna.suscipit@acrisusMorbi.edu</td>
																<td>06/07/14</td>
															</tr>
															<tr>
																<td>E535C188-FDF4-90CB</td>
																<td>lobortis@pedeacurna.com</td>
																<td>28/12/12</td>
															</tr>
															<tr>
																<td>95489E95-9602-18B7</td>
																<td>egestas.lacinia.Sed@In.ca</td>
																<td>17/07/14</td>
															</tr>
															<tr>
																<td>D34E6661-D81A-9328</td>
																<td>arcu@lectus.ca</td>
																<td>14/10/14</td>
															</tr>
															<tr>
																<td>C72D2C04-458F-EBD0</td>
																<td>ut.pharetra.sed@vulputatevelit.net</td>
																<td>30/04/14</td>
															</tr>
															<tr>
																<td>10CAFA5C-AB4B-8B45</td>
																<td>arcu.eu.odio@Duis.co.uk</td>
																<td>14/02/13</td>
															</tr>
															<tr>
																<td>AA4F5CBA-1CE8-85B7</td>
																<td>nec@rutrum.net</td>
																<td>06/02/14</td>
															</tr>
															<tr>
																<td>2D816071-8F99-B315</td>
																<td>Praesent.luctus.Curabitur@elementum.ca</td>
																<td>27/09/13</td>
															</tr>
															<tr>
																<td>41BDB60C-C6EA-54EB</td>
																<td>Nunc.sed.orci@sitamet.org</td>
																<td>18/11/13</td>
															</tr>
															<tr>
																<td>43F3D48B-FEF3-776E</td>
																<td>eu.erat@nequevitaesemper.com</td>
																<td>23/04/13</td>
															</tr>
															<tr>
																<td>2521899F-79B9-B309</td>
																<td>mattis.velit@risusQuisque.ca</td>
																<td>04/07/13</td>
															</tr>
															<tr>
																<td>D08994C9-DCB1-948B</td>
																<td>Proin@metusAliquam.net</td>
																<td>27/07/13</td>
															</tr>
															<tr>
																<td>7AD2C774-36BA-0B2B</td>
																<td>tincidunt@Lorem.com</td>
																<td>01/07/14</td>
															</tr>
															<tr>
																<td>162C0373-FF3B-2469</td>
																<td>ante.dictum.cursus@ultrices.org</td>
																<td>10/02/13</td>
															</tr>
															<tr>
																<td>05641987-3D48-DD72</td>
																<td>lorem.ut.aliquam@Sednecmetus.org</td>
																<td>16/08/14</td>
															</tr>
															<tr>
																<td>3A173E5A-192A-0D5D</td>
																<td>nunc.risus@vitae.org</td>
																<td>04/04/13</td>
															</tr>
															<tr>
																<td>67081066-E0B5-9E37</td>
																<td>lectus@sed.org</td>
																<td>10/12/14</td>
															</tr>
															<tr>
																<td>C677C05F-7D98-C3E9</td>
																<td>auctor.quis@Morbi.org</td>
																<td>30/03/13</td>
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

		var url = $(this).attr('href');
		var title = $(this).attr('title');
	    var container = $('.record-tabs-content');

	    $.ajax({
			url: url,
			type: 'get',
			dataType: 'html',
			beforeSend : function() {
				// cog placed
				container.html('<h1><i class="fa fa-cog fa-spin"></i> Loading...</h1>');

				$('html, body').animate({
					scrollTop : 0
				}, "fast");
				
			},
			success: function(data){
				container.css({
				opacity : '0.0'
				}).html(data).delay(50).animate({
					opacity : '1.0'
				}, 300);
				
			},
			error : function(xhr, ajaxOptions, thrownError) {
				container.html('<h4 style="margin-top:10px; display:block; text-align:left"><i class="fa fa-warning txt-color-orangeDark"></i> Error: ' + ajaxOptions + ': ' + thrownError +'</h4>');
			},
			async : false
		});
		e.preventDefault();

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
