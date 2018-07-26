<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Mdl_Patients extends Response_Model {

    public $table               = 'users';
    public $primary_key         = 'id';

    public function default_join()
    {
        $this->db->join('users_profiles', 'users_profiles.user_id = users.id', 'left');
        $this->db->join('users_role', 'users_role.user_id = users.id', 'left');
    }

    public function default_order_by()
    {
        $this->db->order_by('users.username');
    }

    public function is_active()
    {
        $this->filter_where('status', 1);
        return $this;
    }

    public function is_inactive()
    {
        $this->filter_where('status', 0);
        return $this;
    }
    // public function validation_rules()
    // {
    //     return array(
    //         'patient_name'      => array(
    //             'field' => 'patient_name',
    //             'label' => lang('patient_name'),
    //             'rules' => 'required'
    //         ),
    //         'patient_active'    => array(
    //             'field' => 'patient_active'
    //         ),
    //         'patient_address_1' => array(
    //             'field' => 'patient_address_1'
    //         ),
    //         'patient_address_2' => array(
    //             'field' => 'patient_address_2'
    //         ),
    //         'patient_city'      => array(
    //             'field' => 'patient_city'
    //         ),
    //         'patient_state'     => array(
    //             'field' => 'patient_state'
    //         ),
    //         'patient_zip'       => array(
    //             'field' => 'patient_zip'
    //         ),
    //         'patient_country'   => array(
    //             'field' => 'patient_country'
    //         ),
    //         'patient_phone'     => array(
    //             'field' => 'patient_phone'
    //         ),
    //         'patient_fax'       => array(
    //             'field' => 'patient_fax'
    //         ),
    //         'patient_mobile'    => array(
    //             'field' => 'patient_mobile'
    //         ),
    //         'patient_email'     => array(
    //             'field' => 'patient_email'
    //         ),
    //         'patient_web'       => array(
    //             'field' => 'patient_web'
    //         )
    //     );
    // }

    public function db_array()
    {
        $db_array = parent::db_array();

        if (!isset($db_array['patient_active']))
        {
            $db_array['patient_active'] = 0;
        }

        return $db_array;
    }

    public function delete($id)
    {
        parent::delete($id);

        $this->load->helper('orphan');
        delete_orphans();
    }

    /**
     * Returns patient_id of existing or new record 
     */
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

    // public function with_total()
    // {
    //     $this->filter_select("IFNULL((SELECT SUM(invoice_total) FROM fi_invoice_amounts WHERE invoice_id IN (SELECT invoice_id FROM fi_invoices WHERE fi_invoices.patient_id = fi_patients.patient_id)), 0) AS patient_invoice_total", FALSE);
    //     return $this;
    // }

    // public function with_total_paid()
    // {
    //     $this->filter_select("IFNULL((SELECT SUM(invoice_paid) FROM fi_invoice_amounts WHERE invoice_id IN (SELECT invoice_id FROM fi_invoices WHERE fi_invoices.patient_id = fi_patients.patient_id)), 0) AS patient_invoice_paid", FALSE);
    //     return $this;
    // }

    // public function with_total_balance()
    // {
    //     $this->filter_select("IFNULL((SELECT SUM(invoice_balance) FROM fi_invoice_amounts WHERE invoice_id IN (SELECT invoice_id FROM fi_invoices WHERE fi_invoices.patient_id = fi_patients.patient_id)), 0) AS patient_invoice_balance", FALSE);
    //     return $this;
    // }

    function get_suggest_patient()
	{
		$this->db->select('patient_id, patient_name AS name', FALSE);
        $this->db->order_by('patient_id', 'asc');
        $this->db->from($this->table); 
		return $this->db->get();

	}
}

?>