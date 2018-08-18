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
    
 	public function get_suggest_symptoms()
    {
        $this->load->model('symptoms/Mdl_symptoms');
        $query = $this->input->get('q');
        $results = $this->Mdl_symptoms->select('symptom_id as id, symptom_name as text')->like('symptom_name', $query)->order_by('symptom_name')->get()->result_array();
        echo json_encode($results);
    }
}

?>