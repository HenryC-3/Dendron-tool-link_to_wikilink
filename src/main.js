const replace = require("replace-in-file");
const recursive = require("recursive-readdir");
const path = require("path");

const fileNamePrefix = "hello.";
const fileExtension = ".html";
const dir = path.join(__dirname, "../test/demo");
// comment out code above, un-comment code blow, put absolute path of your target dir
// const dir = ""

const MDLinkReg = /\[(.*?)\]\((\S*?) ?('(.*?)')?\)/; // // https://regex101.com/r/fTJqF7/1

try {
    recursive(dir, function (_, files) {
        const results = replace.sync({
            files: files,
            from: new RegExp(MDLinkReg, "g"),
            to: linkConvertor,
        });
        console.log("Done");
        console.table(results);
    });
} catch (error) {
    console.error("Error occurred:", error);
}

function linkConvertor(str) {
    const group = str.match(MDLinkReg);
    const label = group[1];
    const link = group[2];
    if (isAssetsLink(link) || isWebLink(link)) {
        return `[${label}](${link})`; // process link "/assets/image.png" or "https://"
    } else {
        let [path, heading] = link.split("#"); // process link "/a/b/c.html#heading-name"
        const noteName = path // remove ".html", then convert "/a/b/c" to "a.b.c"
            .replace(`${fileExtension}`, "")
            .split("/")
            .join(".")
            .substring(1);
        return heading
            ? `[[${fileNamePrefix}${noteName}#${heading}]]`
            : `[[${fileNamePrefix}${noteName}]]`;
    }
}

function isAssetsLink(str) {
    const reg = /^\/assets\//;
    return reg.test(str);
}

function isWebLink(str) {
    const reg = /^https:\/\//;
    return reg.test(str);
}