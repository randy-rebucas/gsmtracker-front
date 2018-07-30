<!-- Bread crumb is created dynamically -->
<!-- row -->
<style>

div#empty-content {
    text-align: center;
    padding: 2em;
}
#content {
    display: grid;
    grid-template-columns: 80% 20%;
    grid-gap: 1em;
}
div#patient-profile-picture h1 {
        margin: .8em 0;
}

div#blocks div h3 {
    margin: 0 0 1em;
    text-decoration: underline;
    text-align: center;
}
div#blocks h1 {
    font-weight: 100;
    font-size: 28px;
}
div#blocks .record-data {
    position: relative;
}
div#blocks .record-data a.delete_record {
    position: absolute;
    bottom: 10%;
    right: 5%;
    visibility: hidden;
}
div#blocks .record-data:hover a.delete_record {
    visibility: visible;
}

.table>tbody>tr>td:last-child a {
    visibility: hidden;
}
.table>tbody>tr:hover>td:last-child a {
    visibility: visible;
}
.table>tbody>tr>td:first-child {
    width: 15%;
}

div#asides {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1em;
}
div#asides .asides-blocks {
    border: 1px solid #ccc;
    padding: 0 .5em;
    margin: .5em 0 0 0;
}
div#asides .asides-blocks h3 {
    margin: 0 0 .3em;
    border-bottom: 1px solid #bfbcbc;
    font-size: 14px;
    padding: .3em 0;
}
div#asides .asides-blocks h3 small {
    float: right;
    margin-top: .4em;
    text-transform: uppercase;
    font-size: 12px;
}
div#asides .asides-blocks ul {
    padding-left: 1.5em;
}
div#asides .asides-blocks ul li {
    position: relative;
}
div#asides .asides-blocks ul li a {
    position: absolute;
    right: 0;
    top: 0;
    visibility: hidden;
}
div#asides .asides-blocks ul li:hover a {
    visibility: visible;
}

div#colsultation h2 {
    font-size: 16px;
    margin: 0;
    text-decoration: underline;
}
div#colsultation {
    display: grid;
    grid-template-columns: 30% 70%;
}

.complaints-row {
    position: relative;
}
.complaints-row:hover a {
    visibility: visible;
}
.complaints-row a {
	position: absolute;
    right: 0;
    top: 0;
    visibility: hidden;
}

form#diagnoses-form section {
    margin-bottom: .3em;
}
div#prescriptions {
    padding: 0 1em;
}
</style>

