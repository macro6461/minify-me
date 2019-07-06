const fs = require("fs"),
    path = require("path");

const dir = path.resolve(__dirname);

var standard_input = process.stdin;

standard_input.setEncoding('utf-8');

const generalInfo = "\n***********************\n\nPlease type a JavaScript file name, including the file extension, or directory you'd like to minify. If file is in nested directories, type out full path including file name and extension. If directory is nested, please specify full path. \nAn example directory would be '/project_directory/assets/javascript_files'. \nAn example file would be 'index.js' or '/project_directory/assets/javascript_files/index.js'.  \nType exit to leave.\n\n***********************\n";

const generalSmallInfo = "\n***********************\n\nPlease type 'file' or 'directory'. \nType exit to leave.\n\n***********************\n";

const init = () => {
    console.log(generalSmallInfo);

    standard_input.on('data', (data)=> {

        if (data.trim() === 'exit') {
            exit();
        } else if (data.trim() === 'file'){
            fileDetection()
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

const fileDetection = () =>{
    console.log("Please type the name of the JavaScript file, including '.js' or '.jsx', you would like to minify.\nIf it is in a directory/nested directory, please type full path ahead of file name.");
    standard_input.on('data', (data)=> {

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

function minify(data){
    //remove all debuggers
    //remove whitespace between everything that isn't a variable or function declaration...
    //...which means leave space between 'var', 'let', 'const', 'function'
    //still needs ; after functions, and added event listeners.
    const {filename, directory, content} = data;
    console.log(content.length);
    console.log('********************************************');
    console.log(`${filename} is being minified.`);
    var str = `${content}`;
    var finalContent = str.split("debugger").join("").replace(/\s+/g, ' ');
    console.log(finalContent.length);
    console.log(finalContent);
    console.log('Minification complete.');
    console.log('********************************************');
    try {
        let newFileArr = filename.split(".");
        newFileArr.splice(newFileArr.length - 1, 0, '.min.');
        var finalFileName = newFileArr.join("");
        console.log(finalFileName);
        fs.writeFileSync(directory + '/' + finalFileName, finalContent)
        //file written successfully
      } catch (err) {
        console.error(err)
      }
    exit();
};

const exit = () =>{
    console.log("Goodbye.");
    process.exit();
};


init();