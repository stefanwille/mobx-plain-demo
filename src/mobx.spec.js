const { observable, decorate, autorun, computed } = require("mobx");

describe("MobX Todo", () => {
  describe("observable property", () => {
    class Todo {
      constructor() {
        this.title = "";
      }
    }

    decorate(Todo, {
      title: observable
    });

    const todo = new Todo();

    it("can be read and updated", () => {
      todo.title = "Hello";
      expect(todo.title).toBe("Hello");
    });
  });

  describe("autorun()", () => {
    let Todo;
    let observerCalls = 0;
    let todo;
    let disposer;

    beforeEach(() => {
      observerCalls = 0;
      Todo = class {
        constructor() {
          this.title = "";
        }
      };

      decorate(Todo, { title: observable });

      todo = new Todo();

      disposer = autorun(() => {
        observerCalls++;
        todo.title;
      });
      expect(observerCalls).toBe(1);
    });

    it("lets a function as a reaction to store changes", () => {
      // autorun() runs the callback function immediately to learn which properties it looks at.
      expect(observerCalls).toBe(1);
      todo.title = "yeah";
      expect(observerCalls).toBe(2);
      todo.title = "great";
      expect(observerCalls).toBe(3);
    });

    it("returns a 'disposer' function that can remove the callback from the store", () => {
      expect(observerCalls).toBe(1);
      todo.title = "yeah";
      expect(observerCalls).toBe(2);
      disposer();
      todo.title = "great";
      expect(observerCalls).toBe(2);
    });
  });

  describe("computed property", () => {
    class Square {
      constructor() {
        this.width = 0;
      }

      get area() {
        return this.width * this.width;
      }
    }

    decorate(Square, { width: observable, area: computed });

    const square = new Square();

    it("updates automatically", () => {
      square.width = 2;
      expect(square.area).toBe(4);
      square.width = 3;
      expect(square.area).toBe(9);
    });
  });
});
