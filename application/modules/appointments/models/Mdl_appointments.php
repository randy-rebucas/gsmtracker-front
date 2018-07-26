<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Mdl_Appointments extends Response_Model {

    public $table               = 'fi_appointments';
    public $primary_key         = 'fi_appointments.appointment_id';

    public function statuses()
    {
        return array(
            '1' => array(
                'label' => lang('appointments_pending'),
                'class' => 'pending',
                'href'  => 'quotes/status/pending'
            ),
            '2' => array(
                'label' => lang('appointments_approved'),
                'class' => 'approved',
                'href'  => 'quotes/status/approved'
            ),
            '3' => array(
                'label' => lang('appointments_canceled'),
                'class' => 'canceled',
                'href'  => 'quotes/status/canceled'
            )
        );
    }

    public function default_select()
    {
        $this->db->select('fi_appointments.*, fi_users.*', FALSE);
    }

    public function default_order_by()
    {
        $this->db->order_by('fi_appointments.appointment_id');
    }

    public function default_join()
    {
        //@ todo
        // Change this to patients table and doctors table
        $this->db->join('fi_patients', 'fi_patients.patient_id = fi_appointments.appointment_patient_id', 'left');
        $this->db->join('fi_users', 'fi_users.id = fi_appointments.appointment_doctor_id', 'left');
    }

    public function validation_rules()
    {
        return array(
            'appointment_date' => array(
                'field' => 'appointment_date',
                'label' => lang('date'),
                'rules' => 'required'
            ),
            'appointment_time' => array(
                'field' => 'appointment_time',
                'label' => lang('time')
            ),
            'appointment_title' => array(
                'field' => 'appointment_title',
                'label' => lang('title'),
                'rules' => 'required'
            ),
            'appointment_description' => array(
                'field' => 'appointment_description',
                'label' => lang('description')
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
        $this->filter_where('appointment_status', 2);
        return $this;
    }

    public function is_pending()
    {
        $this->filter_where('appointment_status', 1);
        return $this;
    }

    public function is_canceled()
    {
        $this->filter_where('appointment_status', 3);
        return $this;
    }
 
    public function mark_approved($id)
    {
        $this->db->where('appointment_id', $id);
        $this->db->set('appointment_status', 2);
        $this->db->update('fi_appoinments');     
    }
    
    public function mark_canceled($id)
    {
        $this->db->where('appointment_id', $id);
        $this->db->set('appointment_status', 3);
        $this->db->update('fi_appoinments');  
    }

}

?>