const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors()); // Add cors middleware

const puppeteer = require("puppeteer");

app.get("/proxy", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--enable-features=NetworkService",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-accelerated-2d-canvas",
        "--disable-gl-drawing-for-tests",
        "--disable-features=site-per-process",
      ],
      defaultArgs: [
        "--enable-automation", // Enables automation for Chromium
        "--disable-background-timer-throttling", // Disables throttling of setTimeout/setInterval in background pages.
        "--disable-backgrounding-occluded-windows", // Prevents background tabs from being throttled down to save resources.
        "--disable-breakpad", // Disables breakpad crashes.
        "--disable-client-side-phishing-detection", // Disables client-side phishing detection.
        "--disable-default-apps", // Disables installation of default apps on first run.
        "--disable-extensions", // Disables extensions.
        "--disable-features=TranslateUI", // Disables the translation infobar from appearing when page is not in default language.
        "--disable-hang-monitor", // Disables the hang monitor.
        "--disable-ipc-flooding-protection", // Disables IPC flooding protection.
        "--disable-popup-blocking", // Disables pop-up blocking.
        "--disable-prompt-on-repost", // Disables the "Confirm form resubmission" dialog that comes up when doing a page reload with POST data.
        "--disable-renderer-backgrounding", // Backgrounds renderer processes when they're not visible.
        "--disable-sync", // Disables syncing browser data to a Google Account.
        "--force-fieldtrials=*BackgroundTracing/default/", // Forces the use of default field trials for background tracing.
        "--metrics-recording-only", // Slows down the maximum rate of web platform timers to 1ms.
        "--no-first-run", // Skip first run wizards
        "--mute-audio", // Mutes audio.
        "--safebrowsing-disable-auto-update", // Disables auto-updating of Safe Browsing lists, which disables downloading of new lists.
      ],
    });

    const page = await browser.newPage();

    // Enable cookies
    await page.setCookie({
      name: "your_cookie_name",
      value: "your_cookie_value",
      domain: "your_domain",
      path: "your_path",
    });

    const targetUrl = req.query.targetUrl;

    await page.goto(targetUrl);

    const responseContent = await page.content();

    const jsonData = await page.evaluate(() => {
      const preElement = document.querySelector("pre");
      if (preElement && preElement.textContent.trim()) {
        return JSON.parse(preElement.textContent.trim());
      } else {
        return document.querySelector("body").textContent;
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
