<div class="list-group">
<?php if (isset($sms) && count($sms)) {
    if($type != 'aoutbox'){
    ?> 
    <li class="list-group-item">
        <div class="row">
            <div class="col-md-1">
                <input type="checkbox" class="checkbox parent-sms" />
            </div>
            <div class="col-md-11">
                <input type="button"  id="mark-read-sms" value="Mark as read" class="btn btn-primary"/>
                <input type="button"  id="mark-unread-sms" value="Mark as Unread" class="btn btn-default" />
                <!--<input type="button"  id="delete_inbox" value="Move to archive" class="btn btn-danger" />-->
            </div>
        </div>
    </li>
     
    <?php } foreach ($sms as $row) { ?>  
<li class="list-group-item <?=(!$row->is_read)?'unread':'read'?> ">
<div class="row">
    <div class="col-md-1">
        <input type="checkbox" class="checkbox child-sms" value="<?=$row->id?>" />
    </div>
        <div class="col-md-6">
                <?php  
                if($row->status == 'received')
                    echo  $row->send_from .' - '.$row->message; 
                else
                    echo  $row->send_to .' - '.$row->message; 
                ?>
        </div>
          
        <div class="col-md-2">
            <?php if($row->status == 'sent') { 
             ?>
            <span class="label label-warning">Sent</span>
            <?php } elseif(strtolower($row->status) == 'delivrd') { ?>
            <span class="label label-success">Delivered</span>
            <?php } elseif(strtolower($row->status) == 'expired') { ?>
            <span class="label label-danger">Expired</span>
            <?php } elseif(strtolower($row->status) == 'undeliv') {?>
            <span class="label label-warning">Un delivered</span>
            <?php } ?>
        </div>
          
        <div class="col-md-1">
                <?php echo date('d/m/Y h:i:s A', strtotime($row->created))?> <?php //echo $row_by->first_name. ' ' .$row_by->last_name ;?>
        </div>
</div>
 
</li>
<?php
} ?>
<?php } else { ?>
 
                <div class="alert alert-info" role="alert">
You don't have any SMS. 
</div>
 
<?php } ?>    
</div>
<script src="<?=  base_url()?>assets/plugins/jQuery.pulsate.min.js" type="text/javascript"></script>
<script>
$(document).ready(function(){
    $(".parent-sms").click(function(){
         
        if($(this).is(":checked")) {
            $(".child-sms").prop("checked",true);
        } else {
              $(".child-sms").prop("checked",false);
        }
    })
})
$(document).on('click', '#mark-read-sms', function(e) {
    var chkId = new Array();
    if ($('.child-sms:checked').length) {
 
        $('.child-sms:checked').each(function () {
          chkId.push($(this).val());
        });
        $.ajax({
            url: BASE_URL + 'sms/flag_read',
            data: {
                id:chkId
            },
            type: "POST",
            //dataType: 'json',
            beforeSend: function(){
                $('#mark-read-sms').attr("disabled", "disabled"); 
                $('#mark-unread-sms').attr("disabled", "disabled"); 
            },
            success: function(data, status) {
                $('#mark-read-sms').removeAttr('disabled');
                $('#mark-unread-sms').removeAttr('disabled');
                $('#inbox_tab').trigger('click');
                 
            }
        });
    }
    else {
      alert('Nothing Selected');
    }
});
$(document).on('click', '#mark-unread-sms', function(e) {
    var chkId = new Array();
    if ($('.child-sms:checked').length) {
 
        $('.child-sms:checked').each(function () {
          chkId.push($(this).val());
        });
        $.ajax({
            url: BASE_URL + 'sms/flag_unread',
            data: {
                id:chkId
            },
            type: "POST",
            //dataType: 'json',
            beforeSend: function(){
                $('#mark-read-sms').attr("disabled", "disabled"); 
                $('#mark-unread-sms').attr("disabled", "disabled"); 
            },
            success: function(data, status) {
                $('#mark-unread-sms').removeAttr('disabled');
                $('#mark-read-sms').removeAttr('disabled');
                $('#inbox_tab').trigger('click');
                 
                 
            }
        });
    }
    else {
      alert('Nothing Selected');
    }
});
$(".unread").pulsate({reach:100,color:"#09f",pause:1000});   
</script>