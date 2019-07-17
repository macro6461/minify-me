const fs = require("fs"),
    path = require("path");

const dir = path.resolve(__dirname);

var standard_input = process.stdin;
var standard_output = process.stdout;

standard_input.setEncoding('utf-8');

var withSemiColons = false;

var fileOrDirectory = 'directory';

var answers = 0;

const generalSmallInfo = "\n***********************\n\nPlease type 'file' or 'directory'. \nYou may additionally type either 'semi' or 'no-semi' to specificy semi colon appending, as well as the file/directory name for express minification. \nType exit to leave.\n\n***********************\n > ";

const fileDetectionPrompt = "Please type the name of the JavaScript file, including '.js' or '.jsx', you would like to minify.\nIf it is in a directory/nested directory, please type full path ahead of file name.\nMinifying this file will remove:\nwhitespace, console.logs, debuggers, comments (marked by //), as well as add semi colons for you.\nUnfortunately, multi-line comments (marked by /* */) is not yet supported.\n > ";

const directoryDetectionPrompt = "Please type the name of the directory.\nAll JavaScript files in the directory will be minified. \nAll other file types and nested directories will be ignored. \n > ";

const checkInputForSemiColonFunctionalityPrompt= "Did you want to enable semi-colon appending? This could result in error(s) if you have instances of .then() starting on a new line.\nIf you want to use semi-colon appending, type 'yes', otherwise type 'no'. Typing no means you have included the semi-colons yourself.\nFYI: Adding ' no-semi' or ' semi' to your initial input will enable semi-colon appending from the getgo and skip this prompt.\n Example: 'file no-semi' or 'directory no-semi\n > ";

const init = () => {

    standard_output.write(generalSmallInfo);

    standard_input.on('data', (data)=> {
        if (answers === 0){
            if (data.trim().toLowerCase() === 'exit') {
                exit();
            } else if (data.trim().toLowerCase().includes('file semi') && data.trim().length > 13) {
                fileOrDirectory = 'file';
                withSemiColons = true;
                readFile(data.trim().split(" ")[data.trim().split(" ").length - 1]);
            } else if (data.trim().toLowerCase().includes('file no-semi') && data.trim().length > 13){
                fileOrDirectory = 'file';
                readFile(data.trim().split(" ")[data.trim().split(" ").length - 1]);
            } else if (data.trim().toLowerCase().includes('directory semi') && data.trim().length > 13){
                withSemiColons = true;
                var directory = data.trim().indexOf('/') === 0 ? dir + data.trim().split(" ")[data.trim().split(" ").length - 1] : dir + '/' + data.trim().split(" ")[data.trim().split(" ").length - 1];
                var isDirectory = fs.existsSync(directory) && fs.lstatSync(directory).isDirectory();
                if (isDirectory){
                    readDirectory(directory);
                } else {
                    console.log('Input is invalid.');
                    standard_output.write('Please re-enter directory path. \n > ');
                }
            } else if (data.trim().toLowerCase().includes('directory no-semi') && data.trim().length > 13){
                var directory = data.trim().indexOf('/') === 0 ? dir + data.trim() : dir + '/' + data.trim();
                var isDirectory = fs.existsSync(directory) && fs.lstatSync(directory).isDirectory();
                if (isDirectory){
                    readDirectory(directory);
                } else {
                    console.log('Input is invalid.');
                    standard_output.write('Please re-enter directory path. \n > ');
                }
            } else if (data.trim().toLowerCase()  === 'file semi') {
                fileOrDirectory = 'file';
                var output = fileOrDirectory === 'file' ? fileDetectionPrompt : directoryDetectionPrompt;
                withSemiColons = true;
                answers += 2;
                standard_output.write(output);
            } else if (data.trim().toLowerCase() === 'file no-semi') {
                fileOrDirectory = 'file';
                var output = fileOrDirectory === 'file' ? fileDetectionPrompt : directoryDetectionPrompt;
                answers += 2;
                standard_output.write(output);
            } else if (data.trim().toLowerCase()  === 'file semi') {
                fileOrDirectory = 'file';
                var output = fileOrDirectory === 'file' ? fileDetectionPrompt : directoryDetectionPrompt;
                withSemiColons = true;
                answers += 2;
                standard_output.write(output);
            } else if (data.trim().toLowerCase()  === 'file'){
                fileOrDirectory = 'file';
                standard_output.write(checkInputForSemiColonFunctionalityPrompt);
                answers += 1;
            } else if (data.trim().toLowerCase()  === 'directory'){
                fileOrDirectory = 'directory';
                standard_output.write(checkInputForSemiColonFunctionalityPrompt);
                answers += 1;
            } else if (data.trim().toLowerCase()  === 'directory no-semi'){
                fileOrDirectory = 'directory';
                var output = fileOrDirectory === 'file' ? fileDetectionPrompt : directoryDetectionPrompt;
                answers += 2;
                standard_output.write(output);
            } else if (data.trim().toLowerCase()  === 'directory semi'){
                fileOrDirectory = 'directory';
                var output = fileOrDirectory === 'file' ? fileDetectionPrompt : directoryDetectionPrompt;
                withSemiColons = true;
                answers += 2;
                standard_output.write(output);
            } else {
                standard_output.write('Input is invalid.');
                standard_output.write(generalSmallInfo);
            }
        } else if (answers === 1){
            var output = fileOrDirectory === 'file' ? fileDetectionPrompt : directoryDetectionPrompt;
            if (data.trim().toLowerCase()  === 'exit') {
                answers = 0;
                exit();
            } else if (data.trim().toLowerCase()  === 'yes') {
                withSemiColons = true;
                standard_output.write(output);
                answers += 1;
            } else if (data.trim().toLowerCase()  === 'no') {
                standard_output.write(output);
                answers += 1;
            } else {
                standard_output.write('Input is invalid.\n');
                standard_output.write("Please type 'yes' or 'no'.");
            }
        } else if (answers === 2){
            var output = fileOrDirectory === 'file' ? fileDetectionPrompt : directoryDetectionPrompt;
            if (data.trim().toLowerCase()  === 'exit') {
                answers = 0;
                exit();
            } else if (fileOrDirectory === 'file') {
                var extension = path.extname(data.trim());
                if (extension === '.js' || extension === '.jsx') {
                    readFile(data.trim());
                } else {
                    console.log('Input is invalid.\n');
                    console.log('Please re-enter file name.');
                }
            } else if (fileOrDirectory === 'directory'){

                var directory = data.trim().indexOf('/') === 0 ? dir + data.trim() : dir + '/' + data.trim();
                var isDirectory = fs.existsSync(directory) && fs.lstatSync(directory).isDirectory();

                if (isDirectory){
                    readDirectory(directory);
                } else {
                    console.log('Input is invalid.');
                    standard_output.write('Please re-enter directory path. \n > ');
                }
            } else {
                console.log('Input is invalid.');
                standard_output.write(output);
            }
        } else if (answers > 3){
            exit();
        }
    })
};

