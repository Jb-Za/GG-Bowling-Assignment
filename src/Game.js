//import ScoreBoard from "./components/Scoreboard.js";
import React, { Component } from "react";
//import App from "./index.js";

import BowlingAlley from "./components/bowlingAlley.js";

class Game {
  constructor() {
    this.bowlingAlley = new BowlingAlley();
    this.rolls = [];
    this.currentRoll = 0;
    this.frame = 1;
    this.withinFrame = 1;
    this.pinsup = 10;
    this.extraBall = false;
  }

  static create = () => new Game();

  roll = (pins) => {
    this.rolls[this.currentRoll++] = pins;
    //console.log(pins);
  };

  reset = () => {
    this.rolls = [];
    this.currentRoll = 0;
    this.frame = 1;
    this.withinFrame = 1;
    this.extraBall = false;
    BowlingAlley.resetPins();
  };

  pinsUp = () => {
    const scoreData = this.score();
    let pinsUp = 10;
    scoreData.forEach((o) => {
      if (o.pinsUp !== null && !isNaN(o.pinsUp)) {
        pinsUp = o.pinsUp;
      }
    });
    return pinsUp;
  };

  simulatePlayer = async () => {
    // can't play if the game is done
    let roll;
    if (this.frame <= 10) {
      if (this.withinFrame === 1) {
        BowlingAlley.resetPins();
      }
      //console.log("///////////////////////////");
      //console.log("within:" + this.withinFrame);
      roll = Math.floor(Math.random() * (this.pinsUp() + 1)); // roll first ball
      if (this.frame === 10) {
        // this is for the third roll. It cannot be a number greater than 10 - roll 2
        //roll = Math.floor(Math.random() * (this.pinsUp() + 1)); // roll first ball
        this.pinsup = this.pinsUp() - roll;
        BowlingAlley.rollBall(this.pinsup);
        //await timers.setTimeout(1);

        this.roll(roll); // feed roll value to game instance\
        if (this.withinFrame === 3) {
          //console.log("got to frame3!");

          this.frame++;
          this.withinFrame = 1;
        } else {
          if (this.withinFrame === 2) {
            this.pinsup = this.pinsUp();
            //console.log("roll 2 pinsup: " + this.pinsup);
            if (this.pinsUp() - roll === 0) {
              // console.log("extra ball");
              this.extraBall = true;
            }
            if (this.extraBall !== true) {
              this.frame++;
            }
          }

          this.pinsup = this.pinsUp() - roll;

          if (this.withinFrame === 1 && roll === 10) {
            // if roll 1 is a strike, get two more rolls
            this.pinsup = 10;
            //this.withinFrame++;
            this.extraBall = true;
          }

          //console.log("frame: " + this.frame);

          this.withinFrame++;
        }
      } else {
        // everything else
        this.pinsup = this.pinsUp() - roll;
        BowlingAlley.rollBall(this.pinsup);
        //await timers.setTimeout(1);

        this.roll(roll);
        // feed roll value to game instance
        // console.log("frame: " + this.frame);
        if (this.withinFrame === 3) this.withinFrame = 1;

        if (roll === 10) {
          // console.log("strike!");
          this.withinFrame = 1;
          this.frame++;
        } else if (this.pinsUp() === 10 && this.withinFrame !== 1) {
          //console.log("regular frame up");
          this.frame++;
          this.withinFrame = 1;
        } else {
          //console.log("within frame up");
          this.withinFrame++;
        }
        //console.log("next frame: " + this.frame);
      }
    }

    //console.log(this);
    //console.log("pins: " + this.pinsUp());

    //console.log("within frame: " + this.withinFrame);
    //console.log("pinsup: " + this.pinsUp());
  };

  score = () => {
    let scoreData = [];
    let score = 0;
    let frameIndex = 0;

    const roll1 = () => this.rolls[frameIndex];
    const roll2 = () => this.rolls[frameIndex + 1];
    const roll3 = () => this.rolls[frameIndex + 2];

    const sumOfFrameRolls = () => roll1() + roll2();

    const spareBonus = () => roll3();

    const strikeBonus = () => roll2() + roll3();

    const isStrike = () => roll1() === 10;

    const isSpare = () => sumOfFrameRolls() === 10;

    const saveFrame = (scoreData, leftBox, rightBox, score, pinsUp) => {
      if (scoreData.length < 9) {
        scoreData.push({
          leftBox,
          rightBox,
          cumulativeScore: score,
          pinsUp,
        });
      } else {
        const box1 = roll1() === 10 ? "X" : roll1();
        const box2 = roll2() === 10 ? "X" : isSpare() ? "/" : roll2();
        let box3;
        if (roll3() === 10) {
          box3 = "X";
        } else if (roll1() === 10 || roll1() + roll2() === 10) {
          box3 = roll3();
        } else {
          box3 = "";
        }

        scoreData.push({
          leftBox: box1,
          rightBox: box2,
          cumulativeScore: score,
          pinsUp,
          extraBox: box3,
        });
      }
    };

    [...Array(10)].forEach((_, frame) => {
      if (isStrike()) {
        score += 10 + strikeBonus();
        saveFrame(scoreData, "", "X", score, 10);
        frameIndex++;
      } else if (isSpare()) {
        score += 10 + spareBonus();
        saveFrame(scoreData, roll1(), "/", score, 10);
        frameIndex += 2;
      } else {
        score += sumOfFrameRolls();
        const pinsUp = roll2() !== undefined ? 10 : 10 - roll1();
        saveFrame(scoreData, roll1(), roll2(), score, pinsUp);
        frameIndex += 2;
      }
    });

    return scoreData;
  };
}

export default Game;
