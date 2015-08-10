var myStyles = [
  { width: 200,
    name: 'Barot Bellingham',
    color: '#A57706'},
  { width: 230,
    name: 'Hassum Harrod',
    color: '#BD3613'},
  { width: 220,
    name: 'Jennifer Jerome',
    color: '#D11C24'},
  { width: 290,
    name: 'Richard Tweed',
    color: '#C61C6F'},
  { width: 236,
    name: 'Lorenzo Garcia',
    color: '#595AB7'},
  { width: 230,
    name: 'Xhou Ta',
    color: '#2176C7'}
];

d3.selectAll('#chart').selectAll('div')
  .data(myStyles)
  .enter().append('div')
  .classed('item', true)
  .text(function(d) {
    return d.name;
  })
  .style({
    'color': 'white',
    'background' : function(d) {
      return d.color;
    },
    width : function(d) {
      return d.width + 'px';
    } 
  })