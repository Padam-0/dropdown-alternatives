var hold = {'rad': true, 'cou': true, 'reg': true};
var drawArea = 'map';

function test_deploy(area, selector, qt){
    if (hold[area]) {
        $(selector)
            .css('outline-color', '#00b300')
            .css('border-color', '#00b300')
            .css('box-shadow', '0 0 10px #00b300')
            .qtip({
            show: false
        });

        hold[area] = true
    } else {
        $(selector)
            .css('outline-color', '#e62e00')
            .css('border-color', '#e62e00')
            .css('box-shadow', '0 0 10px #e62e00')
            .qtip(qt);

        hold[area] = false
    }
}

function setCookies(){

    if ($("#sc input[type='radio']:checked")[0].labels == null){
            var selector = document.getElementsByName('sc-5');
            for(var i = 0; i < selector.length; i++) {
                //Check if button is checked
                var button = selector[i];
                if(button.checked) {
                    //Return value
                    id = button.id;
                }
            }

            if (id.slice(id.length - 1) == 1){
                calcArea = 'map';
            } else if (id.slice(id.length - 1) == 2){
                calcArea = 'radius'
            } else if (id.slice(id.length - 1) == 3){
                calcArea = 'county'
            } else if (id.slice(id.length - 1) == 4){
                calcArea = 'region'
            } else if (id.slice(id.length - 1) == 5){
                calcArea = 'country'
            }

        } else {
            // Chrome
            calcArea = $("#sc input[type='radio']:checked")[0].labels[0].innerHTML;
        }

    setcookie('areaMain', calcArea.toLowerCase());
    setcookie('min_date', Math.round(tSlider.noUiSlider.get()[0]));
    setcookie('max_date', Math.round(tSlider.noUiSlider.get()[1]));
    setcookie('min_price', Math.round(pSlider.noUiSlider.get()[0]));
    setcookie('max_price', Math.round(pSlider.noUiSlider.get()[1]));

    var r = map.getBounds().getNorthEast().lng();
    var l = map.getBounds().getSouthWest().lng();
    var t = map.getBounds().getNorthEast().lat();
    var b = map.getBounds().getSouthWest().lat();
    setcookie('right', r);
    setcookie('left', l);
    setcookie('top', t);
    setcookie('bottom', b);

    if (document.querySelector('#bad_data:checked') != null) {
        bad_data = 'false'
    } else {
        bad_data = 'true'
    }

    if (calcArea == 'Radius'){
        radius = document.getElementById("radius-selector").value;
        setcookie('radius', radius);
    } else if (calcArea == 'County'){
        areaSecond = $('#county-selector')[0].value;
        setcookie('areaSecond', areaSecond);
        setcookie('bad_data_inc', bad_data);
    } else if (calcArea == 'Region'){
        areaSecond = $('#region-selector')[0].value;
        setcookie('areaSecond', areaSecond);
        setcookie('bad_data_inc', bad_data);
    } else if (calcArea == 'Country') {
        setcookie('bad_data_inc', bad_data);
    }
}

function showZone(){
    map.data.forEach(function(feature) {
        map.data.remove(feature);
    });

    while(overlays.length > 0) {
        overlays.pop().setMap(null);
    }

    var checkedValue = document.querySelector('#showzone:checked');
    if (checkedValue != null){

        if (drawArea == 'map'){
            drawMapEdges(map);
        } else if (drawArea == 'radius'){
            drawRadius(map)
        } else {
            data = getArea(drawArea);
            map.data.loadGeoJson(data);
            map.data.setStyle({
                "fillOpacity": 0.1,
                "strokeColor": 'black',
                "strokeOpacity": 0.7,
                "strokeWeight": 3
            });
        }
    } else {
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        while(overlays.length > 0) {
          overlays.pop().setMap(null);
        }
    }
}

function get_qtip_text(qtip){
    if (qtip == 'age' || qtip == 'pop' || qtip == 'oc'){
        if (calcArea == 'map' || calcArea == 'radius') {
            if (qtip == 'pop') {
                return 'This statistic is an estimate based on data from the 2016 Census. ' +
                    'Due to aggregation by the CSO, it may be very inaccurate for small calculation areas.'
            } else {
                return 'This statistic is an estimate based on data from the 2016 Census.'
            }
        } else {
            return "Data from 2016 Census."
        }
    } else {
        return "This statistic is calculated using property data where the location cannot be verified, " +
            "and hence does not appear on the map.<br/><br/> Outlier and error detection methods may be less effective " +
            "on this data, which may decrease the accuracy of this statistic. " +
            "<br/><br/>If you don't want to include this data in the calculation of this statistic, " +
            "please select the 'Remove Unmapped Data' toggle below and recalculate."
    }
}

