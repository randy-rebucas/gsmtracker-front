<table class="table table-striped">

	<thead>
		<tr>
			<th><?php echo lang('status'); ?></th>
			<th><?php echo lang('title'); ?></th>
            <th><?php echo lang('description'); ?></th>
			<th><?php echo lang('created'); ?></th>
			<th><?php echo lang('client_name'); ?></th>
			<th><?php echo lang('options'); ?></th>
		</tr>
	</thead>

	<tbody>
		<?php foreach ($appointments as $appointment) { ?>
		<tr>
			<td>
                <span class="label <?php echo $appointment_statuses[$appointment->appointment_status]['class']; ?>"><?php echo $appointment_statuses[$appointment->appointment_status]['label']; ?></span>
			</td>
			<td><?php echo $appointment->appointment_title; ?></td>
            <td><?php echo $appointment->appointment_description; ?></td>
			<td><?php echo $appointment->appointment_date; ?></td>
			<td><a href="<?php echo site_url('doctors/view/' . $appointment->appointment_doctor_id); ?>" title="<?php echo lang('view_doctors'); ?>"><?php echo $appointment->username; ?></a></td>
			<td><a href="<?php echo site_url('patients/view/' . $appointment->appointment_patient_id); ?>" title="<?php echo lang('view_patients'); ?>"><?php echo $appointment->username; ?></a></td>
            <td>
				<div class="options btn-group">
					<a class="btn btn-small dropdown-toggle" data-toggle="dropdown" href="#"><i class="icon-cog"></i> <?php echo lang('options'); ?></a>
					<ul class="dropdown-menu">
						<li>
							<a href="<?php echo site_url('appointments/view/' . $appointment->appointment_id); ?>">
								<i class="icon-pencil"></i> <?php echo lang('edit'); ?>
							</a>
						</li>
						<li>
							<a href="<?php echo site_url('appointments/generate_pdf/' . $appointment->appointment_id); ?>">
								<i class="icon-print"></i> <?php echo lang('download_pdf'); ?>
							</a>
						</li>
						<li>
							<a href="<?php echo site_url('appointments/quote/' . $appointment->appointment_id); ?>">
								<i class="icon-envelope"></i> <?php echo lang('send_email'); ?>
							</a>
						</li>
						<li>
							<a href="<?php echo site_url('appointments/delete/' . $appointment->appointment_id); ?>" onclick="return confirm('<?php echo lang('delete_quote_warning'); ?>');">
								<i class="icon-trash"></i> <?php echo lang('delete'); ?>
							</a>
						</li>
					</ul>
				</div>
			</td>
		</tr>
		<?php } ?>
	</tbody>

</table>