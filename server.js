const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

var status = {
  zones: [
    {
      id: 0, 
      name: "Nappali",
      status: "OK",
    },
    { 
      id: 1,
      name: "Konyha",
      status: "OK",
    }
  ]
}


// This code sets up a GET request handler for the /api/descriptor endpoint, 
// and when accessed, it responds with a JSON object containing a message.

app.get('/', (req, res) => {
res.send('Hello Kincso, I am your API server')


})

app.get('/api/status', (req, res) => {
  res.send(status);
  console.log("GET received to send this status", status);
  })

/*

// POST request handler for the /api/descriptor endpoint
app.post('/api/status', (req, res) => {
  const newDescriptor = req.body;
  console.log("POST received to save this newDescriptor", newDescriptor);
  
  fs.writeFile('./descriptor.json', JSON.stringify(newDescriptor, null, 2), 'utf8', (err) => {
      if (err) {
          res.status(500).json({ error: 'Failed to write file' });
          return;
      }
      res.status(200).json({ message: 'Descriptor saved successfully' });
  });

  (newDescriptor.descriptor.task.value == 1) && generateRoomManagementConfig(newDescriptor);
  (newDescriptor.descriptor.task.value == 2) && generateCiscoConfig(newDescriptor);   
  (newDescriptor.descriptor.task.value == 5) && generateTouchpanelConfig(newDescriptor);

  if (newDescriptor.descriptor.ip_address !== "0.0.0.0") uploadConfig(newDescriptor.descriptor.ip_address, newDescriptor.descriptor.password, "Generated_Config.zip");
});

*/
// Start the server

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const port = 3001; // or any other port number you prefer
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


