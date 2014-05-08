/**
 * Created by Nati on 04/05/14.
 */
var Biomorphs = (function ($, helper) {

    /* Genes ranges and some helpers variables. */
    var MAX_GEN = 9, /* The maximum gene value allowed */
        MIN_GEN = -MAX_GEN, /* The minimum gene value allowed */
        DEPTH_GEN_IDX = 11; /* The index of the depth gene in the genes array */

    /* Helpers variables */
    var dx, /* Mapping x to dx array by direction (filled by mapXtoDx function ) */
        dy, /* Mapping y to dy array by direction (filled by mapYtoDY function ) */
        maxSegmentW, /* Maximum segment width allowed */
        maxSegmentH; /* Maximum segment height allowed */


    var biomorphs = {
        historyState: History.getState(),
        canvasItems: [], // Hold the all canvas DOM elements.
        $canvasItems: null, // The jQuery list of the canvass.
        generationId: 0, // generation counter.
        parent: [], // hold the parent genes.
        childrens:[] // hold childrens list of genes list. (array of arrays)
    };


    /*
     * Events callbacks
     * ---------------------------------------------------------------------------------------
     * */

    /*
     * When canvas is clicked.
     * */
    biomorphs.onCanvasClick = function(event){
        var idx = this.$canvasItems.index(event.target);
        if( idx === undefined || !this.childrens || this.childrens[idx] === undefined){
            throw "Unknown canvas selected";
        }
        this.generateNextGeneration(this.childrens[idx]);
    };

    /*
     * History state change event callback.
     * */
    biomorphs.stateChanged = function(){
        this.historyState = History.getState();
        if(!!this.historyState && !!this.historyState.data && !!this.historyState.data.childrens){
            this.childrens = this.historyState.data.childrens;
            this.drawMutations(this.childrens);
        }
    };

    /*
     * Initializing functions
     * ---------------------------------------------------------------------------------------
     * */


    /*
     * Init the biomorphs object.
     * @param: params - MIXED
     *         $canvasItmes : jQuery list of the canvass to work with.
     *         data: old generation data to re-init.
     *         $content: an event delegation parent to listen for click events on.
     * */
    biomorphs.init = function(params){
        params = params || {}; // make sure params is an object.

        /* init base variables and properties. */
        dx = helper.mapXtoDx();
        dy = helper.mapYtoDy();

        this.$canvasItems = params.$canvasItmes || $("canvas");
        this.canvasItems = this.$canvasItems.get();

        if(!params.data){// If not data sent fill with base mutation.
            this.initBaseMutations();
        }else{
            // else fill with the data given.
            this.initWithData(params.data);
        }

        /* Draw the childrens. */
        this.drawAllChildrens();

        /* Bind to State Change. */
        History.Adapter.bind(window,'statechange',this.stateChanged.bind(this));

        /* Bind click listener on canvas. */
        (params.$content || $(".content")).on("click", "canvas", this.onCanvasClick.bind(this));
    };


    /*
     * Init And draw the base mutaiotn.
     * */
    biomorphs.initBaseMutations = function(){
        for(var i=0; i < this.canvasItems.length; i++){
            this.childrens[i] = helper.getBaseMutationGenes();
            this.drawMutation(this.canvasItems[i], this.childrens[i]);
        }
    };



    /*
     * Parse the given data and init the biomorphs object.
     * */
    biomorphs.initWithData = function(data){
        var parent, childrens;
        try{
            parent = data.parent.pop(); // Parent genes is array at index 0. of this array.
            childrens = data.childrens;
        }catch (e){
            console.log('Incorrect data sent.');
            return;
        }

        /* map the object to array as needed in client side. */
        this.parent = helper.mapObjToGenes(parent);

        /* do the same for each child. */
        for(var i=0; i < childrens.length; i++){
            this.childrens.push(helper.mapObjToGenes(childrens[i]));
        }

    };


    /*
     * Draw childrens on canvases.
     * */
    biomorphs.drawAllChildrens = function(){
        for(var i=0; i < this.childrens.length; i++){
            if(this.canvasItems[i]){ // make sure the canvas really exist.
                this.drawMutation(this.canvasItems[i], this.childrens[i]);
            }else{
                console.log("Out of range.");
            }
        }
    };


    biomorphs.generateNextGeneration = function(parentGenes){
        if(!parentGenes.length){
            throw "Parent genes missing";
        }
        this.parent = parentGenes.slice(0); // make a copy

        /* Create the new population */
        for(var i = 0; i < this.canvasItems.length; i++){
            this.childrens[i] = this.populateMutation(parentGenes);
            this.drawMutation(this.canvasItems[i], this.childrens[i]);
        }

        /* Increase generation id */
        this.generationId++;

        /* Save generation state */
        History.pushState({
                generationId:this.generationId,
                parent:parentGenes,
                childrens:this.childrens
            },
            "Generation " + this.generationId, // title
            "/generation/" + this.generationId // url
        );
    };



    biomorphs.shareGeneration = function(email, callback){

        if( !this.childrens.length ){
            console.log("biomoprhs have corrupted genes");
            helper.invoke(callback);
            return false;
        }

        /* Data for send to server. */
        var data = {};

        /* Test the email address. */
        if(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)){
            data['email'] = email;
        }
        data['parent'] = [this.parent];
        data['childrens'] = this.childrens;

        $.post('share', data, function(data, textStatus){
            var response = {};
            try{
                response = JSON.parse(data); // parse the response
            }catch (e){}

            /* make sure we got link property */
            if(textStatus !== "success" || !response.link){
                console.log("Error wile sharing your generation.");
                helper.invoke(callback);
                return;
            }

            /* invoke callback with link */
            helper.invoke(callback, response.link);
        });
    };


    biomorphs.populateMutation = function(parentGenes){
        if(!parentGenes instanceof Array){
            throw "Genes need to be array";
        }

        var childGenes = []; // child's new genes.

        /* increase / decrease by 1 the values randomly */
        for(var i = 0; i < parentGenes.length; i++){
            var gen = parentGenes[i];
            if(0 === Math.floor(Math.random() * 2)){
                gen++;
            }else{
                gen--;
            }

            /* Reset / reverse if out of range */
            if(gen > MAX_GEN){
                gen = MIN_GEN;
            }else if(gen < MIN_GEN){
                gen = MAX_GEN;
            }

            childGenes.push(gen);
        }
        return childGenes;
    };


    /*
     * Draw the gives genes
     * */
    biomorphs.drawMutations = function(genes){
        if(!genes.length || this.canvasItems.length != genes.length){
            throw "Incorrect genes.";
        }
        for(var i = 0; i < this.canvasItems.length; i++){
            this.drawMutation(this.canvasItems[i], genes[i]);
        }
    };


    /* Draw the given gene on the given canvas */
    biomorphs.drawMutation = function(canvas, genes){

        canvas = canvas || $("#center").get(0);

        /* Make sure its actually a canvas */
        if(!canvas || typeof canvas.getContext !== 'function'){
            throw "Incorrect canvas object.";
        }

        if(!genes || genes[DEPTH_GEN_IDX] === undefined){ // some fail safe
            throw "Incorrect mutation data.";
        }
        var depth = genes[DEPTH_GEN_IDX] % MAX_GEN + 1; // make sure the range is [1,MAX_GEN]

        var ctx = canvas.getContext("2d");

        var width = canvas.width,
            height = canvas.height;

        /* find center point */
        var x = width / 2,
            y = height / 2;

        /* calculate a safety limit */
        maxSegmentH = Math.floor(height / 8);
        maxSegmentW = Math.floor(width / 8);

        /* Clean the canvas from early drawings. */
        ctx.clearRect(0,0,width,height);

        /* Make the drawing */
        drawMutationPresentation(genes, ctx, x, y, depth, helper.direction.S);
    };


    /*
    * Private functions
    * ---------------------------------------------------------------------------------------
    * */


    /*
    * The recursion function who drawing the mutations.
    * */
    function drawMutationPresentation(genes, ctx, x, y, depth, direction){

        direction = (direction + 8) % 8; // The direction range allowed are: [0,7]

        /* x gene are the first 4 elements in the genes array */
        var xGene = depth % 4;

        /* y gene are right after the x genes on the genes array */
        var yGene = xGene + 4;

        /* calculate the new point to go to */
        var x2 = x + (depth * dx[direction] * genes[xGene]) % maxSegmentW;
        var y2 = y + (depth * dy[direction] * genes[yGene]) % maxSegmentH;

        /* generate some random color by the genes range: [8,10] */
        var colors = [];
        colors.push(Math.floor((depth * 256) * genes[8]) % 255); // generate the red color
        colors.push(Math.floor((depth * 512) * genes[9]) % 255);// generate the green color
        colors.push(Math.floor((depth * 1024) * genes[10]) % 255);// generate the blue color

        /* Make sure the color is not whitish  */
        if(colors[0] + colors[1] + colors[2] > 600){
            /* If it is, take on of the color space coefficient and reverse it. */
            var colorIdx = Math.floor(Math.random()*3);
            colors[colorIdx] = Math.abs(colors[colorIdx]-255);
        }

        /* concat the coefficients */
        var color = 'rgba('+colors[0]+','+colors[1]+','+colors[2]+',1)';

        /* Draw the line */
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo( x, y );
        ctx.lineTo( x2, y2 );
        ctx.closePath();
        ctx.stroke();

        /* if we have more to go, make recursive calls. */
        if(depth > 0){
            /* Going left (draw new line to the left) */
            drawMutationPresentation(genes, ctx, x2, y2, depth-1, direction-1);

            /* Going right (draw new line to the right) */
            drawMutationPresentation(genes, ctx, x2, y2, depth-1, direction+1);
        }
    }

    return biomorphs; // Return the biomorphs object.
})(jQuery, Helper);