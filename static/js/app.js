// Use the D3 library to read in samples.json from the URL 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
    console.log(data);
});

function init() {
    let dropDownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        let names = data.names;
        names.forEach((id) => {
            console.log(id);
            dropDownMenu.append("option")
            .text(id)
            .property("value", id);
        });
        let sample_one = names[0];
        console.log(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildMetaData(sample_one);
    });
};
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function buildBarChart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];
        let sample_values = valueData.sample_values;
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        console.log(otu_ids, otu_labels, sample_values);
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };
        let layout = {
            title: "Top 10 OTUs"
        }
        Plotly.newPlot("bar", [trace], layout)
    });
};
// Create a bubble chart that displays each sample.
function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];
        let otu_ids = valueData.otu_ids;
        let sample_values = valueData.sample_values;
        let otu_labels = valueData.otu_labels;
        console.log(otu_ids, otu_labels, sample_values);
        let trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title:"OTU ID"},
        };
        Plotly.newPlot("bubble", [trace], layout)
    });
};
// Display the sample metadata, i.e., an individual's demographic information.
function buildMetaData(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        console.log(value)
        let valueData = value[0];
        d3.select("#sample-metadata").html("");
        Object.entries(valueData).forEach(([key, value]) => {
            console.log(key, value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Update all the plots when a new sample is selected. Additionally, you are welcome to create any layout that you would like for your dashboard.
function optionChanged(value) {
    console.log(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildMetaData(value);
};
// Deploy your app to a free static page hosting service, such as GitHub Pages. Submit the links to your deployment and your GitHub repo.
init();