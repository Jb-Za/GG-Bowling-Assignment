import Phaser from "phaser";
import React, { Component } from "react";

class BowlingAlley extends Component {
  constructor(props) {
    super(props);
    this.circles = [];
    this.ball;
    this.pins;
  }

  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      width: 300, // Set the width to match the background image width
      height: 588, // Set the height to match the background image height
      physics: {
        default: "arcade",
        arcade: {
          //   /gravity: { y: 200 },
        },
      },
      scene: {
        preload: this.preload,
        create: this.create,
        update: this.update,
      },
    };

    const game = new Phaser.Game(config);
    BowlingAlley.game = game;
  }

  preload() {
    this.load.image("ball", "ball.png", {
      scale: {
        width: 1,
        height: 1,
      },
    });
    this.load.image("background", "/Background.png");
  }

  create() {
    const backgroundImage = this.add.image(-244, 0, "background").setOrigin(0);

    // Set the dimensions of the image
    backgroundImage.setDisplaySize(840, 588);

    let circleRadius = 15;
    let circleSpacing = circleRadius * 2;
    let startX = 150;
    let startY = 150;

    let circles = [];
    for (let i = 0; i < 4; i++) {
      let rowLength = i + 1;
      let rowStartX = startX - ((rowLength - 1) * circleSpacing) / 2;

      for (let j = 0; j < rowLength; j++) {
        let rowY = startY - i * circleSpacing;
        let circle = this.add.graphics();
        circle.visible = true; // set initial visibility
        circle.fillStyle(0xffffff, 1);
        circle.fillCircle(rowStartX + j * circleSpacing, rowY, circleRadius);
        circles.push(circle);

        let innerCircle = this.add.graphics();
        innerCircle.visible = true;
        innerCircle.lineStyle(2, 0xff0000, 1);
        innerCircle.strokeCircle(
          rowStartX + j * circleSpacing,
          rowY,
          circleRadius / 2
        );
        circles.push(innerCircle);
      }
    }

    this.circles = circles;
    // console.log(this.circles);

    this.ball = this.physics.add
      .sprite(150, 550, "ball")
      .setScale(0.1)
      .refreshBody();
    this.ball.setCircle(1); // set the ball as a circle with radius 25

    // Add the ball sprite
    //ball = this.physics.add.sprite(150, 550, "ball");
    this.ball.setVelocity(0, 0); // Set the initial velocity to zero
    //this.ball.setBounce(0.2);
    this.ball.setCollideWorldBounds(true);
    //ball.setGravity(0, -175);

    //console.log(this.ball);
    this.physics.world.on("worldbounds", () => {
      this.ball.setVelocity(0, 0);
      console.log("Ball collided with world bounds");
    });

    //console.log(this.ball);
    //console.log(this.circles);
    this.physics.world.on("update", this.update, this);
    // console.log("Update event listener added");
  }

  update(time, delta) {
    if (this.ball.y >= 220) {
      return;
    } else {
      // check if the ball has travelled 600 units
      BowlingAlley.setPins();
      this.ball.setVelocity(0, 0);
      this.ball.x = 150;
      this.ball.y = 550;
      //this.physics.world.off("update"); // disable further update events
    }
  }

  static setPins() {
    const circles = BowlingAlley.game.scene.scenes[0].children.list;
    for (let i = 0; i < circles.length; i++) {
      if (circles[i].type === "Graphics") {
        circles[i].visible = false;
      }
    }

    let pins = this.pins * 2;
    for (let i = 20; i >= 20 - pins + 1; i -= 2) {
      if (circles[i].type === "Graphics") {
        circles[i].visible = true;
        circles[i - 1].visible = true;
      }
    }
  }

  static resetPins() {
    const circles = BowlingAlley.game.scene.scenes[0].children.list;
    for (let i = 0; i < circles.length; i++) {
      if (circles[i].type === "Graphics") {
        circles[i].visible = true;
      }
    }
  }

  static rollBall(pinUp) {
    this.pins = pinUp;
    //const circles = BowlingAlley.game.scene.scenes[0].children.list;
    //const scene = BowlingAlley.game.scene.scenes[0];

    //console.log();

    const ball = BowlingAlley.game.scene.scenes[0].children.list[21];
    // console.log("BALL!");

    ball.setVelocity(0, -400);

    //ball.body.setVelocity(0, 0); // stop the ball's movement
    //ball.x = 150; // reset the ball's position
    //ball.y = 550;

    // circles[1].visible = true;
    //  circles[2].visible = true;
  }
  render() {
    return <div id="my-game"></div>;
  }
}

export default BowlingAlley;
