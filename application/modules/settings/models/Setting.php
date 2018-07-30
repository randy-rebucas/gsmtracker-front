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
class Setting extends CI_Model 
{
	
	function exists($client_id, $key)
	{
		$this->db->from('app_config');	
		$this->db->where('client_id',$client_id);
		$this->db->where('app_config.key',$key);
		$query = $this->db->get();
		
		return ($query->num_rows()==1);
	}
	
	function get_all($client_id)
	{
		$this->db->from('app_config');
		$this->db->where('client_id',$client_id);
		$this->db->order_by("key", "asc");
		return $this->db->get();		
	}
	
	function get($client_id, $key)
	{
		$query = $this->db->get_where('app_config', array('client_id'=> $client_id, 'key' => $key), 1);
		
		if($query->num_rows()==1)
		{
			return $query->row()->value;
		}
		
		return "";
		
	}
	
	public function save($key, $value)
	{
		$config_data=array(
			'client_id'=>$this->client_id,
			'key'=>$key,
			'value'=>$value
		);

		if(!$this->exists($this->client_id, $key))
		{
			return $this->db->insert('app_config', $config_data);
		}

		$this->db->where('key', $key);

		return $this->db->update('app_config', $config_data);
	}
	
	
	function batch_save($data)
	{
		$success=true;
		
		//Run these queries as a transaction, we want to make sure we do all or nothing
		$this->db->trans_start();
		
		foreach($data as $key=>$value)
		{
			if(!$this->save($key, $value))
			{
				$success=false;
				break;
			}
		}
		
		$this->db->trans_complete();		
		return $success;
		
	}
		
	function delete($key)
	{
		return $this->db->delete('app_config', array('client_id'=> $client_id, 'key' => $key)); 
	}
	
	function delete_all()
	{
		return $this->db->empty_table('app_config'); 
	}
	/**/
	function get_client_info($client_id) {

		return $this->db->where('client_id', $client_id)->get('clients')->row();
	}
}