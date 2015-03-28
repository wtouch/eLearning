<?php
	function getMultipleUsers($limit){
		$db = new dbHelper();
		$where=array(); // this will used for user specific data selection.
			$like = array();
			 if(isset($_GET['search']) && $_GET['search'] == true){
				 
				 (isset($_GET['username'])) ? $like['username'] = $_GET['username'] : "";
			 }
			
			$table = "users";
			// inner join [table name][first table column name] = [second table column name]
			$innerJoin['user_group']['group_id'] = "id";
			
			
			// inner join select column [table name][join col name][column to select] = column alias
			$selectInnerJoinCols['user_group']['group_id']['group_name'] = "group_name";
			$selectInnerJoinCols['user_group']['group_id']['config'] = "group_config";
			$selectInnerJoinCols['user_group']['group_id']['group_permission'] = "permission";
			
			// this is used to select data with LIMIT & where clause
			$data = $db->selectJoin($table, $where, $limit, $like, $innerJoin, $selectInnerJoinCols);
			
			// this is used to count totalRecords with only where clause
			$totalRecords = $db->selectJoin("users", $where, null, $like, $innerJoin, $selectInnerJoinCols);
			$totalRecords['totalRecords'] = count($totalRecords['data']);
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
	}
	function getSingleUser($id){
		$db = new dbHelper();
		$where['id'] = $id;
		$data = $db->selectSingle("users", $where);
		return $data;
	}
 ?>