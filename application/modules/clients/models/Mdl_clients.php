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
class Mdl_Clients extends Response_Model
{
	public $table               = 'clients';
    public $primary_key         = 'clients.client_id';

    public function default_order_by()
    {
        $this->db->order_by('clients.client_name DESC');
    }

    function get_info($id)
	{
        $this->db->from($this->table);	
		$this->db->where($this->primary_key, $id);
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

}
