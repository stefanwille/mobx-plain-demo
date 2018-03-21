const {
  configure,
  decorate,
  autorun,
  computed,
  extendObservable,
  observable,
  action
} = require('mobx');

describe('MobX', () => {
  configure({ enforceActions: true });

  describe('observable property', () => {
    class Todo {}
    decorate(Todo, {
      title: observable
    });

    const todo = new Todo();

    it('can be read and updated', () => {
      todo.title = 'Hello';
      expect(todo.title).toBe('Hello');
    });
  });

  describe('autorun()', () => {
    let Todo = class {
      setTitle(v) {
        this.title = v;
      }
    };
    decorate(Todo, { title: observable, setTitle: action });

    let todo;
    let observerCalls = 0;
    let disposer;

    beforeEach(() => {
      observerCalls = 0;

      todo = new Todo();

      disposer = autorun(() => {
        observerCalls++;
        todo.title;
      });
    });

    it('lets a function run as a reaction to store changes', () => {
      // autorun() runs the callback function immediately to learn which properties it looks at.
      expect(observerCalls).toBe(1);
      todo.setTitle('yeah');
      expect(observerCalls).toBe(2);
      todo.setTitle('great');
      expect(observerCalls).toBe(3);
    });

    it("returns a 'disposer' function that can remove the callback from the store", () => {
      //   expect(observerCalls).toBe(1);
      todo.setTitle('yeah');
      expect(observerCalls).toBe(2);
      disposer();
      todo.setTitle('great');
      expect(observerCalls).toBe(2);
    });
  });

  describe('reaction()', () => {
    let Todo;
    let observerCalls = 0;
    let todo;
    let disposer;

    beforeEach(() => {
      observerCalls = 0;
      class Todo {
        setTitle(v) {
          this.title = v;
        }
      }
      decorate(Todo, {
        title: observable,
        priority: observable,
        setTitle: action
      });

      todo = new Todo();

      disposer = autorun(() => {
        observerCalls++;
        todo.title;
      });
      expect(observerCalls).toBe(1);
    });

    it('lets a function as a reaction to store changes', () => {
      // autorun() runs the callback function immediately to learn which properties it looks at.
      expect(observerCalls).toBe(1);
      todo.setTitle('yeah');
      expect(observerCalls).toBe(2);
      todo.setTitle('great');
      expect(observerCalls).toBe(3);
    });

    it("returns a 'disposer' function that can remove the callback from the store", () => {
      expect(observerCalls).toBe(1);
      todo.setTitle('yeah');
      expect(observerCalls).toBe(2);
      disposer();
      todo.setTitle('great');
      expect(observerCalls).toBe(2);
    });
  });

  describe('computed property', () => {
    let reactionCallbackCalls = 0;
    class Square {
      constructor() {
        extendObservable(
          this,
          {
            width: 0,
            get area() {
              return this.width * this.width;
            },
            setWidth(v) {
              this.width = v;
            }
          },
          { setWidth: action }
        );
      }
    }

    const square = new Square();

    autorun(() => {
      reactionCallbackCalls++;
      square.area;
    });

    it('triggers reactions when a referenced property changes', () => {
      expect(reactionCallbackCalls).toBe(1);
      square.setWidth(2);
      expect(reactionCallbackCalls).toBe(2);
      square.setWidth(2);
      expect(reactionCallbackCalls).toBe(2);
    });
  });

  describe('action.bound', () => {
    class Order {
      constructor() {
        this.cancelCalls = 0;
      }
      cancel() {
        this.cancelCalls++;
      }
    }
    decorate(Order, {
      cancel: action.bound
    });

    const order = new Order();

    it('creates a bound action', () => {
      const cancel = order.cancel;
      cancel();
      expect(order.cancelCalls).toBe(1);
    });
  });
});
