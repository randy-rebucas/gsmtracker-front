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

}
