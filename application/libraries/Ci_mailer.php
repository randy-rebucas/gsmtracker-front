<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Codeigniter Send Email
 *
 *
 * @author		Randy Rebucas 
 * @version		1.0.0
 * @license		MIT License Copyright (c) 2008 Randy Rebucas
 */
class Ci_mailer {
    private $ci;
    
    function __construct()
    {
        $this->ci =& get_instance();    // get a reference to CodeIgniter.
    }
    /**
	 * Send email message of given type (activate, forgot_password, etc.)
	 *
	 * @param	string
	 * @param	string
	 * @param	array
	 * @return	void
	 */
	function send_email($type, $email, &$data)
	{
        $CI =& get_instance();
        $this->ci->load->library('email');
        $this->ci->load->config('auth/tank_auth', TRUE);

		$this->ci->email->from($this->config->item('webmaster_email', 'tank_auth'), $this->config->item('website_name', 'tank_auth'));
		$this->ci->email->reply_to($this->config->item('webmaster_email', 'tank_auth'), $this->config->item('website_name', 'tank_auth'));
		$this->ci->email->to($email);
		$this->ci->email->subject(sprintf($this->lang->line('auth_subject_'.$type), $this->config->item('website_name', 'tank_auth')));
		$this->ci->email->message($this->load->view('email/'.$type.'-html', $data, TRUE));
		$this->ci->email->set_alt_message($this->load->view('email/'.$type.'-txt', $data, TRUE));
		$this->ci->email->send();
	}
}

    