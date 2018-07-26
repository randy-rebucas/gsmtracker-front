<?php

use Dompdf\Dompdf;
use Dompdf\Options;

class Queings extends Admin_Controller 
{
	
    function __construct() 
    {
        parent::__construct();

    }

	function index()
	{
		$this->load->model('invoices/Mdl_invoice_amounts');
        $this->load->model('quotes/Mdl_quote_amounts');
        $this->load->model('invoices/Mdl_invoices');
        $this->load->model('quotes/Mdl_quotes');

        $this->layout->set(
            array(
                'invoice_status_totals' => $this->Mdl_invoice_amounts->get_status_totals(),
                'quote_status_totals'   => $this->Mdl_quote_amounts->get_status_totals(),
                'invoices'              => $this->Mdl_invoices->limit(10)->get()->result(),
                'quotes'                => $this->Mdl_quotes->limit(10)->get()->result(),
                'invoice_statuses'      => $this->Mdl_invoices->statuses(),
                'quote_statuses'        => $this->Mdl_quotes->statuses(),
                'overdue_invoices'      => $this->Mdl_invoices->is_overdue()->limit(10)->get()->result()
            )
        );
        
        $this->layout->buffer('content', 'queings/index');
        $this->layout->render('minimal');
        
	}

	public function remove($id, $status) 
    {
        $this->load->model('Mdl_queings');

		$que_info = $this->Mdl_queings->get_by_id($id);
		
		$this->Mdl_queings->process($que_info->patient_id, $que_info->visit_type, $que_info->visit_reason, $que_info->user_id, $status);
		
		$redirect = ($this->nextQue()) ? base_url().'patients/view/'.$this->nextQue() : site_url('patients');
		
		$this->Mdl_queings->delete($id);

		redirect($redirect);
    }
	
	public function nextQue() {

		$this->load->model('Mdl_queings');

        if ($this->Mdl_queings->get()->num_rows() > 0)
        {
            $que = array();
            // Fetch data for all products in cart
            foreach ($this->Mdl_queings->get()->result_array() as $items)
            {
				$que[$items['queing_id']] = $items['patient_id'];
            }
            //always select second array
			$second = array_slice($que, 1)[0];
			//get the key of second array
            return $second;
        }
        return null;    
    }
	
	
	// function move_in()
	// {
		
	// 	$this->load->model('patients/Patient');

	// 	$info = $this->Patient->get_info($this->input->post('patient_id'));

	// 	if(!$this->que->in_cart($info->id)) {

	// 		$num = $this->cart->total_items() + 1;
	// 		$data = array(
	// 		        'id'      => 'MCS-00'.$num,
	// 		        'qty'     => 1,
	// 		        'price'   => ($this->config->item('pf') != '') ? $this->config->item('pf') : 250.00,//initial pf
	// 		        'name'    => $info->firstname.' '. $info->lastname,
	// 		        'options' => array(
	// 		        	'patient_id' => $info->id, 
	// 		        	'type' => $this->input->post('visit_type')
	// 		        )
	// 		);
	// 		if($this->cart->insert($data))
	// 		{
	// 			echo json_encode(array('success' => true, 'message' => 'Patient successfully move to wating list!'));
	// 		} 
	// 	}
	// 	else 
	// 	{
	// 		echo json_encode(array('success' => false, 'message' => 'Patient already in waiting list!'));
	// 	}
		
	// }
	
	// function process($rowid, $status = 1) 
	// { 
	// 	$que_info = $this->cart->get_item($rowid);
    	
	// 	if ($this->Mdl_queings->process($que_info['options']['patient_id'], $que_info['options']['type'], $this->client_id, $status)) {
    		
    // 		$data = array(
	//            'rowid' => $rowid,
	//            'qty'   => 0
	//         );

	//         if($this->cart->update($data))
	//         {
	//         	$redirect = ($this->que->next()) ? base_url().'patients/records/'.url_base64_encode($this->que->next()) : site_url('patients');
	// 			echo json_encode(
	// 				array(
	// 					'success' => true, 
	// 					'message' => 'Patient successfully remove in wating list!', 
	// 					'redirect'=> $redirect
	// 				)
	// 			);
	// 		} 
	// 		else 
	// 		{
	// 			echo json_encode(array('success' => false, 'message' => 'Patient cannot be remove in wating list!'));
	// 		}

    // 	}

	// }

	// function clear_all()
	// {
		
	// 	if($this->cart->destroy())
	// 	{
	// 		echo json_encode(array('success' => true, 'message' => 'Cleaning wating list done!'));
	// 	} 
	// 	else 
	// 	{
	// 		echo json_encode(array('success' => false, 'message' => 'Encounter error in cleaning!'));
	// 	}
	// }
	
	// function get_in()
	// {
		
	// 	$this->load->view('manage');

	// }
	
	// function get_list()
	// {
		
	// 	$this->load->view('list');

	// }
	
	// function get_counts()
	// {
	// 	echo json_encode(array('counts' => $this->cart->total_items()));
	// }

