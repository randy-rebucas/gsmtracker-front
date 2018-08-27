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
</style>

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
        <!-- <a href="javascript:;" id="print" class="btn btn-primary">Print</a>  -->
        <button type="button" class="btn btn-primary" onclick="PrintDoc('Rx','1000','700')">Print</button>
    </div>
</div>

<script type='text/javascript'>
    
    var record_id = '<?php echo $this->uri->segment(3);?>';
	
	function PrintDoc(title, w, h) {
        // Fixes dual-screen position Most browsers Firefox
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;
        var toPrint = document.getElementById('printableArea');
        var popupWin = window.open('', title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
        popupWin.document.open();
        popupWin.document.write('<html><title>::RX Pad::</title><link rel="stylesheet" type="text/css" href="/css/print.css" /></head><body id="'+BASE_URL+'" onafterprint="closePrint('+record_id+');" onload="window.print(); ">')
        popupWin.document.write(toPrint.innerHTML);
        popupWin.document.write('</html>');
        popupWin.document.close();
        
        var script   = popupWin.document.createElement("script");
        script.type  = "text/javascript";
        script.src  = BASE_URL+"/js/print.js";
        popupWin.document.body.appendChild(script);
    }

    
</script>
