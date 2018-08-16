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

class Record_Lib {

    function __construct()
	{
		$this->ci =& get_instance();
	}

    public function get_tab()
	{
		if(!$this->ci->session->userdata('tab_mode'))
		{
			$this->set_tab('vital-signs');
		}

		return $this->ci->session->userdata('tab_mode');
	}

	public function set_tab($tab)
	{
		$this->ci->session->set_userdata('tab_mode', $tab);
	}

	public function clear_tab()
	{
		$this->ci->session->unset_userdata('tab_mode');
	}
	
	function next() 
	{
		$this->ci->load->model('queings/Mdl_queings');
		
		if($this->ci->Mdl_queings->get()->num_rows() > 0){
			$results = $this->ci->Mdl_queings->get()->result();
			$que = reset($results);
			return $que->user_id;
		}
		return null;
	}
}
?>