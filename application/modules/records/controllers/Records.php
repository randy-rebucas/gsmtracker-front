<?php
require_once APPPATH. 'modules/secure/controllers/Secure.php';
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
class Records extends Secure 
{
	
    function __construct() 
    {
        parent::__construct();

		$this->load->model('Custom');
		$this->load->model('Record');
		$this->load->model('medias/Media');
		$this->load->model('vaccines/Vaccine');
		$this->load->model('doses/Dose');
		

		$this->load->helper('encode');
    }

    function _remap($method, $params = array()) 
    {
 
        if (method_exists($this, $method)) {
            return call_user_func_array(array($this, $method), $params);
        }

        $directory = getcwd();
        $class_name = get_class($this);
        $this->display_error_log($directory,$class_name,$method);
        
    }

	function index()
	{
		redirect('records/default');
	}

	function default_records() 
	{

		$this->layout->title('Default');
		
		$data['module'] = 'Default'; 
		
		if ($this->input->is_ajax_request()) 
		{
			$this->load->view('default', $data);
        } 
		else
		{
			$this->_set_layout($data);
			$this->layout->build('default', $data);
		}
	}

	function custom_records() 
	{

		$this->layout->title('Custom');
		
		$data['module'] = 'Custom'; 
		
		if ($this->input->is_ajax_request()) 
		{
			$this->load->view('custom', $data);
        } 
		else
		{
			$this->_set_layout($data);
			$this->layout->build('custom', $data);
		}
	}

	function switch_status() {

		$status = $this->input->post('status');
		$type = $this->input->post('type');
		$id = $this->input->post('id');

		if($this->Record->switch_status($status, $type, $id))
		{
			echo json_encode(array('success'=>true));
		}
		else 
		{
			echo json_encode(array('success'=>false));
		}
	}

	function load_ajax() 
	{
	
		if ($this->input->is_ajax_request()) 
		{	
			$this->load->library('datatables');
			$type = $this->input->post('type');
	       	if($type == 'default'){ //type

	       		$this->datatables->select("record_id, name, description, status, created, slug, type", false);
	        
	        	$this->datatables->from('records');
	       	} else {

	       		$this->datatables->select("record_id, name, description, status, created, slug, type, client_id", false);
	        
	        	$this->datatables->from('custom_records');
	       	}

	        echo $this->datatables->generate('json', 'UTF-8');
	        
    	}
    	else
    	{

	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
	    }
    }
	