<div id="work-area">

	<div class="jarviswidget" id="widget-blocks" role="widget">
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
			<h2>Records Blocks</h2>
			
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
				<?php if($custom_records_blocks->num_rows() > 0) { ?>
					<div class="row" id="blocks">
					<?php
						foreach ($custom_records_blocks->result() as $custom_records_block) { ?>
							<div class="col-md-4 text-center record-data">
								<h3> <?php echo $custom_records_block->name;?></h3>
								<?php 
								$record_data = $this->Custom->get_all_custom($custom_records_block->slug.'_'.$this->license_id, $info->id); 

								if(count($record_data) > 0) { 

									$custom_fields = $this->Custom_field->get_custom('records_'.$custom_records_block->slug.'_'.$this->license_id);
									?>

											<?php foreach($record_data as $row) { ?>
												<div id="row-<?php echo $row['id'];?>">
													<?php 
													if($custom_fields->num_rows() > 0) {

										                foreach ($custom_fields->result() as $custom_field) { ?>
										                    
										                    <h1>
																<strong id="block-<?php echo $row['id'];?>"><?php echo $row[''.$custom_field->custom_field_column.'']; ?></strong>
															<small><?php if($custom_field->custom_field_symbol != null) echo '( '.$custom_field->custom_field_symbol.' )';?></small></h1>
										                	<span class="text-muted"><?php echo date($this->config->item('dateformat'), strtotime($row['date']));?></span>
										                <?php }
										            } ?>
										            <a href="<?php echo site_url('records/delete_custom_field/'.$row['id'].'/'.$custom_records_block->slug.'_'.$this->license_id);?>" id="<?php echo $row['id'];?>" class="delete_record"><i class="far fa-trash-alt fa-lg"></i></a>
												</div>
											<?php } ?>
										
								<?php }else{?>
									<p class="text-center"> No Record Found! <br/>
										<a title="Add new" href="<?php echo site_url('records/create_custom/'.$custom_records_block->slug.'_'.$this->license_id.'/'.$info->id);?>" class="btn btn-success btn-xs bootbox">Add New</a></p>
								<?php } ?>
							</div>
						<?php 
						} 
					?>
					</div>
				<?php } else { ?>
					<p>No record added on this blocks! Add <a href="<?php echo site_url('records');?>">Record</a>
				<?php } ?>
			</div>
		</div>
	</div>

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
			<h2>Records Tabs</h2>
			<?php if($custom_records_tabs->num_rows() > 0) { ?>
			<ul id="widget-tab-2" class="nav nav-tabs pull-right">
			<?php 
				$i = 0;
				foreach ($custom_records_tabs->result() as $custom_record_tab) { ?>
					<li class="<?php if($i == 0) echo 'active';?>">
						<a data-toggle="tab" href="#record_<?php echo $custom_record_tab->record_id;?>"> <span class="hidden-mobile hidden-tablet"> <?php echo $custom_record_tab->name;?> </span> </a>
					</li>
			<?php $i++; } ?>
			</ul>
			<?php } ?>
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
					<?php if($custom_records_tabs->num_rows() > 0) { ?>
						<?php 
							$i = 0;
							foreach ($custom_records_tabs->result() as $custom_record_tab) { ?>
							<div class="tab-pane fade <?php if($i == 0) echo 'active in';?>" id="record_<?php echo $custom_record_tab->record_id;?>">
								<?php $record_data = $this->Custom->get_all_custom($custom_record_tab->slug.'_'.$this->license_id, $info->id);
								if(count($record_data) > 0) { 

									$custom_fields = $this->Custom_field->get_custom('records_'.$custom_record_tab->slug.'_'.$this->license_id);
									?>
									<table class="table">
										<thead>
											<tr>
												<th>
													Date
												</th>
												<?php 
												if($custom_fields->num_rows() > 0) {
									                foreach ($custom_fields->result() as $custom_field) { ?>
									                    <th>
															<?php echo $custom_field->custom_field_label;?>
														</th>
									                <?php }
									            } ?>
									            
												<th>
													<a title="Add new" href="<?php echo site_url('records/create_custom/'.$custom_record_tab->slug.'_'.$this->license_id.'/'.$info->id);?>" class="bootbox pull-right btn btn-success btn-xs">
														<i class="fa fa-plus"></i> <?php echo $this->lang->line('common_add_new');?>
													</a>
												</th>
											</tr>
										</thead>
										<tbody>
											<?php foreach($record_data as $row) { ?>
												<tr id="row-<?php echo $row['id'];?>">
													<td>
														<span class="text-muted"><?php echo date($this->config->item('dateformat'), strtotime($row['date'])); ?></span>
														
													</td>
													<?php 
													if($custom_fields->num_rows() > 0) {

										                foreach ($custom_fields->result() as $custom_field) { ?>
										                    <td>
																<p><strong id="history-<?php echo $row['id'];?>"><?php echo $row[''.$custom_field->custom_field_column.'']; ?></strong>
																<span><?php if($custom_field->custom_field_symbol != null) echo '( '.$custom_field->custom_field_symbol.' )';?></span></p>
															</td>
															
										                <?php }
										            } ?>
													<td class="text-right">
														<a href="<?php echo site_url('records/delete_custom_field/'.$row['id'].'/'.$custom_record_tab->slug.'_'.$this->license_id);?>" id="<?php echo $row['id'];?>" class="delete_record"><i class="far fa-trash-alt fa-lg"></i></a>
													</td>
												</tr>
											<?php } ?>
										</tbody>
									</table>
								<?php }else{?>
									<div id="empty-content">
										<h3>No <?php echo ucfirst(str_replace('_', ' ', $custom_record_tab->slug));?> Record Found! <a title="Add new" href="<?php echo site_url('records/create_custom/'.$custom_record_tab->slug.'_'.$this->license_id.'/'.$info->id);?>" class="bootbox">Add new</a></h3>
									</div>
								<?php } ?>				
							</div>

						<?php $i++; } ?>
					<?php } else { ?>
						<div id="empty-content">
							<i class="fa fa-list fa-5x"></i> 
							<h1>No Custom Record found! </h1>
						</div>
					<?php } ?>
				


				</div>
			</div>
			<!-- end widget content -->

		</div>
		<!-- end widget div -->

	</div>

	<!--
	The ID "widget-grid" will start to initialize all widgets below
	You do not need to use widgets if you dont want to. Simply remove
	the <section></section> and you can use wells or panels instead
	-->
	<div class="jarviswidget" id="widget-consultation" role="widget">
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
			<h2>Colsultation </h2>
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
				<div class="tab-content" id="colsultation">
					<div class="private-access active" id="diagnoses">
					<!-- Diagnoses & Condition-->
						<h2>Diagnoses & Condition</h2>
						<div id="diagnoses-results">
							
						</div>
						<?php echo form_open('records/create_diagnoses/-1/diagnoses',array('id'=>'diagnoses-form','class'=>'smart-form', 'role'=>'form'));?>
							<input type="hidden" name="user_id" value="<?php echo $info->id;?>"/>
							<section>
								<label class="textarea textarea-resizable">
									<textarea class="form-control" name="diagnoses" id="diagnoses" rows="3"></textarea>
								</label>
							</section>
							<section>
						        <button type="submit" id="submit" class="btn btn-primary pull-right btn-sm">Submit</button>
						    </section>
						<?php echo form_close();?>

					</div>
					<div class="private-access" id="prescriptions">
						
					<!-- Prescriptions -->
						<h2>Prescriptions</h2>
						<!-- prescription -->
						<div id="prescription-results">
							
						</div>
						<?php echo form_open('records/create_prescription/-1/prescription',array('id'=>'prescription-form','class'=>'smart-form', 'role'=>'form'));?>
							<input type="hidden" name="user_id" value="<?php echo $info->id;?>"/>
							<table class="table">
								<thead>
									<tr>
										<th style="width:35%;">
											Medicine
										</th>
										<th style="width:20%;">
											Preparation
										</th>
										<th style="width:30%;">
											Sig
										</th>
										<th style="width:10%;">
											Qty
										</th>
										<th style="width:5%;">
											<abbr title="Is Maintainable"><i class="far fa-question-circle"></i></abbr>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<input type="text" name="medicine" id="medicine" class="form-control" >
										</td>
										<td>
											<input type="text" name="preparation" id="preparation" class="form-control" >
										</td>
										<td>			
											<input type="text" name="sig" id="sig" class="form-control" >
										</td>
										<td>
											<input type="text" name="qty" id="qty" class="form-control" >
										</td>
										<td>
											<input type="checkbox" name="is_mainteinable" id="is_mainteinable" value="1">
										</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<td colspan="5">
											<button type="submit" id="submit" class="btn btn-primary pull-right btn-sm">Submit</button>
										</td>
									</tr>
								</tfoot>
							</table>
						<?php echo form_close();?>
						
					</div>
				</div>
			</div>
			<!-- end widget content -->

		</div>
		<!-- end widget div -->

	</div>
