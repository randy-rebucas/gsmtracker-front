
<?php $this->layout->load_view('patients/jquery_patient_lookup'); ?>

<script type="text/javascript">
	var BASE_URL = '<?php echo base_url();?>';
	$(function()
	{
		$('.datepicker').datepicker( {autoclose: true, format: '<?php echo date_format_datepicker(); ?>'} );
		
		// Display the create quote modal
		$('#create-que').modal('show');
        
        $('#create-que').on('shown', function() {
            $("#patient_name").focus();
        });
        
        $('#patient_name').typeahead();
      
		// Creates the quote
		$('#que_create_confirm').click(function()
		{
			// Posts the data to validate and create the quote; 
			// will create the new client if necessary
			$.post("<?php echo site_url('queings/ajax/create'); ?>", { 
                patient_name: $('#patient_name').val(),
				visit_reason: $('#visit_reason').val(),
                visit_type: $('#visit_type option:selected').val(),
				user_id: '<?php echo $this->session->userdata('user_id'); ?>'
			},
			function(data) {
				var response = JSON.parse(data);
				if (response.success == '1')
				{
					// The validation was successful and quote was createdpatients/view/1
					window.location = "<?php echo site_url('patients'); ?>";
				}
				else
				{
					if(response.custom_error) {
						var res = response.custom_error;
						console.log(res.exist);
						$('.modal-body').prepend('<p class="alert alert-danger">'+res.exist+'</p>');
	
					} else {
						// The validation was not successful
						$('.control-group').removeClass('error');
						for (var key in response.validation_errors) {
							$('#' + key).parent().parent().addClass('error');
						}
					}
					
				}
			});
		});
	});
	
</script>

<div id="create-que" class="modal hide">
	<form class="form-horizontal">
		<div class="modal-header">
			<a data-dismiss="modal" class="close">x</a>
			<h3><?php echo lang('create_que'); ?></h3>
		</div>
		<div class="modal-body">

			<div class="control-group">
				<label class="control-label"><?php echo lang('patient'); ?>: </label>
				<div class="controls">
					<input type="text" name="patient_name" id="patient_name" value="<?php echo $patient_name; ?>" style="margin: 0 auto;" autocomplete="off">
				</div>
			</div>
            <div class="control-group">
				<label class="control-label"><?php echo lang('queing_type'); ?>: </label>
				<div class="controls">
                    <?php 
                        $visit_types = array(
                            ''=>'Select Type',
                            'check-up' => 'Check Up', 
                            'follow-up' => 'Follow Up', 
                        );
                        echo form_dropdown('visit_type', $visit_types, $this->Mdl_settings->setting('default_visit_type'),'tabindex="" id="visit_type"'); 
                    ?>
					
				</div>
			</div>
			<div class="control-group">
				<label class="control-label"><?php echo lang('queing_reason'); ?>: </label>
				<div class="controls">
					<textarea name="visit_reason" id="visit_reason"></textarea>
				</div>
			</div>
		</div>

		<div class="modal-footer">
            <button class="btn btn-danger" type="button" data-dismiss="modal"><i class="icon-white icon-remove"></i> <?php echo lang('cancel'); ?></button>
			<button class="btn btn-primary" id="que_create_confirm" type="button"><i class="icon-white icon-ok"></i> <?php echo lang('submit'); ?></button>
		</div>

	</form>

</div>