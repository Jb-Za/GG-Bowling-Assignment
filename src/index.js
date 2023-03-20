import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Scoreboard from "./components/Scoreboard.js";
//import Buttons from "./components/Buttons.js";
import Game from "./Game.js";
import registerServiceWorker from "./registerServiceWorker";
import BowlingAlley from "./components/bowlingAlley";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: [],
    };
    this.bowlingAlleyRef = React.createRef();
    this.game = Game.create(this.bowlingAlleyRef);
  }

  render() {
    const { scores } = this.state;
    // const gameRef = useRef(null);

    return (
      <div>
        <Scoreboard scores={scores} />

        <div className="bowlingAlley">
          <BowlingAlley ref={this.bowlingAlleyRef} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
