<?php
defined('BASEPATH') OR exit('No direct script access allowed');

// require_once(APPPATH .'clients/masud/config/database.php');
     
class Welcome extends Admin_Controller {

    // public $client_db;

    public function __construct()
    {
        parent::__construct();

        // $this->client_db = $this->load->database('clientdb');
        // $this->load->database($dbconfig);
    }

	public function index()
	{

        $data = array();
        $this->_set_layout('default', $data);

        if(!$this->input->is_ajax_request()){
            $this->template->build('welcome/index', $data);
        } else {
            $this->load->view('welcome/index', $data);
        }
	}

}