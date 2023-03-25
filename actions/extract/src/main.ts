import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import walk from "klaw-sync";

async function run(): Promise<void> {
  core.info("actions/extract");
  const workingDirectory = core.getInput("working-directory");
  const contentDirectory = core.getInput("content-directory");
  core.info(`workingDirectory = ${workingDirectory}`);
  core.info(`contentDirectory = ${contentDirectory}`);

  // remove all folders that aren't the content directory
  const pathsToDelete = walk(workingDirectory, {
    depthLimit: 1,
    nofile: false,
    nodir: false,
    filter: (item) => {
      return !item.path.endsWith(contentDirectory);
    },
  });

  for (const e of pathsToDelete) {
    core.info(`deleting ${e.path}`);
    const stats = fs.lstatSync(e.path);
    if (stats.isDirectory()) {
      fs.rmdirSync(e.path, { recursive: true });
    }
    if (stats.isFile()) {
      fs.rmSync(e.path, { force: true });
    }
  }
}

run();
