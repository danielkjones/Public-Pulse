const {execSync} = require("child_process")

execSync("rm -rf build && cd ../website && yarn build && cp -r build ../ec2-postgraphile-and-frontend");
