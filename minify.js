const fs = require("fs"),
    path = require("path");

const dir = path.resolve(__dirname);

var standard_input = process.stdin;

standard_input.setEncoding('utf-8');

var withSemiColons = false;

const generalInfo = "\n***********************\n\nPlease type a JavaScript file name, including the file extension, or directory you'd like to minify. If file is in nested directories, type out full path including file name and extension. If directory is nested, please specify full path. \nAn example directory would be '/project_directory/assets/javascript_files'. \nAn example file would be 'index.js' or '/project_directory/assets/javascript_files/index.js'.  \nType exit to leave.\n\n***********************\n";

const generalSmallInfo = "\n***********************\n\nPlease type 'file' or 'directory'. \nType exit to leave.\n\n***********************\n";
const fileDetectionPrompt = "Please type the name of the JavaScript file, including '.js' or '.jsx', you would like to minify.\nIf it is in a directory/nested directory, please type full path ahead of file name.\nMinifying this file will remove:\nwhitespace, console.logs, debuggers, comments (marked by //), as well as add semi colons for you.\nUnfortunately, multi-line comments (marked by /* */) is not yet supported.";
const checkInputForSemiColonFunctionalityPrompt= "Did you want to enable semi-colon appending? This could result in error(s) if you have instances of .then() starting on a new line.\nIf you want to use semi-colon appending, type 'yes', otherwise type 'no'. Typing no means you have included the semi-colons yourself.\nFYI: Typing 'file no-semi' or 'file semi' will enable semi-colon appending from the getgo and skip this prompt.";
const init = () => {
    console.log(generalSmallInfo);

    standard_input.on('data', (data)=> {

        if (data.trim() === 'exit') {
            exit();
        } else if (data.trim() === 'file no-semi') {
            fileDetection();
        } else if (data.trim() === 'file semi') {
            withSemiColons = true;
            fileDetection();
        } else if (data.trim() === 'file'){
            checkInputForSemiColonFunctionality()
        } else if (data.trim() === 'directory'){

        } else {
            console.log('Input is invalid.');
            console.log(generalSmallInfo);
        }

        // var isDirectory = fs.existsSync(data.trim()) && fs.lstatSync(data.trim()).isDirectory();
        //
        // var isFile = fs.existsSync(data.trim()) && fs.lstatSync(data.trim()).isFile();
        //
        // var extension = data.trim().split(".")[data.trim().split(".").length - 1];
        //
        // if (!isDirectory && isFile){
        //     if (extension === 'js' || extension === 'jsx') {
        //         console.log('You typed a JavaScript file name');
        //         readFiles([data.trim()], data);
        //         // exit()
        //     } else {
        //         console.log(`\n '${data.trim()}' is an INVALID file or file type.`);
        //         console.log(generalInfo);
        //     }
        // } else if (isDirectory) {
        //     var directory = data.trim().indexOf('/') === 0 ? dir + data.trim() : dir + '/' + data.trim();
        //     fs.readdir(directory, async (err, files)=>{
        //         if (err){
        //             console.log('\n' + `'${directory}'` + ' is an INVALID directory.');
        //             console.log(generalInfo);
        //         } else {
        //             console.log(data);
        //             return readFiles(files, data)
        //         }
        //     })
        // } else {
        //     console.log('Neither file nor directory.');
        //     console.log(generalInfo);
        // }
    })
};

checkInputForSemiColonFunctionality = () => {
    console.log(checkInputForSemiColonFunctionalityPrompt);
    standard_input.on('data', (data)=> {

        if (data.trim() === 'exit') {
            exit();
        } else if (data.trim() === 'yes') {
            withSemiColons = true;
            fileDetection();
        } else if (data.trim() === 'no') {
            fileDetection();
        } else {
            console.log('Input is invalid.');
            console.log(generalSmallInfo);
        }
    })
}

