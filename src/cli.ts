import { electronNext } from "./index";
import utils from "./utils";

export function run() {
  const argv = utils.parseArgs(process.argv.slice(2));
  electronNext.create(argv)
    .then((code) => {
      process.exit(code);
    })
    .catch((error) => {
      console.error(error?.message || error);
      process.exit(1);
    });
}