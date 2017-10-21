"use strict"

const fs = require('fs');
const path = require('path');
const process = require("process");
const execSync = require('child_process').execSync;

let version = null;
["./qwebs/package.json",
"./qwebs-auth-jwt/package.json",
"./qwebs-https/package.json",
"./qwebs-mongo/package.json",
"./qwebs-nodemailer/package.json"
].forEach(file => {
    let p = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!version) {
        let tokens = p.version.split(".");
        let subversion = parseInt(tokens[2]) + 1;
        tokens.splice(2, 1, subversion);
        version = tokens.join(".");
    }
    p.version = version
    console.log(p.version)
    if (p.dependencies.qwebs) {
        p.dependencies.qwebs = "^" + p.version
    }
    fs.writeFileSync(file, JSON.stringify(p, null, 4), "utf8");
});

[
"qwebs",
"qwebs-auth-jwt",
"qwebs-https",
"qwebs-mongo",
"qwebs-nodemailer"
].forEach(dir => {
    
    process.chdir(dir);
    console.log('process.cwd(): ', process.cwd());
    execSync("git add -A");
    let message = "\"Version " + version + "\"";
    execSync("git commit -am " + message);
    execSync("git push");
    execSync("npm publish")
    process.chdir("..");
    console.log("complete")
});

