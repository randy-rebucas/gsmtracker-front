<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Users extends Admin_Controller {

    public function __construct()
    {
        parent::__construct();

        $this->load->model('Mdl_users');
    }

    public function index()
    {

        $this->layout->set(
            array(
                'title' => 'Users',
                'author' => 'Randy Rebucas',
                'description' => '',
                'keywords' => ''
            )
        );

        $this->layout->buffer('content', 'users/index');
        $this->layout->render();
    }

    public function form()
    {
        $this->load->model('users/Mdl_user_patients');
        $this->load->model('patients/Mdl_patients');

        $this->layout->set(
            array(
                'id' => $id,
                'user_types' => $this->Mdl_users->user_types(),
                'user_patients' => $this->Mdl_user_patients->where('fi_user_patients.user_id', $id)->get()->result(),
                'title' => 'Form',
                'author' => 'Randy Rebucas',
                'description' => '',
                'keywords' => ''
            )
        );

        $this->layout->buffer('user_patient_table', 'users/partial_user_patient_table');
        $this->layout->buffer('modal_user_patient', 'users/modal_user_patient');
        $this->layout->buffer('content', 'users/form');
        $this->layout->render();
    }

    function doCreate() {
        
        if ($this->input->post('btn_cancel'))
        {
            redirect('users');
        }

        if ($this->Mdl_users->run_validation(($id) ? 'validation_rules_existing' : 'validation_rules'))
        {
            $id = $this->Mdl_users->save($id);

            $this->load->model('custom_fields/Mdl_user_custom');

            $this->Mdl_user_custom->save_custom($id, $this->input->post('custom'));

            redirect('users');
        }

        if ($id and !$this->input->post('btn_submit'))
        {
            if (!$this->Mdl_users->prep_form($id))
            {
                show_404();
            }

            $this->load->model('custom_fields/Mdl_user_custom');

            $user_custom = $this->Mdl_user_custom->where('user_id', $id)->get();

            if ($user_custom->num_rows())
            {
                $user_custom = $user_custom->row();

                unset($user_custom->user_id, $user_custom->user_custom_id);

                foreach ($user_custom as $key => $val)
                {
                    $this->Mdl_users->set_form_value('custom[' . $key . ']', $val);
                }
            }
        }
        elseif ($this->input->post('btn_submit'))
        {
            if ($this->input->post('custom'))
            {
                foreach ($this->input->post('custom') as $key => $val)
                {
                    $this->Mdl_users->set_form_value('custom[' . $key . ']', $val);
                }
            }
        }
    }

    public function change_password($user_id)
    {
        if ($this->input->post('btn_cancel'))
        {
            redirect('users');
        }

        if ($this->Mdl_users->run_validation('validation_rules_change_password'))
        {
            $this->Mdl_users->save_change_password($user_id, $this->input->post('user_password'));
            redirect('users/form/' . $user_id);
        }

        $this->layout->buffer('content', 'users/form_change_password');
        $this->layout->render();
    }

    public function profile()
    {
        if ($this->Mdl_users->run_validation('validation_rules_profile'))
        {
            $this->Mdl_users->save_change_password($user_id, $this->input->post('user_password'));
            redirect('users/form/' . $user_id);
        }
        $this->layout->set(
            array(
                'title' => 'Profile',
                'author' => 'Randy Rebucas',
                'description' => '',
                'keywords' => ''
            )
        );
        $this->layout->buffer('content', 'users/profile');
        $this->layout->render();
    }

}

?>