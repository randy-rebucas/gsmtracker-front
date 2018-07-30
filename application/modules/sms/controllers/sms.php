<?php
require_once APPPATH. 'modules/secure/controllers/Secure.php';

/*
 * MyClinicSoft
 * 
 * A web based clinical system
 *
 * @package		MyClinicSoft
 * @author		Randy Rebucas
 * @copyright	Copyright (c) 2016 - 2018 MyClinicSoft, LLC
 * @license		http://www.myclinicsoft.com/license.txt
 * @link		http://www.myclinicsoft.com
 * 
 */

class Sms extends Secure {
	
	public function __construct()
	{
		parent::__construct();
        $this->load->model('settings/Setting');

		//$user = $this->Setting->get($this->client_id, 'smsUsername');
        //$password = $this->Setting->get($this->client_id, 'smsPassword');
 
        $account['user'] = $this->config->item('SmsUsername');//$user;
        $account['pass'] = $this->config->item('SmsPass');//$password;

        $this->load->library('sms/Sms_global', $account);
	}
	
	function _remap($method, $params = array()) {
 
        if (method_exists($this, $method)) 
        {
            return call_user_func_array(array($this, $method), $params);
        }

        $this->display_error_log(getcwd(), get_class($this), $method);
    }

	function index()
	{
		$type = $this->input->post('sms_type');
        if ($type == 'outbox') {
            //fetch inbox messages
            $sms = $this->Sms_reports->get_outbox($this->input->post('key'));
        } else {
            //fetch inbox messages
            $sms = $this->Sms_reports->get_inbox($this->input->post('key'));
        }
        $this->load->view('pages/sms/sms_list', array('sms' => $sms, 'type' => $type));
	}

    function view($to, $token = "", $type = "") {

        if ($this->is_ajax) {
            $data['title'] = "Send Message";
            $data['body'] = base64_decode(strtr($this->input->get('msg'), '-_,', '+/='));
 
            $data['to'] = $to;
            $data['token'] = $token;
            $data['type'] = $type;
 
            $this->load->view("form", $data);
        }else{

            $this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
        }

    }

    function send() {
        if ($this->is_ajax) {
 
            $send_to = $this->input->post('to');
            $type = $this->input->post('type');
            $send_to = preg_replace('/^0?/', 61, $send_to);
 
            $msg = $this->input->post('msg');
            $license_key = $this->tank_auth->get_license_key();
            $user = $this->Person->get_profile_info($this->tank_auth->get_user_id());
            $send_from = $user->mobile_no;
            $send_from = preg_replace('/^0?/', 61, $send_from);
 
            $userfield = time();
            $key = "";
            if ($this->input->post('token'))
                $key = $this->input->post('token');
            // echo $key ; exit;
            //if ($this->validate_phone($send_to)) {
            $this->sms_global->to($send_to);
            $this->sms_global->from($send_from);
            $this->sms_global->message($msg);
            $this->sms_global->userfield($userfield);
            if ($this->sms_global->send()) {
 
                $id = $this->sms_global->get_sms_id();
                //$msg_id = $this->sms_global->get_sms_id(); // this is the sms id
                //@todo save message details
                $data = array();
                $data['license_key'] = $license_key;
                $data['handled_key'] = $key;
                $data['type'] = $type;
                $data['msg_key'] = $userfield;
                $data['send_from'] = $send_from;
                $data['send_to'] = $send_to;
                $data['message'] = $msg;
                $data['status'] = 'sent';
                $data['is_read'] = '1';
                $data['global_msg_id'] = $id;
                $data['created'] = date('Y-m-d H:i:s');
                $this->Sms_reports->save($data);
                //$debug = $this->sms_global->print_debugger();
 
                $status = "success";
                $msg = "Message successfully sent.";
            } else {
                // $debug = $this->sms_global->print_debugger();
                $res = $this->sms_global->res;
                $msg = $res;
                $status = "error";
            }
            echo json_encode(array('status' => $status, 'msg' => $msg));
        }else{

            $this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by new tab');
            redirect(strtolower(get_class()));
        }
        
    }
 
    //australia valid number
    function validate_phone($send_to) {
        $send_to = preg_replace('/[^\d]/', '', $send_to);
        return preg_match('/^(0(2|3|4|7|8))?\d{8}$/', $send_to) || preg_match('/^1(3|8)00\d{6}$/', $send_to) || preg_match('/^13\d{4}$/', $send_to);
    }
 
