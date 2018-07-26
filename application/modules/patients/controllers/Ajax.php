<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Ajax extends Admin_Controller {

    public $ajax_controller = TRUE;

    public function name_query()
    {
        // Load the model
        $this->load->model('patients/Mdl_patients');

        // Get the post input
        $query = $this->input->post('query');

        $patients = $this->Mdl_patients->select('patient_name')->like('patient_name', $query)->order_by('patient_name')->get(array(), FALSE)->result();

        $response = array();

        foreach ($patients as $patient)
        {
            $response[] = $patient->patient_name;
        }

        echo json_encode($response);
    }

    public function save_patient_note()
    {
        $this->load->model('patients/Mdl_patient_notes');

        if ($this->Mdl_patient_notes->run_validation())
        {
            $this->Mdl_patient_notes->save();

            $response = array(
                'success' => 1
            );
        }
        else
        {
            $this->load->helper('json_error');
            $response = array(
                'success'           => 0,
                'validation_errors' => json_errors()
            );
        }

        echo json_encode($response);
    }

    public function load_patient_notes()
    {
        $this->load->model('patients/Mdl_patient_notes');

        $data = array(
            'patient_notes' => $this->Mdl_patient_notes->where('patient_id', $this->input->post('patient_id'))->get()->result()
        );

        $this->layout->load_view('patients/partial_notes', $data);
    }

    
    public function get_suggest_patients() 
    {
        $this->load->model('patients/Mdl_patients');
		echo json_encode($this->Mdl_patients->get_suggest_patient()->result_array());
    }

    function load_ajax() 
	{

        $this->load->library('datatables');
        $isfiltered = $this->input->post('filter');

        $this->datatables->select("u.id as id, 
        CONCAT(IF(up.lastname != '', up.lastname, ''),',',IF(up.firstname != '', up.firstname, '')) as fullname, 
        username, 
        email, 
        DATE_FORMAT(u.created, '%M %d, %Y') as created, 
        avatar, 
        DATE_FORMAT(CONCAT(IF(up.bYear != '', up.bYear, ''),'-',IF(up.bMonth != '', up.bMonth, ''),'-',IF(up.bDay != '', up.bDay, '')), '%M %d, %Y') as birthday,
        address, 
        mobile, 
        DATE_FORMAT(u.last_login, '%M %d, %Y') as last_login, 
        u.client_id as client_id",
        false);
        
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
}

?>