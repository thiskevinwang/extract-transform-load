import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { findDown } from "vfile-find-down";
import { VFile } from "vfile";

async function run(): Promise<void> {
  core.info("actions/load");
  const workingDirectory = core.getInput("working-directory");
  const contentDirectory = core.getInput("content-directory");
  core.info(`workingDirectory = ${workingDirectory}`);
  core.info(`contentDirectory = ${contentDirectory}`);

  const files = await findDown(".mdx", [
    path.join(workingDirectory, contentDirectory),
  ]);

  core.notice(`found ${files.length} files`);

  // load files
  files.forEach((file) => {
    core.startGroup(file.path);
    // deserialize VFile object
    const data = JSON.parse(fs.readFileSync(file.path, "utf8"));
    const vfile = new VFile(data);
    // log data
    core.info(JSON.stringify(vfile.data, null, 2));
    // log deserialized value
    core.info(vfile.value.toString());
    core.endGroup();
  });
}

run();
