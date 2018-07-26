<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Ajax extends Admin_Controller {

    public $ajax_controller = TRUE;

    public function save()
    {
        $this->load->model('appointments/mdl_appointments');
       
        $appointment_id = $this->input->post('appointment_id');

        $this->mdl_appointments->set_id($appointment_id);

        if ($this->mdl_appointments->run_validation('validation_rules'))
        {

            $db_array = array(
                'appointment_date'		        =>$this->input->post('schedule_date'),
                'appointment_time'		        =>$this->input->post('schedule_time'),
                'appointment_description'		=>$this->input->post('description'),
                'appointment_title'				=>$this->input->post('title'),
                'appointment_patient_id'		=>$this->input->post('patient_id'),
                'appointment_doctor_id'			=>$this->input->post('doctor_id'),
                'appointment_status'			=>$this->input->post('status'),
                'appointment_doctor_note'		=>$this->input->post('doctor_note'),
                'appointment_patient_note'		=>$this->input->post('patient_note')
            );

            $this->mdl_appointments->save($appointment_id, $db_array);

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

    public function modal_create_appointment()
    {
        $this->load->module('layout');

        $this->load->model('invoice_groups/mdl_invoice_groups');
        $this->load->model('tax_rates/mdl_tax_rates');

        $data = array(
            'invoice_groups' => $this->mdl_invoice_groups->get()->result(),
            'tax_rates'      => $this->mdl_tax_rates->get()->result(),
            'client_name'    => $this->input->post('client_name')
        );

        $this->layout->load_view('appointments/modal_create_appointment', $data);
    }

    public function get()
	{
        $this->load->model('appointments/mdl_appointments');
		echo json_encode($this->mdl_appointments->get()->result_array());

	}

}

?>