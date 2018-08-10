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
class Mdl_Appointments extends Response_Model
{
	public $table               = 'appointments';
    public $primary_key         = 'appointments.appointment_id';

    public function default_order_by()
    {
        $this->db->order_by('appointments.appointment_date DESC');
    }

    function get_info($id)
	{
        $this->db->from('appointments');	
		$this->db->join('users_profiles', 'users_profiles.user_id = appointments.appointment_patient_id', 'left');
		$this->db->where('appointments.appointment_id',$id);
		$query = $this->db->get();
		
		if($query->num_rows()==1)
		{
			return $query->row();
		}
		else
		{
			$obj=new stdClass();
            
            $main_table = $this->db->list_fields('appointment');
            $join_table = $this->db->list_fields('users_profiles');
            $fields = array_merge($main_table, $join_table);

			foreach ($fields as $field)
			{
				$obj->$field='';
			}
			
			return $obj;
		}
    }

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

}
