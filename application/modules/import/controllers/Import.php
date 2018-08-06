<?php
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

class Import extends Admin_Controller {
	
	public function __construct()
	{
		parent::__construct();
		
	}
	
	function _remap($method, $params = array()) 
    {
    	
        if (method_exists($this, $method)) {
            return call_user_func_array(array($this, $method), $params);
        }

        $this->display_error_log(getcwd(), get_class($this), $method);
	}

    function index()
	{

		$data['module'] = 'Import';
		$this->layout->title('Import');
		$this->set_layout();

		if ($this->input->is_ajax_request())  
		{
			$this->load->view('import/manage', $data);
        } 
		else
		{
			$this->layout->build('import/manage', $data);
		}
	}

	function load_ajax() {
	
		if ($this->input->is_ajax_request()) 
		{	
			$this->load->library('datatables');
	       
	        $this->datatables->select("import_id as id, filename, created, success_count, failed_count, total_records as total", false);
	        
			$this->datatables->where('client_id', $this->client_id);
	        
	        $this->datatables->from('import');

	        echo $this->datatables->generate('json', 'UTF-8');
	        
    	}else{

	    	$this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
	    }
    }

	function view() {
        $data = array();

        $data['title'] = 'Patient';
        $data['notes'] = '<br /><b>Instructions for import the patients</b><br /> 
                                <b>Add new patient</b><br />
                                <ul><li>To add new patient keep column (Login E-mail) as blank and enter rest of information.</li>
                                </ul>
                                <i>
							After changing the fields save the file and import the file.</i>';
        $data['template_path'] = 'export-data/export-vendors';
        
        $data['upload_path'] = 'import_data/import_csv';
      
        $this->load->view('form', $data);
    }
	
