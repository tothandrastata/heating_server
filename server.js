const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { get } = require('http');


app.use(cors()); // Enable CORS for all routes (for successful localhost fetch in React)
app.use(express.json()); // Middleware to parse JSON bodies

var  status = {
  zones: [
    {
      id: 0, 
      name: "Nappali",
      room_temp: 22,
      temp_on: 20,    
      temp_off: 25
    },
    { 
      id: 1,
      name: "Konyha",
      room_temp: 23,
      temp_on: 20,
      temp_off: 25
    }
  ]
}

const width = 400; //px
const height = 400; //px
const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

const line_chart = {
    type: 'line',   // for line chart
    data: {
        labels: [2018, 2019, 2020, 2021],
        datasets: [{
            label: "Sample 1",
            data: [10, 15, -20, 15],
            fill: false,
            borderColor: ['rgb(51, 204, 204)'],
            borderWidth: 1,
            xAxisID: 'xAxis1' //define top or bottom axis ,modifies on scale
        },
        {
            label: "Sample 2",
            data: [10, 30, 20, 10],
            fill: false,
            borderColor: ['rgb(255, 102, 255)'],
            borderWidth: 1,
            xAxisID: 'xAxis1'
        },
        ],

    },
    options: {
        scales: {
            y: {
                suggestedMin: 0,
            }
        }
    }
}

// This code sets up a GET request handler for the /api/descriptor endpoint, 
// and when accessed, it responds with a JSON object containing a message.

app.get('/', (req, res) => {
res.send('Hello Kincso, I am your API server')


})

app.get('/api/status', (req, res) => {
  const jsonData = status;
  console.log("GET received to send this status", JSON.stringify(jsonData, null, 2));
  res.json(jsonData);
  })

app.get('/api/tempgraph', (req, res) => {
    const jsonData = status;
    console.log("GET received with req ", req.query);
    res.json({});
    })
  


// POST request handler for the /api/descriptor endpoint
app.post('/api/status', (req, res) => {
  const newStatus = req.body;
  console.log("POST received with: ", newStatus);
  
  fs.writeFile('./status.json', JSON.stringify(newStatus.status, null, 2), 'utf8', (err) => {
      if (err) {
          res.status(500).json({ error: 'Failed to write file' });
          return;
      }
      res.status(200).json({ message: 'Status saved successfully' });
  });

  // update the status object
  status = newStatus.status;
});

const getChart = async () => {
  
  const width = 400; //px
  const height = 400; //px
  const backgroundColour = 'white'; 
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

  const dataUrl = await chartJSNodeCanvas.renderToDataURL(line_chart);
  const base64Image = dataUrl;

  var base64Data = base64Image.replace(/^data:image\/png;base64,/, "");


  fs.writeFile("out.png", base64Data, 'base64', function (err) {
        if (err) {
            console.log(err);
        }
    }); 
}


// Start the server

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

getChart();

const port = 3001; // or any other port number you prefer
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


