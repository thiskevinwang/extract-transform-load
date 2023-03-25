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
  const negativeGlob =
    "!" + path.join(workingDirectory, contentDirectory, "**", "*");
  core.info(`negativeGlob = ${negativeGlob}`);

  const globber = await glob.create(negativeGlob);
  const files = await globber.glob();
  core.info(`files = ${files}`);

  // delete
  files.forEach((file) => {
    core.info(`deleting ${file}`);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      fs.rmdirSync(file, { recursive: true });
    }
    if (stat.isFile()) {
      fs.rmSync(file);
    }
  });
}

run();
