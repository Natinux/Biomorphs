/**
 * Created by Nati on 08/05/14.
 */
var Helper = (function () {

    var helper = {};

    /* Direction indexes. bijection / one-to-one correspondence with the mapXtoDx / mapYtoDY functions. */
    helper.direction = {
        N:0,
        NE:1,
        E:2,
        SE:3,
        S:4,
        SW:5,
        W:6,
        NW:7
    };


    /*
     * Helper functions
     * ---------------------------------------------------------------------------------------
     * */


    helper.invoke = function(func){
        var params = [].slice.call(arguments, 1);
        if(typeof func === 'function'){
            return func.apply(func.context || this, params);
        }
    };


    /*
     * How x changes
     * the change on x when going to some direction
     * */
    helper.mapXtoDx = function(){
        return [ // The order is important
            0,  // N
            1,  // NE
            1,  // E
            1,  // SE
            0,  // S
            -1, // SW
            -1, // W
            -1  // NW
        ];
    };


    /*
     * the change on y when going to some direction
     * */
    helper.mapYtoDy = function(){
        return [ // The order is important
            -1, //N
            -1, //NE
            0,  //E
            1,  //SE
            1,  //S
            1,  //SW
            0,  //W
            -1  //NW
        ];
    };

    /*
     * Map an object (as the schema) to simple array.
     * */
    helper.mapObjToGenes = function(obj){
        var genes = this.getGenesNames(); // helper array mapping genes names.
        var result = [];
        for(var i = 0; i < genes.length; i++){
            if(obj[genes[i]] !== undefined){
                result.push(obj[genes[i]]);
            }
        }
        return result;
    };


    helper.getGenesNames = function(){
        return [
            'xScale0',
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
    };

    /*
     * Get the base mutation genes
     * "one trunk that has 2 branches reaching out of it."
     * */
    helper.getBaseMutationGenes = function(){
        return [
            -2, //x
            -2, //x
            -6, //x
            7,  //x
            -3, //y
            0,  //y
            6,  //y
            7,  //y
            -4, //red
            7,  //green
            -1, //blue
            2   //depth
        ];
    };

    return helper;
}());