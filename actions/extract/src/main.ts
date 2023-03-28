import { findDown } from "vfile-find-down";
import { writeSync } from "to-vfile";
import * as path from "path";
import * as core from "@actions/core";

async function run(): Promise<void> {
  core.info("actions/extract");
  const workingDirectory = core.getInput("working-directory");
  const contentDirectory = core.getInput("content-directory");
  core.info(`workingDirectory = ${workingDirectory}`);
  core.info(`contentDirectory = ${contentDirectory}`);

  const files = await findDown(".mdx", [
    path.join(workingDirectory, contentDirectory),
  ]);

  core.notice(`found ${files.length} files`);

  files.map((file) => {
    core.startGroup(`writing ${file}`);
    core.info(file.value.toString());
    writeSync(file, { encoding: "utf8" });
    core.endGroup();
  });
}

run();
