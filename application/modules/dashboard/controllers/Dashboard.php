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
      
        $this->layout->set(
            array(
                'title' => 'Dashboard',
                'author' => 'Randy Rebucas',
                'description' => '',
                'keywords' => ''
            )
        );

        $this->layout->buffer('content', 'dashboard/index');
        $this->layout->render();
    }

}