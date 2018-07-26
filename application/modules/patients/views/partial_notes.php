<?php foreach ($patient_notes as $patient_note) { ?>
<div class="alert alert-info">
	<p><strong><?php echo date_from_mysql($patient_note->patient_note_date, TRUE); ?></strong>: <?php echo nl2br($patient_note->patient_note); ?></p>
</div>
<?php } ?>