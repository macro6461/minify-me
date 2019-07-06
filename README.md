# 'Minify Me' 

Minify Me is an experimental minification script written using Node.js.

Includes command line prompts to instruct the user how to conduct the minification and to indicate which file (or directory, coming soon) is to be minified.

It accesses the current project's file system to read a javascript file, minify it, and then write the minified file within the root directory.

Currently, the script only works when the user selects 'file' and then types the name of a JavaScript file. 

Future plans are to build out the process to minify any JavaScript files in a specified directory (while ignoring all other files and subdirectories).

Command line app needs cleaning up, the input validations and error handling need work, as does the minification algorithm itself.

Assets included:

`index.html`: Content

`index.js`: To show interaction with HTML

`index.min.js`: To show interaction with HTML works even after minification

`style.css`: Minimal styling for the testing interface

`minify.js`: The minification script

`test.txt`: To test file type validation

`test` (directory): To test input validation (ignore directories for now). Contains below files/subdirectories

   - `test.js`: To test file type validation

   - `innerTest` (directory): To test input validation (ignore directories for now). Contains below files/subdirectories
            
        - `innerTest.js`: To test file type validation

        - `innerTest.txt`: To test file type validation
        
        
# Instructions

To run the minify-me script, simply type `node minify.js`.
            
Follow the command line prompts and type `file`. Wait for the next prompt and type in the name of a file. You can type `index.js` and watch the script remove trailing whitespaces and debuggers.

# Still to Come

Does not work without semi colons after functions and variable declarations. Also does not remove comments (these will actually cause errors) or `console.logs` (though these do not cause errors).


