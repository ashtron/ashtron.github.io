/* global Quintus */

window.addEventListener("load",function() {
  var score = 0;

  var Q = window.Q = Quintus()
          .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
          .setup({ width: 800, height: 600, maximize: false })
          .controls().touch();

  Q.Sprite.extend("Player", {
    init: function(p) {
      this._super(p, {
        sheet: "player",
        x: 200,
        y: 10000,
        gravity: .7
      });

      this.add('2d, platformerControls');

      this.on("hit.sprite", function(collision) {
        if (collision.obj.isA("Tower")) {
          Q.stageScene("endGame", 1, { label: "You Won!" });
          this.destroy();
        } else if (collision.obj.isA("Blob")) {
          Q.stageScene("endGame", 1, {
            label: "You got eaten by the blob.\nScore: " + score
          });
          this.destroy();
        }
      });
    },

    step: function(dt) {
      this.p.speed += 20*dt;
      score += 1;
    }
  });

  Q.Sprite.extend("Tower", {
    init: function(p) {
      this._super(p, { sheet: 'tower' });
    }
  });

  Q.Sprite.extend("Blob", {
    init: function(p) {
      this._super(p, { sheet: 'blob', vy: -80, gravity: 0 });
      this.add('2d');
      this.off('hit');
    },

    step: function(dt) {
      this.p.vy -= 10*dt;
    }
  });

  Q.Sprite.extend("Enemy", {
    init: function(p) {
      this._super(p, { sheet: 'enemy', vx: -100 });

      this.add('2d, aiBounce');

      this.on("bump.left, bump.right, bump.bottom", function(collision) {
        if (collision.obj.isA("Player")) {
          Q.stageScene("endGame", 1, { label: "You Died" });
          collision.obj.destroy();
        } else if (collision.obj.isA("Blob")) {
          this.destroy();
        }
      });

      this.on("bump.top", function(collision) {
        if (collision.obj.isA("Player")) {
          this.destroy();
          collision.obj.p.vy = -300;
        }
      });
    }
  });

  Q.scene("level1", function(stage) {
    stage.insert(new Q.Repeater({
      asset: "background-wall.png",
      speedX: 0.5,
      speedY: 0.5
    }));

    stage.collisionLayer(new Q.TileLayer({
      dataAsset: 'level.json',
      sheet: 'tiles'
    }));


    var player = stage.insert(new Q.Player());

    stage.add("viewport").follow(player);

    // stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    // stage.insert(new Q.Enemy({ x: 800, y: 0 }));

    // stage.insert(new Q.Tower({ x: 1180, y: 368 }));
    stage.insert(new Q.Blob({ x: 0, y: 10650 }));
    Q.state.reset({ score: 0 });
  });

  Q.scene('endGame', function(stage) {
    var container = stage.insert(new Q.UI.Container({
      x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
    }));

    var button = container.insert(new Q.UI.Button({
      x: 0,
      y: 0,
      fill: "#CCCCCC",
      label: "Play Again"
    }));

    var label = container.insert(new Q.UI.Text({
      x:10,
      y: -10 - button.p.h,
      label: stage.options.label
    }));

    button.on("click",function() {
      Q.clearStages();
      Q.stageScene('level1');
    });

    score = 0;
    container.fit(20);
  });

  Q.load("sprites.png, sprites.json, level.json, tiles.png, background-wall.png, blob.png", function() {
    Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
    Q.sheet("blob", "blob.png", { tilew: 1600, tileh: 600 });
    Q.compileSheets("sprites.png", "sprites.json");

    Q.stageScene("level1");
  });
});
