<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Dashboard extends Admin_Controller {
    
    public function __construct()
    {
        parent::__construct();

    }

    public function index()
    {
        $this->load->model('invoices/Mdl_invoice_amounts');
        $this->load->model('quotes/Mdl_quote_amounts');
        $this->load->model('invoices/Mdl_invoices');
        $this->load->model('quotes/Mdl_quotes');

        $this->layout->set(
            array(
                'invoice_status_totals' => $this->Mdl_invoice_amounts->get_status_totals(),
                'quote_status_totals'   => $this->Mdl_quote_amounts->get_status_totals(),
                'invoices'              => $this->Mdl_invoices->limit(10)->get()->result(),
                'quotes'                => $this->Mdl_quotes->limit(10)->get()->result(),
                'invoice_statuses'      => $this->Mdl_invoices->statuses(),
                'quote_statuses'        => $this->Mdl_quotes->statuses(),
                'overdue_invoices'      => $this->Mdl_invoices->is_overdue()->limit(10)->get()->result(),
                'title' => 'Dashboard',
                'author' => 'Randy Rebucas',
                'description' => '',
                'keywords' => ''
            )
        );

        $this->layout->buffer('content', 'dashboard/index');
        $this->layout->render();
    }

}