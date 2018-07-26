<table class="table striped table-border">

	<thead>
		<tr>
			<th style="width:20%;"><?php echo lang('patient_name'); ?></th>
			<th style="width:20%;"><?php echo lang('email_address'); ?></th>
			<th style="width:10%;"><?php echo lang('phone_number'); ?></th>
			<th style="width:10%; text-align: right;"><?php echo lang('balance'); ?></th>
			<th style="width:10%;"><?php echo lang('active'); ?></th>
			<th style="width:10%;"><?php echo lang('options'); ?></th>
		</tr>
	</thead>

	<tbody>
		<?php foreach ($records as $patient) { ?>
		<tr>
			<td><?php echo anchor('patients/view/' . $patient->patient_id, $patient->patient_name); ?></td>
			<td><?php echo $patient->patient_email; ?></td>
            <td><?php echo (($patient->patient_phone ? $patient->patient_phone : ($patient->patient_mobile ? $patient->patient_mobile : ''))); ?></td>
			<td style="text-align: right;"><?php echo format_currency($patient->patient_invoice_balance); ?></td>
			<td><?php echo ($patient->patient_active) ? lang('yes') : lang('no'); ?></td>
			<td>
				<div class="split-button">
					<button class="button mini"><?php echo lang('options'); ?></button>
					<button class="mini split dropdown-toggle"></button>
					<ul class="d-menu" data-role="dropdown">
						<li>
							<a href="<?php echo site_url('patients/view/' . $patient->patient_id); ?>">
								<i class="icon-eye-open"></i> <?php echo lang('view'); ?>
							</a>
						</li>
						<li>
							<a href="<?php echo site_url('patients/form/' . $patient->patient_id); ?>">
								<i class="icon-pencil"></i> <?php echo lang('edit'); ?>
							</a>
						</li>
						<li>
							<a href="#" class="patient-create-que" data-patient-name="<?php echo $patient->patient_name; ?>" data-patient-id="<?php echo $patient->patient_id; ?>">
								<i class="icon-file"></i> <?php echo lang('create_que'); ?>
							</a>
						</li>
						<li>
							<a href="#" class="patient-create-quote" data-patient-name="<?php echo $patient->patient_name; ?>">
								<i class="icon-file"></i> <?php echo lang('create_quote'); ?>
							</a>
						</li>
						<li>
							<a href="#" class="patient-create-invoice" data-patient-name="<?php echo $patient->patient_name; ?>">
								<i class="icon-file"></i> <?php echo lang('create_invoice'); ?>
							</a>
						</li>
						<li class="divider"></li>
						<li>
							<a href="<?php echo site_url('patients/delete/' . $patient->patient_id); ?>" onclick="return confirm('<?php echo lang('delete_patient_warning'); ?>');">
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