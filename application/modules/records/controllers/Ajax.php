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

    public function save_vital_signs()
    {
        $this->load->model('records/Mdl_records_vital_signs');

        $db_array = array(
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

}

?>