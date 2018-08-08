<?php
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;

use PayPal\Api\Amount;
use PayPal\Api\Details;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;

//step 2
use PayPal\Api\ExecutePayment;
use PayPal\Api\PaymentExecution;

// // Suppress DateTime warnings, if not set already
// date_default_timezone_set(@date_default_timezone_get());

// // Adding Error Reporting for understanding errors properly
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
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
class Payments extends Secure_Controller 
{
    public $apiContext;

	function __construct() 
	{
        parent::__construct();

        $this->apiContext = $this->getApiContext($this->config->item('clientId'), $this->config->item('clientSecret'));
    }

	function index()
	{
		$this->doConfirm();
	}

	/**
	 * Helper method for getting an APIContext for all calls
	 * @param string $$this->config->item('clientSecret') Client ID
	 * @param string $clientSecret Client Secret
	 * @return PayPal\Rest\ApiContext
	 */
	function getApiContext($clientId, $clientSecret)
	{
	
	    // #### SDK configuration
	    // Register the sdk_config.ini file in current directory
	    // as the configuration source.
	    /*
	    if(!defined("PP_CONFIG_PATH")) {
	        define("PP_CONFIG_PATH", __DIR__);
	    }
	    */
	
	
	    // ### Api context
	    // Use an ApiContext object to authenticate
	    // API calls. The clientId and clientSecret for the
	    // OAuthTokenCredential class can be retrieved from
	    // developer.paypal.com
	
	    $apiContext = new ApiContext(
	        new OAuthTokenCredential(
	            $clientId,
	            $clientSecret
	        )
	    );
	
	    // Comment this line out and uncomment the PP_CONFIG_PATH
	    // 'define' block if you want to use static file
	    // based configuration
	
	    $apiContext->setConfig(
	        array(
	            'mode' => 'live',
	            'log.LogEnabled' => true,
	            'log.FileName' => '../PayPal.log',
	            'log.LogLevel' => 'INFO', // PLEASE USE `INFO` LEVEL FOR LOGGING IN LIVE ENVIRONMENTS
	            'cache.enabled' => false,
	            // 'http.CURLOPT_CONNECTTIMEOUT' => 30
	            // 'http.headers.PayPal-Partner-Attribution-Id' => '123123123'
	            //'log.AdapterFactory' => '\PayPal\Log\DefaultLogFactory' // Factory class implementing \PayPal\Log\PayPalLogFactory
	        )
	    );
	
	    // Partner Attribution Id
	    // Use this header if you are a PayPal partner. Specify a unique BN Code to receive revenue attribution.
	    // To learn more or to request a BN Code, contact your Partner Manager or visit the PayPal Partner Portal
	    // $apiContext->addRequestHeader('PayPal-Partner-Attribution-Id', '123123123');
	
	    return $apiContext;
	}

