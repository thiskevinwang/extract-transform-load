import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import walk from "klaw-sync";

async function run(): Promise<void> {
  core.info("actions/transform");
  const workingDirectory = core.getInput("working-directory");
  const contentDirectory = core.getInput("content-directory");
  core.info(`workingDirectory = ${workingDirectory}`);
  core.info(`contentDirectory = ${contentDirectory}`);

  const files = walk(path.join(workingDirectory, contentDirectory), {
    nodir: true,
    traverseAll: true,
    filter: (item) => {
      // ends with .mdx or .md
      return !!item.path.match(/\.(mdx|md)$/);
    },
  });

  // crude transformation
  files.forEach((file) => {
    core.startGroup(file.path);
    const content = fs.readFileSync(file.path, "utf8");
    core.info(content);
    const newContent = content + " -- TRANSFORMED";
    fs.writeFileSync(file.path, newContent, "utf8");
    core.endGroup();
  });
}

run();
