<style>
.popover {
    padding: 10px;
}
</style>
<?php echo form_open_multipart('patients/doSave/'.$info->id,'class="smart-form" id="members-form"');?>
   

	<?php $this->load->view('include/common_form_ints');?>
	<fieldset>

		<section>
			<input type="checkbox" name="show_advance_form_input" id="show_advance_form_input" value="1" <?php if($option == 1) echo 'checked';?>>	
			<?php echo $this->lang->line('config_show_advance_form_input'); ?>
			<span id="show_advance_form_input_loader" class="pull-right"></span>
		</section>
	</fieldset>
	<fieldset class="advance">
		<legend>Custom Fields</legend>
	<?php
	if(isset($custom_fields)) {

		foreach ($custom_fields as $custom_field) { 
			
			switch ($custom_field->custom_field_type) {
				case "area": ?>
					<section>
						<label for="custom_field_label"><?php echo $custom_field->custom_field_label; ?></label>
						<label class="textarea">
							<textarea name="custom[<?php echo $custom_field->custom_field_column; ?>]" class="custom-scroll <?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>" id="<?php echo $custom_field->custom_field_column; ?>"></textarea>
						</label>
					</section>
				<?php break;
					case "dropdown": ?>
					<section>
						<label for="custom_field_label"><?php echo $custom_field->custom_field_label; ?></label>
						<label class="select">
							<select name="custom[<?php echo $custom_field->custom_field_column; ?>]" id="<?php echo $custom_field->custom_field_column; ?>" class="<?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>">
								<option value="">Select</option>
								<?php 
								$options = $this->Custom_field->get_all_option($custom_field->custom_field_table, $custom_field->custom_field_column)->result_array();
								foreach($options as $option) { ?>
									<option value="<?php echo $option['custom_option_name'];?>"><?php echo $option['custom_option_name'];?></option>
								<?php } ?>
							</select>
							<i></i>
						</label>
					</section>
				<?php break;
					case "radiobox": ?>
					<section>
						<?php 
						$options = $this->Custom_field->get_all_option($custom_field->custom_field_table, $custom_field->custom_field_column)->result_array();
						foreach($options as $option) { ?>
						<label class="radio">
							<input type="radio" name="custom[<?php echo $custom_field->custom_field_column; ?>]" value="<?php echo $option['custom_option_name'];?>" class="<?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>">
							<i></i><?php echo $option['custom_option_name'];?>
						</label>
						<?php } ?>
					</section>
				<?php break;
					case "checkbox": ?>
					<section>
						<?php 
						$options = $this->Custom_field->get_all_option($custom_field->custom_field_table, $custom_field->custom_field_column)->result_array();
						foreach($options as $option) { ?>
						<label class="checkbox">
							<input type="checkbox" name="custom[<?php echo $custom_field->custom_field_column; ?>]" value="<?php echo $option['custom_option_name'];?>" class="<?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>">
							<i></i><?php echo $option['custom_option_name'];?>
						</label>
						<?php } ?>
					</section>
				<?php break;
					case "file": ?>
					<section>
						<label class="label"><?php echo $custom_field->custom_field_label; ?></label>
						<div class="input input-file">
							<span class="button"><input type="file" class="<?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>" name="custom_files" multiple id="<?php echo $custom_field->custom_field_column; ?>" onchange="this.parentNode.nextSibling.value = this.value">Browse</span><input type="text" readonly="">
						</div>
					</section>
				<?php break;
					case "date": ?>
					<section>
						<label for="custom_field_label"><?php echo $custom_field->custom_field_label; ?></label>
						<label class="input">
							<i class="icon-append fa fa-calendar"></i>
							<input type="text" name="custom[<?php echo $custom_field->custom_field_column; ?>]" id="<?php echo $custom_field->custom_field_column; ?>" class="datepicker <?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>" value="" data-dateformat="dd/mm/yy" aria-invalid="false">
						</label>
					</section>
				<?php break;
					default: //field ?>
					<section>
						<label for="custom_field_label"><?php echo $custom_field->custom_field_label; ?></label>
						<label class="input">
							<input type="text" name="custom[<?php echo $custom_field->custom_field_column; ?>]" id="<?php echo $custom_field->custom_field_column; ?>" class="<?php if($custom_field->custom_field_is_required == 1) echo 'is_required';?>" value="<?php //echo form_prep($this->mdl_users->form_value('custom[' . $custom_field->custom_field_column . ']')); ?>">
						</label>
					</section>
			<?php }
			
		}
	}else{
		echo 'No Custom Field Set!';
	}		
	?>
	</fieldset>
	
	<fieldset> 


		<button type="submit" name="submit" id="submit" class="btn btn-primary btn-sm"><?php echo $this->lang->line('__common_submit');?></button>
		
		<button type="button" id="cancel" class="btn btn-warning btn-sm" data-dismiss="modal"><?php echo $this->lang->line('__common_cancel');?></button>
	</fieldset>
