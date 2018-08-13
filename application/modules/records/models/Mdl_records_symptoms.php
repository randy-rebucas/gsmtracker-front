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
class Mdl_Records_Symptoms extends Response_Model
{
	public $table               = 'records_symptoms';
    public $primary_key         = 'records_symptoms.records_symptoms_id';

    public function validation_rules()
    {
        return array(
            'signs'        => array(
                'field' => 'records_symptoms_signs',
                'label' => lang('signs'),
                'rules' => 'required'
            ),
            'diagnosis' => array(
                'field' => 'records_symptoms_diagnosis',
                'label' => lang('diagnosis'),
                'rules' => 'required'
            )
        );
    }

    public function default_order_by()
    {
        $this->db->order_by('records_symptoms.records_symptoms_date DESC');
    }

    public function is_current()
    {
        $this->filter_where('records_symptoms_date', date('Y-m-d'));
        return $this;
    }
}
