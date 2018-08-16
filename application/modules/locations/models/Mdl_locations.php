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
class Mdl_Locations extends Response_Model
{
	public $table               = 'location';
    public $primary_key         = 'location.location_id';

    public function by_type($type)
    {
        $this->filter_where('location_type', $type);
        return $this;
    }

    public function by_id($id)
    {
        $this->filter_where('parent_id', $id);
        return $this;
    }

    public function default_order_by()
    {
        $this->db->order_by('location.name ASC');
    }

    public function default_select()
    {
        $this->db->select("SQL_CALC_FOUND_ROWS location_id, name", FALSE);
    }
}
