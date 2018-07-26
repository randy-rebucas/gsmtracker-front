var mcs = (function() {

    var that = {};

    that.init = function() {
        console.log('Global initialized!');


        jsArray = {};

        function loadScript(a, b) {
            if (jsArray[a]) b && (debugState && root.root.console.log("This script was already loaded %c: " + a, debugStyle_warning), b());
            else {
                jsArray[a] = !0;
                var c = document.getElementsByTagName("body")[0],
                    d = document.createElement("script");
                d.type = "text/javascript", d.src = a, d.onload = b, c.appendChild(d)
            }
        }

        setInterval(function() {

            var counts = $('.que').attr('data-counts');
            var xcounts = 0;
            xcounts = $.getValues(BASE_URL + 'queings/ajax/counts');

            if (counts != xcounts) {
                que_get();
            }

        }, 3000);

        que_get();

        function que_get() {
            $.ajax({
                url: BASE_URL + 'queings/ajax/get_item',
                type: 'post',
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    if (response.length === 0) {
                        console.log('empty');
                    } else {
                        var item = [];
                        $('.settings > li:nth-child(2)').remove();
                        $.each(response, function(index, val) {
                            console.log(val.queing_id);
                            item += '<li>' +
                                '<a href="' + BASE_URL + 'patients/view/' + val.patient_id + '" class="direct"><strong>MCS-00' + val.queing_id + ' </strong> &nbsp;' + val.patient_name + '</a>' +
                                '</li>';
                        });

                        temp = '<li class="dropdown">' +
                            '<a href="#" class="tip icon dropdown-toggle" data-toggle="dropdown" data-original-title="Que" data-placement="bottom" id="queing"><i class="icon-user"></i></a>' +
                            '<ul id="que-list" class="dropdown-menu" style="">' +
                            item + '</ul>' +
                            '</li>';

                        $('.settings > li:first').after(temp);

                        if ($('ul#que-list li').length) {
                            item = '<li class="divider"></li>' +
                                '<li>' +
                                '<a title="Clear" href="' + BASE_URL + 'queings/ajax/clear_que" id="clear-all"><i class="fa fa-power-off"></i> Clear</a>' +
                                '</li>';
                            $(item).appendTo('ul#que-list');
                        }

                        // $('.settings > li:first').after(temp);

                        $.ajax({
                            url: BASE_URL + 'queings/ajax/counts',
                            type: 'post',
                            dataType: 'json',
                            success: function(response) {
                                $('.que').attr('data-counts', response.counts);
                            }
                        });
                    }
                }
            });
        }

        jQuery.extend({
            getValues: function(url) {
                var result = null;
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        result = response.counts;
                    }
                });
                return result;
            }
        });

    }

    return that;

})();