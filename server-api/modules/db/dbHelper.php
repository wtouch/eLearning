<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/server-api/modules/db/config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
class dbHelper {
    private $db;
    private $err;
	// for mail configuration
	private $mailHost;
	private $mailUsername;
	private $mailPassword;
	private $mailPort;
    function __construct() {
	
        $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME;
        try {
            $this->db = new PDO($dsn, DB_USERNAME, DB_PASSWORD, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        } catch (PDOException $e) {
            $response["status"] = "error";
            $response["message"] = 'Connection failed: ' . $e->getMessage();
            $response["data"] = null;
            exit;
        }
    }
	
	function sendMail($from, $recipients, $subject, $message, $replyTo=null, $attachments = null, $ccMail=null, $bccMail = null, $messageText = null){
		try{
			$mail = new PHPMailer;

			//$mail->SMTPDebug = 3;                               // Enable verbose debug output

			$mail->isSMTP();                                      // Set mailer to use SMTP
			$mail->Host = 'mail.wtouch.in';  // Specify main and backup SMTP servers
			$mail->SMTPAuth = true;                               // Enable SMTP authentication
			$mail->Username = 'vilas@wtouch.in';                 // SMTP username
			$mail->Password = 'vilas@1988';                           // SMTP password
			$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
			$mail->Port = 587;                                    // TCP port to connect to

			$mail->From = $from['email'];	// From email - $from['email']
			(isset($from['name'])) ? $mail->FromName = $from['name'] : "";	// From Name - $from['name']
			foreach($recipients as $email){
				$mail->addAddress($email);     // Add a recipient
			}
			
			($replyTo === null) ? $replyTo = $from : $replyTo ;
			if(isset($replyTo['name'])){
				$mail->addReplyTo($replyTo['email'], $replyTo['name']);	// replyTo email & name
			}else{
				$mail->addReplyTo($replyTo['email']);	// replyTo email & name
			}
			
			if($ccMail !== null){
				foreach($ccMail as $email){
					$mail->addCC($email);
				}
			}
			if($bccMail !== null){
				foreach($bccMail as $email){
					$mail->addBCC($email);
				}
			}
			if($attachments !== null){
				foreach($attachments as $file => $path){
					$mail->addAttachment($path, $file);    // Add attachments with Optional name
				}
			}
			
			$mail->isHTML(true);                                  // Set email format to HTML

			$mail->Subject = $subject;
			$mail->Body    = $message;
			//$mail->AltBody = $messageText;

			if(!$mail->send()) {
				throw new Exception('Message could not be sent. Mailer Error: ' . $mail->ErrorInfo);
			}
			$response["message"] = 'Message has been sent';
			$response["status"] = "success";
			$response["data"] = null;
		}catch(Exception $e){
            $response["status"] = "error";
            $response["message"] = 'Error: ' .$e->getMessage();
            $response["data"] = null;
        }
		return $response;
	}
	
	function selectJoin($table,$where, $limit=null, $likeFilter=null, $innerJoin = null, $selectInnerJoinCols = null, $leftJoin = null, $selectLeftJoinCols = null){
		try{
            $a = array();
            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$table.".".$key. " like :".$key;
                $a[":".$key] = $value;
            }
			$lmt = ($limit['pageNo'] == 0 ) ? $limit['pageNo'] : $limit['pageNo'] - 1;
			$startLimit = $lmt * $limit['records']; // start on record $startLimit
			$dbLimit = ($limit===null) ? "" : " LIMIT ".$startLimit.", ".$limit['records'];
			
			$l = "";
			if($likeFilter!=null){
				foreach ($likeFilter as $key => $value) {
					$l .= " and " .$key. " like '%". $value . "%'";
				}
			}
			
			$selectQuery = "";
			$innerJoinQuery = "";
			$no=null;
			if(isset($innerJoin)){
				foreach($innerJoin as $tableName=> $columnArray ){
					
					 foreach($columnArray as  $leftColumn => $rightColumn){
						$no += 1;
						$tableAlias = "inr".$no; 
						 
						$innerJoinQuery .= "INNER JOIN ".$tableName." as ".$tableAlias." ";
						$innerJoinQuery .= "ON ".$table.".".$leftColumn." = ".$tableAlias.".".$rightColumn." ";
						
						foreach($selectInnerJoinCols[$tableName][$leftColumn] as $colName => $colAs){
							$colAs = ($colAs==="") ? ", " : " as ".$colAs.", ";
							$selectQuery .= " ".$tableAlias.".".$colName.$colAs;
						}
					}

				}
			}

			$leftJoinQuery = "";
			$no=null;
			if(isset($leftJoin)){
				foreach($leftJoin as $tableName=> $columnArray ){
					
					 foreach($columnArray as  $leftColumn => $rightColumn){
						 $no += 1;
						 $tableAlias = "lft".$no;
						$leftJoinQuery .= "LEFT JOIN ".$tableName." as ".$tableAlias." ";
						$leftJoinQuery .= "ON ".$table.".".$leftColumn." = ".$tableAlias.".".$rightColumn." ";
						
						foreach($selectLeftJoinCols[$tableName][$leftColumn] as $colName => $colAs){
							$colAs = ($colAs==="") ? ", " : " as ".$colAs.", ";
							$selectQuery .= " ".$tableAlias.".".$colName.$colAs;
						}
						
					}
					
				}
			}
			$finalSelectQuery = substr("SELECT ".$table.".*, ".$selectQuery, 0, -2);
			$finalQueryString = $finalSelectQuery." FROM ".$table." ".$innerJoinQuery.$leftJoinQuery;
			//echo $finalQueryString;
			
            $stmt = $this->db->prepare($finalQueryString." where 1=1 ". $w ." ".$l." ".$dbLimit);
            $stmt->execute($a);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
			
			/* $res = $this->db->query('SELECT COUNT(*) FROM '.$table);
			$totalRecords = $res->fetchColumn(); */
			
            if(count($rows)<=0  || !is_array($rows)){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
				$response["data"] = null;
            }else{
				//$response['totalRecords']= $totalRecords;
				$response["message"] = count($rows)." rows selected.";
                $response["status"] = "success";
				$response["data"] = $rows;
            }
                
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null; //$finalQueryString." where 1=1 ". $w ." ".$dbLimit;
        }
        return $response;
	}
	function selectSingleJoin($table,$where, $innerJoin = null, $selectInnerJoinCols = null, $leftJoin = null, $selectLeftJoinCols = null){
		try{

            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$table.".".$key. " = '".$value."'";
            }
			$dbLimit = " LIMIT 1";
			
			
			$selectQuery = "";
			$innerJoinQuery = "";
			$no=null;
			if(isset($innerJoin)){
				foreach($innerJoin as $tableName=> $columnArray ){
					
					 foreach($columnArray as  $leftColumn => $rightColumn){
						$no += 1;
						$tableAlias = "inr".$no; 
						 
						$innerJoinQuery .= "INNER JOIN ".$tableName." as ".$tableAlias." ";
						$innerJoinQuery .= "ON ".$table.".".$leftColumn." = ".$tableAlias.".".$rightColumn." ";
						
						foreach($selectInnerJoinCols[$tableName][$leftColumn] as $colName => $colAs){
							$colAs = ($colAs==="") ? ", " : " as ".$colAs.", ";
							$selectQuery .= " ".$tableAlias.".".$colName.$colAs;
						}
					}

				}
			}

			$leftJoinQuery = "";
			$no=null;
			if(isset($leftJoin)){
				foreach($leftJoin as $tableName=> $columnArray ){
					
					 foreach($columnArray as  $leftColumn => $rightColumn){
						 $no += 1;
						 $tableAlias = "lft".$no;
						$leftJoinQuery .= "LEFT JOIN ".$tableName." as ".$tableAlias." ";
						$leftJoinQuery .= "ON ".$table.".".$leftColumn." = ".$tableAlias.".".$rightColumn." ";
						
						foreach($selectLeftJoinCols[$tableName][$leftColumn] as $colName => $colAs){
							$colAs = ($colAs==="") ? ", " : " as ".$colAs.", ";
							$selectQuery .= " ".$tableAlias.".".$colName.$colAs;
						}
						
					}
					
				}
			}
			$finalSelectQuery = substr("SELECT ".$table.".*, ".$selectQuery, 0, -2);
			$finalQueryString = $finalSelectQuery." FROM ".$table." ".$innerJoinQuery.$leftJoinQuery;
			//echo $finalQueryString;
			
            $stmt = $this->db->query($finalQueryString." where 1=1 ". $w ." ".$dbLimit);
            //$stmt->execute($a);
            $rows = $stmt->fetch(PDO::FETCH_ASSOC);
			
			/* $res = $this->db->query('SELECT COUNT(*) FROM '.$table);
			$totalRecords = $res->fetchColumn(); */
			
            if(count($rows)<=0  || !is_array($rows)){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
				$response["data"] = null;
            }else{
				//$response['totalRecords']= $totalRecords;
				$response["message"] = count($rows)." rows selected.";
                $response["status"] = "success";
				$response["data"] = $rows;
            }
                
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null; //$finalQueryString." where 1=1 ". $w ." ".$dbLimit;
        }
        return $response;
	}
    function select($table, $where, $limit=null, $likeFilter=null){
        try{
            $a = array();
            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " like :".$key;
                $a[":".$key] = $value;
            }
			$lmt = ($limit['pageNo'] == 0 ) ? $limit['pageNo'] : $limit['pageNo'] - 1;
			$startLimit = $lmt * $limit['records']; // start on record $startLimit
			$dbLimit = ($limit===null) ? "" : " LIMIT ".$startLimit.", ".$limit['records'];
			$l = "";
			if($likeFilter!=null){
				foreach ($likeFilter as $key => $value) {
					$l .= " and " .$key. " like '%". $value . "%'";
				}
			}
			
            $stmt = $this->db->prepare("select * from ".$table." where 1=1 ". $w . " ". $l. " ".$dbLimit);
            $stmt->execute($a);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
			
            if(count($rows)<=0 || !is_array($rows)){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
				$response["data"] = null;
            }else{
				//$response['totalRecords']= $totalRecords;
				$response["message"] = count($rows)." rows selected.";
                $response["status"] = "success";
				$response["data"] = $rows;
            }
                
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null;
        }
        return $response;
    }
	function selectSingle($table, $where, $limit=1){
        try{
            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " = '".$value."'";
            }
			$dbLimit = " LIMIT ".$limit;
			
            $stmt = $this->db->query("select * from ".$table." where 1=1 ". $w ." ".$dbLimit);
            //$stmt->execute($a);
            $rows = $stmt->fetch(PDO::FETCH_ASSOC);
			//echo "select * from ".$table." where 1=1 ". $w ." ".$dbLimit;
            if(count($rows)<=0 || !is_array($rows)){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
				$response["data"] = null;
            }else{
				//$response['totalRecords']= $totalRecords;
				$response["message"] = count($rows)." rows selected.";
                $response["status"] = "success";
				$response["data"] = $rows; //(count($rows)==1) ? $rows[0] : $rows;
            }
                
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null;
        }
        return $response;
    }
    function insert($table, $inputData) {
	
        try{
			(is_Array($inputData)) ? $inputData : $inputData = json_decode($inputData);
			
			$dataKey = [];
			$dataValue = [];
			foreach($inputData as $key => $val) // $inputData holds input json data
			{
				$value = ($key!=='password')
						? (is_object($val) || is_array($val))
							? mysql_real_escape_string(json_encode($val))
							: mysql_real_escape_string($val)
						: passwordHash::hash($val);
				//echo ($key=='password')	? passwordHash::hash($val) : "not pass";
				array_push($dataKey,$key);
				array_push($dataValue,"'".$value."'");
			}
			$colNames = implode(",",$dataKey);
			$colValues = implode(",",$dataValue);

		    $stmt =  $this->db->prepare("INSERT INTO $table($colNames) VALUES($colValues)");
            $stmt->execute();
			$id = $this->db->lastInsertId();
            $affected_rows = $stmt->rowCount();
            $response["status"] = "success";
            $response["message"] = $affected_rows." row inserted into database";
			$response["data"] = $id;
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Insert Failed: ' .$e->getMessage();
			$response["data"] = null;
        }
        return $response;
    }
	
    function update($table, $inputData, $where){
        
        try{
            $a = array();
            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " = :".$key;
                $a[":".$key] = $value;
            }
            (is_Array($inputData)) ? $inputData : $inputData = json_decode($inputData);
			$updateTable = [];
			foreach($inputData as $key => $val) // $inputData holds input json data
			{
			
				$value = (is_object($val) || is_array($val)) ? mysql_real_escape_string(json_encode($val)) : mysql_real_escape_string($val);
				array_push($updateTable,$key." = '".$value."'");
				
			}
			$updateFields = implode(",",$updateTable);

            $stmt =  $this->db->prepare("UPDATE $table SET $updateFields WHERE 1=1 ".$w);
            $stmt->execute($a);
            $affected_rows = $stmt->rowCount();
            if($affected_rows<=0){
                $response["status"] = "warning";
                $response["message"] = "No row updated";
				$response["data"] = null;
            }else{
                $response["status"] = "success";
                $response["message"] = $affected_rows." row(s) updated in database";
				$response["data"] = null;
            }
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = "Update Failed: " .$e->getMessage();
			$response["data"] = null;
        }
        return $response;
    }
	
    function delete($table, $where){
        if(count($where)<=0){
            $response["status"] = "warning";
            $response["message"] = "Delete Failed: At least one condition is required";
			$response["data"] = null;
        }else{
            try{
                $a = array();
                $w = "";
                foreach ($where as $key => $value) {
                    $w .= " and " .$key. " = :".$key;
                    $a[":".$key] = $value;
                }
                $stmt =  $this->db->prepare("DELETE FROM $table WHERE 1=1 ".$w);
                $stmt->execute($a);
                $affected_rows = $stmt->rowCount();
                if($affected_rows<=0){
                    $response["status"] = "warning";
                    $response["message"] = "No row deleted";
					$response["data"] = null;
                }else{
                    $response["status"] = "success";
                    $response["message"] = $affected_rows." row(s) deleted from database";
					$response["data"] = null;
                }
            }catch(PDOException $e){
                $response["status"] = "error";
                $response["message"] = 'Delete Failed: ' .$e->getMessage();
				$response["data"] = null;
            }
        }
        return $response;
    }
  
}

?>
