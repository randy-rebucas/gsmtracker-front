var BASE_URL = document.getElementsByTagName("body")[0].getAttribute("id");

function closePrint(record_id) {
    window.opener.location.replace(BASE_URL + 'queings/process/' + record_id);
    window.close();
}