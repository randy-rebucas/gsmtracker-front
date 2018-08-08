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
class Roles extends Secure_Controller 
{

	function __construct() 
	{
        parent::__construct();

        $this->load->model('Role');
	}

	function index()
	{

		$data['module'] = 'Roles';
		$this->layout->title('Roles');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('roles/manage', $data);
        } 
		else
		{
			$this->layout->build('roles/manage', $data);
		}
	}

	function load_ajax() 
	{
	
		if ($this->input->is_ajax_request()) 
		{	
			$this->load->library('datatables');
	       
	        $this->datatables->select("role_id, role_name, role_slug, role_desc, role_status, role_created, client_id", false);
	        
	        $this->datatables->where('client_id', $this->client_id);
			
	        $this->datatables->from('roles');

	        echo $this->datatables->generate('json', 'UTF-8');
	        
    	}
    	else
    	{

	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
	    }
    }
	
    function view($id = -1)
    {

        if ($this->input->is_ajax_request()) 
		{
			$this->load->model('records/Custom');
			$this->load->model('records/Record');

			$data['info'] = $this->Role->get_info($id);
			
			$roles = array('' => 'Select');

			foreach ($this->Role->get_all($this->client_id, 1)->result_array() as $row) {

				$roles[$row['role_id']] = $row['role_name'];
			}

			$data['roles'] = $roles;
		
	        $this->load->view("form", $data);
	    }
	    else
	    {
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
	    }
    }
	
	function doSave($id = -1)
	{
		
		$role_data = array(
			'role_name'	=>$this->input->post('role_name'),
			'role_slug'	=> url_title($this->input->post('role_name'), 'dash', TRUE),
			'role_desc'		=>$this->input->post('role_desc'),
			'role_status'		=>$this->input->post('role_status') ? 1 : 0,
			'client_id'		=>$this->client_id
		);
		
		$module_data = $this->input->post('module') != NULL ? $this->input->post('module') : array();
		
		if($this->Role->save($role_data, $module_data, $this->client_id, $id))
		{
			if($id==-1)
			{
				echo json_encode(array('success'=>true,'message'=>$role_data['role_name']));
			}
			else 
			{
				echo json_encode(array('success'=>true,'message'=>$role_data['role_name']));
			}
		}
		else//failure
		{	
			echo json_encode(array('success'=>false,'message'=>$role_data['role_name']));
		}
			
	}
	
	function details($id = -1)
	{
    	if ($this->input->is_ajax_request()) 
		{
			$this->load->model('records/Custom');
			$this->load->model('records/Record');
			
	    	$data['info'] = $this->Role->get_info($id);
	        $this->load->view("detail", $data);

	    }
	    else
	    {

	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');

            redirect(strtolower(get_class())); 
	    }
    }
	
    function delete($id)
    {

    	if ($res = $this->Role->delete($id)) 
    	{

			echo json_encode(array('success' => true, 'message' => 'Role successfully deletd!'));

		} 
		else 
		{

			echo json_encode(array('success' => false, 'message' => $res ));

		}

    }

	function count() {
		$this->load->model('user/User_model');
		echo json_encode(
			array(
				'count'=> $this->User_model->count($this->input->post('id'))
			)
		);
	}

}
