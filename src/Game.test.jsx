import Game from "./Game";
import Phaser from "phaser";
import BowlingAlley from "./components/bowlingAlley";

jest.mock("./components/bowlingAlley");

describe("Game", () => {
  let game;
  let bowlingAlley;

  beforeEach(() => {
    game = Game.create();
    bowlingAlley = new BowlingAlley(game);
  });

  describe("roll", () => {
    it("should add the number of pins knocked down to the rolls array", () => {
      game.roll(5);
      expect(game.rolls[0]).toEqual(5);
    });
  });

  describe("reset", () => {
    it("should reset the rolls array, currentRoll, frame and withinFrame to their default values", () => {
      game.roll(5);
      game.reset();
      expect(game.rolls).toEqual([]);
      expect(game.currentRoll).toEqual(0);
      expect(game.frame).toEqual(1);
      expect(game.withinFrame).toEqual(1);
    });
  });

  describe("Game score", () => {
    it("should return 0 for a gutter game", () => {
      const game = new Game();
      [...Array(20)].forEach(() => game.roll(0));
      const scoreData = game.score();
      expect(scoreData[scoreData.length - 1].cumulativeScore).toEqual(0);
    });

    it("should return 20 for a game with all ones", () => {
      const game = new Game();
      [...Array(20)].forEach(() => game.roll(1));
      const scoreData = game.score();
      expect(scoreData[scoreData.length - 1].cumulativeScore).toEqual(20);
    });

    it("should correctly handle spares", () => {
      const game = new Game();
      game.roll(4);
      game.roll(6);
      game.roll(3);
      [...Array(17)].forEach(() => game.roll(0));
      const scoreData = game.score();
      expect(scoreData[0].leftBox).toEqual(4);
      expect(scoreData[0].rightBox).toEqual("/");
      expect(scoreData[0].cumulativeScore).toEqual(13);
    });

    it("should correctly handle strikes", () => {
      const game = new Game();
      game.roll(10);
      game.roll(3);
      game.roll(4);
      [...Array(16)].forEach(() => game.roll(0));
      const scoreData = game.score();
      expect(scoreData[0].leftBox).toEqual("");
      expect(scoreData[0].rightBox).toEqual("X");
      expect(scoreData[0].cumulativeScore).toEqual(17);
    });

    it("should correctly handle a perfect game", () => {
      const game = new Game();
      [...Array(12)].forEach(() => game.roll(10));
      const scoreData = game.score();
      expect(scoreData[scoreData.length - 1].cumulativeScore).toEqual(300);
    });
  });

  describe("simulatePlayer", () => {
    it("should simulate a player's roll and update the rolls array and withinFrame accordingly", () => {
      const game = new Game();
      game.reset();
      const originalWithinFrame = game.withinFrame;
      game.simulatePlayer();
      expect(game.rolls.length).toEqual(1);

      if (game.rolls[0] === 10) {
        //strike
        expect(game.withinFrame).toEqual(1);
        expect(game.frame).toEqual(2);
      } else {
        expect(game.withinFrame).toEqual(originalWithinFrame + 1);
        expect(game.frame).toEqual(1);
      }
    });

    it("should increment the game frame to 11 and stop", () => {
      const game = new Game();
      for (let i = 0; i < 25; i++) {
        game.simulatePlayer();
      }
      expect(game.frame).toEqual(11);
    });
  });

  describe("create", () => {
    const game = new Game();
    it("should create a new Game instance", () => {
      const newGame = Game.create();
      expect(newGame instanceof Game).toBe(true);
    });
  });

  describe("pinsUp", () => {
    const game = new Game();
    it("should return the number of pins still standing after the previous roll", () => {
      game.roll(3);
      expect(game.pinsUp()).toEqual(7);
      game.roll(7);
      expect(game.pinsUp()).toEqual(10);
      game.roll(10);
      expect(game.pinsUp()).toEqual(10);
    });
  });
});
