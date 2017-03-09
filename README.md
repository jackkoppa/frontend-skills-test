# Frontend Base Boilerplate
Basic frontend boilerplate with npm, Grunt, responsive images, Sass, postcss, babel, watch, &amp; livereload server

For use in my personal projects, as a simple way to get started (includes a very basic custom css framework) 

## Usage
If `svn` is installed, can run the following from within the root folder of a brand new repository:

```shell
svn export https://github.com/jackkoppa/frontend-boilerplate-2017/trunk . --force
```

This will overwrite the current readme, license, and .gitignore for the new repo. So if the new project has already been started, best to just download a zip of this boilerplate from [https://github.com/jackkoppa/frontend-boilerplate-2017](https://github.com/jackkoppa/frontend-boilerplate-2017), and extract it into your new project.

That's it - from there, get started on development, and delete everything above this line when updating the README:

___

# PROJECT NAME
## Background
PROJECT BACKGROUND

## Getting Started
### General Dependencies
* Node.js & npm ([link](https://nodejs.org/en/download/))
* Grunt.js (after installing Node & npm, run `npm install -g grunt-cli`. [More info](https://gruntjs.com/getting-started))
* ImageMagick (required, in order to use responsive images. [Download instructions](https://www.imagemagick.org/script/download.php))

### npm
2 steps to get up & running. Run:

```shell
npm install
```

to install the dev dependencies. After that, run one of the following Grunt tasks:

* compile & lint files, for both development (`dev/`) & production (`dist/`) builds:
    ```shell
    grunt
    ```


* compile, lint, & launch a livereloading server (`localhost:8000`) for the development build:
    ```shell
    grunt serveDev
    ```


* compile, lint, & launch a persistent server without livereload (`localhost:8080`) for the production build:
    ```shell
    grunt serveProd
    ```
