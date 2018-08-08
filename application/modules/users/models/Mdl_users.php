<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Mdl_Users extends Response_Model {

    public $table               = 'users';
    public $primary_key         = 'users.id';
    public $date_created_field  = 'created';
    public $date_modified_field = 'modified';

    public function user_types()
    {
        return array(
            '1' => lang('administrator'),
            '2' => lang('guest_read_only')
        );
    }

    public function default_select()
    {
        $this->db->select('SQL_CALC_FOUND_ROWS users_custom.*, users_role.*, users_profiles.*, users.*', FALSE);
    }

    public function default_join()
    {
        $this->db->join('users_profiles', 'users_profiles.user_id = users.id', 'left');
        $this->db->join('users_custom', 'users_custom.user_id = users.id', 'left');
        $this->db->join('users_role', 'users_role.user_id = users.id', 'left');
    }

    public function default_order_by()
    {
        $this->db->order_by('users.username');
    }

    public function validation_rules()
    {
        return array(
            'email'     => array(
                'field' => 'email',
                'label' => lang('email'),
                'rules' => 'trim|required|valid_email'
            ),
            'username'      => array(
                'field' => 'username',
                'label' => lang('username'),
                'rules' => 'trim|required|min_length[8]|max_length[8]|alpha_dash'
            ),
            'password'  => array(
                'field' => 'password',
                'label' => lang('password'),
                'rules' => 'trim|required|min_length[8]|max_length[8]|alpha_dash'
            ),
            'confirm_password' => array(
                'field' => 'confirm_password',
                'label' => lang('confirm_password'),
                'rules' => 'trim|required|matches[password]'
            )
        );
    }

    public function validation_rules_existing()
    {
        return array(
            'email'     => array(
                'field' => 'email',
                'label' => lang('email'),
                'rules' => 'trim|required|valid_email'
            ),
            'username'      => array(
                'field' => 'username',
                'label' => lang('username'),
                'rules' => 'trim|required|min_length[8]|max_length[8]|alpha_dash'
            )
        );
    }

    public function validation_rules_change_password()
    {
        return array(
            'password'  => array(
                'field' => 'password',
                'label' => lang('password'),
                'rules' => 'trim|required|min_length[8]|max_length[8]|alpha_dash'
            ),
            'confirm_password' => array(
                'field' => 'confirm_password',
                'label' => lang('confirm_password'),
                'rules' => 'trim|required|matches[password]'
            )
        );
    }

    public function db_array()
    {
        $db_array = parent::db_array();

        if (isset($db_array['user_password']))
        {
            unset($db_array['user_passwordv']);

            $this->load->library('sessions/my_crypt');

            $user_psalt = $this->my_crypt->salt();

            $db_array['user_psalt']    = $user_psalt;
            $db_array['user_password'] = $this->my_crypt->generate_password($db_array['user_password'], $user_psalt);
        }

        return $db_array;
    }

    public function save_change_password($user_id, $password)
    {
        $this->load->library('sessions/my_crypt');

        $user_psalt    = $this->my_crypt->salt();
        $user_password = $this->my_crypt->generate_password($password, $user_psalt);

        $db_array = array(
            'user_psalt'    => $user_psalt,
            'user_password' => $user_password
        );

        $this->db->where('user_id', $user_id);
        $this->db->update('fi_users', $db_array);

        $this->session->set_flashdata('alert_success', 'Password Successfully Changed');
    }

    public function save($id = NULL, $db_array = NULL)
    {
        $id = parent::save($id, $db_array);

        if ($user_patients = $this->session->userdata('user_patients'))
        {
            $this->load->model('users/Mdl_user_patients');

            foreach ($user_patients as $user_patient)
            {
                $this->Mdl_user_patients->save(NULL, array('user_id'   => $id, 'patient_id' => $user_patient));
            }

            $this->session->unset_userdata('user_patients');
        }

        return $id;
    }

}

?>