(function () {
  'use strict';

  function createLine(opts) {
    opts = opts || {};
    opts = {
      color: opts.color || 'red',
      labelX: opts.labelX !== undefined ? opts.labelX : 5,
      labelY: opts.labelY !== undefined ? opts.labelY : 5
    };

    var marker = document.createElement('div');
    marker.classList.add('boxtracker-marker');
    marker.style.position = 'absolute';
    marker.style.left = 0;
    marker.style.top = 0;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var ns = svg.namespaceURI;
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.display = 'block';
    svg.style.overflow = 'visible';
    svg.style.height = 1;
    svg.style.width = 1;
    marker.appendChild(svg);

    var line = document.createElementNS(ns, 'line');
    line.setAttribute('stroke', opts.color);
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);

    var annotation = document.createElement('span');
    annotation.classList.add('boxtracker-annotation');
    annotation.style.position = 'absolute';
    annotation.style.fontFamily = 'sans-serif';
    annotation.style.fontSize = '12px';
    annotation.style.color = opts.color;
    marker.appendChild(annotation);

    var start = {x: 0, y: 0};
    var end = {x: 0, y: 0};

    function updateAnnotation() {
      var width = Math.abs(start.x - end.x);
      var height = Math.abs(start.y - end.y);
      var length = Math.sqrt(width * width + height * height);
      annotation.style.top = start.y + height / 2 + opts.labelY + 'px';
      annotation.style.left = start.x + width / 2 + opts.labelX + 'px';
      annotation.innerHTML = Math.round(length) + 'px';
    }

    var container = {
      marker: marker,
      startAt: function (x, y) {
        start.x = x;
        start.y = y;
        line.setAttribute('x1', x + 'px');
        line.setAttribute('y1', y + 'px');
        updateAnnotation();
        return container;
      },
      endAt: function (x, y) {
        end.x = x;
        end.y = y;
        line.setAttribute('x2', x + 'px');
        line.setAttribute('y2', y + 'px');
        updateAnnotation();
        return container;
      }
    };

    return container;
  }

  function positionLine(line, positioning) {
    function coordinate(anchor, coordinate) {
      return anchor[coordinate] && anchor[coordinate].getBoundingClientRect()[coordinate];
    }

    function midpoint(from, to) {
      from = from.getBoundingClientRect();
      to = to.getBoundingClientRect();
      var top = Math.min(from.top, to.top);
      var bottom = Math.max(from.bottom, to.bottom);
      var left = Math.min(from.left, to.left);
      var right = Math.max(from.right, to.right);
      return {x: left + (right - left) / 2, y: top + (bottom - top) / 2};
    }

    var fromVertical = positioning.from.top || positioning.from.bottom;
    var fromHorizontal = positioning.from.left || positioning.from.right;
    var toVertical = positioning.to.top || positioning.to.bottom;
    var toHorizontal = positioning.to.left || positioning.to.right;

    var start = {x: 0, y: 0};
    var end = {x: 0, y: 0};

    start.x = coordinate(positioning.from, 'left') || coordinate(positioning.from, 'right') || midpoint(fromVertical, toVertical).x;
    start.y = coordinate(positioning.from, 'bottom') || coordinate(positioning.from, 'top') || midpoint(fromHorizontal, toHorizontal).y;
    end.x = coordinate(positioning.to, 'left') || coordinate(positioning.to, 'right') || midpoint(fromVertical, toVertical).x;
    end.y = coordinate(positioning.to, 'bottom') || coordinate(positioning.to, 'top') || midpoint(fromHorizontal, toHorizontal).y;

    line.startAt(start.x, start.y).endAt(end.x, end.y);
  }

  function values(obj) {
    var result = [];
    for (var key in obj) {
      result.push(obj[key]);
    }
    return result;
  }

  function unique(arr) {
    var result = [], item;
    for (var i = 0; i < arr.length; i++) {
      item = arr[i];
      if (result.indexOf(item) < 0) {
        result.push(item);
      }
    }
    return result;
  }

  function track(anchoring, opts) {
    var line = createLine(opts);
    document.body.appendChild(line.marker);
    positionLine(line, anchoring);
    var trackedElements = unique(values(anchoring.from).concat(values(anchoring.to)));
    trackedElements.forEach(function (elem) {
      new ResizeSensor(elem, function () {
        positionLine(line, anchoring);
      });
    });
  }

  window.boxtracker = {
    trackHeight: function (elem, opts) {
      track({from: {top: elem}, to: {bottom: elem}}, opts);
    },
    trackWidth: function (elem, opts) {
      track({from: {left: elem}, to: {right: elem}}, opts);
    },
    trackDiagonal: function (elem, opts) {
      track({from: {top: elem, left: elem}, to: {bottom: elem, right: elem}}, opts);
    },
    track: track
  };
}());