import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { findDown } from "vfile-find-down";

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
    const content = fs.readFileSync(file.path, "utf8");
    core.info(JSON.stringify(file.data, null, 2));
    core.info(content);
    const newContent = content + " -- TRANSFORMED";
    fs.writeFileSync(file.path, newContent, "utf8");
    core.endGroup();
  });
}

run();
