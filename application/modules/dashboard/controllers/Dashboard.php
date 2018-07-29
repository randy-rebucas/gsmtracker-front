<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Dashboard extends Admin_Controller {
    
    public function __construct()
    {
        parent::__construct();

    }

    public function index()
    {

        $data = array();
        $this->_set_layout('default', $data);
        if(!$this->input->is_ajax_request()){
            $this->template->build('dashboard/index');
        } else {
            $this->load->view('dashboard/index');
        }
        
    }

}