////////////////////////HELPERS

readFile = (data) =>{
    fs.readFile(dir + '/' + data, 'utf-8', function(err, content){
        if (err){
            console.log(err);
            console.log('Invalid filename.\n');
            // console.log(generalSmallInfo);
            exit();
        } else {
            console.log('********************************************');
            console.log(`${data} is being minified.`);
            var timeStart = process.hrtime()[1]/1000000;
            var final = minify({filename: data, content, directory: dir});
            var timeEnd = process.hrtime()[1]/1000000;
            var time = timeEnd - timeStart;
            const {filename, directory, before, after, percentage, str } = final;
            finalReadOut(filename, directory, time, before, after, percentage, str)
        }
    })
}

readDirectory = (directory) =>{
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
                console.log('********************************************');
                console.log(`All JavaScript files in ${directory} are being minified.`);
                try {
                    let evaluated = evalAndWrite(results, directory);
                } catch (e) {
                    console.error(e);
                    exit();
                }
            });
        }
    });
}

minify = (data) =>{
    const {filename, directory, content} = data;
    var before = content.length;

    var str = `${content}`;
    //remove comments, add semicolons
    //this will also remove these when they are in strings (can result in error).
    //need to create solution for debuggers and // in strings.
    str = regexAndSemiColons(str);

    var after = str.length;
    var percentage = percentCalc(before, after);
    if (after > before) {
        str = `${content}`
    }

    return {filename, directory, before, after, percentage, str };

};

