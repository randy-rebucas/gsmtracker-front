<?php echo form_open('sms/send','class="form-horizontal" id="sms-send-form" onsubmit="return false"');?>
     
      <div class="form-group">
        <label class="col-sm-3 control-label">To</label>
          <div class="col-sm-9">
           <input type="text" name="to" id="to" class="form-control" value="<?php echo $to;?>">
           <input type="hidden" name="token" id="token" class="form-control" value="<?php echo $token;?>">
           <input type="hidden" name="type" id="type" class="form-control" value="<?php echo $type;?>">
          </div> 
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">Message</label>
          <div class="col-sm-9">
              <textarea name="msg"  id="msg" rows='5' class="form-control"><?php if(isset($body) AND !empty($body))echo $body;?></textarea>
          </div>
      </div>
 
<?php echo form_close(); ?> 
    

<script>
    var validatefunction = function() {

        $("#sms-send-form").validate({
            rules: {
                to: {required: true, maxlength: 12},
                msg: {required: true, maxlength: 300},
            },
            messages: {
                to: {
                    required : '<i class="fa fa-times-circle"></i> Please add recepient.',
                    maxlength : '<i class="icon-times-sign"></i> The recepient can not exceed 12 characters in length.'
                },
                msg: {
                    required : '<i class="fa fa-times-circle"></i> Please compose message.',
                    maxlength : '<i class="icon-times-sign"></i> The message can not exceed 300 characters in length.'
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
            submitHandler: function(form) {
                $(form).ajaxSubmit({
                    beforeSend: function () {
                        $(form).find('#submit').html('Please wait...');
                        $(form).find('#submit').attr("disabled", "disabled");
                    },
                    success:function(response)
                    {
                        if(response)
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

                    },
                    dataType:'json'
                });
                           
            }
        });
    }

    loadScript(BASE_URL+"js/plugin/jquery-validate/jquery.validate.min.js", function(){
        loadScript(BASE_URL+"js/plugin/jquery-form/jquery-form.min.js", validatefunction);
    });

    jQuery.validator.addMethod("mobileAU", function(value, element) {
            return this.optional(element) || /^0\d{9}$/.test(value.replace(/\s+/g, ""));
    }, jQuery.validator.messages.mobileAU || "Please specify a valid mobile phone number");
   

</script>