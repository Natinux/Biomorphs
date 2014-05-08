module.exports = function(app, models) {

    app.get('/', function(req, res){
        res.render('index.html');
    });

    app.get('/generation/:id', function(req, res) {
        res.redirect('/');
    });

    app.get('/share/:id', function(req, res) {
        //query the generation data and fill the grid.
        models.Generation.findById(req.params.id, function(generation) {
            if(!!req.query.data && req.query.data === 'true'){
                res.send(!generation ? JSON.stringify({'data':null}) : JSON.stringify({'data':generation}));
            }else{
                res.redirect('/?share=' + (!generation ? 'not-found' : req.params.id));
            }
        });
    });

    app.post('/generation/share', function(req, res) {
        //save the generation and return the generation link.
        FULLURL = req.protocol + '://' + req.get('host');
        models.Generation.addGeneration(
            req.body["parent"],
            req.body["childrens"],
            req.body["email"],
            function(link){
                res.send(!link ? 400 : JSON.stringify({'link':link}));
            });
    });
};