evalAndWrite = (x, y) =>{
    if (fileOrDirectory === 'file'){
        //evaluate time, percentage, size before/after,

    } else {
        let filenames = [];
        let totalTime = 0;
        let totalBefore = 0;
        let totalAfter = 0;
        for (var i = 0; i < x.length; i++) {
            let dataDirectory = y;
            var timeStart = process.hrtime()[1]/1000000;
            var final = minify({filename: x[i].filename, directory: dataDirectory, content: x[i].content });
            var timeEnd = process.hrtime()[1]/1000000;
            var time = timeEnd - timeStart;
            const {filename, directory, before, after, percentage, str } = final;
            totalBefore += before;
            totalAfter += after;
            filenames.push(x[i].filename);
            totalTime += time;
            try {
                let newFileArr = filename.split(".");
                newFileArr.splice(newFileArr.length - 1, 0, '.min.');
                var finalFileName = newFileArr.join("");
                console.log(directory + '/' + finalFileName);
                fs.writeFileSync(directory + '/' + finalFileName, str);
            } catch (err) {
                console.error(err)
                exit();
            }
        }
        var totalPercentage = percentCalc(totalBefore, totalAfter);
        finalReadOut(filenames, y, totalTime, totalBefore, totalAfter, totalPercentage);
    }
}

finalReadOut = (filename, directory, time, before, after, percentage, str) =>{
    console.log(filename);
    if (fileOrDirectory === 'file'){
        console.log(`Minification complete after ${Math.round(100*time)/100} milliseconds.`);
        console.log('size BEFORE: ' + before);
        console.log('size AFTER: ' + after);
        console.log('Minification resulted in: ' + percentage + '.');
        console.log('********************************************');
        try {
            let newFileArr = filename.split(".");
            newFileArr.splice(newFileArr.length - 1, 0, '.min.');
            var finalFileName = newFileArr.join("");
            console.log('New file saved and can be found in: ' + finalFileName);
            fs.writeFileSync(directory + '/' + finalFileName, str)
            exit();
            //file written successfully
        } catch (err) {
            console.error(err)
            exit();
        }
    } else {
        var filesString;
        if (filename.length === 0){
            filesString = 'NO FILES FOUND';
        } else if (filename.length === 2){
            filesString = filename.join(" and ");
        } else {
            filesString = filename.join(", ");
        }
        console.log(`Minification complete after ${Math.round(100*time)/100} milliseconds.`);
        console.log('Files minified: ' + filesString);
        console.log('size of all combined files BEFORE: ' + before);
        console.log('size of all combined files AFTER: ' + after);
        console.log('Minification resulted in: ' + percentage + ' combined across all files!');
        console.log('********************************************');
        console.log('New files saved and can be found in: ' + directory);
        exit();
    }
};

regexAndSemiColons = (str) => {

    var notAtEnd = ['{', '(', ',', ';', ':', '?', '+', '-', '*', '/','&', '|', '`'];

    // .replace(/(?!\B"[^"]*)(\/)\/.*(?![^"]*"\B)/g, " ") // for removing comments.
    //.replace(/(?!\B"[^"]*)console.log\(([^)]+)\)(?![^"]*"\B)/igm, " "));

    // exit();

    //remove all debuggers and console.logs
    var newStr  = str.replace(/((?:^|[^\/])(?:\\{2})*"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*')|\bdebugger\b/g, '$1')
    debugger
        newStr = newStr.replace(/(?!\B"[^"]*)console.log\(([^)]+)\)(?![^"]*"\B)/igm, " ")
    var strArr = newStr.replace(/((?:^|[^\/])(?:\\{2})*"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*')|(\/\/.*)/g, '$1').replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/)
    /*use regex to remove '//...' (comment), '\r\n' and '\n' (line breaks), and replace with '\r'. Then split it at every new line break.*/
    // var strArr = newStr.replace(/(\/\/.*)+(?=([^"]*"[^"]*")*[^"]*$)/g,"").replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);

    //(\/)+(?=([^"]*"[^"]*")*[^"]*$)

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

percentCalc = (a, b)=>{
    var diff = a - b;
    var percentage;
    if (diff > 0){
        percentage = `${Math.round((diff / a)*100)}% content size DECREASE`
    } else {
        percentage = `${Math.round((diff / b)*100)}% content size INCREASE. Original file preserved`
    }
    return percentage;
};

const exit = () =>{
    console.log("Goodbye.");
    answers = 0;
    process.exit();
};


init();

// var isFile = fs.existsSync(data.trim()) && fs.lstatSync(data.trim()).isFile();

