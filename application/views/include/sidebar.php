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
		<li><a href="<?php echo site_url('preferences'); ?>"><span class="mif-cogs icon"></span>Preferences</a></li>
		<li><a href="<?php echo site_url('profile'); ?>"><span class="mif-user icon"></span>Profile</a></li>
		<li class="divider"></li>
		<li><a href="<?php echo site_url('auth/logout'); ?>"><span class="mif-exit icon"></span>Logout</a></li>
	</ul>
</aside>