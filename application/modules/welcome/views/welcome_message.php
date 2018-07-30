<!-- Main (Home) section -->
<style type="text/css">
	#head {
	    margin-top: 10%;
	}
	ul.list-inline.list-social {
	    display: grid;
	    grid-template-columns: 1fr 1fr;
	    margin: 0 auto;
	    padding: 2em 0;
		width: 20%;
	}
</style>
<section id="head">
	<div class="container bg-blur">

		<div class="row">
			<div class="col-md-12 col-lg-12 text-center">	

				<!-- Site Title, your name, HELLO msg, etc. -->
				<h1 class="title"><?php echo $this->config->item('app_name');?></h1>
				<h2 class="subtitle"><?php echo $this->config->item('app_tag');?></h2>

				<!-- Short introductory (optional) -->
				<h3 class="tagline">
					Welcome to <?php echo $this->config->item('app_name');?> – were doctors are in.<br>
				</h3>
				
				<!-- Nice place to describe your site in a sentence or two -->
				<p class=""><a href="<?php echo site_url('auth/login');?>" class="btn btn-success btn-lg">Login</a> &nbsp; <a href="<?php echo site_url('auth/register');?>" class="btn btn-default btn-lg">Register</a></p>
	
			</div> <!-- /col -->
		</div> <!-- /row -->
		
		
		<div class="row">
			<div class="col-sm-12 col-md-12 col-lg-12 text-center">
				<ul class="list-inline list-social">
					<li style="display:none;"><a target="blank" href="https://twitter.com/serggg" class="btn btn-link"><i class="fa fa-twitter fa-fw"></i> Twitter</a></li>
					<li><a target="blank" href="https://www.linkedin.com/company/myclinicsoft" class="btn btn-link"><i class="fa fa-linkedin fa-fw"></i> LinkedIn</a></li>
					<li><a target="blank" href="https://business.facebook.com/myclinicsoftware/" class="btn btn-link" ><i class="fa fa-facebook fa-fw"></i> Facebook</a></li>
				</ul>
			</div>
		</div>
	</div>
</section>