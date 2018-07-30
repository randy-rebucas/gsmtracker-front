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

class Dashboard extends Secure {

	function __construct() 
	{

        parent::__construct();

        $this->load->language('dashboard', 'english');
    }

    function _remap($method, $params = array()) 
    {
        if (method_exists($this, $method)) {
            return call_user_func_array(array($this, $method), $params);
        }

        $this->display_error_log(getcwd(), get_class($this), $method);
    }

	function index()
	{
		$data['module'] = 'Dashboard';
		$this->load->model('reports/Report');
		$this->layout->title('Dashboard');

		if ($this->is_ajax) 
		{
			$this->load->view('manage', $data);
        } 
		else
		{
			$this->_set_layout($data);
			$this->layout->build('manage', $data);
		}
		
	}

	function check_matrix() {
		$this->load->model('reports/Report');
		$start_ts = date('Y-m-d', strtotime('-8 month', strtotime(date('Y-m-d'))));
		$end_ts = date('Y-m-d');

		$diff = abs(strtotime($end_ts) - strtotime($start_ts));
		$years = floor($diff / (365 * 60 * 60 * 24));
		$months = floor(($diff - $years * 365 * 60 * 60 * 24) / (30 * 60 * 60 * 24));
		$days = floor(($diff - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 * 24) / (60 * 60 * 24));
		
		$responce->cols[] = array( 
            "id" => "", 
            "label" => "Diagnose", 
            "pattern" => "", 
            "type" => "string" 
        ); 
        $responce->cols[] = array( 
            "id" => "", 
            "label" => "Total", 
            "pattern" => "", 
            "type" => "number" 
        );
		for($i = 0; $i < $months + 1; $i++){
			
			$data = $this->Report->matrix($start_ts, $end_ts, $this->client_id); 

	        foreach($data as $cd) 
	        { 
	            $responce->rows[]["c"] = array( 
	                array( 
	                    "v" => $cd->type, 
	                    "f" => null 
	                ) , 
	                array( 
	                    "v" => (int)$cd->total, 
	                    "f" => null 
	                ) 
	            ); 
	        }
	    }
 
        echo json_encode($responce); 
         
	}
	function matrix_stats() {

// $start_ts = date('Y-m-d', strtotime('-8 month', strtotime(date('Y-m-d'))));
// $end_ts = date('Y-m-d');
		//diagnoses
		// $result = $this->Report->count_all(date('Y-m-d', strtotime($start_ts . ' + ' . $i . 'month')), $this->client_id);
		$dataSet1 = array();
		$dataSet1['label'] = 'Diagnoses';
		$dataSet1['data'] = array(
			array(1451599200000,10),
			array(1454277600000,45),
			array(1456783200000,104),
			array(1459458000000,67)
		); // an array of arrays of point pairs

		/*$dataSet2 = array();
		$dataSet2['label'] = 'Customer 2';
		$dataSet2['data'] = array(
			array(3,3),
			array(4,5
		)); // an array of arrays of point pairs*/

		$flots = array($dataSet1);//, $dataSet2
		echo json_encode($flots);
	}

