<style>
.modal .modal-dialog {
    width: 95%
}
.var-val{
	display:none;
}
div#template-frm {
    padding: 0 10px;
}
button#submit {
    margin-bottom: 10px;
}
.panel-body {
    padding: 10px 18px;
}
.btn-rx {
    float: right;
    height: 31px;
    margin: 22px 0 0 8px;
    padding: 0 22px;
    font: 300 15px/29px 'Open Sans',Helvetica,Arial,sans-serif;
    cursor: pointer;
}
</style>

<div class="row">
	<div class="col-md-12">	
		<?php echo form_open('templates/doSave/'.$info->temp_id,'class="smart-form" id="templates-form"');?>

		<fieldset>
			<div class="row">
				<section class="col col-4">
					<label class="label">Template Preset</label>
					<label class="select">
						<?php echo form_dropdown('templates',$templates, '','tabindex="" id="templates"'); ?>
						<i></i>
					</label>
				</section>
				<section class="col col-4">
					<label class="label">Name</label>
					<label class="input">
						<input type="text" name="tname" id="tname" value="<?php echo set_value('tname', $info->temp_name);?>" placeholder="Name" tabindex="1">
					</label>
				</section>
				<section class="col col-2">
					<label class="label">Type</label>
					<label class="select">
						<?php 
						$types = array(
							''=>'Select',
							'rxpad'=>'RX Pad',
							'form'=>'Form'
						);
						echo form_dropdown('ttypes',$types, $info->temp_type,'tabindex="" id="ttypes"'); ?>
						<i></i>
					</label>
				</section>
				<section class="col col-2">
					<label class="label">&nbsp;</label>
					<label class="checkbox">
						<input type="checkbox" name="tstatus" id="tstatus" value="1" <?php if($info->temp_status == 1) echo 'checked';?>>
						<i></i>Enable
					</label>
				</section>
				
			</div>
			
			<section>
				<textarea name="ckeditor"><?php echo $info->temp_content; ?></textarea>	
			</section>

			<section>
				<button type="submit" name="submit" class="btn btn-primary btn-rx">
					Submit
				</button>
			</section>
		</fieldset>
		
		</form>	
	</div>
	
