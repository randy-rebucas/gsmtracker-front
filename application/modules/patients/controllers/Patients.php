<?php
if (!defined('BASEPATH'))
exit('No direct script access allowed');
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

class Patients extends Secure_Controller 
{
	public function __construct() 
	{

        parent::__construct();

		$this->load->model('Patient');

		$this->load->language('patients', 'english');
        $this->load->language('common/common', 'english');
    }

	function index()
	{
		$this->load->model('patients/Mdl_patients');
		$this->load->model('custom_fields/Mdl_Custom_Fields');

		$data['module'] = 'Patients';
		$this->layout->title('Patients');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('patients/manage', $data);
        } 
		else
		{
			$this->layout->build('patients/manage', $data);
		}
	}

	public function record($patient_id)
	{
		$record_id = null;

		$this->load->model('locations/Mdl_countries');
		$this->load->model('locations/Mdl_cities');
		$this->load->model('locations/Mdl_states');

		$this->load->model('queings/Mdl_queings');
		$this->load->model('records/Mdl_records');
		$this->load->model('patients/Mdl_patients');

		if($this->Mdl_queings->in_que($patient_id)->is_current()->get()->num_rows() > 0){
			if($this->Mdl_records->record_from($patient_id)->is_current()->get()->num_rows() > 0){
				$record_id = $this->Mdl_records->record_from($patient_id)->is_current()->get()->row()->record_id;
			}
		}

		$data['all_record']  = $this->Mdl_records->record_from($patient_id)->get()->result();

		$this->load->model('records/Mdl_records_vital_signs');
		$data['cur_vital_sign']  = $this->Mdl_records_vital_signs->by_record_id($record_id)->is_current()->get()->result();
		$data['all_vital_sign']  = $this->Mdl_records_vital_signs->by_record_id($record_id)->get()->result();

		$this->load->model('records/Mdl_records_symptoms');
		$data['cur_symptoms']  = $this->Mdl_records_symptoms->by_record_id($record_id)->is_current()->get()->result();
		$data['all_symptoms']  = $this->Mdl_records_symptoms->by_record_id($record_id)->get()->result();

		$this->load->model('records/Mdl_records_investigations');
		$data['cur_investigations']  = $this->Mdl_records_investigations->by_record_id($record_id)->is_current()->get()->result();
		$data['all_investigations']  = $this->Mdl_records_investigations->by_record_id($record_id)->get()->result();

		$this->load->model('records/Mdl_records_medications');
		$data['cur_medications']  = $this->Mdl_records_medications->by_record_id($record_id)->get()->result();

		$this->load->model('records/Mdl_records_advice');
		$data['cur_advice']  = $this->Mdl_records_advice->by_record_id($record_id)->is_current()->get()->result();
		$data['all_advice']  = $this->Mdl_records_advice->by_record_id($record_id)->get()->result();

		$this->load->model('custom_fields/Mdl_custom_fields');
		$data['custom_fields'] = $this->Mdl_custom_fields->by_table('records_vital_signs')->get()->result();

		$data['info'] = $this->Mdl_patients->get_info($patient_id);

		$data['module'] = 'Record: '.$data['info']->firstname;
		$this->layout->title('Record: '.$data['info']->firstname);

		$this->load->library('records/record_lib');
		$data['tab'] = $this->record_lib->get_tab();

		$data['record_id'] = $record_id;

		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('patients/record', $data);
        } 
		else
		{
			$this->layout->build('patients/record', $data);
		}
	}
	// function doSave($id = -1)
	// {

	// 	$custom_data = $this->input->post('custom') != NULL ? $this->input->post('custom') : array();
	// 	//check if file exists
	// 	if(!empty($_FILES['custom_files']['name'])) {
	// 		//set configuration for upload
	// 		$config['upload_path'] = FCPATH . '/uploads/'.$this->client_id.'/';
	// 		$config['allowed_types'] = 'gif|jpg|png';
	// 		$config['max_size'] = '9999';
	// 		$config['max_width'] = '9999';
	// 		$config['max_height'] = '9999';
	// 		$config['encrypt_name'] = TRUE;
					
	// 		$this->load->library('upload', $config);
			
	// 		//check directory if exists
	// 		if(!is_dir($config['upload_path']))
	// 		{
	// 			//create if not
	// 			mkdir($config['upload_path'], 0755, TRUE);
	// 		}

	// 		if ($this->upload->do_upload('custom_files'))
	// 		{
	// 			//set response uplaod data
	// 			$upload_data = $this->upload->data();
	// 			//load up all custom fields to match he input name
	// 			$custom_fields = $this->Custom_field->get_custom()->result();
	// 			//loop all
	// 			foreach($custom_fields as $custom_field) 
	// 			{
	// 				//select file only
	// 				if($custom_field->custom_field_type === 'file') 
	// 				{
	// 					// set input file name
	// 					$custom_data[$custom_field->custom_field_column] = $upload_data['file_name'];
	// 				}	
	// 			}
	// 		}else{
	// 			echo json_encode(array('success'=>false,'message'=>$this->upload->display_errors()));
	// 		}
	// 	}
		
	// }

}
