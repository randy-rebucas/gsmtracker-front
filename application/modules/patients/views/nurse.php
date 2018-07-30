<div class="row hidden" id="details-bottom">
	<div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
	
	</div>
	<div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
		<dl class="dl-horizontal">
			<dt>Family Histories :</dt>
			<dd>
			<?php $family_history = $this->Record->get_xeditval('family_history', $info->id); 
			if(($this->admin_role_id != $this->role_id) ? $this->Module->has_permission('familyhistory', $this->role_id, 'view',   $this->license_id) : true) { ?>
				<a href="#" class="editable_textarea" rel="tooltip" data-placement="top" data-original-title="Add family history"  data-url="<?php echo site_url('records/save/-1/family_history/');?>" data-type="textarea" data-pk="<?php echo ($family_history->id) ? $family_history->id : 0;?>" data-value="<?php echo ($family_history->family_history) ? $family_history->family_history : '';?>" data-name="family_history" id="<?php echo $info->id;?>" data-original-title="Enter family history"></a>
			<?php }else{
				echo ($family_history->family_history) ? $family_history->family_history : '--';
			}?>
			</dd>
			<dt>Allergies :</dt>
			<dd>
			<?php $allergies = $this->Record->get_xeditval('allergies', $info->id); 
			if(($this->admin_role_id != $this->role_id) ? $this->Module->has_permission('allergies', $this->role_id, 'view',   $this->license_id) : true) { ?>
				<a href="#" class="editable_textarea" rel="tooltip" data-placement="top" data-original-title="Add allergies"  data-url="<?php echo site_url('records/save/-1/allergies/');?>" data-type="textarea" data-placeholder="Enter alergies here..." data-pk="<?php echo ($allergies->id) ? $allergies->id : 0;?>" data-original-title="Enter Allergies" data-value="<?php echo ($allergies->allergies) ? $allergies->allergies : '';?>" data-name="allergies" id="<?php echo $info->id;?>" data-original-title="Enter allergies"></a>
			<?php }else{
				echo ($allergies->allergies) ? $allergies->allergies : '--';
			}?>
			</dd>
			<dt>Endorsement :</dt>
			<dd>
			<?php $endorsement = $this->Record->get_xeditval('endorsement', $info->id); 
			if(($this->admin_role_id != $this->role_id) ? $this->Module->has_permission('endorsement', $this->role_id, 'view',   $this->license_id) : true) { ?>
				<a href="#" class="editable_textarea" rel="tooltip" data-placement="top" data-original-title="Add endorsement"  data-url="<?php echo site_url('records/save/-1/endorsement/');?>" data-type="textarea" data-placeholder="Enter endorsement here..." data-pk="<?php echo ($endorsement->id) ? $endorsement->id : 0;?>" data-original-title="Enter endorsement" data-value="<?php echo ($endorsement->endorsement) ? $endorsement->endorsement : '';?>" data-name="endorsement" id="<?php echo $info->id;?>" data-original-title="Enter endorsement"></a>
			<?php }else{
				echo ($endorsement->endorsement) ? $endorsement->endorsement : '';
			}?>
			</dd>
			
		</dl>
			
	</div>
	<div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
		<dl class="dl-horizontal">
			
			<dt>Next Visit :</dt>
			<dd>
			<?php $next_visit = $this->Record->get_xeditval('next_visit', $info->id, date('Y-m-d')); 
			if(($this->admin_role_id != $this->role_id) ? $this->Module->has_permission('nextvisit', $this->role_id, 'view',   $this->license_id) : true) { ?>
				<a href="#" class="editable_date" rel="tooltip" data-placement="top" data-original-title="Add next visit"  data-url="<?php echo site_url('records/save/-1/next_visit/');?>" data-viewformat="yyyy-mm-dd" data-original-title="When you want schedule the next visit?" data-type="date" data-value="<?php echo ($next_visit->next_visit) ? $next_visit->next_visit : '';?>" data-pk="<?php echo ($next_visit->id) ? $next_visit->id : 0;?>" data-name="next_visit" id="<?php echo $info->id;?>" data-original-title="Enter next visit"></a>
			<?php }else{
				echo ($next_visit->next_visit) ? $next_visit->next_visit : '--';
			}?>
			</dd>
			
		</dl>

	</div>
