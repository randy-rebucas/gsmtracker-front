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
class Templates extends Secure_Controller 
{

	function __construct() 
	{
        parent::__construct();
        $this->load->model('Template');
    }

	function index()
	{

		$data['module'] = 'Templates';
		$this->layout->title('Templates');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('templates/manage', $data);
        } 
		else
		{
			$this->layout->build('templates/manage', $data);
		}
	}
	
	function load_ajax() 
	{
	
		if ($this->input->is_ajax_request()) 
		{	
			$this->load->library('datatables');
	       
	        $this->datatables->select("temp_id as id, temp_name as name, temp_type as type, temp_status as status, temp_created as created, client_id", false);
	        
			$this->datatables->where('client_id', $this->client_id);
	        
	        $this->datatables->from('templates');

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
		$this->layout->title('New Templates');
		$this->load->model('templates/Presets');
		$data['module'] = 'New Templates';

		$data['info'] = $this->Template->get_info($id);
		
		$templates = array('' => 'Select');
		
		foreach ($this->Presets->get_all_presets()->result_array() as $row) 
		{
			$templates[$row['temp_id']] = $row['temp_name'];
		}

		$data['templates'] = $templates;

		if ($this->is_ajax) 
		{
			
			$this->load->view('form', $data);
        } 
		else
		{
			$this->_set_layout($data);
			$this->layout->build('form', $data);
			
		}
		
    }
	
	function variables()
	{
    	if ($this->is_ajax) 
		{
	    	$data['info'] = '';
	        $this->load->view("variables", $data);
	    }
	    else
	    {
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect('');
	    }
	}
	
	function preset($id = 0)
	{
		if ($id) 
		{
			$this->load->model('templates/Presets');
            $preset = $this->Presets->load($id);

            echo html_entity_decode(html_entity_decode($preset->temp_content));
        } 
        else 
        {
            echo '';
        }
	}
	function doSave($id = -1)
	{
		
		$template_data = array(
			'temp_name'			=>$this->input->post('name'),
			'temp_content'		=>$this->input->post('content'),
			'temp_type'			=>$this->input->post('types'),
			'temp_status'		=>1,//$this->input->post('status') ? 1 : 0,
			'client_id'			=>$this->client_id
		);
		
		if($this->Template->save($template_data, $id))
		{
			if($id==-1)
			{
				echo json_encode(array('success'=>true,'message'=>$template_data['temp_name']));
			}
			else 
			{
				echo json_encode(array('success'=>true,'message'=>$template_data['temp_name']));
			}
		}
		else//failure
		{	
			echo json_encode(array('success'=>false,'message'=>$template_data['temp_name']));
		}
			
	}
	
	function details($id = -1)
	{
    	if ($this->is_ajax) 
		{
	    	$data['info'] = $this->Template->get_info($id);
	        $this->load->view("detail", $data);
	    }
	    else
	    {
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect('');
	    }
    }
	
    function delete($id)
    {

    	if ($res = $this->Template->delete($id)) {
			echo json_encode(array('success' => true, 'message' => 'Template successfully deletd!'));
		} 
		else 
		{
			echo json_encode(array('success' => false, 'message' => $res ));
		}

    }

}
