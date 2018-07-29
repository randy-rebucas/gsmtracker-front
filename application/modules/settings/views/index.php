<script type="text/javascript">
$(document).ready(function() {
    $('#btn-submit').click(function() {
        $('#form-settings').submit();
    });

    // $('.file').find('.rtl').remove();
});  
</script>

<form action="settings/doSettings" method="post" class="form-horizontal" id="form-settings" enctype="multipart/form-data">

    <div class="form-group">
        <label><?php echo lang('language'); ?></label>
        <?php 
				$languages = array(
					'english'=>'English'
				);
				echo form_dropdown('settings[default_language]', $languages, $this->Mdl_settings->setting('default_language'));
			?>
        <small class="text-muted">Select a language.</small>
	</div>

	<div class="form-group">
		<label><?php echo lang('login_logo'); ?></label>
		<?php if ($this->Mdl_settings->setting('login_logo')) { ?>
            <img src="<?php echo base_url(); ?>uploads/<?php echo $this->Mdl_settings->setting('login_logo'); ?>"><br>
            <?php echo anchor('settings/remove_logo/login', 'Remove Logo'); ?><br>
        <?php } ?>
        <input type="file" name="login_logo" dir="rtl" data-role="file">
        <small class="text-muted">Upload logo</small>
	</div>
	<div class="form-group">
        <button type="submit" class="button success">Submit</button>
    </div>
</form>