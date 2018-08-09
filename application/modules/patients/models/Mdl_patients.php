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
class Mdl_Patients extends Response_Model
{
	public $table               = 'users';
    public $primary_key         = 'users.id';

	// public function db_array()
    // {
    //     $db_array = parent::db_array();

    //     if (!isset($db_array['patient_active']))
    //     {
    //         $db_array['patient_active'] = 0;
    //     }

    //     return $db_array;
    // }

    public function default_order_by()
    {
        $this->db->order_by('users.username DESC');
    }

    // public function default_join()
    // {
	// 	$this->db->join('users_profiles',	'users_profiles.user_id = users.id', 'left');		
    // }
    public function validation_rules()
    {
        return array(
            'client_id'        => array(
                'field' => 'client_id',
                'label' => lang('patient'),
                'rules' => 'required'
            ),
            'last_ip' => array(
                'field' => 'last_ip',
                'label' => lang('quote_date'),
                'rules' => 'required'
            ),
            'created'   => array(
                'field' => 'created',
                'label' => lang('quote_group'),
                'rules' => 'required'
            ),
            'token'            => array(
                'field' => 'token',
                'label' => lang('user'),
                'rule'  => 'required'
            )
        );
    }

	public function patient_lookup($patient_name)
    {
        $patients = $this->Mdl_patients->where('patient_name', $patient_name)->get();

        if ($patients->num_rows())
        {
            $patient_id = $patients->row()->patient_id;
        }
        else
        {
            $db_array = array(
                'patient_name' => $patient_name
            );

            $patient_id = parent::save(NULL, $db_array);
        }

        return $patient_id;
	}
	
	function get_suggest_patient()
	{
		$this->db->select('patient_id, patient_name AS name', FALSE);
        $this->db->order_by('patient_id', 'asc');
        $this->db->from($this->table); 
		return $this->db->get();

	}

	public function create($db_array = NULL, $patient_role_id)
    {

        if($this->db->insert('users_profiles', $db_array))
        {
            $db_array = array(
                'role_id'           => $patient_role_id,
                'user_id'           => $db_array['user_id']
            );
            return $this->db->insert('users_role', $db_array);
        }
	}
	
	// function save(&$user_data, &$profile_data, &$custom_data, $role_id, $id=false)
	// {
	// 	$success=false;
		
	// 	$this->db->trans_start();
			
	// 	if(parent::save_profile($user_data, $profile_data, $id))
	// 	{
	// 		if (!$id or !$this->exists($id))
	// 		{
				
	// 			$custom_data['user_id'] = $id = $user_data['id'];
				
	// 			if($this->db->insert('users_custom', $custom_data)) 
	// 			{

	// 				$patient_data=array(
	// 					'patient_id'     => $custom_data['user_id'],
	// 					'patient_pin'    => random_string('numeric',6)
	// 				);
					
	// 				if($this->db->insert('patients', $patient_data))
	// 				{
	// 					$_data=array(
	// 						'user_id'     => $custom_data['user_id'],
	// 						'role_id'     => $role_id
	// 					);
						
	// 					$success = $this->db->insert('users_role', $_data);
	// 				}
					
	// 			}

				
	// 		}
	// 		else
	// 		{

	// 			$this->db->set('user_id', $id);
	// 			$success = $this->db->update('users_custom', $custom_data);
				
	// 		}
			
	// 	}
		
	// 	$this->db->trans_complete();		
	// 	return $success;
		
	// }

	// function delete($id)
	// {
	// 	$this->db->where('id', $id);
	// 	return $this->db->delete('users');
	// }
}
