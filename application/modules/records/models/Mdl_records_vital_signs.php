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
class Mdl_Records_Vital_Signs extends Response_Model
{
	public $table               = 'records_vital_signs';
    public $primary_key         = 'records_vital_signs.records_vital_signs_id';

    public function validation_rules()
    {
        return array(
            'weight'        => array(
                'field' => 'records_vital_signs_weight',
                'label' => lang('weight'),
                'rules' => 'required'
            ),
            'height' => array(
                'field' => 'records_vital_signs_height',
                'label' => lang('height'),
                'rules' => 'required'
            ),
            'temp'   => array(
                'field' => 'records_vital_signs_temp',
                'label' => lang('tempature'),
                'rules' => 'required'
            ),
            'bp'            => array(
                'field' => 'records_vital_signs_bp',
                'label' => lang('bp'),
                'rule'  => 'required'
            ),
            'pulse'            => array(
                'field' => 'records_vital_signs_pulse',
                'label' => lang('pulse'),
                'rule'  => 'required'
            ),
            'bmi'            => array(
                'field' => 'records_vital_signs_bmi',
                'label' => lang('bmi'),
                'rule'  => 'required'
            )
        );
    }

    public function default_order_by()
    {
        $this->db->order_by('records_vital_signs.records_vital_signs_date DESC');
    }

    public function is_current()
    {
        $this->filter_where('records_vital_signs_date', date('Y-m-d'));
        return $this;
    }

}
