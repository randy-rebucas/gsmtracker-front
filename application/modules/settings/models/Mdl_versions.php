<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Mdl_Versions extends Response_Model {
	
	public $table = 'fi_versions';
	public $primary_key = 'fi_versions.version_id';
    
    public function default_select()
    {
        $this->db->select('SQL_CALC_FOUND_ROWS *', FALSE);
    }
	
	public function default_order_by()
	{
		$this->db->order_by('fi_versions.version_date_applied DESC, fi_versions.version_file DESC');
	}
	
}

?>