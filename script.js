const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Sample baud rate options
const baudRates = [9600, 115200];

app.post('/upload', upload.single('program'), (req, res) => {
    const uploadedFile = req.file;
    const comPort = req.body.comPort; // Assuming comPort is part of the form data
    const baudRate = req.body.baudRate; // Assuming baudRate is part of the form data

    // Call Arduino CLI or IDE to upload the program with selected COM port and baud rate
    exec(`arduino-cli upload -b arduino:avr:uno -p ${comPort} -u --upload-port=${comPort} --upload-baud=${baudRate} ${uploadedFile.path}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send('Error uploading program');
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.status(500).send('Error uploading program');
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.send('Program uploaded successfully!');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
