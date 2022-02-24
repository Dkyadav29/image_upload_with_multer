const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
let fs = require('fs');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload that mean image formate and size 
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only......!');
    }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No File Selected....!'
                });
            } else {
                res.render('index', {
                    msg: 'File Uploaded..!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }

    });
});


// app.delete('/delete/:files', (req, res, next) => {
//     const deletefile = 'public/uploads/' + req.params.file;
//     fs.unlink(deletefile, (err) => {
//         if (err) { return err }
//         fs.readdir('public/uploads', (err, files) => {
//             res.send(req.params.file + ' is Deleted')
//         })
//     })
// })
// delete file in multer 
app.delete('/delete/:file', (req, res, next) => {
    const deletefile = 'public/uploads/' + req.params.file;
    fs.unlink(deletefile, (err) => {
        if (err) { return err }
        fs.readdir('/public/uploads', (err, files) => {
            res.send(req.params.file + ' is Deleted')
        })
    })
})

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