	function preview($rowId, $date, $mainteinable = false)
	{
		//preview/4/2018-6-1/no
		$this->load->library('location_lib');

		$this->load->model('patients/Patient');
		$this->load->model('records/Record');
		$this->load->model('records/Custom');
		$this->load->model('templates/Template');
		$this->load->model('templates/Presets');

		$que_info = $this->cart->get_item($rowId);
		$info = $this->Patient->get_info($que_info['options']['patient_id']);
		
		//$next_visit = $this->Custom->get_record('next_visit', $info->id, false, $date);

		$age = (date("md", date("U", mktime(0, 0, 0, $info->bMonth, $info->bDay, $info->bYear))) > date("md")
				? ((date("Y") - $info->bYear) - 1)
				: (date("Y") - $info->bYear));				
	    
		if($info->gender == 1){
			$gender = 'Male';
		}elseif($info->gender == 2){
			$gender = 'Female';
		}else{
			$gender = 'Undefine';
		}

		$i = 1;
		$prescriptions = '';
	    $prescriptions.='<table id="rx-contents" width="100%"><tbody>';
		foreach ($this->Custom->get_record('prescription', $que_info['options']['patient_id'], false, $date) as $row) {
			$prescriptions.="<tr>";
			$prescriptions.='<td style="font-size: 20px; vertical-align: top; width:10%; padding-bottom: 5px;"><strong>'. $i .'</strong></td>';
			$prescriptions.='<td style="font-size: 20px; vertical-align: top; width:75%; padding-bottom: 5px;"><strong>' .  $row['medicine'].' '.$row['preparation']. '</strong><br> ';
			$prescriptions.='<span style="font-weight: normal;font-size: 18px;font-style: italic;padding-left: 30px; padding-bottom: 5px;">Sig: '.$row['sig'].'</span></td>';
			$prescriptions.='<td style="font-size: 20px; vertical-align: top; width:15%; text-align: right; padding-bottom: 5px;"><strong># ' . $row['qty'] . '</strong></td>';
			$prescriptions.="</tr>";
		$i++; 
		} 
		$prescriptions.="</tbody></table>";

		//get default rxpad template
		//rx_template
		$tx_template = html_entity_decode(html_entity_decode($this->load->view('rxpad', '', TRUE)));
		//$tx_template = ($this->config->item('rx_template') != '') ? $this->Template->get_info($this->config->item('rx_template'))->temp_content : $this->Presets->get_info(1)->temp_content;

		//Replace variables from the Templates
        $html_ = str_replace(
			array(
				//patient details
				"{{patient_id}}",
				"{{patient_name}}", 
				"{{patient_gender}}", 
				"{{patient_birthday}}",
				"{{patient_age}}", 
				"{{patient_address}}", 
				"{{patient_country}}",
				"{{patient_city}}",
				"{{patient_state}}",
				"{{patient_zip}}",
				"{{patient_mobile}}",
				//preserve details				
				"{{consultation_date}}", 
				//"{{next_visit}}",
				"{{prescriptions}}",
				//configuration details
				"{{business_name}}", 
				"{{business_owner}}", 
				"{{business_address}}", 
				"{{business_phone}}", 
				"{{business_email}}", 
				"{{business_fax}}", 
				"{{prc}}", 
				"{{ptr}}", 
				"{{s2}}",
				"{{business_morning_open_time}}", 
				"{{business_morning_close_time}}", 
				"{{business_afternoon_open_time}}", 
				"{{business_afternoon_close_time}}", 
				"{{business_weekend_open_time}}", 
				"{{business_weekend_close_time}}"
			), 
			array(
				//patient details
				$info->id,
				$info->lastname.' '.$info->firstname, 
				$gender, 
				$info->bYear. '-' .$info->bMonth. '-' .$info->bDay,
				$age, 
				($info->address) ? $info->address : '--',
				($info->country) ? $this->location_lib->get_info($info->country)->name : '--',			
				($info->city) ? $this->location_lib->get_info($info->city)->name : '--',
				($info->state) ? $this->location_lib->get_info($info->state)->name : '--', 
				($info->zip) ? $info->zip : '--',
				($info->mobile) ? $info->mobile : '--',
				//preserve details
				date('m/d/Y'),
				//(count($next_visit) > 0) ? date('m/d/Y', strtotime($next_visit[0]['next_visit'])) : '--',
				$prescriptions,
				//configuration details
				($this->config->item('business_name')) ? $this->config->item('business_name') : '--',
				($this->config->item('business_owner')) ? $this->config->item('business_owner') : '--', 
				($this->config->item('business_address')) ? $this->config->item('business_address') : '--',
				($this->config->item('business_phone')) ? $this->config->item('business_phone') : '--',
				($this->config->item('business_email')) ? $this->config->item('business_email') : '--',
				($this->config->item('business_fax')) ? $this->config->item('business_fax') : '--',
				($this->config->item('prc')) ? $this->config->item('prc') : '--', 
				($this->config->item('ptr')) ? $this->config->item('ptr') : '--', 
				($this->config->item('s2')) ? $this->config->item('s2') : '--',
				($this->config->item('morning_open_time')) ? $this->config->item('morning_open_time') : '--',
				($this->config->item('morning_close_time')) ? $this->config->item('morning_close_time') : '--',
				($this->config->item('afternoon_open_time')) ? $this->config->item('afternoon_open_time') : '--',
				($this->config->item('afternoon_close_time')) ? $this->config->item('afternoon_close_time') : '--',
				($this->config->item('week_end_open_time')) ? $this->config->item('week_end_open_time') : '--',
				($this->config->item('week_end_close_time')) ? $this->config->item('week_end_close_time') : '--'
			), $tx_template
        );
        //End 

        $data['pdf_html'] = html_entity_decode(html_entity_decode($html_));
		$this->load->view("rxpad", $data);

    }
	
	
}
