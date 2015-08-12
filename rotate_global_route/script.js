var width = 960,
  height = 960,
  speed = -1e-2,
  start = Date.now();

var places = {
  HNL: [-157 - 55 / 60 - 21 / 3600, 21 + 19 / 60 + 07 / 3600],
  HKG: [113 + 54 / 60 + 53 / 3600, 22 + 18 / 60 + 32 / 3600],
  SVO: [37 + 24 / 60 + 53 / 3600, 55 + 58 / 60 + 22 / 3600],
  HAV: [-82 - 24 / 60 - 33 / 3600, 22 + 59 / 60 + 21 / 3600],
  CCS: [-66 - 59 / 60 - 26 / 3600, 10 + 36 / 60 + 11 / 3600],
  UIO: [-78 - 21 / 60 - 31 / 3600, 0 + 06 / 60 + 48 / 3600]
};


var route = {
  type: "LineString",
  coordinates: [
    places.HNL,
    places.HKG,
    places.SVO,
    places.HAV,
    places.CCS,
    places.UIO
  ]
};

var sphere = {
  type: "Sphere"
};

var projection = d3.geo.orthographic()
  .scale(width / 2.1)
  .translate([width / 2, height / 2])
  .precision(.5);


var graticule = d3.geo.graticule();

var canvas = d3.select("body").append("canvas")
  .attr("width", width)
  .attr("height", height);
var context = canvas.node().getContext("2d");

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);



svg.append('rect')
  .attr('class', 'overlay')
  .attr('width', width)
  .attr('height', height)
  .attr("fill", "black");

var target = svg.append("g")
  .attr("class", "target")
  .append("circle")
  .attr("cx", 25)
  .attr("cy", 25)
  .attr("r", 10)
  .style("display", "none");

var path = d3.geo.path()
  .projection(projection)
  .context(context);

var patho = d3.geo.path()
  .projection(projection);


var myroute = svg.append("path")
  .datum(route)
  .attr("class", "route")
  .attr("d", patho);

var CuRoute = svg.append("path") //current route
      .attr("class", "curroute")

var point = svg.append("g")
  .attr("class", "points")
  .selectAll("g")
  .data(d3.entries(places))
  .enter().append("g")
  .attr("transform", function(d) {
    return "translate(" + projection(d.value) + ")";
  });

var track = svg.append("g")
  .append("circle")
  .attr("class", "track")
  .attr("r", 6)
  .attr("fill", "rgba(206, 18, 18, 0.4)")
  .attr("stroke", "#ce1212")
  .attr("stroke-width", "3px")
  .attr("transform", "translate(100,100)");



point.append("circle") //show circle on each point
  .attr("r", 4.5);

point.append("text") //show text on each point
  .attr("y", 10)
  .attr("dy", ".71em")
  .text(function(d) {
    return d.key;
  });

var getNode = function(placeList, i) { //get the certain node from the place list
  var item = 0;
  var node = null
  for (k in places) {

    if (item === i) {
      node = places[k];
      break;
    }
    item++;

  }
  return node;
}


var nodeNum = route.coordinates.length //the total number of nodes
var nowNum = 0; //current node to target to
var oneMove = 40; //the interval for each focus
var count = 0; //to measure the interval


var lat_old = 0;
var lng_old = 0;
var lat = 0;
var lng = 0;

lat_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[0];
lng_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[1];

//the target of this move
lat = getNode(places, nowNum)[0];
lng = getNode(places, nowNum)[1];



d3.json("http://bl.ocks.org/mbostock/raw/4090846/world-110m.json", function(error, topo) {
  if (error) throw error;

  var land = topojson.feature(topo, topo.objects.land),
    grid = graticule();


  var startN = null; //the starting point of the path
  for (k in places) {
    startN = places[k];
    break;
  }
  var endN = null; //the end point of the path
  for (k in places) {
    endN = places[k];
  }



  d3.timer(function() {
    count += 0.5;
    var timephase = count % oneMove; //the current phase of this move
    var phasePercentage = timephase / oneMove; //the completion percentage of the current move

    context.clearRect(0, 0, width, height);

    if (phasePercentage === 0) { //one move is finished, start the next one

      nowNum = nowNum + 1;
      nowNum = nowNum % nodeNum;
    }

    lat_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[0];
    lng_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[1];

    //the target of this move
    lat = getNode(places, nowNum)[0];
    lng = getNode(places, nowNum)[1];

    var interPt = function(ptA, ptB, t) {
      //the the interval point between point A and point B, at the t position
      //solve the problem of cross the zero lat line
      var x = null;
      var y = (ptB[1] - ptA[1]) * t + ptA[1];

      if (ptA[0] >= 0 && ptB[0] >= 0 || ptA[0] <= 0 && ptB[0] <= 0) {
        x = (ptB[0] - ptA[0]) * t + ptA[0];
      } else if (Math.abs(ptA[0] - ptB[0]) < 180) {
        x = (ptB[0] - ptA[0]) * t + ptA[0];
      } else {
        x = ((ptB[0] + 360) % 360 - (ptA[0] + 360) % 360) * t + (ptA[0] + 360) % 360;
      }
      return [x, y];
    }

    //console.log(phasePercentage);
    var intertarget = interPt([lat_old, lng_old], [lat, lng], phasePercentage);

    target /*.transition()*/
      .attr("cx", intertarget[0])
      .attr("cy", intertarget[1]);



    //change the projection based on rotate value
    //projection.rotate([speed * (Date.now() - start), -15]).clipAngle(90);
    projection.rotate([-target.attr("cx"), -target.attr("cy")]).clipAngle(90);


    patho = d3.geo.path().projection(projection); //rotate the path
    var myD = patho(route); //redo the projection

    myroute //reset the route drawn on the map
      .attr("class", "route")
      .attr("d", myD);



    curData = {
        type: "LineString",
        coordinates: []
        
      }
    curData.coordinates.push([lat_old, lng_old]);
    curData.coordinates.push([lat, lng]);


    CuRoute//current route
      .datum(curData)
      .attr("class", "curroute")
      .attr("d", patho);

    console.log("-------------");
    console.log(phasePercentage);
    track.transition()
      .attrTween("transform", translateAlong(CuRoute.node(),phasePercentage));

    point.attr("transform", function(d) { //rotate the nodes
      return "translate(" + projection(d.value) + ")";
    });



    context.beginPath(); //draw the outbound of the sphere
    path(sphere);
    context.lineWidth = 3;
    context.strokeStyle = "#000";
    context.stroke();
    context.fillStyle = "#131a1b";
    context.fill();

    projection.clipAngle(180); //clip the grid and land, 180 means no clipping

    context.beginPath();
    path(land);
    context.fillStyle = "#0d0d08";
    context.fill();

    context.beginPath();
    path(grid);
    context.lineWidth = .5;
    context.strokeStyle = "rgba(119,119,119,.5)";
    context.stroke();

    projection.clipAngle(90); //clip the back half of the land

    context.beginPath();
    path(land);
    context.fillStyle = "#616161";
    context.fill();
    context.lineWidth = .5;
    context.strokeStyle = "#000";
    context.stroke();

    projection.clipAngle(0); //clip the back half of the land

  });
});

function translateAlong(path,m) {
  var l = path.getTotalLength();
  
  return function(i) {
    return function(t) {
      console.log(m);
      var p = path.getPointAtLength(m * l);
      return "translate(" + p.x + "," + p.y + ")"; //Move marker
    }
  }
}


d3.select(self.frameElement).style("height", height + "px");