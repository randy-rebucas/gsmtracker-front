<style>
td input.form-control {
    padding: 0 .5em;
}
#select-option .table>thead>tr>th:last-child {
    text-align: left;
}
</style>
<?php echo form_open('custom_fields/doSave/'.$info->custom_field_id,'class="smart-form" id="custom_fields-form"');?>
   
   
        <section>
            
            <?php if(isset($tbl)) { ?>
                <input type="hidden" name="custom_field_table" id="custom_field_table" value="<?php echo set_value('custom_field_table', $tbl);?>" tabindex="1">
            <?php } else { ?>
            <label for="custom_field_label">Table</label>
            <label class="select">
                <select name="custom_field_table" id="custom_field_table" tabindex="1">
                    <option value="">Select</option>
                    <?php 
                    $tables = $this->db->list_tables();
                    $req_tables = array("users_custom"); //pass your table names as Array
                    $custom_field_tables = array_intersect($tables, $req_tables);
                    foreach ($custom_field_tables as $table => $label) { ?>
                    <option value="<?php echo $label; ?>" <?php if ($info->custom_field_table == $label) { ?>selected="selected"<?php } ?>><?php echo ucfirst(str_replace('_', ' ', $label)) ; ?></option>
                    <?php } ?>
                </select>
                <i></i>
            </label>
            <?php } ?>
            
        </section>

        <section>
            <label for="custom_field_label">Label</label>
            <label class="input">
                <input type="text" name="custom_field_label" id="custom_field_label" value="<?php echo set_value('custom_field_label', $info->custom_field_label);?>" placeholder="Label" tabindex="2">
                
            </label>
        </section>
        <section>
            <label for="custom_field_symbol">Symbol</label>
            <label class="input">
                <input type="text" name="custom_field_symbol" id="custom_field_symbol" value="<?php echo set_value('custom_field_symbol', $info->custom_field_symbol);?>" placeholder="kg" tabindex="3">
                
            </label>
        </section>
        <section>
            <label for="custom_field_type">Input Type</label>
            <label class="select">
				<select name="custom_field_type" id="custom_field_type" tabindex="4">
					<option value="">Select</option>
					<optgroup label="Text">
						<option value="field" <?php if ($info->custom_field_type == 'field') { ?>selected="selected"<?php } ?>>Field</option>
						<option value="area" <?php if ($info->custom_field_type == 'area') { ?>selected="selected"<?php } ?>>Area</option>
					</optgroup>
					<optgroup label="Select">
						<option value="dropdown" <?php if ($info->custom_field_type == 'dropdown') { ?>selected="selected"<?php } ?>>Dropdown</option>
						<option value="radiobox" <?php if ($info->custom_field_type == 'radiobox') { ?>selected="selected"<?php } ?>>Radiobox</option>
						<option value="checkbox" <?php if ($info->custom_field_type == 'checkbox') { ?>selected="selected"<?php } ?>>Checkbox</option>
					</optgroup>
					<optgroup label="File">
						<option value="file" <?php if ($info->custom_field_type == 'file') { ?>selected="selected"<?php } ?>>File</option>
					</optgroup>
					<optgroup label="Date">
						<option value="date" <?php if ($info->custom_field_type == 'date') { ?>selected="selected"<?php } ?>>Date</option>
					</optgroup>
				</select>
               
				<i></i>
            </label>
        </section>

        <section id="select-option" style="display:none;">
            <table class="table table-stripe">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Sort</th>   
                    </tr>
                </thead>

                <tbody class="row-wrapper">
                    <?php 
					if($info->custom_field_id) {
					$options = $this->Custom_field->get_all_option($info->custom_field_table, $info->custom_field_column)->result_array();
					$i = 0;	
						foreach($options as $option) { ?>
							<tr class="row-item">
								<td class="">
									<label class="input">
										<input name="option[<?php echo $i;?>][name]" id="" class="form-control" value="<?php echo $option['custom_option_name'];?>" />
									</label>
								</td>
								 
								<td class="last-td">
									<label class="input">
										<input name="option[<?php echo $i;?>][sort]" id="" class="form-control" value="<?php echo $option['custom_option_sort'];?>" />
									</label>
									<button type="button" class="close remove-row" style="display:none;">&times;</button>
								</td>    
							</tr>
						<?php $i++; } 
					} else { ?>
					
						<tr class="row-item">
							<td class="">
								<label class="input">
									<input name="option[0][name]" id="" class="form-control" value="" />
								</label>
							</td>
							 
							<td class="last-td">
								<label class="input">
									<input name="option[0][sort]" id="" class="form-control" value="" />
								</label>
								<button type="button" class="close remove-row" style="display:none;">&times;</button>
							</td>    
						</tr>
					<?php } ?>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" class="text-right">
                            <button class="btn btn-primary" id="new-row">Add row</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </section>
	
        <section>
            <label for="custom_field_type">Is Required</label>
            <label class="select">
                <select name="custom_field_is_required" id="custom_field_is_required" tabindex="5">
                    <option value="">Select</option>
					<?php 
                    $options = array('1' => 'Yes', '0' => 'No');
                    foreach ($options as $option => $label) { ?>
                    <option value="<?php echo $option; ?>" <?php if ($info->custom_field_is_required == $option) { ?>selected="selected"<?php } ?>><?php echo $label; ?></option>
                    <?php } ?>
                </select>
                <i></i>
            </label>
        </section>
        <section>
            <label for="custom_field_sort">Sort Order</label>
            <label class="input">
                <input type="text" name="custom_field_sort" id="custom_field_sort" value="<?php echo set_value('role_name', $info->custom_field_sort);?>" placeholder="Sort" tabindex="6">
                
            </label>
        </section>
        

        <button type="submit" id="submit" class="btn btn-primary btn-sm">Submit</button>
 
</form>
  
<script type="text/javascript">
    var BASE_URL = '<?php echo base_url();?>';
	
    runAllForms();
    
	$('#custom_field_type').on('change', function(e) {
        var val = $( "#custom_field_type option:selected" ).val();
        
        console.log(val);
		if(val === 'dropdown' || val === 'radiobox' || val === 'checkbox') 
		{
			$('#select-option').show();
		}else{
			$('#select-option').hide();
		}
    });
	
    $(document).on('click', '#new-row', function(e) {
        e.preventDefault();
        $('tr.row-item:last')
            .clone()
            .find(':input').val('').removeAttr('readonly', '')
            .each(function() {
                this.name = this.name.replace(/\[(\d+)\]/, function(str, p1) {
                    return '[' + (parseInt(p1, 10) + 1) + ']';
                });
            })
            .end()
            .appendTo('.row-wrapper')
 
        $('tr.row-item:last').find('.remove-row').show();
 
    });
 
    //removerow 
    $(document).on('click', '.remove-row', function() {
        $(this).closest('tr').remove();
    });

    var validatefunction = function() {

        $("#custom_fields-form").validate({
            // Rules for form validation
            rules : {
                custom_field_table : {
                    required : true
                },
                custom_field_label : {
                    required : true,
                    maxlength: 150
                }
            },

            // Messages for form validation
            messages : {
                custom_field_table : {
                    required : '<i class="fa fa-times-circle"></i> Please select table'
                },
                custom_field_label : {
                    required : '<i class="fa fa-times-circle"></i> Please add label',
                    maxlength: '<i class="fa fa-times-circle"></i> The label can not exceed 150 characters in length.'
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
                            $.smallBox({
                                title : "Success",
                                content : response.message,
                                color : "#739E73",
                                iconSmall : "fa fa-check",
                                timeout : 3000
                            });
                            $('.bootbox-close-button').trigger('click');
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