<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Guest_Controller extends User_Controller {

    public function __construct()
    {
        parent::__construct('role_id', $this->role_id);

    }

}
 /* End of file: Guest_Controller.php */
 /* Location: ./application/core/Guest_Controller.php */