import { delay, filter, fork, map, read, wait, write, inspect, reduce, from, list } from "./streamHelper";
import { Stream } from "stream";
import { createWriteStream } from "fs";

const getRandom = (max: number) => Math.floor(Math.random() * max);

const getTestStream = (count: number, delay: number = 1) => read((size, times) => {
    if (times > count) return null;
    return wait(delay).then(() => ({ id: times, num: getRandom(10) + 1, size }))
})

getTestStream(10)
    .pipe(map((item) => ({ ...item, normalMap: getRandom(item.num * 10) })))
    .pipe(filter((item) => item.id % 5 !== 0))
    .pipe(delay(1000))
    .pipe(map((item) => Promise.resolve({ ...item, asyncMap: getRandom(item.normalMap * item.num * 10) })))
    .pipe(inspect())
    // .pipe(reduce((res, item) => `${res ? `${res}-` : ''}[${item.id},${item.num},${item.num},${item.normalMap},${item.asyncMap}]`, ""))
    .pipe(fork(
        (stream) => stream
            .pipe(map((item) => ({ child: 1, ...item })))
            .pipe(write((chunk) => console.log(chunk))),

        (stream) => stream
            .pipe(delay(2000))
            .pipe(map((item) => ({ child: 2, ...item })))
            .pipe(write((chunk) => console.log(chunk))),

    ));

// process.stdin
//     .pipe(map((data) => data.toString().toUpperCase()))
//     .pipe(fork(
//         (stream) => stream.pipe(process.stdout),
//         (stream) => stream.pipe(createWriteStream(`${__dirname}/output1.txt`)),
//     ))


// from([1, 2, 3, 4, 5])
//     .pipe(inspect())
//     .pipe(map(item => ({ [item]:item })))
//     .pipe(list())
//     .pipe(write((chunk) => console.log(chunk)));