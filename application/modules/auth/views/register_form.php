<style>
	.form-register {
		width: 350px;
		height: auto;
		top: 50%;
		margin-top: -160px;
	}
</style>
<?php echo form_open('auth/doRegister', 'id="form-register" class="form-register bg-white p-6 mx-auto border bd-default win-shadow"'); ?>

	<span class="mif-vpn-lock mif-4x place-right" style="margin-top: -10px;"></span>
	<h2 class="text-light">Login to service</h2>
	<hr class="thin mt-4 mb-4 bg-white">
	<div class="form-group">
		<input type="text" data-role="input" name="username" value="<?php echo set_value('username');?>" id="username" data-prepend="<span class='mif-user'>" placeholder="Username...">
	</div>
	<div class="form-group">
		<input type="text" data-role="input" name="email" value="<?php echo set_value('email');?>" id="email" data-prepend="<span class='mif-envelop'>" placeholder="Email...">
	</div>
	<div class="form-group">
		<input type="password" data-role="input" name="password" value="<?php echo set_value('password');?>" id="password" data-prepend="<span class='mif-key'>" placeholder="Password...">
	</div>
	<div class="form-group">
		<input type="password" data-role="input" name="confirm_password" value="<?php echo set_value('confirm_password');?>" id="confirm_password" data-prepend="<span class='mif-key'>" placeholder="Confirm Password...">
	</div>
	<div class="form-group mt-10">
		
		<button type="submit" id="submit" class="button"><?php echo lang('auth_submit');?></button>
	</div>

</form>

<script type="text/javascript">
	var BASE_URL = '<?php echo base_url();?>';
	$(function() {
		// Validation
		
		$("#form-register").validate({

			// Rules for form validation
			rules : {
				username : {
					required : true
				},
				email : {
					required : true,
					email : true
				},
				password : {
					required : true,
					minlength : 3,
					maxlength : 20
				},
				passwordConfirm : {
					required : true,
					minlength : 3,
					maxlength : 20,
					equalTo : '#password'
				}
			},

			// Messages for form validation
			messages : {
				login : {
					required : 'Please enter your login'
				},
				email : {
					required : 'Please enter your email address',
					email : 'Please enter a VALID email address'
				},
				password : {
					required : 'Please enter your password'
				},
				passwordConfirm : {
					required : 'Please enter your password one more time',
					equalTo : 'Please enter the same password as above'
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
							window.location.href = BASE_URL+'auth'; 
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