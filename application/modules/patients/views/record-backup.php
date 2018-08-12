<!-- Bread crumb is created dynamically -->
<!-- row -->
<style>

div#empty-content {
    text-align: center;
    padding: 2em;
}
#record {
    display: grid;
    grid-template-columns: 80% 20%;
    grid-gap: 1em;
}
.pagination {
    display: inline-block;
    padding-left: 0;
    margin: 10px 0 0;
    border-radius: 2px;
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
div#blocks .record-data:hover .direct {
    visibility: visible;
}
div#blocks .direct {
    float: right;
    visibility: hidden;
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

<div class="row">

	<!-- col -->
	<div class="col-xs-12 col-sm-7 col-md-7 col-lg-4"> 
		<h1 class="page-title txt-color-blueDark"><!-- PAGE HEADER --><?php echo $module ;?> : <small><?php echo 'QUE # : '. $que_info['id'];?></small></h1>
	</div>

	<!-- end col -->
<!-- 	<div class="col-xs-12 col-sm-5 col-md-5 col-lg-8 text-right">
		<div class="btn-group">
			
			<button type="button" class="btn btn-primary">Record</button>
			<button type="button" class="btn btn-primary">Delete</button>
			<button type="button" class="btn btn-primary">Update</button>
			
			
		</div>
	</div> -->
	<!-- right side of the page with the sparkline graphs -->
	<!-- col -->
	<div class="col-xs-12 col-sm-5 col-md-5 col-lg-8 text-right">
		<ul class="pagination pagination-sm">
		<!-- <li class="active">
			<a href="javascript:void(0);">1</a>
			</li> -->
		<?php foreach ($paginates as $key => $value) { $arr = explode('-', $value); ?>
			<li <?php if($arr[0] == $info->id) echo 'class="active"';?>>
				<a href="<?php echo $key;?>"><?php echo $arr[1];?></a>
			</li>
		<?php } ?>
		</ul>
	</div>
	<!-- end col -->
