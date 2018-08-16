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
class Mdl_Records_Family_Histories extends Response_Model
{
	public $table               = 'records_family_histories';
    public $primary_key         = 'records_family_histories.records_family_histories_id';

    public function validation_rules()
    {
        return array(
            'hitory'        => array(
                'field' => 'records_family_histories_hitory',
                'label' => lang('hitory'),
                'rules' => 'required'
            )
        );
    }

    public function default_order_by()
    {
        $this->db->order_by('records_family_histories.records_family_histories_hitory ASC');
    }

    public function is_current()
    {
        $this->filter_where('records_family_histories_date', date('Y-m-d'));
        return $this;
    }

    public function record_from($patient_id)
    {
        $this->filter_where('patient_id', $patient_id);
        return $this;
    }
}