    function view($id = -1, $client_id = null)
    {

        if ($this->input->is_ajax_request()) 
		{
			$this->load->model('custom_fields/Custom_field');

			$table = ($client_id != null) ? 'custom_records' : 'records';
			$data['info'] = $this->Record->get_info_by_id($id, $table);

			if ($client_id != null) {
				$data['fields'] = $this->Custom_field->get_custom('records_'.$data['info']->slug.'_'.$this->client_id);
			} else {
				$data['fields'] = $this->Custom_field->get_custom('records_'.$data['info']->slug);
			}
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
		$this->load->helper('url');

    	$slug = url_title($this->input->post('name'), 'underscore', TRUE);
		$record_data = array(
			'name'			=>$this->input->post('name'),
			'description'	=>$this->input->post('description'),
			'slug'			=>$slug,
			'status'		=>$this->input->post('status') ? 1 : 0,
			'client_id'		=>$this->client_id
		);

		if($this->Record->save_table($record_data, $this->client_id, $id))
		{
			if($id==-1)
			{
				echo json_encode(array('success'=>true,'message'=>$record_data['name']));
			}
			else 
			{
				echo json_encode(array('success'=>true,'message'=>$record_data['name']));
			}
		}
		else//failure
		{	
			echo json_encode(array('success'=>false,'message'=>$record_data['name']));
		}
			
	}
	
	function details($id = -1, $client_id = null)
	{
    	if ($this->input->is_ajax_request()) 
		{
	    	$this->load->model('custom_fields/Custom_field');

			$table = ($client_id != null) ? 'custom_records' : 'records';
			$data['info'] = $this->Record->get_info_by_id($id, $table);

			if ($client_id != null) {
				$data['fields'] = $this->Custom_field->get_custom('records_'.$data['info']->slug.'_'.$this->client_id);
			} else {
				$data['fields'] = $this->Custom_field->get_custom('records_'.$data['info']->slug);
			}
	        $this->load->view("detail", $data);

	    }
	    else
	    {

	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');

            redirect(strtolower(get_class())); 
	    }
    }
	
    function delete_record($id)
    {
    	if ($res = $this->Record->delete_record($id, 'custom_records')) 
    	{

			echo json_encode(array('success' => true, 'message' => 'Record successfully deleted!'));

		} 
		else 
		{

			echo json_encode(array('success' => false, 'message' => $res ));

		}

    }

    function delete_custom_field($id, $type)
    {

    	if ($this->Custom->delete($id, $type)) 
    	{

			echo json_encode(array('success' => true, 'message' => 'Record successfully deleted!'));

		} 
		else 
		{

			echo json_encode(array('success' => false, 'message' => 'failed to save record!' ));

		}

    }

    function get_records()
	{
		$this->load->model('records/Custom');

		$user_id = $this->input->post('id');
		$limit = $this->input->post('limit');
		$type = $this->input->post('type');

		echo json_encode($this->Custom->get_record($type, $user_id, $limit, date('Y-m-d')));
	}

	function types($type, $user_id)
	{
		$data['type'] = $type;
		$data['latest'] = $this->Record->get_current_data($type, $user_id, date('Y-m-d'));
		$data['result'] = $this->Record->get_all_data($type, $user_id);//segment 3 
		$this->load->view('ajax/records/'.$type.'/manage', $data);
	}
	
	function get_all_complaints()
	{
		$this->load->model('records/Custom');

		$user_id = url_base64_decode($this->input->post('id'));
		echo json_encode($this->Custom->get_all_data('complaint_'.$this->license_id, $user_id));
		
	}
	
	function get_complaints()
	{
		$user_id = $this->input->post('id');
		echo json_encode($this->Record->get_all_data('conditions', $user_id));
		
	}
	
	function get_all_medications()
	{
		$complaint_date = $this->input->post('complaint_date');
		$user_id = $this->input->post('user_id');
		
		echo json_encode($this->Record->get_current_data('medications', $user_id, $complaint_date));
	}

	function create_custom($type, $user_id, $cdate = null, $client_id = null)
	{ 
		$data['user_id'] = $user_id;
		$data['title'] = sprintf($this->lang->line('records_title'), $type);
		$data['type'] = $type;
		$data['cdate'] = $cdate;
		
		$this->load->model('custom_fields/Custom_field');
		
		$table = ($client_id != null) ? 'custom_records' : 'records';
		// $data['info'] = $this->Record->get_info_by_id($id, $table);

		if ($client_id != null) {
			$data['custom_fields'] = $this->Custom_field->get_custom('records_'.$type.'_'.$this->client_id)->result();
		} else {
			$data['custom_fields'] = $this->Custom_field->get_custom('records_'.$type)->result();
		}
		
		$this->load->view('records/custom_form', $data);
	}
	
	function save_custom_record($id = null, $type) {

		$record_data = $this->input->post('custom') != NULL ? $this->input->post('custom') : array();
		//check if file exists
		if(!empty($_FILES['custom_files']['name'])) {
			//set configuration for upload
			$config['upload_path'] = FCPATH . '/uploads/'.$this->tank_auth->get_license_key().'/';
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
				$this->load->model('custom_fields/Custom_field');
				
				$custom_fields = $this->Custom_field->get_custom('records_'.$type)->result();
				//loop all
				foreach($custom_fields as $custom_field) 
				{
					//select file only
					if($custom_field->custom_field_type === 'file') 
					{
						// set input file name
						$record_data[$custom_field->custom_field_column] = $upload_data['file_name'];
					}	
				}
			}else{
				echo json_encode(array('success'=>false,'message'=>$this->upload->display_errors()));
			}
		}
		$record_data['user_id'] = $this->input->post('user_id');
		$record_data['date'] 	= date('Y-m-d');
		//records_height_height
		if($res = $this->Custom->save($record_data, $type, $id))
		{
			
			echo json_encode(array('success'=>true, 'records'=>$record_data, 'type'=>$type, 'message'=>'Successfully saved!'));
		}
		else//failure
		{	
			echo json_encode(array('success'=>false, 'id'=>$res['id'], 'message'=>sprintf($this->lang->line('records_response_failed_message'), $this->lang->line('records_'.strtolower(str_replace(' ', '_', $type))))));
		}
	}
	
	function create_diagnoses($id = null, $type = null) 
	{
		$record_data=array(
			'user_id'       =>$this->input->post('user_id'),
			'diagnoses'       =>$this->input->post('diagnoses'),
			'date'       	=> date('Y-m-d')
		);

		if($res = $this->Custom->save($record_data, $type, $id))
		{
			
			echo json_encode(array('success'=>true, 'records'=>$record_data, 'id'=>$res['record_id'], 'message'=>'Successfully saved!'));
		}
		else//failure
		{	
			echo json_encode(array('success'=>false, 'id'=>$res['record_id'], 'message'=>sprintf($this->lang->line('records_response_failed_message'), $this->lang->line('records_'.strtolower(str_replace(' ', '_', $type))))));
		}
	}

