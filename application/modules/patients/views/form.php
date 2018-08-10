<style>
.popover {
    padding: 10px;
}
</style>
<?php echo form_open_multipart('patients/ajax/doSave/'.$info->id,'class="smart-form" id="members-form"');?>
   

	<?php $this->load->view('include/common_form_ints');?>

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
							// for (var key in response.validation_errors) {
							// 	$('#' + key).parent().parent().addClass('error');
							// }
                        }                   
                        $(form).find('#submit').text('Submit');
                        $(form).find('#submit').removeAttr("disabled");

                        $('body').find('.create').attr('disabled', false);
                    },
                    dataType:'json'
                });
            }
        });

    }

	loadScript(BASE_URL+"js/plugin/jquery-validate/jquery.validate.min.js", function(){
		loadScript(BASE_URL+"js/plugin/jquery-form/jquery-form.min.js", validatefunction);
	});

	loadScript(BASE_URL+"js/plugin/typeahead/typeahead.min.js");
	
	var pagedestroy = function(){
		// debug msg
		if (debugState){
			root.console.log("✔  destroyed");
		} 
	}
</script>