function update_qtips(){
    $('#age-info').qtip({
        content: {
            text: get_qtip_text('age')
        },
        style: {
            classes: 'qtip-blue qtip-rounded'
        },
        position: {
            my: 'bottom left',
            at: 'top right',
            target: this
        }
    });

    $('#pop-info').qtip({
        content: {
            text: get_qtip_text('pop')
        },
        style: {
            classes: 'qtip-blue qtip-rounded'
        },
        position: {
            my: 'bottom left',
            at: 'top right',
            target: this
        }

    });

    $('#oc-info').qtip({
        content: {
            text: get_qtip_text('oc')
        },
        style: {
            classes: 'qtip-blue qtip-rounded'
        },
        position: {
            my: 'bottom left',
            at: 'top right',
            target: this
        }
    });

    $("label[for='sc-5-1-1']").qtip({
        content: {
            text: "Calculates statistics of all properties currently shown on the map. " +
                "<br /><br />Select \"Show calculation area on map\" to see which properties are being used."
        },
        style: {
            classes: 'qtip-blue qtip-rounded'
        },
        position: {
            my: 'bottom left',
            at: 'top right',
            target: this
        }
    });

    $("label[for='sc-5-1-2']").qtip({
        content: {
            text: "Calculates statistics of properties within a given radius of the current map center. " +
            "<br /><br />Select \"Show calculation area on map\" to see which properties are being used."
        },
        style: {
            classes: 'qtip-blue qtip-rounded'
        },
        position: {
            my: 'bottom right',
            at: 'top left',
            target: this
        }
    });

    $("label[for='sc-5-1-3']").qtip({
        content: {
            text: "Calculates statistics of properties in a given county."
        },
        style: {
            classes: 'qtip-blue qtip-rounded'
        },
        position: {
            my: 'bottom right',
            at: 'top left',
            target: this
        }
    });

    $("label[for='sc-5-1-4']").qtip({
        content: {
            text: "Calculates statistics of properties in a given region."
        },
        style: {
            classes: 'qtip-blue qtip-rounded'
        },
        position: {
            my: 'bottom right',
            at: 'top left',
            target: this
        }
    });

    $("label[for='sc-5-1-5']").qtip({
        content: {
            text: "Calculates statistics of properties from across the whole of Ireland."
        },
        style: {
            classes: 'qtip-blue qtip-rounded'
        },
        position: {
            my: 'bottom right',
            at: 'top left',
            target: this
        }
    });

    if (bad_data == 'true' && (calcArea == 'county' || calcArea == 'region' || calcArea == 'country')){
        $('#ap-info-cont').html('<a href="#" class="agg-info" id="ap-info"> <sup>[</sup>*<sup>]</sup></a>');
        $('#ap-info').qtip({
            content: {
                text: get_qtip_text('ave-price')
            },
            style: {
                classes: 'qtip-blue qtip-rounded'
            },
            position: {
                my: 'top left',
                at: 'bottom right',
                target: this
            }

        });

        $('#mp-info-cont').html('<a href="#" class="agg-info" id="mp-info"> <sup>[</sup>*<sup>]</sup></a>');
        $('#mp-info').qtip({
            content: {
                text: get_qtip_text('med-price')
            },
            style: {
                classes: 'qtip-blue qtip-rounded'
            },
            position: {
                my: 'top left',
                at: 'bottom right',
                target: this
            }

        });

        $('#pr-info-cont').html('<a href="#" class="agg-info" id="pr-info"> <sup>[</sup>*<sup>]</sup></a>');
        $('#pr-info').qtip({
            content: {
                text: get_qtip_text('price-range')
            },
            style: {
                classes: 'qtip-blue qtip-rounded'
            },
            position: {
                my: 'top left',
                at: 'bottom right',
                target: this
            }

        });

        $('#am-info-cont').html('<a href="#" class="agg-info" id="am-info"> <sup>[</sup>*<sup>]</sup></a>');
        $('#am-info').qtip({
            content: {
                text: get_qtip_text('size')
            },
            style: {
                classes: 'qtip-blue qtip-rounded'
            },
            position: {
                my: 'bottom left',
                at: 'top right',
                target: this
            }

        });

        $('#sd-info-cont').html('<a href="#" class="agg-info" id="sd-info"> <sup>[</sup>*<sup>]</sup></a>');
        $('#sd-info').qtip({
            content: {
                text: get_qtip_text('sale-date')
            },
            style: {
                classes: 'qtip-blue qtip-rounded'
            },
            position: {
                my: 'bottom left',
                at: 'top right',
                target: this
            }

        });

        $('#dr-info-cont').html('<a href="#" class="agg-info" id="dr-info"> <sup>[</sup>*<sup>]</sup></a>');
            $('#dr-info').qtip({
            content: {
                text: get_qtip_text('date-range')
            },
            style: {
                classes: 'qtip-blue qtip-rounded'
            },
            position: {
                my: 'bottom left',
                at: 'top right',
                target: this
            }

        });

        $('.variable-qtip').css('margin-top', '2px')
    } else {
        $('#ap-info-cont').text("");
        $('#mp-info-cont').text("");
        $('#pr-info-cont').text("");
        $('#am-info-cont').text("");
        $('#sd-info-cont').text("");
        $('#dr-info-cont').text("");

        $('.variable-qtip').css('margin-top', 0)
    }

    if (calcArea == 'map' || calcArea == 'radius'){
        $('#estimated').text('Estimated ')
    } else {
        $('#estimated').text('')
    }
}

