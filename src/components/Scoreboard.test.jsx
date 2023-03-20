import React from "react";
import { shallow } from "enzyme";
import ScoreBoard from "./ScoreBoard";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

import BowlingAlley from "./bowlingAlley";

jest.mock("./bowlingAlley");

describe("ScoreBoard", () => {
  it("renders without crashing", () => {
    shallow(<ScoreBoard />);
  });

  it("should simulate player when Roll button is clicked", () => {
    const component = shallow(<ScoreBoard />);
    const game = component.instance().game;
    const spy = jest.spyOn(game, "simulatePlayer");
    component.find(".button").at(0).simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should reset game when Reset button is clicked", () => {
    const component = shallow(<ScoreBoard />);
    const game = component.instance().game;
    const spy = jest.spyOn(game, "reset");
    component.find(".button").at(1).simulate("click");
    expect(spy).toHaveBeenCalled();
  });
});
