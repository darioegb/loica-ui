import { isRtl, logicalKey } from "../direction";

const element = (dir?: string): HTMLElement => {
  const div = document.createElement("div");
  if (dir) div.setAttribute("dir", dir);
  document.body.append(div);
  return div;
};

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute("dir");
});

describe("isRtl", () => {
  it("reads the dir attribute of the element and of its ancestors", () => {
    expect(isRtl(element("rtl"))).toBe(true);
    expect(isRtl(element("ltr"))).toBe(false);
    expect(isRtl(element())).toBe(false);
    document.documentElement.dir = "rtl";
    expect(isRtl(element())).toBe(true);
  });

  it("reads the direction of the CSS", () => {
    const div = element();
    div.style.direction = "rtl";
    expect(isRtl(div)).toBe(true);
  });

  it("is false without an element", () => {
    expect(isRtl(null)).toBe(false);
  });
});

describe("logicalKey", () => {
  it("keeps every key in left-to-right text", () => {
    const div = element();
    expect(
      ["ArrowLeft", "ArrowRight", "ArrowUp", "Home"].map((key) =>
        logicalKey(key, div),
      ),
    ).toEqual(["ArrowLeft", "ArrowRight", "ArrowUp", "Home"]);
  });

  it("swaps the horizontal arrows in right-to-left text, and nothing else", () => {
    const div = element("rtl");
    expect(
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "a"].map(
        (key) => logicalKey(key, div),
      ),
    ).toEqual(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "a"]);
  });
});
