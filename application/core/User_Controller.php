<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class User_Controller extends Base_Controller {

	public function __construct($required_key, $required_val)
	{
		parent::__construct();

		$this->load->library('auth/tank_auth');
		if (!$this->tank_auth->is_logged_in()) {									// logged in

			redirect('auth/login');
		}

		$data['user_id']	= $this->tank_auth->get_user_id();
		$data['username']	= $this->tank_auth->get_username();
		$data['role_id']	= $this->tank_auth->get_role_id();

		$this->load->model('users/Mdl_users');
		$data['UserInfo'] = $this->Mdl_users->get_by_id($this->tank_auth->get_user_id());
		
		$this->load->vars($data);

	}

}
 /* End of file: User_Controller.php */
 /* Location: ./application/core/User_Controller.php */
