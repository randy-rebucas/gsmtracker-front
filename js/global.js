var mcs = (function() {

    var that = {};

    that.init = function() {
        console.log('Global initialized!');
        setInterval(function() {

            var counts = $('span#que-counts').html();
            var xcounts = 0;
            xcounts = $.getValues(BASE_URL + 'queings/get_counts');
            console.log(xcounts);

            if (counts != xcounts) {
                que_get();
                $('span#que-counts').text($('#running-que-counts').html());
            }

        }, 3000);

        jQuery.extend({
            getValues: function(url) {
                var result = null;
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    success: function(res) {
                        result = res.counts;
                    }
                });
                return result;
            }
        });

        que_counts();

        function que_counts() {
            $.ajax({
                url: BASE_URL + 'queings/get_counts',
                type: 'post',
                dataType: 'json',
                success: function(res) {
                    $('#que-counts').html(res.counts);
                }
            });
        }

        que_get();

        function que_get() {
            $.ajax({
                url: BASE_URL + 'queings/get_in',
                type: 'post',
                dataType: 'html',
                beforeSend: function() {
                    $('.project-context').find('ul.dropdown-menu').remove();
                },
                success: function(response) {
                    $(response).appendTo($(".project-context"));
                }
            });
        }
    }

    that.init_smallBox = function(_type, _content, _timeout = 3000) {

        var _color = '';
        var _iconSmall = '';

        switch (_type) {
            case 'error':
                _color = "#C46A69";
                _iconSmall = "fa fa-warning shake animated";
                break;
            case 'warning':
                _color = "#826430";
                _iconSmall = "fa-fw fa fa-warning";
                break;
            case 'info':
                _color = "#305d8c";
                _iconSmall = "fa-fw fa fa-info";
                break;
            default: //success
                _color = "#739E73";
                _iconSmall = "fa fa-check";
        }

        $.smallBox({
            title: _type,
            content: _content,
            color: _color,
            iconSmall: _iconSmall,
            timeout: _timeout
        });
    }

    that.init_dialog = function() {
        
        $('.preview').click(function(e) {
            var title = ($(this).attr('data-original-title')) ? $(this).attr('data-original-title') : $(this).attr('title');
            var link = $(this).attr('href');
            var w = '0';
            if ($(this).hasClass('custom-w')) {
                var w = $(this).attr('data-width');
            }
            e.preventDefault();

            $.ajax({
                url: link,
                onError: function() {
                    bootbox.alert("<?php echo $this->lang->line('__bootbox_error');?>");
                },
                success: function(response) {
                    bootbox.hideAll();
                    var dialog = bootbox.dialog({
                        title: title,
                        message: '<p><i class="fa fa-spin fa-spinner"></i> Loading...</p>',
                        className: 'dialog-' + w
                    });
                    dialog.init(function() {
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html(response);
                        }, 3000);
                    });
                }
            });
            
        });
    }

    that.init_action = function() {
        $('.direct').click(function(e) {
            e.preventDefault();
            $.ajax({
                url: $(this).attr('href'),
                success: function(response) {
                    var obj = JSON.parse(response);

                    if (obj.success) {
                        that.init_smallBox("success", obj.message);
                        checkURL();
                    } else {
                        that.init_smallBox("error", obj.message);
                    }
                }
            });
        });

        
    }

    that.init_location = function(country, city, state) {

        if (country) {
            getStates(country, state);
        }

        if (state) {
            getCities(state, city);
        }

        $(document).on("change", "#country", function() {

            var country_id = $('#country option:selected').val();
            getStates(country_id, state);

        });

        $(document).on("change", "#state", function() {

            var state_id = $('#state option:selected').val();
            getCities(state_id, city);

        });

        function getStates(country_id, state) {
            $.ajax({
                url: BASE_URL + 'locations/populate_state',
                data: {
                    id: country_id
                },
                type: "POST",
                beforeSend: function() {
                    $("#state").html('<option selected="selected">loading...</option>');
                },
                success: function(e) {
                    var response = $.parseJSON(e);
                    var option = '';
                    if (response.length) {

                        for (r in response) {
                            // console.log(response);
                            var state_id = response[r].location_id;
                            var name = response[r].name;
                            if (state_id == state) {
                                option += '<option selected="selected" value="' + state_id + '">' + name + '</option>';
                            } else {
                                option += '<option value="' + state_id + '">' + name + '</option>';
                            }
                            getCities(state_id, city);
                        }

                    }
                    $('#state').html(option);

                }

            });
        }

        function getCities(state_id, city) {
            $.ajax({
                url: BASE_URL + 'locations/populate_citie',
                data: {
                    id: state_id
                },
                type: "POST",
                beforeSend: function() {
                    $("#city").html('<option selected="selected">loading...</option>');
                },
                success: function(e) {
                    var response = $.parseJSON(e);
                    var option = '';

                    for (r in response) {
                        var city_id = response[r].location_id;
                        var name = response[r].name;
                        if (city_id == city) {
                            option += '<option selected="selected" value="' + city_id + '">' + name + '</option>';
                        } else {
                            option += '<option value="' + city_id + '">' + name + '</option>';
                        }
                    }

                    $('#city').html(option);

                }

            });
        }
    }

    return that;

})();