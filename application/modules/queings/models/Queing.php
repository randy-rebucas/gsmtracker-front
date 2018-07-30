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
class Queing extends CI_Model
{	
	
	function process($id, $type, $client_id, $status)
	{

		$data = array(
			'visit_type'	=> $type,
			'visit_date'	=> date('Y-m-d'),
			'user_id'	=> $id,
			'client_id'	=> $client_id,
			'status'	=> $status
		);
		return $this->db->insert('visits', $data);
			
	}
	
}