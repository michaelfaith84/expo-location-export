import Exporter from "../src/Exporter";
import { PACKAGE_INFO } from "../src/pkgInfo";
import { exampleGPSReturn, exampleGPSReturnSeries } from "./test.data";

describe("Single Basic", () => {
  const exporter = new Exporter();

  test("Did it create correctly?", () => {
    expect(exporter).toBeDefined();
    expect(exporter.global.name).toEqual(
      `${PACKAGE_INFO.name}@${PACKAGE_INFO.version}`,
    );
    expect(exporter.global.url).toEqual(`${PACKAGE_INFO.homepage}`);
    expect(exporter.data.length).toBe(0);
  });

  test("Can we dump and load? (empty)", () => {
    const dump = exporter.dump();
    const loaded = Exporter.load(dump);
    expect(exporter).toEqual(loaded);
  });

  test("Can we add GPS return?", () => {
    exporter.add({ ...exampleGPSReturn });
    expect(exporter.data.length).toBe(1);
    expect(exporter.data[0]?.id).not.toBeDefined();
    expect(exporter.data[0]?.props).not.toBeDefined();
    expect(exporter.data[0]).toMatchObject(exampleGPSReturn);
  });

  test("Does our dump/load still work? (one entry)", () => {
    const dump = exporter.dump();
    const loaded = Exporter.load(dump);
    expect(exporter).toMatchObject(loaded);
  });
});

describe("Series With ID", () => {
  const exporter = new Exporter({ id: "test series" });

  test("Did it create correctly?", () => {
    expect(exporter).toBeDefined();
    expect(exporter.global.name).toEqual(
      `${PACKAGE_INFO.name}@${PACKAGE_INFO.version}`,
    );
    expect(exporter.global.url).toEqual(`${PACKAGE_INFO.homepage}`);
    expect(exporter.data.length).toBe(0);
    expect(exporter.global.id).toBe("test series");
  });

  test("Can we dump and load? (empty)", () => {
    const dump = exporter.dump();
    const loaded = Exporter.load(dump);
    expect(exporter).toEqual(loaded);
    expect(exporter.global.name).toEqual(
      `${PACKAGE_INFO.name}@${PACKAGE_INFO.version}`,
    );
  });

  test("Can we add a series?", () => {
    exampleGPSReturnSeries.forEach((ea) => {
      exporter.add({ ...ea });
    });
    expect(exporter.data.length).toBe(exampleGPSReturnSeries.length);
    expect(exporter.data[0]?.id).not.toBeDefined();
    expect(exporter.data[0]?.props).not.toBeDefined();
    expect(exporter.data).toMatchObject(exampleGPSReturnSeries);
  });

  test("Does our dump/load still work? (series)", () => {
    const dump = exporter.dump();
    const loaded = Exporter.load(dump);
    expect(exporter.data.length).toBe(exampleGPSReturnSeries.length);
    expect(exporter).toMatchObject(loaded);
    expect(exporter.global.id).toBe("test series");
    expect(exporter.global.name).toEqual(
      `${PACKAGE_INFO.name}@${PACKAGE_INFO.version}`,
    );
  });
});
