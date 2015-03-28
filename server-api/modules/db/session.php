<?php
require_once('dbHelper.php');
class session {
	
	public function getSession(){
		if (!isset($_SESSION)) {
			session_start();
		}
		$sess = array();
		if(isset($_SESSION['id']))
		{
			foreach($_SESSION as $sessionName => $sessionValue){
				$sess[$sessionName] = $_SESSION[$sessionName];
			}
		}
		else{
			$sess["id"] = '';
			$sess["username"] = 'Guest';
		}
		return $sess;
	}
	public function setSession($sessionData){
		if (!isset($_SESSION)) {
			session_start();
		}
		foreach($sessionData as $sessionName => $sessionValue){
			$_SESSION[$sessionName] = $sessionValue;
		}
		//print_r($_SESSION);
		return $_SESSION;
	}
    public function destroySession(){
		if (!isset($_SESSION)) {
			session_start();
		}
		if(isSet($_SESSION['id']))
		{
			foreach($_SESSION as $sessionName => $sessionValue){
				unset($_SESSION[$sessionName]);
			}
			$msg="Logged Out Successfully...";
		}
		else{
			$msg = "Not logged in...";
		}
		return $msg;
	}

}

?>
