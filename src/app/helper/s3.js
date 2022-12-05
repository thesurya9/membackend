'use strict';
const moment = require('moment');
const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

module.exports = {
     upload: ({file, filename}) => {
       return new Promise(function (resolve, reject) {
            let imageBinary = file;
            const ts_hms = new Date();
            let fileName = moment(ts_hms).format("yyyyMMddHHmmssSSS");
          let s3Bucket = new AWS.S3( { params: {Bucket: process.env.BUCKET_NAME} } );

          let buf = Buffer.from(imageBinary.split(';base64,').pop(),'base64');
          filename = `${filename}_${fileName}`;
          let data = {
            Key: filename, 
            ACL: 'public-read',
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
          };
          s3Bucket.putObject(data, function(err, data){
              if (err) { 
                console.log('Error uploading data: ', err); 
                   reject(err);
              } else {
                console.log('successfully uploaded the image!', data);
                 resolve(`https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${filename}`);
              }
          });
            
       });
      }
};