</div>
<div id="patient-profile">
	<div id="patient-profile-details">
		<div id="patient-profile-picture">
			<?php if($info->avatar != '')
			{
				$img = base_url().'uploads/'.$info->license_key.'/profile-picture/'.$info->avatar;
			}
			else
			{ 
				$img = $this->gravatar->get($info->email, 200);
			} ?>
			<img src="<?php echo $img;?>" style="width:100%;" class="img-fluid"/>
			<h1 class="txt-color-blueDark"><a href="<?php echo site_url('patients/details/'.$info->id);?>" class="bootbox"><?php echo $info->firstname.', '.$info->lastname;?></a></h1>
		</div>
		<div id="action">
			<?php if(!$this->Queing->exists($info->id, $this->license_id)){ ?>
				<a href="<?php echo site_url('queings/move_in/'.$info->id);?>" class="move-in btn btn-primary btn-block"><i class="fa fa-sign-in fa-fw"></i> Move in to waiting list!</a>
			<?php }else{ ?>
				<a href="javascript:;" id="<?php echo $info->id;?>" class="move-out btn btn-danger btn-block"><i class="fa fa-sign-out fa-fw"></i> Move out to waiting list!</a>
			<?php } ?>
			
		</div>
		<span><?php if($this->Queing->exists($info->id, $this->license_id)){ echo 'QUE # : '. $this->Queing->get_info($info->id, $this->license_id)->que_id.'</span>'; }?>
		
	</div>

	<div id="asides">
	<?php if($custom_records_asides->num_rows() > 0) { 
		foreach ($custom_records_asides->result() as $custom_records_aside) { ?>
			<div class="asides-blocks">
				<h3> <?php echo $custom_records_aside->name;?> <small><a title="Add new" href="<?php echo site_url('records/create_custom/'.$custom_records_aside->slug.'_'.$this->license_id.'/'.$info->id);?>" class="bootbox">Add new</a></small></h3>
				<?php 
				$record_data = $this->Custom->get_all_custom($custom_records_aside->slug.'_'.$this->license_id, $info->id); 

				if(count($record_data) > 0) { 

					$custom_fields = $this->Custom_field->get_custom('records_'.$custom_records_aside->slug.'_'.$this->license_id);
						echo '<ul>';
						foreach($record_data as $row) { ?>
								<li id="row-<?php echo $row['id'];?>">
									<?php 
									if($custom_fields->num_rows() > 0) {

						                foreach ($custom_fields->result() as $custom_field) { ?>
						                    
											<strong id="aside-<?php echo $row['id'];?>"><?php echo $row[''.$custom_field->custom_field_column.'']; ?></strong><span><?php if($custom_field->custom_field_symbol != null) echo '( '.$custom_field->custom_field_symbol.' )';?></span></br>
											
						                <?php }
						            } ?>
						            <a href="<?php echo site_url('records/delete_custom_field/'.$row['id'].'/'.$custom_records_aside->slug.'_'.$this->license_id);?>" id="<?php echo $row['id'];?>" class="delete_record"><i class="fas fa-times-circle fa-lg"></i></a>
								</li>
						<?php }
						echo '</ul>'; 
					}else{
					echo '<p class="text-center">No Record Found!</p>';
				} ?>
			</div>
		<?php 
		} 
	} ?>
	</div>

	<div id="patient-profile-menu" class="hidden">
		<a href="<?php echo site_url('records/docs/'.$info->id);?>" id="<?php echo $info->id;?>" title="Print Form" class="hidden bootbox btn btn-success"><i class="fa fa-print fa-fw"></i>Print</a>
	</div>
