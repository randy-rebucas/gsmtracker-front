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
class User extends Admin_Controller 
{

	function __construct() 
	{
        parent::__construct();

		$this->load->language('user', 'english');
        $this->load->language('common/common', 'english');
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
		$data['module'] = 'Users';
		$this->layout->title('Users');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('user/manage', $data);
        } 
		else
		{
			$this->layout->build('user/manage', $data);
		}
	}

	function load_ajax() 
	{
	
		if ($this->input->is_ajax_request()) 
		{	
			$this->load->library('datatables');
			$this->load->model('roles/Role');
			$role_id = (strlen($this->input->post('role'))>0) ? $this->Role->get_by_role_slug($this->input->post('role'), $this->client_id) : null;

			$isfiltered = $this->input->post('filter');
			
	        $this->datatables->select("users.id as id, CONCAT(IF(up.lastname != '', up.lastname, ''),',',IF(up.firstname != '', up.firstname, '')) as fullname, username, role_name, email, DATE_FORMAT(users.created, '%M %d, %Y') as created, avatar, DATE_FORMAT(CONCAT(IF(up.bYear != '', up.bYear, ''),'-',IF(up.bMonth != '', up.bMonth, ''),'-',IF(up.bDay != '', up.bDay, '')), '%M %d, %Y') as birthday, address, mobile, DATE_FORMAT(users.last_login, '%M %d, %Y') as last_login, users.client_id as lic", false);
	        
			$this->datatables->where('users.deleted', 0);
			$this->datatables->where('users.client_id', $this->client_id);
			if($role_id){
				$this->datatables->where('users.role_id', $role_id);
			}
			if($isfiltered > 0){
				$this->datatables->where('DATE(created) BETWEEN ' . $this->db->escape($isfiltered) . ' AND ' . $this->db->escape($isfiltered));
			}
			$this->datatables->join('users_profiles as up', 'users.id = up.user_id', 'left', false);
			$this->datatables->join('users_role as ur', 'users.id = ur.user_id', 'left', false);
			$this->datatables->join('roles as r', 'ur.role_id = r.role_id', 'left', false);
			
	        $this->datatables->from('users');

	        echo $this->datatables->generate('json', 'UTF-8');
    	}
    	else
    	{
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect('');
	    }
    }
	
    function view($id = -1)
    {

        if ($this->input->is_ajax_request()) 
		{
			$this->load->model('roles/Role');
			$this->load->model('patients/Patient');
			$this->load->library('location_lib');

			$data['info'] = $this->Patient->get_info($id);

			$data['option'] = $this->session->userdata('option');
	        $this->load->view("form", $data);
	        
	    }
	    else
	    {
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect('');
	    }
    }
	
	function doSave($id = -1)
	{
		
		$this->load->model('custom_fields/Custom_field');
		$this->load->library('pass_secured');
		$this->load->library('auth/tank_auth');

		if ($id==-1) 
		{
			$user_data=array(
				'username'      =>($this->input->post('username') != '') ? $this->input->post('username') : 'patient',        
				'email'         =>($this->input->post('email') != '') ? $this->input->post('email') : 'patient@myclinicsoft.com',
				'password'      =>$this->pass_secured->encrypt($this->input->post('password')),
				'client_id'		=>$this->client_id,
				'role_id'		=>$this->input->post('role'),
				'last_ip'       =>$this->input->ip_address(),
				'created'       => date('Y-m-d H:i:s'),
				'token'			=> date('Ymd').'-'.random_string('numeric',8)
			);
		} 
		else 
		{
			$user_data=array(
				'last_ip'       =>$this->input->ip_address(),
				'modified'       => date('Y-m-d H:i:s')
			);
		}

		$profile_data = array(
			'firstname'		=>$this->input->post('first_name'),
			'mi'			=>$this->input->post('mi'),
			'lastname'		=>$this->input->post('last_name'),
			'bMonth'		=>$this->input->post('month'),
			'bDay'			=>$this->input->post('day'),
			'bYear'			=>$this->input->post('year'),
			'gender'		=>$this->input->post('gender'),
			'mobile'		=>$this->input->post('mobile'),
			'address'		=>$this->input->post('address'),
			'zip'			=>$this->input->post('zip'),
			'city'			=>$this->input->post('city'),
			'state'			=>$this->input->post('state'),
			'country'		=>$this->input->post('country')
		);

		$custom_data = $this->input->post('custom') != NULL ? $this->input->post('custom') : array();
		//check if file exists
		if(!empty($_FILES['custom_files']['name'])) {
			//set configuration for upload
			$config['upload_path'] = FCPATH . '/uploads/'.$this->tank_auth->get_client_id().'/';
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

			if ($this->upload->do_upload('custom_files'))
			{
				//set response uplaod data
				$upload_data = $this->upload->data();
				//load up all custom fields to match he input name
				$custom_fields = $this->Custom_field->get_custom()->result();
				//loop all
				foreach($custom_fields as $custom_field) 
				{
					//select file only
					if($custom_field->custom_field_type === 'file') 
					{
						// set input file name
						$custom_data[$custom_field->custom_field_column] = $upload_data['file_name'];
					}	
				}
			}else{
				echo json_encode(array('success'=>false,'message'=>$this->upload->display_errors()));
			}
		}
		
		if($this->Patient->save($user_data, $profile_data, $custom_data, $id))
		{
			if($id==-1)
			{
				echo json_encode(array('success'=>true,'message'=>$profile_data['lastname']));
			}
			else //previous employee
			{
				echo json_encode(array('success'=>true,'message'=>$profile_data['lastname']));
			}
		}
		else//failure
		{	
			echo json_encode(array('success'=>false,'message'=>$profile_data['lastname']));
		}
			
	}
	
    function doReset($email)
    {
    	if ($this->input->is_ajax_request()) 
		{
	    	//send
			//$email;
			
			echo json_encode(array('success' => true, 'message' => 'Reset link send!'));
	    }
	    else
	    {
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect('');
	    }
    }
	
    function delete($user_id)
    {

    	if ($this->users->delete_user($user_id)) {
			echo json_encode(array('success' => true, 'message' => 'User successfully deletd!'));
		} 
		else 
		{
			echo json_encode(array('success' => false, 'message' => 'User cannot be deletd!'));
		}

    }

     function update($id = -1)
     {
    	if ($this->input->is_ajax_request()) 
		{
	    	$data['info'] = $this->Patient->get_profile_info($id);
	        $this->load->view("ajax/users_update", $data);
	    }
	    else
	    {
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect('');
	    }
    }
	
	function do_update()
	{

		$this->load->model('user/User_model');

		$name = $this->input->post('name');
		$pk = $this->input->post('pk');
		$value = $this->input->post('value');
		$table = $this->input->post('table');

		$data = array(
			$name => $value
		);
		if($this->User_model->update($data, $table, $pk))
		{
		
			echo json_encode(array(
				'success'=>true,
				'message'=>'Success'
			));
			
		}
		else//failure
		{	
			echo json_encode(array(
				'success'=>false,
				'message'=>'Failed'
			));
		} 
	}
	
    function details($id = -1)
    {
    	if ($this->input->is_ajax_request()) 
		{
			
	    	$this->load->model('patients/Patient');

			$data['info'] = $this->Patient->get_profile_info($id);
	        $this->load->view("ajax/users_detail", $data);
	    }
	    else
	    {
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect('');
	    }
    }
	
}
