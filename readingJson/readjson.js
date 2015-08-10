var width = 960,
  height = 500;

var chart = d3.select(".chart")
  .attr("width", width)
  .attr("height", height)
  .attr("style", "background: #dff0f6");

d3.csv("https://raw.githubusercontent.com/panthersuper/d3learning/master/readingCSV/pline.csv", type, function(data) {
  //data is numbered by the row number... 
  //head is not counted as a row.
  //each item in the data list is a dictionary, key is indicated by the head

  console.log(data[0]);

});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}