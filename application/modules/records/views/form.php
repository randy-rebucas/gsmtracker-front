<style>
#tbl-records label.checkbox {
    text-align: left;
}
</style>
<?php echo form_open('records/doSave/'.$info->record_id,'class="smart-form" id="records-form"');?>

		<section>
			<label for="name">Name of Record</label>
			<label class="input">
				<input type="text" name="name" id="name" value="<?php echo set_value('name', $info->name);?>" placeholder="Name" tabindex="1">
				
			</label>
		</section>
			
		<section >
			<label for="description">Description</label>
			<label class="textarea">
				<textarea name="description" class="custom-scroll" id="description" placeholder="Description" tabindex="2"><?php echo set_value('description', $info->description);?></textarea>
			</label>	
		</section>

		<section>
			<label class="checkbox">
				<input type="checkbox" id="status" name="status" value="1" <?php if($info->status == 1) echo 'checked';?>>
				<i></i>Enable
			</label>
		</section>

		

    <?php if($info->record_id) { ?>
   
        <legend id="custom-field-section">Custom Fields</legend>
            <?php
            if($fields->num_rows() > 0) {
                echo '<table class="table" id="custom_fields">
                    <thead><tr><th>Field Name</th><th>Field Type</th><th>Is Required</th><th></th></tr></thead>
                <tbody>';
                foreach ($fields->result() as $custom_field) { 
                    echo '<tr id="row-'.$custom_field->custom_field_id.'">';
                    echo '<td>'.$custom_field->custom_field_label.'</td>'; 
                    echo '<td>'.$custom_field->custom_field_type.'</td>';
                    echo '<td>';
                    echo ($custom_field->custom_field_is_required == 1) ? 'Yes' : 'No';
                    echo '</td>';
                    echo '<td><a id="'.$custom_field->custom_field_id.'" href="'.base_url().'custom_fields/delete/'.$custom_field->custom_field_id.'" class="custom_delete"><i class="fas fa-times-circle fa-lg"></i></a></td>';
                    echo '</tr>';
                }
                echo '</tbody></table>';
            }  ?>
    
    <?php } ?>
    
        <button type="submit" id="submit" class="btn btn-primary btn-sm">Submit</button>
    
</form>
  
<script type="text/javascript">
    
    pageSetUp();

    runAllForms();
	
    $(".custom_delete").click(function (e) {
        e.preventDefault();
        var link = $(this).attr('href');
        var id = $(this).attr('id');
        $.ajax({
            url: link,
            success: function (response)
            {
                if(response)
                {
                    $('#row-'+id).hide().remove();
                    var new_count = $('#custom_fields tbody tr').length;
                    count_custom_row(new_count);
                }
                
            }
        });
    });

    var n = $('#custom_fields tbody tr').length;

    count_custom_row(n);

    function count_custom_row(n) {
        
        console.log('row: '+n);
        if (n > 0) {
            
            $('#records-form').find('.info').remove();
            $('<div class="alert alert-info info">You can only change this table once you delete the custom field associated to it.</div>').prependTo('#records-form');
            
            $('#name').attr('disabled', true).parent('label').addClass('state-disabled');
            $('#description').attr('disabled', true).parent('label').addClass('state-disabled');
            $('#status').attr('disabled', true).parent('label').addClass('state-disabled');
            $('#submit').attr('disabled', true);
        }else{
            $('#records-form').find('.info').remove();
            $('#name').attr('disabled', false).parent('label').removeClass('state-disabled');
            $('#description').attr('disabled', false).parent('label').removeClass('state-disabled');
            $('#status').attr('disabled', false).parent('label').removeClass('state-disabled');
            $('#submit').attr('disabled', false);
        }
        if (n === 0) {
            $('<div class="alert alert-info empty-custom">No Custom Field Found! Click Add Fields to start.</div>').insertAfter('legend#custom-field-section');
            $('#custom_fields').hide().remove();
        }
    }

    var validatefunction = function() {

        $("#records-form").validate({
            // Rules for form validation
            rules : {
                name : {
                    required : true,
                    maxlength: 30
                },
                description : {
                    required : true,
                    maxlength: 500
                }
            },

            // Messages for form validation
            messages : {
                name : {
                    required : '<i class="fa fa-times-circle"></i> Please add records name',
                    maxlength: '<i class="fa fa-times-circle"></i> The records name can not exceed 30 characters in length.'
                },
                description : {
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