</div>  
<script type="text/javascript">
	//var $j = jQuery.noConflict();
	
    runAllForms();
	loadScript(BASE_URL+"js/bootbox.min.js");
	
	var ckeditor = function() {

		editor = CKEDITOR.replace( 'ckeditor', { height: '380px', startupFocus : true} );
		//editor = CKEDITOR.replace('ckeditor')
		editor.addCommand("variables", {
			exec: function(edt) {
				//alert(edt.getData());

				$.ajax({
					url: BASE_URL+'templates/variables',
					onError: function () {
						bootbox.alert('<?php //echo $this->lang->line('__bootbox_error');?>');
					},
					success: function (response)
					{
						var dialog = bootbox.dialog({
							title: 'Insert Variable',
							className: "dialog-50",
							message: '<p class="text-center"><img src="'+BASE_URL+'img/ajax-loader.gif"/></p>',
							buttons: {
								cancel: {
									label: 'Cancel',
									className: 'btn-danger'
								}
							}
						});
						dialog.init(function(){
							setTimeout(function(){
								dialog.find('.bootbox-body').html(response);
							}, 3000);
						});
					}
				});
	
			}
		});
		editor.ui.addButton('SuperButton', {
			label: "Add Vaiable",
			command: 'variables',
			toolbar: 'insert',
			icon: 'http://www.clker.com/cliparts/7/X/W/X/D/r/curly-brackets-hi.png'
		});
		
	}
	
	loadScript(BASE_URL+"js/plugin/ckeditor/ckeditor.js", ckeditor);
	
	var pagefunction = function() {

		$('#templates').change(function () {
			
			var id = $(this).val();

			$.ajax({
				url: BASE_URL+'templates/preset/' + id,
				type: "POST",
				beforeSend: function () {
					CKEDITOR.instances['ckeditor'].setData('<img src="'+BASE_URL+'img/ajax-loader.gif"/>');
				},
				success: function (data, textStatus, jqXHR) {
					//$("#tcontent").code(data); //.summernote('code');
					CKEDITOR.instances['ckeditor'].setData(data);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//if fails    
					alert(request.responseText);
				}
			});

			return false;
		});
	
	};
	
	// selected identifier
	var selected;

	$(document).on('click', '.var', function () {
		
		var toInsert = $(this).next('.var-val').html();
		var Itemname = 'ckeditor';

		if(CKEDITOR.instances[Itemname].mode=='wysiwyg'){
            
			CKEDITOR.instances[Itemname].insertText(toInsert);
        
		}else{
			
            var input = document.getElementsByClassName('cke_source cke_enable_context_menu')[0];
            input.focus();
            
            if(typeof input.selectionStart != 'undefined')
            {
               /* Einfügen des Formatierungscodes */
               var start = input.selectionStart;
               var end = input.selectionEnd;
                  
               input.value = input.value.substr(0, start) + toInsert + input.value.substr(end);
               /* Anpassen der Cursorposition */
               var pos;
                  
               pos = start+toInsert.length;
                       
               input.selectionStart = pos;
               input.selectionEnd = pos;
            }
        }

	});

	// reset selected
	$(document).on('click', function () {
		$('.selected').removeClass('selected');
		selected = '';
	});
	
	

	var pagedestroy = function(){
		
		// destroy summernote
		$("#tcontent").summernote( 'destroy' );

	}
	
	// load summernote, and all markdown related plugins
	loadScript(BASE_URL+"js/summernote.js", pagefunction);
	
	//loadScript(BASE_URL+"js/jquery-1.10.2.min.js");
	//loadScript(BASE_URL+"js/jqueryui-1.10.3.min.js");

    var validatefunction = function() {

        $("#templates-form").validate({
            // Rules for form validation
            rules : {
                tname : {
                    required : true,
                    maxlength: 50
                },
                ttypes : {
                    required : true
                }
            },

            // Messages for form validation
            messages : {
                tname : {
                    required : '<i class="fa fa-times-circle"></i> Please add template name',
                    maxlength: '<i class="fa fa-times-circle"></i> The template name can not exceed 50 characters in length.'
                },
                ttypes : {
                    required : '<i class="fa fa-times-circle"></i> Please select template'
                }
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
                var _name = $("#tname").val(); 
				var _content = CKEDITOR.instances['ckeditor'].getData();//$("#tcontent").code();
				var _type = $("#ttypes").val();
				var _status = $("#tstatus").val();
			
                $(form).ajaxSubmit({
					data: {
						name: _name, 
						content: _content, 
						types: _type, 
						status: _status
					},
                    beforeSend: function () {
                        $('#submit').html('Please wait...');
                        $('#submit').attr("disabled", "disabled");
                    },
                    success:function(response)
                    {
                        if(response.success)
                        {
                            $.smallBox({
                                title : "Success",
                                content : response.message,
                                color : "#739E73",
                                iconSmall : "fa fa-check",
                                timeout : 3000
                            });
                            $('.bootbox-close-button').trigger('click');
                            checkURL();
                        }
                        else
                        {
                            $.smallBox({
                                title : "Error",
                                content : response.message,
                                color : "#C46A69",
                                iconSmall : "fa fa-warning shake animated",
                                timeout : 3000
                            });
                            
                        }                   
                        $('#submit').text('Submit');
                        $('#submit').removeAttr("disabled");
                    },
                    dataType:'json'
                });
            }
        });
    }

	loadScript(BASE_URL+"js/plugin/jquery-validate/jquery.validate.min.js", function(){
		loadScript(BASE_URL+"js/plugin/jquery-form/jquery-form.min.js", validatefunction);
	});
	
	jQuery.fn.extend({
		insertAtCaret: function (myValue) {
			return this.each(function (i) {
				if (document.selection) {
					//For browsers like Internet Explorer
					this.focus();
					sel = document.selection.createRange();
					sel.text = myValue;
					this.focus(myValue);
				}
				else if (this.selectionStart || this.selectionStart == '0') {
					//For browsers like Firefox and Webkit based
					var startPos = this.selectionStart;
					var endPos = this.selectionEnd;
					var scrollTop = this.scrollTop;
					this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
					this.focus();
					this.selectionStart = startPos + myValue.length;
					this.selectionEnd = startPos + myValue.length;
					this.scrollTop = scrollTop;
				} else {
					this.value += myValue;
					this.focus();
				}
			})
		}
	});
</script>