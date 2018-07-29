<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Appointments extends Admin_Controller {

    public function __construct()
    {
        parent::__construct();

        $this->load->model('Mdl_appointments');
    }

    public function index()
    {
        $data = array();
        $this->_set_layout('default', $data);
        if(!$this->input->is_ajax_request()){
            $this->template->build('appointments/index');
        } else {
            $this->load->view('appointments/index');
        }

    }

    public function status($status = 'all', $page = 0)
    {
        // Determine which group of quotes to load
        switch ($status)
        {
            case 'approved':
                $this->Mdl_appointments->is_approved();
                break;
            case 'pending':
                $this->Mdl_appointments->is_pending();
                break;
            case 'canceled':
                $this->Mdl_appointments->is_canceled();
                break;
        }

        $this->Mdl_appointments->paginate(site_url('appointments/status/' . $status), $page);
        $appointments = $this->Mdl_appointments->result();

        $this->layout->set(
            array(
                'appointments'       => $appointments,
                'status'             => $status,
                'filter_display'     => TRUE,
                'filter_placeholder' => lang('filter_appointments'),
                'filter_method'      => 'filter_appointments',
                'appointment_statuses'     => $this->Mdl_appointments->statuses()
            )
        );

        $this->layout->buffer('content', 'appointments/index');
        $this->layout->render();
    }

    public function view($quote_id)
    {
        $this->load->model('Mdl_quote_items');
        $this->load->model('tax_rates/Mdl_tax_rates');
        $this->load->model('Mdl_quote_tax_rates');
        $this->load->model('custom_fields/Mdl_custom_fields');
        $this->load->model('custom_fields/Mdl_quote_custom');

        $quote_custom = $this->Mdl_quote_custom->where('quote_id', $quote_id)->get();

        if ($quote_custom->num_rows())
        {
            $quote_custom = $quote_custom->row();

            unset($quote_custom->quote_id, $quote_custom->quote_custom_id);

            foreach ($quote_custom as $key => $val)
            {
                $this->Mdl_quotes->set_form_value('custom[' . $key . ']', $val);
            }
        }

        $quote = $this->Mdl_quotes->get_by_id($quote_id);

        if (!$quote)
        {
            show_404();
        }

        $this->layout->set(
            array(
                'quote'           => $quote,
                'items'           => $this->Mdl_quote_items->where('quote_id', $quote_id)->get()->result(),
                'quote_id'        => $quote_id,
                'tax_rates'       => $this->Mdl_tax_rates->get()->result(),
                'quote_tax_rates' => $this->Mdl_quote_tax_rates->where('quote_id', $quote_id)->get()->result(),
                'custom_fields'   => $this->Mdl_custom_fields->by_table('fi_quote_custom')->get()->result(),
                'custom_js_vars'  => array(
                    'currency_symbol'           => $this->Mdl_settings->setting('currency_symbol'),
                    'currency_symbol_placement' => $this->Mdl_settings->setting('currency_symbol_placement'),
                    'decimal_point'             => $this->Mdl_settings->setting('decimal_point')
                ),
                'quote_statuses'     => $this->Mdl_quotes->statuses()
            )
        );

        $this->layout->buffer(
            array(
                array('modal_delete_quote', 'quotes/modal_delete_quote'),
                array('modal_add_quote_tax', 'quotes/modal_add_quote_tax'),
                array('content', 'quotes/view')
            )
        );

        $this->layout->render();
    }

    public function delete($quote_id)
    {
        // Delete the quote
        $this->Mdl_quotes->delete($quote_id);

        // Redirect to quote index
        redirect('quotes/index');
    }

    public function generate_pdf($quote_id, $stream = TRUE, $quote_template = NULL)
    {
        $this->load->helper('pdf');
        
        if ($this->Mdl_settings->setting('mark_quotes_sent_pdf') == 1)
        {
            $this->Mdl_quotes->mark_sent($quote_id);
        }

        generate_quote_pdf($quote_id, $stream, $quote_template);
    }

    function load_ajax() 
	{
        
        $this->load->library('datatables');
        $isfiltered = $this->input->post('filter');

        $this->datatables->select("*",
        false);
        
        if($isfiltered > 0){
            $this->datatables->where('appointment_status', $isfiltered);
        }
      
        $this->datatables->order_by('appointment_date', 'DESC');

        $this->datatables->from('appoinments');

        echo $this->datatables->generate('json', 'UTF-8');
    	
    }
}

?>