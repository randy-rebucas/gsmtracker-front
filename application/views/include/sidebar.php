<!-- Note: This width of the aside area can be adjusted through LESS/SASS variables -->
<aside id="left-panel">

	<!-- User info -->
	<div class="login-info">
		<span> <!-- User image size is adjusted inside CSS, it should stay as is --> 
			
			<a href="javascript:void(0);" id="show-shortcut" data-action="toggleShortcut">
				<?php 
				if($user_info->avatar){
					echo '<img src="'.base_url().'uploads/'.$this->client_id.'/profile-picture/'.$user_info->avatar.'" alt="'.$user_info->username.'" class="online" style="width:25px;height:25px;" />';
				}else{
					echo '<img src="' . $this->gravatar->get($user_info->email, 25) . '" alt="'.$user_info->username.'" class="online" />';
				}?>
				
				<span>
					<?php echo $user_info->username;?>
				</span>
				<i class="fa fa-angle-down"></i>
			</a> 
			
		</span>
	</div>
	<!-- end user info -->

	<!-- NAVIGATION : This navigation is also responsive

	To make this navigation dynamic please make sure to link the node
	(the reference to the nav > ul) after page load. Or the navigation
	will not initialize.
	-->
		<nav>
			<!-- 
			NOTE: Notice the gaps after each icon usage <i></i>..
			Please note that these links work a bit different than
			traditional href="" links. See documentation for details.
			-->
			
			<ul>
				<li>
					<a title="<?php echo $this->lang->line('__dashboard');?>" href="<?php echo site_url('dashboard'); ?>"><i class="fas fa-lg fa-fw fa-home"></i> <span class="menu-item-parent"><?php echo $this->lang->line('__dashboard');?></span></a>
				</li>
				<?php if(($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('patients', $this->role_id, 'view',   $this->client_id) : true) { ?>
				<li>
					<a title="<?php echo $this->lang->line('__patients');?>" href="<?php echo site_url('patients'); ?>"><i class="fas fa-lg fa-fw fa-users"></i> <span class="menu-item-parent"><?php echo $this->lang->line('__patients');?></span></a>
				</li>
				<?php } ?>
				<?php if(($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('users', $this->role_id, 'view',   $this->client_id) : true) { ?>
				<li>
					<a title="<?php echo $this->lang->line('__users');?>" href="<?php echo site_url('users'); ?>"><i class="fas fa-lg fa-fw fa-user-friends"></i> <span class="menu-item-parent"><?php echo $this->lang->line('__users');?></span></a>
				</li>
				<?php } ?>
				<?php if(($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('roles', $this->role_id, 'view',   $this->client_id) : true) { ?>
				<li>
					<a title="<?php echo $this->lang->line('__roles');?>" href="<?php echo site_url('roles'); ?>"><i class="fas fa-lg fa-fw fa-user-lock"></i> <span class="menu-item-parent"><?php echo $this->lang->line('__roles');?></span></a>
				</li>
				<?php } ?>
				<?php if(($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('templates', $this->role_id, 'view',   $this->client_id) : true) { ?>
				<li>
					<a title="<?php echo $this->lang->line('__templates');?>" href="<?php echo site_url('templates'); ?>"><i class="fas fa-lg fa-fw fa-folder"></i> <span class="menu-item-parent"><?php echo $this->lang->line('__templates');?></span></a>
				</li>
				<?php } ?>
				<?php if(($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('records', $this->role_id, 'view',   $this->client_id) : true) { ?>
				<li>
					<a title="<?php echo $this->lang->line('__records');?>" href="<?php echo site_url('records/default'); ?>"><i class="fa fa-lg fa-fw fa-address-book"></i> <span class="menu-item-parent"><?php echo $this->lang->line('__records');?></span></a>
				</li>
				<?php } ?>
				<?php if(($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('reports', $this->role_id, 'view',   $this->client_id) : true) { ?>
				<li>
					<a title="<?php echo $this->lang->line('__reports');?>" href="<?php echo site_url('reports'); ?>"><i class="fas fa-lg fa-fw fa-chart-bar"></i> <span class="menu-item-parent"><?php echo $this->lang->line('__reports');?></span></a>
				</li>
				<?php } ?>
				<?php if(($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('appointments', $this->role_id, 'view',   $this->client_id) : true) { ?>
				<li>
					<a title="<?php echo $this->lang->line('__appointments');?>" href="<?php echo site_url('appointments'); ?>"><i class="fas fa-lg fa-fw fa-calendar-alt"></i> <span class="menu-item-parent"><?php echo $this->lang->line('__appointments');?></span></a>
				</li>
				<?php } ?>
				<li>
					<a title="Import" href="<?php echo site_url('import'); ?>"><i class="fas fa-lg fa-fw fa-file-import"></i> <span class="menu-item-parent">Import</span></a>
				</li>
				<?php if(($this->admin_role_id != $this->role_id) ? $this->Role->has_permission('settings', $this->role_id, 'view',   $this->client_id) : true) { ?>
				<li>
					<a title="<?php echo $this->lang->line('__settings');?>" href="<?php echo site_url('settings/profile'); ?>"><i class="fas fa-lg fa-fw fa-cogs"></i> <span class="menu-item-parent"><?php echo $this->lang->line('__settings');?></span></a>
				</li>
				<?php } ?>

				<li class="">
					<a href="#"><i class="fab fa-lg fa-fw fa-windows"></i> <span class="menu-item-parent">Help & Support</span><b class="collapse-sign"><em class="fa fa-plus-square-o"></em></b></a>
					<ul style="display: none;">
						
						<li>
							<a href="http://help.myclinicsoft.com/" target="_blank" >Help Center</a>
						</li>
						<li>
							<a href="http://forum.myclinicsoft.com/" target="_blank"  >Whats new</a>
						</li>
						<li>
							<a href="http://forum.myclinicsoft.com/" target="_blank" >Suggest Feature</a>
						</li>
						<li>
							<a href="http://ticket.myclinicsoft.com/" target="_blank" >Submit Tickets</a>
						</li>
						
					</ul>
				</li>
			</ul>
		</nav>
		
	<span class="minifyme" data-action="minifyMenu"> <i class="fas fa-arrow-circle-left hit"></i> </span>

</aside>