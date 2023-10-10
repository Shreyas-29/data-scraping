const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const xlsx = require("xlsx");

async function scrapeUserList(url) {
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

const userListUrl = "https://www.justia.com/lawyers/criminal-law/texas";
scrapeUserList(userListUrl);
