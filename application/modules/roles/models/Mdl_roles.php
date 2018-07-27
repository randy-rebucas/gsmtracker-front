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
class Mdl_Roles extends Response_Model
{	
    public $table               = 'roles';
    public $primary_key         = 'roles.role_id';
	
	public function validation_rules()
    {
        return array(
            'role_name' => array(
                'field' => 'role_name',
                'label' => lang('roles_name'),
                'rules' => 'required'
            ),
            'role_desc'   => array(
                'field' => 'role_name',
                'label' => lang('roles_desc'),
                'rules' => 'required'
            )
        );
	}

}