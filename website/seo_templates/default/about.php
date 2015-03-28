<?php
	//print_r($data['business']);
?>
<div class="container">
	<h2> <?php echo $data['business']['business_name'] ?> </h2>
	<div> <?php echo $data['business']['business_info']->description ?> </div>
</div>