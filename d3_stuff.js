   var lineGraph = function(selector, containerHeight, containerWidth,
                         xLabel, yLabel, y2label) {

  var svg;
  var data;

  var update = function(_data) {
    data = _data;
    if (svg) {
      svg.remove();
    }

    svg = d3.select(selector).append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight);

    var margin = { top: 50, left: 50, right: 50, bottom: 50 };

    var height = containerHeight - margin.top - margin.bottom;
    var width = containerWidth - margin.left - margin.right;

    var xDomain = d3.extent(data, function(d) { return d[0]; })
    var yDomain = d3.extent(data, function(d) { return d[1]; });
    if (y2label) {
      var y2Domain = d3.extent(data, function(d) { return d[2]; });
    }

    var xScale = d3.scale.linear().range([0, width]).domain(xDomain);
    var yScale = d3.scale.linear().range([height, 0]).domain(yDomain);
    if (y2label) {
      var y2Scale = d3.scale.linear().range([height, 0]).domain(y2Domain);
    }

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');
    if (y2label) {
      var y2Axis = d3.svg.axis().scale(y2Scale).orient('right');
    }

    var line = d3.svg.line()
      .x(function(d) { return xScale(d[0]); })
      .y(function(d) { return yScale(d[1]); });

    var area = d3.svg.area()
      .x(function(d) { return xScale(d[0]); })
      .y0(function(d) { return yScale(d[1]); })
      .y1(height);

    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    g.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('d', area);

    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('transform', 'translate(' + width + ',0)')
      .attr('y', 36)
      .attr('font-size', 16)
      .attr('text-anchor', 'end')
      .text(xLabel);

    g.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -30)
      .attr('font-size', 16)
      .attr('text-anchor', 'end')
      .text(yLabel);

    if (y2label) {
      g.append('g')
        .attr('class', 'y axis')
        .attr("transform", "translate(" + width + " ,0)")
        .call(y2Axis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 50)
        .attr('font-size', 16)
        .attr('text-anchor', 'end')
        .text(y2label);
    }

    g.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);

    // focus tracking

    var focus = g.append('g').style('display', 'none');

    focus.append('line')
      .attr('id', 'focusLineX')
      .attr('class', 'focusLine');
    focus.append('line')
      .attr('id', 'focusLineY')
      .attr('class', 'focusLine');

    var bisect = d3.bisector(function(d) { return d[0]; }).left;

    g.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', function() { focus.style('display', null); })
      .on('mouseout', function() { focus.style('display', 'none'); })
      .on('mousemove', function() {
        var mouse = d3.mouse(this);
        var mouseDate = xScale.invert(mouse[0]);
        var i = bisect(data, mouseDate); // returns the index to the current data item

        var d0 = data[i - 1]
        var d1 = data[i];
        // work out which date value is closest to the mouse
        var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;

        var x = xScale(d[0]);
        var y = yScale(d[1]);

        focus.select('#focusCircle')
          .attr('cx', x)
          .attr('cy', y);
        focus.select('#focusLineX')
          .attr('x1', x).attr('y1', yScale(yDomain[0]))
          .attr('x2', x).attr('y2', yScale(yDomain[1]));
        focus.select('#focusLineY')
          .attr('x1', xScale(xDomain[0])).attr('y1', y)
          .attr('x2', xScale(xDomain[1])).attr('y2', y);
      });
  }

  return {
    update: update
  };
};
