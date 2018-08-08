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

	function load_ajax() 
	{
	
		if ($this->input->is_ajax_request()) 
		{	
			$this->load->library('datatables');
	        $isfiltered = $this->input->post('filter');

	        $this->datatables->select("u.id as id, CONCAT(IF(up.lastname != '', up.lastname, ''),',',IF(up.firstname != '', up.firstname, '')) as fullname, username, email, DATE_FORMAT(u.created, '%M %d, %Y') as created, avatar, DATE_FORMAT(CONCAT(IF(up.bYear != '', up.bYear, ''),'-',IF(up.bMonth != '', up.bMonth, ''),'-',IF(up.bDay != '', up.bDay, '')), '%M %d, %Y') as birthday, address, mobile, DATE_FORMAT(u.last_login, '%M %d, %Y') as last_login, u.client_id as client_id", false);
	        
			$this->datatables->where('u.deleted', 0);
			$this->datatables->where('u.client_id', $this->client_id);
			if($isfiltered > 0){
				$this->datatables->where('DATE(created) BETWEEN ' . $this->db->escape($isfiltered) . ' AND ' . $this->db->escape($isfiltered));
			}
			$this->datatables->join('users as u', 'p.patient_id = u.id', 'left', false);
			$this->datatables->join('users_profiles as up', 'p.patient_id = up.user_id', 'left', false);
			$this->datatables->join('users_custom as uc', 'p.patient_id = uc.user_id', 'left', false);
	        $this->datatables->order_by('lastname', 'DESC');

	        $this->datatables->from('patients as p');

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

			$this->load->model('custom_fields/Custom_field');
			$this->load->library('location_lib');

	        $data['info'] = $this->Patient->get_info($id);

			$data['option'] = $this->session->userdata('option');
			
			$data['custom_fields'] = $this->Custom_field->get_custom('users_custom')->result();
			
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
			$config['upload_path'] = FCPATH . '/uploads/'.$this->client_id.'/';
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
		if($this->Patient->save($user_data, $profile_data, $custom_data, $this->patient_role_id, $id))
		{
			if($id==-1)
			{
				echo json_encode(array('success'=>true,'message'=>$profile_data['lastname']));
			}
			else //previous
			{
				echo json_encode(array('success'=>true,'message'=>$profile_data['lastname']));
			}
		}
		else//failure
		{	
			echo json_encode(array('success'=>false,'message'=>$profile_data['lastname']));
		}
			
	}
	
    function reset($id = -1)
    {
    	if ($this->input->is_ajax_request()) 
		{
	    	$data['info'] = $this->Patient->get_profile_info($id);
	        $this->load->view("reset", $data);
	    }else{
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
	    }
    }

    function delete($user_id)
    {

    	if ($this->Patient->delete($user_id)) {
			echo json_encode(array('success' => true, 'message' => 'Patient successfully deletd!'));
		} else {
			echo json_encode(array('success' => false, 'message' => 'Patient cannot be deleted!'));
		}

    }

     function update($id = -1)
     {
    	if ($this->input->is_ajax_request()) 
		{
	    	$data['info'] = $this->Patient->get_profile_info($id);
	        $this->load->view("update", $data);
	    }else{
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
	    }
    }

    function details($id = -1)
    {
    	
    	if ($this->input->is_ajax_request()) 
		{
			$this->load->model('custom_fields/Custom_field');
			
	    	$data['info'] = $this->Patient->get_profile_info($id);

			$data['custom_fields'] = $this->Custom_field->get_custom('users_custom')->result();
			
	        $this->load->view("detail", $data);
	    }else{
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
	    }
    }
	
	function que($id) {
		if ($this->input->is_ajax_request()) 
		{
			
	    	$data['info'] = $this->Patient->get_profile_info($id);

	        $this->load->view("que", $data);
	    }else{
	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
	    }
	}

	function records($id)
	{
		
		$this->load->library('cart');
		$this->load->model('queings/Queing');
		$this->load->model('records/Custom');
		$this->load->model('records/Record');
		$this->load->model('custom_fields/Custom_field');
		$this->load->model('vaccines/Vaccine');
		$this->load->model('doses/Dose');

		$this->layout->title('Patient Records');
		$data['module'] = 'Patient Records';

		$rowId = url_base64_decode($id);
		$data['que_info'] = $this->cart->get_item($rowId);

		$paginates = array();
		$num = 1;
		foreach ($this->cart->contents() as $items){
			$paginates[site_url('patients/records/'.url_base64_encode($items['rowid']))] = $items['options']['patient_id'].'-'.$num;
			$num ++;
		} 

		$data['paginates'] = $paginates;

		$data['info'] 					= $this->Patient->get_profile_info($data['que_info']['options']['patient_id']);
		$data['custom_fields'] 			= $this->Custom_field->get_custom('users_custom')->result();

		$data['records_blocks'] 		= $this->Record->get_all('blocks');
		$data['records_asides'] 		= $this->Record->get_all('asides');
		$data['records_tabs'] 			= $this->Record->get_all('tabs');

		$data['custom_records_tabs'] 	= $this->Custom->get_all($this->client_id);

		$vaccines = array();
		foreach($this->Vaccine->get_all()->result_array() as $row)
		{
			$vaccines[$row['vaccine_name']] = $row['vaccine_name'];
		}
		$data['vaccines']=$vaccines;
			
		$doses = array();
		foreach($this->Dose->get_all()->result_array() as $row)
		{
			$doses[$row['dose_name']] = $row['dose_name'];
		}
		$data['doses']=$doses;

		if ($this->input->is_ajax_request()) 
		{

			$this->load->view('record', $data);
        } 
		else
		{
			$this->_set_layout($data);
			$this->layout->build('record', $data);
		}
	}
	
	function get_record()
	{
		if ($this->input->is_ajax_request()) 
		{
			$this->load->model('records/Record');
			$this->load->model('records/Custom');
			$type = $this->input->post('type');
			$data['id'] = url_base64_decode($this->input->post('id'));

			$data['type'] = $type;
			$data['latest'] = $this->Record->get_current_data($type, $data['id'], date('Y-m-d'));
			$data['pr_result'] = $this->Record->get_all_data($type, $data['id'], 'no');//segment 3 
			$data['m_result'] = $this->Record->get_all_data($type, $data['id'], 'yes');//segment 3 
			
			$this->load->view('records/records/'.$type.'/manage', $data);
		}
	}
	
	function get_record_files()
	{
		if ($this->input->is_ajax_request()) 
		{
			$this->load->model('records/Record');

			$type = $this->input->post('type');
			$data['id'] = url_base64_decode($this->input->post('id'));
			$data['type'] = $type;
			$data['latest'] = $this->Record->get_current_data($type, $data['id'], date('Y-m-d'));
			$data['result'] = $this->Record->get_all_file_data($type, $data['id']);//segment 3 
			$result  = array();

			foreach ( $data['result']  as $file ) {

				$obj['name'] = $file['file_name'];
				$obj['size'] = 12345;
				$result[] = $obj;
				
			}
			
			header('Content-type: text/json');              //3
			header('Content-type: application/json');
			echo json_encode($result);
	
		}
	}
}
