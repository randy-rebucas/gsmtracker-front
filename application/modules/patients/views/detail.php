<div class="row">	
		
	<fieldset>
		<legend>Personal Information</legend>
		<div class="col-md-3">
			<?php if($info->avatar){
				echo '<img src="'.$info->avatar.'" class="img-fluid"/>';
			}else{
				echo '<img src="' . $this->gravatar->get($info->email, 130) . '" style="width:100%;" />';
			}?>
			
		</div>
		<div class="col-md-9">
			<h3><?php echo $info->firstname.' '.$info->mi.' '.$info->lastname;?></h3>
			<address>
			  <?php echo $this->lang->line('__common_birthday');?> : <span><?php echo ($info->bYear) ? $info->bYear : '--'.' - '.($info->bMonth) ? $info->bMonth : '--'.' - '.($info->bDay) ? $info->bDay : '--';?></span><br>
			  <?php echo $this->lang->line('__common_age');?> : <span><?php echo ($info->age) ? $info->age : '--';?></span><br>
			  <?php echo $this->lang->line('__common_gender');?> : <span> 
			  <?php 
			  if($info->gender == 1){
				  $gender = $this->lang->line('__common_male');
			  }elseif($info->gender == 2){
				  $gender = $this->lang->line('__common_female');
			  }else{
				  $gender = $this->lang->line('__common_undefine');;
			  }
			  echo ($info->gender) ? $gender : '--';?></span><br>
			</address>

			<address>  
				<?php echo $this->lang->line('__common_username');?> : <strong><?php echo $info->username;?></strong><br>
				<?php echo $this->lang->line('__common_email');?> : <?php echo ($info->email) ? '<a href="mailto:'. $info->email.'">'.$info->email.'</a>' : '--';?><br>
				<?php echo $this->lang->line('__common_ip');?> : <span><?php echo $info->last_ip;?></span><br>
				<?php echo $this->lang->line('__common_last_login');?> : <span><?php echo $info->last_login;?></span><br>
				<?php echo $this->lang->line('__common_created');?> : <span><?php echo $info->created;?></span>
			 
			</address>

			<address>
			  <?php echo ($info->address) ? $info->address : '--';?><br>
			  <?php echo ($info->city) ? $info->city : '--'.', '.($info->state) ? $info->state : '--';?><br>
			  <?php echo ($info->country) ? $info->country : '--'.', '.($info->zip) ? $info->zip : '--';?><br>
			  <abbr title="Mobile Number">M:</abbr> <?php echo ($info->mobile) ? $info->mobile : '--';?><br>
			</address>
		</div>

	</fieldset>
	
	
	<!-- <fieldset>	
		<legend>Custom Fields</legend>
		<div class="col-md-12">
			<address>
				<?php foreach ($custom_fields as $custom_field) { ?>
				<?php echo $custom_field->custom_field_label.'<br/>'; ?>
				<?php } ?>
			</address>
		</div>
	</fieldset> -->
	
</div>
<script type="text/javascript">
    //runAllForms();

    
</script>