    /**
     * This function is called by GlobalSMS gateway to push the reply on system 
     * Database
     * 
     */
    function replies() {
 
        if ($this->input->get('userfield')) {
 
            $msg_key = $this->input->get('userfield');
            $records = $this->Sms_reports->get_all_data("", "", $msg_key, "");
 
            $data = array();
            $data['license_key'] = "";
            $data['handled_key'] = "";
            $data['type'] = "";
            if ($records->num_rows()) {
                $result = $records->result();
                $data['license_key'] = $result[0]->license_key;
                $data['handled_key'] = $result[0]->handled_key;
                $data['type'] = $result[0]->type;
            }
 
            $data['msg_key'] = $msg_key;
            $data['send_from'] = $this->input->get('from');
            $data['send_to'] = $this->input->get('to');
            $data['message'] = $this->input->get('msg');
            $data['status'] = 'received';
            $data['global_msg_id'] = 0;
            $data['created'] = date('Y-m-d H:i:s');
            $this->Sms_reports->save($data);
        }
        echo "OK";
    }
 
    /**
     * This function is called by GlobalSMS gateway to update the sms status in our system 
     * Database
     * 
     */
    function delivery() {
 
        $msg_id = $this->input->get('msg_id');
//        $date = date('Y-m-d');
//
//        $filepath = 'uploads/sms' . $date . '.txt';
//        if (!file_exists($filepath)) {
//            $file = fopen($filepath, "w");
//            fclose($file);
//        }
//        $content = read_file($filepath);
//        $content .= $_SERVER['QUERY_STRING'];
//        write_file($filepath, $content . "\n");
//        echo "OK";
//        exit;
        if ($msg_id) {
            $records = $this->Sms_reports->get_all_data("", "", "", $msg_id);
            if ($records->num_rows()) {
                $result = $records->result();
                if($result[0]->id) {
                    $data = array();
                    $data['status'] = $this->input->get('dlrstatus');
                    $this->Sms_reports->save($data, $result[0]->id);
                }
            }
        }
        echo "OK";
    }
 
    /**
     * Panic send SMS
     * this is call in property inspection tab
     *
     * @since       1.0.1 First time this was introduced
     * @link        https://realsoft.com.au/properties/inspections/88ed31540ed7b3214a4606383c60d784
     * @param       int $token []
     * @return      void
     *
     */
    public function panic_send_sms() {
        if (!$this->input->is_ajax_request()) {
            $this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by this way');
            redirect('dashboard');
        }
        //$msg='Please help, I am in danger';
        $p_token = $this->input->post('property_token');
        $msg='';
        $status='';
        if (!$this->tank_auth->is_logged_in()) {
            $this->session->set_userdata("currentUrl", current_url());
            redirect('auth/login');
        } else {
 
            if (
                $this->config->item('emergency_mobile_number1_'.$this->tank_auth->get_license_key()) != '' || 
                $this->config->item('emergency_mobile_number2_'.$this->tank_auth->get_license_key()) != '' || 
                $this->config->item('emergency_mobile_number3_'.$this->tank_auth->get_license_key()) != ''
                ){
                 
                $panic = array(
                    $this->config->item('emergency_mobile_number1_'.$this->tank_auth->get_license_key()),
                    $this->config->item('emergency_mobile_number2_'.$this->tank_auth->get_license_key()),
                    $this->config->item('emergency_mobile_number3_'.$this->tank_auth->get_license_key())
                );
                 
                if (is_array($panic)) {
                     
                    foreach($panic as $to){
 
                        $send_to = $to;
                        $type = "panic";
                        $send_to = preg_replace('/^0?/', 61, $send_to);
                        $p_info = $this->Property_xtnd->get_info_token($p_token);  
                        $p_r_info = $this->Property_xtnd->get_all_rental_owner($p_token);
                        $prop_ren_info = $p_r_info->row();
                        //if($p_r_info->rows())
                        $rent_info = $this->Person->get_profile_info($prop_ren_info->rental_owner_id);
                        //print_r($rent_info); die;  
                        //$msg = $this->input->post('msg');
                        $license_key = $this->tank_auth->get_license_key();
                        $user = $this->Person->get_profile_info($this->tank_auth->get_user_id());
                        $send_from = $user->mobile_no;
                        //$mobile_no = $send_from;
                        $send_from = preg_replace('/^0?/', 61, $send_from);
             
                        $userfield = time();
                        $key = "";
                        if ($this->input->post('token'))
                            $key = $this->input->post('token');
                             
                        $msg = 'Agent name: '.$user->first_name." ".$user->last_name.' Mobile number: '.$send_from.' Property address:'.$p_info->property_address_1.' Property manger: '.$rent_info->first_name.' '.$rent_info->last_name.' in panic mode !!!';
                         
                        // echo $key ; exit;
                        //if ($this->validate_phone($send_to)) {
                        $this->sms_global->to($send_to);
                        $this->sms_global->from($send_from);
                        $this->sms_global->message($msg);
                        $this->sms_global->userfield($userfield);
                        if ($this->sms_global->send()) {
             
                            $id = $this->sms_global->get_sms_id();
                            //$msg_id = $this->sms_global->get_sms_id(); // this is the sms id
                            //@todo save message details
                            $data = array();
                            $data['license_key'] = $license_key;
                            $data['handled_key'] = $key;
                            $data['type'] = $type;
                            $data['msg_key'] = $userfield;
                            $data['send_from'] = $send_from;
                            $data['send_to'] = $send_to;
                            $data['message'] = $msg;
                            $data['status'] = 'sent';
                            $data['is_read'] = '1';
                            $data['global_msg_id'] = $id;
                            $data['created'] = date('Y-m-d H:i:s');
                            $this->Sms_reports->save($data);
                            //$debug = $this->sms_global->print_debugger();
                            //print_r($debug);
                            $status = "success";                    
                        }
                    }
                }
                if($status = "success"){
                    $status = "success";
                    $msg = "Message successfully sent.";
                }else{
                    $res = $this->sms_global->res;
                    $msg = $res;
                    $status = "error";
                }
 
                echo json_encode(array('status' => $status, 'msg' => $msg));
            } else {
                echo json_encode(array('status' => "error", 'msg' => 'No Emmergency number found'));
            }
        }
    }
 
