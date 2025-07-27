import fs from "node:fs";

const CHUNK_SIZE = 16;

const inputFile = "input.json";
const outputFile = "output.json";

const readStream = fs.createReadStream(inputFile, {
  highWaterMark: CHUNK_SIZE,
  encoding: "utf-8",
});

const writeStream = fs.createWriteStream(outputFile);

readStream.on("data", (chunk) => {
  console.log(`📥 Read chunk: [${chunk}]`);
  writeStream.write(chunk);
});

readStream.on("end", () => {
  console.log("Reading finished");
  writeStream.end();
});

writeStream.on("finish", () => {
  console.log("Writing finished");
});
