<script type="text/javascript">
	$(function() {
		$('#save_patient_note').click(function()
		{
			$.post("<?php echo site_url('patients/ajax/save_patient_note'); ?>",
			{
				patient_id: $('#patient_id').val(),
				patient_note: $('#patient_note').val()
			}, function(data) {
				var response = JSON.parse(data);
				if (response.success == '1')
				{
					// The validation was successful
					$('.control-group').removeClass('error');
					$('#patient_note').val('');

					$('#notes_list').load("<?php echo site_url('patients/ajax/load_patient_notes'); ?>",
					{
						patient_id: <?php echo $patient->patient_id; ?>
					});
				}
				else
				{
					// The validation was not successful
					$('.control-group').removeClass('error');
					for (var key in response.validation_errors) {
						$('#' + key).parent().parent().addClass('error');
					}
				}
			});
		});

	});
</script>

<div class="headerbar">
	<h1><?php echo $patient->patient_name; ?></h1>

	<div class="pull-right">
		<a href="#" class="btn patient-create-quote" data-patient-name="<?php echo $patient->patient_name; ?>"><i class="icon-plus-sign"></i> <?php echo lang('create_quote'); ?></a>
		<a href="#" class="btn patient-create-invoice" data-patient-name="<?php echo $patient->patient_name; ?>"><i class="icon-plus"></i> <?php echo lang('create_invoice'); ?></a>
		<a href="<?php echo site_url('patients/form/' . $patient->patient_id); ?>" class="btn"><i class="icon-pencil"></i> <?php echo lang('edit'); ?></a>
		<a class="btn btn-danger" href="<?php echo site_url('patients/delete/' . $patient->patient_id); ?>" onclick="return confirm('<?php echo lang('delete_patient_warning'); ?>');"><i class="icon-remove"></i> <?php echo lang('delete'); ?></a>
		<!--get Queings-->
		<?php if($this->Mdl_queings->inQue($patient->patient_id)) { ?>
		<a class="btn btn-warning" href="<?php echo site_url('queings/remove/' . $this->Mdl_queings->inQue($patient->patient_id)->queing_id.'/1'); ?>" onclick="return confirm('<?php echo lang('delete_patient_warning'); ?>');"><i class="icon-trash"></i> <?php echo lang('delete'); ?></a>
		<?php } ?>
	</div>

</div>

<div class="tabbable tabs-below">

	<div class="tab-content">
		
		<div id="patientDetails" class="tab-pane tab-info active">
            
            <?php $this->layout->load_view('layout/alerts'); ?>

			<div class="profile">

				<div class="primaryInfo row">

					<div class="pull-left">
						<h2><?php echo $patient->patient_name; ?></h2>
						<br>
						<span>
							<?php echo ($patient->patient_address_1) ? $patient->patient_address_1 . '<br>' : ''; ?>
							<?php echo ($patient->patient_address_2) ? $patient->patient_address_2 . '<br>' : ''; ?>
							<?php echo ($patient->patient_city) ? $patient->patient_city : ''; ?>
							<?php echo ($patient->patient_state) ? $patient->patient_state : ''; ?>
							<?php echo ($patient->patient_zip) ? $patient->patient_zip : ''; ?>
							<?php echo ($patient->patient_country) ? '<br>' . $patient->patient_country : ''; ?>
						</span>
					</div>

					<div class="pull-right" style="text-align: right;">
						<span><strong><?php echo lang('total_billed'); ?>:</strong> <?php echo format_currency($patient->patient_invoice_total); ?></span><br>
						<span><strong><?php echo lang('total_paid'); ?>:</strong> <?php echo format_currency($patient->patient_invoice_paid); ?></span><br>
						<span><strong><?php echo lang('total_balance'); ?>:</strong> <?php echo format_currency($patient->patient_invoice_balance); ?></span>
					</div>

				</div>

				<dl>
					<dt><span><?php echo lang('contact_information'); ?></span></dt>
					<?php if ($patient->patient_email) { ?>
					<dd><span><?php echo lang('email'); ?>:</span> <?php echo auto_link($patient->patient_email, 'email'); ?></dd>
					<?php } ?>
					<?php if ($patient->patient_phone) { ?>
					<dd><span><?php echo lang('phone'); ?>:</span> <?php echo $patient->patient_phone; ?></dd>
					<?php } ?>
					<?php if ($patient->patient_mobile) { ?>
					<dd><span><?php echo lang('mobile'); ?>:</span> <?php echo $patient->patient_mobile; ?></dd>
					<?php } ?>
					<?php if ($patient->patient_fax) { ?>
					<dd><span><?php echo lang('fax'); ?>:</span> <?php echo $patient->patient_fax; ?></dd>
					<?php } ?>
					<?php if ($patient->patient_web) { ?>
					<dd><span><?php echo lang('web'); ?>:</span> <?php echo auto_link($patient->patient_web,'url', TRUE); ?></dd>
					<?php } ?>
				</dl>
                
                <dl class="profile-custom">
                    <dt><span><?php echo lang('custom_fields'); ?></span></dt>
                    <?php foreach ($custom_fields as $custom_field) { ?>
                    <dd><span><?php echo $custom_field->custom_field_label; ?>: </span> <?php echo $patient->{$custom_field->custom_field_column}; ?></dd>
                    <?php } ?>
                </dl>

                <br>
                
			</div>

			<div class="notes">

				<div id="notes_list">
					<?php echo $partial_notes; ?>
				</div>
                
				<form>
					<input type="hidden" name="patient_id" id="patient_id" value="<?php echo $patient->patient_id; ?>">
					<fieldset>

						<legend><?php echo lang('notes'); ?></legend>
						<div class="control-group">
							<div class="controls">
								<textarea id="patient_note"></textarea>
							</div>
						</div>

						<input type="button" id="save_patient_note" class="btn btn-primary" value="<?php echo lang('add_notes'); ?>">
					</fieldset>
				</form>

			</div>
		</div>

		<div id="patientQuotes" class="tab-pane">
			<?php echo $quote_table; ?>
		</div>

		<div id="patientInvoices" class="tab-pane">
			<?php echo $invoice_table; ?>
		</div>

	</div>

	<ul class="nav-tabs">
		<li class="active"><a data-toggle="tab" href="#patientDetails"><?php echo lang('details'); ?></a></li>
		<li><a data-toggle="tab" href="#patientuotes"><?php echo lang('quotes'); ?></a></li>
		<li><a data-toggle="tab" href="#patientInvoices"><?php echo lang('invoices'); ?></a></li>
	</ul>


</div>