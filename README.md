Biomorphs
=========

[![Build Status](https://travis-ci.org/Natinux/Biomorphs.svg?branch=master)](https://travis-ci.org/Natinux/Biomorphs)

## Quick Install


### Requirements

node 0.10+ (and npm), mongodb - visit nodejs.org and mongodb.com to download
each.

    $ sudo npm install -g grunt-cli
    $ npm install
    $ grunt build

Grunt init:dev only needs to be run the first time to prepare the client
files.

### Running the App:

Start the server in DEV mode, with nodemon watching the app for a relaunch,
watchers on scripts and css files for rebuild.

    $ grunt server
    
    
Note: no tests implemented.


## About

You can see a [Live Demo](http://biomorphs.nati.be/)

On the server side implementation I used Node.js with Express framework and MongoDB as database.
On the client side, pure JavaScript with help of jQuery and History.

After runnign `grunt build` command, new folder named "public" will appear with the content of the client side files.
Thoes files are rendered / copied from the folder "client".

The main layout is views/index.html served as static by the server.

**The Grunfile have the following tasks:**
   1.  `bower` - install some front-end libraries, `jquery` and `history.js` as you can see on the file `bower.json`
   2.  `clean` - clean (delete) this folders `public` and `build`.
   3.  `cssmin` - minify the styles files.
   4.  `concat` - concat all the styles files together (correnty, only one used).
   5.  `copy` - copies files from the development directories to the deployment and build directories.
   6.  `uglify` - uglify all the js files on production.
   7.  `watch` - watch for changes to the front-end code.
   8.  `nodemon` - watch for changes on the server side code.
   9.  `concurrent` - run grunt tasks concurrently.

**What Grunt tasks can I use?**
   - The `build` task will clean the outputs folders, install the needed front-end libraries, minify the styles,  concatenate the js files, copy them to `build` folder and then uglify them to `public`.
   - The `build:dev` is similar to `build` but without uglify.
   - The `server:stage` task will run the `build` taks plus the `concurrent` task.
   - The `server` task will run the `build:dev` task plus the `concurrent` task.
    
### Structure

* `client` - front-end source files.
* `config` - server configuration files. (corrently, mail configs only)
* `models` - Express models.
* `routes` - Express routers.
* `views` - Express views. (static html, the main layout of the project.)
* `index.js` - the main entry-point the project.
* `Gruntfile.js` - Grunt's configuration file.
* `bower.json` - bower's configuration file.
* `package.json` - npm's configuration file.
* `.travis.yml` - travis ci configuration file.
