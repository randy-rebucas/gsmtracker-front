<?php
if(isset($custom_fields)) {
echo form_open('records/save_custom_record/-1/'.$type,array('id'=>'record_form', 'class'=>'form-horizontal', 'role'=>'form')); ?>
	<input type="hidden" name="user_id" value="<?php echo $user_id;?>"/>

	<fieldset>
		<div class="form-body">
		<?php

			foreach ($custom_fields as $custom_field) { 

				switch ($custom_field->custom_field_type) {
					case "area": ?>
						<div class="form-group">
							<label class="col-md-3 control-label custom_field_label"><?php echo $custom_field->custom_field_label; ?></label>
							<div class="col-md-9">
								<textarea name="custom[<?php echo $custom_field->custom_field_column; ?>]" class="form-control <?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>" id="<?php echo $custom_field->custom_field_column; ?>"></textarea>
							</div>
						</div>
					<?php break;
						case "dropdown": ?>
						<div class="form-group">
							<label class="col-md-3 control-label custom_field_label"><?php echo $custom_field->custom_field_label; ?></label>
							<div class="col-md-9">
								<select name="custom[<?php echo $custom_field->custom_field_column; ?>]" id="<?php echo $custom_field->custom_field_column; ?>" class="form-control <?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>">
									<option value="">Select</option>
									<?php 
									$options = $this->Custom_field->get_all_option($custom_field->custom_field_table, $custom_field->custom_field_column)->result_array();
									foreach($options as $option) { ?>
										<option value="<?php echo $option['custom_option_name'];?>"><?php echo $option['custom_option_name'];?></option>
									<?php } ?>
								</select>
							</div>
						</div>
					<?php break;
						case "radiobox": ?>
						<div class="form-group">
							<?php 
							$options = $this->Custom_field->get_all_option($custom_field->custom_field_table, $custom_field->custom_field_column)->result_array();
							foreach($options as $option) { ?>
							<label class="radio">
								<input type="radio" class="<?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>" name="custom[<?php echo $custom_field->custom_field_column; ?>]" value="<?php echo $option['custom_option_name'];?>">
								<i></i><?php echo $option['custom_option_name'];?>
							</label>
							<?php } ?>
						</div>
					<?php break;
						case "checkbox": ?>
						<div class="form-group">
							<?php 
							$options = $this->Custom_field->get_all_option($custom_field->custom_field_table, $custom_field->custom_field_column)->result_array();
							foreach($options as $option) { ?>
							<label class="checkbox">
								<input type="checkbox" class="<?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>" name="custom[<?php echo $custom_field->custom_field_column; ?>]" value="<?php echo $option['custom_option_name'];?>">
								<i></i><?php echo $option['custom_option_name'];?>
							</label>
							<?php } ?>
						</div>
					<?php break;
						case "file": ?>
						<div class="form-group">
							<label class="col-md-3 control-label custom_field_label"><?php echo $custom_field->custom_field_label; ?></label>
							<div class="col-md-9 input input-file">
								<span class="button"><input type="file" name="custom_files" class="<?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>" multiple id="<?php echo $custom_field->custom_field_column; ?>" onchange="this.parentNode.nextSibling.value = this.value">Browse</span><input type="text" readonly="">
							</div>
						</div>
					<?php break;
						case "date": ?>
						<div class="form-group">
							<label class="col-md-3 control-label custom_field_label"><?php echo $custom_field->custom_field_label; ?></label>
							<div class="col-md-9">
								<i class="icon-append fa fa-calendar"></i>
								<input type="text" name="custom[<?php echo $custom_field->custom_field_column; ?>]" id="<?php echo $custom_field->custom_field_column; ?>" class="datepicker <?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>" value="" data-dateformat="dd/mm/yy" aria-invalid="false">
							</div>
						</div>
					<?php break;
						default: //field ?>
						<div class="form-group">
							<label class="col-md-3 control-label custom_field_label"><?php echo $custom_field->custom_field_label; ?></label>
							<div class="col-md-9">
								<input type="text" class="form-control <?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>" name="custom[<?php echo $custom_field->custom_field_column; ?>]" id="<?php echo $custom_field->custom_field_column; ?>" value="">
							</div>
						</div>
				<?php }
				
			}
		?>
		</div>
		<button type="submit" id="submit" class="btn btn-primary btn-sm">Submit</button>
	</fieldset>
</form>
<?php }else{
	echo 'No Custom Field Set!';
} ?>				
<script type='text/javascript'>
	
	$(document).ready(function()
	{
		runAllForms();

		var validatefunction = function() {

			$('#record_form').validate({
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
								mcs.init_smallBox("success", response.message);
								$('.close').trigger('click');
								checkURL(); 
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
	});
	
</script>
