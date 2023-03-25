import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import walk from "klaw-sync";
import { rimraf } from "rimraf";

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

  await rimraf(negativeGlob, { glob: true });
}

run();