    function flag_read(){
        $ids = $this->input->post('id');    
        $this->Sms_reports->flag_read($ids);
    }
     
    function flag_unread(){
        $ids = $this->input->post('id');    
        $this->Sms_reports->flag_unread($ids);
    }
     
    //Invite send for a property
    function invite_send() {
        if (!$this->input->is_ajax_request()) {
            $this->session->set_flashdata('alert_error', 'Sorry! Page cannot open by this way');
            redirect('dashboard');
        }
        if (!hasPermission('Module.SMS.Send')) {
            echo json_encode(array('status' => 'error', 'msg' => 'Insufficient privileges'));
            exit;
        }
        $msg = '';
        if (!$this->tank_auth->is_logged_in()) {
            $this->session->set_userdata("currentUrl", current_url());
            redirect('auth/login');
        } else {
 
            $send_to = $this->input->post('to');
            $type = $this->input->post('type');
            $send_to = preg_replace('/^0?/', 61, $send_to);
 
            $msg = $this->input->post('msg');
            $license_key = $this->tank_auth->get_license_key();
            $user = $this->Person->get_profile_info($this->tank_auth->get_user_id());
            $send_from = $user->mobile_no;
            $send_from = preg_replace('/^0?/', 61, $send_from);
 
            $meeting_date = $this->input->post('mdate');
            $meeting_time = $this->input->post('mtime');
            $meeting_date_time = trim($meeting_date) . " " . trim($meeting_time);
 
            $msg.=' Meet with you on ' . $meeting_date . ' at ' . $meeting_time;
 
            $userfield = time();
            $key = "";
            if ($this->input->post('token'))
                $key = $this->input->post('token');
            // echo $key ; exit;
            // echo $msg;
            //if ($this->validate_phone($send_to)) {
            $this->sms_global->to($send_to);
            $this->sms_global->from($send_from);
            $this->sms_global->message($msg);
            $this->sms_global->userfield($userfield);
            if ($this->sms_global->send()) {
 
                $id = $this->sms_global->get_sms_id();
                //$msg_id = $this->sms_global->get_sms_id(); // this is the sms id
                //@todo save message details
                $data = array();
                $data['license_key'] = $license_key;
                $data['handled_key'] = $key;
                $data['type'] = $type;
                $data['msg_key'] = $userfield;
                $data['send_from'] = $send_from;
                $data['send_to'] = $send_to;
                $data['message'] = $msg;
                $data['status'] = 'sent';
                $data['is_read'] = '1';
                $data['global_msg_id'] = $id;
                $data['meeting_date_time'] = date('Y-m-d H:i:s', strtotime($meeting_date_time));
                $data['created'] = date('Y-m-d H:i:s');
                $this->Sms_reports->save($data);
                //$debug = $this->sms_global->print_debugger();
                //print_r($data);
                $status = "success";
                $msg = "Message successfully sent.";
            } else {
                //$debug = $this->sms_global->print_debugger();
                $res = $this->sms_global->res;
                $msg = $res;
                $status = "error";
            }
            echo json_encode(array('status' => $status,'msg'=>$msg));
        }
        //$this->sms_global->print_debugger(); // only use this to output the message details on screen for debugging 
    }
}
/* End of file sms.php */
/* Location: ./application/modules/sms/controllers/sms.php */