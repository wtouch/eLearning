<?php

	function loadTemplate($seo){
		global $config;
		try{
			$template = websiteManager::getTemplate();
			$data = websiteManager::getData();
			$routes = websiteManager::getRoutes();
			
			
			if($data['status'] == 'success'){
				$data = $data['data'];
			}else{
				throw new Exception($data['message']);
			}
			
			if($template['status'] == 'success'){
				$template = $template['data'];
			}else{
				throw new Exception($template['message']);
			}
			
			if($seo){
				// this is for seo template
				$rootUrl = ($config['uri'][1]=='index.php') ? "/".$config['uri'][1] : $config['host'];
				$currentUrl = ($config['uri'][1]=='index.php') ? $config['uri'][2] : $config['uri'][1];
				$routes = websiteManager::getRoutes();
				$routes = $routes["data"];
				$template_dir = "default/";
				include $config['root_path']."/website/seo_templates/default/index.php";
			}else{
				// this is for angular template
				if (file_exists($template['template_folder']) && is_dir($template['template_folder'])) {
					$template_dir = $template['template_folder'];
					include $config['template_path']."/".$template['template_folder']."/index.php";
				}else{
					$template_dir = "default";
					include $config['template_path']."default/index.html";
				}
			}
			
		
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = 'Error: ' .$e->getMessage();
            $response["data"] = null;
			echo json_encode($response);
		}
	}

?>