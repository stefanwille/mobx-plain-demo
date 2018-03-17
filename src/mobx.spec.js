const { observable, decorate, autorun } = require("mobx");

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

    it("lets a function run a store", () => {
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
});
