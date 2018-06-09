$( document ).ready(function() {
  sound = undefined;
  
  function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
}

  function play() {
    sound.play();
    var me = $('#run')
    me.text('Create');
    me.unbind('click');
    me.click(create)
  }

  function create(){
      if(sound !== undefined) {
        sound.stop();
      }

      $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url: '/create',
          dataType: 'json',
          data: JSON.stringify(graphData),
          success: function (data) {
            console.log('Generate: ' + data['url'])

            sound = new Howl({
              src: [data['url']],
              loop: true,
              onplay: function(){
                console.log('play')
                d3.selectAll('.circle').transition()
                  .duration(5000)
                  .ease(d3.easeLinear)
                  .attrTween("transform", function() {
                    return d3.interpolateString("translate(" + graphWidth/2 + "," + graphHeight/2 + ") " + "rotate(0)", "translate(" + graphWidth/2 + "," + graphHeight/2 + ") " + "rotate(360)");
                  })
              },
              onpause: function(){

              },
              onstop: function(){
                console.log('stop')
                d3.selectAll('.circle').transition()
                  .duration(1000)
                  .attrTween("transform", function(d) {
                    var angle = getRotationDegrees($(this))
                    return d3.interpolateString("translate(" + graphWidth/2 + "," + graphHeight/2 + ") " + "rotate("+angle+")", "translate(" + graphWidth/2 + "," + graphHeight/2 + ") " + "rotate(360)");
                  })
              }
            });

            var me = $('#run')
            me.text('Play');
            me.unbind('click');
            me.click(play)
          },
          error: function (result) {
            console.log('Error while creating the song:')
            console.log(result)
          }
      })
  }

  $('#run').click(create)
});
