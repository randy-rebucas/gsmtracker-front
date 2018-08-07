<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Ajax extends Admin_Controller {

    public $ajax_controller = TRUE;

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

    public function save_quote_tax_rate()
    {
        $this->load->model('quotes/Mdl_quote_tax_rates');

        if ($this->Mdl_quote_tax_rates->run_validation())
        {
            $this->Mdl_quote_tax_rates->save($this->input->post('quote_id'));

            $response = array(
                'success' => 1
            );
        }
        else
        {
            $response = array(
                'success'           => 0,
                'validation_errors' => $this->Mdl_quote_tax_rates->validation_errors
            );
        }

        echo json_encode($response);
    }

    public function create()
    {
        $this->load->model('quotes/Mdl_quotes');

        if ($this->Mdl_quotes->run_validation())
        {
            $quote_id = $this->Mdl_quotes->create();

            $response = array(
                'success'  => 1,
                'quote_id' => $quote_id
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

    public function get_item()
    {
        $this->load->model('quotes/Mdl_quote_items');

        $item = $this->Mdl_quote_items->get_by_id($this->input->post('item_id'));

        echo json_encode($item);
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

    public function modal_copy_quote()
    {
        $this->load->module('layout');

        $this->load->model('quotes/Mdl_quotes');
        $this->load->model('invoice_groups/Mdl_invoice_groups');
        $this->load->model('tax_rates/Mdl_tax_rates');

        $data = array(
            'invoice_groups' => $this->Mdl_invoice_groups->get()->result(),
            'tax_rates'      => $this->Mdl_tax_rates->get()->result(),
            'quote_id'       => $this->input->post('quote_id'),
            'quote'          => $this->Mdl_quotes->where('fi_quotes.quote_id', $this->input->post('quote_id'))->get()->row()
        );

        $this->layout->load_view('quotes/modal_copy_quote', $data);
    }

    public function copy_quote()
    {
        $this->load->model('quotes/Mdl_quotes');
        $this->load->model('quotes/Mdl_quote_items');
        $this->load->model('quotes/Mdl_quote_tax_rates');

        if ($this->Mdl_quotes->run_validation())
        {
            $target_id = $this->Mdl_quotes->save();
            $source_id = $this->input->post('quote_id');

            $this->Mdl_quotes->copy_quote($source_id, $target_id);

            $response = array(
                'success'  => 1,
                'quote_id' => $target_id
            );
        }
        else
        {
            $response = array(
                'success'           => 0,
                'validation_errors' => json_errors()
            );
        }

        echo json_encode($response);
    }

    public function modal_quote_to_invoice($quote_id)
    {
        $this->load->model('invoice_groups/Mdl_invoice_groups');
        $this->load->model('quotes/Mdl_quotes');

        $data = array(
            'invoice_groups' => $this->Mdl_invoice_groups->get()->result(),
            'quote_id'       => $quote_id,
            'quote'          => $this->Mdl_quotes->where('fi_quotes.quote_id', $quote_id)->get()->row()
        );

        $this->load->view('quotes/modal_quote_to_invoice', $data);
    }

    public function quote_to_invoice()
    {
        $this->load->model(
            array(
                'invoices/Mdl_invoices',
                'invoices/Mdl_items',
                'quotes/Mdl_quotes',
                'quotes/Mdl_quote_items',
                'invoices/Mdl_invoice_tax_rates',
                'quotes/Mdl_quote_tax_rates'
            )
        );

        if ($this->Mdl_invoices->run_validation())
        {
            $invoice_id = $this->Mdl_invoices->create(NULL, FALSE);

            $this->db->where('quote_id', $this->input->post('quote_id'));
            $this->db->set('invoice_id', $invoice_id);
            $this->db->update('fi_quotes');

            $quote_items = $this->Mdl_quote_items->where('quote_id', $this->input->post('quote_id'))->get()->result();

            foreach ($quote_items as $quote_item)
            {
                $db_array = array(
                    'invoice_id'       => $invoice_id,
                    'item_tax_rate_id' => $quote_item->item_tax_rate_id,
                    'item_name'        => $quote_item->item_name,
                    'item_description' => $quote_item->item_description,
                    'item_quantity'    => $quote_item->item_quantity,
                    'item_price'       => $quote_item->item_price,
                    'item_order'       => $quote_item->item_order
                );

                $this->Mdl_items->save($invoice_id, NULL, $db_array);
            }

            $quote_tax_rates = $this->Mdl_quote_tax_rates->where('quote_id', $this->input->post('quote_id'))->get()->result();

            foreach ($quote_tax_rates as $quote_tax_rate)
            {
                $db_array = array(
                    'invoice_id'              => $invoice_id,
                    'tax_rate_id'             => $quote_tax_rate->tax_rate_id,
                    'include_item_tax'        => $quote_tax_rate->include_item_tax,
                    'invoice_tax_rate_amount' => $quote_tax_rate->quote_tax_rate_amount
                );

                $this->Mdl_invoice_tax_rates->save($invoice_id, NULL, $db_array);
            }

            $response = array(
                'success'    => 1,
                'invoice_id' => $invoice_id
            );
        }
        else
        {
            $response = array(
                'success'           => 0,
                'validation_errors' => json_errors()
            );
        }

        echo json_encode($response);
    }

}

?>