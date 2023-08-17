const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { exec } = require("child_process");

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
async function newPage() {}

async function termin() {
  try {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      headless: false,
    });
    const page = await browser.newPage();
    // Navigate the page to a URL
    const url =
      "https://otv.verwalt-berlin.de/ams/TerminBuchen/wizardng/9fb5f584-606d-414b-b9cd-d7d0db3efe38?dswid=1717&dsrid=366&st=2&v=1692275230668";
    const response = await page.goto(url);
    console.log(page.url());

    // Wait for the page to load the content and any potential navigations
    await page.waitForNavigation();

    console.log(page.url());

    // Wait for the button to appear
    await page.waitForSelector("#applicationForm\\:managedForm\\:proceed");

    // Click the button
    await page.click("#applicationForm\\:managedForm\\:proceed");

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

    // if (errorMessage) {
    //   console.log("error Message: ", errorMessage);
    // } else {
    //   console.log("no error message");
    // }

    // const data = await page.evaluate(() => {
    //   const results = [];

    //   // Select all elements with crayons-tag class
    //   const items = document.querySelectorAll(".messagesBox");
    //   items.forEach((item) => {
    //     // Get innerText of each element selected and add it to the array
    //     results.push(item);
    //   });
    //   return results;
    // });
    // console.log(data);

    // const pageContent = await page.content();
    // console.log("Page HTML:", pageContent);

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
