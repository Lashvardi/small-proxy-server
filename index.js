const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors()); // Add cors middleware

app.get("/proxy", async (req, res) => {
  try {
    // headless true
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const targetUrl = req.query.targetUrl;

    await page.goto(targetUrl);

    const responseContent = await page.content();

    // extract JSON data from the target page
    const jsonData = await page.evaluate(() => {
      console.log("inside evaluate");
      console.log(jsonData);
      const preElement = document.querySelector("pre");
      if (preElement && preElement.textContent.trim()) {
        return JSON.parse(preElement.textContent.trim());
      } else {
        console.log(jsonData);
        return null;
      }
    });

    if (!jsonData) {
      res.status(404).send("JSON data not found on the target page");
    } else {
      res.json(jsonData);
    }
    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
