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

        $patient = $this->Mdl_patients->get_by_id($patient_id);
        //check if exist
        if(!$this->Mdl_queings->in_que($patient->id)->get()->num_rows()){
            
            $db_array = array(
                'que_id'    => $this->Mdl_queings->get()->num_rows() + 1,
                'user_id'   => $patient->id,
                'que_name'  => $patient->firstname.', '.$patient->lastname,
                'que_date'  => date('Y-m-d')
            );
    
            if ($this->Mdl_queings->save(NULL, $db_array))
            {
                $this->load->model('records/Mdl_records');

                $db_array = array(
                    'patient_id'  => $patient->id,
                    'record_date'  => date('Y-m-d'),
                    'record_time'  => date('h:i:s')
                );
                
                $this->Mdl_records->save(NULL, $db_array);

                $response = array(
                    'success' => true
                );
            }
            else
            {
                $response = array(
                    'success' => false,
                    'message' => 'Oooppps! failed to move in que!'
                );
            }
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
}

?>