</div>
<!-- end row -->
<div id="record">
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

					<?php if($records_blocks->num_rows() > 0) { ?>
						<div class="row" id="blocks">
						<?php
							foreach ($records_blocks->result() as $records_block) { ?>
								<div class="col-md-4 text-center record-data">
									<h3> <?php echo $records_block->name;?></h3>
									<?php 
									$record_data = $this->Custom->get_all_current_custom($records_block->slug, $info->id, date('Y-m-d'));
									if(count($record_data) > 0) { 

										$custom_fields = $this->Custom_field->get_custom('records_'.$records_block->slug); ?>

												<?php foreach($record_data as $row) { ?>
													<div id="row-<?php echo $row['id'];?>">
														<?php 
														if($custom_fields->num_rows() > 0) {

											                foreach ($custom_fields->result() as $custom_field) { ?>
											                    
											                    <h1><strong id="block-<?php echo $row['id'];?>"><?php echo $row[''.$custom_field->custom_field_column.'']; ?></strong>
																<small><?php if($custom_field->custom_field_symbol != null) echo '( '.$custom_field->custom_field_symbol.' )';?></small></h1>
											                	<span class="text-muted"><?php echo date($this->config->item('dateformat'), strtotime($row['date']));?></span>
											                <?php }
											            } ?>
											            <a href="<?php echo site_url('records/delete_custom_field/'.$row['id'].'/'.$records_block->slug);?>" id="<?php echo $row['id'];?>" class="direct"><i class="far fa-trash-alt fa-lg"></i></a>
													</div>
												<?php } ?>
											
									<?php }else{?>
										<p class="text-center"> No Record Found! <br/>
											<a title="Add new" href="<?php echo site_url('records/create_custom/'.$records_block->slug.'/'.$info->id);?>" class="btn btn-success btn-xs preview">Add New</a></p>
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
				<?php if($records_tabs->num_rows() > 0) { ?>
				<ul id="widget-tab-2" class="nav nav-tabs pull-right">
				<?php 
					$i = 0;
					foreach ($records_tabs->result() as $records_tab) { ?>
						<li class="<?php if($i == 0) echo 'active';?>">
							<a data-toggle="tab" href="#record_<?php echo $records_tab->record_id;?>"> <span class="hidden-mobile hidden-tablet"> <?php echo $records_tab->name;?> </span> </a>
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
						<?php if($records_tabs->num_rows() > 0) { ?>
							<?php 
								$i = 0;
								foreach ($records_tabs->result() as $records_tab) { ?>
								<div class="tab-pane fade <?php if($i == 0) echo 'active in';?>" id="record_<?php echo $records_tab->record_id;?>">
									<?php $record_data = $this->Custom->get_all_current_custom($records_tab->slug, $info->id, date('Y-m-d'));
									if(count($record_data) > 0) { 

										$custom_fields = $this->Custom_field->get_custom('records_'.$records_tab->slug);
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
														<a title="Add new" href="<?php echo site_url('records/create_custom/'.$records_tab->slug.'/'.$info->id);?>" class="preview pull-right btn btn-success btn-xs">
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
																	<?php echo $row[''.$custom_field->custom_field_column.'']; ?>
																	<span><?php if($custom_field->custom_field_symbol != null) echo '( '.$custom_field->custom_field_symbol.' )';?></span>
																</td>
																
											                <?php }
											            } ?>
														<td class="text-right">
															<a href="<?php echo site_url('records/delete_custom_field/'.$row['id'].'/'.$records_tab->slug);?>" id="<?php echo $row['id'];?>" class="direct"><i class="far fa-trash-alt fa-lg"></i></a>
														</td>
													</tr>
												<?php } ?>
											</tbody>
										</table>
									<?php }else{?>
										<div id="empty-content">
											<h3>No <?php echo ucfirst(str_replace('_', ' ', $records_tab->slug));?> Record Found! <a title="Add new" href="<?php echo site_url('records/create_custom/'.$records_tab->slug.'/'.$info->id);?>" class="preview">Add new</a></h3>
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
				<h2>Custom Records Tabs</h2>
				<?php if($custom_records_tabs->num_rows() > 0) { ?>
				<ul id="widget-tab-2" class="nav nav-tabs pull-right">
				<?php 
					$i = 0;
					foreach ($custom_records_tabs->result() as $custom_records_tab) { ?>
						<li class="<?php if($i == 0) echo 'active';?>">
							<a data-toggle="tab" href="#record_<?php echo $custom_records_tab->record_id;?>"> <span class="hidden-mobile hidden-tablet"> <?php echo $custom_records_tab->name;?> </span> </a>
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
								foreach ($custom_records_tabs->result() as $custom_records_tab) { ?>
								<div class="tab-pane fade <?php if($i == 0) echo 'active in';?>" id="record_<?php echo $custom_records_tab->record_id;?>">
									<?php $record_data = $this->Custom->get_all_current_custom($custom_records_tab->slug, $info->id, date('Y-m-d'), $this->client_id);
									
									if(count($record_data) > 0) { 

										$custom_fields = $this->Custom_field->get_custom('records_'.$custom_records_tab->slug.'_'.$this->client_id);
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
														<a title="Add new" href="<?php echo site_url('records/create_custom/'.$custom_records_tab->slug.'_'.$this->client_id.'/'.$info->id);?>" class="preview pull-right btn btn-success btn-xs">
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
																	<?php echo $row[''.$custom_field->custom_field_column.'']; ?>
																	<span><?php if($custom_field->custom_field_symbol != null) echo '( '.$custom_field->custom_field_symbol.' )';?></span>
																</td>
																
											                <?php }
											            } ?>
														<td class="text-right">
															<a href="<?php echo site_url('records/delete_custom_field/'.$row['id'].'/'.$custom_records_tab->slug.'_'.$this->client_id);?>" id="<?php echo $row['id'];?>" class="direct"><i class="far fa-trash-alt fa-lg"></i></a>
														</td>
													</tr>
												<?php } ?>
											</tbody>
										</table>
									<?php }else{?>
										<div id="empty-content">
											<h3>No <?php echo ucfirst(str_replace('_', ' ', $custom_records_tab->slug));?> Record Found! <a title="Add new" href="<?php echo site_url('records/create_custom/'.$custom_records_tab->slug.'_'.$this->client_id.'/'.$info->id);?>" class="preview">Add new</a></h3>
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
						
						<div class="panel-group smart-accordion-default" id="accordion">
						    <div class="panel panel-default">
						        <div class="panel-heading">
						            <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#diagnoses" aria-expanded="true" class=""> <i class="fa fa-lg fa-angle-down pull-right"></i> <i class="fa fa-lg fa-angle-up pull-right"></i>Diagnoses & Condition </a></h4>
						        </div>
						        <div id="diagnoses" class="panel-collapse collapse in" aria-expanded="true">
						            <div class="panel-body">
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
						        </div>
						    </div>
						    <div class="panel panel-default">
						        <div class="panel-heading">
						            <h4 class="panel-title">
						            	<a id="prescription-link" data-toggle="collapse" data-parent="#accordion" href="#prescriptions" class="collapsed" aria-expanded="false"> <i class="fa fa-lg fa-angle-down pull-right"></i> <i class="fa fa-lg fa-angle-up pull-right"></i> Prescriptions</a>
						            </h4>
						        </div>
						        <div id="prescriptions" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
						            <div class="panel-body">
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
				<h1 class="txt-color-blueDark"><a href="<?php echo site_url('patients/details/'.$info->id);?>" class="preview"><?php echo $info->firstname.', '.$info->lastname;?></a></h1>
			</div>
			<div id="action">

					<a href="<?php echo site_url('queings/process/'.$que_info['rowid'].'/0');?>" id="move-out" class=" btn btn-danger btn-block"><i class="fa fa-sign-out fa-fw"></i> Move out to waiting list!</a>

				
			</div>
			
			
		</div>

		<div id="asides">
		<?php if($records_asides->num_rows() > 0) { 
			foreach ($records_asides->result() as $records_aside) { ?>
				<div class="asides-blocks">
					<h3> <?php echo $records_aside->name;?> <small><a title="Add new" href="<?php echo site_url('records/create_custom/'.$records_aside->slug.'/'.$info->id);?>" class="preview">Add new</a></small></h3>
					<?php 
					// $record_data = $this->Custom->get_all_custom($records_aside->slug, $info->id); 
					$record_data = $this->Custom->get_all_current_custom($records_aside->slug, $info->id, date('Y-m-d'));
					if(count($record_data) > 0) { 

						$custom_fields = $this->Custom_field->get_custom('records_'.$records_aside->slug);
							echo '<ul>';
							foreach($record_data as $row) { ?>
									<li id="row-<?php echo $row['id'];?>">
										<?php 
										if($custom_fields->num_rows() > 0) {

							                foreach ($custom_fields->result() as $custom_field) { ?>
							                    
												<?php echo $row[''.$custom_field->custom_field_column.'']; ?><span><?php if($custom_field->custom_field_symbol != null) echo '( '.$custom_field->custom_field_symbol.' )';?></span></br>
												
							                <?php }
							            } ?>
							            <a href="<?php echo site_url('records/delete_custom_field/'.$row['id'].'/'.$records_aside->slug);?>" id="<?php echo $row['id'];?>" class="direct"><i class="fas fa-times-circle fa-lg"></i></a>
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
			<a href="<?php echo site_url('records/docs/'.$info->id);?>" id="<?php echo $info->id;?>" title="Print Form" class="hidden preview btn btn-success"><i class="fa fa-print fa-fw"></i>Print</a>
		</div>
	</div>
</div>
<script type="text/javascript">

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
	var rowId = '<?php echo $que_info['rowid'];?>';
	
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
								'<td><a href="'+BASE_URL+'records/delete_custom_field/'+val.id+'/diagnoses" id="'+val.id+'" class="direct"><i class="fas fa-times-circle fa-lg"></i></a></td></tr>';	
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
	
				if (response.length === 0) {
					
					$('<div class="alert alert-info text-center empty-post">Add prescription.</div>').appendTo('#prescription-results');
					
				}else{
					var item = [];
					var xnum = 1;
					var d = new Date();
					var _date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();

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
								'<td><a href="'+BASE_URL+'records/delete_custom_field/'+v.id+'/prescription" id="'+v.id+'" class="direct"><i class="far fa-trash-alt fa-lg"></i></a></td>'+	
							'</tr>';

					});
					
					$('<table class="table" id="prescription-table"><tbody>'+item+'</tbody></table>').appendTo('#prescription-results');
					
					if ($('#prescription-table tbody tr').length) { 
						item = '<tfoot>'+
									'<tr>'+
										'<td colspan="6"><a title="Rx Preview" href="'+BASE_URL+'queings/preview/'+ rowId +'/'+_date+'/no" class="preview btn btn-success btn-sm pull-right custom-w" data-width="40" ><i class="fa fa-eye"></i> Rx Preview</a></td>'+
									'</tr>'+
								'</tfoot>';
						$(item).appendTo('#prescription-table');
					}
					
					
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
						var rec = response.records;
				
						if(response.success)
						{
							var _diagnoses = rec.diagnoses;
							if(_diagnoses.length > 150) _diagnoses = _diagnoses.substring(0,150)+'...';
							items = '<tr><td style="width:90%;" class="complaints-row group-'+rec.date+'">'+_diagnoses+'</td>'+
								'<td><a href="'+BASE_URL+'records/delete_custom_field/'+response.id+'/diagnoses" id="'+response.id+'" class="direct"><i class="fas fa-times-circle fa-lg"></i></a></td></tr>';	

							if ($('#complain-table tbody tr').length) {
								$('#complain-table tbody tr:last').after(items);
							} else {
								$('#diagnoses-results').empty();
								$('<table class="table" id="complain-table"><tbody>'+items+'</tbody></table>').appendTo('#diagnoses-results');
							}

							$(form)[0].reset();
							$('#prescription-link').trigger('click');
							mcs.init_smallBox("success", response.message);
			
						}
						else
						{
							mcs.init_smallBox("error", response.message);
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
						var rec = response.records;
						if(response.success)
						{
							var rows = $('#prescription-table tbody tr').length;
							console.log(rows);
							var xnum = rows + 1;
							items = '<tr class=" ';
							if (rec.is_mainteinable === 'yes') {
							    items += 'maintainable';
							}
							items += '">'+
								'<td class="num">'+ xnum++ +'. </td> '+
								'<td class="medicine">'+rec.medicine+'</td>'+
								'<td class="prep">'+rec.preparation+'</td> '+
								'<td class="sig">'+rec.sig+'</td>'+
								'<td class="qty"># '+rec.qty+'</td>'+
								'<td><a href="'+BASE_URL+'records/delete_custom_field/'+response.id+'/prescription" id="'+response.id+'" class="direct"><i class="far fa-trash-alt fa-lg"></i></a></td>'+	
							'</tr>';

							if ($('#prescription-table tbody tr').length) {
								$('#prescription-table tbody tr:last').after(items);
							} else {
								$('#prescription-results').empty();
								$('<table class="table" id="prescription-table"><tbody>'+items+'</tbody></table>').appendTo('#prescription-results');
							}

							if ($('#prescription-table tbody tr').length) {
								if (!$('#prescription-table tfoot').length) {  
									item = '<tfoot>'+
												'<tr>'+
													'<td colspan="6"><a title="Rx Preview" href="'+BASE_URL+'queings/preview/'+ rowId +'/'+rec.date+'/no" class="preview btn btn-success btn-sm pull-right custom-w" data-width="40"><i class="fa fa-eye"></i> Rx Preview</a></td>'+
												'</tr>'+
											'</tfoot>';
									$(item).appendTo('#prescription-table');
								}
							}

							$(form)[0].reset();

							mcs.init_smallBox("success", response.message);
							
						}
						else
						{
							mcs.init_smallBox("error", response.message);
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
		mcs.init_dialog();
		mcs.init_action();
		
		$('#move-out').click(function(e) {
			$.ajax({
				url: $(this).attr('href'),
				type: 'post',
				success: function(response) {

					var obj = JSON.parse(response);
					
					if(obj.success)
					{
						mcs.init_smallBox("success", obj.message);
						mcs.init();
				
						window.location.replace(obj.redirect);
		
					}
					else
					{
						mcs.init_smallBox("error", obj.message);
					} 
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
