
//Define variables for the samples.json data
var selTestSubjects = d3.select("#selDataset");
var testSubjectIds;
var samples;
var metadata;
//Read the json file for data
d3.json("./static/samples.json").then((data) => {
    testSubjectIds = data.names;
    samples = data.samples;
    metadata = data.metadata;
    fillSelectList(selTestSubjects, testSubjectIds);
    loadCurrentTestSubjectData();
    });

//Initializes the page on change
function init() {
  selTestSubjects.on("change", loadCurrentTestSubjectData);
  }
  //Functin to load the test subject chosen from the drop down menu
  function loadCurrentTestSubjectData() {
  //Assign the value of the dropdown menu option to a variable
  var selectedTestSubject = selTestSubjects.property("value");
  
  //Filter the sample data based on the selectedTestSubject value
  var testSubjectSample = samples.filter(samples => samples.id === selectedTestSubject);
  console.log(testSubjectSample); 

  //Define the variables needed for the bar and bubble charts
  sampleValues = testSubjectSample[0].sample_values;
  otu_ids = testSubjectSample[0].otu_ids;
  var otu_id_label = otu_ids.map(otu_id => 'OTU ' + otu_id + ` `);
  otu_labels = testSubjectSample[0].otu_labels;

  //Get the metadata and add to the Demographic Info
  var testSubjectMetadata = metadata.filter(metaDataRow => metaDataRow.id == selectedTestSubject);
  var testSubjectId = testSubjectMetadata[0].id;
  d3.select("#subjectId").text(`Test Subject Id: ` + testSubjectId);
  var testSubjectEthnicity = testSubjectMetadata[0].ethnicity;
  d3.select("#subjectEthnicity").text(`Ethnicity: ` + testSubjectEthnicity);
  var testSubjectGender = testSubjectMetadata[0].gender;
  d3.select("#subjectGender").text(`Gender: ` + testSubjectGender);
  var testSubjectAge = testSubjectMetadata[0].age;
  d3.select("#subjectAge").text(`Age: ` + testSubjectAge);
  var testSubjectLocation = testSubjectMetadata[0].location;
  d3.select("#subjectLocation").text(`Location: ` + testSubjectLocation);
  var testSubjectBBType = testSubjectMetadata[0].bbtype;
  d3.select("#subjectBBType").text(`Bellybutton Type: ` + testSubjectBBType);
  var testSubjectWashFrequency = testSubjectMetadata[0].wfreq;
  d3.select("#subjectWashFrequency").text(`Wash Frequency (per week): ` + testSubjectWashFrequency);

  //Define gauge chart: I found code to adapt to this problem on http://quabr.com/53211506/calculating-adjusting-the-needle-in-gauge-chart-plotly-js
  //I figured out the needle movement with the help of Sandhya and the help of this stackoverflow https://stackoverflow.com/questions/37454438/how-to-rotate-the-dial-in-a-gauge-chart-using-python-plotly
  var traceA = {
    type: "pie",
    showlegend: false,
    hole: 0.4,
    rotation: 90,
    values: [81 / 9, 81 / 9, 81 /9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81],
    text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
    direction: "clockwise",
    textinfo: "text",
    textposition: "inside",
    marker: {
      colors: ["rgba(255, 0, 0, 0.6)", "rgba(255, 165, 0, 0.6)", "rgba(255, 255, 0, 0.6)", "rgba(144, 238, 144, 0.6)", "rgba(154, 205, 50, 0.6)", "light blue", "light red", "light green", "light purple", "white"],
    },
  };
  var level = testSubjectWashFrequency *  19;
  var degrees = 180 - level;
  var radius = 0.2;
  var radians = (degrees * Math.PI) / 180;
  var x = 0.5 + (radius * Math.cos(radians));
  var y = 0.5 + (radius * Math.sin(radians));
   
  var layout3 = {
    shapes: [{
        type: 'line',
        x0: 0.5,
        y0: 0.5,
        x1: x,
        y1: y,
        line: {
          color: 'black',
          width: 3
        }
      }],
    title: 'Belly Button Washes per Week',
    xaxis: {visible: false, range: [-1, 1]},
    yaxis: {visible: false, range: [-1, 1]}
  };
   
  var data3 = [traceA];

Plotly.newPlot("gauge", data3, layout3);

  //Define bar chart:
  var trace1 = {
    x: sampleValues.slice(0,11),
    y: otu_id_label.slice(0,11),
    text: otu_labels.slice(0,11),
    type: 'bar',
    orientation: 'h', 
  };

  var data = [trace1];

  var layout = {
    title: `Top 10 OTUs for Test Subject ID; ${selectedTestSubject}`
  };
Plotly.newPlot("bar", data, layout)

  //Define bubble chart:
  var trace2 = {
    x: otu_ids,
    y: sampleValues,
    text: otu_labels,
    mode: 'markers',
    marker: {
      color: otu_ids,
      size: sampleValues
    }
  };
    var data2 = [trace2];

    var layout2 = {
      title: 'OTU',
      showlegend: false,
    };
Plotly.newPlot("bubble", data2, layout2)
}

//Append each item to the list:
function fillSelectList(element, list) {
  list.forEach(item => element.append('option').text(item));
}
init();

