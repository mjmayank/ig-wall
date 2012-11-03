// Generated by CoffeeScript 1.3.1
(function() {
  var getPosition,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.verbose = false;

  self.Zoom = (function() {

    Zoom.name = 'Zoom';

    function Zoom(id, boxShadow, titleStyle) {
      this.id = id;
      this.boxShadow = boxShadow != null ? boxShadow : "0 4px 15px rgba(0, 0, 0, 0.5)";
      this.titleStyle = titleStyle != null ? titleStyle : "background-color: #fff; text-align: center; padding: 5px 0; font: 14px/1 Helvetica, sans-serif";
      this.checkClicked = __bind(this.checkClicked, this);

      this.endSlowMode = __bind(this.endSlowMode, this);

      this.startSlowMode = __bind(this.startSlowMode, this);

      this.checkKeyClosed = __bind(this.checkKeyClosed, this);

      this.ESCAPE = 27;
      this.SHIFT = 16;
      this.TRANSITION_DURATION = 300;
      this.SLOW_MODE_MULTIPLIER = 3;
      this.BOX_SHADOW_OFFSET = 100;
      this.OPACITY_OFFSET = 50;
      this.ACTIVE_DURATION = this.TRANSITION_DURATION;
      this.computeDurations();
      this.CLOSE_DELAY = 0;
      this.opened = false;
      this.cache = [];
      this.slowModeState = false;
      this.container = document.createElement("div");
      this.container.id = this.id;
      document.body.appendChild(this.container);
      document.body.addEventListener("keydown", this.startSlowMode, false);
      document.body.addEventListener("keyup", this.endSlowMode, false);
    }

    Zoom.prototype.computeDurations = function() {
      var big, wrap;
      this.TRANSFORM_DURATION = this.ACTIVE_DURATION;
      this.BOX_SHADOW_DURATION = Math.abs(this.ACTIVE_DURATION - this.BOX_SHADOW_OFFSET);
      this.OPACITY_DURATION = Math.abs(this.ACTIVE_DURATION - this.OPACITY_OFFSET);
      if (this.opened) {
        big = this.container.getElementsByClassName("image")[0];
        big.style.webkitTransition = "-webkit-transform " + this.TRANSFORM_DURATION + "ms";
        wrap = this.container.getElementsByClassName("wrap")[0];
        return wrap.style.webkitTransition = "-webkit-transform " + this.TRANSFORM_DURATION + "ms, opacity " + this.OPACITY_DURATION + "ms, box-shadow " + this.BOX_SHADOW_DURATION + "ms";
      }
    };

    Zoom.prototype.checkKeyClosed = function(e) {
      if (e.keyCode === this.ESCAPE && this.opened) {
        e.preventDefault();
        return this.close();
      }
    };

    Zoom.prototype.startSlowMode = function(e) {
      if (e.keyCode === this.SHIFT) {
        this.ACTIVE_DURATION = this.TRANSITION_DURATION * this.SLOW_MODE_MULTIPLIER;
        return this.computeDurations();
      }
    };

    Zoom.prototype.endSlowMode = function(e) {
      if (e.keyCode === this.SHIFT) {
        this.ACTIVE_DURATION = this.TRANSITION_DURATION;
        return this.computeDurations();
      }
    };

    Zoom.prototype.checkClicked = function(e) {
      if (e.srcElement.className !== "image" && this.opened) {
        return this.close();
      }
    };

    Zoom.prototype.showLoadingIndicator = function() {
      return console.log("loading indicator being shown");
    };

    Zoom.prototype.hideLoadingIndicator = function() {};

    Zoom.prototype.zoom = function(element, thumb) {
      var image,
        _this = this;
      if (!thumb) {
        thumb = element.firstChild;
      }
      if (element.loaded) {
        return this.doZoom(element, thumb);
      } else {
        image = document.createElement("img");
        image.onload = function() {
          return _this.doZoom(element, thumb);
        };
        return image.src = element.getAttribute("data-url");
      }
    };

    Zoom.prototype.doZoom = function(element, thumb) {
      var big, finalScaleString, finalTranslateString, finalX, finalY, fullURL, height, image, posX, posY, position, scale, scrollTop, title, width, wrap,
        _this = this;
      if (this.opened) {
        this.close();
      }
      this.opened = true;
      fullURL = element.getAttribute("data-url");
      image = this.cache[fullURL];
      if (image === void 0) {
        image = document.createElement("img");
        image.setAttribute("src", fullURL);
        this.cache[fullURL] = image;
      }
      width = image.width;
      height = image.height;
      if (element.getAttribute("title")) {
        title = document.createElement("div");
        title.className = "title";
        title.innerHTML = element.getAttribute("title");
        title.setAttribute("style", this.titleStyle);
        /*
        			Little trick to get the offsetHeight
        			Quickly add and remove title
        */

        title.style.visibility = "hidden";
        document.body.appendChild(title);
        height += title.offsetHeight;
        document.body.removeChild(title);
      }
      position = getPosition(thumb);
      posX = position.x - (width - thumb.offsetWidth) / 2;
      posY = position.y - (height - thumb.offsetHeight) / 2;
      big = document.createElement("img");
      big.className = "image";
      big.setAttribute("src", fullURL);
      big.style.webkitTransition = "-webkit-transform " + this.TRANSFORM_DURATION + "ms";
      big.style.display = "block";
      wrap = document.createElement("div");
      wrap.className = "wrap";
      wrap.appendChild(big);
      if (element.getAttribute("title")) {
        wrap.appendChild(title);
      }
      wrap.style.webkitTransition = "-webkit-transform " + this.TRANSFORM_DURATION + "ms, opacity " + this.OPACITY_DURATION + "ms, box-shadow " + this.BOX_SHADOW_DURATION + "ms";
      wrap.style.position = "absolute";
      wrap.style.left = "0";
      wrap.style.top = "0";
      scale = {
        x: thumb.offsetWidth / width,
        y: thumb.offsetHeight / height
      };
      this.scaleString = "scale3d(" + scale.x + ", " + scale.y + ", 1)";
      this.translateString = "translate3d(" + posX + "px, " + posY + "px, 0)";
      wrap.style.webkitTransform = this.translateString;
      big.style.webkitTransform = this.scaleString;
      wrap.style.opacity = "0";
      this.container.appendChild(wrap);
      scrollTop = document.body.scrollTop;
      finalX = window.innerWidth / 2 - width / 2;
      finalY = window.innerHeight / 2 - height / 2 + scrollTop;
      finalScaleString = "scale3d(1, 1, 1)";
      finalTranslateString = "translate3d(" + finalX + "px, " + finalY + "px, 0)";
      return window.setTimeout(function() {
        if (window.verbose) {
          console.log(finalTranslateString);
        }
        wrap.style.opacity = "1";
        wrap.style.webkitTransform = finalTranslateString;
        big.style.webkitTransform = finalScaleString;
        window.setTimeout(function() {
          wrap.style.margin = "-" + (height / 2 + finalY - scrollTop) + "px 0 0 -" + (width / 2 + finalX) + "px";
          wrap.style.top = "50%";
          wrap.style.left = "50%";
          wrap.style.width = "" + width + "px";
          wrap.style.height = "" + height + "px";
          wrap.style.boxShadow = _this.boxShadow;
          if (element.getAttribute("title")) {
            title.style.visibility = "visible";
          }
          document.body.addEventListener("click", _this.checkClicked, false);
          wrap.addEventListener("click", function(e) {
            e.preventDefault();
            return _this.close();
          });
          return document.body.addEventListener("keyup", _this.checkKeyClosed, false);
        }, _this.ACTIVE_DURATION);
        return _this.hideLoadingIndicator();
      }, 0);
    };

    Zoom.prototype.close = function() {
      var newTransitionDuration, wrap,
        _this = this;
      document.body.removeEventListener("click", this.checkClicked, false);
      document.body.removeEventListener("keyup", this.checkKeyClosed, false);
      this.opened = false;
      newTransitionDuration = this.CLOSE_DELAY + this.ACTIVE_DURATION;
      wrap = document.getElementsByClassName("wrap")[0];
      wrap.style.webkitTransition = wrap.style.webkitTransition.replace(", box-shadow " + this.BOX_SHADOW_DURATION + "ms", "");
      window.setTimeout(function() {
        return wrap.style.boxShadow = "none";
      }, 0);
      window.setTimeout(function() {
        wrap.style.webkitTransform = _this.translateString;
        wrap.style.opacity = "0";
        return wrap.firstChild.style.webkitTransform = _this.scaleString;
      }, this.CLOSE_DELAY);
      return window.setTimeout(function() {
        try {
          return _this.container.removeChild(wrap);
        } catch (error) {
          if (window.verbose) {
            return console.log(error);
          }
        }
      }, newTransitionDuration);
    };

    return Zoom;

  })();

  /*
  Returns the absolute position of an element.
  Adapted from quirksmode.org/js/findpos.html
  */


  getPosition = function(el) {
    var left, top;
    left = 0;
    top = 0;
    if (el.offsetParent) {
      left += el.offsetLeft;
      top += el.offsetTop;
      while (el = el.offsetParent) {
        left += el.offsetLeft;
        top += el.offsetTop;
      }
    }
    return {
      x: left,
      y: top
    };
  };

}).call(this);