	function create_prescription($id = null, $type = null) {
		$record_data=array(
			'user_id'       	=>$this->input->post('user_id'),
			'medicine'       	=>$this->input->post('medicine'),
			'preparation'       =>$this->input->post('preparation'),
			'sig'       		=>$this->input->post('sig'),
			'qty'       		=>$this->input->post('qty'),
			'is_mainteinable'   =>$this->input->post('is_mainteinable') == 1 ? 'yes' : 'no',
			'date'       		=> date('Y-m-d')
		);

		if($res = $this->Custom->save($record_data, $type, $id))
		{
			
			echo json_encode(array('success'=>true, 'records'=>$record_data, 'id'=>$res['record_id'], 'message'=>'Successfully saved!'));
		}
		else//failure
		{	
			echo json_encode(array('success'=>false, 'id'=>$res['record_id'], 'message'=>sprintf($this->lang->line('records_response_failed_message'), $this->lang->line('records_'.strtolower(str_replace(' ', '_', $type))))));
		}
	}

	function get_dir($path)
	{
        
        if(!is_dir($path)) //create the folder if it's not already exists
        {
            mkdir($path,0755,TRUE);

        }
        return $path;

    }

	function get_all_test()
	{
		
		echo json_encode($this->Record->get_test($this->license_id)->result_array());
	}
	
	function view_test()
	{
		
		$data['title'] = sprintf($this->lang->line('records_title'), 'Test');
		
		$this->load->view('ajax/records/lab_test_results/request', $data);
		
	}
	
	function create_test()
	{
		
		$test_data = array(
			'name'			=> $this->input->post('lab_test'),
			'license_key'	=> $this->license_id
		);
		
		if($res = $this->Record->save_test($test_data))
		{
		
			echo json_encode(array('success'=>true, 'id'=>$res['test_id'], 'message'=>'Created'));
			
		}
		else//failure
		{	
			echo json_encode(array('success'=>false, 'id'=>$res['test_id'], 'message'=>'Created'));
		}
	}
	
	function delete_test($id)
	{
		
		if($this->Record->delete_test($id))
		{
		
			echo json_encode(array('success'=>true, 'message'=>'deleted'));
			
		}
		else//failure
		{	
			echo json_encode(array('success'=>false, 'message'=>'deleted'));
		}
	}
	
	function delete($id, $type)
	{
		
		
		if($this->Record->delete($id, $type))
		{
			echo json_encode(array('success'=>true,'message'=>sprintf($this->lang->line('records_response_delete_success_message'), $this->lang->line('records_'.strtolower(str_replace(' ', '_', $type))))));
			
		}
		else
		{
			echo json_encode(array('success'=>false,'message'=>sprintf($this->lang->line('records_response_delete_failed_message'), $this->lang->line('records_'.strtolower(str_replace(' ', '_', $type))))));
		}
	}
	
	function get_vaccine_source_ajax() 
	{
		
		$this->load->model('vacciens/Vaccine');

		$_vaccine_sources1 =  array(array('value' => '', 'text' => 'Select'));
		foreach($this->Vaccine->get_all()->result() as $row => $vaccine)
		{
			$_vaccine_sources2[$row]['text'] = $vaccine->vaccine_name;
            $_vaccine_sources2[$row]['value'] = $vaccine->vaccine_name;
		}
		$vaccine_sources = array_merge($_vaccine_sources1, $_vaccine_sources2);
		echo json_encode($vaccine_sources);
	
    }
	
	function get_doses_source_ajax() 
	{
		
		$this->load->model('doses/Dose');

		$_doses_sources1 =  array(array('value' => '', 'text' => 'Select'));
		foreach($this->Dose->get_all()->result() as $row => $dose)
		{
			$_doses_sources2[$row]['text'] = $dose->dose_name;
            $_doses_sources2[$row]['value'] = $dose->dose_name;
		}
		$doses_sources = array_merge($_doses_sources1, $_doses_sources2);
		echo json_encode($doses_sources);

    }
	
	function get_suggest_records($type, $fields)
	{

		echo json_encode($this->Record->get_suggest_record($type, $fields)->result_array());

	}
	
	function docs($id)
	{
		
		$this->load->model('templates/Template');

		$templates = array('' => 'Select');
		$array = array($this->license_id, 'system');

		foreach ($this->Template->get_all_forms($array)->result_array() as $row) 
		{
			$templates[$row['tid']] = $row['tname'];
		}

		$data['templates'] = $templates;

		$this->load->view('ajax/print', $data);
	}
}
