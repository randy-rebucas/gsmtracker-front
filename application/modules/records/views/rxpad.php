<style>
div#printableArea {
    width: 5.8in;
    height: 8.3in;
    margin: 0 auto;
    background-color: #fff;
    padding: 0 1em;
    box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
}
p.print-size-info {
    background: #000;
    padding: 3px 10px 5px;
    color: #fff;
}
#rx-header{
    margin-top: 165px;
    position: absolute;
    width: 100%; 
    /*padding: 0px 30px;*/
    font-size: 22px;
}
#rx-body{
    min-height: 570px;
    font-weight: bold;
    color: rgb(51, 122, 183);
    position: absolute;
    top: 360px;
    width: 100%;
    font-size: 23px;
}
#rx-footer {
    position: absolute;
    bottom: 75px;
    width: 100%;
    font-size: 20px;
}
#rx-pad {
    height: 100%;
    page-break-after: always;
    position: relative;
    font-size: 20px;
    color: #000;
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
        box-shadow: transparent;
        width: 5.8in;
        height: 8.3in;
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
<!-- <link href="/path/to/print.css" media="print" rel="stylesheet" /> -->
<div class="row">
	<div class="col-sm-12 col-md-9 col-lg-9">
        <div id="printableArea">
            <?php echo $pdf_html; ?>
        </div>

    </div>
    <div class="col-sm-12 col-md-3 col-lg-3">
        <p class="print-size-info">Suggested size <code>A5	148 x 210 mm	5.8 x 8.3 in</code></p>
        <br/>
        <br/>
        <a href="javascript:;" id="print" class="btn btn-primary">Print</a> 
    </div>
</div>

<script type='text/javascript'>
    
    var record_id = '<?php echo $this->uri->segment(3);?>';

	$(document).ready(function()
	{
        function closePrint () {
            $.ajax({
                url: BASE_URL+'queings/ajax/process/'+record_id,
                type: 'post',
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    if(response.success)
                    {
                        window.location.replace(response.redirect);
                    }
                    
                }
            });	
        }

        function nWin() {
            var w = window.open();
            var html = $("#printableArea").html();

            $(w.document.body).html(html);
            w.onafterprint = closePrint;
            w.focus();
            w.print();
        }

        $(function() {
            $("a#print").click(nWin);
        });
	
	});
	
	
</script>
