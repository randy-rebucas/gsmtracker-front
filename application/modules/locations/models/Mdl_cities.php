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
class Mdl_Cities extends Response_Model
{
	public $table               = 'location_cities';
    public $primary_key         = 'location_cities.id';

    public function by_id($state_id)
    {
        $this->filter_where('state_id', $state_id);
        return $this;
    }

    public function default_order_by()
    {
        $this->db->order_by('location_cities.name ASC');
    }

    public function default_select()
    {
        $this->db->select("SQL_CALC_FOUND_ROWS id, name", FALSE);
    }
}
