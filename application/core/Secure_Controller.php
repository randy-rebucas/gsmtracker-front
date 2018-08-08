<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');


class Secure_Controller extends Base_Controller {

    public $client_id;
    public $role_id;
	public $user_id;
	public $username;
    public $admin_role_id;
    public $patient_role_id;
    
	public function __construct()
	{
        parent::__construct();
        
        $this->load->library('auth/tank_auth');
		if (!$this->tank_auth->is_logged_in()) {									// logged in

			redirect('auth/login');
        }
        
        $this->user_id	= $this->tank_auth->get_user_id();
        $this->username	= $this->tank_auth->get_username();
		$this->client_id 	= $this->tank_auth->get_client_id();
        $this->role_id    = $this->tank_auth->get_role_id();

        $this->load->model('roles/Mdl_roles');

        $this->admin_role_id    = $this->Mdl_roles->get_by_val('role_slug', 'administrator', $this->client_id);
        $this->patient_role_id  = $this->Mdl_roles->get_by_val('role_slug', 'patient', $this->client_id);

        //$this->user_info 	    = $this->User_model->get_profile_info($this->client_id);
        $this->load->model('settings/Mdl_settings');
        //$this->client_info      = $this->Setting->get_client_info($this->client_id);

        $this->load->model('users/Mdl_users');
        $data['user_info']	= $this->Mdl_users->get_by_id($this->user_id);

		$this->load->vars($data);
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