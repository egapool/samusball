(function($) {
  $.fn.samus = function(config) {
    var Ball;
    config = config || {};

    Ball = (function(){
      Ball.W = window.innerWidth;
      Ball.H = window.innerHeight;
      Ball.time = 20;
      Ball.speed = 5;
      Ball.defaults = {
        r: 10,
        x: 50,
        y: 50,
        border: "#37D6EA",
        background: "#FFFFFF",
        shadow: 2,
      };

      function Ball($elm) {
        //config        = config || {};
        this.heaping  = false;
        this.moving   = false;
        this.defaults = $.extend(Ball.defaults, config);
        this.param    = $.extend({},this.defaults);
        this.ball     = $elm;
        this.sizeID   = 0;
        this.pointerx = 0;
        this.pointery = 0;
        this.render();

        // event listner
        $elm.on('mousedown', $.proxy(this.heap,this));
        $(window).on('mouseup', $.proxy(this.launch,this));
        $(window).on('mousemove', $.proxy(function(e){
          this.pointerx = e.clientX;
          this.pointery = e.clientY;
        },this));
      }

      Ball.prototype = {

        init: function(){
          this.render();
        },

        render: function(){
          this.param.shadow = this.param.r * 0.2;
          this.ball.css({
            width:            this.param.r,
            height:           this.param.r,
            top:              this.param.y - this.param.r * 0.5,
            right:            this.param.x - this.param.r * 0.5,
            borderColor:      this.param.border,
            backgroundColor:  this.param.background,
            boxShadow: "#37D6EA 0px 0px "+this.param.shadow+"px,#37D6EA 0px 0px "+this.param.shadow+"px inset"
          });
        },

        reset: function(){
          this.param = $.extend({},this.defaults);
          $('body').css('backgroundColor','hsl(0,0%,100%)');
          $('.track').remove();
          this.render();
        },

        launch: function(e){
          if ( this.moving || !this.heaping) return;
          this.moving = true;

          clearInterval(this.sizeId);
          v = this._vector();
          moveID = setInterval($.proxy(function(){
            this.param.x = this.param.x + v.x * Ball.speed;
            this.param.y = this.param.y + v.y * Ball.speed;
            this.render();
            v = this._guid(v);
            if ( this.param.x + this.param.r * 0.3 > Ball.W ||
                  this.param.x + this.param.r * 0.3 < 0 ||
                  this.param.y + this.param.r * 0.3 > Ball.H ||
                  this.param.y + this.param.r * 0.3 < 0) {
              $('body').addClass('bbb');
              clearInterval(moveID);
              this.reset();
              this.heaping = false;
              this.moving = false;
            }
          }, this), Ball.time * 0.5);
        },

        heap: function(e){
          if( e.button === 0 ){
            if ( this.heaping ) return;
            this.heaping = true;
            $('body').removeClass('bbb');
            this.sizeId = setInterval($.proxy(
              function(){
                this.param.r = this.param.r + 0.2;
                this._dark(this.param.r);
                this.render();
              },this),Ball.time*2);
          }
        },

        _vector: function(){
          px = Ball.W - this.pointerx;
          py = this.pointery;
          dx = px - this.param.x;
          dy = py - this.param.y;
          dirx = dx > 0 ? 1 : -1;
          diry = dy > 0 ? 1 : -1;
          absx = Math.abs(dx);
          absy = Math.abs(dy);
          return {
            x: dirx * (absx/(absx+absy)),
            y: diry * (absy/(absx+absy)),
          };
        },

        _guid:function(v1){
          gravitation = 30;
          v2 = this._vector();
          vx = v1.x + (v2.x / gravitation);
          vy = v1.y + (v2.y / gravitation);
          dirx = vx > 0 ? 1 : -1;
          diry = vy > 0 ? 1 : -1;
          absvx = Math.abs(vx);
          absvy = Math.abs(vy);
          res = {
            x: dirx * (absvx/(absvx+absvy)),
            y: diry * (absvy/(absvx+absvy)),
          };
          return res;
        },

        _dark: function(color){
          max = Ball.W > Ball.H ? Ball.H : Ball.W;
          $('body').css('backgroundColor','hsl(0,0%,'+((1 - color/max)*100)+'%)');
        },
      };

      return Ball;
    })();

    return this.each(function(){
      $('body').css('position','relative');
      b = new Ball($(this));
      b.render();
    });
  };
})(jQuery);