	public function import_csv() {
		$this->load->model('patients/Patient');
		$this->load->model('import/Import_mdl');
        $msg = 'do_excel_import';
 
//        echo $_FILES['file_path']['tmp_name'];
//        if (($handle = fopen($_FILES['file_path']['tmp_name'], "r")) !== FALSE) {
//            while (($data = fgetcsv($handle)) !== FALSE) {
//                echo "<pre>";
//                print_r($data);
////                $sql = "INSERT INTO record ( id, name, marks) VALUES ( '" . mysql_escape_string($data[0]) . "','" . mysql_escape_string($data[1]) . "','" . mysql_escape_string($data[2]) . "')";
////                $query = mysql_query($sql);
////                if ($query) {
////                    echo "row inserted\n";
////                } else {
////                    echo die(mysql_error());
////                }
//            }
//            fclose($handle);
//        }
//
//        exit;
 
        $failCodes = array();
        $successCounts = array();
        $totalRecord = 0;
        $blankRow = 0;
        $import_data = array();
 
        $ext = explode("/", $_FILES['file_path']['type']);
        $type = strtolower(str_replace("\"", "", $ext[1]));
 
        // if (!in_array($type, array('csv', 'x-comma-separated-values', 'comma-separated-values', 'vnd.ms-excel'))) {
        //     $msg = 'Import file type not suported';
 
        //     $this->session->set_flashdata('alert_error', $msg);
        //     redirect('');
        // }
 
        // if ($_FILES['file_path']['error'] != UPLOAD_ERR_OK) {
        //     $msg = 'Import file failed';
 
        //     $this->session->set_flashdata('alert_error', $msg);
        //     redirect('');

        // } else {

            //$config['upload_path'] = './uploads/';
            $config['upload_path'] = FCPATH . '/uploads/'.$this->client_id.'/imported-file/';
            $config['file_name'] = random_string('numeric', 5) . '_' . date('YmdHis', time()) . $_FILES['file_path']['name'];
            $config['allowed_types'] = 'csv|comma-separated-values|vnd.ms-excel';
            $this->load->library('upload', $config);
            //  $this->upload->do_upload('file_path');
            //check directory if exists
			if(!is_dir($config['upload_path']))
			{
				//create if not
				mkdir($config['upload_path'], 0755, TRUE);
			}

            $import_data['filename'] = $config['file_name'];
 
            if (($handle = fopen($_FILES['file_path']['tmp_name'], "r")) !== FALSE) {
                //Skip first row
//                fgetcsv($handle);
            	$is_header_removed = FALSE;
                $i = 0;
                while (($data = fgetcsv($handle)) !== FALSE) {
 					if($i > 0) {

	                    $import_data['module'] = "Patients";
	                    if ($this->_checkBlankRow($data) == 0) {
	                        $blankRow++;
	                        continue;
	                    }

	                    $all_data = $this->_set_data($data);

	                    $user_data = $all_data['user_data'];
	                    $profile_data = $all_data['profile_data'];
	                    $custom_data = $all_data['custom_data'];

	                    //print_trace($all_data,false,true);
	                    if (empty($user_data['email']) || empty($user_data['username'])) {
	                        $failCodes[] = $i;
	                        $totalRecord++;
	                        continue;
	                    }
	                    if(!$this->Patient->save($user_data, $profile_data, $custom_data, $id = -1)) {
	                        $failCodes[] = $i;
	                        $totalRecord++;
	                    } else {
	                        $successCounts[] = $i;
	                        $totalRecord++;
	                    }
	                             
	                    
	                }
	                $i++;
                }
                fclose($handle);
 
                $import_data['created'] = date("Y-m-d H:i:s");
                $import_data['client_id'] = $this->client_id;
            } else {
                $this->session->set_flashdata('alert_error', 'Your upload file has no data or not in supported format.');
                redirect('');
            }
        // }
 
        $import_data['success_count'] = count($successCounts);
        $import_data['failed_count'] = count($failCodes);
        $import_data['total_records'] = $totalRecord;
 
        $success = true;
        if (count($failCodes) > 1) {
            $msg = "Most tasks imported. But some were not, here is list of their CODE (" . count($failCodes) . "): " . implode(", ", $failCodes);
            $success = false;
        } else {
        	
            $this->Import_mdl->save($import_data, $this->client_id);
            $msg = "Successfully tasks imported.";
        }
 
        $retVal = ($success == true) ? 'alert_success' : 'alert_error';
        $this->session->set_flashdata($retVal, $msg);
        redirect('');
    }

    private function _checkBlankRow($data) {
//            if(strpos("/$type/",strtolower($data[0])))
//                    return 0;
//            strpos($type, 'are') !== false
        $str = implode(",", $data);
        $str = trim(str_replace(",", "", $str));
        return strlen($str);
    }

    private function _set_data($data) {
 
        return array(
            'user_data' => array(
                'username'      =>$data[0],        
				'email'         =>$data[1],
				'password'      =>$data[2],
				'client_id'		=>$this->client_id,
				'role_id'		=>$this->patient_role_id,
				'last_ip'       =>$this->input->ip_address(),
				'created'       =>$data[3],
				'token'			=>$data[4]
            ),
            'profile_data' => array(
                'firstname' 	=> $data[5],
                'mi' 			=> $data[6],
                'lastname' 		=> $data[7],
                'bMonth' 		=> $data[8],
                'bDay' 			=> $data[9],
                'bYear' 		=> $data[10],
                'gender' 		=> $data[11],
                'address' 		=> $data[12],
                'country' 		=> $data[13],
                'city' 			=> $data[14],
                'state' 		=> $data[15],
                'zip' 			=> $data[16],
                'mobile' 		=> $data[17]
            ),
            'custom_data' => array()
        );
    }

	function delete($id)
	{

    	if ($res = $this->Custom_field->delete($id)) 
    	{
			echo json_encode(array('success' => true, 'message' => 'Custom fiels successfully deletd!'));
		} 
		else 
		{
			echo json_encode(array('success' => false, 'message' => $res ));
		}

    }

}
/* End of file import.php */
/* Location: ./application/modules/import/controllers/import.php */