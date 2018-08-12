<!-- MAIN CONTENT -->
<div id="content" class="container">

	<div class="row">

		<div class="col-sm-6 col-md-offset-3">
			<div class="well no-padding">	

				<?php echo form_open('auth/doRequest', 'id="request-form" class="smart-form client-form"'); ?>
					<header>Request form | <a href="<?php echo site_url('auth/login');?>">Login</a></header>
					
					<fieldset>					
						<div class="row">
							<section class="col col-6">
								<label class="label">Name</label>
								<label class="input">
									<i class="icon-append fa fa-user"></i>
									<input type="text" name="name" id="name">
								</label>
							</section>
							<section class="col col-6">
								<label class="label">E-mail</label>
								<label class="input">
									<i class="icon-append fa fa-envelope-o"></i>
									<input type="email" name="email" id="email">
								</label>
							</section>
						</div>
						<section>
							<label class="label">Message</label>
							<label class="textarea">
								<i class="icon-append fa fa-comment"></i>
								<textarea rows="4" name="message" id="message"></textarea>
							</label>
						</section>
						
						<section>
							<label class="checkbox"><input type="checkbox" name="copy" id="copy" value="1"><i></i>Send a copy to my e-mail address</label>
						</section>
					</fieldset>
					
					<footer>
						<button type="submit" id="submit"  class="btn btn-primary">Submit</button>
					</footer>
					
					<div class="message">
						<i class="fa fa-thumbs-up"></i>
						<p>Your message was successfully sent!</p>
					</div>
				</form>
			</div>

		</div>
	</div>
</div>

<script type="text/javascript">
	
	runAllForms();
	
	// Validation
	$(function() {
		$("#request-form input:first").focus();
		// Validation
		$("#request-form").validate({

			// Rules for form validation
			rules : {
				name : {
					required : true,
					maxlength: 150
				},
				email : {
					required : true,
					email : true,
					maxlength: 150
				},
				message : {
					required : true,
					maxlength : 3000
				}
			},

			// Messages for form validation
			messages : {
				name : {
					required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'name');?>',
					maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 150);?>'
				},
				email : {
					required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'email');?>',
					email : '<i class="fa fa-exclamation-circle"></i> <?php echo $this->lang->line('__validate_email');?>',
					maxlength: '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_maxlength'), 150);?>'
				},
				message : {
					required : '<i class="fa fa-exclamation-circle"></i> <?php echo sprintf($this->lang->line('__validate_required'), 'message');?>',
					maxlength: '<i class="fa fa-exclamation-circle"></i><?php echo sprintf($this->lang->line('__validate_maxlength'), 3000);?>.'
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
						$('#submit').html('<?php echo $this->lang->line('__common_please_wait');?>');
						$('#submit').attr("disabled", "disabled");
					},
					success:function(response)
					{
						if(response.success)
						{
							$.smallBox({
								title : "Success",
								content : response.message,
								color : "#739E73",
								iconSmall : "fa fa-check",
								timeout : 3000
							});
							$('#submit').html('<?php echo $this->lang->line('__common_redirecting');?>');
							setTimeout(function () {
								window.location.href = BASE_URL+'auth/login';
							}, 5000);
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
							$('#submit').text('<?php echo $this->lang->line('__common_submit');?>');
							$('#submit').removeAttr("disabled");
						}  
						$('html, body').animate({
							scrollTop : 0
						}, "fast");
					},
					dataType:'json'
				});
			}
		});

	});
</script>
