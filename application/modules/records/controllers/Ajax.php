<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/*
 * FusionInvoice
 * 
 * A free and open source web based invoicing system
 *
 * @package		FusionInvoice
 * @author		Jesse Terry
 * @copyright	Copyright (c) 2012 - 2013 FusionInvoice, LLC
 * @license		http://www.fusioninvoice.com/license.txt
 * @link		http://www.fusioninvoice.com
 * 
 */

class Ajax extends Secure_Controller {

    public $ajax_controller = TRUE;

    public function set_tab($tab) 
    {
        $this->load->library('records/record_lib');
        $tab = $this->input->post('tab');
        if($this->record_lib->set_tab($tab))
        {
            echo json_encode(array('success' => 1, 'message'=>''));
        }
    }
    
    public function get_allergies()
    {
        $this->load->model('records/Mdl_records_allergies');
        echo json_encode($this->Mdl_records_allergies->record_from($this->input->get('patient_id'))->get()->result());
    }

    public function remove_allergies($id){
        $this->load->model('records/Mdl_records_allergies');
        $this->Mdl_records_allergies->delete($id);
        echo json_encode(array('success'=>true));
    }

    public function get_hestories()
    {
        $this->load->model('records/Mdl_records_family_histories');
        echo json_encode($this->Mdl_records_family_histories->record_from($this->input->get('patient_id'))->get()->result());
    }

    public function remove_histories($id){
        $this->load->model('records/Mdl_records_family_histories');
        $this->Mdl_records_family_histories->delete($id);
        echo json_encode(array('success'=>true));
    }
    
    public function remove_advice()
    {
        $this->load->model('records/Mdl_records_advice');
        $this->Mdl_records_advice->delete($id);
        echo json_encode(array('success'=>true));
    }
    
    public function remove_medications()
    {
        $this->load->model('records/Mdl_records_medications');
        $this->Mdl_records_medications->delete($id);
        echo json_encode(array('success'=>true));
    }

    public function remove_investigations()
    {
        $this->load->model('records/Mdl_records_investigations');
        $this->Mdl_records_investigations->delete($id);
        echo json_encode(array('success'=>true));
    }

    public function remove_symptoms()
    {
        $this->load->model('records/Mdl_records_symptoms');
        $this->Mdl_records_symptoms->delete($id);
        echo json_encode(array('success'=>true));
    }

    public function remove_vital_signs()
    {
        $this->load->model('records/Mdl_records_vital_signs');
        $this->Mdl_records_vital_signs->delete($id);
        echo json_encode(array('success'=>true));
    }

    public function save_allergies()
    {
        $this->load->model('records/Mdl_records_allergies');

        $db_array = array(
            'patient_id'                  => $this->input->post('patient_id'),
            'records_allergies_medicine'  => $this->input->post('allergies'),
            'records_allergies_date'      => date('Y-m-d')
        );

        if ($this->Mdl_records_allergies->save(NULL, $db_array))
        {
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

    public function save_family_hitories()
    {
        $this->load->model('records/Mdl_records_family_histories');

        $db_array = array(
            'patient_id'                        => $this->input->post('patient_id'),
            'records_family_histories_hitory'   => $this->input->post('family_hitories'),
            'records_family_histories_date'     => date('Y-m-d')
        );

        if ($this->Mdl_records_family_histories->save(NULL, $db_array))
        {
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

    public function save_vital_signs()
    {
        $this->load->model('records/Mdl_records_vital_signs');

        $db_array = array(
            'record_id'                     => $this->input->post('record_id'),
            'records_vital_signs_weight'    => $this->input->post('weight'),
            'records_vital_signs_height'    => $this->input->post('height'),
            'records_vital_signs_temp'      => $this->input->post('tempature'),
            'records_vital_signs_bp'        => $this->input->post('bp'),
            'records_vital_signs_pulse'     => $this->input->post('pulse'),
            'records_vital_signs_bmi'       => $this->input->post('bmi'),
            'records_vital_signs_date'      => date('Y-m-d')
        );

        if ($this->Mdl_records_vital_signs->save(NULL, $db_array))
        {
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

    public function save_symptoms()
    {
        $this->load->model('records/Mdl_records_symptoms');

        $db_array = array(
            'record_id'                     => $this->input->post('record_id'),
            'records_symptoms_signs'        => $this->input->post('sign_symptoms'),
            'records_symptoms_diagnosis'    => $this->input->post('diagnoses'),
            'records_symptoms_date'         => date('Y-m-d')
        );

        if ($this->Mdl_records_symptoms->save(NULL, $db_array))
        {
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

    public function save_investigation()
    {
        $this->load->model('records/Mdl_records_investigations');

        $db_array = array(
            'record_id'                     => $this->input->post('record_id'),
            'records_investigations_investigation'=> $this->input->post('investigations'),
            'records_investigations_date'         => date('Y-m-d')
        );

        if ($this->Mdl_records_investigations->save(NULL, $db_array))
        {
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

    public function save_medication()
    {
        $this->load->model('records/Mdl_records_medications');

        $db_array = array(
            'record_id'                     => $this->input->post('record_id'),
            'records_medications_medicine'      => $this->input->post('medicine'),
            'records_medications_preparation'   => $this->input->post('preparation'),
            'records_medications_sig'           => $this->input->post('sig'),
            'records_medications_qty'           => $this->input->post('quantity'),
            'records_medications_date'          => date('Y-m-d')
        );

        if ($this->Mdl_records_medications->save(NULL, $db_array))
        {
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

    public function save_advice()
    {
        $this->load->model('records/Mdl_records_advice');

        $db_array = array(
            'record_id'                     => $this->input->post('record_id'),
            'records_advice_advice'         => $this->input->post('advices'),
            'records_advice_follow_up_date' => $this->input->post('followup_date'),
            'records_advice_date'           => date('Y-m-d')
        );

        if ($this->Mdl_records_advice->save(NULL, $db_array))
        {
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
}

?>