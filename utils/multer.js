import multer from 'multer'
import path from 'path'
import crypto from 'crypto'


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images')
    },
    filename: function(req, file, cb){
        crypto.randomBytes.toString(12, (err, data)=>{
            cb(null, file.fieldname + "-"+ )
        })
    }
})