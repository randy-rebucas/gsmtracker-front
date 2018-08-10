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
class Settings extends Secure_Controller 
{

	function __construct() 
	{
        parent::__construct();

		$this->load->library('location_lib');
		$this->load->library('ci_mailer');

        $this->load->language('setting', 'english');
		$this->load->language('common/common', 'english');
		
		$this->load->config('auth/tank_auth', TRUE);
		$this->load->language('auth/tank_auth');
		$this->load->library('auth/tank_auth');

		$this->load->model('settings/Mdl_settings');
		// $this->load->module('auth');
    }

	function index()
	{
		
		redirect('settings/profile');
	}

	function profile() {

		$data['module'] = 'Profile';
		$this->layout->title('Profile');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('settings/profile', $data);
        } 
		else
		{
			$this->layout->build('settings/profile', $data);
		}
	}

	function doUpdateProfile() {

		$this->load->model('user/User_model');

		$profile_data=array(
			'firstname'		=>$this->input->post('firstname'),
			'mi'			=>$this->input->post('mi'),
			'lastname'		=>$this->input->post('lastname'),
			'gender'		=>$this->input->post('gender'),
			'bYear'			=>$this->input->post('year'),
			'bMonth'		=>$this->input->post('month'),
			'bDay'			=>$this->input->post('day'),
			'work_phone'	=>$this->input->post('work_phone'),
			'mobile'		=>$this->input->post('mobile')
		);

		$error = array();
		$user_data = array(
			'avatar'		=>$this->input->post('avatar'),
			'token'			=>$this->input->post('token')
		);

		if (isset($_FILES)) {

			$config['upload_path'] = FCPATH . '/uploads/'.$this->client_id.'/profile-picture/';
			$config['allowed_types'] = 'gif|jpg|png';
			$config['max_size'] = '9999';
			$config['max_width'] = '9999';
			$config['max_height'] = '9999';
			$config['encrypt_name'] = TRUE;
					
			$this->load->library('upload', $config);
			
			//check directory if exists
			if(!is_dir($config['upload_path']))
			{
				//create if not
				mkdir($config['upload_path'], 0755, TRUE);
			}

			if ($this->upload->do_upload('profile_pic'))
			{
				
				$upload_data = $this->upload->data();
				
				$this->imageResize($config['upload_path'], $upload_data);

				if (!empty($upload_data['orig_name']))
				{
					if($user_data['avatar'] != '') {
						if (file_exists($config['upload_path'].''.$user_data['avatar'])) {
							unlink($config['upload_path'].''.$user_data['avatar']);
						 }
					}
					$user_data['avatar'] = $upload_data['raw_name'] . $upload_data['file_ext'];
					
				}
			
			}else{

				$error = array('error' => $this->upload->display_errors());
			}
		}

		if($this->User_model->save_profile($user_data, $profile_data, $this->user_id)){

			echo json_encode(array('success'=>true,'message'=>'Profile successfully updated'));

		}else{

			echo json_encode(array('success'=>false,'message'=>$error));
		}
	}

	function imageResize($path, $upload_data){
		$sizes = array(250, 150, 100, 50, 25);
		$this->load->library('image_lib');
		foreach($sizes as $size)
    	{ 
			// Configuration
			$config['image_library'] = 'gd2';
			$config['source_image'] = $path . $upload_data['raw_name'] . $upload_data['file_ext'];
			$config['new_image'] = $path .'/sizes/'.$size.'/'. $upload_data['raw_name'] . $upload_data['file_ext'];
			$config['create_thumb'] = FALSE;
			$config['maintain_ratio'] = TRUE;
			$config['width'] = $size;
			$config['height'] = $size;
		
			// Load the Library
			$this->load->library('image_lib', $config);

			//check directory if exists
			if(!is_dir($path .'/sizes/'.$size))
			{
				//create if not
				mkdir($path .'/sizes/'.$size, 0755, TRUE);
			}

			$this->image_lib->clear();
			$this->image_lib->initialize($config);
			$this->image_lib->resize();
		}
	}

	function account() {

		$data['module'] = 'Account';
		$this->layout->title('Account');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('settings/account', $data);
        } 
		else
		{
			$this->layout->build('settings/account', $data);
		}
	}

	function doUpdatePassword(){

		$this->form_validation->set_rules('old_password', 'Old Password', 'trim|required|xss_clean');
		$this->form_validation->set_rules('new_password', 'New Password', 'trim|required|xss_clean|min_length['.$this->config->item('password_min_length', 'tank_auth').']|max_length['.$this->config->item('password_max_length', 'tank_auth').']|alpha_dash');
		$this->form_validation->set_rules('confirm_password', 'Confirm new Password', 'trim|required|xss_clean|matches[new_password]');

		if ($this->form_validation->run()) {	
									// validation ok
			if ($this->tank_auth->change_password(
					$this->form_validation->set_value('old_password'),
					$this->form_validation->set_value('new_password'))) {	// success
				
				echo json_encode(array('success' => true, 'message' => 'Your password successfully changed!'));
				
			} else {
																	// fail
				$data['error'] = array();  
				$errors = $this->tank_auth->get_error_message();
				                                                   // fail
				foreach ($errors as $k => $v) {
					$data['error'][$k] = $this->lang->line($v);
				}
			
				echo json_encode(array('success' => false, 'message' => 'Changing password encounter an error!'));

			}
			
		}else{
			echo json_encode(array('success' => false, 'message' => validation_errors()));
		}
		
	}

	function doUpdateEmail() {

		$this->form_validation->set_rules('password', 'Password', 'trim|required|xss_clean');
		$this->form_validation->set_rules('email', 'Email', 'trim|required|xss_clean|valid_email');

		if ($this->form_validation->run()) {								// validation ok

			if (!is_null($data = $this->tank_auth->set_new_email(
					$this->form_validation->set_value('email'),
					$this->form_validation->set_value('password')))) {			// success

				$data['site_name'] = $this->config->item('website_name', 'tank_auth');

				// Send email with new email address and its activation link
				$this->ci_mailer->send_email('change_email', $data['new_email'], $data);

				echo json_encode(array('success' => true, 'message' => sprintf($this->lang->line('auth_message_new_email_sent'), $data['new_email'])));		
				
			} else {
				$data['error'] = array();
				$errors = $this->tank_auth->get_error_message();

				foreach ($errors as $k => $v) {
					$data['error'][$k] = $this->lang->line($v);
				}

				echo json_encode(array('success' => false, 'message' => 'Changing email encounter an error!'));
			}
		}
	}

	function doUpdateUsername() {

		$this->form_validation->set_rules('password', 'Password', 'trim|required|xss_clean');
		$this->form_validation->set_rules('username', 'Username', 'trim|required|xss_clean');

		if ($this->form_validation->run()) {								// validation ok

			if (!is_null($data = $this->tank_auth->set_new_username(
					$this->form_validation->set_value('username'),
					$this->form_validation->set_value('password')))) {			// success

				$data['site_name'] = $this->config->item('website_name', 'tank_auth');

				echo json_encode(array('success' => true, 'message' => 'New user set '.$data['username']));		
				
			} else {
				$data['error'] = array();
				$errors = $this->tank_auth->get_error_message();

				foreach ($errors as $k => $v) {
					$data['error'][$k] = $this->lang->line($v);
				}

				echo json_encode(array('success' => false, 'message' => 'Changing username encounter an error!'));
			}
		}
	}

	/**
	 * Delete user from the site (only when user is logged in)
	 *
	 * @param	string
	 * @return	bool
	 */
	function doDeleteMe()
	{
		$recent_pass = $this->input->post('recent_pass');				//get confirmation password

		if ($this->tank_auth->delete_user($recent_pass)) {			// success

			$this->load->helper("file"); // load codeigniter file helper

			$path = FCPATH . '/uploads/'.$this->client_id;
			
			if(delete_files($path, TRUE)){

				echo json_encode(array('success' => true, 'message' => $this->lang->line('auth_message_unregistered')));
			}
		} 
		else 
		{														// fail
			echo json_encode(array('success' => false, 'message' => 'Sorry!We cannot delete your account.'));
		}
		
	}

	function emails() {

		$data['module'] = 'Emails';
		$this->layout->title('Emails');
		$this->set_layout();
		$this->load->model('settings/Mdl_settings');
		if ($this->input->is_ajax_request())  
		{
			$this->load->view('settings/emails', $data);
        } 
		else
		{
			$this->layout->build('settings/emails', $data);
		}
	}

	function doUpdateEmailPref(){

		if($this->Mdl_settings->save('email_pref', $this->input->post('email_pref'))){

			echo json_encode(array('success'=>true,'message'=>'Email preferences succesfully updated!'));

		}else{

			echo json_encode(array('success'=>false,'message'=>'Oooppps, updating email preferences encounter error!'));
		}
	}

	function notifications() {

		$data['module'] = 'Notifications';
		$this->layout->title('Notifications');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('settings/notifications', $data);
        } 
		else
		{
			$this->layout->build('settings/notifications', $data);
		}
	}

	function doUpdateNotification(){

		$batch_save_data=array(
			'appointments' 	=> $this->input->post('appointments'),
			'updates' 		=> $this->input->post('updates')
		);

		if($this->Setting->batch_save($batch_save_data )){

			echo json_encode(array('success'=>true,'message'=>'notifications succesfully updated!'));

		}else{

			echo json_encode(array('success'=>false,'message'=>'Oooppps, updating notifications encounter error!'));
		}
	}

	function billing() {
		$data['module'] = 'Billing';
		$this->layout->title('Billing Overview');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('settings/billing', $data);
        } 
		else
		{
			$this->layout->build('settings/billing', $data);
		}
	} 

	function configurations() {
		$data['module'] = 'Configurations';
		$this->layout->title('Configurations');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('settings/configuration', $data);
        } 
		else
		{
			$this->layout->build('settings/configuration', $data);
		}
	} 

	function doUpdateConfigurations(){

		$batch_save_data=array(
			'business_name'=>$this->input->post('business_name'),
			'business_owner'=>$this->input->post('business_owner'),
			'business_address'=>$this->input->post('business_address'),
			'business_phone'=>$this->input->post('business_phone'),
			'business_email'=>$this->input->post('business_email'),
			'business_fax'=>$this->input->post('business_fax'),
			'language'=>$this->input->post('language'),
			'timezone'=>$this->input->post('timezone'),
			'default_country'		=>$this->input->post('default_country'),
			'default_state'		=>$this->input->post('default_state'),
			'default_city'		=>$this->input->post('default_city'),
			'prc'=>$this->input->post('prc'),
			'ptr'=>$this->input->post('ptr'),
			's2'=>$this->input->post('s2'),
			'pf'=>$this->input->post('pf'),
			'morning_open_time'=>$this->input->post('morning_open_time'),
			'morning_close_time'=>$this->input->post('morning_close_time'),
			'afternoon_open_time'=>$this->input->post('afternoon_open_time'),
			'afternoon_close_time'=>$this->input->post('afternoon_close_time'),
			'week_end_open_time'=>$this->input->post('week_end_open_time'),
			'week_end_close_time'=>$this->input->post('week_end_close_time')
		);
		$error = array();
		if (isset($_FILES)) {

			$config['upload_path'] = FCPATH . '/uploads/'.$this->client_id.'/logo/';
			$config['allowed_types'] = 'gif|jpg|png';
			$config['max_size'] = '9999';
			$config['max_width'] = '9999';
			$config['max_height'] = '9999';
			$config['encrypt_name'] = TRUE;
					
			$this->load->library('upload', $config);
			
			//check directory if exists
			if(!is_dir($config['upload_path']))
			{
				//create if not
				mkdir($config['upload_path'], 0755, TRUE);
			}

			if ($this->upload->do_upload('logo'))
			{
				
				$upload_data = $this->upload->data();

				$this->imageResize($config['upload_path'], $upload_data);

				if (!empty($upload_data['orig_name']))
				{
					if($this->config->item('company_logo') != '' || $this->config->item('company_logo') != null) {
						if (file_exists($config['upload_path'].''.$this->config->item('company_logo'))) {
						unlink($config['upload_path'].''.$this->config->item('company_logo'));
						} 
					}
					$batch_save_data['company_logo'] = $upload_data['raw_name'] . $upload_data['file_ext'];
					
				}
			
			}else{
				$error = array('error' => $this->upload->display_errors());
			}
		}

		if($this->Setting->batch_save($batch_save_data )){

			echo json_encode(array('success'=>true,'message'=>$this->lang->line('setting_saved_successfully')));

		}else{

			echo json_encode(array('success'=>false,'message'=>$error));
		}

	}

	function upgrade(){

		$data['module'] = 'Upgrade your plan';
		$this->layout->title('Upgrade your plan');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('settings/upgrade', $data);
        } 
		else
		{
			$this->layout->build('settings/upgrade', $data);
		}
	}

	function my_profile($enc_id)
	{
		
		$id = url_base64_decode($enc_id);

		$this->layout->title('Profile');
		
		$data['module'] = $this->lang->line('common_my_profile');
		
		if ($this->input->is_ajax_request()) 
		{
			$this->load->library('location_lib');
			$this->load->model('user/User_model');
			
			$data['info'] = $this->User_model->get_profile_info($id);
			$this->load->view('user/profile', $data);
        } 
		else
		{
			$this->_set_layout($data);
			$this->layout->build('user/profile', $data);
		}
	}
	
	function encryptID($user_id)
	{
		redirect('details/'.url_base64_encode($user_id));
	}
}
