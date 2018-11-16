let force;

function makeChart(dataset) {
  let w = 700;
  let h = 350;
  
  let tooltip = d3.select("body").append("div").attr('id', 'tooltip').style("opacity", 0);

  let chart = d3.select('#forcedchart')
    .attr('width', w)
    .attr('height', h);

  let linkTargetLength = 100;

  force = d3.forceSimulation(dataset.nodes)
    .force('charge', d3.forceManyBody())
    .force('link', d3.forceLink(dataset.edges)
      .distance(linkTargetLength))
    .force('center', d3.forceCenter()
      .x(w / 2)
      .y(h / 2));

  let edges = chart.selectAll('line')
    .data(dataset.edges)
    .enter()
    .append('line')
    .style('stroke', 'grey');

  let nodes = chart.selectAll('circle')
    .data(dataset.nodes)
    .enter()
    .append('circle')
    .attr('r', 20)
    .style('fill', (d, i) => {
      if(i < 1)
        return 'yellow';
      else if (i>1 && i< 4)
        return 'green';
      else
        return 'blue';
    })
    .call(d3.drag()
      .on('start', onDragStart)
      .on('drag', onDrag)
      .on('end', onDragEnd))
      .on('mousemove', function (d) {

        d3.select(this)
          .transition("fill")
          .duration(250)
          .style('cursor', 'pointer');

        tooltip
          .style('left', (d3.event.pageX) - 50 + "px")
          .style('top', (d3.event.pageY) - 40 + "px")
          .text(d.name)
          .transition("tooltip")
          .duration(200)
          .style("opacity", .8);
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .transition("fill")
          .duration(250);

        tooltip
          .transition("tooltip")
          .duration(500)
          .style("opacity", 0);
      });

  force.on('tick', () => {
    edges
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });
}

function onDragStart(d) {
  if (!d3.event.active) {
    force.alphaTarget(0.3).restart();
  }
  // use fx and fy as fixed x and y values; when set, overrides computed x/y
  d.fx = d.x;
  d.fy = d.y;
}

function onDrag(d) {
  // set fx and fy to event x/y 
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function onDragEnd(d) {
  if (!d3.event.active) {
    force.alphaTarget(1).restart();
  }
  // clear fx and fy so that computed x/y is used once again
  d.fx = null;
  d.fy = null;

}

window.onload = function () {
  d3.json('../datasets/classes.json')
    .then((json) => {
      makeChart(json);
    })
  chartlink();
}