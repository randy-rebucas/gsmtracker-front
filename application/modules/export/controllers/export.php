<?php
require_once APPPATH. 'modules/secure/controllers/Secure.php';

/*
 * MyClinicSoft
 * 
 * A web based clinical system
 *
 * @package		MyClinicSoft
 * @author		Randy Rebucas
 * @copyright	Copyright (c) 2016 - 2018 MyClinicSoft, LLC
 * @license		http://www.myclinicsoft.com/license.txt
 * @link		http://www.myclinicsoft.com
 * 
 */

class Export extends Secure {
	
	public function __construct()
	{
		parent::__construct();
		
	}
	
	function _remap($method, $params = array()) {
 
        if (method_exists($this, $method)) 
        {
            return call_user_func_array(array($this, $method), $params);
        }

        $this->display_error_log(getcwd(), get_class($this), $method);
    }

	function index()
	{

        $delimiter = ",";
        $newline = "\r\n";
 
        $this->load->dbutil();
        $this->load->helper('download');
        // units.unit_number as "Unit Number",
        $query = $this->db
            ->select('
            	username as "Username",
            	email as "Email",
            	password as "Password",
            	created as "Created",
            	token as "Token",
                firstname as "Firstname",
                mi as "Middlename",
                lastname as "Lastname",
                bMonth as "Month",
                bDay as "Day",
                bYear as "Year",
                gender as "Gender",
                address as "Address",
                la.name as "Country",
                lc.name as "City",
                ls.name as "State",
                zip as "Zip Code",
                mobile as "Mobile No",
            ')
            ->from('patients')
            ->join('users_profiles', 'users_profiles.user_id = patients.patient_id', 'left')
            ->join('users', 'users.id = patients.patient_id', 'left')
            ->join('location la', 'la.location_id = users_profiles.country', 'left')
            ->join('location lc', 'lc.location_id = users_profiles.city', 'left')
            ->join('location ls', 'ls.location_id = users_profiles.state', 'left')
            ->where('client_id', $this->client_id)
            ->where('deleted', 0)
            ->where('role_id', $this->patient_role_id)
            ->get();
 
        $data = $this->dbutil->csv_from_result($query, $delimiter, $newline);
 
        force_download('Patients_' . date('Y-m-d_H:i:s') . '.csv', $data);
        redirect('');
 
	}

			
}
/* End of file export.php */
/* Location: ./application/modules/export/controllers/export.php */