<div class="headerbar">

	<h1><?php echo lang('appointments'); ?></h1>
	
	<div class="pull-right">
		<a class="create-appointment btn btn-primary" href="#"><i class="icon-plus icon-white"></i> <?php echo lang('new'); ?></a>
	</div>

	<div class="pull-right">
		<?php echo pager(site_url('appointments/status/' . $this->uri->segment(3)), 'Mdl_appointments'); ?>
	</div>
    
	<div class="pull-right">
		<ul class="nav nav-pills index-options">
            <li <?php if ($status == 'all') { ?>class="active"<?php } ?>><a href="<?php echo site_url('appointments/status/all'); ?>"><?php echo lang('all'); ?></a></li>
            <li <?php if ($status == 'pending') { ?>class="active"<?php } ?>><a href="<?php echo site_url('appointments/status/pending'); ?>"><?php echo lang('pending'); ?></a></li>
            <li <?php if ($status == 'approved') { ?>class="active"<?php } ?>><a href="<?php echo site_url('appointments/status/approved'); ?>"><?php echo lang('approved'); ?></a></li>
            <li <?php if ($status == 'canceled') { ?>class="active"<?php } ?>><a href="<?php echo site_url('appointments/status/canceled'); ?>"><?php echo lang('canceled'); ?></a></li>
		</ul>
	</div>

</div>

<div class="table-content">

	<div id="filter_results">
	<?php $this->layout->load_view('appointments/appointments_table', array('appointments' => $appointments)); ?>
	</div>

</div>