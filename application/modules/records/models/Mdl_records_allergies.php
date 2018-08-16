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
class Mdl_Records_Allergies extends Response_Model
{
	public $table               = 'records_allergies';
    public $primary_key         = 'records_allergies.records_allergies_id';

    public function validation_rules()
    {
        return array(
            'medicine'        => array(
                'field' => 'records_allergies_medicine',
                'label' => lang('medicine'),
                'rules' => 'required'
            )
        );
    }

    public function default_order_by()
    {
        $this->db->order_by('records_allergies.records_allergies_medicine ASC');
    }

    public function is_current()
    {
        $this->filter_where('records_allergies_date', date('Y-m-d'));
        return $this;
    }

    public function record_from($patient_id)
    {
        $this->filter_where('patient_id', $patient_id);
        return $this;
    }
}
