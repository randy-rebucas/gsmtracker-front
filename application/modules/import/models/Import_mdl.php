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
class Import_mdl extends CI_Model
{
    private $table              = 'import';              
    private $pk                 = 'import_id';
    private $dOrder             = 'asc';      

    function exists($id, $client_id)
    {
        $this->db->from($this->table);   
        $this->db->where($this->pk,$id);
        $this->db->where('client_id',$client_id);
        $query = $this->db->get();
        
        return ($query->num_rows()==1);
    }
	
	function get_all($client_id)
    {

        $this->db->from($this->table); 
		$this->db->where('client_id',$client_id);
        $this->db->order_by($this->pk, $this->dOrder);
        return $this->db->get();
    }

    function count_all($client_id, $id = null)
    {
        $this->db->from($this->table);
			if($id != null){
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

    function save(&$data, $client_id)
    {
        if (!$id or !$this->exists($id, $client_id))
        {
			return $this->db->insert($this->table,$data);
        }

        $this->db->where($this->pk, $id);
        return $this->db->update($this->table,$data);
    }

    function delete($id)
    {
        $this->db->where($this->pk, $id);
        return $this->db->delete($this->table);
    }
	
}
?>
