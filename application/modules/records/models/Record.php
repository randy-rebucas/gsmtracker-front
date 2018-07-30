<?php
/*
 * MyClinicSoft
 * 
 * A web based clinical system
 *
 * @package     MyClinicSoft
 * @author      Randy Rebucas
 * @copyright   Copyright (c) 2016 - 2018 MyClinicSoft, LLC
 * @license     http://www.myclinicsoft.com/license.txt
 * @link        http://www.myclinicsoft.com
 * 
 */
class Record extends CI_Model
{
    private $table              = 'records';              
    private $pk                 = 'record_id';
    private $dOrder             = 'desc';      

    function get_all($type = null)
    {

        $this->db->from($this->table); 
		if($type)
		{
			$this->db->where('type', $type);
		}

		$this->db->where('status', 1);  
        $this->db->order_by('sort', 'asc');
        return $this->db->get();
    }
	
	function count_all($id)
    {
        $this->db->from($this->table);   
        $this->db->where($this->pk,$id); 
        return $this->db->count_all_results();
    }
	//
	function exists($type, $id)
    {
        $this->db->from('records_'.$type);   
        $this->db->where('id',$id);
        $query = $this->db->get();
        
        return ($query->num_rows()==1);
    }

	function get_all_file_data($type, $user_id)
	{
		$this->db->from('records_'.$type); 
		$this->db->order_by('id', 'desc');
        $this->db->where('user_id', $user_id);
		$qry = $this->db->get();

		return $qry->result_array();
	}
	
	function get_all_data($type, $user_id, $maintainable = null)
	{
		$this->db->from('records_'.$type); 
		$this->db->order_by('id', 'desc');
		$this->db->where('user_id', $user_id);
		if($maintainable)
		{
			$this->db->where('is_mainteinable', $maintainable);
		}
		//$this->db->group_by('date');
		$qry = $this->db->get();

		return $qry->result_array();
	}

	function get_current_data($type, $user_id, $date, $maintainable = null)
	{
		
		$this->db->from('records_'.$type); 
		$this->db->where('user_id', $user_id);
		$this->db->where('date', $date);
		
		if($type == 'medications'){
			$this->db->order_by('is_mainteinable', 'desc');
		}else{
			$this->db->order_by('id', 'desc');
		}

		$this->db->limit(8);
		$qry = $this->db->get();

		return $qry->result_array();
	}
	
    function count_all_by_type($type, $id)
    {
        $this->db->from('records_'.$type);   
        $this->db->where('id',$id); 
        return $this->db->count_all_results();
    }
	
	function get_xeditval($type, $id, $date = null)
    {
        $this->db->from('records_'.$type);   
        $this->db->where('user_id', $id);
		if($date){
			$this->db->where('date', $date);
		}
		
		$this->db->limit(1);
		$this->db->order_by('id', 'desc');
        $query = $this->db->get();
        
        if($query->num_rows()==1)
        {
            return $query->row();
        }
        else
        {

            $obj=new stdClass();

            $fields = $this->db->list_fields('records_'.$type);
            
            foreach ($fields as $field)
            {
                $obj->$field='';
            }
            
            return $obj;
        }
    } 
	
	function get_info_by_id($id, $table)
    {
        $this->db->from($table);   
        $this->db->where($this->pk, $id);
        $query = $this->db->get();
        
        if($query->num_rows()==1)
        {
            return $query->row();
        }
        else
        {

            $obj=new stdClass();

            $fields = $this->db->list_fields($table);
            
            foreach ($fields as $field)
            {
                $obj->$field='';
            }
            
            return $obj;
        }
    } 

    function get_info($type, $id)
    {
        $this->db->from('records_'.$type);   
        $this->db->where('id', $id);
        $query = $this->db->get();
        
        if($query->num_rows()==1)
        {
            return $query->row();
        }
        else
        {

            $obj=new stdClass();

            $fields = $this->db->list_fields('records_'.$type);
            
            foreach ($fields as $field)
            {
                $obj->$field='';
            }
            
            return $obj;
        }
    } 

    function exists_table($id, $client_id)
    {
        $this->db->from('custom_records');   
        $this->db->where('record_id',$id);
        $this->db->where('client_id',$client_id);
        $query = $this->db->get();
        
        return ($query->num_rows()==1);
    }

	function save_table($record_data, $client_id, $id=false)
    {
        if (!$id or !$this->exists_table($id, $client_id))
        {
            if($this->db->insert('custom_records', $record_data))
            {

                $record_data['id'] = $this->db->insert_id();

                $this->create_table($record_data['slug'], $client_id, $id);

                return true;
            }
            return false;
        }

        $this->create_table($record_data['slug'], $client_id, $id);

        $this->db->where('record_id', $id);
        return $this->db->update('custom_records', $record_data);

    }

    function get_by_id($id)
    {
        return $this->db->where($this->pk, $id)->get('custom_records')->row();
    }

    function create_table($slug, $client_id, $id) {
    	
    	$this->load->dbforge();
        
        $original_record = $this->get_by_id($id);

        if (isset($original_record)) {
        	
	    	if ($original_record->slug != $slug) {
	        	//rename
	        	return $this->dbforge->rename_table('records_'.$original_record->slug.'_'.$client_id, 'records_'.$slug.'_'.$client_id);
        	}
	        	
        } else {

        	$fields = array(
	           	'id' => array(
	                'type' => 'INT',
	                'constraint' => 5,
	                'auto_increment' => TRUE
	            ),
	            'date' => array(
	                'type' => 'date'
	            ),
	            'user_id' => array(
	                'type' =>'INT',
	                'constraint' => 11
	            )
	        );

			$this->dbforge->add_field($fields);

			$this->dbforge->add_key('id', TRUE);
		
	        return $this->dbforge->create_table('records_'.$slug.'_'.$client_id);
        }

    }

    function delete($id)
    {
    	$slug = $this->db->where('record_id', $id)->get('records')->row()->slug;

        $this->db->where('record_id', $id); //lab_test_results
        if($this->db->delete('records')) {
        	
        	$this->load->dbforge();

        	return $this->dbforge->drop_table('records_'.$slug, TRUE);
        }
    }
	
	function delete_record($id, $table)
    {
    	
        $this->db->where('record_id', $id); 
        return $this->db->delete($table);
    }

	function get_suggest_record($type, $fields)
	{
		
		switch ($fields) {
			case "preparation":
				$this->db->select('id, preparation AS name', FALSE);
				$group = 'preparation';
				break;
			case "sig":
				$this->db->select('id, sig AS name', FALSE);
				$group = 'sig';
				break;
			default:
				$this->db->select('id, medicine AS name', FALSE);
				$group = 'medicine';
		}

		$this->db->from('records_'.$type); 
		$this->db->order_by('id', 'asc');
		$this->db->group_by($group);
		return $this->db->get();

	}
    
    function switch_status($status, $type, $id) {
        $table = ($type == 'default') ? 'records' : 'custom_records' ;
        $this->db->set('status', $status);
        $this->db->where('record_id', $id);
        return $this->db->update($table);
    }
}
