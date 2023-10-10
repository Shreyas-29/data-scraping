const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

async function scrapeUserList(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const userDataArray = [];

    const premiumParentElements = $("div.results-sponsored .jcard");
    const nonPremiumParentElements = $("div.results-lawyers .jcard");

    const scrapeUserData = (parentElement) => {
      const name = $("strong.name a.url", parentElement).text().trim();
      const profileLink = $("strong.name a.url", parentElement)
        .attr("href")
        .trim();
      const tagline = $(".lawyer-expl span", parentElement).text();
      const phoneElement = $("strong.-phone a", parentElement);
      const phone = phoneElement.length
        ? phoneElement.attr("href").replace("tel:", "").trim()
        : "";
      const address = $("span.-address", parentElement).text();
      const website = $(".-group a.-website", parentElement).attr("href");

      const practiceAreas = [];
      $("span.-practices", parentElement).each((index, element) => {
        const practiceText = $(element).text().trim();
        if (practiceText) {
          practiceAreas.push(practiceText);
        }
      });

      const lawSchools = [];
      $("span.-law-schools", parentElement).each((index, element) => {
        const lawSchoolText = $(element).text().trim();
        if (lawSchoolText) {
          lawSchools.push(lawSchoolText);
        }
      });
      // $("div.lawyer-detailed-info .group", parentElement).each(
      //   (index, groupElement) => {
      //     const groupText = $(groupElement).text().trim();
      //     if (groupText.startsWith("Tax, Business, Health Care")) {
      //       practiceAreas.push(groupText);
      //     } else if (groupText.startsWith("Rutgers School of Law-Newark")) {
      //       lawSchools.push(groupText);
      //     }
      //   }
      // );

      const userData = {
        Name: name,
        "Profile Link": profileLink,
        Tagline: tagline,
        Phone: phone,
        Address: address,
        Website: website,
        "Practice Areas": practiceAreas[0],
        "Law Schools": lawSchools[0],
      };
      userDataArray.push(userData);
    };

    premiumParentElements.each((index, parentElement) => {
      scrapeUserData(parentElement);
    });

    nonPremiumParentElements.each((index, parentElement) => {
      scrapeUserData(parentElement);
    });

    console.log("userDataArray", userDataArray);

    return userDataArray;
  } catch (error) {
    console.error("Error scraping user data:", error);
    return [];
  }
}

async function scrapeUserListFromUrls(urls) {
  const allUserData = [];

  for (const url of urls) {
    const userData = await scrapeUserList(url);
    console.log("url:", url, "userData:", userData);
    allUserData.push(...userData);
  }

  return allUserData;
}

// Function to parse the XML file and extract URLs
function parseUrlsFromXml(xmlFilePath) {
  try {
    const xmlData = fs.readFileSync(xmlFilePath, "utf-8");
    const $ = cheerio.load(xmlData, {
      xmlMode: true,
    });

    const urls = [];

    $("urlset url loc").each((index, element) => {
      const url = $(element).text().trim();
      urls.push(url);
    });

    return urls;
  } catch (error) {
    console.error("Error parsing XML file:", error);
    return [];
  }
}

// Entry point
async function main() {
  const xmlFilePath = "test.xml"; // Specify the path to your XML file
  const urls = parseUrlsFromXml(xmlFilePath);

  if (urls.length === 0) {
    console.error("No URLs found in the XML file.");
    return;
  }

  const allUserData = await scrapeUserListFromUrls(urls);

  if (allUserData.length === 0) {
    console.error("No user data scraped.");
    return;
  }

  // Create an Excel file and store the user data
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(allUserData, {});
  xlsx.utils.book_append_sheet(wb, ws, "User Data");
  xlsx.writeFile(wb, "user_data.xlsx");
  console.log("User data saved to user_data.xlsx");
}

main();
