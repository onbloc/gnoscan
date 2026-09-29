import { createTabScrollMemory } from "./use-tab-scroll-memory";

const createEnv = (initialY: number) => {
  const saved = new Map<string, number>();
  const env = {
    y: initialY,
    scrollCalls: [] as number[],
    getScrollY: () => env.y,
    scrollTo: (y: number) => {
      env.scrollCalls.push(y);
      env.y = y;
    },
    read: (name: string) => saved.get(name) ?? null,
    write: (name: string, y: number) => void saved.set(name, y),
  };
  return env;
};

describe("createTabScrollMemory", () => {
  it("keeps the page in place on a first visit", () => {
    const env = createEnv(600);
    const memory = createTabScrollMemory(env);

    memory.leave("native");
    memory.enter("events");

    expect(env.scrollCalls).toEqual([]);
    expect(env.y).toBe(600);
  });

  it("restores the deepest position when a tab is revisited", () => {
    const env = createEnv(600);
    const memory = createTabScrollMemory(env);

    env.y = 2400;
    memory.track();
    // Scroll back up to the tab bar before switching.
    env.y = 600;
    memory.track();
    memory.leave("native");
    memory.enter("events");
    memory.leave("events");
    memory.enter("native");

    expect(env.scrollCalls).toEqual([2400]);
  });

  it("does not save a tab the user never scrolled into", () => {
    const env = createEnv(600);
    const memory = createTabScrollMemory(env);

    memory.leave("native");
    memory.enter("events");
    memory.leave("events");
    memory.enter("native");

    expect(env.scrollCalls).toEqual([]);
  });

  it("never scrolls up to a shallower saved position", () => {
    const env = createEnv(0);
    const memory = createTabScrollMemory(env);

    // Scrolling down to reach the tab bar saves the initial tab at that depth.
    env.y = 900;
    memory.track();
    memory.leave("transactions");
    memory.enter("native");
    env.y = 1200;
    memory.track();
    memory.leave("native");
    memory.enter("transactions");

    expect(env.scrollCalls).toEqual([]);
    expect(env.y).toBe(1200);
  });

  it("keeps the saved position when a revisited tab is left without scrolling deeper", () => {
    const env = createEnv(600);
    const memory = createTabScrollMemory(env);

    env.y = 2400;
    memory.track();
    env.y = 600;
    memory.leave("native");
    memory.enter("events");
    memory.leave("events");
    memory.enter("native");
    env.y = 600;
    memory.track();
    memory.leave("native");
    memory.enter("events");
    memory.leave("events");
    memory.enter("native");

    expect(env.scrollCalls).toEqual([2400, 2400]);
  });
});