	function matrix_encounters() {
		// var twitter = [
  //           [1, 27],
  //           [2, 34],
  //           [3, 51],
  //           [4, 48],
  //           [5, 55],
  //           [6, 65],
  //           [7, 61],
  //           [8, 70],
  //           [9, 65],
  //           [10, 75],
  //           [11, 57],
  //           [12, 59],
  //           [13, 62]
  //       ],
		// facebook = [
		// 	[1, 25],
		// 	[2, 31],
		// 	[3, 45],
		// 	[4, 37],
		// 	[5, 38],
		// 	[6, 40],
		// 	[7, 47],
		// 	[8, 55],
		// 	[9, 43],
		// 	[10, 50],
		// 	[11, 47],
		// 	[12, 39],
		// 	[13, 47]
		// ],
		// data = [{
		// 	label: "Canceled",
		// 	data: twitter,
		// 	lines: {
		// 		show: true,
		// 		lineWidth: 1,
		// 		fill: true,
		// 		fillColor: {
		// 			colors: [{
		// 				opacity: 0.1
		// 			}, {
		// 				opacity: 0.13
		// 			}]
		// 		}
		// 	},
		// 	points: {
		// 		show: true
		// 	}
		// }, {
		// 	label: "In",
		// 	data: facebook,
		// 	lines: {
		// 		show: true,
		// 		lineWidth: 1,
		// 		fill: true,
		// 		fillColor: {
		// 			colors: [{
		// 				opacity: 0.1
		// 			}, {
		// 				opacity: 0.13
		// 			}]
		// 		}
		// 	},
		// 	points: {
		// 		show: true
		// 	}
		// }];
		$dataSet1 = array();
		$dataSet1['label'] = 'Customer 1';
		$dataSet1['data'] = array(
			array(1,1),
			array(2,2)
		); // an array of arrays of point pairs

		/*$dataSet2 = array();
		$dataSet2['label'] = 'Customer 2';
		$dataSet2['data'] = array(
			array(3,3),
			array(4,5
		)); // an array of arrays of point pairs*/

		$flots = array($dataSet1);//, $dataSet2
		echo json_encode($flots);
		
	}

	function matrix_revenue (){
		// var trgt = [
		//             [1354586000000, 153],
		//             [1364587000000, 658],
		//             [1374588000000, 198],
		//             [1384589000000, 663],
		//             [1394590000000, 801],
		//             [1404591000000, 1080],
		//             [1414592000000, 353],
		//             [1424593000000, 749],
		//             [1434594000000, 523],
		//             [1444595000000, 258],
		//             [1454596000000, 688],
		//             [1464597000000, 364]
		//         ],
		//             prft = [
		//                 [1354586000000, 53],
		//                 [1364587000000, 65],
		//                 [1374588000000, 98],
		//                 [1384589000000, 83],
		//                 [1394590000000, 980],
		//                 [1404591000000, 808],
		//                 [1414592000000, 720],
		//                 [1424593000000, 674],
		//                 [1434594000000, 23],
		//                 [1444595000000, 79],
		//                 [1454596000000, 88],
		//                 [1464597000000, 36]
		//             ],
		//             sgnups = [
		//                 [1354586000000, 647],
		//                 [1364587000000, 435],
		//                 [1374588000000, 784],
		//                 [1384589000000, 346],
		//                 [1394590000000, 487],
		//                 [1404591000000, 463],
		//                 [1414592000000, 479],
		//                 [1424593000000, 236],
		//                 [1434594000000, 843],
		//                 [1444595000000, 657],
		//                 [1454596000000, 241],
		//                 [1464597000000, 341]
		//             ],
		//             toggles = $("#rev-toggles"),
		//             target = $("#flotcontainer");
		
		//         var data = [{
		//             label: "Target Profit",
		//             data: trgt,
		//             bars: {
		//                 show: true,
		//                 align: "center",
		//                 barWidth: 30 * 30 * 60 * 1000 * 80
		//             }
		//         }, {
		//             label: "Actual Profit",
		//             data: prft,
		//             color: '#3276B1',
		//             lines: {
		//                 show: true,
		//                 lineWidth: 3
		//             },
		//             points: {
		//                 show: true
		//             }
		//         }, {
		//             label: "Actual Signups",
		//             data: sgnups,
		//             color: '#71843F',
		//             lines: {
		//                 show: true,
		//                 lineWidth: 1
		//             },
		//             points: {
		//                 show: true
		//             }
		//         }]
		        
		$dataSet1 = array();
		$dataSet1['label'] = 'Customer 1';
		$dataSet1['data'] = array(
			array(1,1),
			array(2,2)
		); // an array of arrays of point pairs

		/*$dataSet2 = array();
		$dataSet2['label'] = 'Customer 2';
		$dataSet2['data'] = array(
			array(3,3),
			array(4,5
		)); // an array of arrays of point pairs*/

		$flots = array($dataSet1);//, $dataSet2
		echo json_encode($flots);
	}
}