$(document).ready(function() {

    document.getElementById("sc-5-1-1").checked = true;

    county_list = ['Galway', 'Leitrim', 'Mayo', 'Roscommon', 'Sligo',
        'Carlow', 'Dublin', 'Kildare', 'Kilkenny', 'Laois', 'Longford',
        'Louth', 'Meath', 'Offaly', 'Westmeath', 'Wexford','Wicklow',
        'Clare', 'Cork', 'Kerry', 'Limerick', 'Tipperary', 'Waterford',
        'Cavan', 'Donegal', 'Monaghan'];

    region_list = ['Connacht', 'Leinster', 'Munster', 'Ulster'];

    $('#close-alert').click(function(){
        $(this).parent().parent().remove();
    });

    rad_qt = {
        content: {
            text: 'Error: Must be a number'
        },
        style: {
            classes: 'qtip-red qtip-rounded'
        },
        position: {
            my: 'bottom left',
            at: 'top right',
            target: this
        },
            show: true,
            hide: false
        };

    cou_qt = {
        content: {
            text: 'Error: Must be a valid county'
        },
        style: {
            classes: 'qtip-red qtip-rounded'
        },
        position: {
            my: 'bottom left',
            at: 'top right',
            target: this
        },
            show: true,
            hide: false
        };

    reg_qt = {
        content: {
            text: 'Error: Must be a valid region'
        },
        style: {
            classes: 'qtip-red qtip-rounded'
        },
        position: {
            my: 'bottom left',
            at: 'top right',
            target: this
        },
            show: true,
            hide: false
        };

    rec_qt = {
        content: {
            text: 'Please correct errors above before recalculating statistics'
        },
        style: {
            classes: 'qtip-red qtip-rounded'
        },
        position: {
            my: 'bottom left',
            at: 'top middle',
            target: this
        },
            show: true,
            hide: 'mouseleave'
        };

    $('#radius-selector')
        .prop('disabled', true)
        .focus(function(){
            $(this).keyup(function () {
                hold['rad'] = $.isNumeric(this.value);

                test_deploy('rad', '#radius-selector', rad_qt);
            });
        });

    $('#county-selector')
        .prop('disabled', true)
        .focus(function(){
            $(this).keyup(function () {
                if (county_list.indexOf(this.value) > -1) {
                    hold['cou'] = true
                } else {
                    hold['cou'] = false
                }

                test_deploy('cou', '#county-selector', cou_qt);
            });

            $(this).change(function(){
                if (county_list.indexOf(this.value) > -1) {
                    hold['cou'] = true
                } else {
                    hold['cou'] = false
                }

                test_deploy('cou', '#county-selector', cou_qt);
            });
        });

    $('#region-selector')
        .prop('disabled', true)
        .focus(function(){
            $(this).keyup(function () {
                if (region_list.indexOf(this.value) > -1) {
                    hold['reg'] = true
                } else {
                    hold['reg'] = false
                }

                test_deploy('reg', '#region-selector', reg_qt)
            });

            $(this).change(function(){
                if (region_list.indexOf(this.value) > -1) {
                    hold['reg'] = true
                } else {
                    hold['reg'] = false
                }

                test_deploy('reg', '#region-selector', reg_qt)
            });
        });

    update_qtips();

    $('#radius')
        .css('opacity', 0.4);

    $('#bad_data')
        .prop('disabled', true)
        .click(function () {
            if (document.querySelector('#bad_data:checked') != null){
                bad_data = 'false'
            } else {
                bad_data = 'true'
            }
        });

    $('#dist-opt-right')
        .css('opacity', 0.4);

    $('#sc-5-1-1').prop('disabled', true)
        .click(function(){
            calcArea = 'map';

            $('#radius')
                .css("display", "flex")
                .css('opacity', 0.4);
            $('#radius-selector')
                .prop('disabled', true)
                .qtip({show: false});
            $('#county')
                .css("display", "none");
            $('#county-selector')
                .prop('disabled', true)
                .qtip({show: false});
            $('#region')
                .css("display", "none");
            $('#region-selector')
                .prop('disabled', true)
                .qtip({show: false});
            $('#bad_data')
                .prop('disabled', true);
            $('#dist-opt-right')
                .css('opacity', 0.4);
    });

    $('#sc-5-1-2').prop('disabled', true)
        .click(function(){
            calcArea = 'radius';

            $('#radius')
                .css("display", "flex")
                .css('opacity', '');
            if (hold['rad'] === true) {
                $('#radius-selector')
                    .prop('disabled', false)
                    .qtip({show: false});
            } else {
                $('#radius-selector')
                    .prop('disabled', false)
                    .qtip(rad_qt);
            }

            $('#county')
                .css("display", "none");
            $('#county-selector')
                .prop('disabled', true)
                .qtip({show: false});

            $('#region').css("display", "none");
            $('#region-selector')
                .prop('disabled', true)
                .qtip({show: false});

            $('#bad_data')
                .prop('disabled', true);
            $('#dist-opt-right')
                .css('opacity', 0.4);
    });

    $('#sc-5-1-3').prop('disabled', true)
        .click(function(){
            calcArea = 'county';

            $('#radius')
                .css("display", "none");
            $('#radius-selector')
                .qtip({show: false})
                .prop('disabled', true);

            $('#county')
                .css("display", "flex");
            if (hold['cou'] === true) {
                $('#county-selector')
                    .prop('disabled', false)
                    .qtip({show: false});
            } else {
                $('#county-selector')
                    .prop('disabled', false)
                    .qtip(cou_qt);
            }

            $('#region')
                .css("display", "none");
            $('#region-selector')
                .prop('disabled', true)
                .qtip({show: false});

            $('#bad_data')
                .prop('disabled', false);
            $('#dist-opt-right')
                .css('opacity', '');
    });

    $('#sc-5-1-4').prop('disabled', true)
        .click(function(){
            calcArea = 'region';

            $('#radius')
                .css("display", "none");
            $('#radius-selector')
                .qtip({show: false})
                .prop('disabled', true);

            $('#county')
                .css("display", "none");
            $('#county-selector')
                .prop('disabled', true)
                .qtip({show: false});

            $('#region').css("display", "flex");
            if (hold['reg'] === true) {
                $('#region-selector')
                    .prop('disabled', false)
                    .qtip({show: false});
            } else {
                $('#region-selector')
                    .prop('disabled', false)
                    .qtip(reg_qt);
            }

            $('#bad_data')
                .prop('disabled', false);
            $('#dist-opt-right')
                .css('opacity', '');
    });

    $('#sc-5-1-5').prop('disabled', true)
        .click(function(){
            calcArea = 'country';

            $('#radius').css("display", "flex")
                .css('opacity', 0.4);
            $('#radius-selector')
                .qtip({show: false})
                .prop('disabled', true);
            $('#county').css("display", "none");
            $('#county-selector').prop('disabled', true);
            $('#region').css("display", "none");
            $('#region-selector').prop('disabled', true);

            $('#bad_data')
                .prop('disabled', false);
            $('#dist-opt-right')
                .css('opacity', '');
    });

    $('#rec-button').click(function(){
        $(this).qtip({show: false});

        calcArea = getCalcArea();

        con = true;

        if (calcArea == 'radius') {
            r = $('#radius-selector')[0].value;
            if (hold['rad'] === false || r == ''){
                hold['rad'] = false;
                test_deploy('rad', '#radius-selector', rad_qt);
                con = false
            }
        } else if (calcArea == 'county') {
            areaSecond = $('#county-selector')[0].value;
            if (hold['cou'] === false || areaSecond == ''){
                hold['cou'] = false;
                test_deploy('cou', '#county-selector', cou_qt);
                con = false
            }
        } else if (calcArea == 'region') {
            areaSecond = $('#region-selector')[0].value;

            if (hold['reg'] === false || areaSecond == ''){
                hold['reg'] = false;
                test_deploy('reg', '#region-selector', reg_qt);
                con = false
            }
        }

        if (con) {
            ajax_update_stats(true);

            getMapBounds(map);
            update_qtips();
            drawArea = calcArea;
            showZone();

            setCookies();
        } else {
            $(this).qtip(rec_qt)
        }
    });

    $('#showzone').click(function () {
        showZone();
    });

    $('#rep-btn').click( function () {
        setCookies();
    });

    $('#tab-btn').click( function () {
        setCookies();
    });
});