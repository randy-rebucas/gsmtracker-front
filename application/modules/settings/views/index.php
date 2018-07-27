<script type="text/javascript">
$().ready(function() {
    $('#btn-submit').click(function() {
        $('#form-settings').submit();
    });
});  
</script>
<script type="text/javascript">
    $(function()
    {
        $('#btn_generate_cron_key').click(function()
        {
            $.post("<?php echo site_url('settings/ajax/get_cron_key'); ?>", function(data) {
                $('#cron_key').val(data);
            });
        });
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
        <label><?php echo lang('language'); ?></label>
        <select name="settings[date_format]">
			<?php foreach ($date_formats as $date_format) { ?>
			<option value="<?php echo $date_format['setting']; ?>" <?php if ($this->Mdl_settings->setting('date_format') == $date_format['setting']) { ?>selected="selected"<?php } ?>><?php echo $current_date->format($date_format['setting']); ?></option>
			<?php } ?>
		</select>
        <small class="text-muted">Select a date format.</small>
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
        <button class="button success">Submit data</button>
        <input type="button" class="button" value="Cancel">
    </div>
</form>