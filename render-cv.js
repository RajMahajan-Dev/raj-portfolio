const puppeteer = require("puppeteer-core");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/home/hatch/.cache/puppeteer/chrome/linux-157.0.8103.78/chrome-linux64/chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("file://" + path.resolve(__dirname, "cv-source.html"), { waitUntil: "load" });
  const height = await page.evaluate(() => document.querySelector(".page").getBoundingClientRect().height);
  console.log("page height px:", height, "target ~1122px (297mm at 96dpi)");
  await page.pdf({
    path: path.resolve(__dirname, "public/Raj_Mahajan_CV.pdf"),
    width: "210mm",
    height: "297mm",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
  });
  await browser.close();
  console.log("PDF written");
})();
