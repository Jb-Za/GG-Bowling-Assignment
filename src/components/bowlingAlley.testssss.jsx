import React from "react";
import BowlingAlley from "./BowlingAlley";
import { render } from "@testing-library/react";
//import "@testing-library/jest-dom/extend-expect";

////////////////////////////////////////////////
//testing phaser components... i dunno how man its just not working
/////////////////////////////////////////////////
describe("BowlingAlley", () => {
  it("renders without crashing", () => {
    const { container } = render(<BowlingAlley />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("sets up the game", () => {
    const game = BowlingAlley.game;
    expect(game).toBeDefined();
  });
});
