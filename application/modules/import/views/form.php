<style type="text/css">
    #view-tip {
        
    }
</style>
<?php echo form_open_multipart('import/import_csv', array('id'=>'item_form', 'class'=>'smart-form'));?>

    <div id="required_fields_message">Import data from Excel sheet! <a href="" id="view-tip">View Tip</a></div>

    <b><a href="<?php echo site_url($template_path); ?>">Export to template (CSV) </a></b>
    <div id="tip" style="display:none;">
        <?php echo isset($notes)? $notes :''; ?>
    </div>
    <fieldset>
        <section>
            <label class="label">Upload File (.xml)</label>
            <div class="input input-file">
                <span class="button"><input type="file" id="file_path" name="file_path" value="" onchange="this.parentNode.nextSibling.value = this.value">Select</span><input type="text" readonly="">
            </div>
        </section>
    </fieldset>
    <footer>
        <button type="submit" class="btn btn-primary">
            Submit
        </button>
    </footer>
<?php echo form_close(); ?> 

<script type="text/javascript">
 
    $(document).ready(function() {
     
        $('#view-tip').click(function() {
            $('#tip').toggle( "slow", function() {
                // Animation complete.
            });
        });

    });

    var validatefunction = function() {

        $("#item_form").validate({
            rules: {
                file_path: "required",
            },
            messages: {
                file_path: {
                    required : '<div class="error"><i class="icon-exclamation-sign"></i> The file address is required !!!</div>'
                },
            },
            highlight: function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorElement: 'span',
            errorClass: 'text-danger',
            errorPlacement: function(error, element) {
                if(element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                }else{
                    error.insertAfter(element);
                }
            },
            // Ajax form submition
            submitHandler : function(form) {
                
                $(form).ajaxSubmit({
                    beforeSend: function () {
                        $(form).find('#submit').html('Please wait...');
                        $(form).find('#submit').attr("disabled", "disabled");
                    },
                    success:function(response)
                    {
                        if(response.success)
                        {
                            mcs.init_smallBox("success", response.message);
                            $('.bootbox-close-button').trigger('click');
                            checkURL();
                        }
                        else
                        {
                            mcs.init_smallBox("error", response.message);
                        }                   
                        $(form).find('#submit').text('Submit');
                        $(form).find('#submit').removeAttr("disabled");

                        $('body').find('.create').attr('disabled', false);
                    },
                    dataType:'json'
                });
            }
        });
    }

    loadScript(BASE_URL+"js/plugin/jquery-validate/jquery.validate.min.js", function(){
        loadScript(BASE_URL+"js/plugin/jquery-form/jquery-form.min.js", validatefunction);
    });
</script>