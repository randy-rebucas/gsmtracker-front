<style>
.modal70 .modal-dialog {
    width: 65%;
}

@media print {
	#printableArea{
		page-break-after: always;
	  	position: relative;
	  	font-family: Menlo,Monaco,Consolas,Courier New,monospace;
	  	font-size: 20px;
	  	font-size: 20px;
	  	background-color: #fff;
	  	color: #000;
	}
	#rx-pad{
		height: 11in !important;
		page-break-after: always;
		position: relative;
		font-size: 20px;
		background-color: #fff;
		color: #000;
	}
	#rx-header{
		margin-top: 165px;
		position: absolute;
		width: 100%;
	}
	#rx-body{
		min-height: 570px;
		color: rgb(51, 122, 183);
		position: absolute;
		top: 360px;
		width: 100%;
	}
	#rx-footer{
		position: absolute;
		bottom: 75px;
		width: 100%;
	}
}
</style>

<p class="print-size-info">Suggested size <code>A5	148 x 210 mm	5.8 x 8.3 in</code></p>
<div id="printableArea">
	<?php echo $pdf_html; ?>
</div>
<a href="javascript:;" id="printThis" class="btn btn-sm btn-primary"><i class="fa fa-print"></i> Print</a>

<script type='text/javascript'>
	
	$(document).ready(function()
	{
		var rowId = '<?php echo $this->uri->segment(3);?>';

		var printhis = function() {
	
			$('#printThis').click(function(){
				
				$("#printableArea").printThis({
					debug: false,               //* show the iframe for debugging
					importCSS: true,            //* import page CSS
					importStyle: true,         //* import style tags
					printContainer: true,       //* grab outer container as well as the contents of the selector
					pageTitle: "",           //   * add title to print page
					removeInline: false,        //* remove all inline styles from print elements
					header: "",               // prefix to html
					footer: "",               // postfix to html
				});

			
				/*var beforePrint = function() {
					console.log('Functionality to run before printing.');
				};
				var afterPrint = function() {
					console.log('Functionality to run after printing');
					$.ajax({
						url: BASE_URL+'queings/process/'+rowId+'/1',
						type: 'post',
						success: function(response) {

							var obj = JSON.parse(response);
							
							if(obj.success)
							{
								window.location.replace(obj.redirect);
				
							}
							
						}
					});	
				};

				// supported by Chrome 9+ and Safari 5.1+
				if (window.matchMedia) {
					var mediaQueryList = window.matchMedia('print');
					mediaQueryList.addListener(function(mql) {
						if (mql.matches) {
							beforePrint();
						} else {
							afterPrint();
						}
					});
				}

				// supported by IE 5+ and FireFox 6+
				window.onbeforeprint = beforePrint;
				window.onafterprint = afterPrint;*/
			
				setTimeout(function(){ 

					$.ajax({
						url: BASE_URL+'queings/process/'+rowId+'/1',
						type: 'post',
						success: function(response) {

							var obj = JSON.parse(response);
							
							if(obj.success)
							{
								window.location.replace(obj.redirect);
				
							}
							
						}
					});	
				}, 3000);	
			});
		}
		loadScript(BASE_URL+"js/printThis.js", printhis);
	
	});
	
	
</script>
