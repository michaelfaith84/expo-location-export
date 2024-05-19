import { flatten } from "../src/utlities";
import { exampleGPSReturn, exampleGPSReturnFlattened } from "./test.data";

describe("flatten", () => {
  test("Does it flatten?", () => {
    const flattened = flatten({ ...exampleGPSReturn });
    expect(flattened).not.toMatchObject(exampleGPSReturn);
    expect(flattened).toMatchObject(exampleGPSReturnFlattened);
  });
});
