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
class Mdl_Records_Investigations extends Response_Model
{
	public $table               = 'records_investigations';
    public $primary_key         = 'records_investigations.records_investigations_id';

    public function validation_rules()
    {
        return array(
            'investigations'        => array(
                'field' => 'records_investigations_investigation',
                'label' => lang('investigations'),
                'rules' => 'required'
            )
        );
    }

    public function default_order_by()
    {
        $this->db->order_by('records_investigations.records_investigations_date DESC');
    }

    public function is_current()
    {
        $this->filter_where('records_investigations_date', date('Y-m-d'));
        return $this;
    }

    public function by_record_id($record_id)
    {
        $this->filter_where('record_id', $record_id);
        return $this;
    }
}
