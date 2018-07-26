<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <meta name="author" content="<?php echo $author;?>">
    <meta name="description" content="<?php echo $description;?>">
    <meta name="keywords" content="<?php echo $keywords;?>">

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
    <script src='<?php echo base_url(); ?>bower_components/jquery-mask-plugin/dist/jquery.mask.min.js'></script>

    <title><?php echo $title;?></title>

    
</head>
<body class="h-vh-100 bg-brandColor2">
    <?php echo $content; ?>
   
</body>
</html>