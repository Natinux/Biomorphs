$( document ).ready(function() {

    /* Clear the hash (close popup if open) */
    if(!!location.hash.slice(1)){
        window.location.hash = '';
    }

    var shareId = getParameterByName('share'); // check if we are coming from a share.

    if(!!shareId && shareId === 'not-found'){
        alert('Generation not found');
        return;
    }else if(!!shareId && shareId.length > 20){
        /* We are in share state. request generation data. */
        $.get('share/' + shareId + '?data=true', function(data, textStatus){
            var response;
            try{
                response = JSON.parse(data).data;
            }catch (e){}
            if(textStatus !== "success" || !response){
                alert("Generation not found");
                return;
            }
            /* found generation data. init with this data. */
            Biomorphs.init({data:response});
        });
    }else{
        Biomorphs.init(); // init with base mutation
    }


    /* When share button clicked. */
    $("#share-button").on("click", function(){
        event.preventDefault();


        Biomorphs.shareGeneration($('#email').val(), function(link){

            /* fill data to show. */
            if(!!link){
                $('#share-popup-msg').find('.message').text(link).attr('href', link);
            }else{
                $('#share-popup-msg').find('.message').text("Error sharing.");
            }

            /* show link message */
            window.location.hash = 'share-popup-msg';
        });

        return false;

    }.bind(this));

    /*
     * Get url params.
     * */
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
});