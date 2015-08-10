var myStyles = [
  { width: 200,
    color: '#A57706'},
  { width: 230,
    color: '#BD3613'},
  { width: 220,
    color: '#D11C24'},
  { width: 290,
    color: '#C61C6F'},
  { width: 236,
    color: '#595AB7'},
  { width: 230,
    color: '#2176C7'}
];

d3.selectAll('.item')
  .data(myStyles)
  .style({
    'color': 'white',
    'background' : function(d) {
      return d.color;
    },
    width : function(d) {
      return d.width + 'px';
    } 
  })