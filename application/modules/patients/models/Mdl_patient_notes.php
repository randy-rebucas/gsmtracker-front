<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Mdl_Patient_Notes extends Response_Model {

	public $table		 = 'fi_patient_notes';
	public $primary_key = 'fi_patient_notes.patient_note_id';

	public function default_order_by()
	{
		$this->db->order_by('fi_patient_notes.patient_note_date DESC');
	}

	public function validation_rules()
	{
		return array(
			'patient_id' => array(
				'field'			 => 'patient_id',
				'label'			 => lang('patient'),
				'rules'			 => 'required'
			),
			'patient_note'	 => array(
				'field'	 => 'patient_note',
				'label'	 => lang('note'),
				'rules'	 => 'required'
			)
		);
	}

	public function db_array()
	{
		$db_array = parent::db_array();
        
        $db_array['patient_note_date'] = date('Y-m-d');

		return $db_array;
	}

}

?>