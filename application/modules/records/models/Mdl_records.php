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
class Mdl_Records extends Response_Model
{
	public $table               = 'records';
    public $primary_key         = 'records.record_id';

    public function default_order_by()
    {
        $this->db->order_by('records.record_date DESC');
    }

    public function is_current()
    { 
        $this->filter_where('record_date', date('Y-m-d'));
        return $this;
    }

    public function record_from($patient_id)
    {
        $this->filter_where('patient_id', $patient_id);
        return $this;
    }

    public function create($patient, $db_array = NULL)
    {
        $record_id = parent::save(NULL, $db_array);
        $this->load->model('queings/Mdl_queings');

        $db_array = array(
            'que_id'    => $this->Mdl_queings->get()->num_rows() + 1,
            'user_id'   => $patient->id,
            'que_name'  => $patient->firstname.', '.$patient->lastname,
            'que_date'  => date('Y-m-d'),
            'record_id' => $record_id
        );

        return $this->db->insert('queing', $db_array);
    }
    // public function default_join()
    // {
    //     $this->db->join('records_vital_signs', 'records_vital_signs.record_id= records.record_id');
    // }
}
