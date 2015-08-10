var width = 400,
    height = 400,
    radius = 200
    colors = d3.scale.category20c();

var piedata = [
    {
        label: "Barot",
        value: 10
    },{
        label: "Gerard",
        value: 10
    },{
        label: "Jennifer",
        value: 50
    }
]

var pie = d3.layout.pie()
    .value(function(d) {
        return d.value;
    })

var arc = d3.svg.arc()
    .outerRadius(radius)

var myChart = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate('+(width-radius)+','+(height-radius)+')')
    .selectAll('path').data(pie(piedata))
    .enter().append('path')
        .attr('fill', function(d, i) {
            return colors(i);
        })
        .attr('d', arc)







