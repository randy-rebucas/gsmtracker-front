<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <?php echo $template['metadata']; ?>
    <link rel="shortcut icon" href="../../favicon.ico" type="image/x-icon">
    <link rel="icon" href="../../favicon.ico" type="image/x-icon">

    <!-- Metro 4 -->
	<link rel="stylesheet" href="<?php echo base_url(); ?>bower_components/metro/build/css/metro-all.min.css">

    <!-- jQuery first, then Metro UI JS -->
    <!-- <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script> -->
    <script src="<?php echo base_url(); ?>bower_components/jquery/dist/jquery.min.js"></script>	
    <script src="<?php echo base_url(); ?>bower_components/metro/build/js/metro.min.js"></script>	

    <script src='<?php echo base_url(); ?>bower_components/jquery-validation/dist/jquery.validate.min.js'></script>
    <script src='<?php echo base_url(); ?>bower_components/jquery-form/dist/jquery.form.min.js'></script>

    <title><?php echo $template['title']; ?></title>

    
</head>
<body class="h-vh-100 bg-brandColor2">

    <?php echo $template['partials']['header'];?>

    <?php echo $template['body']; ?>

    <?php echo $template['partials']['sidebar'];?>

    <?php echo $template['partials']['footer'];?>
   
</body>
</html>