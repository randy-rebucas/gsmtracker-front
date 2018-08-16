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
class Locations extends Secure_Controller
{

    function __construct() 
    {
        parent::__construct();
    }

    public function index() 
    {

    }

	function populate_state()
    {
        $this->load->model('locations/Mdl_states');
		echo json_encode($this->Mdl_states->by_id($this->input->post('id'))->get()->result());
	}
    
    function populate_cities()
    {
        $this->load->model('locations/Mdl_cities');
		echo json_encode($this->Mdl_cities->by_id($this->input->post('id'))->get()->result());
	}
	
}
