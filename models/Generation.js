/**
 * Created by Nati on 29/04/2014.
 */
module.exports = function(app, config, mongoose, nodemailer) {

    var Schema = mongoose.Schema;

    var MutationSchema = Schema({
        xScale0     : Number,
        xScale1     : Number,
        xScale2     : Number,
        xScale3     : Number,
        yScale0     : Number,
        yScale1     : Number,
        yScale2     : Number,
        yScale3     : Number,
        red         : Number,
        green       : Number,
        blue        : Number,
        depth       : Number
    });

    var GenerationSchema = Schema({
        parent:  [MutationSchema], // as array for ease of use
        childrens:  [MutationSchema]
    });

    var Generation  = mongoose.model('Generation', GenerationSchema);
    var Mutation = mongoose.model('Mutation', MutationSchema);


    var findById = function(generationId, callback) {
        Generation.findOne({_id:generationId}, function(err,doc) {
            callback(doc);
        });
    };

    /*
    * Add new generation
    * @param trunk - the parent
    * @param childrens - array of array of genes
    * @param mail - email to send a link (optional)
    * @param callback - callback (optional)
    * */
    var addGeneration = function(trunk, childrens, mail, callback){

        if(!trunk || !trunk[0] || !childrens){
            return invoke(callback);
        }

        /* Make sure the email is ok */
        if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(mail)){
            mail = undefined;
        }

        var generation = new Generation();

        for(var i=0; i < childrens.length; i++){
            generation.childrens.push(mapArrayToMutation(childrens[i]));
        }

        /* map the parent genes */
        var parent = mapArrayToMutation(trunk[0]);

        /* add the parent */
        generation.parent.push(parent);

        /* save the generation to the database */
        generation.save(function(err, product){
            product = product || {};

            if(!!err){
                console.log(err);
                return invoke(callback);
            }

            var link = FULLURL + "/share/" + product.id; // FULLURL - global value from router.
            if(!!mail){
                sendMail(mail, link);
            }

            /* invoke the callback if supplied */
            return invoke(callback, link);
        });
    };


    function sendMail(mailTo, link){
        var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
        var mailOptions = {
            from: "Biomorphs <info@biomorphs.com>",
            to: mailTo,
            subject: "Someone shared a generation with you",
            text: "Go to: " + link,
            html: '<a href="'+link+'" target="_blank">See Generation</a>'
        };

        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }

            smtpTransport.close();
        });
    }

    /*
    * Mapping genes array to mutation object
    * */
    function mapArrayToMutation(arr){
        var genesNames = getGenesNames();
        return arr.reduce(function(previousValue, currentValue, index) {
            previousValue[genesNames[index]] = currentValue;
            return previousValue;
        }, {});
    }

    /*
    * Genes names in the order of the genes array
    * */
    function getGenesNames(){
        return ['xScale0',
            'xScale1',
            'xScale2',
            'xScale3',
            'yScale0',
            'yScale1',
            'yScale2',
            'yScale3',
            'red',
            'green',
            'blue',
            'depth'];
    }


    /*
    * Helpers Function
    * ---------------------------------------------------
    * */

    function invoke(func){
        var params = [].slice.call(arguments, 1);
        if(typeof func === 'function'){
            return func.apply(func.context || this, params);
        }
    }

    return {
        findById: findById,
        addGeneration: addGeneration
    };
};
