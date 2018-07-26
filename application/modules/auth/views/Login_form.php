<style>
	.login-form {
		width: 350px;
		height: auto;
		top: 50%;
		margin-top: -160px;
	}
</style>
<?php echo form_open('auth/doLogin', 'id="login-form" class="login-form bg-white p-6 mx-auto border bd-default win-shadow"'); ?>

	<span class="mif-vpn-lock mif-4x place-right" style="margin-top: -10px;"></span>
	<h2 class="text-light">Login to service</h2>
	<hr class="thin mt-4 mb-4 bg-white">
	<div class="form-group">
		<input type="text" data-role="input" name="email" value="<?php echo set_value('email');?>" id="email" data-prepend="<span class='mif-envelop'>" placeholder="Enter your email...">
	</div>
	<div class="form-group">
		<input type="password" data-role="input" name="password" value="" id="password" data-prepend="<span class='mif-key'>" placeholder="Enter your password...">
	</div>
	<div class="form-group mt-10">
		<input type="checkbox" name="remember" id="remember" data-role="checkbox" data-caption="Remember me" class="place-right">
		<button type="submit" id="submit" class="button"><?php echo lang('auth_submit');?></button>
	</div>

</form>

<script type="text/javascript">
	var BASE_URL = '<?php echo base_url();?>';
	$(function() {
		// Validation
		$("#login-form").validate({
			// Rules for form validation
			rules : {
				email : {
					required : true,
					email : true
				},
				password : {
					required : true,
					minlength : 3,
					maxlength : 20
				}
			},
			// Messages for form validation
			messages : {
				email : {
					required : '',
					email : ''
				},
				password : {
					required : ''
				}
			},
			highlight: function(element) {
				$(element).closest('.form-group').addClass('invalid');
			},
			unhighlight: function(element) {
				$(element).closest('.form-group').removeClass('invalid');
			},
			errorElement: 'span',
			errorClass: 'text-danger',
			errorPlacement: function(error, element) {
				if(element.parent('.form-group').length) {
					error.insertAfter(element.parent());
				} else if(element.parent('.blocks').length){
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
						if(response)
                        {
							$(form).animate({
								opacity: 0
							});
							window.location.href = BASE_URL+'dashboard'; 
                        }
                        else
                        {
							$(form).addClass("ani-ring");
							setTimeout(function(){
								$(form).removeClass("ani-ring");
							}, 1000);
                        }                   
                        $('#submit').text('Submit');
                        $('#submit').removeAttr("disabled");
                    },
                    dataType:'json'
                });
            }
		});
	});
</script>
