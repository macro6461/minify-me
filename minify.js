const fs = require("fs"),
    path = require("path");

const dir = path.resolve(__dirname);

var standard_input = process.stdin;

standard_input.setEncoding('utf-8');

var withSemiColons = false;

var fileOrDirectory = null;

const generalSmallInfo = "\n***********************\n\nPlease type 'file' or 'directory'. \nType exit to leave.\n\n***********************\n";
const fileDetectionPrompt = "Please type the name of the JavaScript file, including '.js' or '.jsx', you would like to minify.\nIf it is in a directory/nested directory, please type full path ahead of file name.\nMinifying this file will remove:\nwhitespace, console.logs, debuggers, comments (marked by //), as well as add semi colons for you.\nUnfortunately, multi-line comments (marked by /* */) is not yet supported.";

const directoryDetectionPrompt = "Please type the name of the directory.\nAll JavaScript files in the directory will be minified. \nAll other file types and nested directories will be ignored.";

const checkInputForSemiColonFunctionalityPrompt= "Did you want to enable semi-colon appending? This could result in error(s) if you have instances of .then() starting on a new line.\nIf you want to use semi-colon appending, type 'yes', otherwise type 'no'. Typing no means you have included the semi-colons yourself.\nFYI: Adding ' no-semi' or ' semi' to your initial input will enable semi-colon appending from the getgo and skip this prompt.\n Example: 'file no-semi' or 'directory no-semi";
const init = () => {
    console.log(generalSmallInfo);

    standard_input.on('data', (data)=> {

        if (data.trim().toLowerCase() === 'exit') {
            exit();
        } else if (data.trim().toLowerCase() === 'file no-semi') {
            fileOrDirectory = 'file';
            fileDetection();
        } else if (data.trim().toLowerCase()  === 'file semi') {
            fileOrDirectory = 'file';
            withSemiColons = true;
            fileDetection();
        } else if (data.trim().toLowerCase()  === 'file'){
            fileOrDirectory = 'file';
            checkInputForSemiColonFunctionality('file')
        } else if (data.trim().toLowerCase()  === 'directory'){
            fileOrDirectory = 'directory';
            checkInputForSemiColonFunctionality('directory')
        } else if (data.trim().toLowerCase()  === 'directory no-semi'){
            fileOrDirectory = 'directory';
            directoryDetection()
        } else if (data.trim().toLowerCase()  === 'directory semi'){
            fileOrDirectory = 'directory';
            withSemiColons = true;
            directoryDetection()
        } else {
            console.log('Input is invalid.');
            console.log(generalSmallInfo);
        }
    })
};

checkInputForSemiColonFunctionality = (x) => {
    console.log(checkInputForSemiColonFunctionalityPrompt);
    standard_input.on('data', (data)=> {

        if (data.trim().toLowerCase()  === 'exit') {
            exit();
        } else if (data.trim().toLowerCase()  === 'yes') {
            withSemiColons = true;
            x === 'file' ? fileDetection() : directoryDetection();
        } else if (data.trim().toLowerCase()  === 'no') {
            x === 'file' ? fileDetection() : directoryDetection();
        } else {
            console.log('Input is invalid.');
            console.log("Please type 'yes' or 'no'.");
        }
    })
};

readFile = (z) =>{
    fs.readFile(dir + '/' + z.trim(), 'utf-8', function(err, content){
        if (err){
            console.log(err);
            console.log('Invalid filename.');
            console.log(generalSmallInfo);
        } else {
            return {filename: z.trim(), content, directory: dir};
        }
    })
};

const fileDetection = () =>{
    console.log(fileDetectionPrompt);
    standard_input.on('data', (data)=> {

        if (data.trim().toLowerCase()  === 'exit') {
            exit();
        }

        var extension = data.trim().toLowerCase().split(".")[data.trim().split(".").length - 1];

        if (extension === 'js' || extension === 'jsx') {

            var obj = readFile(data);

            minify(obj);

        } else {

            console.log('Input is invalid.');
            console.log('Please re-enter file name.');
        }
    })

};

const directoryDetection = () => {
    console.log(directoryDetectionPrompt);
    standard_input.on('data', (data)=> {

        if (data.trim().toLowerCase() === 'exit') {
            exit();
        }

        var directory = data.trim().indexOf('/') === 0 ? dir + data.trim() : dir + '/' + data.trim();
        var isDirectory = fs.existsSync(directory) && fs.lstatSync(directory).isDirectory();

        if (isDirectory){
            fs.readdir(directory, async (err, files) => {
                if (err) {
                    console.log(err)
                } else {
                    let finalFiles = files.filter((_path)=>{
                        return _path.split(".")[_path.split(".").length -1] === 'js' ||
                            _path.split(".")[_path.split(".").length -1] === 'jsx'
                    });

                    finalFiles = finalFiles.filter((y)=>{return y.split(".")[y.split(".").length -2] !== 'min'});

                    var promises = finalFiles.map(function (_path) {
                        return new Promise(function (_path, resolve, reject) {
                            fs.readFile(directory + '/' + _path, 'utf8', function (err, data) {
                                if (err) {
                                    console.log(err);
                                    resolve("");
                                } else {
                                    resolve({filename: _path, content: data});
                                }
                            });
                        }.bind(this, _path));
                    });
                    Promise.all(promises).then(function (results) {
                        let finalFiles = results.map((obj) => {
                            minify({filename: obj.filename, directory, content: obj.content })
                        });
                        try {
                            console.log(results);
                            exit();
                        } catch (e) {
                            console.error(e);
                            exit();
                        }
                    });
                }
            });
        } else {
            console.log('Input is invalid.');
            console.log('Please re-enter directory path.');
        }
    })
};

regexAndSemiColons = (str) => {

    var notAtEnd = ['{', '(', ',', ';', ':', '?', '+', '-', '*', '/','&', '|', '`'];

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
    if (fileOrDirectory === 'directory'){
        console.log(`JavaScript files in ${directory} are being minified.`);
    } else {
        console.log(`${filename} is being minified.`);
    }

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
        console.log('New file saved and can be found in: ' + finalFileName);
        fs.writeFileSync(directory + '/' + finalFileName, str)
        //file written successfully
    } catch (err) {
        console.error(err)
    }
    // exit();
};

finalReadOut = () =>{

};

//HELPERS

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


// var isFile = fs.existsSync(data.trim()) && fs.lstatSync(data.trim()).isFile();