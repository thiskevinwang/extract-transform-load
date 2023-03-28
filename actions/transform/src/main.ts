import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { findDown } from "vfile-find-down";
import { VFile } from "vfile";
import { writeSync } from "to-vfile";

async function run(): Promise<void> {
  core.info("actions/transform");
  const workingDirectory = core.getInput("working-directory");
  const contentDirectory = core.getInput("content-directory");
  core.info(`workingDirectory = ${workingDirectory}`);
  core.info(`contentDirectory = ${contentDirectory}`);

  const files = await findDown(".mdx", [
    path.join(workingDirectory, contentDirectory),
  ]);

  core.notice(`found ${files.length} files`);

  // crude transformation
  files.forEach((file) => {
    core.startGroup(file.path);
    // deserialize VFile object
    const data = JSON.parse(fs.readFileSync(file.path, "utf8"));
    const vfile = new VFile(data);

    // transform
    const newValue = vfile.value + " -- TRANSFORMED";
    vfile.value = newValue;

    // serialize VFile object
    vfile.value = JSON.stringify(vfile);

    writeSync(vfile, { encoding: "utf8" });
    core.endGroup();
  });
}

run();
