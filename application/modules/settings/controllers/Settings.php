<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Settings extends Admin_Controller {

    public function __construct()
    {
        parent::__construct();

        $this->load->model('Mdl_settings');
    }

    public function index()
    {

        redirect('preferences');

    }

    function preferences () {
        $data = array();
        $this->_set_layout('default', $data);

        if(!$this->input->is_ajax_request()){
            $this->template->build('settings/index', $data);
        } else {
            $this->load->view('settings/index', $data);
        }
    }
    function doSettings () {

        $settings = $this->input->post('settings');

        // Save the submitted settings
        foreach ($settings as $key => $value)
        {
          
            $this->Mdl_settings->save($key, $value);
            
        }

        $upload_config = array(
            'upload_path'   => APPPATH.'uploads/',
            'allowed_types' => '*',
            'max_size'      => '9999',
            'max_width'     => '9999',
            'max_height'    => '9999'
        );

        // Check for login logo upload
        if ($_FILES['login_logo']['name'])
        {
            $this->load->library('upload', $upload_config);

            if (!$this->upload->do_upload('login_logo'))
            {
                $this->session->set_flashdata('alert_error', $this->upload->display_errors());
                redirect('settings');
            }

            $upload_data = $this->upload->data();

            $this->Mdl_settings->save('login_logo', $upload_data['file_name']);
        }

        $this->session->set_flashdata('alert_success', lang('settings_successfully_saved'));

        redirect('settings');
    }

    public function remove_logo($type)
    {
        unlink(APPPATH.'uploads/' . $this->Mdl_settings->setting($type . '_logo'));

        $this->Mdl_settings->save($type . '_logo', '');

        $this->session->set_flashdata('alert_success', lang($type . '_logo_removed'));

        redirect('settings');
    }

}

?>