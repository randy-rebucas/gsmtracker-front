<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
class Sms_global {
    private $user;
    private $pass;
    private $to;
    private $from;
    private $message;
    private $max_split;
    private $userfield;
    private $error;
    private $smsID;
    private $serverResponse;
    public $res;
    
    function _clear()
    {
        $this->to = '';
        $this->from = '';
        $this->message = '';
        $this->error = '';
    }
    
    function __construct($config = array())
    {        
        $this->_clear();
        if (count($config) > 0)
        {
            foreach ($config as $key => $val)
            {
                $this->$key = $val;
            }
        }
        if(!isset($this->max_split))
        {
            $this->max_split=10;
        }
    }
    
    function to($to)
    {
        $this->to = $to;
    }
    
    function from($from)
    {
        $this->from = $from;
    }
    
    function message($message)
    {
        $this->message = $message;
    }
    function userfield($userfield)
    {
        $this->userfield = $userfield;
    }
    
    function send()
    {
        // Check to is set
        if (!$this->to)
        {
            $this->error .= "No message entered<br />";
        }
        // Check msg is set
        if (!$this->message)
        {
            $this->error .= "No message entered<br />";
        }
        // Check from is set
        if (!$this->from)
        {
            $this->error .= "No 'from' number set<br />";
        }
        
        // If no error then send
        if (!$this->error)
        {
            $smsID = $this->sg_send_sms($this->user, $this->pass, $this->from, $this->to, $this->message, $this->max_split,$this->userfield);
            if (!$smsID)
            {
                $this->error = 'SMS Global failure';
            }
        }
        $this->smsID = $smsID;   
        return $smsID;
    }
    
    function get_sms_id()
    {
        return $this->smsID;
    }
    
    function print_debugger()
    {
        echo '<strong>Status:</strong> ';
        if ($this->error)
        {
            echo $this->error.'<br />';
        } 
        else
        {
            echo 'SMS sent succesfully<br />';
        }
        echo '<strong>SMS ID:</strong> '.$this->smsID.'<br />';
        echo '<strong>Username:</strong> '.$this->user.'<br />';
        echo '<strong>Password:</strong> '.$this->pass.'<br />';
        echo '<strong>To:</strong> '.$this->to.'<br />';
        echo '<strong>From:</strong> '.$this->from.'<br />';
        echo '<strong>Message:</strong> '.$this->message.'<br />';
        echo '<strong>Server Response</strong> '.$this->serverResponse;

        
    }
    //http://www.smsglobal.com/http-api.php
    function sg_send_sms($user,$pass,$sms_from,$sms_to,$sms_msg,$max_split,$userfield = null)  
    {      
        $msg_type = "text";      
        $unicode = "0";            
        $query_string = "http-api.php?action=sendsms&user=".$user."&password=".$pass;
        $query_string .= "&from=".rawurlencode($sms_from)."&to=".rawurlencode($sms_to);
        $query_string .= "&clientcharset=ISO-8859-1";
        $query_string .= "&text=".rawurlencode(stripslashes($sms_msg)) . "&detectcharset=1";
        $query_string .= "&maxsplit=".$max_split;
        $query_string .= "&api=1";
        if($userfield) {
            $query_string .= "&userfield=".$userfield;
        }   
        $url = "http://www.smsglobal.com/".$query_string;
        $curl_handle=curl_init();
        curl_setopt($curl_handle,CURLOPT_URL,$url);
        curl_setopt($curl_handle,CURLOPT_CONNECTTIMEOUT,3000);
        curl_setopt($curl_handle,CURLOPT_RETURNTRANSFER,1);
        $response = curl_exec($curl_handle);
        curl_close($curl_handle);
        
        $this->serverResponse = $response;
        $this->res = $response;
        $explode_response = explode('OK', $response);
        if(isset($explode_response[1]))
            $explode_response = explode('SMSGlobalMsgID:', $explode_response[1]); 
        else
            return false;
        
        if(count($explode_response) == 2) { //Message Success 
               $smsglobal_message_id = $explode_response[1]; 

               //SMSGlobal Message ID 
               $ok = $smsglobal_message_id; 
           } else { //Message Failed 
               $ok = false; 
        } 
        return $ok;  
    }
}    
?> 