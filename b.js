const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const fs = require("fs");
const { promisify } = require("util");
const parseString = promisify(require("xml2js").parseString);

async function parseXML(xmlFilePath) {
  try {
    const xmlData = await fs.promises.readFile(xmlFilePath, "utf-8");
    const result = await parseString(xmlData);
    const urls = result.urlset.url.map((url) => url.loc[0]);
    return urls;
  } catch (error) {
    console.error("Error parsing XML:", error);
    return [];
  }
}

async function scrapeBasicUserData(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const userDataArray = [];

    // Find the parent element that contains all user data
    const parentElements = $(
      "div.jcard.lawyer-card.lawyer-card-status--premium.-gold.-with-comparison"
    );

    parentElements.each((index, parentElement) => {
      const name = $(".name.lawyer-name a.url.mainprofilelink", parentElement)
        .text()
        .trim();
      const profileLink = $(
        ".name.lawyer-name a.url.mainprofilelink",
        parentElement
      ).attr("href");
      const tagline = $(".lawyer-tagline", parentElement).text().trim();
      const phone = $("li.-phone a", parentElement).attr("href") || "";
      const description = $(".lawyer-description.-hide-tablet", parentElement)
        .text()
        .trim();
      const website =
        $("a.button-ghost[href^='http']", parentElement).attr("href") || "";
      const freeConsultation =
        $("div.buttons-label--premium.-hide-desktop", parentElement)
          .text()
          .trim() === "Free Consultation";

      const userData = {
        name,
        profileLink,
        tagline,
        phone,
        description,
        website,
        freeConsultation,
      };
      userDataArray.push(userData);
    });

    // Create an Excel file and store the user data
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(userDataArray);
    xlsx.utils.book_append_sheet(wb, ws, "User Data");
    xlsx.writeFile(wb, "user_data.xlsx");

    console.log("User data saved to user_data.xlsx");
  } catch (error) {
    console.error("Error scraping user data:", error);
  }
}

async function scrapeDetailedUserData(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const name = $(".fn.lawyer-name").text().trim();
    const experience = $("li.iconed-line span.jicon-experience + time")
      .text()
      .trim();
    const law = $("li.iconed-line:contains('Criminal Law')").text().trim();
    const reviewLink = $("a[data-gtm-label='Review This Lawyer']").attr("href");
    const phone = $("a[data-button-tag='call']")
      .attr("href")
      .replace("tel:", "");
    const website = $("a[data-button-tag='website']").attr("href");

    // const locationElement = $("li.iconed-line span.jicon-jurisdictions + span");
    // const location =
    //   locationElement.length > 0 ? locationElement.text().trim() : "";

    const biographyElement = $("div#biography span#bio");
    const biography =
      biographyElement.length > 0 ? biographyElement.text().trim() : "";

    const practiceAreaArray = [];
    $("li.iconed-line:contains('Criminal Law')").each((index, element) => {
      const practiceArea = $(element).text().trim();
      practiceAreaArray.push(practiceArea);
    });
    const practiceArea = practiceAreaArray.join(", ");

    const detailedUserData = {
      name,
      experience,
      law,
      //   location,
      reviewLink,
      phone,
      website,
      biography,
      practiceArea,
    };

    console.log("Detailed User Data:", detailedUserData);

    return detailedUserData;
  } catch (error) {
    console.error("Error scraping detailed user data:", error);
    return null;
  }
}

async function scrapeAndStoreUserData(userList) {
  const scrapedProfiles = new Set();
  const detailedUserDataArray = [];

  for (const url of userList) {
    if (!scrapedProfiles.has(url)) {
      const basicUserData = await scrapeBasicUserData(url);
      if (basicUserData) {
        const detailedUserData = await scrapeDetailedUserData(
          basicUserData.viewProfileLink
        );
        if (detailedUserData) {
          detailedUserDataArray.push(detailedUserData);
          scrapedProfiles.add(url);
        }
      }
    }
  }

  // Create an Excel file and store the user data
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(detailedUserDataArray);
  xlsx.utils.book_append_sheet(wb, ws, "User Data");
  xlsx.writeFile(wb, "user_data.xlsx");

  console.log("User data saved to user_data.xlsx");
}

module.exports = scrapeAndStoreUserData;

parseXML("test.xml");
