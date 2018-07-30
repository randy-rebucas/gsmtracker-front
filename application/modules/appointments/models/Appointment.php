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
class Appointment extends CI_Model
{
    private $table              = 'appoinments';              
    private $pk                 = 'app_id';
    private $dOrder             = 'asc';      

    function exists($id, $client_id)
    {
        $this->db->from($this->table);   
        $this->db->where($this->pk,$id);
        $query = $this->db->get();
        
        return ($query->num_rows()==1);
    }
	
	function get_all($client_id)
    {
		$this->db->select('app_id as id, title, description, CONCAT(schedule_date, '. ', schedule_time) AS start,  CONCAT(firstname, '. ', lastname) AS fullname, avatar, username', FALSE);
        $this->db->from($this->table); 
        $this->db->join('users',$this->table.'.patient_id = users.id');
        $this->db->join('users_profiles',$this->table.'.patient_id = users_profiles.user_id');
		$this->db->where('users.client_id',$client_id);
        $this->db->order_by($this->pk, $this->dOrder);
        return $this->db->get();
    }

    function count_all($client_id)
    {
        $this->db->from($this->table);
        $this->db->where('client_id',$client_id);
        return $this->db->count_all_results();
    }
    
    function get_info($id)
    {
        $this->db->from($this->table);   
        $this->db->where($this->pk,$id);
        $query = $this->db->get();
        
        if($query->num_rows()==1)
        {
            return $query->row();
        }
        else
        {

            $obj=new stdClass();

            $fields = $this->db->list_fields($this->table);
            
            foreach ($fields as $field)
            {
                $obj->$field='';
            }
            
            return $obj;
        }
    } 

    function save(&$appointment_data, $client_id, $id=false)
    {
        $success=false;
		
		//Run these queries as a transaction, we want to make sure we do all or nothing
		$this->db->trans_start();

		if (!$id or !$this->exists($id, $client_id))
        {
            
			$success = $this->db->insert($this->table, $appointment_data);
			$id = $this->db->insert_id();
        }

        $this->db->where($this->pk, $id);
        $success = $this->db->update($this->table, $appointment_data);

		$this->db->trans_complete();		
		return $success;		
    }

    function delete($id)
    {
        $this->db->where($this->pk, $id);
        if($this->db->delete($this->table)){
			return true;
		}else{
			return $this->db->error();
		}
    }
	
}

