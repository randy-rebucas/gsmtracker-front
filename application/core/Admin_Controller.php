<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Admin_Controller extends User_Controller {

    function __construct()
    {
        parent::__construct();//'role_id', $admin_role_id

        $this->admin_role_id    = $this->Role->get_by_role_slug('administrator', $this->client_id);
        $this->patient_role_id  = $this->Role->get_by_role_slug('patient', $this->client_id);

        $this->user_info 	    = $this->User_model->get_profile_info($this->client_id);
        $this->client_info      = $this->Setting->get_client_info($this->client_id);
    }

    function set_layout($data = array())
    {

        $this->layout
            ->set_partial('header', 'include/header', $data) 
            ->set_partial('sidebar', 'include/sidebar', $data) 
            ->set_partial('ribbon', 'include/ribbon', $data) 
            ->set_partial('footer', 'include/footer', $data) 
            ->set_partial('shortcut', 'include/shortcut', $data) 
            ->set_metadata('author', 'Randy Rebucas')
            ->set_layout('full-column');
    }

    function display_error_log($directory, $class_name, $method) {
        $page = "'" . $directory . "\\" . $class_name . "\\" . $method . "' is not found";
        show_404($page);
    }
}