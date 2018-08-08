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
set_time_limit(120);
use Dompdf\Dompdf;
//use Dompdf\Css\Stylesheet;

class Reports extends Admin_Controller {

	function __construct() {
        parent::__construct();
		$this->load->model('Report');
    }

	function _remap($method, $params = array()) 
    {
    	
        if (method_exists($this, $method)) {
            return call_user_func_array(array($this, $method), $params);
        }

        $this->display_error_log(getcwd(), get_class($this), $method);
	}

	function index()
	{
		$data['module'] = 'Reports';
		$this->layout->title('Reports');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('reports/manage', $data);
        } 
		else
		{
			$this->layout->build('reports/manage', $data);
		}
	}
	
	
}