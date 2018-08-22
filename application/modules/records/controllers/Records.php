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

	public function rx_preview ($record_id) {
		//preview/4/2018-6-1/no
		$this->load->model('locations/Mdl_countries');
		$this->load->model('locations/Mdl_cities');
		$this->load->model('locations/Mdl_states');

		$this->load->model('queings/Mdl_queings');
		$this->load->model('records/Mdl_records');
		$this->load->model('records/Mdl_records_advice');
		$this->load->model('records/Mdl_records_medications');
		$this->load->model('patients/Mdl_patients');

		$record = $this->Mdl_records->get_by_id($record_id);
		$info = $this->Mdl_patients->get_info($record->patient_id);
		
		$next_visit = $this->Mdl_records_advice->by_record_id($record_id)->is_current()->get()->row();

		$age = (date("md", date("U", mktime(0, 0, 0, $info->bMonth, $info->bDay, $info->bYear))) > date("md")
				? ((date("Y") - $info->bYear) - 1)
				: (date("Y") - $info->bYear));				
	    
		if($info->gender == 1){
			$gender = 'Male';
		}elseif($info->gender == 2){
			$gender = 'Female';
		}else{
			$gender = 'Undefine';
		}

		$i = 1;
		$prescriptions = '';
	    $prescriptions.='<table id="rx-contents" width="100%"><tbody>';
		foreach ($this->Mdl_records_medications->get_all($record->record_id)->result_array() as $medicine) {
			$prescriptions.="<tr>";
			$prescriptions.='<td style="font-size: 20px; vertical-align: top; width:10%; padding-bottom: 5px;"><strong>'. $i .'</strong></td>';
			$prescriptions.='<td style="font-size: 20px; vertical-align: top; width:75%; padding-bottom: 5px;"><strong>' .  $medicine['records_medications_medicine'].' '.$medicine['records_medications_preparation']. '</strong><br> ';
			$prescriptions.='<span style="font-weight: normal;font-size: 18px;font-style: italic;padding-left: 30px; padding-bottom: 5px;">Sig: '.$medicine['records_medications_sig'].'</span></td>';
			$prescriptions.='<td style="font-size: 20px; vertical-align: top; width:15%; text-align: right; padding-bottom: 5px;"><strong># ' . $medicine['records_medications_qty'] . '</strong></td>';
			$prescriptions.="</tr>";
		$i++; 
		} 
		$prescriptions.="</tbody></table>";

		//get default rxpad template
		//rx_template
		$tx_template = html_entity_decode(html_entity_decode($this->load->view('records/rx', '', TRUE)));
		//$tx_template = ($this->config->item('rx_template') != '') ? $this->Template->get_info($this->config->item('rx_template'))->temp_content : $this->Presets->get_info(1)->temp_content;

		//Replace variables from the Templates
        $html_ = str_replace(
			array(
				//patient details
				"{{patient_id}}",
				"{{patient_name}}", 
				"{{patient_gender}}", 
				"{{patient_birthday}}",
				"{{patient_age}}", 
				"{{patient_address}}", 
				"{{patient_country}}",
				"{{patient_city}}",
				"{{patient_state}}",
				"{{patient_zip}}",
				"{{patient_mobile}}",
				//preserve details				
				"{{consultation_date}}", 
				//"{{next_visit}}",
				"{{prescriptions}}",
				//configuration details
				"{{business_name}}", 
				"{{business_owner}}", 
				"{{business_address}}", 
				"{{business_phone}}", 
				"{{business_email}}", 
				"{{business_fax}}", 
				"{{prc}}", 
				"{{ptr}}", 
				"{{s2}}",
				"{{business_morning_open_time}}", 
				"{{business_morning_close_time}}", 
				"{{business_afternoon_open_time}}", 
				"{{business_afternoon_close_time}}", 
				"{{business_weekend_open_time}}", 
				"{{business_weekend_close_time}}"
			), 
			array(
				//patient details
				$info->id,
				$info->lastname.' '.$info->firstname, 
				$gender, 
				$info->bYear. '-' .$info->bMonth. '-' .$info->bDay,
				$age, 
				($info->address) ? $info->address : '--',
				($info->country) ? $this->Mdl_countries->get_by_id($info->country)->name : '--',			
				($info->city) ? $this->Mdl_cities->get_by_id($info->city)->name : '--',
				($info->state) ? $this->Mdl_states->get_by_id($info->state)->name : '--', 
				($info->zip) ? $info->zip : '--',
				($info->mobile) ? $info->mobile : '--',
				//preserve details
				date('m/d/Y'),
				//(count($next_visit) > 0) ? date('m/d/Y', strtotime($next_visit[0]['next_visit'])) : '--',
				$prescriptions,
				//configuration details
				($this->config->item('business_name')) ? $this->config->item('business_name') : '--',
				($this->config->item('business_owner')) ? $this->config->item('business_owner') : '--', 
				($this->config->item('business_address')) ? $this->config->item('business_address') : '--',
				($this->config->item('business_phone')) ? $this->config->item('business_phone') : '--',
				($this->config->item('business_email')) ? $this->config->item('business_email') : '--',
				($this->config->item('business_fax')) ? $this->config->item('business_fax') : '--',
				($this->config->item('prc')) ? $this->config->item('prc') : '--', 
				($this->config->item('ptr')) ? $this->config->item('ptr') : '--', 
				($this->config->item('s2')) ? $this->config->item('s2') : '--',
				($this->config->item('morning_open_time')) ? $this->config->item('morning_open_time') : '--',
				($this->config->item('morning_close_time')) ? $this->config->item('morning_close_time') : '--',
				($this->config->item('afternoon_open_time')) ? $this->config->item('afternoon_open_time') : '--',
				($this->config->item('afternoon_close_time')) ? $this->config->item('afternoon_close_time') : '--',
				($this->config->item('week_end_open_time')) ? $this->config->item('week_end_open_time') : '--',
				($this->config->item('week_end_close_time')) ? $this->config->item('week_end_close_time') : '--'
			), $tx_template
        );
        //End 

        $data['pdf_html'] = html_entity_decode(html_entity_decode($html_));
		$data['module'] = 'RX';
		$this->layout->title('RX Preview');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('records/rxpad', $data);
        } 
		else
		{
			$this->layout->build('records/rxpad', $data);
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
