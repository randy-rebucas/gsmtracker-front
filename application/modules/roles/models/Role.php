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
class Role extends CI_Model
{
    private $table              = 'roles';              
    private $pk                 = 'role_id';
    private $dOrder             = 'asc';      

    function exists($id, $client_id)
    {
        $this->db->from($this->table);   
        $this->db->where($this->pk,$id);
        $query = $this->db->get();
        
        return ($query->num_rows()==1);
    }
	
	function get_all($client_id, $status = null)
    {

        $this->db->from($this->table); 
		$this->db->where('role_status',$status);
		$this->db->where('client_id',$client_id);
        $this->db->order_by($this->pk, $this->dOrder);
        return $this->db->get();
    }

    function count_all($client_id, $id = null)
    {
        $this->db->from($this->table);
		if($id != null)
        {
			$this->db->where($this->pk,$id); 
        }
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

    function save(&$role_data, $module_data, $client_id, $id=false)
    {
        $success=false;
		
		//Run these queries as a transaction, we want to make sure we do all or nothing
		$this->db->trans_start();

		if (!$id or !$this->exists($id, $client_id))
        {
			$success = $this->db->insert($this->table, $role_data);
            $id = $this->db->insert_id();
            if($success)
            {
                $success =  $this->insert_permissions($module_data, $id, $client_id);
            }
           
        }

        $this->db->where($this->pk, $id);
        $success = $this->db->update($this->table, $role_data);
        if($success)
        {
            $success =  $this->insert_permissions($module_data, $id, $client_id);
        }
		$this->db->trans_complete();		
		return $success;		
    }

    function insert_permissions($module_data, $id, $client_id) 
    {
        $success=false;
		
		//Run these queries as a transaction, we want to make sure we do all or nothing
        $this->db->trans_start();
        
		if($this->db->delete('roles_permissions', array('role_id' => $id, 'client_id' => $client_id)))
		{
			foreach($module_data as $module)
			{
				$arr = explode('-', $module);
				$success =  $this->db->insert('roles_permissions', array('role_id' => $id, 'section' => $arr[0], 'action' => $arr[1], 'client_id' => $client_id));
			}
        }
        
        $this->db->trans_complete();		
		return $success;
    }

    function has_permission($module, $role_id, $action, $client_id)
	{

		$this->db->where('section',$module);
		$this->db->where('role_id',$role_id);
		$this->db->where('action',$action);
		$this->db->where('client_id',$client_id);
		$query = $this->db->get('roles_permissions');
		
		if( $query->num_rows() > 0 ){ 
			return TRUE;
		} else { 
			return FALSE; 
		}

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
	
	function get_all_permited($role_id, $action, $client_id)
    {
        $this->db->from('roles_permissions'); 
		$this->db->where('role_id',$role_id);
		$this->db->where('client_id',$client_id);
		$this->db->where('action', $action);
        $this->db->order_by('section', 'asc');
        return $this->db->get();
    }

    /**
	 * Get Role Id by Name 
	 *
	 * @param	string
	 * @return	int
	 */
	function get_by_role_slug($role_slug, $client_id)
    {
		$this->db->where('role_slug', $role_slug);
		$this->db->where('client_id', $client_id);
        return $this->db->get('roles')->row()->role_id;
	}
}
