<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Patients extends Admin_Controller {

    public function __construct()
    {
        parent::__construct();

        $this->load->model('Mdl_patients');
        $this->load->library('cart');
    }

    public function index()
    {
        // Display active patients by default
        // redirect('patients/status/active');
        if(!$this->input->is_ajax_request()){
            $this->load_layout();
        }
        $this->load->view('patients/index');
    }

    public function status()
    {
        // if (is_numeric(array_search($status, array('active', 'inactive'))))
        // {
        //     $function = 'is_' . $status;
        //     $this->Mdl_patients->$function();
        // }

        // $this->Mdl_patients->get()->paginate(site_url('patients/status/' . $status), $page);
        // $patients = $this->Mdl_patients->result();

        // $this->layout->set(
        //     array(
        //         'records'            => $patients,
        //         'filter_display'     => TRUE,
        //         'filter_placeholder' => lang('filter_patients'),
        //         'filter_method'      => 'filter_patients',
        //         'title' => 'Patients',
        //         'author' => 'Randy Rebucas',
        //         'description' => '',
        //         'keywords' => ''
        //     )
        // );

        // $this->layout->buffer('content', 'patients/index');
        // $this->layout->render();

        
    }

    public function form($id = NULL)
    {
        if ($this->input->post('btn_cancel'))
        {
            redirect('patients');
        }

        $this->load->model('users/Mdl_users');

        if ($this->Mdl_users->run_validation())
        {
            //save user
            //copy user profiles
            $patient_id = $this->Mdl_users->save($id);

            $db_array = array(
                'id'            => $patient_id
            );

            $this->Mdl_patients->save($patient_id, $db_array);

            $this->load->model('custom_fields/Mdl_patient_custom');

            $this->Mdl_patient_custom->save_custom($id, $this->input->post('custom'));

            redirect('patients/view/' . $id);
        }

        if ($id and !$this->input->post('btn_submit'))
        {
            if (!$this->Mdl_patients->prep_form($id))
            {
                show_404();
            }

            $this->load->model('custom_fields/Mdl_patient_custom');

            $patient_custom = $this->Mdl_patient_custom->where('patient_id', $id)->get();

            if ($patient_custom->num_rows())
            {
                $patient_custom = $patient_custom->row();

                unset($patient_custom->patient_id, $patient_custom->patient_custom_id);

                foreach ($patient_custom as $key => $val)
                {
                    $this->Mdl_patients->set_form_value('custom[' . $key . ']', $val);
                }
            }
        }
        elseif ($this->input->post('btn_submit'))
        {
            if ($this->input->post('custom'))
            {
                foreach ($this->input->post('custom') as $key => $val)
                {
                    $this->Mdl_patients->set_form_value('custom[' . $key . ']', $val);
                }
            }
        }

        $this->load->model('custom_fields/Mdl_custom_fields');

        $this->layout->set('custom_fields', $this->Mdl_custom_fields->by_table('fi_patient_custom')->get()->result());
        $this->layout->buffer('content', 'patients/form');
        $this->layout->render();
    }

    public function view($patient_id)
    {
        $this->load->model('patients/Mdl_patient_notes');
        $this->load->model('invoices/Mdl_invoices');
        $this->load->model('quotes/Mdl_quotes');
        $this->load->model('custom_fields/Mdl_custom_fields');
        $this->load->model('queings/Mdl_queings');

        $patient = $this->Mdl_patients->with_total()->with_total_balance()->with_total_paid()->where('fi_patients.patient_id', $patient_id)->get()->row();

        if (!$patient)
        {
            show_404();
        }

        $this->layout->set(
            array(
                'patient'          => $patient,
                'patient_notes'    => $this->Mdl_patient_notes->where('patient_id', $patient_id)->get()->result(),
                'invoices'         => $this->Mdl_invoices->by_patient($patient_id)->limit(20)->get()->result(),
                'quotes'           => $this->Mdl_quotes->by_patient($patient_id)->limit(20)->get()->result(),
                'custom_fields'    => $this->Mdl_custom_fields->by_table('fi_patient_custom')->get()->result(),
                'quote_statuses'   => $this->Mdl_quotes->statuses(),
                'invoice_statuses' => $this->Mdl_invoices->statuses(),
            )
        );

        $this->layout->buffer(
            array(
                array('invoice_table', 'invoices/partial_invoice_table'),
                array('quote_table', 'quotes/partial_quote_table'),
                array('partial_notes', 'patients/partial_notes'),
                array('content', 'patients/view')
            )
        );

        $this->layout->render();
    }

    public function delete($patient_id)
    {
        $this->Mdl_patients->delete($patient_id);
        redirect('patients');
    }

    function load_ajax() 
	{
        
        $this->load->library('datatables');
        $isfiltered = $this->input->post('filter');

        $this->datatables->select("u.id as id, 
        CONCAT(IF(up.lastname != '', up.lastname, ''),',',IF(up.firstname != '', up.firstname, '')) as fullname, 
        username, 
        email, 
        DATE_FORMAT(u.created, '%M %d, %Y') as created,  
        DATE_FORMAT(CONCAT(IF(up.bYear != '', up.bYear, ''),'-',IF(up.bMonth != '', up.bMonth, ''),'-',IF(up.bDay != '', up.bDay, '')), '%M %d, %Y') as birthday,
        address, 
        mobile, 
        DATE_FORMAT(u.last_login, '%M %d, %Y') as last_login",
        false);
        
        $this->datatables->where('ur.role_id', 2);
        if($isfiltered > 0){
            $this->datatables->where('DATE(created) BETWEEN ' . $this->db->escape($isfiltered) . ' AND ' . $this->db->escape($isfiltered));
        }
        $this->datatables->join('users_profiles as up', 'u.id = up.user_id', 'left', false);
        $this->datatables->join('users_role as ur', 'u.id = ur.user_id', 'left', false);
        $this->datatables->order_by('lastname', 'DESC');

        $this->datatables->from('users as u');

        echo $this->datatables->generate('json', 'UTF-8');
    	
    }
}

?>