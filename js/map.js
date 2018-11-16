function makeChart(dataset) {
  let w = 700;
  let h = 350;

  let tooltip = d3.select("body").append("div").attr('id', 'tooltip').style("opacity", 0);
  
  let chart = d3.select('#mapchart')
    .attr('width', w)
    .attr('height', h);

  //Define a map projection
  let projection = d3.geoAlbersUsa()
    .translate([w / 2, h / 2])
    .scale(700);

  //Define a path generator using the projection
  let path = d3.geoPath()
    .projection(projection);


  //Bind data and create one path per GeoJSON feature
  chart.selectAll("path")
    .data(dataset.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style('stroke', "#2c7fb8")
    .style("fill", "green")
//    .on('mousemove', function (d) {
//
//			d3.select(this)
//				.transition("fill")
//				.duration(250)
//				.style('fill', '#efa38c')
//				.style('cursor', 'pointer');
//
//			tooltip
//				.style('left', (d3.event.pageX) - 50 + "px")
//				.style('top', (d3.event.pageY) - 40 + "px")
//				.text("Tips: $" + d.properties.value.toLocaleString())
//				.transition("tooltip")
//				.duration(200)
//				.style("opacity", .8);
//		})
//		.on('mouseout', function (d) {
//			d3.select(this)
//				.transition("fill")
//				.duration(250);
//				//.style('fill', "")
//
//			tooltip
//				.transition("tooltip")
//				.duration(500)
//				.style("opacity", 0);
//		});
}


window.onload = function () {
//  d3.csv('../datasets/tips.csv')
//    .then(data => {

      d3.json('../datasets/us-states.json')
        .then(json => {

          

          console.log(json);
          makeChart(json);
        })
    //})
  chartlink();
}