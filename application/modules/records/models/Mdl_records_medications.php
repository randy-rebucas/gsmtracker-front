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
class Mdl_Records_Medications extends Response_Model
{
	public $table               = 'records_medications';
    public $primary_key         = 'records_medications.records_medications_id';

    public function validation_rules()
    {
        return array(
            'medicine'        => array(
                'field' => 'records_medications_medicine',
                'label' => lang('signs'),
                'rules' => 'required'
            ),
            'preparation' => array(
                'field' => 'records_medications_preparation',
                'label' => lang('follow_up_date'),
                'rules' => 'required'
            ),
            'sig'        => array(
                'field' => 'records_medications_sig',
                'label' => lang('signs'),
                'rules' => 'required'
            ),
            'quantity' => array(
                'field' => 'records_medications_qty',
                'label' => lang('follow_up_date'),
                'rules' => 'required'
            )
        );
    }

    public function default_order_by()
    {
        $this->db->order_by('records_medications.records_medications_date DESC');
    }

    public function default_group_by()
    {
        $this->db->group_by('records_medications.records_medications_date');
    }

    public function is_current()
    {
        $this->filter_where('records_medications_date', date('Y-m-d'));
        return $this;
    }

    public function by_record_id($record_id)
    {
        $this->filter_where('record_id', $record_id);
        return $this;
    }
    
    public function get_all($record_id){
        
        return $this->db->get_where('records_medications', array('record_id' => $record_id));
    }
}
