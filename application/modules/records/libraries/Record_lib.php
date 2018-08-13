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
        $tab = $this->ci->input->post('tab');
		$this->ci->session->set_userdata('tab_mode', $tab);
	}

	public function clear_tab()
	{
		$this->ci->session->unset_userdata('tab_mode');
    }
}
?>