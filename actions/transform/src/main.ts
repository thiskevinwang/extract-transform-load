import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { findDown } from "vfile-find-down";
import { VFile } from "vfile";
import type { VFileCoreOptions } from "vfile/lib";
import { writeSync } from "to-vfile";

interface TransformOptions {
  // not final
  plugins: ((content: string) => string)[];
}

async function run(opts: TransformOptions): Promise<void> {
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

    // deserialize VFile object
    const vfileOptions: VFileCoreOptions = JSON.parse(
      fs.readFileSync(file.path, "utf8")
    );
    const vfile = new VFile(vfileOptions);

    // apply transformations
    let newValue = vfile.value;

    opts.plugins.forEach((fn) => {
      newValue = fn(newValue.toString());
    });

    vfile.value = newValue;

    // serialize VFile object; The following `job` will deserialize this and
    // and pass it to a VFile constructor.
    vfile.value = JSON.stringify(vfile);

    writeSync(vfile, { encoding: "utf8" });
    core.endGroup();
  });
}

run({
  plugins: [
    // crude example of a transformation
    (content) =>
      "--- TRANSFORM START ---\n" +
      new Date().toISOString() +
      "\n" +
      content +
      "\n--- TRANSFORM END ---",
  ],
});
