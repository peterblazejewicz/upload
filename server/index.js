const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const app = express();

// default options
app.use(fileUpload());
var corsOptions = {
  origin: '*',
  // some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.post('/upload', function (req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  // let sampleFile = req.files.sampleFile;
  console.log(req.files);
  res.send('File uploaded!');
  // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv('/somewhere/on/your/server/filename.jpg', function (err) {
  //   if (err)
  //     return res.status(500).send(err);

  //   res.send('File uploaded!');
  // });
});
app.listen(3001, () => console.log('Example app listening on port 3001!'))
