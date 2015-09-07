(function () {
  'use strict';

  function createLine(opts) {
    opts = opts || {};
    opts = {
      color: opts.color || 'red'
    };

    var marker = document.createElement('div');
    marker.classList.add('boxtracker-marker');
    marker.style.position = 'absolute';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var ns = svg.namespaceURI;
    svg.setAttribute('viewBox', '0 0 2 2');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.display = 'block';
    svg.style.overflow = 'visible';
    svg.style.height = '100%';
    svg.style.width = '1px';
    marker.appendChild(svg);

    var line = document.createElementNS(ns, 'polyline');
    line.setAttribute('points', '0,0 0,2');
    line.setAttribute('stroke', opts.color);
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);

    var annotation = document.createElement('span');
    annotation.classList.add('boxtracker-annotation');
    annotation.style.position = 'absolute';
    annotation.style.top = '50%';
    annotation.style.left = '5px';
    annotation.style.fontFamily = 'sans-serif';
    annotation.style.fontSize = '12px';
    annotation.style.color = opts.color;
    marker.appendChild(annotation);

    return marker;
  }

  function positionLine(line, positioning) {
    function positionVertically() {
      var start = positioning.top.getBoundingClientRect();
      var end = positioning.bottom.getBoundingClientRect();
      var height;

      if (end.bottom > start.top) {
        var aux = start;
        start = end;
        end = aux;
      }

      height = end.bottom - start.top;
      line.style.top = start.top;
      line.style.height = height;
      line.style.left = (start.left + end.right) / 2;
      line.querySelector('.boxtracker-annotation').innerHTML = Math.round(height) + 'px';
    }

    function positionHorizontally() {
      var start = positioning.top.getBoundingClientRect();
      var end = positioning.bottom.getBoundingClientRect();
      var height;

      if (end.bottom > start.top) {
        var aux = start;
        start = end;
        end = aux;
      }

      height = end.bottom - start.top;
      line.style.top = start.top;
      line.style.height = height;
      line.style.left = (start.left + end.right) / 2;
      line.querySelector('.boxtracker-annotation').innerHTML = Math.round(height) + 'px';
    }

    if (positioning.top && positioning.bottom) {
      positionVertically();
    } else if (positioning.left && positioning.right) {
      
    }
  }

  function trackHeight(elem, opts) {
    var line = createLine(opts);
    document.body.appendChild(line);
    positionLine(line, {top: elem, bottom: elem});
    new ResizeSensor(elem, function () {
      positionLine(line, {top: elem, bottom: elem});
    });
  }

  window.boxtracker = {
    trackHeight: trackHeight
  };
}());