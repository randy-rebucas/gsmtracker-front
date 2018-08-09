<style type="text/css">
	section#bod .select {
		margin-right: 1.6887em;
	}
	section#bod .row {
		padding-left: 1.3em;
	}
</style>
	

<fieldset>
	<legend>Basic Information</legend>
	<div class="row">
		<section class="col col-5">
			<label for="first_name"><?php echo $this->lang->line('common_first_name');?></label>
			<label class="input">
			
				<input type="text" name="first_name" id="first_name" value="<?php echo set_value('first_name');?>" placeholder="<?php echo $this->lang->line('common_first_name');?>" tabindex="5">

			</label>
		</section>
		<section class="col col-2">
			<label for="mi"><?php echo $this->lang->line('common_mi');?></label>
			<label class="input">
				
				<input type="text" name="mi" id="mi" value="<?php echo set_value('mi');?>" placeholder="<?php echo $this->lang->line('common_mi');?>" tabindex="6">
	
			</label>
		</section>
		<section class="col col-5">
			<label for="last_name"><?php echo $this->lang->line('common_last_name');?></label>
			<label class="input">
				
				<input type="text" name="last_name" id="last_name" value="<?php echo set_value('last_name');?>" placeholder="<?php echo $this->lang->line('common_last_name');?>" tabindex="7">
	
			</label>
		</section>
	</div>
	<div class="row">
		<section class="col col-3">
			<label for="state"><?php echo $this->lang->line('common_mobile');?></label>
			<label class="input">
			
				<input type="text" name="mobile" id="mobile" value="<?php echo set_value('mobile');?>" placeholder="<?php echo $this->lang->line('common_mobile');?>" tabindex="8">
	
				
			</label>
		</section>
		<section class="col col-3">
			<label for="gender">Gender</label>
			<label class="select">
				
				<?php $gender = array(
					''=>'select',
					'1'=> $this->lang->line('__common_male'),
					'2'=> $this->lang->line('__common_female')
				);
				echo form_dropdown('gender',$gender, '','tabindex="18" id="gender"'); ?>
				<i></i>

			</label>
		</section>

		<section class="col col-6"  id="bod">
			<label for="bod"><?php echo $this->lang->line('__birthdate');?></label>
			<div class="row">	
				<label class="select col-md-3">
					<?php 
						$cutoff = 1910;

					// current year
					$now = date('Y');
					// build years menu
					echo '<select name="year" id="year">' . PHP_EOL;
					echo '  <option value="">select</option>' . PHP_EOL;
					for ($y=$now; $y>=$cutoff; $y--) {
						// $selected = ($y == $info->bYear) ? 'selected="selected"' : '';
						// echo '  <option value="' . $y . '" '.$selected.'>' . $y . '</option>' . PHP_EOL;
						echo '  <option value="' . $y . '" >' . $y . '</option>' . PHP_EOL;
					}
					echo '</select>' . PHP_EOL;
					?>
					<i></i>

				</label>
				<label class="select col-md-3">
					
				<?php 
					// build months menu
					echo '<select name="month" id="month">' . PHP_EOL;
					echo '  <option value="">select</option>' . PHP_EOL;
					for ($m=1; $m<=12; $m++) {
						// $selected = ($m == $info->bMonth) ? 'selected="selected"' : '';
						// echo '  <option value="' . $m . '" '.$selected.'>' . date('M', mktime(0,0,0,$m)) . '</option>' . PHP_EOL;
						echo '  <option value="' . $m . '">' . date('M', mktime(0,0,0,$m)) . '</option>' . PHP_EOL;
					}
					echo '</select>' . PHP_EOL;
					?>
					<i></i>
				</label>
				<label class="select col-md-3">
					
				<?php 
					// build days menu
					echo '<select name="day" id="day">' . PHP_EOL;
					echo '  <option value="">select</option>' . PHP_EOL;
					for ($d=1; $d<=31; $d++) {
						// $selected = ($d == $info->bDay) ? 'selected="selected"' : '';
						// echo '  <option value="' . $d . '" '.$selected.'>' . str_pad($d, 2, "0", STR_PAD_LEFT) . '</option>' . PHP_EOL;
						echo '  <option value="' . $d . '">' . str_pad($d, 2, "0", STR_PAD_LEFT) . '</option>' . PHP_EOL;
					}
					echo '</select>' . PHP_EOL;
					?>
					<i></i>
				</label>
			</div>

		</section>
	</div>
	<div class="row">
		<section class="col col-6">
			<label for="country"><?php echo $this->lang->line('common_country');?></label>
			<label class="select"> 
				
				<?php echo form_dropdown('country', $this->location_lib->countries(), '','id="country"');?> 
				<i></i>
				
			</label>
		</section>
		<section class="col col-6">
			<label for="state"><?php echo $this->lang->line('common_state');?></label>
			<label class="select">
				
				<?php echo form_dropdown('state', '', '','tabindex="11" id="state"'); ?>
				<i></i> 
				
			</label>
		</section>
	</div>
	<div class="row">
		<section class="col col-6">
			<label for="city"><?php echo $this->lang->line('common_city');?></label>
			<label class="select">
				
				<?php echo form_dropdown('city', '', '','tabindex="12" id="city"'); ?>
				<i></i>
				
			</label>
		</section>
		<section class="col col-6">
			<label for="zip"><?php echo $this->lang->line('common_zip');?></label>
			<label class="input">
				
				<input type="text" name="zip" id="zip" value="<?php echo set_value('zipcode');?>" placeholder="<?php echo $this->lang->line('common_zip');?>" tabindex="13">
			
			</label>
		</section>
	</div>
	<section>
		<label for="address"><?php echo $this->lang->line('common_address');?></label>
		<label class="textarea">

			<textarea name="address" class="custom-scroll" id="address" placeholder="<?php echo $this->lang->line('common_address');?>" tabindex="15"></textarea>
		
		</label>
	</section>
</fieldset>