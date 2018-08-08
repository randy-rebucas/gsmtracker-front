<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Ajax extends Secure_Controller {

    public $ajax_controller = TRUE;

    public function get_data() 
    {
        $this->load->library('datatables');
        $isfiltered = $this->input->post('filter');

        $this->datatables->select("u.id as id, CONCAT(IF(up.lastname != '', up.lastname, ''),',',IF(up.firstname != '', up.firstname, '')) as fullname, username, email, DATE_FORMAT(u.created, '%M %d, %Y') as created, avatar, DATE_FORMAT(CONCAT(IF(up.bYear != '', up.bYear, ''),'-',IF(up.bMonth != '', up.bMonth, ''),'-',IF(up.bDay != '', up.bDay, '')), '%M %d, %Y') as birthday, address, mobile, DATE_FORMAT(u.last_login, '%M %d, %Y') as last_login, u.client_id as client_id", false);
        
        $this->datatables->where('u.deleted', 0);
        $this->datatables->where('u.client_id', $this->client_id);
        if($isfiltered > 0){
            $this->datatables->where('DATE(created) BETWEEN ' . $this->db->escape($isfiltered) . ' AND ' . $this->db->escape($isfiltered));
        }
        $this->datatables->join('users as u', 'p.patient_id = u.id', 'left', false);
        $this->datatables->join('users_profiles as up', 'p.patient_id = up.user_id', 'left', false);
        $this->datatables->join('users_custom as uc', 'p.patient_id = uc.user_id', 'left', false);
        $this->datatables->order_by('lastname', 'DESC');

        $this->datatables->from('patients as p');

        echo $this->datatables->generate('json', 'UTF-8');
    }

    public function save()
    {
        $this->load->model('quotes/Mdl_quote_items');
        $this->load->model('quotes/Mdl_quotes');
        $this->load->model('item_lookups/Mdl_item_lookups');

        $quote_id = $this->input->post('quote_id');

        $this->Mdl_quotes->set_id($quote_id);

        if ($this->Mdl_quotes->run_validation('validation_rules_save_quote'))
        {
            $items = json_decode($this->input->post('items'));

            foreach ($items as $item)
            {
                if ($item->item_name)
                {
                    $item->item_quantity = standardize_amount($item->item_quantity);
                    $item->item_price    = standardize_amount($item->item_price);

                    $item_id = ($item->item_id) ? : NULL;

                    $save_item_as_lookup = (isset($item->save_item_as_lookup)) ? $item->save_item_as_lookup : 0;

                    unset($item->item_id, $item->save_item_as_lookup);

                    $this->Mdl_quote_items->save($quote_id, $item_id, $item);

                    if ($save_item_as_lookup)
                    {
                        $db_array = array(
                            'item_name'        => $item->item_name,
                            'item_description' => $item->item_description,
                            'item_price'       => $item->item_price
                        );

                        $this->Mdl_item_lookups->save(NULL, $db_array);
                    }
                }
            }

            $db_array = array(
                'quote_number'       => $this->input->post('quote_number'),
                'quote_date_created' => date_to_mysql($this->input->post('quote_date_created')),
                'quote_date_expires' => date_to_mysql($this->input->post('quote_date_expires')),
                'quote_status_id'    => $this->input->post('quote_status_id')
            );

            $this->Mdl_quotes->save($quote_id, $db_array);

            $response = array(
                'success' => 1
            );
        }
        else
        {
            $this->load->helper('json_error');
            $response = array(
                'success'           => 0,
                'validation_errors' => json_errors()
            );
        }

        if ($this->input->post('custom'))
        {
            $db_array = array();

            foreach ($this->input->post('custom') as $custom)
            {
                // I hate myself for this...
                $db_array[str_replace(']', '', str_replace('custom[', '', $custom['name']))] = $custom['value'];
            }

            $this->load->model('custom_fields/mdl_quote_custom');
            $this->Mdl_quote_custom->save_custom($quote_id, $db_array);
        }

        echo json_encode($response);
    }

    public function create()
    {
        $this->load->model('patients/Mdl_patients');

        if ($this->Mdl_patients->run_validation())
        {
            $patient_id = $this->Mdl_patients->create();

            $response = array(
                'success'  => 1,
                'quote_id' => $patient_id
            );
        }
        else
        {
            $this->load->helper('json_error');
            $response = array(
                'success'           => 0,
                'validation_errors' => json_errors()
            );
        }

        echo json_encode($response);
    }

    public function modal_create_quote()
    {
        $this->load->module('layout');

        $this->load->model('invoice_groups/Mdl_invoice_groups');
        $this->load->model('tax_rates/Mdl_tax_rates');

        $data = array(
            'invoice_groups' => $this->Mdl_invoice_groups->get()->result(),
            'tax_rates'      => $this->Mdl_tax_rates->get()->result(),
            'patient_name'    => $this->input->post('patient_name')
        );

        $this->layout->load_view('quotes/modal_create_quote', $data);
    }

}

?>