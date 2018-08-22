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

    public function move_in($patient_id)
    {
        $this->load->model('queings/Mdl_queings');
        $this->load->model('patients/Mdl_patients');
        $this->load->model('records/Mdl_records');

        $patient = $this->Mdl_patients->get_by_id($patient_id);
        //check if exist
        if(!$this->Mdl_queings->in_que($patient->id)->is_current()->get()->num_rows()){

            $db_array = array(
                'patient_id'    => $patient->id,
                'record_date'   => date('Y-m-d'),
                'record_time'   => date('h:i:s')
            );

            $this->Mdl_records->create($patient, $db_array);
            
            $response = array(
                'success' => true
            );
            
        } 
        else 
        {
            $response = array(
                'success' => false,
                'message' => 'Patient ID: '.$this->Mdl_queings->in_que($patient->id)->get()->row()->user_id .' is in que!'
            );
        }
 
        echo json_encode($response);
    }

    public function move_out($record_id){

        $this->load->model('queings/Mdl_queings');
        $this->Mdl_queings->delete($this->Mdl_queings->select('id')->where('record_id', $record_id)->get()->row()->id);

        $this->load->model('records/Mdl_records');
        $this->Mdl_records->delete($record_id);

        echo json_encode(array(
            'success' => true
        ));
    }

    function get_counts()
	{
        $this->load->model('queings/Mdl_queings');
		echo json_encode(array('counts' => $this->Mdl_queings->get()->num_rows()));
    }
    
    function get_que()
    {
        $this->load->model('queings/Mdl_queings');
        $data['results'] = $this->Mdl_queings->get()->result_array();
        $this->load->view('manage', $data);
    }

    function clear_all()
    {
        $this->load->model('queings/Mdl_queings');
        if($this->Mdl_queings->clear()){
            $response = array(
                'success' => true
            );
        }
        
    }

    function process($record_id) 
	{ 
        $this->load->model('queings/Mdl_queings');
        $this->load->model('records/Mdl_records');
        $this->load->library('records/record_lib');

        $record = $this->Mdl_records->get_by_id($record_id);

        $db_array = array(
            'record_status' => 1
        );

        if ($this->Mdl_records->save($record->record_id, $db_array)) {
   
            $que_id = $this->Mdl_queings->where(array('user_id' => $record->patient_id, 'que_date' => $record->record_date))->get()->row()->id;

	        $this->Mdl_queings->delete($que_id);
	        
            $redirect = ($this->record_lib->next()) ? base_url().'patients/records/'.$this->record_lib->next() : site_url('patients');
            echo json_encode(
                array(
                    'success' => true, 
                    'message' => 'Patient successfully remove in wating list!', 
                    'redirect'=> $redirect
                )
            );
			
    	}

	}
}

?>