import { counter, write, buffer } from "../src";

describe("Test `concat` functionality", () => {
    it("should create concat each 3 chunks to a list chunk", (done) => {
        const writeMock = jest.fn();
        counter(5)
            .pipe(buffer(3))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[[0, 1, 2]], [[3, 4]]]);
                done()
            })
    })

    it("should create concat all chunks to a list chunk", (done) => {
        const writeMock = jest.fn();
        counter(5)
            .pipe(buffer())
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[[0, 1, 2, 3, 4]]]);
                done()
            })
    })
})