import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parseFrontMatter } from "../lib/frontMatter.ts";

test("parses quoted strings, escapes and bare numbers; body is kept", () => {
  const r = parseFrontMatter('---\ntitle: "A \\"quoted\\" title"\nimage2At: 2\nflag: true\n---\nBody **here**\n');
  assert.deepEqual(r.data, { title: 'A "quoted" title', image2At: 2, flag: true });
  assert.equal(r.content, "Body **here**\n");
});

test("no front matter: empty data, whole text as content", () => {
  assert.deepEqual(parseFrontMatter("Just text"), { data: {}, content: "Just text" });
});

test("nested or malformed YAML throws instead of being misread", () => {
  assert.throws(() => parseFrontMatter("---\nlist:\n  - a\n---\nx"));
});

test("every shipped post parses with the fields the blog needs", () => {
  for (const dir of ["content/blog/posts", "content/blog/posts-hi"]) {
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
      const { data, content } = parseFrontMatter(fs.readFileSync(path.join(dir, f), "utf8"));
      assert.ok(typeof data.title === "string" && data.title, `${f} title`);
      assert.ok(content.trim().length > 100, `${f} body`);
      if (dir.endsWith("posts")) assert.match(String(data.date), /^\d{4}-\d{2}-\d{2}$/, `${f} date`);
    }
  }
});
