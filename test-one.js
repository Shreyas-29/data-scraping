const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const xlsx = require("xlsx");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    return userDataArray;
  } catch (error) {
    console.error("Error scraping user data:", error);
    return [];
  }
}

async function scrapeUserListFromBatch(urls) {
  const allUserData = [];
  for (const url of urls) {
    const userData = await scrapeUserList(url);
    allUserData.push(...userData);
  }
  return allUserData;
}

async function scrapeAllUserList(urls, batchSize) {
  const allUserData = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    const batchUrls = urls.slice(i, i + batchSize);
    const batchUserData = await scrapeUserListFromBatch(batchUrls);
    allUserData.push(...batchUserData);
    console.log(
      `Scraped ${batchUrls.length} URLs. Total scraped: ${allUserData.length}`
    );
    await delay(500); // Add a delay to avoid overloading the website
  }
  return allUserData;
}

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

function appendToExcelFile(data, filePath) {
  const existingData = fs.existsSync(filePath)
    ? xlsx.readFile(filePath)
    : { SheetNames: [], Sheets: {} };
  const sheetName = "User Data";
  const newSheetData = xlsx.utils.json_to_sheet(data, {
    header: Object.keys(data[0]),
  });

  if (!existingData.SheetNames.includes(sheetName)) {
    existingData.SheetNames.push(sheetName);
    existingData.Sheets[sheetName] = newSheetData;
  } else {
    const existingSheetData = xlsx.utils.sheet_to_json(
      existingData.Sheets[sheetName]
    );
    const combinedData = existingSheetData.concat(data);
    existingData.Sheets[sheetName] = xlsx.utils.json_to_sheet(combinedData, {
      header: Object.keys(data[0]),
    });
  }

  xlsx.writeFile(existingData, filePath);
}

async function main() {
  const xmlFilePath = "data.xml"; // Specify the path to your XML file
  const urls = parseUrlsFromXml(xmlFilePath);
  if (urls.length === 0) {
    console.error("No URLs found in the XML file.");
    return;
  }
  const batchSize = 10; // Specify the batch size
  const startIndex = 0; // Change this to the index where you want to start scraping
  const endIndex = startIndex + batchSize;

  const userData = await scrapeAllUserList(
    urls.slice(startIndex, endIndex),
    batchSize
  );
  appendToExcelFile(userData, "user_general_data.xlsx");
  console.log("User data saved to user_general_data.xlsx");
}

main();
