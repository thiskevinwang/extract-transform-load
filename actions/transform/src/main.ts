import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import walk from "klaw-sync";

async function run(): Promise<void> {
  core.info("actions/transform");
  const workingDirectory = core.getInput("working-directory");
  const contentDirectory = core.getInput("content-dir");
  core.info(`workingDirectory = ${workingDirectory}`);
  core.info(`contentDirectory = ${contentDirectory}`);

  const files = walk(path.join(workingDirectory, contentDirectory), {
    nodir: true,
    traverseAll: true,
    filter: (item) => {
      return item.path.endsWith(".md");
    },
  });

  // crude transformation
  files.forEach((file) => {
    console.log(file.path);
    const content = fs.readFileSync(file.path, "utf8");
    const newContent = content + " -- TRANSFORMED";
    fs.writeFileSync(file.path, newContent, "utf8");
  });
}

run();
