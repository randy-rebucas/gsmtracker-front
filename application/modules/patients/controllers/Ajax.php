<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Ajax extends Secure_Controller {

    public $ajax_controller = TRUE;

    public function get_data() 
    {
        $this->load->library('datatables');
        $isfiltered = $this->input->post('filter');

        $this->datatables->select("u.id as id, CONCAT(IF(up.lastname != '', up.lastname, ''),',',IF(up.firstname != '', up.firstname, '')) as fullname, username, email, DATE_FORMAT(u.created, '%M %d, %Y') as created, avatar, DATE_FORMAT(CONCAT(IF(up.bYear != '', up.bYear, ''),'-',IF(up.bMonth != '', up.bMonth, ''),'-',IF(up.bDay != '', up.bDay, '')), '%M %d, %Y') as birthday, address, mobile, DATE_FORMAT(u.last_login, '%M %d, %Y') as last_login", false);
        
        $this->datatables->where('u.deleted', 0);
        $this->datatables->where('ur.role_id', $this->patient_role_id);
        if($isfiltered > 0){
            $this->datatables->where('DATE(created) BETWEEN ' . $this->db->escape($isfiltered) . ' AND ' . $this->db->escape($isfiltered));
        }
        $this->datatables->join('users_profiles as up', 'u.id = up.user_id', 'left', false);
        $this->datatables->join('users_role as ur', 'u.id = ur.user_id', 'left', false);
        $this->datatables->join('users_custom as uc', 'u.id = uc.user_id', 'left', false);
        $this->datatables->order_by('lastname', 'DESC');

        $this->datatables->from('users as u');

        echo $this->datatables->generate('json', 'UTF-8');
    }

    public function modal_create_patient($patient_id = -1)
    {
        $this->load->library('location_lib');

        $this->load->model('patients/Mdl_patients');
        $data['info'] =  $this->Mdl_patients->get_info($patient_id);

        // $this->load->model('custom_fields/Mdl_Custom_Fields');
        // $data['custom_fields'] = $this->Mdl_Custom_Fields->get_by_val('custom_field_table', 'users_custom')->get()->result();
        
        $this->load->view("patients/form", $data);
    }

    function doSave($id = -1)
	{

        $this->load->model('patients/Mdl_patients');
        
		if ($id==-1) 
		{
			$db_array=array(
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