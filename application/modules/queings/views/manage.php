<!-- Suggestion: populate this list with fetch and push technique -->
<ul class="dropdown-menu">
	<?php if(count($results)) { ?>
		<?php foreach ($results as $items){?>
		<li> 
			<a href="<?php echo site_url('patients/record/'.$items['user_id']);?>"><strong><?php echo $items['que_id'];?> </strong> &nbsp; <?php echo $items['que_name']; ?></a> 
		</li>
		<?php } ?>
		
		<li class="divider"></li>
		<li>
			<a href="<?php echo site_url('queings/ajax/clear_all');?>" class="clear-all"><i class="fa fa-power-off"></i> Clear</a>
		</li>
	<?php }else{
		echo '<li><a href="javascript:;">No waiting patients.</a></li>';
	}?>
</ul>
<!-- end dropdown-menu-->
<script type="text/javascript">
	$('.clear-all').click(function(e) { 
		$.ajax({
			url: $(this).attr('href'),
			type: 'post',
			success: function(response) {
				if(response)
				{
					mcs.init_smallBox("success", response.message);
					mcs.init();
				}
				else
				{
					mcs.init_smallBox("error", response.message);
				} 
			}
		});
		e.preventDefault();	
	});
</script>
