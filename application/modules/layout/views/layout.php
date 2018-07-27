<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

		<meta name="author" content="<?php echo $author;?>">
		<meta name="description" content="<?php echo $description;?>">
		<meta name="keywords" content="<?php echo $keywords;?>">

		<link rel="shortcut icon" href="../../favicon.ico" type="image/x-icon">
		<link rel="icon" href="../../favicon.ico" type="image/x-icon">

		<!-- Metro 4 -->
		<link rel="stylesheet" href="<?php echo base_url(); ?>bower_components/metro/build/css/metro-all.min.css">
		<link rel="stylesheet" href="<?php echo base_url(); ?>bower_components/metro/build/css/third-party/datatables.css">
		<script type="text/javascript">
			var BASE_URL = '<?php echo base_url();?>';
		</script>
		<!-- jQuery first, then Metro UI JS -->
		<!-- <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script> -->
		<script src="<?php echo base_url(); ?>bower_components/jquery/dist/jquery.min.js"></script>	
		<script src="<?php echo base_url(); ?>bower_components/metro/build/js/metro.min.js"></script>	

		<script src='<?php echo base_url(); ?>bower_components/jquery-validation/dist/jquery.validate.min.js'></script>
		<script src='<?php echo base_url(); ?>bower_components/jquery-form/dist/jquery.form.min.js'></script>
		<script src="<?php echo base_url(); ?>assets/js/ajaxnav.js"></script>
		<script src="<?php echo base_url(); ?>assets/js/global.js"></script>

		<title><?php echo $title;?></title>

		<style>
			.sidebar-header>.que {
				font-size: 12px;
				font-weight: 300;
				top: 116px;
				right:10%;
				display: block;
				position: absolute;
				color: #fff;
			}
		</style>
		<script type="text/javascript">
			jsArray = {};

			function loadScript(a, b) {
				
				jsArray[a] = !0;
				var c = document.getElementsByTagName("body")[0],
					d = document.createElement("script");
				d.type = "text/javascript", d.src = a, d.onload = b, c.appendChild(d)
				
			}
		</script>
	</head>
	<body class="">
		<aside class="sidebar pos-absolute z-2"
			data-role="sidebar"
			data-toggle="#sidebar-toggle-3"
			id="sb3"
			data-shift=".shifted-content">
			<div class="sidebar-header" data-image="/images/sb-bg-1.jpg">
				<div class="avatar">
					<img data-role="gravatar" data-email="<?php echo $UserInfo->email;?>">
				</div>
				<span class="title fg-white"><?php echo lang('welcome') . ' ' . $username; ?></span>
				<span class="subtitle fg-white"> loged as <?php echo $this->Mdl_roles->get_by_id($role_id)->role_name;?></span>
				<span class="que fg-white" data-counts="0"></span>
			</div>
			<ul class="sidebar-menu">
				<li><a href="<?php echo site_url('dashboard'); ?>"><span class="mif-home icon"></span>Dashboard</a></li>
				<li><a href="<?php echo site_url('patients'); ?>"><span class="mif-users icon"></span>My Patients</a></li>
				<li><a href="<?php echo site_url('appointments'); ?>"><span class="mif-files-empty icon"></span>Appointments</a></li>
				<li class="group-title">Settings</li>
				<li><a href="<?php echo site_url('settings'); ?>"><span class="mif-cogs icon"></span>Preferences</a></li>
				<li><a href="<?php echo site_url('profile'); ?>"><span class="mif-user icon"></span>Profile</a></li>
				<li class="divider"></li>
				<li><a href="<?php echo site_url('auth/logout'); ?>"><span class="mif-exit icon"></span>Logout</a></li>
			</ul>
		</aside>
		
		<div class="shifted-content h-100 p-ab" style="">
			<div class="app-bar pos-absolute bg-red z-1" data-role="appbar">
				<button class="app-bar-item c-pointer" id="sidebar-toggle-3">
					<span class="mif-menu fg-white"></span>
				</button>
			</div>
			<div class="h-100 p-4" id="content">
				<?php //echo $content; ?>
			</div>
		</div>

		<script type="text/javascript">
			$(document).ready(function() {
				mcs.init();
			});
		</script>
	</body>
</html>