import { findDown } from "vfile-find-down";
import { writeSync } from "to-vfile";
import * as path from "path";
import * as fs from "fs";
import * as core from "@actions/core";

async function run(): Promise<void> {
  core.info("actions/extract");
  const workingDirectory = core.getInput("working-directory");
  const contentDirectory = core.getInput("content-directory");
  core.info(`workingDirectory = ${workingDirectory}`);
  core.info(`contentDirectory = ${contentDirectory}`);

  // collect file paths
  const files = await findDown(".mdx", [
    path.join(workingDirectory, contentDirectory),
  ]);

  core.notice(`found ${files.length} files`);

  // populate files with content because `vfile-find-down` does not
  // and save files as serialized VFile objects.
  files.map((file) => {
    core.startGroup(`writing ${file.path}`);

    file.value = fs.readFileSync(file.path, "utf8");

    // smoke test pass of arbitrary VFile data
    file.data = {
      ...file.data,
      extract: 1,
    };

    core.info(file.toString("utf8"));

    // serialize VFile object
    file.value = JSON.stringify(file);
    writeSync(file, { encoding: "utf8" });

    core.endGroup();
  });
}

run();
