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
class Mdl_Countries extends Response_Model
{
	public $table               = 'location_countries';
    public $primary_key         = 'location_countries.id';

    public function default_order_by()
    {
        $this->db->order_by('location_countries.name ASC');
    }

    public function default_select()
    {
        $this->db->select("SQL_CALC_FOUND_ROWS id, name", FALSE);
    }
}
