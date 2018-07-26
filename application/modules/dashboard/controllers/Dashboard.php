<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Dashboard extends Admin_Controller {

	function __construct() 
	{

        parent::__construct();

        $this->load->language('dashboard', $this->Mdl_settings->setting('default_language'));
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
        $this->layout->set(
            array(
                'module'           => 'Dashboard'
            )
        );

        $this->layout->buffer('content', 'manage');
        $this->layout->render();
	}

	
}
