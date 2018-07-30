<style>
.smart-form>tbody>tr>td, 
.smart-form>tbody>tr>th, 
.smart-form>tfoot>tr>td, 
.smart-form>tfoot>tr>th, 
.smart-form>thead>tr>td, 
.smart-form>thead>tr>th {
    
}
</style>
<div class="row">	
	<div class="col-md-12">	
	<fieldset>
		<legend>Information</legend>
        <dl class="dl-horizontal">
            <dt>Role</dt>
            <dd><?php echo $info->role_name;?></dd>

            <dt>Description</dt>
            <dd><?php echo ($info->role_desc) ? $info->role_desc : '--';?></dd>

            <dt>Status</dt>
            <dd><?php echo ($info->role_status == 1) ? 'Enabled' : 'Diabled';?></dd>
        </dl>

	</fieldset>

	<fieldset>	
		<legend>Module access</legend>
	
			<?php 
			
			if($info->role_id == $this->admin_role_id){
				
				echo 'Can access all.';	

			}else if($info->role_id == $this->patient_role_id){

				echo 'Can access patient module only.';	

			}else{ ?>
				<table class="table smart-form">
					<tr>
						<thead>
							<th colspan="5">Sections</th>
						</thead>
					</tr>
					<tbody>
					<?php
						$array = array(
							'patients'		=>'Patients',
							'users'			=>'Users',
							'roles'			=>'Roles',
							'templates'		=>'Templates',
							'records'		=>'Records',
							'reports'		=>'Reports',
							'appointments'	=>'Appointments',
							'settings'		=>'Settings'
						);
						foreach($array as $val => $label) { ?>
							<tr>
								<td style="width:40%"><?php echo $label;?></td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $val;?>-view" <?php if($this->Role->has_permission($val, $info->role_id, 'view', $this->client_id)) echo 'checked';?>>
										<i></i>View
									</label>
								</td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $val;?>-create" <?php if($this->Role->has_permission($val, $info->role_id, 'create', $this->client_id)) echo 'checked';?>>
										<i></i>Create
									</label>
								</td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $val;?>-delete" <?php if($this->Role->has_permission($val, $info->role_id, 'delete', $this->client_id)) echo 'checked';?>>
										<i></i>Delete
									</label>
								</td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $val;?>-update" <?php if($this->Role->has_permission($val, $info->role_id, 'update', $this->client_id)) echo 'checked';?>>
										<i></i>Update
									</label>
								</td>
							</tr>
						<?php } ?>
						
					</tbody>
				</table>

				<table class="table smart-form" id="tbl-records">
					<thead>
						<tr>
							<th colspan="5">
								Default
							</th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ($this->Record->get_all()->result() as $row) { ?>
							<tr>
								<td style="width:40%"><?php echo $row->name;?></td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $row->slug.'-view';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'view', $this->client_id)) echo 'checked';?>>
										<i></i>View
									</label>
								</td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $row->slug.'-create';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'create', $this->client_id)) echo 'checked';?>>
										<i></i>Create
									</label>
								</td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $row->slug.'-delete';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'delete', $this->client_id)) echo 'checked';?>>
										<i></i>Delete
									</label>
								</td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $row->slug.'-update';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'update', $this->client_id)) echo 'checked';?>>
										<i></i>Update
									</label>
								</td>
							</tr>
						<?php } ?>
					</tbody>
				</table>
			
				<table class="table smart-form" id="tbl-records">
					<thead>
						<tr>
							<th colspan="5">
								Custom
							</th>
						</tr>
					</thead>
					<tbody>
						<?php 
						if($this->Custom->get_all($this->client_id)->num_rows() > 0) {
						foreach ($this->Custom->get_all($this->client_id)->result() as $row) { ?>
							<tr>
								<td style="width:40%"><?php echo $row->name;?></td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $row->slug.'-view';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'view', $this->client_id)) echo 'checked';?>>
										<i></i>View
									</label>
								</td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $row->slug.'-create';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'create', $this->client_id)) echo 'checked';?>>
										<i></i>Create
									</label>
								</td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $row->slug.'-delete';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'delete', $this->client_id)) echo 'checked';?>>
										<i></i>Delete
									</label>
								</td>
								<td style="width:15%">
									<label class="checkbox state-disabled">
										<input type="checkbox" name="module[]" disabled="disabled" value="<?php echo $row->slug.'-update';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'update', $this->client_id)) echo 'checked';?>>
										<i></i>Update
									</label>
								</td>
							</tr>
						<?php }} else { ?>
							<tr>
								<td colspan="5">No Custom Record!</td>
							</tr>
						<?php } ?>
					</tbody>
				</table>

			<?php } ?>
		</fieldset>
	</div>
	
</div>
<script type="text/javascript">
    
	runAllForms();
    
</script>