</form>
  
<script type="text/javascript">

	var country = '<?php echo $info->country;?>';
	var state = '<?php echo $info->state;?>';
	var city = '<?php echo $info->city;?>';

	mcs.init_location(country, city, state);
	
    pageSetUp();

    runAllForms();

	$('.bootbox-close-button, #cancel').on("click", function(){
		$('body').find('.create').attr('disabled', false);
	});

	if($("#show_advance_form_input").is(':checked')){
		$('.advance').show();
	} else {
		$('.advance').hide();
	}

	var check;
	var option;
	$("#show_advance_form_input").on("click", function(){
		check = $(this).is(":checked");
		if(check) {
			_option = 1;
		} else {
			_option = 0;
		}
		$.ajax({
			url: BASE_URL+'auth/switch_advance/'+_option,
			beforeSend: function () {
				$('#show_advance_form_input_loader').html('<i class="fa fa-spin fa-spinner"></i>');
			},
			success: function (response)
			{
				if(check) {
					$('.advance').show();
				} else {
					$('.advance').hide();
				}
				$('#show_advance_form_input_loader').html('');
			}
		}); 
	});

    var validatefunction = function() {

        $("#members-form").validate({
            // Rules for form validation
            rules : {
                first_name : {
                    required : true,
                    maxlength: 50
                },
                mi : {
                    required : true,
                    maxlength: 1
                },
                last_name : {
                    required : true,
                    maxlength: 50
                },
                mobile : {
                    required : true
                },
                gender : {
                    required : true
                },
				year : {
                    required : true
                },
				month : {
                    required : true
                },
				day : {
                    required : true
                },
				country : {
                    required : true
                },
				state : {
                    required : true
                },
				city : {
                    required : true
                },
				zip : {
                    required : true,
					maxlength : 6
                },
                address : {
                    required : true,
                    maxlength : 250
                }
            },

            // Messages for form validation
            messages : {
                first_name : {
                    required : '<i class="fa fa-times-circle"></i> Please add your first name',
                    maxlength: '<i class="fa fa-times-circle"></i> The first name can not exceed 50 characters in length.'
                },
                mi : {
                    required : '<i class="fa fa-times-circle"></i> Please add your middle initial',
                    maxlength: '<i class="fa fa-times-circle"></i> The middle initial can not exceed 1 characters in length.'
                },
                last_name : {
                    required : '<i class="fa fa-times-circle"></i> Please add your last name',
                    maxlength: '<i class="fa fa-times-circle"></i> The last name can not exceed 50 characters in length.'
                },
                mobile : {
                    required : '<i class="fa fa-times-circle"></i> Please add your country'
                },
                gender : {
                    required : '<i class="fa fa-times-circle"></i> Please select your gender'
                },
				year : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'year');?>'
                },
				month : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'month');?>'
                },
				day : {
                    required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'day');?>'
                },
				country : {
                    required : '<i class="fa fa-times-circle"></i> Please select a country'
                },
				state : {
                    required : '<i class="fa fa-times-circle"></i> Please select a state'
                },
				city : {
                    required : '<i class="fa fa-times-circle"></i> Please select a city'
                },
				zip : {
                    required : '<i class="fa fa-times-circle"></i> Please add your zip code',
                    maxlength: '<i class="fa fa-times-circle"></i> The zip code can not exceed 6 characters in length.'
                },
                address : {
                    required : '<i class="fa fa-times-circle"></i> Please add your address',
                    maxlength: '<i class="fa fa-times-circle"></i> The address can not exceed 250 characters in length.'
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

                        $('body').find('.create').attr('disabled', false);
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
	
	
	loadScript(BASE_URL+"js/plugin/x-editable/moment.min.js", loadMockJax);

	function loadMockJax() {
		loadScript(BASE_URL+"js/plugin/x-editable/jquery.mockjax.min.js", loadXeditable);
	}

	function loadXeditable() {
		loadScript(BASE_URL+"js/plugin/x-editable/x-editable.min.js", loadTypeHead);
	}

	function loadTypeHead() {
		loadScript(BASE_URL+"js/plugin/typeahead/typeahead.min.js", loadTypeaheadjs);
	}

	function loadTypeaheadjs() {
		loadScript(BASE_URL+"js/plugin/typeahead/typeaheadjs.min.js", runXEditDemo);
	}

	function runXEditDemo() {

		/*
		 * X-EDITABLES
		 */

		//defaults
		$.fn.editable.defaults.url = '/post';
		//$.fn.editable.defaults.mode = 'inline'; use this to edit inline

		$('.xeditable_text').each(function () {
			var obj = $(this);
			var type = obj.attr('data-name');
			obj.editable({
				emptytext: '--',
				validate: function (value) {
					if ($.trim(value) == '')
						return type+' field is required';
				},
				success: function(response) {
					console.log(response);
				} ,
				params: function(params) {  //params already contain `name`, `value` and `pk`
					var data = {};
					data['pk'] = params.pk;
					data['name'] = params.name;
					data['value'] = params.value;
					data['table'] = $(this).attr('data-table');
					return data;
					
				} 
			});
			
		});
		
		$('.xeditable_textarea').each(function () {
			var obj = $(this);
			var type = obj.attr('data-name');
			obj.editable({
				emptytext: '--',
				validate: function (value) {
					if ($.trim(value) == '')
						return type+' field is required';
				},
				success: function(response) {
					console.log(response);
				} ,
				params: function(params) {  //params already contain `name`, `value` and `pk`
					var data = {};
					data['pk'] = params.pk;
					data['name'] = params.name;
					data['value'] = params.value;
					data['table'] = $(this).attr('data-table');
					return data;
					
				} 
			});
			
		});
		
		$('.xeditable_select').each(function () {
			var obj = $(this);
			var type = obj.attr('data-name');
			var val = obj.attr('data-value');
			var source_data = [];
			if(type === 'country'){
				source_data = '<?php echo json_encode($this->location_lib->populate_countries()->result_array(), JSON_HEX_APOS);?>';
			}else if(type === 'state'){
				source_data = '<?php echo json_encode($this->location_lib->populate_states($info->country)->result_array(), JSON_HEX_APOS);?>';
			}else if(type === 'city') {
				source_data = '<?php echo json_encode($this->location_lib->populate_cities($info->state)->result_array(), JSON_HEX_APOS);?>';
			}else{
				source_data = [{value: 1,text: 'Male'}, {value: 2,text: 'Female'}]
			}

			obj.editable({
				source: source_data,
				validate: function (value) {
					if ($.trim(value) == '')
						return type+' field is required';
				},
				value: val,
				emptytext: '--',
				params: function(params) {  //params already contain `name`, `value` and `pk`
					var data = {};
					data['pk'] = params.pk;
					data['name'] = params.name;
					data['value'] = params.value;
					data['table'] = $(this).attr('data-table');
					return data;
				},
				success: function(response) {
					console.log(response);
					//checkURL();
					$('.editable-buttons').find('.editable-submit').html('<i class="fa fa-ok"></i>');
				}
			});
			
		});

		
	}
	
	var pagedestroy = function(){
		
		
		// debug msg
		if (debugState){
			root.console.log("✔  destroyed");
		} 


	}
</script>