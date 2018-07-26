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
class Mdl_Queings extends Response_Model
{	
    public $table               = 'queings';
    public $primary_key         = 'queings.queing_id';
	
	public function validation_rules()
    {
        return array(
            'patient_name'        => array(
                'field' => 'patient_name',
                'label' => lang('patient'),
                'rules' => 'required'
            ),
            'visit_reason' => array(
                'field' => 'visit_reason',
                'label' => lang('queing_reason'),
                'rules' => 'required'
            ),
            'visit_type'   => array(
                'field' => 'visit_type',
                'label' => lang('queing_type'),
                'rules' => 'required'
            )
        );
	}
    
    function clear() 
    {
        return $this->db->empty_table($this->table);
    }

    function inQue($name)
    {
        $this->db->from($this->table);   
        $this->db->where('patient_name', $name);
        return $this->db->get()->row();
    }

	function process($patient_id, $type, $reason, $user_id, $status)
	{

		$data = array(
            'visit_type'	=> $type,
            'visit_reason'	=> $type,
			'patient_id'	=> $patient_id,
			'user_id'	    => $user_id,
			'visit_status'	=> $status
		);
		return $this->db->insert('fi_visits', $data);
			
	}
	
}