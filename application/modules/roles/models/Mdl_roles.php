<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');


class Mdl_Roles extends Response_Model {

    public $table               = 'roles';
    public $primary_key         = 'roles.role_id';

    public function statuses()
    {
        return array(
            '1' => array(
                'label' => lang('draft'),
                'class' => 'draft',
                'href'  => 'quotes/status/draft'
            ),
            '2' => array(
                'label' => lang('sent'),
                'class' => 'sent',
                'href'  => 'quotes/status/sent'
            ),
            '3' => array(
                'label' => lang('viewed'),
                'class' => 'viewed',
                'href'  => 'quotes/status/viewed'
            ),
            '4' => array(
                'label' => lang('approved'),
                'class' => 'approved',
                'href'  => 'quotes/status/approved'
            ),
            '5' => array(
                'label' => lang('rejected'),
                'class' => 'rejected',
                'href'  => 'quotes/status/rejected'
            ),
            '6' => array(
                'label' => lang('canceled'),
                'class' => 'canceled',
                'href'  => 'quotes/status/canceled'
            )
        );
    }

    public function default_select()
    {
        $this->db->select("SQL_CALC_FOUND_ROWS roles.*", FALSE);
    }

    public function default_join()
    {
        // $this->db->join('fi_quote_custom', 'fi_quote_custom.quote_id = fi_quotes.quote_id', 'left');
    }

    function has_permission($module, $role_id, $action, $client_id)
	{

		$this->db->where('section',$module);
		$this->db->where('role_id',$role_id);
		$this->db->where('action',$action);
		$this->db->where('client_id',$client_id);
		$query = $this->db->get('roles_permissions');
		
		if( $query->num_rows() > 0 ){ 
			return TRUE;
		} else { 
			return FALSE; 
		}

    }

    public function validation_rules()
    {
        return array(
            'patient_name'        => array(
                'field' => 'patient_name',
                'label' => lang('patient'),
                'rules' => 'required'
            ),
            'quote_date_created' => array(
                'field' => 'quote_date_created',
                'label' => lang('quote_date'),
                'rules' => 'required'
            ),
            'invoice_group_id'   => array(
                'field' => 'invoice_group_id',
                'label' => lang('quote_group'),
                'rules' => 'required'
            ),
            'user_id'            => array(
                'field' => 'user_id',
                'label' => lang('user'),
                'rule'  => 'required'
            )
        );
    }

}

?>