</div>
<script type="text/javascript">
	var BASE_URL = '<?php echo base_url();?>';
	var type = '<?php echo $type;?>';
	var active_user_id = '<?php echo $info->id;?>';
	var lic = '<?php echo $this->license_id;?>';

	pageSetUp();
	/* DO NOT REMOVE : GLOBAL FUNCTIONS!
	 *
	 * pageSetUp(); WILL CALL THE FOLLOWING FUNCTIONS
	 *
	 * // activate tooltips*/
	 $("[rel=tooltip]").tooltip();
	 /*
	 * // activate popovers*/
	 $("[rel=popover]").popover();
	 /*
	 * // activate popovers with hover states
	 * $("[rel=popover-hover]").popover({ trigger: "hover" });
	 *
	 * // activate inline charts
	 * runAllCharts();
	 *
	 * // setup widgets
	 * setup_widgets_desktop();
	 *
	 * // run form elements
	 * runAllForms();
	 *
	 ********************************
	 *
	 * pageSetUp() is needed whenever you load a page.
	 * It initializes and checks for all basic elements of the page
	 * and makes rendering easier.
	 *
	 */
	var patient_id = '<?php echo $info->id;?>';

	get_diagnoses(patient_id);

 	function get_diagnoses(patient_id){
		$.ajax({
			url: BASE_URL+'records/get_records',
			type: 'post', 
			data: {
				id : patient_id,
				limit : false,
				type : 'diagnoses'
			},               
			dataType: 'json',
			success: function (response) {
				
				if (response.length === 0) {
					
					$('<div class="alert alert-info text-center empty-post">Add diagnoses.</div>').appendTo('#diagnoses-results');
					
				}else{

					var items = [];

					$(response).each(function( index, val ) {
						var _diagnoses = val.diagnoses;
						if(_diagnoses.length > 150) _diagnoses = _diagnoses.substring(0,150)+'...';
						console.log(val.date);
						items += '<tr><td style="width:90%;" class="complaints-row group-'+val.date+'">'+_diagnoses+'</td>'+
								'<td><a href="'+BASE_URL+'records/delete_custom_field/'+val.id+'/diagnoses" id="'+val.id+'" class="delete"><i class="fas fa-times-circle fa-lg"></i></a></td></tr>';	
					});
				
					$('<table class="table" id="complain-table"><tbody>'+items+'</tbody></table>').appendTo('#diagnoses-results');

				}	
			}
		});
	}

	load_prescriptions(patient_id);

	function load_prescriptions(patient_id){
		$.ajax({
			url: BASE_URL+'records/get_records',
			type: 'post', 
			data: {
				id : patient_id,
				limit : false,
				type : 'prescription'
			},               
			dataType: 'json',
			success: function (response) {
				console.log(response);
				if (response.length === 0) {
					
					$('<div class="alert alert-info text-center empty-post">Add prescription.</div>').appendTo('#prescription-results');
					
				}else{
					var item = [];
					var xnum = 1;
					var d = new Date();
					var _date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();

					item += '<table class="table prescription_block"><tbody>';
					$(response).each(function( i, v ) {
						
						
						item += '<tr class=" ';
							if (v.is_mainteinable === 'yes') {
							    item += 'maintainable';
							}
						item += '">'+
									'<td class="num">'+ xnum++ +'. </td> '+
									'<td class="medicine">'+v.medicine+'</td>'+
									'<td class="prep">'+v.preparation+'</td> '+
									'<td class="sig">'+v.sig+'</td>'+
									'<td class="qty"># '+v.qty+'</td>'+
									'<td><a href="'+BASE_URL+'records/delete_custom_field/'+v.id+'/prescription" id="'+v.id+'" class="delete"><i class="far fa-trash-alt fa-lg"></i></a></td>'+	
								'</tr>';
						
						
					});
					
					item += '</tbody><tfoot>'+
						'<tr>'+
							'<td colspan="6"><a title="Rx Preview" href="'+BASE_URL+'queings/preview/'+ patient_id +'/'+_date+'/no" class="ajax-btn btn btn-success btn-sm pull-right" ><i class="fa fa-eye"></i> Rx Preview</a></td>'+
						'</tr>'+
					'</tfoot></table>';

					$(item).appendTo('#prescription-results');
				}
			}
		});
	}

	var typeahead = function() {
		
		$('#medicine').typeahead({
			ajax: {
				url: BASE_URL +'records/get_suggest_records/prescription/medicine', //var type = $(this).attr('id');
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
				url: BASE_URL +'records/get_suggest_records/prescription/preparation', //var type = $(this).attr('id');
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
				url: BASE_URL +'records/get_suggest_records/prescription/sig', //var type = $(this).attr('id');
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

		$('#diagnoses-form').validate({
			rules : {
                diagnoses : {
                    required : true,
                    maxlength: 250
                }
            },
            messages : {
                diagnoses : {
                    required : '<i class="fa fa-times-circle"></i> Please add diagnoses',
                    maxlength: '<i class="fa fa-times-circle"></i> The role name can not exceed 250 characters in length.'
                }
            },
			highlight: function(element) {
				$(element).closest('.form-group').addClass('has-error');
			},
			unhighlight: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
			},
			errorElement: 'span',
			errorClass: 'help-block',
			errorPlacement: function(error, element) {
				if(element.parent('.input-group').length) {
					error.insertAfter(element.parent());
				}else{
					error.insertAfter(element);
				}
			},
			submitHandler:function(form)
			{
				$(form).ajaxSubmit({
					beforeSend: function () {
						$(form).find('#submit').html('Please wait...');
						$(form).find('#submit').attr("disabled", "disabled");
					},
					success:function(response)
					{
						if(response.success)
						{
							$('.close').trigger('click');

							mcs.init_smallBox("Success", response.message);
							
							$.each( response.records, function( key, value ) {
							  	// console.log(key + ": " + value);
							});
							// console.log(response.records); //records_height_kjfh2rehs5_height
							// console.log(response.type) //height_KjFh2rEHs5
							checkURL(); 
						}
						else
						{
							mcs.init_smallBox("Error", response.message);
						}  

						$(form).find('#submit').html('Submit');
						$(form).find('#submit').removeAttr("disabled");	
					},
					dataType:'json'
				});
		
			}
		});

		$('#prescription-form').validate({
			rules: {
				medicine: {required: true},
				preparation: {required: true},
				sig: {required: true},
				qty: {required: true, maxlength: 5}
			},
			highlight: function(element) {
				$(element).closest('.form-group').addClass('has-error');
			},
			unhighlight: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
			},
			errorElement: 'span',
			errorClass: 'help-block',
			errorPlacement: function(error, element) {
				if(element.parent('.input-group').length) {
					error.insertAfter(element.parent());
				}else{
					error.insertAfter(element);
				}
			},
			submitHandler:function(form)
			{
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
							//checkURL();
							//complaints-2017-08-09

							var d = new Date();
							var _date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
							// var _date = $('#medication_date').val();
							var _user_id = $('#user_id').val();
							var _medicine = $('#medicine').val();
							var _preparation = $('#preparation').val();
							var _sig = $('#sig').val();
							var _qty = $('#qty').val();
							var _is_mainteinable = $('#is_mainteinable').val();
							
							var item = [];
							var xnum = 1;
							var count = $('.prescription_block tbody tr').length + 1;
							
							item += '<tr class="">'+
										'<td class="num">'+ count +'. </td> '+
										'<td class="medicine">'+_medicine+'</td>'+
										'<td class="prep">'+_preparation+'</td> '+
										'<td class="sig">'+_sig+'</td>'+
										'<td class="qty"># '+_qty+'</span></td>'+
										'<td><a href="'+BASE_URL+'records/delete_custom_field/'+_user_id+'/prescription" id="'+_user_id+'" class="delete"><i class="far fa-trash-alt fa-lg"></i></a></td>'+	
									'</tr>';

	
							$(item).appendTo('.prescription_block tbody');
						}
						else
						{
							mcs.init_smallBox("Error", response.message);
						} 

						$(form).find('#submit').html('Submit');
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


	var pagefunction = function() {

		$(".bootbox").click(function (e) {
			var title = $(this).attr('title');
			e.preventDefault();
			$.ajax({
				url: $(this).attr('href'),
				onError: function () {
					bootbox.alert('<?php echo $this->lang->line('__bootbox_error');?>');
				},
				success: function (response)
				{
					var dialog = bootbox.dialog({
						title: title,
						message: '<p class="text-center"><img src="'+BASE_URL+'img/ajax-loader.gif"/></p>'
					});
					dialog.init(function(){
						setTimeout(function(){
							dialog.find('.bootbox-body').html(response);
						}, 3000);
					});
				}
			});
			return false;  
		});

		$(document).on('click', '.ajax-btn', function (e) {
			var title = $(this).attr('title');
			e.preventDefault();
			$.ajax({
				url: $(this).attr('href'),
				onError: function () {
					bootbox.alert('Some network problem try again later.');
				},
				success: function (response)
				{
					var dialog = bootbox.dialog({
						title: title,
						className: "modal70",
						message: '<p class="text-center"><img src="'+BASE_URL+'img/ajax-loader.gif"/></p>'
					});
					dialog.init(function(){
						setTimeout(function(){
							dialog.find('.bootbox-body').html(response);
						}, 3000);
					});
				}
			});
			return false;  
		});

		$(document).on('click', '.print-docs', function (e) {
			var title = $(this).attr('title');
			e.preventDefault();
			$.ajax({
				url: $(this).attr('href'),
				onError: function () {
					bootbox.alert('Some network problem try again later.');
				},
				success: function (response)
				{
					var dialog = bootbox.dialog({
						title: title,
						message: '<p class="text-center"><img src="'+BASE_URL+'img/ajax-loader.gif"/></p>'
					});
					dialog.init(function(){
						setTimeout(function(){
							dialog.find('.bootbox-body').html(response);
						}, 3000);
					});
				}
			});
			return false;  
		});

		$(document).on('click', '#empty-block-condition', function (e) {
			var title = $(this).attr('title');
			e.preventDefault();
			$.ajax({
				url: BASE_URL+'records/create/conditions/'+active_user_id,
				onError: function () {
					bootbox.alert('Some network problem try again later.');
				},
				success: function (response)
				{
					var dialog = bootbox.dialog({
						title: 'Add Conditions',
						className: "modal70",
						message: '<p class="text-center"><img src="'+BASE_URL+'img/ajax-loader.gif"/></p>'
					});
					dialog.init(function(){
						setTimeout(function(){
							dialog.find('.bootbox-body').html(response);
						}, 3000);
					});
				}
			});
			return false;  
		});

		$(document).on('click', '.delete_record', function (e) {
		
			var url	= $(this).attr('href');
			var id	= $(this).attr('id');

			$.ajax({
				url: url,
				type: 'POST',
				success: function(response) {

					if(response)
					{
						
						$.smallBox({
							title : "Success",
							content : response.message,
							color : "#739E73",
							iconSmall : "fa fa-check",
							timeout : 3000
						});

						$('#row-'+id).fadeOut();
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

				}
			});
			e.preventDefault();
			
		});

		$(document).on('click', '.delete', function (e) {
		
			var url	= $(this).attr('href');
			var id	= $(this).attr('id');

			$.ajax({
				url: url,
				type: 'POST',
				success: function(response) {

					if(response)
					{
						
						$.smallBox({
							title : "Success",
							content : response.message,
							color : "#739E73",
							iconSmall : "fa fa-check",
							timeout : 3000
						});
						
						checkURL();
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

				}
			});
			e.preventDefault();
			
		});

		$('.move-in').click(function(e) { 

			$.ajax({
				url: $(this).attr('href'),
				type: 'POST',
				beforeSend: function () {
					$(this).html('Please wait...');
					$(this).attr("disabled", "disabled");
				},
				success: function(response) {

					if(response)
					{
						
						$.smallBox({
							title : "Success",
							content : response.message,
							color : "#739E73",
							iconSmall : "fa fa-check",
							timeout : 3000
						});
						checkURL();
						
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

				}
			});
			e.preventDefault();
			
		});
		
		//get_value();
		$('.move-out').click(function(e) {
		
			bootbox.confirm({
			    title: "Consultation",
			    message: "Is it done?",
			    buttons: {
			        cancel: {
			            label: '<i class="fa fa-times"></i> No [ Cancel ]'
			        },
			        confirm: {
			            label: '<i class="fa fa-check"></i> Yes [ Finished ]'
			        }
			    },
			    callback: function (result) {
			        console.log('This was logged in the callback: ' + result); //$info->id
			        var id = $('.move-out').attr('id');
			        if(result){
			        	var status = '1';	
			        }else{
			        	var status = '0';
			        }
			        
			        $.ajax({
					url: BASE_URL +'queings/move_out/'+id+'/'+status,
					type: 'POST',
					beforeSend: function () {
						$(this).html('Please wait...');
						$(this).attr("disabled", "disabled");
					},
					success: function(response) {
		
						if(response)
						{
							
							$.smallBox({
								title : "Success",
								content : response.message,
								color : "#739E73",
								iconSmall : "fa fa-check",
								timeout : 3000
							});
							checkURL();
							
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
		
					}
				});
			    }
			});
			e.preventDefault();
			
		});
	
	}

	var pagedestroy = function(){
		
		/*
		Example below:

		$("#calednar").fullCalendar( 'destroy' );
		if (debugState){
			root.console.log("✔ Calendar destroyed");
		} 

		For common instances, such as Jarviswidgets, Google maps, and Datatables, are automatically destroyed through the app.js loadURL mechanic

		*/

	    //destroy xeditable

	}

	loadScript(BASE_URL+"js/bootbox.min.js", pagefunction)
			
</script>
