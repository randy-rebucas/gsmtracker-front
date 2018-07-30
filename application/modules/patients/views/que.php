<style type="text/css">
	section#bod .select {
		margin-right: .3em;
	}
	section#bod .row {
		padding-left: 1.3em;
	}
</style>
<div class="row">
	<div class="col-md-12">	
		<?php echo form_open('queings/move_in/','class="smart-form" id="que-form"');?>
		   	<fieldset>
				<input type="hidden" name="patient_id" id="patient_id" value="<?php echo $info->id;?>">
				
				<legend>Information</legend>
				<div class="row">
					<section class="col col-6">
						<label for="visit_type">Type of Visit:</label>
						<label class="select">
							<?php 
							$visit_types = array(
								''=>'Select Type',
								'check-up' => 'Check Up', 
								'follow-up' => 'Follow Up', 
							);
							echo form_dropdown('visit_type',$visit_types, '','tabindex="" id="visit_type"'); ?>
							<i></i>
						</label>
					</section>
					<section class="col col-6"  id="bod">
						<label for="bod">Date</label>
						<div class="row">	
							<label class="select col-md-3">
								<?php 
									$cutoff = 1910;

								// current year
								$now = date('Y');
								// build years menu
								echo '<select name="year" id="year">' . PHP_EOL;
								echo '  <option value="">select</option>' . PHP_EOL;
								for ($y=$now; $y>=$cutoff; $y--) {
									$selected = ($y == date('Y')) ? 'selected="selected"' : '';
									echo '  <option value="' . $y . '" '.$selected.'>' . $y . '</option>' . PHP_EOL;
								}
								echo '</select>' . PHP_EOL;
								?>
								<i></i>

							</label>
							<label class="select col-md-3">
								
							<?php 
								// build months menu
								echo '<select name="month" id="month">' . PHP_EOL;
								echo '  <option value="">select</option>' . PHP_EOL;
								for ($m=1; $m<=12; $m++) {
									$selected = ($m == date('m')) ? 'selected="selected"' : '';
									echo '  <option value="' . $m . '" '.$selected.'>' . date('M', mktime(0,0,0,$m)) . '</option>' . PHP_EOL;
								}
								echo '</select>' . PHP_EOL;
								?>
								<i></i>
							</label>
							<label class="select col-md-3">
								
							<?php 
								// build days menu
								echo '<select name="day" id="day">' . PHP_EOL;
								echo '  <option value="">select</option>' . PHP_EOL;
								for ($d=1; $d<=31; $d++) {
									$selected = ($d == date('d')) ? 'selected="selected"' : '';
									echo '  <option value="' . $d . '" '.$selected.'>' . str_pad($d, 2, "0", STR_PAD_LEFT) . '</option>' . PHP_EOL;
								}
								echo '</select>' . PHP_EOL;
								?>
								<i></i>
							</label>
						</div>

					</section>
				</div>
				<button type="submit" name="submit" id="submit" class="btn btn-primary btn-sm">Move to Que</button>
			</fieldset>	
		<?php form_close();?>
  	</div>
</div>
<script type="text/javascript">

    runAllForms();
	
    var validatefunction = function() {

        $("#que-form").validate({
            // Rules for form validation
            rules : {
                visit_type : {
                    required : true
                }
            },
            // Messages for form validation
            messages : {
                visit_type : {
                    required : '<i class="fa fa-times-circle"></i> Please select visit type.'
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
                    	console.log(response);
                        if(response.success)
                        {
                        	
                            mcs.init_smallBox("success", response.message);
                            mcs.init();
                            $('.bootbox-close-button').trigger('click');
                            checkURL();
                        }
                        else
                        {
                             mcs.init_smallBox("error", response.message);
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