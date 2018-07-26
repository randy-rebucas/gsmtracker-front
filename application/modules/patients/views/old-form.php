<script type="text/javascript">
$(function() {
   $('#patient_name').focus(); 
});
</script>

<form method="post" class="form-horizontal">

	<div class="headerbar">
		<h1><?php echo lang('patient_form'); ?></h1>
		<?php $this->layout->load_view('layout/header_buttons'); ?>
	</div>

	<div class="content">

		<?php $this->layout->load_view('layout/alerts'); ?>

        <fieldset>
            <legend><?php echo lang('personal_information'); ?></legend>

            <div class="control-group">
                <label class="control-label"><?php echo lang('active_patient'); ?>: </label>
                <div class="controls">
                    <input type="checkbox" name="patient_active" id="patient_active" value="1" <?php if ($this->Mdl_patients->form_value('patient_active') == 1 or !is_numeric($this->Mdl_patients->form_value('client_active'))) { ?>checked="checked"<?php } ?>>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label">* <?php echo lang('patient_name'); ?>: </label>
                <div class="controls">
                    <input type="text" name="patient_name" id="patient_name" value="<?php echo $this->Mdl_patients->form_value('patient_name'); ?>">
                </div>
            </div>

        </fieldset>
        
        <div class="row-fluid">
            
            <div class="span6">
                <fieldset>
                    <legend><?php echo lang('address'); ?></legend>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('street_address'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_address_1" id="patient_address_1" value="<?php echo $this->Mdl_patients->form_value('patient_address_1'); ?>">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('street_address_2'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_address_2" id="patient_address_2" value="<?php echo $this->Mdl_patients->form_value('patient_address_2'); ?>">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('city'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_city" id="patient_city" value="<?php echo $this->Mdl_patients->form_value('patient_city'); ?>">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('state'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_state" id="patient_state" value="<?php echo $this->Mdl_patients->form_value('patient_state'); ?>">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('zip_code'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_zip" id="patient_zip" value="<?php echo $this->Mdl_patients->form_value('patient_zip'); ?>">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('country'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_country" id="patient_country" value="<?php echo $this->Mdl_patients->form_value('patient_country'); ?>">
                        </div>
                    </div>
                </fieldset>
            </div>
            
            <div class="span6">
                <fieldset>

                    <legend><?php echo lang('contact_information'); ?></legend>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('phone_number'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_phone" id="patient_phone" value="<?php echo $this->Mdl_patients->form_value('patient_phone'); ?>">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('fax_number'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_fax" id="client_fax" value="<?php echo $this->Mdl_patients->form_value('patient_fax'); ?>">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('mobile_number'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_mobile" id="patient_mobile" value="<?php echo $this->Mdl_patients->form_value('patient_mobile'); ?>">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('email_address'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_email" id="patient_email" value="<?php echo $this->Mdl_patients->form_value('patient_email'); ?>">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label"><?php echo lang('web_address'); ?>: </label>
                        <div class="controls">
                            <input type="text" name="patient_web" id="patient_web" value="<?php echo $this->Mdl_patients->form_value('patient_web'); ?>">
                        </div>
                    </div>

                </fieldset>                
            </div>
            
        </div>

        <div class="row-fluid">
                
            <div class="span12">
                <fieldset>
                        
                        <legend><?php echo lang('custom_fields'); ?></legend>
                        
                        <?php foreach ($custom_fields as $custom_field) { ?>
                        <div class="control-group">
                            <label class="control-label"><?php echo $custom_field->custom_field_label; ?>: </label>
                            <div class="controls">
                                <input type="text" name="custom[<?php echo $custom_field->custom_field_column; ?>]" id="<?php echo $custom_field->custom_field_column; ?>" value="<?php echo form_prep($this->Mdl_patients->form_value('custom[' . $custom_field->custom_field_column . ']')); ?>">
                            </div>
                        </div>
                        <?php } ?>
                </fieldset>
            </div>

        </div>

	</div>

</form>