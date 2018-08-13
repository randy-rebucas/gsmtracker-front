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
        $this->load->model('records/Mdl_queings');
        $this->load->model('patients/Mdl_patients');

        $patient = $this->Mdl_patients->get_by_id($patient_id);

        $db_array = array(
            'user_id'   => $patient->id,
            'que_name'  => $patient->firstname.', '.$patient->lastname,
            'que_date'  => date('Y-m-d')
        );

        if ($this->Mdl_queings->save(NULL, $db_array))
        {
            //$db_array = array();

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