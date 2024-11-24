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

const line_charts = [
      {
          type: 'line',   // for line chart
          data: {
              labels: ["-50 min", "-40 min", "-30 min", "-20 min", "-10 min", "Now"],
              datasets: [{
                  label: "Temperature Last Hour",
                  data: [20, 21, 22, 22, 21, 20],
                  fill: false,
                  borderColor: ['rgb(51, 204, 204)'],
                  borderWidth: 1,
                  xAxisID: 'Time' //define top or bottom axis ,modifies on scale
              }
              ],

          },
          options: {
              scales: {
                  y: {
                      suggestedMin: 10,
                      suggestedMax: 30,
                  }
              }
          }
      },

      {
          type: 'line',   // for line chart
          data: {
              labels: ["0:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
              datasets: [{
                  label: "Temperature Last Day",
                  data: [18, 20, 21, 22, 22, 20],
                  fill: false,
                  borderColor: ['rgb(51, 204, 204)'],
                  borderWidth: 1,
                  xAxisID: 'Time' //define top or bottom axis ,modifies on scale
              }
              ],

          },
          options: {
              scales: {
                  y: {
                      suggestedMin: 10,
                      suggestedMax: 30,
                  }
              }
          }
      },

      {
        type: 'line',   // for line chart
        data: {
            labels: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"],
            datasets: [{
                label: "AVG Temperature Last Week",
                data: [20, 21, 19, 18, 22, 23, 20],
                fill: false,
                borderColor: ['rgb(51, 204, 204)'],
                borderWidth: 1,
                xAxisID: 'Day' //define top or bottom axis ,modifies on scale
            }
            ],

        },
        options: {
            scales: {
                y: {
                    suggestedMin: 10,
                    suggestedMax: 30,
                }
            }
        }
      }
    ]

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

app.get('/api/tempgraph', async (req, res) => {
    const jsonData = status;
    console.log("GET received with req ", req.query);

    

    // Setting the headers
    res.writeHead(200, {
      "Content-Type": "image/png"
    });

    // generate and save the chart in PNG format

    let base64Data = await getChart(0,req.query?.timespan);

    res.end(base64Data, 'base64');

  })
  

// POST request handler for the /api/descriptor endpoint
app.post('/api/status', async (req, res) => {
  const newStatus = req.body;
  console.log("POST received with: ", newStatus);
  
  await fs.writeFile('./status.json', JSON.stringify(newStatus.status, null, 2), 'utf8', (err) => {
      if (err) {
          res.status(500).json({ error: 'Failed to write file' });
          return;
      }
      res.status(200).json({ message: 'Status saved successfully' });
  });

  // update the status object
  status = newStatus.status;
});

const getChart = async (zone, timespan) => {
  
  const width = 400; //px
  const height = 400; //px
  const backgroundColour = 'white'; 
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

  console.log("Generating chart for zone ", zone, " timespan ", timespan);

  const dataUrl = await chartJSNodeCanvas.renderToDataURL( line_charts[timespan?timespan:0]);
  const base64Image = dataUrl;

  var base64Data = base64Image.replace(/^data:image\/png;base64,/, "");

  fs.writeFile("out.png", base64Data, 'base64', function (err) {
        if (err) {
            console.log(err);
        }
    }); 

  return base64Data;

}


// Start the server

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const port = 3001; // or any other port number you prefer
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


