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


## About the project

On the server side implementation I used Node.js with Express framework and MongoDB as database.
On the client side, pure JavaScript with help of jQuery and History.

After runnign grunt build command, new folder named "public" will appear with the content of the client side files.
Thoes files are rendered / copied from the folder "client".

The main layout is views/index.html served as static by the server.

