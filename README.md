# Basic Node.js App
This is the skeleton of a very basic Node.js app that uses the Express.js framework and connects to a MongoDB.
Note: The MongoDB parts are commented out so that you can clone and run immediately. You can uncomment the MongoDB lines as you see fit.

## Dependencies

### [Node.js](http://nodejs.org/)

### [Express.js](http://expressjs.com/)

### [MongoDB](http://www.mongodb.org/)

### [Mongoose](http://mongoosejs.com/)

### [Jade HTML Template Engine](http://jade-lang.com/)

### [jQuery](http://jquery.com)

## File Tree
    .
    ├── .gitignore
    ├── LICENSE
    ├── Procfile
    ├── README.md
    ├── css
    │   └── style.css
    ├── js
    │   └── jquery-1.10.2.min.js
    ├── package.json
    ├── views
    │   ├── index.jade
    │   └── layout.jade
    └── web.js

## File Explanations

### .gitignore
The .gitignore file is to prevent certain files form being pushed along with every push. Most of the files listed came from the recommended Node.js .gitignore from Github, but I added a few things like the .DS_Store files and the node_modules folder. I omitted .DS_Store files because they're useless. They are files that Finder creates to keep information about how your Finder window should look if you open the folder in Finder (window size, display option [list, icons, etc.], file order, etc.). So it's random crap that gets sent along with pushes and sometimes causes merge errors since they're binary files that are constantly changing. The node_modules folder is also ommitted because they usually need to be redone anyway. This is the folder that your npm packages are locally installed into for this app. A lot of these npm packages though are written in another language (usually C++) and are compiled down for you. Which means that they're binary files and don't work on machines other than your own. So no matter what, `npm install .` needs to be run again for every new machine. So pushing the node_modules folder is just a waste.

### LICENSE
The MIT License.

### Procfile
File that tells Heroku (and my web server that I create on DigitalOcean) what command to run. It's in the format of `web: <command to run server>`.

### README.md
This file.

### css directory
This is the directory that you put all of your CSS files. The web.js file already knows to look here if a CSS file is referenced.

### js directory
This is the directory that you put all of your JavaScript files. The web.js file already knows to look here if a JS file is referenced.

### package.json
This is the JSON file that npm looks for when you run `npm install .`.

### views directory
This is the directory that you put all of your views files. The web.js file already knows to look here for all views. These are written in Jade. Feel free to add subdirectories in here to keep things organized.

### web.js
This is the main JS file. This is where everything gets setup and run. Go to this file for a detailed explanation of everything in it.

## How to Run for the First Time
* `npm install .`
* `node web.js`
* Go to http://localhost:3000

## License
This is released under an MIT license.  See `LICENSE` for the full text of the license.