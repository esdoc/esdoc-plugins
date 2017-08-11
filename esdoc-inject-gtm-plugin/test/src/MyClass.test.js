const assert = require("assert")
const path = require("path")
const fs = require("fs")
const cheerio = require("cheerio")

describe("test inject script result:", () => {
  it("has injected script tag title", () => {
    const html = fs.readFileSync("./test/out/index.html").toString()
    const $ = cheerio.load(html)
    assert.equal($("script").length, 1)
  })
})
