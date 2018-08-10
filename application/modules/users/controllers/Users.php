<?php
if (!defined('BASEPATH'))
exit('No direct script access allowed');
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
class Users extends Secure_Controller 
{

	function __construct() 
	{
        parent::__construct();

		//$this->load->language('users', 'english');
        $this->load->language('common/common', 'english');
    }

	function index()
	{
		$data['module'] = 'Users';
		$this->layout->title('Users');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('users/manage', $data);
        } 
		else
		{
			$this->layout->build('users/manage', $data);
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
