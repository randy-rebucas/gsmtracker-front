<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Patient_Controller extends User_Controller {

    public function __construct()
    {
        parent::__construct('role_id', $this->patient_role_id);

    }

}
 /* End of file: Patient_Controller.php */
 /* Location: ./application/core/Patient_Controller.php */