<?php
defined('BASEPATH') OR exit('No direct script access allowed');

// require_once(APPPATH .'clients/masud/config/database.php');
     
class Welcome extends Admin_Controller {

    // public $client_db;

    public function __construct()
    {
        parent::__construct();

        // $this->client_db = $this->load->database('clientdb');
        // $this->load->database($dbconfig);
    }

	public function index()
	{
        

		$this->layout->set(
            array(
                // 'invoice_status_totals' => $this->Mdl_invoice_amounts->get_status_totals(),
                // 'quote_status_totals'   => $this->Mdl_quote_amounts->get_status_totals(),
                // 'invoices'              => $this->Mdl_invoices->limit(10)->get()->result(),
                // 'quotes'                => $this->Mdl_quotes->limit(10)->get()->result(),
                // 'invoice_statuses'      => $this->Mdl_invoices->statuses(),
                // 'quote_statuses'        => $this->Mdl_quotes->statuses(),
                // 'overdue_invoices'      => $this->Mdl_invoices->is_overdue()->limit(10)->get()->result()
            )
        );
        
        $this->layout->buffer('content', 'welcome/index');
        $this->layout->render();
	}

}