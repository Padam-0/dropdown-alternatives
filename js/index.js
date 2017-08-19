function getval(segid){
    if ($("#" + segid + " input[type='radio']:checked")[0].labels == null){
            var selector = document.getElementsByName('sc-1');
            for(var i = 0; i < selector.length; i++) {
                //Check if button is checked
                var button = selector[i];
                if(button.checked) {
                    //Return value
                    id = button.id;
                }
            }

            if (id.slice(id.length - 1) == 1){
                btn_value = 'Map';
            } else if (id.slice(id.length - 1) == 2){
                btn_value = 'Radius'
            } else if (id.slice(id.length - 1) == 3){
                btn_value = 'County'
            } else if (id.slice(id.length - 1) == 4){
                btn_value = 'Region'
            } else {
                btn_value = 'Country'
            }

        } else {
            // Chrome
            btn_value = $("#" + segid + " input[type='radio']:checked")[0].labels[0].innerHTML;
        }

        return btn_value
}


$(document).ready(function() {

    $('#btn').click(function(){
        val = getval('sc1');

        $('#result').html(val)
    });

    // $('#sc1')
    //     .click(function(){
    //         val = getval('sc1');
    //         console.log(val);
    //         $('#result').html(val)
    // });

    for (var i = 1; i < 6; i++){
        $('#sc-5-1-' + i)
            .click(function(){
                val = getval('sc1');
                console.log(val);
                $('#result').html(val)
        });
    }

});