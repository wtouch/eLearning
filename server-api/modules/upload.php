<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->select("websites", $where);
			echo json_encode($data);
			
		}else{
			$where=array(); // this will used for user specific data selection.
			$limit['pageNo'] = $pageNo; // from which record to select
			$limit['records'] = $records; // how many records to select
			
			// this is used to select data with LIMIT & where clause
			$data = $db->select("websites", $where, $limit);
			
			// this is used to count totalRecords with only where clause
			$tootalDbRecords = $db->select("website", $where, $limit=null, $like);
			$totalRecords['totalRecords'] = count($tootalDbRecords['data']);
			
			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
		}
	}
	
	if($reqMethod=="POST"){
		//$insert = $db->insert("media", $body);
		function asBytes($ini_v) {
		   $ini_v = trim($ini_v);
		   $s = array('g'=> 1<<30, 'm' => 1<<20, 'k' => 1<<10);
		   return intval($ini_v) * ($s[strtolower(substr($ini_v,-1))] ?: 1);
		}
		// user parameters 
		$path = ($_POST['path']) ? "uploads/images/".$_POST['path'] : "uploads/images/";
		$userInfo = json_decode($_POST['userinfo']);
		$user_id = ($userInfo->user_id) ? $userInfo->user_id : null;
		if(isset($_FILES['file']) && $user_id !== null){
		
			$errors= array();        
			$file_name = $_FILES['file']['name'];
			$file_size = $_FILES['file']['size'];
			$file_tmp = $_FILES['file']['tmp_name'];
			$file_type = $_FILES['file']['type'];   
			
			if($file_size > asBytes(ini_get('upload_max_filesize'))){
				$response["status"] = "error";
				$response['message'] = 'File size cannot exceed '.ini_get('upload_max_filesize');
				echoResponse(200,$response);
			}               
			else{
				$fileDetails = array();
				$fileDetails['file_name'] = $path . $file_name;
				$fileDetails['url'] = $file_name;
				move_uploaded_file($file_tmp,"uploads/images/".$file_name);
				$response["status"] = "success";
				$response["message"] = $file_name." uploaded successfully!";
				$response['details'] = $fileDetails;
				echoResponse(200,$response);
			}
		}
		else{
			$response["status"] = "error";
			$response['message'] = 'No image found';
			echoResponse(200,$response);
		}
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("websites", $body, $where);
		echo json_encode($update);
	}
 ?>