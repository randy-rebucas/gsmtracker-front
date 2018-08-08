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

class Dashboard extends Secure_Controller 
{

	function __construct() 
	{
        parent::__construct();

        $this->load->language('dashboard', 'english');
    }

	function index()
	{
		$data['module'] = 'Dashboard';
		// $this->load->model('reports/Report');
		$this->layout->title('Dashboard');

		$this->set_layout();

		if ($this->input->is_ajax_request()) 
		{
			$this->load->view('dashboard/manage', $data);
        } 
		else
		{
			$this->layout->build('dashboard/manage', $data);
		}
		
	}
}