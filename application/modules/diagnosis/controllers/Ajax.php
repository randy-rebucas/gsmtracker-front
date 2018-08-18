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

 	public function get_suggest_diagnosis()
    {
        $this->load->model('diagnosis/Mdl_diagnosis');
        $query = $this->input->get('q');
        $results = $this->Mdl_diagnosis->select('diagnos_id as id, diagnos_name as text')->like('diagnos_name', $query)->order_by('diagnos_name')->get()->result_array();
        echo json_encode($results);
    }
}

?>