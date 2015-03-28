<?php

class websiteManager{
	private $domain;
	private function getDomain(){
		return $domain = $_SERVER['SERVER_NAME'];
	}

	public function getConfig(){
		try{
			$db = new dbHelper;
			$table = 'website';
			$domain = websiteManager::getDomain();
			$where['domain_name'] = $domain;
			$dbresult = $db->selectSingle($table, $where);
			
			if($dbresult['status'] == 'success' && $dbresult['data'] != null) {
				$dbresult = $dbresult['data'];
				$config['domain_name'] = $dbresult['domain_name'];
				$config['website_id'] = $dbresult['id'];
				$config['website_config'] = json_decode($dbresult['config']);
				$config['user_id'] = $dbresult['user_id'];
				$config['expired'] = $dbresult['expired'];
			}else{
				throw new Exception('Website not registered!');
			}
			
			$response["status"] = "success";
            $response["message"] = "Website Data added to config!";
            $response["data"] = $config;
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
		}
		return $response;
	}
	public function getTemplate(){
		try{
			$db = new dbHelper;
			$config = websiteManager::getConfig();
			if($config['status'] == 'success'){
				$config = $config['data'];
			}else{
				throw new Exception("Website Configuration error: ".$config['message']);
			}
			$table = "template";
			$template_id = $config['website_config']->template_id;
			$where["id"] = $template_id;
			if($template_id == 0){
				$templateDetails["template_folder"] = "default";
				$templateDetails["template_image"] = "default/preview.png";
			}else{
				$dbresult = $db->selectSingle($table, $where);
				
				if($dbresult['status'] == "success"){
					$templateDetails["template_name"] = $dbresult['data']['template_name'];
					$templateDetails["template_folder"] = $dbresult['data']['category'];
					$templateDetails["template_image"] = $dbresult['data']['template_image'];
				}else{
					throw new Exception("Template DB Error: ".$dbresult['message']);
				}
			}
			$response["status"] = "success";
            $response["message"] = "Template - ".$templateDetails["template_name"]." Selected!";
            $response["data"] = $templateDetails;
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = 'Error: ' .$e->getMessage();
            $response["data"] = null;
		}
		return $response;
	}
	public function getData(){
		try{

			$db = new dbHelper;
			$config = websiteManager::getConfig();
			if($config['status'] == 'success'){
				$config = $config['data'];
			}else{
				throw new Exception("Website Configuration error: ".$config['message']);
			}
			// get data for view from product table, business table, users table, template table
			$where['id'] = $config['website_config']->business_id;
			$whereProd['business_id'] = $config['website_config']->business_id;
			$whereProd['user_id'] = $config['user_id'];
			
			$businessTable = "business";
			$productTable = "product";
			// inner join [table name][first table column name] = [second table column name]
			$innerJoinProd['business']['business_id'] = "id";
			$innerJoin['users']['user_id'] = "id";
			
			// inner join select column [table name][join col name][column to select] = column alias
			$selectInnerJoinColsProd['business']['business_id']['business_name'] = "business_name";
			
			$selectInnerJoinCols['users']['user_id']['name'] = "owner_name";
			$selectInnerJoinCols['users']['user_id']['email'] = "owner_email";
			$selectInnerJoinCols['users']['user_id']['address'] = "owner_address";
			$selectInnerJoinCols['users']['user_id']['country'] = "owner_country";
			$selectInnerJoinCols['users']['user_id']['state'] = "owner_state";
			$selectInnerJoinCols['users']['user_id']['phone'] = "owner_phone";
			$selectInnerJoinCols['users']['user_id']['website'] = "owner_website";
			$selectInnerJoinCols['users']['user_id']['fax'] = "owner_fax";
			
			$productDbData = $db->selectJoin($productTable, $whereProd, $limit=null, $likeFilter=null, $innerJoinProd, $selectInnerJoinColsProd, $leftJoin = null, $selectLeftJoinCols = null);
			
			$businessData = $db->selectSingleJoin($businessTable, $where, $innerJoin, $selectInnerJoinCols, $leftJoin = null, $selectLeftJoinCols = null);
			
			if($productDbData['status'] != "success"){
				throw new Exception("Product DB Table Error: ".$dbresult['message']);
			}else if($businessData['status'] != "success"){
				throw new Exception("Business DB Table Error: ".$dbresult['message']);
			}
			
			$serviceData = array();
			$productData = array();
			
			if($productDbData['status'] == "success" && $productDbData['data'] != ""){
				foreach ($productDbData['data'] as $index => $dataArr){
					//$serviceData[$index] = $dataArr;
					if($dataArr['type'] == 'service' ){
						foreach($dataArr as $key => $value){
							$DataArray[$key] = (substr($value,0,1) !== "{") ? $value : json_decode($value);
						}
						array_push($serviceData,$DataArray);
					}
					if($dataArr['type'] == 'product' ){
						foreach($dataArr as $key => $value){
							$DataArray[$key] = (substr($value,0,1) !== "{") ? $value : json_decode($value);
						}
						array_push($productData,$DataArray);
					}
				}
			}
			if($businessData['status'] == "success"){
				foreach ($businessData['data'] as $key => $value){
					$bizData[$key] = (substr($value,0,1) !== "{") ? $value : json_decode($value);
				}
			}
			$data['business'] = $bizData;
			$data['products'] = $productData;
			$data['services'] = $serviceData;
			
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $data;
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = 'Error: ' .$e->getMessage();
            $response["data"] = null;
		}
		return $response;
	}
	
	public function getRoutes(){
		try{
			
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = array('home', 'about', 'products', 'services', 'contact', 'careers', 'testimonials', 'activities');
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = 'Error: ' .$e->getMessage();
            $response["data"] = null;
		}
		return $response;
	}
}