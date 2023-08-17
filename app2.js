const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const puppeteerExtra = require("puppeteer-extra");
const proxy = require("puppeteer-extra-plugin-proxy");
const { exec } = require("child_process");

// puppeteerExtra.use(proxy({ address: "192.168.0.54:8080" }));

// axios
//   .get(
//     "https://otv.verwalt-berlin.de/ams/TerminBuchen/wizardng/419203d6-969a-43b3-8e81-abe36075c3ac?dswid=5350&dsrid=690&st=2&v=1692034588061"
//   )
//   .then(function (response) {
//     // handle success
//     const $ = cheerio.load(response.data);
//     const pageTitle = $("h1").text();
//     console.log("Page Title:", pageTitle);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   });

async function termin() {
  try {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
      // executablePath: "/usr/bin/google-chrome",
      executablePath: "/usr/bin/google-chrome",
      headless: false,
    });
    // const context = await browser.createIncognitoBrowserContext();

    // const browser = await puppeteer.launch({
    //   headless: false,
    //   executablePath: "/usr/bin/firefox",
    // });

    const page = await browser.newPage();
    // await page.setUserAgent(
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763"
    // );
    // const randomDelay = Math.random() * 3000 + 2000; // Random delay between 2 to 5 seconds
    // await page.waitForTimeout(randomDelay);

    // Navigate the page to a URL
    const url =
      // "https://otv.verwalt-berlin.de/ams/TerminBuchen/wizardng?sprachauswahl=de";
      "https://otv.verwalt-berlin.de/ams/TerminBuchen";
    await page.goto(url);

    // await page.waitForNavigation();

    // setting page cookies to puppeteer
    // const cookies = await page.cookies();
    // await page.setCookie(...cookies);
    const randomDelay = Math.random() * 1000 + 500; // Random delay between 2 to 5 seconds
    await page.waitForTimeout(randomDelay);
    // clicking on "book an appointment"
    await page.waitForSelector("a.button.arrow-right");
    await page.evaluate(() => {
      window.localStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    });
    await page.click("a.button.arrow-right");
    await page.waitForTimeout(25000); // Wait for 35 seconds

    let newURL = page.url();
    console.log(newURL);

    await page.waitForNavigation();

    newURL = page.url();
    console.log(newURL);

    // clicking on the declaration of the data consent
    await page.waitForSelector("#xi-cb-1");
    await page.click("#xi-cb-1");
    // clicking on further button
    await page.click("#applicationForm:managedForm:proceed");

    await page.waitForNavigation();

    // selecting egypt from the menu
    await page.waitForSelector("#xi-sel-400");
    await page.select("#xi-sel-400", "287");
    // selecting one person from the menu
    await page.waitForSelector("#xi-sel-422");
    await page.select("#xi-sel-422", "1");
    // selecting no family member living with me from the menu
    await page.waitForSelector("#xi-sel-427");
    await page.select("#xi-sel-427", "2");
    // clicking on residence permit extend section
    await page.waitForSelector("#SERVICEWAHL_DE3287-0-2");
    await page.click("#SERVICEWAHL_DE3287-0-2");
    // clicking on employment section
    await page.waitForSelector("#SERVICEWAHL_DE_287-0-2-1");
    await page.click("#SERVICEWAHL_DE_287-0-2-1");
    // clicking on Residence permit for skilled workers looking for a job - granting (§ 20)
    await page.waitForSelector("#SERVICEWAHL_DE287-0-2-1-324661");
    await page.click("#SERVICEWAHL_DE287-0-2-1-324661");

    // clicking on further
    await page.waitForSelector("#applicationForm:managedForm:proceed");
    await page.click("#applicationForm:managedForm:proceed");

    await page.waitForNavigation();

    // Wait for the page to load the content (you might need to adjust the selector)
    await page.waitForSelector(".errorMessage");

    const errorMessage = await page.$eval(
      ".errorMessage",
      (element) => element.textContent
    );
    if (errorMessage) {
      console.log(errorMessage);
      // const audic = new Audic("audio.mp3");
      // await audic.play();
      termin();
    } else {
      console.log("found an appointment");
      // audio.play();
      playAudio();
    }

    await browser.close();
  } catch (error) {
    console.log("The error: ", error);
  }
}

termin();

function playAudio() {
  const audioFilePath = "public/alert.mp3"; // Replace with the actual path to your audio file

  // Use the 'open' command on macOS and 'xdg-open' on Linux to open the file with the default application
  // The 'start' command on Windows works for most common file types
  const command =
    process.platform === "win32"
      ? "start"
      : process.platform === "darwin"
      ? "open"
      : "xdg-open";

  exec(`${command} "${audioFilePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
      return;
    }
    console.log("File opened successfully");
  });

  // On macOS, the open command is used to open files with their default applications.
  // On Linux, the xdg-open command serves the same purpose.
  // On Windows, the start command is used to open files with the associated program.
  // Keep in mind that this approach uses the default system behavior to open files, so the success and behavior might vary based on the user's system configuration and associated applications. Also, note that the child_process.exec function is used here, which is synchronous and might block the event loop for a short period of time. If you need a more asynchronous approach, you can consider using the child_process.spawn function.
}
