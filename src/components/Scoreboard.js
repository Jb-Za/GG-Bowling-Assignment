import "./Scoreboard.css";
import React, { Component } from "react";
import Game from "../Game.js";
import EasyEdit, { Types } from "react-easy-edit";

//I pulled and edited most of this component from https://github.com/dearfrankg/react-bowling

const Frame = ({ frameNumber, leftBox, rightBox, extraBox, score }) => (
  <div className="frame">
    <div className="frame-number">{frameNumber}</div>
    <div className="frame-score">
      <div className="box left">{leftBox}</div>
      <div className="box right">{rightBox}</div>
      <div className="box extra">{extraBox}</div>
    </div>
    <div className="running-score">{!isNaN(score) && score}</div>
  </div>
);

class ScoreBoard extends Component {
  constructor(props) {
    super(props);
    this.game = new Game();
    this.state = {
      score: this.game.score(),
    };
  }

  roll = () => {
    //for (let i = 0; i < 25; i++) {
    this.game.simulatePlayer();
    this.setState({ score: this.game.score() });
    // }
  };

  reset = () => {
    this.game.reset();
    this.setState({ score: this.game.score() });
  };

  render() {
    const { score } = this.state;

    const save = (value) => {
      //alert(value);  // these are annoying to be honest
    };

    const cancel = () => {
      //alert("Cancelled");
    };

    return (
      <div>
        <br />
        <div className="player-name">
          <EasyEdit
            type={Types.TEXT}
            onSave={save}
            onCancel={cancel}
            saveButtonLabel="Save"
            cancelButtonLabel="Cancel"
            instructions="Enter player name"
          />
        </div>

        <div className="score-board">
          {[...Array(10)].map((o, i) => (
            <Frame
              key={i}
              frameNumber={i + 1}
              leftBox={score[i].leftBox}
              rightBox={score[i].rightBox}
              extraBox={score[i].extraBox}
              score={score[i].cumulativeScore}
            />
          ))}
        </div>

        <button className="button" onClick={this.roll}>
          {"Roll!"}
        </button>
        <button className="button" onClick={this.reset}>
          {"Reset"}
        </button>
      </div>
    );
  }
}

export default ScoreBoard;