</div>
<!--
The ID "widget-grid" will start to initialize all widgets below
You do not need to use widgets if you dont want to. Simply remove
the <section></section> and you can use wells or panels instead
-->
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
		<h2>Doctors Access </h2>
		<ul id="widget-tab-1" class="nav nav-tabs pull-right">
			<?php if($records->num_rows() > 0) { ?>
				<ul id="widget-tab-1" class="nav nav-tabs pull-right">
				<?php 
					$i = 0;
					foreach ($records->result() as $record) { ?>
						<li class="<?php if($i == 0) echo 'active';?>">
							<a data-toggle="tab" href="#record_<?php echo $record->record_id;?>"> <span class="hidden-mobile hidden-tablet"> <?php echo $record->name;?> </span> </a>
						</li>
				<?php $i++; } ?>
				</ul>
			<?php } ?>
			<!-- <li>
				<a data-toggle="tab" href="#hr1"> <span class="hidden-mobile hidden-tablet"> Complaint </span> </a>
			</li>

			<li>
				<a data-toggle="tab" href="#hr3"> <span class="hidden-mobile hidden-tablet"> Endorsement </span></a>
			</li>
			<li>
				<a data-toggle="tab" href="#hr4"> <span class="hidden-mobile hidden-tablet"> Family Histories </span></a>
			</li>
			<li>
				<a data-toggle="tab" href="#hr5"> <span class="hidden-mobile hidden-tablet"> Allergies </span></a>
			</li> -->

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
			<div class="tab-content padding-10">
				<div class="tab-pane fade active in" id="hr1">
					<div id="complaints"><div id="empty-block-condition" class="text-center"><i class="fa fa-plus fa-2x"></i> <span>Add Complaint</span></div></div>

					<div class="hidden tab-content" id="record">
						
						<div id="empty-content">
							<i class="fa fa-spin fa-spinner fa-5x"></i>
							<h1>Loading...</h1>
						</div>

					</div>
				</div>
				<div class="tab-pane fade" id="hr2">
					
						
					
					<form id="dpz" action="<?php echo site_url('records/save/-1/files'); ?>" class="hidden dropzone needsclick dz-clickable">
						<input type="hidden" name="user_id" id="user_id" value="<?php echo $info->id;?>"/>
						<div class="dz-message needsclick">
							Drop files here or click to upload.<br>
							<!-- <span class="note needsclick">()</span> -->
						  </div>
					</form>
				</div>
				<div class="tab-pane fade" id="hr3">
					
					<?php 
					$endorsemet = $this->Record->get_all_data('endorsement', $info->id);
					if(count($endorsemet) > 0) { ?>
						<table class="table">
							<thead>
								<tr>
									<th><p><?php echo ucfirst('endorsement');?></p></th>
									<th>
										<a title="Add new" href="<?php echo site_url('records/create/endorsement/'.$info->id);?>" class="bootbox pull-right btn btn-success btn-xs">
											<i class="fa fa-plus"></i> <?php echo $this->lang->line('common_add_new');?>
										</a>
									</th>
								</tr>
							</thead>
							<tbody>
								<?php foreach($endorsemet as $row) { ?>
									<tr id="row-<?php echo $row['id'];?>">
										<td>
											<strong id="history-<?php echo $row['id'];?>"><?php echo $row['endorsement'] ;?></strong></br>
											<span class="text-muted"><?php echo date($this->config->item('dateformat'), strtotime($row['date']));?></span>
											
										</td>
										<td class="text-right">
											<a href="<?php echo site_url('records/delete/'.$row['id'].'/endorsement');?>" id="<?php echo $row['id'];?>" class="delete_record btn btn-danger btn-xs"><i class="fa fa-trash-o"></i></a>
										</td>
									</tr>
								<?php } ?>
							</tbody>
						</table>
					<?php }else{?>
					<div id="empty-content">
							<i class="fa fa-list fa-5x"></i> 
							<h1>No <?php echo ucfirst(str_replace('_', ' ', 'endorsement'));?> found! <a title="Add new" href="<?php echo site_url('records/create/endorsement/'.$info->id);?>" class="bootbox">
											Create new
										</a></h1>
						</div>
					<?php } ?>				
				</div>
				<div class="tab-pane fade" id="hr4">
					<?php 
					$fh = $this->Record->get_all_data('family_history', $info->id);
					if(count($fh) > 0) { ?>
					<table class="table">
						<thead>
							<tr>
								<th><p><?php echo ucfirst(str_replace('_', ' ', 'family_history'));?></p></th>
								<th>
									<a title="Add new <?php echo strtolower(str_replace('_', ' ', 'family_history'));?>" href="<?php echo site_url('records/create/family_history/'.$info->id);?>" class="bootbox pull-right btn btn-success btn-xs">
										<i class="fa fa-plus"></i> <?php echo $this->lang->line('common_add_new');?>
									</a>
								</th>
							</tr>
						</thead>
						<tbody>
							<?php foreach($fh as $row) { ?>
								<tr id="row-<?php echo $row['id'];?>">
									<td>
										<strong id="history-<?php echo $row['id'];?>"><?php echo $row['family_history'] ;?></strong></br>
										<span class="text-muted"><?php echo date($this->config->item('dateformat'), strtotime($row['date']));?></span>
										
									</td>
									<td class="text-right">
										<a href="<?php echo site_url('records/delete/'.$row['id'].'/family_history');?>" id="<?php echo $row['id'];?>" class="delete_record btn btn-danger btn-xs"><i class="fa fa-trash-o"></i></a>
									</td>
								</tr>
							<?php } ?>
						</tbody>
					</table>
				<?php }else{?>
				<div id="empty-content">
						<i class="fa fa-list fa-5x"></i> 
						<h1>No <?php echo ucfirst(str_replace('_', ' ', 'family_history'));?> found! <a title="Add new" href="<?php echo site_url('records/create/family_history/'.$info->id);?>" class="bootbox">
										Create new
									</a></h1>
					</div>
				<?php } ?>		
				</div>
				<div class="tab-pane fade" id="hr5">
					<?php 
					$allergies = $this->Record->get_all_data('allergies', $info->id);
					if(count($allergies) > 0) { ?>
						<table class="table">
							<thead>
								<tr>
									<th><p><?php echo ucfirst('allergies');?></p></th>
									<th>
										<a title="Add new" href="<?php echo site_url('records/create/allergies/'.$info->id);?>" class="bootbox pull-right btn btn-success btn-xs">
											<i class="fa fa-plus"></i> <?php echo $this->lang->line('common_add_new');?>
										</a>
									</th>
								</tr>
							</thead>
							<tbody>
								<?php foreach($allergies as $row) { ?>
									<tr id="row-<?php echo $row['id'];?>">
										<td>
											<strong id="history-<?php echo $row['id'];?>"><?php echo $row['allergies'] ;?></strong></br>
											<span class="text-muted"><?php echo date($this->config->item('dateformat'), strtotime($row['date']));?></span>
											
										</td>
										<td class="text-right">
											<a href="<?php echo site_url('records/delete/'.$row['id'].'/allergies');?>" id="<?php echo $row['id'];?>" class="delete_record btn btn-danger btn-xs"><i class="fa fa-trash-o"></i></a>
										</td>
									</tr>
								<?php } ?>
							</tbody>
						</table>
					<?php }else{?>
					<div id="empty-content">
							<i class="fa fa-list fa-5x"></i> 
							<h1>No <?php echo ucfirst(str_replace('_', ' ', 'allergies'));?> found! <a title="Add new" href="<?php echo site_url('records/create/allergies/'.$info->id);?>" class="bootbox">
											Create new
										</a></h1>
						</div>
					<?php } ?>
				</div>
				<div class="tab-pane fade" id="hr6">
					
				</div>
			</div>
		</div>
		<!-- end widget content -->

	</div>
	<!-- end widget div -->

</div>