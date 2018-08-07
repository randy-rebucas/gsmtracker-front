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
class Patient extends User_model
{
	private $table              = 'users';              
    private $pk                 = 'id';
    private $dOrder             = 'asc'; 
	
	function exists($user_id)
	{
		$this->db->from('users');	
		$this->db->join('users_profiles', 'users_profiles.user_id = users.id');
		$this->db->join('users_custom', 'users_custom.user_id = users.id');
		$this->db->where('users.client_id',$this->client_id);
		$this->db->where('users.id',$user_id);
		$query = $this->db->get();
		
		return ($query->num_rows()==1);
	}
	
	function get_all($role = false)
	{	
		$this->db->from('users as u');			
		$this->db->join('users_profiles as up','up.user_id = u.id');
		$this->db->join('users_custom as uc', 'uc.user_id = u.id');
		//$this->db->where('u.client_id',$this->client_id);
		if($role){
			$this->db->where('u.role_id', $role);	
		}	
			
		$this->db->order_by('up.lastname', 'asc');
		return $this->db->get();
				
	}
	
	function get_by_id($id)
    {
        return $this->db->where('user_id', $id)->get('users_custom')->row();
    }
	
	function get_info($id)
	{
	
		$this->db->from('users_custom');	
		$this->db->join('users', 'users.id = users_custom.user_id');
		$this->db->join('users_profiles', 'users_profiles.user_id = users_custom.user_id');
		$this->db->where('users_custom.user_id',$id);
		$query = $this->db->get();
		
		if($query->num_rows()==1)
		{
			return $query->row();
		}
		else
		{
			//Get empty base parent object, as $employee_id is NOT an employee
			$person_obj=parent::get_profile_info(-1);
			
			//Get all the fields from employee table
			$fields = $this->db->list_fields('users_custom');
			
			//append those fields to base parent object, we we have a complete empty object
			foreach ($fields as $field)
			{
				$person_obj->$field='';
			}
			
			return $person_obj;
		}
	}

	function save(&$user_data, &$profile_data, &$custom_data, $role_id, $id=false)
	{
		$success=false;
		
		$this->db->trans_start();
			
		if(parent::save_profile($user_data, $profile_data, $id))
		{
			if (!$id or !$this->exists($id))
			{
				
				$custom_data['user_id'] = $id = $user_data['id'];
				
				if($this->db->insert('users_custom', $custom_data)) 
				{

					$patient_data=array(
						'patient_id'     => $custom_data['user_id'],
						'patient_pin'    => random_string('numeric',6)
					);
					
					if($this->db->insert('patients', $patient_data))
					{
						$_data=array(
							'user_id'     => $custom_data['user_id'],
							'role_id'     => $role_id
						);
						
						$success = $this->db->insert('users_role', $_data);
					}
					
				}

				
			}
			else
			{

				$this->db->set('user_id', $id);
				$success = $this->db->update('users_custom', $custom_data);
				
			}
			
		}
		
		$this->db->trans_complete();		
		return $success;
		
	}

	function delete($id)
	{
		$this->db->where('id', $id);
		return $this->db->delete('users');
	}
}
