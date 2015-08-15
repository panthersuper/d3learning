var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png', {
	attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});
var map = L.map('map')
	.addLayer(mapboxTiles)
	.setView([37.8, -96.9], 4);


var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	g = svg.append("g").attr("class", "leaflet-zoom-hide");

/*var svgast = d3.select("body").append("svg")
					.attr("class", "svgast")
					.attr("background", "rgba(0,0,0,0.5)")
					.attr("width", "960")
					.attr("height", "500")
					;*/

var mytxtbox = svg.append("rect")
				.attr("width", "100").attr("height", "20")
				.attr("fill","grba(255,255,255)")
				.attr("opacity", "0.1");
var mytext = svg.append("text")
				.attr("width", "100").attr("height", "20")
				.attr("fill","white")
				.attr("font-weight", "bold");

d3.json("http://bost.ocks.org/mike/leaflet/us-states.json", function(collection) {
	// code here
	console.log(collection);

	var transform = d3.geo.transform({//custom projection
			point: projectPoint
		}), //transfore from point to projected point
		path = d3.geo.path().projection(transform); //path generator, create a d3.geo.path to convert GeoJSON to SVG

	var feature = g.selectAll("path") //create path elements for each of the features using D3’s data join
		.data(collection.features)
		.enter().append("path");

	//feature.attr("d", path); //initialize the path data by setting the d attribute

	/*
The selection.attr method computes the path data for each feature. 
The path elements are bound to the associated GeoJSON feature, 
so these features are fed to the path generator (a d3.geo.path), 
which calls our custom projection, which in turn uses Leaflet’s projection. 
	*/

	//computing the projected bounding box of our features using our custom transform 
	//to convert the longitude and latitude to pixels
  // Reposition the SVG to cover the features.
   map.on("viewreset", reset);
   reset();

    feature.on("mouseover", 
   		function(d){
   			console.log(d.properties.name);
   			
   			var pos = d3.mouse(this);
   			console.log(pos);
    		
    		var bounds = path.bounds(collection),
        	topLeft = bounds[0],
        	bottomRight = bounds[1];
        	//move the popout box
   			mytext.attr("transform", "translate("+(pos[0]-topLeft[0]+50)+","+(pos[1]-topLeft[1]+50)+")")
   				.text(d.properties.name);
   			mytxtbox.attr("transform", "translate("+(pos[0]-topLeft[0]+40)+","+(pos[1]-topLeft[1]+35)+")");
   		}
   	);

    feature.on("mouseout", 
   		function(d){
   			console.log("out");
   		}
   	);



   function reset() {
    var bounds = path.bounds(collection),
        topLeft = bounds[0],
        bottomRight = bounds[1];

    //console.log(bottomRight[0] - topLeft[0]);
    svg .attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");

    g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

    feature.attr("d", path);
  }


	function projectPoint(x, y) {
		var point = map.latLngToLayerPoint(new L.LatLng(y, x));
		this.stream.point(point.x, point.y);
	}


});