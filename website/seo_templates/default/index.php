<?php
global $config;
$filesPath = $config['http_template_path'].$template_dir;
 ?>
<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="<?php echo $filesPath ?>/css/bootstrap.min.css">
		<link rel="stylesheet" href="<?php echo $filesPath ?>/css/style.css">
		<script src="<?php echo $filesPath ?>/js/jquery.min.js"></script>
		<script src="<?php echo $filesPath ?>/js/bootstrap.min.js"></script>
		<script src="<?php echo $filesPath ?>/js/angular.min.js"></script>
		<script src="<?php echo $filesPath ?>/js/script.js"></script>
		<title>Welcome </title>
		<meta name="description" content="">
		<meta name="keywords" content="">
	</head>
	<body>
		<?php
		include ('header.php');
			  include ('navbar.php');
			  //if(file_exists($currentUrl.".php")){
				  include($currentUrl.".php");
			 // }
			  //include ('home.html');
			  include ('footer.html');
		?>
		

	</body>
</html>