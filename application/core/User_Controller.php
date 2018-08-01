<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class User_Controller extends Base_Controller {

	public function __construct() //$required_key, $required_val
	{
		parent::__construct();

		$this->load->library('auth/tank_auth');
		if (!$this->tank_auth->is_logged_in()) {									// logged in

			redirect('auth/login');
		}

		$data['username']	= $this->tank_auth->get_username();
		$data['client_id'] 	= $this->tank_auth->get_client_id();
        $data['role_id']    = $this->tank_auth->get_role_id();
        $data['user_id']	= $this->tank_auth->get_user_id();

		$this->load->model('user/User_model');
        $this->load->model('settings/Setting');
        $this->load->model('modules/Module');
        $this->load->model('common/Common');
		$this->load->model('roles/Role');
		
		$data['admin_role_id']    = $this->Role->get_by_role_slug('administrator', $this->tank_auth->get_client_id());
		$data['patient_role_id']  = $this->Role->get_by_role_slug('patient', $this->tank_auth->get_client_id());

		$data['user_info'] 	    = $this->User_model->get_profile_info($this->tank_auth->get_user_id());
		$data['client_info']      = $this->Setting->get_client_info($this->tank_auth->get_client_id());
		
		$this->load->vars($data);

	}

	
}
 /* End of file: User_Controller.php */
 /* Location: ./application/core/User_Controller.php */
