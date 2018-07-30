<style>
#tbl-records label.checkbox {
    text-align: left;
}
</style>

	<fieldset>
		<legend>Information</legend>
        <dl class="dl-horizontal">
            <dt>Name of Record</dt>
            <dd><?php echo $info->name;?></dd>

            <dt>Description</dt>
            <dd><?php echo $info->description;?></dd>

            <dt>Status</dt>
            <dd><?php echo ($info->status == 1) ? 'Enabled' : 'Diabled';?></dd>
        </dl>

	</fieldset>
    <?php if($info->record_id) { ?>
    <fieldset id="custom-field-section">
        <legend>Custom Fields</legend>
            <?php
            if($fields->num_rows() > 0) {
                echo '<table class="table" id="custom_fields">
                    <thead><tr><th>Field Name</th><th>Field Type</th><th>Is Required</th></thead>
                <tbody>';
                foreach ($fields->result() as $custom_field) { 
                    echo '<tr id="row-'.$custom_field->custom_field_id.'">';
                    echo '<td>'.$custom_field->custom_field_label.'</td>'; 
                    echo '<td>'.$custom_field->custom_field_type.'</td>';
                    echo '<td>';
                    echo ($custom_field->custom_field_is_required == 1) ? 'Yes' : 'No';
                    echo '</td>';
                    echo '</tr>';
                }
                echo '</tbody></table>';
            }else{
                echo '<p class="alert alert-info">No custom fields set!.</p>';
            }  ?>
    </fieldset>
    <?php } ?>

  
<script type="text/javascript">
    
    pageSetUp();


</script>