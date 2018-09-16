<style>
#tbl-records label.checkbox {
    text-align: left;
}
</style>
<?php echo form_open('appointments/doSave','class="smart-form" id="appointment-form"');?>
   
	<fieldset> 
		<div class="row">
			<section class="col col-4">	
				<label for="schedule_date">Date</label>
				<label class="input">
					<input type="text" name="schedule_date" id="schedule_date" class="datepicker" value="<?php echo set_value('schedule_date', ($info->appointment_date) ? $info->appointment_date : date('Y-m-d') );?>" tabindex="1" data-dateformat="yy-mm-dd" aria-invalid="false">
					
				</label>
			</section>
			<section class="col col-4">
				<label for="gender">Status</label>
				<label class="select">
					<?php 
					$status = array(
						'Cancel'	=> 'Cancel',
						'Pending'	=> 'Pending',
						'Approve'	=> 'Approve'
					);	
					echo form_dropdown('status',$status, '',' id="status" tabindex="3"'); ?>
					<i></i>
				</label>
			</section>
		</div>
		
		<section class="">
			<label for="gender">Patient(s)</label>
			<label class="select">
				<?php echo form_dropdown('user_id',$patients, '',' id="user_id" tabindex="5"'); ?>
				<i></i>
			</label>
		</section>
		
		
		<section>
			<label for="title">Title</label>
			<label class="input">
				<input type="text" name="title" id="title" value="" placeholder="Title" tabindex="6">
				
			</label>
		</section>
			
		<section>
			<label for="description">Description</label>
			<label class="textarea">
				<textarea name="description" class="custom-scroll" id="description" placeholder="Description" tabindex="7"></textarea>
			</label>	
		</section>

		<button type="submit" id="submit" class="btn btn-primary btn-sm">Submit</button>
	</fieldset>
	
</form>
  
<script type="text/javascript">
    var BASE_URL = '<?php echo base_url();?>';
    
    runAllForms();

	loadScript(BASE_URL+"js/plugin/bootstrap-timepicker/bootstrap-timepicker.min.js", runTimePicker);
	
	function runTimePicker() {
		$('.timepicker').timepicker();
	}

    var validatefunction = function() {

        $("#appointment-form").validate({
            // Rules for form validation
            rules : {
				schedule_date: {
                    required : true
                },
				schedule_time: {
                    required : true
                },
				license_key: {
                    required : true
                },
				user_id: {
                    required : true
                },
                title : {
                    required : true,
                    maxlength: 50
                },
                description : {
                    required : true,
                    maxlength: 500
                },
				doctor_note : {
                    maxlength: 3000
                },
				patient_note : {
                    maxlength: 3000
                }
            },

            // Messages for form validation
            messages : {
				schedule_date : {
                    required : '<i class="fa fa-times-circle"></i> Please select date'
                },
				schedule_time : {
                    required : '<i class="fa fa-times-circle"></i> Please select time'
                },
				license_key : {
                    required : '<i class="fa fa-times-circle"></i> Please select doctor'
                },
				user_id : {
                    required : '<i class="fa fa-times-circle"></i> Please select patient'
                },
                title : {
                    required : '<i class="fa fa-times-circle"></i> Please add role name',
                    maxlength: '<i class="fa fa-times-circle"></i> The role name can not exceed 50 characters in length.'
                },
                description : {
                    required : '<i class="fa fa-times-circle"></i> Please add description',
                    maxlength: '<i class="fa fa-times-circle"></i> The description can not exceed 500 characters in length.'
                },
				doctor_note : {
                    maxlength: '<i class="fa fa-times-circle"></i> The doctor note can not exceed 3000 characters in length.'
                },
				patient_note : {
                    maxlength: '<i class="fa fa-times-circle"></i> The patient note can not exceed 3000 characters in length.'
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