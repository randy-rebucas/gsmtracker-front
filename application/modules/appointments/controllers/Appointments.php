<?php
/*
 * MyClinicSoft
 * 
 * A web based clinical system
 *
 * @package		MyClinicSoft
 * @author		Randy Rebucas
 * @copyright	Copyright (c) 2016 - 2018 MyClinicSoft, LLC
 * @license		http://www.myclinicsoft.com/license.txt
 * @link		http://www.myclinicsoft.com
 * 
 */

class Appointments extends Secure_Controller 
{

	function __construct() 
	{

        parent::__construct();

        $this->load->model('Appointment');
        $this->load->language('appointments', 'english');

    }

	function index()
	{

		$data['module'] = 'Appointments';
		$this->layout->title('Appointments');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('appointments/manage', $data);
        } 
		else
		{
			$this->layout->build('appointments/manage', $data);
		}
	}

}
