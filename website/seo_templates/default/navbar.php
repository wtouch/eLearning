<?php 
global $config;
?>	
<nav class="navbar navbar-default">
	<div class="container">
    <!-- Brand and toggle get grouped for better mobile display -->		
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul class="nav navbar-nav" >
				<?php foreach($routes as $route):?>
				<li <?php if($currentUrl==$route) echo 'class="active"' ?>><a href="http://<?php echo $rootUrl."/".$route ?>" style="background-color: #C0D51E;"><?php echo $route ?></a></li>
				<?php endforeach; ?>
			</ul>
		</div>	
	</div>	
</nav>