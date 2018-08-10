<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Ajax extends Secure_Controller {

    public $ajax_controller = TRUE;

    public function get_data() 
    {
        $this->load->library('datatables');
        
        $this->datatables->select("appointments.*, CONCAT(IF(up.lastname != '', up.lastname, ''),',',IF(up.firstname != '', up.firstname, '')) as fullname", false);
        
        $this->datatables->where('client_id', $this->client_id);
        
        $this->datatables->join('users_profiles as up', 'appointments.appointment_patient_id = up.user_id', 'left', false);

        $this->datatables->from('appointments');

        echo $this->datatables->generate('json', 'UTF-8');
    }

    public function modal_create($id = -1)
    {
        $this->load->model('appointments/Mdl_appointments');
		$this->load->model('patients/Mdl_patients');

        $data['info'] = $this->Mdl_appointments->get_info($id);
        
        $patients = array('' => 'Select');

        foreach ($this->Mdl_patients->get()->result_array() as $row) 
        {
            $patients[$row['id']] = $row['firstname'].', '.$row['lastname'];
        }
        $data['patients'] = $patients;
        
        $this->load->view("form", $data);
			
    }

    function doSave($id = -1)
	{

        
		$appointment_data = array(
			'schedule_date'		=>$this->input->post('schedule_date'),
			'schedule_time'		=>$this->input->post('schedule_time'),
			'description'		=>$this->input->post('description'),
			'title'				=>$this->input->post('title'),
			'user_id'			=>$this->input->post('user_id') ? $this->input->post('user_id') : $this->user_id,
			'client_id'			=>$this->input->post('client_id'),
			'status'			=>$this->input->post('status'),
			'doctor_note'		=>$this->input->post('doctor_note'),
			'patient_note'		=>$this->input->post('patient_note')
		);
		
		if($this->Appointment->save($appointment_data, $this->client_id, $id))
		{
			if($id==-1)
			{
				echo json_encode(array('success'=>true,'message'=>$appointment_data['title']));
			}
			else 
			{
				echo json_encode(array('success'=>true,'message'=>$appointment_data['title']));
			}
		}
		else//failure
		{	
			echo json_encode(array('success'=>false,'message'=>$appointment_data['title']));
		}
    }

    function details($id = -1)
	{

        $this->load->model('common/Common');
        $this->load->model('patients/Patient');

        $data['info'] = $this->Appointment->get_info($id);
        $data['client_id'] = $this->Common->get_subscription_info($data['info']->license_key);
        $data['client_info'] = $this->Patient->get_info($data['client_id']->user_id);
        
        $this->load->view("detail", $data);
	   
    }

    function get()
	{

		echo json_encode($this->Appointment->get_all($this->client_id)->result_array());

    }
    
    function remove($id)
    {
        $this->load->model('appointments/Mdl_appointments');
    	if ($res = $this->Mdl_appointments->delete($id)) 
    	{
			echo json_encode(array('success' => true, 'message' => 'Appointment successfully deletd!'));
		} 
		else 
		{
			echo json_encode(array('success' => false, 'message' => $res ));
		}

    }
}

?>