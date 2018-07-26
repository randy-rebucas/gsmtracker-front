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
        redirect('patients/status/active');
    }

    public function status($status = 'active', $page = 0)
    {
        if (is_numeric(array_search($status, array('active', 'inactive'))))
        {
            $function = 'is_' . $status;
            $this->Mdl_patients->$function();
        }

        $this->Mdl_patients->with_total_balance()->paginate(site_url('patients/status/' . $status), $page);
        $patients = $this->Mdl_patients->result();

        $this->layout->set(
            array(
                'records'            => $patients,
                'filter_display'     => TRUE,
                'filter_placeholder' => lang('filter_patients'),
                'filter_method'      => 'filter_patients',
                'title' => 'Patients',
                'author' => 'Randy Rebucas',
                'description' => '',
                'keywords' => ''
            )
        );

        $this->layout->buffer('content', 'patients/index');
        $this->layout->render();
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

}

?>