import * as glob from "@actions/glob";
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
    depthLimit: 2,
    nodir: false,
    nofile: false,
    filter: (item) => {
      const pattern = path.join(workingDirectory, contentDirectory);
      return !item.path.startsWith(pattern) && !pattern.includes(item.path);
    },
  });
  core.startGroup("pathsToDelete");
  pathsToDelete.forEach((p) => {
    core.info(" - " + p.path);
  });
  core.endGroup();

  // delete
  core.startGroup("deleting");
  pathsToDelete.forEach((file) => {
    try {
      core.info(`deleting ${file.path}`);
      const stat = fs.statSync(file.path);
      if (stat.isDirectory()) {
        fs.rmdirSync(file.path, { recursive: true });
      }
      if (stat.isFile()) {
        fs.rmSync(file.path);
      }
    } catch (e) {
      core.info(`failed to delete ${file.path}: ${e}`);
    }
  });
  core.endGroup();
}

run();
