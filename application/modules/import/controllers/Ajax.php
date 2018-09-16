<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Ajax extends Secure_Controller {

    public $ajax_controller = TRUE;

    public function get_data() 
    {
        $this->load->library('datatables');
	       
        $this->datatables->select("import_id as id, filename, created, success_count, failed_count, total_records as total", false);
        
        // $this->datatables->where('client_id', $this->client_id);
        
        $this->datatables->from('import');

        echo $this->datatables->generate('json', 'UTF-8');
    }

    public function modal_import()
    {
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

    function doSave($id = -1)
	{

        $this->load->model('patients/Mdl_patients');
        
		if ($id==-1) 
		{
			$db_array=array(
				'client_id'		=>  $this->client_id,
				'last_ip'       =>  $this->input->ip_address(),
				'created'       =>  date('Y-m-d H:i:s'),
				'token'			=>  date('Ymd').'-'.random_string('numeric',8)
			);
		} 
		else 
		{
			$db_array=array(
				'last_ip'       =>  $this->input->ip_address(),
				'modified'      =>  date('Y-m-d H:i:s')
			);
        }

        if($patient_id = $this->Mdl_patients->save(null, $db_array)){

            $db_array = array(
                'user_id'		=>  $patient_id,
                'firstname'		=>  $this->input->post('first_name'),
                'mi'			=>  $this->input->post('mi'),
                'lastname'		=>  $this->input->post('last_name'),
                'bMonth'		=>  $this->input->post('month'),
                'bDay'			=>  $this->input->post('day'),
                'bYear'			=>  $this->input->post('year'),
                'gender'		=>  $this->input->post('gender'),
                'mobile'		=>  $this->input->post('mobile'),
                'address'		=>  $this->input->post('address'),
                'zip'			=>  $this->input->post('zip'),
                'city'			=>  $this->input->post('city'),
                'state'			=>  $this->input->post('state'),
                'country'		=>  $this->input->post('country')
            );

            if($this->Mdl_patients->create($db_array, $this->patient_role_id)){
                if($id==-1)
                {
                    echo json_encode(array('success'=>true,'message'=>$db_array['lastname']));
                }
                else //previous
                {
                    echo json_encode(array('success'=>true,'message'=>$db_array['lastname']));
                }
            }
        }
        else//failure
        {	
            echo json_encode(array('success'=>false,'message'=>'Failed to save data.'));
        }

    }

    function remove($id)
    {
        $this->load->model('patients/Mdl_patients');

    	if ($this->Mdl_patients->delete($id)) 
    	{
			echo json_encode(array('success' => true, 'message' => 'Record successfully deleted!'));
		} 
		else 
		{
			echo json_encode(array('success' => false, 'message' => 'Record fail to deleted!' ));
		}

    }
}

?>