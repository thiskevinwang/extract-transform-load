import * as core from "@actions/core";

import mdxExtractor from "../extractors/mdx.js";
import ymlExtractor from "../extractors/yml.js";
import jsonExtractor from "../extractors/json.js";

async function run(): Promise<void> {
  core.info("actions/extract");
  const workingDirectory = core.getInput("working-directory");
  const contentDirectory = core.getInput("content-directory");

  // NOTE: Extractors will read repo contents from the FS and replace files
  //       with serialized VFile objects. Passing serialized VFile objects
  //       between jobs is primarily a means to an end to achieve splitting
  //       ETL phases in to separate jobs. The tradeoff is slightly clunkier
  //       ergonomics for passing data between phases, but improved optics
  //       when viewing / debugging workflows in the GitHub UI.
  // QUESTION: do we want to conditionally extract?
  // QUESTION: is there a more favorable/pluggable interface for extractors?
  await mdxExtractor({ workingDirectory, contentDirectory });
  await ymlExtractor();
  await jsonExtractor({
    workingDirectory,
    dataDirectory: "data" /* TODO: don't hard code */,
  });
}

run();
