import "./styles.css";
import * as d3 from "d3";
// https://www.d3-graph-gallery.com/graph/choropleth_basic.html

///--- bar chart ----//

var barmargin = { top: 20, right: 20, bottom: 30, left: 60 },
  barwidth = 780 - barmargin.left - barmargin.right,
  barheight = 250 - barmargin.top - barmargin.bottom;

// set the ranges
var barx = d3.scaleBand().range([0, barwidth]).padding(0.1);
var bary = d3.scaleLinear().range([barheight, 0]);

var barsvg = d3
  .select("#pie_chart")
  .append("svg")
  .attr("width", barwidth + barmargin.left + barmargin.right)
  .attr("height", barheight + barmargin.top + barmargin.bottom)
  .append("g")
  .attr("transform", "translate(" + barmargin.left + "," + barmargin.top + ")");

// get data
d3.csv("totals.csv").then(function (data) {
  data.forEach(function (d) {
    d.num = +d.num;
  });

  // Scale
  barx.domain(
    data.map(function (d) {
      return d.Demo;
    })
  );
  bary.domain([0, 3200596]);

  // rectangles for the bar chart
  barsvg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return barx(d.Demo);
    })
    .attr("width", barx.bandwidth())
    .attr("y", function (d) {
      return bary(d.Num);
    })
    .attr("height", function (d) {
      return barheight - bary(d.Num);
    })
    .attr("fill", "#4db383");

  // x Axis
  barsvg
    .append("g")
    .attr("transform", "translate(0," + barheight + ")")
    .call(d3.axisBottom(barx));

  //  y Axis
  barsvg.append("g").call(d3.axisLeft(bary));
});

/// map //
// The svg
var svg = d3.select("#map"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var projection = d3
  .geoMercator()
  .translate([width / 2, height / 2])
  .scale(450)
  .center([-98.8, 33]);

//Data and color scale
// var data = d3.map();

var colors = d3
  .scaleQuantize()
  .domain([0, 5])
  .range(["#edf8fb", "#b2e2e2", "#66c2a4", "#238b45"]);

  console.log(colors);
var statesMap = d3.json("./data/USA.geojson");
var statesData = d3.csv("./data/FarmerDemographic.csv");
var path = d3.geoPath().projection(projection);

Promise.all([statesMap, statesData]).then((res) => {
  //console.log(res[0]);
  console.log(res[1]);
  svg
    .append("g")
    .selectAll("path")
    .data(res[0].features)
    .enter()
    .append("path")
    .attr("class", (d) => {
      let demo = res[1].find((el) => el.NAME === d.properties.NAME);
      return +demo?.PecentBlack > 1 ? "state tex" : "state";
    }) //state
    .attr("d", path)
    .attr("stroke", "black")
    .attr("stroke-width", ".5px")
    .attr("fill", (d) => {
      let demo = res[1].find((el) => el.NAME === d.properties.NAME);
      return colors(+demo?.PecentBlack); //Missing Puerto Rico & District of Colombia
    }); console.log(colors(res[0].features));
});
//map legend//

var Lsvg = d3.select("#legend");
let size = 30;
let text = 70;

Lsvg.append("rect")
  .attr("x", 35)
  .attr("y", 20)
  .attr("width", size)
  .attr("height", size)
  .style("fill", "#edf8fb")
  .style("stroke", "black");
Lsvg.append("rect")
  .attr("x", 35)
  .attr("y", 55)
  .attr("width", size)
  .attr("height", size)
  .style("fill", "#b2e2e2")
  .style("stroke", "black");
Lsvg.append("rect")
  .attr("x", 35)
  .attr("y", 90)
  .attr("width", size)
  .attr("height", size)
  .style("fill", "#66c2a4")
  .style("stroke", "black");
Lsvg.append("rect")
  .attr("x", 35)
  .attr("y", 125)
  .attr("width", size)
  .attr("height", size)
  .style("fill", "#238b45")
  .style("stroke", "black");
Lsvg.append("text")
  .attr("x", text)
  .attr("y", 35)
  .text("below 1.25%")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle");
Lsvg.append("text")
  .attr("x", text)
  .attr("y", 70)
  .text("1.26% - 2.51%")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle");
Lsvg.append("text")
  .attr("x", text)
  .attr("y", 105)
  .text("2.52 - 3.77")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle");
Lsvg.append("text")
  .attr("x", text)
  .attr("y", 140)
  .text("above 3.77%")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle");

