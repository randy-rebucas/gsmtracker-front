<?php
/*
 * MyClinicSoft
 * 
 * A web based clinical system
 *
 * @package		MyClinicSoft
 * @author		Randy Rebucas
 * @copyright	Copyright (c) 2016 - 2018 MyClinicSoft, LLC
 * @license		http://www.myclinicsoft.com/license.txt
 * @link		http://www.myclinicsoft.com
 * 
 */

class Custom_Fields extends Secure_Controller {
	
	public function __construct()
	{
		parent::__construct();
		
		$this->load->model('Custom_field');
	}

	function index()
	{
		$this->layout->title('Custom Fields');
		$data['module'] = 'Custom Fields';

		if ($this->is_ajax) 
		{
			
			$this->load->view('manage', $data);
        } 
		else
		{
			$this->_set_layout($data);
			$this->layout->build('manage', $data);
			
		}
	}

	function load_ajax() {
	
		if ($this->is_ajax) 
		{	
			$this->load->library('datatables');
	       
	        $this->datatables->select("custom_field_id as id, custom_field_table as tbl, custom_field_label as lbl, client_id", false);
	        
			$this->datatables->where('client_id', $this->client_id);
	        
	        $this->datatables->from('custom_fields');

	        echo $this->datatables->generate('json', 'UTF-8');
	        
    	}else{

	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
	    }
    }

    function doSave($id = -1){
		
		$custom_data = array(
			'custom_field_table'		=>$this->input->post('custom_field_table'),
			'custom_field_label'		=>$this->input->post('custom_field_label'),
			'custom_field_type'			=>$this->input->post('custom_field_type'),
			'custom_field_symbol'		=>$this->input->post('custom_field_symbol'),
			'custom_field_is_required'	=>$this->input->post('custom_field_is_required'),
			'custom_field_sort'			=>$this->input->post('custom_field_sort'),
			'client_id'					=>$this->client_id
		);

		$option_data = $this->input->post('option') != false ? $this->input->post('option') : array();

		if($this->Custom_field->save($custom_data, $option_data, $this->client_id, $id))
		{
			if($id==-1)
			{
				echo json_encode(array('success'=>true,'message'=>$custom_data['custom_field_label']));
			}
			else 
			{
				echo json_encode(array('success'=>true,'message'=>$custom_data['custom_field_label']));
			}
		}
		else//failure
		{	
			echo json_encode(array('success'=>false,'message'=>$custom_data['custom_field_label']));
		}
			
	}

	function details($id = -1){

    	if ($this->is_ajax) 
		{
	    	$data['info'] = $this->Role->get_info($id);
	        $this->load->view("detail", $data);

	    }else{

	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');

            redirect(strtolower(get_class())); 
	    }
    }

	function view($id = -1, $tbl = null)
	{

        if ($this->is_ajax) 
		{

			$data['info'] = $this->Custom_field->get_info($id);
			$data['tbl'] = $tbl;
	        $this->load->view("form", $data);
			
	    }
	    else
	    {

	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));

	    }
    }

	function delete($id)
	{

    	if ($res = $this->Custom_field->delete($id)) 
    	{
			echo json_encode(array('success' => true, 'message' => 'Custom fiels successfully deletd!'));
		} 
		else 
		{
			echo json_encode(array('success' => false, 'message' => $res ));
		}

    }

}

?>