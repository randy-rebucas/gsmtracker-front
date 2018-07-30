<style>
#tbl-records label.checkbox {
    text-align: left;
}
</style>
<?php echo form_open('roles/doSave/'.$info->role_id,'class="smart-form" id="role-form"');?>
   
	
	<legend>Information</legend>

		<section>
			<label for="role_name">Name</label>
			<label class="input">
				<input type="text" name="role_name" id="role_name" value="<?php echo set_value('role_name', $info->role_name);?>" placeholder="Name" tabindex="1">
				
			</label>
		</section>
			
		<section>
			<label for="address">Description</label>
			<label class="textarea">
				<textarea name="role_desc" class="custom-scroll" id="role_desc" placeholder="Description" tabindex="2"><?php echo set_value('role_desc', $info->role_desc);?></textarea>
			</label>	
		</section>
		<section>
			<label class="checkbox">
				<input type="checkbox" name="role_status" value="1" <?php if($info->role_status == 1) echo 'checked';?>>
				<i></i>Enable
			</label>
		</section>

	<legend>Module</legend>
		<section>
			<table class="table">
				<thead>
					<tr>
						<th colspan="5">
							Sections
						</th>
					</tr>
				</thead>
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
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $val;?>-view" <?php if($this->Role->has_permission($val, $info->role_id, 'view', $this->client_id)) echo 'checked';?>>
									<i></i>View
								</label>
							</td>
							<td style="width:15%">
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $val;?>-create" <?php if($this->Role->has_permission($val, $info->role_id, 'create', $this->client_id)) echo 'checked';?>>
									<i></i>Create
								</label>
							</td>
							<td style="width:15%">
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $val;?>-delete" <?php if($this->Role->has_permission($val, $info->role_id, 'delete', $this->client_id)) echo 'checked';?>>
									<i></i>Delete
								</label>
							</td>
							<td style="width:15%">
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $val;?>-update" <?php if($this->Role->has_permission($val, $info->role_id, 'update', $this->client_id)) echo 'checked';?>>
									<i></i>Update
								</label>
							</td>
						</tr>
					<?php } ?>
					
				</tbody>
			</table>
		</section>
		
		
		<section>
		<legend>Records</legend>
			
			<table class="table" id="tbl-records">
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
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $row->slug.'-view';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'view', $this->client_id)) echo 'checked';?>>
									<i></i>View
								</label>
							</td>
							<td style="width:15%">
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $row->slug.'-create';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'create', $this->client_id)) echo 'checked';?>>
									<i></i>Create
								</label>
							</td>
							<td style="width:15%">
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $row->slug.'-delete';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'delete', $this->client_id)) echo 'checked';?>>
									<i></i>Delete
								</label>
							</td>
							<td style="width:15%">
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $row->slug.'-update';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'update', $this->client_id)) echo 'checked';?>>
									<i></i>Update
								</label>
							</td>
						</tr>
					<?php } ?>
				</tbody>
			</table>
		
			<table class="table" id="tbl-records">
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
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $row->slug.'-view';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'view', $this->client_id)) echo 'checked';?>>
									<i></i>View
								</label>
							</td>
							<td style="width:15%">
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $row->slug.'-create';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'create', $this->client_id)) echo 'checked';?>>
									<i></i>Create
								</label>
							</td>
							<td style="width:15%">
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $row->slug.'-delete';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'delete', $this->client_id)) echo 'checked';?>>
									<i></i>Delete
								</label>
							</td>
							<td style="width:15%">
								<label class="checkbox">
									<input type="checkbox" name="module[]" value="<?php echo $row->slug.'-update';?>" <?php if($this->Role->has_permission($row->slug, $info->role_id, 'update', $this->client_id)) echo 'checked';?>>
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
				
		</section>
		<section class="hidden">
			<legend>Reports</legend>	
		</section>
		

	<button type="submit" id="submit" class="btn btn-primary btn-sm">Submit</button>
	
</form>
  
<script type="text/javascript">

    runAllForms();
	
    var validatefunction = function() {

        $("#role-form").validate({
            // Rules for form validation
            rules : {
                role_name : {
                    required : true,
                    maxlength: 30
                },
                role_desc : {
                    required : true,
                    maxlength: 500
                }
            },

            // Messages for form validation
            messages : {
                role_name : {
                    required : '<i class="fa fa-times-circle"></i> Please add role name',
                    maxlength: '<i class="fa fa-times-circle"></i> The role name can not exceed 30 characters in length.'
                },
                role_desc : {
                    required : '<i class="fa fa-times-circle"></i> Please add description',
                    maxlength: '<i class="fa fa-times-circle"></i> The description can not exceed 500 characters in length.'
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
                        $('#submit').html('Please wait...');
                        $('#submit').attr("disabled", "disabled");
                    },
                    success:function(response)
                    {
                        if(response)
                        {
                             mcs.init_smallBox("Success", response.message);
                            $('.bootbox-close-button').trigger('click');
                            checkURL();
                        }
                        else
                        {
                             mcs.init_smallBox("Error", response.message);
                        }                   
                        $('#submit').text('Submit');
                        $('#submit').removeAttr("disabled");
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