const fileDetection = () =>{
    console.log(fileDetectionPrompt);
    standard_input.on('data', (data)=> {

        if (data.trim() === 'exit') {
            exit();
        }

        var extension = data.trim().split(".")[data.trim().split(".").length - 1];

        if (extension === 'js' || extension === 'jsx') {
            console.log('You typed a JavaScript file name');

            fs.readFile(dir + '/' + data.trim(), 'utf-8', function(err, content){
                if (err){
                    console.log(err);
                    console.log('Invalid filename.');
                    console.log(generalSmallInfo);
                } else {
                    minify({filename: data.trim(), content, directory: dir});
                }
            })

        } else {
            console.log('Input is invalid.');
            console.log(generalSmallInfo);
        }
    })

};
//
// const readFiles = (files, data) => {
//     var promises = files.map(function(_path){
// //
//         return new Promise(function(_path, resolve, reject){
//
//             var newPath = dir + '/' + data.trim() +'/' + _path;
//
//             var isFile = fs.existsSync(newPath) && fs.lstatSync(newPath).isFile();
//
//             var extension = _path.split(".")[_path.split(".").length - 1];
//
//             if (extension === 'js' || extension === 'jsx'){
//                 fs.readFile(newPath, 'utf-8', function(err, content){
//                     if (err){
//                         console.log(err);
//                         console.log('Invalid filename.');
//                         console.log(generalInfo);
//                     } else {
//                         console.log('litty');
//                         console.log(newPath);
//                         resolve({filename: _path, content});
//                     }
//                 })
//             } else {
//                 readNestedDirectory(_path);
//             }
//
//             var directory = data.trim().indexOf('/') === 0 ? dir + data.trim() : dir + '/' + data.trim();
//
//         }.bind(this, _path));
//     });
//
//     Promise.all(promises).then(function(res){
//         res.forEach((x)=>{
//             console.log(x.filename);
//         })
//     }).then(()=>{exit()})
// };

regexAndSemiColons = (str) => {

    var notAtEnd = ['{', '(', ',', ';', ':', '+', '-', '*', '/','&', '|', '`'];

    //remove all debuggers and console.logs
    var newStr  = str.split("debugger").join("").replace(/console\.log\(([^)]+)\);/igm, ' ');
    /*use regex to remove '//...' (comment), '\r\n' and '\n' (line breaks), and replace with '\r'. Then split it at every new line break.*/
    var strArr = newStr.replace(/(\/)\/.*/g,"").replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);

    /*Map over strArr and evaluate where to put ';'*/

    var finalStr;

    if (withSemiColons){
        finalStr = strArr.map((x)=>{

            /*check if x is just whitespaces (empty lines)*/
            if (x.replace(/\s/g, '').length <=0){
                x = ""
            }

            /*split x into array for validation*/
            var minArr = x.split("");

            /*if array.length is 0, ignore it, otherwise check if the last element is one of the notAtEnd items and if it is, don't add ';'. Otherwise do so.*/
            if (minArr.length > 0 && !notAtEnd.includes(minArr[minArr.length -1])){
                minArr.push(';');
            }

            var final = minArr.join("");
            return final;
        }).join("");
    } else {
        finalStr = strArr.join("");
    }

    finalStr = finalStr.replace(/\s+/g, ' ');

    return finalStr;
};




function minify(data){
    const {filename, directory, content} = data;
    var before = content.length;

    console.log('********************************************');
    console.log(`${filename} is being minified.`);

    var str = `${content}`;
    //start logging time for function
    var timeStart = process.hrtime()[1]/1000000;
    //remove comments, add semicolons
    str = regexAndSemiColons(str);
    var timeEnd = process.hrtime()[1]/1000000;
    var time = timeEnd - timeStart;

    var after = str.length;
    var percentage = percentCalc(before, after);
    if (after > before) {
        str = `${content}`
    }
    console.log(`Minification complete after ${Math.ceil(time)/100} milliseconds.`);
    console.log('size BEFORE: ' + before);
    console.log('size AFTER: ' + after);
    console.log('Minification resulted in: ' + percentage);
    console.log('********************************************');
    try {
        let newFileArr = filename.split(".");
        newFileArr.splice(newFileArr.length - 1, 0, '.min.');
        var finalFileName = newFileArr.join("");
        console.log('New file saved as: ' + finalFileName);
        fs.writeFileSync(directory + '/' + finalFileName, str)
        //file written successfully
    } catch (err) {
        console.error(err)
    }
    exit();
};

percentCalc = (a, b)=>{
  var diff = a - b;
  var percentage;
  if (diff > 0){
      percentage = `${Math.round((diff / a)*100)}% content size DECREASE.`
  } else {
      percentage = `${Math.round((diff / b)*100)}% content size INCREASE. Original file preserved.`
  }
  return percentage;
};

const exit = () =>{
    console.log("Goodbye.");
    process.exit();
};


init();