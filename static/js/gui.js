$( document ).ready(function() {
    var nb_circle = graphData.length
    var size_circle = (50 + 20 * nb_circle) * 2
    var margin = {top: 30, right: 50, bottom: 30, left: 50};
    graphWidth = size_circle
    graphHeight = size_circle
    var svgWidth = graphWidth + margin.left + margin.right;
    var svgHeight = graphHeight + margin.top + margin.bottom;
    var nestedListener = false

    function turnCircle(angle) {
      return "translate(" + graphWidth/2 + "," + graphHeight/2 + ") " + "rotate(" + angle + ")" 
    }

    function mousedownCanvas() {
      if(nestedListener) {
        nestedListener = false;
        return;
      }

      var p = d3.mouse(this)
      var cx = (svgWidth/2)
      var cy = (svgHeight/2)
      var d = Math.sqrt(Math.pow(p[0] - cx, 2) + Math.pow(p[1] - cy, 2))
      var i_circle = Math.round((d - 50) / 20)

      if (i_circle >= 0 && i_circle < nb_circle) {
        var angleDeg = Math.atan2(p[1] - cy, p[0] - cx) * 180 / Math.PI;
        if(angleDeg < 0)
          angleDeg = 360 + angleDeg
        var c = graphData[i_circle]

        c.beats.push(angleDeg)
        restart();
      }
    }

    var svg = d3.select("#graphDiv")
      .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .on("mousedown", mousedownCanvas)
      .append("g")
        .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")")
      

    function draw_beat(nodes) {
      nodes = nodes.selectAll(".beat")
            .data(function(d) {return d.beats; })
      
      nodes.enter().append("circle")
            .attr('class', 'beat')
            .style('fill', '#69677C')
            .style("fill-opacity", 1)
            .attr('r', 8)
            .attr("cx", function(d) {
              var r = $(this.parentNode).find('.master').attr('r')
              return r * Math.cos(d / 180 * Math.PI)
            })
            .attr("cy", function(d) {
              var r = $(this.parentNode).find('.master').attr('r')
              return r * Math.sin(d / 180 * Math.PI)
            })
            .on("mousedown", function (_, i) {
              var parent = d3.select($(this).parent()[0])
              var d = parent.datum()
              var c = graphData[d.id]
              c.beats.splice(i, 1)
              restart();
              nestedListener = true
            })

      nodes.attr("cx", function(d) {
              var r = $(this.parentNode).find('.master').attr('r')
              return r * Math.cos(d / 180 * Math.PI)
            })
            .attr("cy", function(d) {
              var r = $(this.parentNode).find('.master').attr('r')
              return r * Math.sin(d / 180 * Math.PI)
            })

       nodes.exit()
          .remove();
    }

    function draw(data) {
        nodes = svg.selectAll(".circle")
           .data(data, function(d) {return d.id; });

        var circles = nodes.enter().append('g')
          .attr("class", "circle")
          .attr("transform", "translate(" + graphWidth/2 + "," + graphHeight/2 + ") " + "rotate(" + 0 + ")")
          
        
        circles.append("circle")
          .attr("class", "master")
          .attr("r",  function(d) {
                return 50 + 20 * d.id;
            })
          .style("fill", 'none')
          .attr("dy", ".35em")
          .style("stroke-opacity", 1)
          .style("stroke", "#A199CA")
          .style("stroke-width", "4")
        
        draw_beat(svg.selectAll(".circle"))

        nodes.exit()
          .transition()
          .style("stroke-opacity", 1e-6)
          .remove();
    }

    function restart() {
      draw(graphData);
    }
    
    restart()
});
