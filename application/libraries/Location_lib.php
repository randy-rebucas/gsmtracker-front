<?php

/**
 *
 * Location Library.php
 *
 */
class Location_lib {

    private $ci;                // for CodeIgniter Super Global Reference.
    // --------------------------------------------------------------------

    /**
     * PHP5        Constructor
     *
     */
    function __construct() {
        $this->ci = & get_instance();    // get a reference to CodeIgniter.
    }

    function populate(){
        $this->ci->db->from('location');
        $this->ci->db->where('location_type',0);
        $this->ci->db->order_by('name', 'asc');
        $query = $this->ci->db->get();
        $location  = array(''=>'select');
        foreach ($query->result_array() as $row) {
            $location[$row['location_id']] = ucfirst(strtolower($row['name']));
        }
        return $location;
    }

    function get_types($location_type, $id) {
        $this->ci->db->select('location_id, name');
        $this->ci->db->from('location');
        $this->ci->db->where('location_type', $location_type);
        $this->ci->db->where('parent_id', $id);
        return $this->ci->db->get();
    }
    
    function get_info($id)
    {  
        $this->ci->db->where('location_id', $id);
		$this->ci->db->from('location');
        $query = $this->ci->db->get();
        
        if($query->num_rows()==1)
        {
            return $query->row();
        }
        else
        {

            return false;
        }
    } 

	function get_all_state($country_id){
		$this->ci->db->from('states');
		$this->ci->db->where('parent_id', $country_id);
        $this->ci->db->where('location_type', 1);
        $this->ci->db->order_by('name', 'asc');
        return $this->ci->db->get();
	}
	
	function get_all_cities($state_id){
		$this->ci->db->from('location');
		$this->ci->db->where('parent_id', $state_id);
        $this->ci->db->where('location_type', 2);
        $this->ci->db->order_by('name', 'asc');
        return $this->ci->db->get();
	}
	
	function countries(){
		$this->ci->db->from('location');
        $this->ci->db->where('location_type', 0);
        $this->ci->db->order_by('name', 'asc');
        $query = $this->ci->db->get();
        $location  = array(''=>'select');
        foreach ($query->result_array() as $row) {
            $location[$row['location_id']] = ucfirst(strtolower($row['name']));
        }
        return $location;
	}
	
	function populate_countries(){
		$this->ci->db->select('location_id as value, name as text');
        $this->ci->db->from('location');
        return $this->ci->db->get();
	}

	function populate_states($id){
		$this->ci->db->select('location_id, name');
        $this->ci->db->from('location');
        $this->ci->db->where('parent_id', $id);
        return $this->ci->db->get();
	}
	
	function populate_cities($id){
		$this->ci->db->select('location_id, name');
        $this->ci->db->from('location');
        $this->ci->db->where('parent_id', $id);
        return $this->ci->db->get();
	}
	
	
}

// ------------------------------------------------------------------------
// End of Location_lib Library Class.

// ------------------------------------------------------------------------
/* End of file Location_lib.php */
/* Location: ../application/libraries/Location_lib.php */ 