	function doConfirm(){
	/*
		// ### Payer
		// A resource representing a Payer that funds a payment
		// For paypal account payments, set payment method
		// to 'paypal'.
		$payer = new Payer();
		$payer->setPaymentMethod("paypal");
		// ### Itemized information
		// (Optional) Lets you specify item wise
		// information
		$item1 = new Item();
		$item1->setName('Money transfer')
			->setCurrency('USD')
			->setQuantity(1)
			->setSku("123123") // Similar to `item_number` in Classic API
			->setPrice(0.1);
		$item2 = new Item();

		$itemList = new ItemList();
		$itemList->setItems(array($item1));
		// ### Additional payment details
		// Use this optional field to set additional
		// payment information such as tax, shipping
		// charges etc.
		$details = new Details();
		$details->setShipping(0)
			->setTax(0)
			->setSubtotal(0.1);
		// ### Amount
		// Lets you specify a payment amount.
		// You can also specify additional details
		// such as shipping, tax.
		$amount = new Amount();
		$amount->setCurrency("USD")//USD
			->setTotal(0.1)
			->setDetails($details);
		// ### Transaction
		// A transaction defines the contract of a
		// payment - what is the payment for and who
		// is fulfilling it. 
		$transaction = new Transaction();
		$transaction->setAmount($amount)
			->setItemList($itemList)
			->setDescription("Paypal to Cash-it")
			->setInvoiceNumber(uniqid());
		// ### Redirect urls
		// Set the urls that the buyer must be redirected to after 
		// payment approval/ cancellation.

		$redirectUrls = new RedirectUrls();
		$redirectUrls->setReturnUrl(site_url('process/doSuccess'))
			->setCancelUrl(site_url('process/doCancel'));
		// ### Payment
		// A Payment Resource; create one using
		// the above types and intent set to 'sale', authorize
		$payment = new Payment();
		$payment->setIntent("sale")
			->setPayer($payer)
			->setRedirectUrls($redirectUrls)
			->setTransactions(array($transaction));
		// For Sample Purposes Only.
		//$request = clone $payment;
		// ### Create Payment
		// Create a payment by calling the 'create' method
		// passing it a valid apiContext.
		// (See bootstrap.php for more on `ApiContext`)
		// The return object contains the state and the
		// url to which the buyer must be redirected to
		// for payment approval
		try {
			$payment->create($this->apiContext);
		} catch (Exception $ex) {
			// NOTE: PLEASE DO NOT USE RESULTPRINTER CLASS IN YOUR ORIGINAL CODE. FOR SAMPLE ONLY
			//ResultPrinter::printError("Created Payment Using PayPal. Please visit the URL to Approve.", "Payment", null, $request, $ex);
			//exit(1);
		}
		// ### Get redirect url
		// The API response provides the url that you must redirect
		// the buyer to. Retrieve the url from the $payment->getApprovalLink()
		// method
		//$approvalUrl = $payment->getApprovalLink();
		// NOTE: PLEASE DO NOT USE RESULTPRINTER CLASS IN YOUR ORIGINAL CODE. FOR SAMPLE ONLY
		//ResultPrinter::printResult("Created Payment Using PayPal. Please visit the URL to Approve.", "Payment", "<a href='$approvalUrl' >$approvalUrl</a>", $request, $payment);
		redirect($payment->getApprovalLink());
		//return $payment;
		//echo json_encode($payment);
	*/
	// Create a new instance of Payout object
		$payouts = new \PayPal\Api\Payout();
		// This is how our body should look like:
		/*
		 * {
		            "sender_batch_header":{
		                "sender_batch_id":"2014021801",
		                "email_subject":"You have a Payout!"
		            },
		            "items":[
		                {
		                    "recipient_type":"EMAIL",
		                    "amount":{
		                        "value":"1.0",
		                        "currency":"USD"
		                    },
		                    "note":"Thanks for your patronage!",
		                    "sender_item_id":"2014031400023",
		                    "receiver":"shirt-supplier-one@mail.com"
		                }
		            ]
		        }
		 */
		$senderBatchHeader = new \PayPal\Api\PayoutSenderBatchHeader();
		// ### NOTE:
		// You can prevent duplicate batches from being processed. If you specify a `sender_batch_id` that was used in the last 30 days, the batch will not be processed. For items, you can specify a `sender_item_id`. If the value for the `sender_item_id` is a duplicate of a payout item that was processed in the last 30 days, the item will not be processed.
		// #### Batch Header Instance
		$senderBatchHeader->setSenderBatchId(uniqid())
		    ->setEmailSubject("You have a Payout!");
		// #### Sender Item
		// Please note that if you are using single payout with sync mode, you can only pass one Item in the request
		$senderItem = new \PayPal\Api\PayoutItem();
		$senderItem->setRecipientType('Email')
		    ->setNote('Upgrade plan')
		    ->setReceiver('coreweb2015@gmail.com')
		    ->setSenderItemId("2014031400023")
		    ->setAmount(new \PayPal\Api\Currency('{
		                        "value":"1.0",
		                        "currency":"USD"
		                    }'));
		$payouts->setSenderBatchHeader($senderBatchHeader)
		    ->addItem($senderItem);
		// For Sample Purposes Only.
		$request = clone $payouts;
		// ### Create Payout
		try {
		    $output = $payouts->createSynchronous($this->apiContext);
		} catch (Exception $ex) {
		    // NOTE: PLEASE DO NOT USE RESULTPRINTER CLASS IN YOUR ORIGINAL CODE. FOR SAMPLE ONLY
		    ResultPrinter::printError("Created Single Synchronous Payout", "Payout", null, $request, $ex);
		    exit(1);
		}
		// NOTE: PLEASE DO NOT USE RESULTPRINTER CLASS IN YOUR ORIGINAL CODE. FOR SAMPLE ONLY
		 ResultPrinter::printResult("Created Single Synchronous Payout", "Payout", $output->getBatchHeader()->getPayoutBatchId(), $request, $output);
		return $output;
	}
	
	function doCancel(){
		//doCancel?token=EC-3NP36859F4631913M
		//$_GET['token'];
		redirect('account/upgrade');
		
	}
	
	function doSuccess(){
		
		if (isset($_GET['success']) && $_GET['success'] == 'true') {

			$paymentId = $_GET['paymentId'];
			$payment = Payment::get($paymentId, $this->apiContext);

			$execution = new PaymentExecution();
			$execution->setPayerId($_GET['PayerID']);

			$transaction = new Transaction();
			$amount = new Amount();
			$details = new Details();

			$details->setShipping(0)
				->setTax(0)
				->setSubtotal(0.1);

			$amount->setCurrency('USD');
			$amount->setTotal(0.1);
			$amount->setDetails($details);
			$transaction->setAmount($amount);

			$execution->addTransaction($transaction);

			try {

				$result = $payment->execute($execution, $this->apiContext);

				ResultPrinter::printResult("Executed Payment", "Payment", $payment->getId(), $execution, $result);

				try {
                    $payment = Payment::get($paymentId, $this->apiContext);
                    
				} catch (Exception $ex) {

					ResultPrinter::printError("Get Payment", "Payment", null, null, $ex);
					exit(1);
				}
			} catch (Exception $ex) {

				ResultPrinter::printError("Executed Payment", "Payment", null, null, $ex);
				exit(1);
			}

			ResultPrinter::printResult("Get Payment", "Payment", $payment->getId(), null, $payment);

			return $payment;
		} else {

			ResultPrinter::printResult("User Cancelled the Approval", null);
			exit;
		}
		
	}
}
