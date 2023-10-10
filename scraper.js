const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

async function scrapeAndStoreDetailedUserData(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets["User Data"];
    const userDataArray = xlsx.utils.sheet_to_json(worksheet);

    const detailedUserDataArray = [];

    for (const userData of userDataArray) {
      const profileUrl = userData.profileLink;
      const detailedUserData = await scrapeDetailedUserData(profileUrl);

      if (detailedUserData) {
        detailedUserDataArray.push(detailedUserData);
      }
    }

    // Create an Excel file for detailed user data
    const detailedWb = xlsx.utils.book_new();
    const detailedWs = xlsx.utils.json_to_sheet(detailedUserDataArray);
    xlsx.utils.book_append_sheet(detailedWb, detailedWs, "Detailed User Data");
    xlsx.writeFile(detailedWb, "detailed_user_data.xlsx");

    console.log("Detailed user data saved to detailed_user_data.xlsx");
  } catch (error) {
    console.error("Error scraping detailed user data:", error);
  }
}

// async function scrapeDetailedUserData(url) {
//   try {
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);

//     // Extract detailed user data as needed
//     const name = $(".fn.lawyer-name").text().trim();
//     const experience = $("li.iconed-line:contains('Tax Law')").text().trim();
//     const law = $("li.iconed-line:contains('Law')").text().trim();
//     // Add more scraping logic for other data

//     const detailedUserData = {
//       name,
//       experience,
//       law,
//       // Add more fields here
//     };

//     console.log("Detailed user data:", detailedUserData);

//     return detailedUserData;
//   } catch (error) {
//     console.error("Error scraping detailed user data:", error);
//     return null;
//   }
// }
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

const userFilePath = "user_data.xlsx";
scrapeAndStoreDetailedUserData(userFilePath);
