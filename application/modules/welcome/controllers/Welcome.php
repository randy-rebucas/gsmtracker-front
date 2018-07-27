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
        

		$this->layout->set(
            array(
                'title' => 'Welcome',
                'author' => 'Randy Rebucas',
                'description' => '',
                'keywords' => ''
            )
        );
        
        $this->layout->buffer('content', 'welcome/index');
        $this->layout->render();
	}

}