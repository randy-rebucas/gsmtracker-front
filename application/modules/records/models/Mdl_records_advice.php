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
class Mdl_Records_Advice extends Response_Model
{
	public $table               = 'records_advice';
    public $primary_key         = 'records_advice.records_advice_id';

    public function validation_rules()
    {
        return array(
            'advice'        => array(
                'field' => 'records_advice_advice',
                'label' => lang('signs'),
                'rules' => 'required'
            ),
            'follow_up_date' => array(
                'field' => 'records_advice_follow_up_date',
                'label' => lang('follow_up_date'),
                'rules' => 'required'
            )
        );
    }

    public function default_order_by()
    {
        $this->db->order_by('records_advice.records_advice_date DESC');
    }

    public function is_current()
    {
        $this->filter_where('records_advice_date', date('Y-m-d'));
        return $this;
    }
}
