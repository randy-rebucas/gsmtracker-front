<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Mdl_Appointments extends Response_Model {

    public $table               = 'appointments';
    public $primary_key         = 'appointments.appointment_id';

    public function statuses()
    {
        return array(
            'Pending' => array(
                'label' => lang('appointments_pending'),
                'class' => 'pending',
                'href'  => 'quotes/status/pending'
            ),
            'Approve' => array(
                'label' => lang('appointments_approved'),
                'class' => 'approved',
                'href'  => 'quotes/status/approved'
            ),
            'Cancel' => array(
                'label' => lang('appointments_canceled'),
                'class' => 'canceled',
                'href'  => 'quotes/status/canceled'
            )
        );
    }

    public function default_order_by()
    {
        $this->db->order_by('appointments.appointment_id');
    }

    public function validation_rules()
    {
        return array(
            'appointment_date' => array(
                'field' => 'appointment_date',
                'label' => lang('appointment_date'),
                'rules' => 'required'
            ),
            'appointment_time' => array(
                'field' => 'appointment_time',
                'label' => lang('appointment_time')
            ),
            'appointment_subject' => array(
                'field' => 'appointment_subject',
                'label' => lang('appointment_subject'),
                'rules' => 'required'
            ),
            'appointment_message' => array(
                'field' => 'appointment_message',
                'label' => lang('appointment_message')
            ),
            'appointment_from' => array(
                'field' => 'appointment_from',
                'label' => lang('appointment_from'),
                'rules' => 'required'
            ),
            'appointment_to' => array(
                'field' => 'appointment_to',
                'label' => lang('appointment_to')
            )
        );
    }

    public function save($id = NULL, $db_array = NULL)
    {
        $id = parent::save($id, $db_array);

        return $id;
    }

    public function delete($id)
    {
        parent::delete($id);
    }

    public function is_approved()
    {
        $this->filter_where('appointment_status', 'Approve');
        return $this;
    }

    public function is_pending()
    {
        $this->filter_where('appointment_status', 'Pending');
        return $this;
    }

    public function is_canceled()
    {
        $this->filter_where('appointment_status', 'Cancel');
        return $this;
    }
 
    public function mark_approved($id)
    {
        $this->db->where('appointment_id', $id);
        $this->db->set('appointment_status', 'Approve');
        $this->db->update('appoinments');     
    }
    
    public function mark_canceled($id)
    {
        $this->db->where('appointment_id', $id);
        $this->db->set('appointment_status', 'Cancel');
        $this->db->update('appoinments');  
    }

}

?>