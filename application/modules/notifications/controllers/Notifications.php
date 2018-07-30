<?php
require_once APPPATH. 'modules/secure/controllers/Secure.php';
/*
 * MyClinicSoft
 * 
 * A web based clinical system
 *
 * @package     MyClinicSoft
 * @author      Randy Rebucas
 * @copyright   Copyright (c) 2016 - 2018 MyClinicSoft, LLC
 * @license     http://www.myclinicsoft.com/license.txt
 * @link        http://www.myclinicsoft.com
 * 
 */
class Notifications extends Secure 
{

	function __construct() 
	{
        parent::__construct();
       
    }

    function _remap($method, $params = array()) 
    {
 
        if (method_exists($this, $method)) 
        {
            return call_user_func_array(array($this, $method), $params);
        }

        $directory = getcwd();
        $class_name = get_class($this);
        $this->display_error_log($directory,$class_name,$method);
    }

	function index()
	{
		
	}
	
	function get(){

		$this->load->view('ajax/notification-list');
		
    }
	
}
