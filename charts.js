function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var ourSamples = data.samples; 
    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = ourSamples.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that filters the metadata array for the object with the desired sample number.
    resultArray = data.metadata.filter(metaObj => metaObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var sampleResult = sampleArray[0];
    // Create a variable that holds the first sample in the metadata array.
    result = resultArray[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleOids = sampleResult.otu_ids;
    var sampleOlabels = sampleResult.otu_labels;
    var sampleValues = sampleResult.sample_values;
    // Create a variable that holds the washing frequency.
    resultWfreq = parseFloat(result.wfreq);

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    
    let yticks = sampleOids.slice(0,10).reverse().map(oid => `OTU ${oid}`);
    
    
    
    // Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: sampleOlabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    console.log(barData)
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    console.log(barLayout);

    //in order to make the webpage dynamically sized, a useful tool for being used on mobile devices
    //https://plotly.com/javascript/responsive-fluid-layout/
    //the config variable was then added to all our charts

    var config = {responsive: true};
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar',barData,barLayout, config);
    // Create the trace for the bubble chart.
    var bubbleData = {
      x: sampleOids,
      y: sampleValues,
      text: sampleOlabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: sampleOids,
        colorscale: "Earth"
      }

    }
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    }

    
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',[bubbleData],bubbleLayout, config);
    // Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0,1],y: [0,1]},
      value: resultWfreq,
      type: "indicator",
      mode:"gauge+number",
      gauge: {
        axis: {range: [null,10]},
        steps: [
        { range: [0,2],color: "red"},
        { range: [2,4],color:"green"},
        { range: [4,6],color:"blue"},
        { range: [6,8],color:"purple"},
        { range: [8,10],color:"gold"}],
        bar: {color: "black"}
      }
    }];
    // Create the layout for the gauge chart.
    var gaugeLayout = {
      title: "Belly Button Washing Frequency<br><sub>Scrubs per Week"
    }

    // Use Plotly to plot the gauge data and layout.
    console.log(gaugeData);
    Plotly.newPlot('gauge',gaugeData, gaugeLayout, config);
  });
}
