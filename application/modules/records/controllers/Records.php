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
class Records extends Secure_Controller 
{
	
    function __construct() 
    {
        parent::__construct();

		
    }

	function index()
	{
		
	}

	function doSaveVitalSigns(){

		if ($this->mdl_clients->run_validation())
        {
            $id = $this->mdl_clients->save($id);
            $this->load->model('custom_fields/Mdl_records_vital_signs_customs');
            $this->Mdl_records_vital_signs_customs->save_custom($id, $this->input->post('custom'));
            redirect('clients/view/' . $id);
        }

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
	
}
