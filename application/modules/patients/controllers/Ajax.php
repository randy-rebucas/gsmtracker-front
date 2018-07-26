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

    
}

?>