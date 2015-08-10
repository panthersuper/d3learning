var width = 960,
  height = 500;

var chart = d3.select(".chart")
  .attr("width", width)
  .attr("height", height)
  .attr("style", "background: #dff0f6");



console.log("running");
ptList = []; //list to save the data
d3.json("https://raw.githubusercontent.com/panthersuper/d3learning/master/readingJson/path.json", function(data) {

  lst = data["features"]

  for (key in lst) {//the way to extract x,y may be different for each json format
    var x = lst[key].geometry.coordinates[0];
    var y = lst[key].geometry.coordinates[1];

    ptList.push({//push point item to the list
        "x": x,
        "y": y
      }

    );
  }

  lineFunction = d3.svg.line()//line function to generate path code
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
    .interpolate("linear");


  scaleX = d3.scale.linear()
    .domain([d3.min(ptList, function(d) {
      return d.x
    }), d3.max(ptList, function(d) {
      return d.x
    })])
    .range([0, width]);
  scaleY = d3.scale.linear()
    .domain([d3.min(ptList, function(d) {
      return d.y
    }), d3.max(ptList, function(d) {
      return d.y
    })])
    .range([height, 0]);



  console.log(ptList, function(d) {
      return d.y
    });

scaledpt = []

  for(k in ptList){

scaledpt.push(
{
        "x": scaleX(ptList[k].x),
        "y": scaleY(ptList[k].y)
      }

  );

  }

  var lineGraph = chart.append("path")
    .attr("d", lineFunction(scaledpt))
    .attr("stroke", "#8ac9e0")
    .attr("stroke-width", 2)
    .attr("fill", "none");

});