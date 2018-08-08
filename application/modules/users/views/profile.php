<style>
.content-error{
	color:red !important;
}
.chat-body ul li.message img {
    width: 50px;
    height: auto;
}
.editable.editable-click {
    color: #383838 !important;
    border-bottom: dashed 1px #383838;
}
.connections-list img, .followers-list img {
    width: 35px;
    height: auto;
}

.profile-pic>img {
	margin-top: 1em;
    top: unset;
    left: unset;
}
</style>
<!-- row -->
<div class="row">

	<!-- col -->
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<h1 class="page-title txt-color-blueDark"><!-- PAGE HEADER --><?php echo $module;?> </h1>
	</div>
	<!-- end col -->

</div>
<!-- end row -->

<div class="row">

	<div class="col-sm-12">


			<div class="well well-sm">

				<div class="row">

					<div class="col-sm-12 col-md-12 col-lg-6">
						<div class="well well-light well-sm no-margin no-padding">

							<div class="row">

								<div class="col-sm-12">

									<div class="row">
										<div class="col-sm-3 profile-pic">
											<?php if(!empty($info->avatar) || $info->avatar != '')
											{
												$img = '<img src="'.base_url().'/uploads/'.$info->client_id.'/profile-picture/'.$info->avatar.'" alt="'.$info->username.'" style="width:100px; height:100px;">';
											}
											else
											{ 
												$img = base_url().'img/avatars/blank.png';
												$img = '<img src="'.$this->gravatar->get("'+val.email+'", 280).'" />';
											} ?>
											
					
											<?php echo $img;?>
											<a href="<?php echo site_url('auth/upload_picture/'.$info->id);?>" data-original-title="Upload" class="bootbox"><i class="fa fa-pencil"></i></a>
											
											
										</div>
										
										<div class="col-sm-9">
											<h1>
											<a href="#" data-table="users_profiles" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="firstname" class="editable xeditable_text" data-type="text" data-pk="<?php echo $info->id;?>" data-original-title="Enter Firstname"><?php echo $info->firstname;?></a>
												<span class="semi-bold">
													<a href="#" data-table="users_profiles" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="lastname" class="editable xeditable_text" data-type="text" data-pk="<?php echo $info->id;?>" data-original-title="Enter Lastname"><?php echo $info->lastname;?></a>
												</span>
											<br>
											<small> 
											<a href="#" data-table="users" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="username" class="editable xeditable_text" data-type="text" data-pk="<?php echo $info->id;?>" data-original-title="Enter Username"><?php echo $info->username;?></a>
											</small></h1>

											<ul class="list-unstyled">
												<li>
													<p class="text-muted">
														<i class="fa fa-mobile fa-fw"></i>&nbsp;&nbsp;<span class="txt-color-darken">
														<a href="#" data-table="users_profiles" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="mobile" class="editable xeditable_text" data-type="text" data-pk="<?php echo $info->id;?>" data-original-title="Enter Mobile"><?php echo $info->mobile;?></a>
														</span>
													</p>
												</li>
												<li>
													<p class="text-muted">
														<i class="fa fa-envelope fa-fw"></i>&nbsp;&nbsp;
														<a href="#" data-table="users" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="email" class="editable xeditable_text" data-type="text" data-pk="<?php echo $info->id;?>" data-original-title="Enter Email"><?php echo $info->email;?></a>
													</p>
												</li>
												<li>
													<p class="text-muted">
														<span class="txt-color-darken">
														<a href="#" data-table="users_profiles" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="address" class="editable xeditable_textarea" data-type="textarea" data-pk="<?php echo $info->id;?>" data-original-title="Enter Address"><?php echo $info->address;?></a>
														<br/>
														<a href="#" data-table="users_profiles" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="country" class="editable xeditable_select" data-type="select" data-pk="<?php echo $info->id;?>" data-original-title="Enter Country"><?php echo $info->country;?></a>
														<br/>
														<a href="#" data-table="users_profiles" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="state" class="editable xeditable_select" data-type="select" data-pk="<?php echo $info->id;?>" data-original-title="Enter state"><?php //echo $this->location_lib->get_info($info->state)->name;?></a>
														<br/>
														<a href="#" data-table="users_profiles" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="city" class="editable xeditable_select" data-type="select" data-pk="<?php echo $info->id;?>" data-original-title="Enter City"><?php //echo $this->location_lib->get_info($info->city)->name;?></a>
														<br/>
														<a href="#" data-table="users_profiles" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="zip" class="editable xeditable_text" data-type="text" data-pk="<?php echo $info->id;?>" data-original-title="Enter Zip"><?php echo $info->zip;?></a>
														</span>
													</p>
												</li>
												<li>
													<p class="text-muted">
														<i class="fa fa-crosshairs fa-fw"></i>&nbsp;&nbsp;<span class="txt-color-darken">
														<a href="#" data-table="users_profiles" data-placement="top" data-url="<?php echo site_url('user/do_update');?>" data-name="gender" class="editable xeditable_select" data-type="select" data-pk="<?php echo $info->id;?>" data-original-title="Enter Gender"><?php echo ($info->gender == 1) ? 'Male' : 'Female';?></a>
														</span>
													</p>
												</li>
												<li id="change_pass">
													<p class="text-muted">
														<i class="fa fa-key fa-fw"></i>&nbsp;&nbsp;<span class="txt-color-darken">
														<a href="<?php echo site_url('auth/change_password/');?>" class="bootbox" id="<?php echo $info->id;?>"><?php echo $this->lang->line('__change_password');?></a></span>
													</p>
												</li>
											</ul>
											<?php 
											// echo '<pre>';
											// print_r($this->location_lib->get_info($info->country));
											// echo '</pre>';
											?>

										</div>
										
									</div>

								</div>

							</div>

							

						</div>

					</div>
					<div class="col-sm-12 col-md-12 col-lg-6">

						
					</div>
				</div>

			</div>


	</div>

