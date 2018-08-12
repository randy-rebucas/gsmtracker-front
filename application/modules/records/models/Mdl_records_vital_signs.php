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
class Mdl_Records_Vital_Signs extends Response_Model
{
	public $table               = 'records_vital_signs';
    public $primary_key         = 'records_vital_signs.records_vital_signs_id';

    public function validation_rules()
    {
        return array(
            'weight'        => array(
                'field' => 'records_vital_signs_weight',
                'label' => lang('weight'),
                'rules' => 'required'
            ),
            'height' => array(
                'field' => 'records_vital_signs_height',
                'label' => lang('height'),
                'rules' => 'required'
            ),
            'temp'   => array(
                'field' => 'records_vital_signs_temp',
                'label' => lang('tempature'),
                'rules' => 'required'
            ),
            'bp'            => array(
                'field' => 'records_vital_signs_bp',
                'label' => lang('bp'),
                'rule'  => 'required'
            ),
            'pulse'            => array(
                'field' => 'records_vital_signs_pulse',
                'label' => lang('pulse'),
                'rule'  => 'required'
            ),
            'bmi'            => array(
                'field' => 'records_vital_signs_bmi',
                'label' => lang('bmi'),
                'rule'  => 'required'
            )
        );
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
        if ($this->mdl_settings->setting('default_invoice_tax_rate'))
        {
            $db_array = array(
                'quote_id'              => $quote_id,
                'tax_rate_id'           => $this->mdl_settings->setting('default_invoice_tax_rate'),
                'include_item_tax'      => $this->mdl_settings->setting('default_include_item_tax'),
                'quote_tax_rate_amount' => 0
            );
            $this->db->insert('fi_quote_tax_rates', $db_array);
        }
        return $quote_id;
    }
}
