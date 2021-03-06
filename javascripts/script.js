// Generated by CoffeeScript 1.3.1
(function() {
  var cacheImage, cell, handleZoom, height, init, width;

  width = self.innerWidth - 10;

  height = self.innerHeight - 10;

  window.drawTree = function(insta) {
    var detail, div, json, pic, treemap, _i, _len, _ref,
      _this = this;
    div = d3.select("#chart").append("div").style("position", "absolute").style("width", width + "px").style("height", height + "px").style("top", "50%").style("left", "50%").style("margin", -.5 * height + "px 0 0 " + -.5 * width + "px");
    treemap = d3.layout.treemap().size([width, height]).sticky(true).value(function(d) {
      return d.size;
    });
    json = {
      "children": []
    };
    _ref = insta.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pic = _ref[_i];
      detail = {
        "src": pic.images.standard_resolution.url,
        "size": pic.likes.count,
        "url": pic.link,
        "title": pic.caption ? pic.caption.text : ""
      };
      json.children.push(detail);
    }
    div.data([json]).selectAll("div").data(treemap.nodes).enter().append("div").attr("class", "cell").call(cell).style("background-image", function(d) {
      if (d.children) {
        return null;
      } else {
        return "url('" + d.src + "')";
      }
    }).html(function(d) {
      if (d.children) {
        return null;
      } else if (d.url) {
        return "<a href='" + d.url + "' data-url='" + d.src + "' title='" + d.title + "'></a>";
      }
    }).style("-webkit-transition", function() {
      var num, time;
      num = Math.random();
      time = "0.5s";
      return "" + time + " opacity " + num + "s";
    });
    window.zoom = new Zoom("z");
    return window.setTimeout(function() {
      var a, box, _j, _len1, _ref1, _results;
      _ref1 = document.getElementsByClassName("cell");
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        box = _ref1[_j];
        box.className = "cell visible";
        if (box.childNodes.length !== 0) {
          a = box.firstChild;
          a.addEventListener("mouseover", cacheImage, false);
          _results.push(a.addEventListener("click", handleZoom, false));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }, 0);
  };

  cell = function() {
    return this.style("left", function(d) {
      return d.x + "px";
    }).style("top", function(d) {
      return d.y + "px";
    }).style("width", function(d) {
      return Math.max(0, d.dx - 1) + "px";
    }).style("height", function(d) {
      return Math.max(0, d.dy - 1) + "px";
    });
  };

  handleZoom = function(e) {
    var image,
      _this = this;
    e.preventDefault();
    if (this.loaded) {
      return window.zoom.zoom(this, this.parentNode);
    } else {
      image = document.createElement("img");
      image.onload = function() {
        window.zoom.cache[image.src] = image;
        _this.loaded = true;
        return window.zoom.zoom(_this, _this.parentNode);
      };
      return image.src = this.getAttribute("data-url");
    }
  };

  cacheImage = function(e) {
    var image, url,
      _this = this;
    image = document.createElement("img");
    url = this.getAttribute("data-url");
    image.onload = function() {
      _this.loaded = true;
      window.zoom.cache[url] = image;
      return _this.removeEventListener("mouseover", cacheImage, false);
    };
    return image.src = url;
  };

  init = function() {
    var auth;
    if (window.location.hash) {
      window.token = window.location.hash.replace("#", "");
      window.location.hash = "";
      window.script = document.createElement("script");
      script.src = 'https://api.instagram.com/v1/users/self/media/recent/?' + window.token + '&callback=window.drawTree';
      return document.getElementsByTagName('head')[0].appendChild(script);
    } else {
      auth = document.getElementsByClassName("auth")[0];
      auth.style.display = "block";
      return window.setTimeout(function() {
        return auth.className = "auth loaded";
      }, 0);
    }
  };

  window.addEventListener("DOMContentLoaded", init, false);

}).call(this);
