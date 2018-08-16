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
class Patient extends Response_Model
{
	public $table               = 'users';
    public $primary_key         = 'users.id';

	// public function db_array()
    // {
    //     $db_array = parent::db_array();

    //     if (!isset($db_array['patient_active']))
    //     {
    //         $db_array['patient_active'] = 0;
    //     }

    //     return $db_array;
	// }
	public function patient_lookup($patient_name)
    {
        $patients = $this->Mdl_patients->where('patient_name', $patient_name)->get();

        if ($patients->num_rows())
        {
            $patient_id = $patients->row()->patient_id;
        }
        else
        {
            $db_array = array(
                'patient_name' => $patient_name
            );

            $patient_id = parent::save(NULL, $db_array);
        }

        return $patient_id;
	}
	
	function get_suggest_patient()
	{
		$this->db->select('patient_id, patient_name AS name', FALSE);
        $this->db->order_by('patient_id', 'asc');
        $this->db->from($this->table); 
		return $this->db->get();

	}

	public function create($db_array = NULL)
    {
        $quote_id = parent::save(NULL, $db_array);

        // Create an quote amount record
        $db_array = array(
            'quote_id' => $quote_id
        );

        $this->db->insert('fi_quote_amounts', $db_array);

        // Create the default invoice tax record if applicable
        if ($this->Mdl_settings->setting('default_invoice_tax_rate'))
        {
            $db_array = array(
                'quote_id'              => $quote_id,
                'tax_rate_id'           => $this->Mdl_settings->setting('default_invoice_tax_rate'),
                'include_item_tax'      => $this->Mdl_settings->setting('default_include_item_tax'),
                'quote_tax_rate_amount' => 0
            );

            $this->db->insert('fi_quote_tax_rates', $db_array);
        }

        return $quote_id;
	}
	
	public function db_array()
    {
        $db_array = parent::db_array();

        // Get the patients id for the submitted quote
        $this->load->model('patients/Mdl_patients');
        $db_array['patient_id'] = $this->Mdl_patients->patient_lookup($db_array['patient_name']);
        unset($db_array['patient_name']);

        $db_array['quote_date_created'] = date_to_mysql($db_array['quote_date_created']);
        $db_array['quote_date_expires'] = $this->get_date_due($db_array['quote_date_created']);
        $db_array['quote_number']       = $this->get_quote_number($db_array['invoice_group_id']);

        if (!isset($db_array['quote_status_id']))
        {
            $db_array['quote_status_id'] = 1;
        }

        // Generate the unique url key
        $db_array['quote_url_key'] = $this->get_url_key();

        return $db_array;
    }
	
}
