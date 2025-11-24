// build.cjs
const { build } = require('vite');

async function run() {
  try {
    await build();
    console.log("Vite build OK");
  } catch (err) {
    console.error("Vite build FAILED");
    console.error(err);
    process.exit(1);
  }
}

run();
