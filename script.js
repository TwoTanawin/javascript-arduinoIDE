const serialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// Change the serial port name as per your system configuration
const port = new serialPort('/dev/ttyUSB0', { baudRate: 9600 });

const parser = new Readline();
port.pipe(parser);

// Function to upload the file to Arduino
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function(event) {
        const fileContent = event.target.result;

        port.write(fileContent, function(err) {
            if (err) {
                document.getElementById('status').innerText = 'Error uploading file.';
            } else {
                document.getElementById('status').innerText = 'File uploaded successfully.';
            }
        });
    };

    reader.readAsText(file);
}
