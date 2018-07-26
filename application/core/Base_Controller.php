<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Base_Controller extends MX_Controller {

    public $ajax_controller = false;

    public function __construct()
    {
        parent::__construct();

        //$this->config->load('realsoft');

        // Don't allow non-ajax requests to ajax controllers
        if ($this->ajax_controller and !$this->input->is_ajax_request())
        {
            exit;
        }

        $this->load->library('session');
        $this->load->library('security');
        $this->load->helper('url');
        $this->load->helper(array('form', 'url'));


        $this->load->database();
        $this->load->library('form_validation');
        $this->load->helper('number');
        $this->load->helper('date');   
        $this->load->helper('directory');
        // Load setting model and load settings
        $this->load->model('settings/Mdl_settings');
        $this->Mdl_settings->load_settings();

        $this->lang->load('common', $this->Mdl_settings->setting('default_language'));

        $modules = directory_map(APPPATH . '/modules', TRUE);

        foreach ($modules as $module) { $module = str_replace('\\', '', $module);
            if(file_exists(APPPATH . '/modules/'.$module.'/language/'.$this->Mdl_settings->setting('default_language').'/'.$module.'_lang.php')){
                $this->lang->load($module.'/'.$module, $this->Mdl_settings->setting('default_language'));
            }
        }
 
        $this->load->helper('language');

        $this->load->module('layout');

        
    }

}
 /* End of file: Base_Controller.php */
 /* Location: ./application/core/Base_Controller.php */