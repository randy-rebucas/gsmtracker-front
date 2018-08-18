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
class Mdl_Queings extends Response_Model
{
	public $table               = 'queing';
    public $primary_key         = 'queing.id';

    public function in_que($patient_id)
    {
        $this->filter_where('user_id', $patient_id);
        return $this;
    }

    public function is_current()
    {
        $this->filter_where('que_date', date('Y-m-d'));
        return $this;
    }

    public function create($db_array = NULL) {

        $patient_id = $db_array['user_id'];
        
        if(parent::save(NULL, $db_array)){

            $db_array = array(
                'patient_id'    => $patient_id,
                'record_date'   => date('Y-m-d'),
                'record_time'   => date('h:i:s')
            );
            
            return $this->db->insert('records', $db_array);
        }

    }
}
