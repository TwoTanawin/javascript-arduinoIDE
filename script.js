const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const prompt = require('prompt');
const fs = require('fs');

// Function to prompt the user to select port and baud rate
function selectPortAndBaudRate() {
    prompt.start();

    prompt.get(['port', 'baudRate'], function (err, result) {
        if (err) { return onErr(err); }
        console.log('Selected port:', result.port);
        console.log('Selected baud rate:', result.baudRate);
        connectToArduino(result.port, parseInt(result.baudRate, 10));
    });
}

// Function to connect to Arduino with the selected port and baud rate
function connectToArduino(portName, baudRate) {
    const port = new SerialPort(portName, { baudRate: baudRate });
    const parser = new Readline();
    port.pipe(parser);

    port.on('open', function() {
        console.log('Connected to Arduino on port ' + portName + ' at baud rate ' + baudRate);
        uploadProgram(port);
    });

    parser.on('data', function(data) {
        console.log('Received data from Arduino:', data);
        // Handle data received from Arduino
    });

    // Handle errors
    port.on('error', function(err) {
        console.error('Error:', err.message);
    });
}

// Function to upload a program to Arduino
function uploadProgram(port) {
    prompt.get(['filePath'], function (err, result) {
        if (err) { return onErr(err); }
        const filePath = result.filePath;
        
        fs.readFile(filePath, 'utf8', function(err, data) {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            
            port.write(data, function(err) {
                if (err) {
                    console.error('Error uploading program:', err);
                } else {
                    console.log('Program uploaded successfully.');
                }
            });
        });
    });
}

// Error handler for prompt
function onErr(err) {
    console.error(err);
    return 1;
}

// Start the port selection process
selectPortAndBaudRate();
