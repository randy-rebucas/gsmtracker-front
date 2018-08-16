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
class Mdl_States extends Response_Model
{
	public $table               = 'location_states';
    public $primary_key         = 'location_states.id';

    public function by_id($country_id)
    {
        $this->filter_where('country_id', $country_id);
        return $this;
    }

    public function default_order_by()
    {
        $this->db->order_by('location_states.name ASC');
    }

    public function default_select()
    {
        $this->db->select("SQL_CALC_FOUND_ROWS id, name", FALSE);
    }
}
