<?php
defined('BASEPATH') OR exit('No direct script access allowed');
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
class Welcome extends MX_Controller {

	public function index()
	{
		$this->layout
			->title('Welcome '.$this->config->item('app_name'))
			->set_layout('one-column')
			->build('welcome_message');
	}
}