let rawData = [];
let data = []
let max = 0;

let paused = false;

let zeroOffset = 0;
let rawZero = 0;
let tareValue = null;
let ratio = 1;

graphVisibility = document.getElementById("flexCheckDefault").checked;


const options = {
  clean: true,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: mqttUser,
  password: mqttPassword
}

const client = mqtt.connect(connectUrl, options)

client.on('connect', () => {
  console.log('connected')
  client.subscribe('reading')
})

client.on('reconnect', (error) => {
    console.log('reconnecting:', error)
})

client.on('error', (error) => {
    console.log('Connection failed:', error)
})

client.on('message', (topic, message) => {
  if(!paused){
  switch (topic) {
    case 'reading':
      let reading = JSON.parse(message.toString());
      rawData.push({x: reading.time, y: reading.data});
      data.push({x: (Math.round(reading.time / 10) / 100).toString(), y: (reading.data - zeroOffset) * ratio});
      if(graphVisibility){
        chart.data.datasets[0].data = data.slice(1, data.length);
        chart.update();
      }else{
        rawData = rawData.slice(rawData.length-100, rawData.length);
        data = data.slice(data.length-100, data.length);
      }
      (data[data.length - 1].y > max) ? max = data[data.length - 1].y : max = max;
      document.getElementById("display").innerHTML = "Current: " + Math.round(data[data.length - 1].y) + "g";
      document.getElementById("max").innerHTML = "Max: " + Math.round(max) + "g";
      break;
  }
}
})

const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    label: "Measurement",
    datasets: [{
      fill: false,
      label: "Measurement",
      borderColor: "#007bff",
      pointHoverBackgroundColor: "#55bae7",
      pointHoverBorderColor: "#55bae7",
      data: []
    }],
  },
  options: {
    animation:false,
    maintainAspectRatio: false
  }
});

function reset(){
  rawData = [];
  data = [];
  max = 0;
  chart.data.datasets[0].data = data;
  chart.update();
}

function zero(){
  zeroOffset = rawData[rawData.length - 1].y;
  max = 0;
  return zeroOffset;
}

function tare(){
  tareValue = zero();
  rawZero = rawData[rawData.length - 1].y;
}

function calibrate(){
  if(tareValue == null){
    console.log("Please tare the scale first!");
  } else {
    let inputWeight = document.getElementById("inputWeight").value;
    if(inputWeight == ""){
      console.log("Please enter a weight!");
    } else {
      ratio = inputWeight / (rawData[rawData.length-1].y - zeroOffset);
      console.log("Ratio: " + ratio);
    }
  }
}

function enableGraph(){
  if(document.getElementById("flexCheckDefault").checked){
    graphVisibility = true;
    document.getElementById("chartContainer").style.display = "block";
    rawData = [];
  } else {
    graphVisibility = false;
    document.getElementById("chartContainer").style.display = "none";
  }
}

function exp(){
  let dataStr = JSON.stringify({"rawData": rawData, "data": data, "max": max, "zeroOffset": zeroOffset, "rawZero": rawZero, "tareValue": tareValue, "ratio": ratio});
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  let exportFileDefaultName = 'data.json';

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function pause(){
  if(paused){
    paused = false;
    document.getElementById("pause").innerHTML = "Pause";
  } else {
    paused = true;
    document.getElementById("pause").innerHTML = "Resume";
  }
}