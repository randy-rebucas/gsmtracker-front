<?php
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
class Notifications extends Secure_Controller 
{

	function __construct() 
	{
        parent::__construct();
       
    }

	function index()
	{
		
	}
	
	function get(){

		$this->load->view('ajax/notification-list');
		
    }
	
}
