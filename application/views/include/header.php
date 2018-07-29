
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
		<link rel="stylesheet" href="<?php echo base_url(); ?>bower_components/metro/build/css/third-party/datatables.css">
		<script type="text/javascript">
			var BASE_URL = '<?php echo base_url();?>';
		</script>
		

		<title><?php echo $template['title']; ?></title>

		<style>
			.sidebar {
			    width: 20%;
			    float: left;
			    transform: unset;
			}
			.shifted-content {
			    width: 80%;
			    float: right;
			}
			.sidebar-header>.que {
				font-size: 12px;
				font-weight: 300;
				top: 116px;
				right:10%;
				display: block;
				position: absolute;
				color: #fff;
			}
			.date-picker .day, .date-picker .month, .date-picker .year {
			    height: 34px;
			    line-height: 34px;
			}
		</style>
		<script type="text/javascript">
			jsArray = {};

			function loadScript(a, b) {
				
				jsArray[a] = !0;
				var c = document.getElementsByTagName("body")[0],
					d = document.createElement("script");
				d.type = "text/javascript", d.src = a, d.onload = b, c.appendChild(d)
				
			}
		</script>
	</head>
	<body class="">