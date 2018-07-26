<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Ajax extends Admin_Controller {

    public $ajax_controller = TRUE;

    public function create()
    {
        
        $this->load->model('patients/Mdl_patients');
        $this->load->model('queings/Mdl_queings');

        if ($this->Mdl_queings->run_validation()) {

            if(!$this->Mdl_queings->inQue($this->input->post('patient_name'))) {

                $num = $this->Mdl_queings->get()->num_rows() + 1;

                $db_array = array(
                    'queing_id'     => $num,
                    'patient_id'    => $this->Mdl_patients->get_by_field('patient_name', $this->input->post('patient_name'))->patient_id,
                    'patient_name'  => $this->input->post('patient_name'),
                    'visit_type'    => $this->input->post('visit_type'),
                    'visit_reason'  => $this->input->post('visit_reason'),
                    'user_id'       => $this->input->post('user_id')
                );

                $this->Mdl_queings->save(NULL, $db_array);
            
                $response = array(
                    'success'  => 1,
                    'patient_id' => $this->Mdl_patients->get_by_field('patient_name', $this->input->post('patient_name'))->patient_id
                );
            }
            else
            {
                $response = array(
                    'success'       => 0,
                    'custom_error'  => array('exist'=>$this->input->post('patient_name') .' is already in que!')
                );
            }
            
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

   
    public function clear_que() 
    {
        $this->load->model('queings/Mdl_queings');
        $this->Mdl_queings->clear();

        $response = array(
            'success'  => 1,
            'redirect'=> 'patients'
        );
		
        echo json_encode($response);
    }

    public function get_item()
    {
        $this->load->model('queings/Mdl_queings');
        $item = $this->Mdl_queings->get()->result_array();

        echo json_encode($item);
    }

    public function counts () 
    {
        $this->load->model('queings/Mdl_queings');
        $num = $this->Mdl_queings->get()->num_rows();
        
        echo json_encode(array('counts' => $num));
    }

    public function modal_create_que()
    {
        $this->load->module('layout');
        $this->lang->load('queings/queings', 'english');

        $data = array(
            'patient_name'    => $this->input->post('patient_name')
        );

        $this->layout->load_view('queings/modal_create_que', $data);
    }

}

?>