</div>

<script type="text/javascript">

	$("[rel=tooltip]").tooltip();
	/* DO NOT REMOVE : GLOBAL FUNCTIONS!
	 *
	 * pageSetUp(); WILL CALL THE FOLLOWING FUNCTIONS
	 *
	 * // activate tooltips
	 * $("[rel=tooltip]").tooltip();
	 *
	 * // activate popovers
	 * $("[rel=popover]").popover();
	 *
	 * // activate popovers with hover states
	 * $("[rel=popover-hover]").popover({ trigger: "hover" });
	 *
	 * // activate inline charts
	 * runAllCharts();
	 *
	 * // setup widgets
	 * setup_widgets_desktop();
	 *
	 * // run form elements
	 * runAllForms();
	 *
	 ********************************
	 *
	 * pageSetUp() is needed whenever you load a page.
	 * It initializes and checks for all basic elements of the page
	 * and makes rendering easier.
	 *
	 */

	pageSetUp();
	
	/*
	 * ALL PAGE RELATED SCRIPTS CAN GO BELOW HERE
	 * eg alert("my home function");
	 * 
	 * var pagefunction = function() {
	 *   ...
	 * }
	 * loadScript("js/plugin/_PLUGIN_NAME_.js", pagefunction);
	 * 
	 * TO LOAD A SCRIPT:
	 * var pagefunction = function (){ 
	 *  loadScript(".../plugin.js", run_after_loaded);	
	 * }
	 * 
	 * OR
	 * 
	 * loadScript(".../plugin.js", run_after_loaded);
	 */

	// PAGE RELATED SCRIPTS

	// pagefunction
	
	var bootboxfunction = function() {

		$(".bootbox").click(function (e) {
			var href = $(this).attr('href');
			var title = $(this).text();
			e.preventDefault();
			$.ajax({
				url: href,
				onError: function () {
					bootbox.alert('Some network problem try again later.');
				},
				success: function (response)
				{
					var dialog = bootbox.dialog({
						title: title,
						message: '<p><i class="fa fa-spin fa-spinner"></i> Loading...</p>'
					});
					dialog.init(function(){
						setTimeout(function(){
							dialog.find('.bootbox-body').html(response);
						}, 3000);
					});
				}
			});
			return false;  
		});

	};
	
	// end pagefunction
	
	// run pagefunction on load

	loadScript(BASE_URL+"js/bootbox.min.js", bootboxfunction);
	
</script>
