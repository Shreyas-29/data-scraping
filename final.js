const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const xlsx = require("xlsx");

// Function to scrape user data from a URL
async function scrapeUserList(url) {
  try {
    const userDataArray = [];
    let currentPage = 1;
    let hasNextPage = true;

    // Scrape data from up to 25 pages
    while (hasNextPage && currentPage <= 25) {
      const pageUrl = `${url}?page=${currentPage}`;
      const response = await axios.get(pageUrl);
      const $ = cheerio.load(response.data);

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

      // Check if there's a next page by looking for the "Next" button
      hasNextPage = $("#pagination span.next a").length > 0;
      currentPage++;

      console.log(`Scraped data from page ${currentPage - 1}`);

      if (!hasNextPage) {
        break; // Exit the loop if there's no next page
      }
    }

    console.log("Current page: ", currentPage);

    return userDataArray;
  } catch (error) {
    console.error("Error scraping user data:", error);
    return [];
  }
}

async function scrapeUserListFromUrls(urls, startIndex, batchSize) {
  const allUserData = [];
  for (let i = startIndex; i < startIndex + batchSize && i < urls.length; i++) {
    const url = urls[i];
    console.log(`Scraping URL ${i + 1}/${urls.length}: ${url}`);
    const userData = await scrapeUserList(url);
    allUserData.push(...userData);
  }
  return allUserData;
}

// Function to parse URLs from an XML file
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
// Function to save user data to an Excel file
function saveUserDataToExcel(existingData, allUserData) {
  const uniqueUserNames = new Set(existingData.map((user) => user.Name));

  for (const userData of allUserData) {
    if (!uniqueUserNames.has(userData.Name)) {
      existingData.push(userData);
      uniqueUserNames.add(userData.Name);
    }
  }

  const ws = xlsx.utils.json_to_sheet(existingData);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "User Data");
  xlsx.writeFile(wb, "final_data.xlsx");
}

function readCurrentIndex() {
  try {
    const data = fs.readFileSync("current_index.txt", "utf-8");
    return parseInt(data, 10);
  } catch (error) {
    return 0;
  }
}

function writeCurrentIndex(currentIndex) {
  fs.writeFileSync("current_index.txt", currentIndex.toString(), "utf-8");
}

async function main() {
  let currentIndex = readCurrentIndex();

  const xmlFilePath = "data.xml"; // Specify the path to your XML file
  const urls = parseUrlsFromXml(xmlFilePath);
  if (urls.length === 0) {
    console.error("No URLs found in the XML file.");
    return;
  }

  const batchSize = 50;

  let existingData = [];
  let wb;

  try {
    wb = xlsx.readFile("final_data.xlsx");
    if (wb.Sheets["User Data"]) {
      existingData = xlsx.utils.sheet_to_json(wb.Sheets["User Data"]);
    }
  } catch (e) {
    wb = xlsx.utils.book_new();
  }

  let urlsScraped = 0;

  const uniqueUserNames = new Set(existingData.map((user) => user.Name));

  // Main loop
  while (currentIndex < urls.length) {
    const currentUrls = urls.slice(currentIndex, currentIndex + batchSize);
    const allUserData = await scrapeUserListFromUrls(currentUrls, 0, batchSize);

    // for (const userData of allUserData) {
    //   if (!uniqueUserNames.has(userData.Name)) {
    //     existingData.push(userData);
    //     uniqueUserNames.add(userData.Name);
    //   }
    // }

    existingData = [...existingData, ...allUserData];
    currentIndex += batchSize;
    urlsScraped += currentUrls.length;

    writeCurrentIndex(currentIndex);

    if (urlsScraped >= batchSize) {
      break;
    }
  }

  const ws = xlsx.utils.json_to_sheet(existingData);

  if (wb.SheetNames.indexOf("User Data") >= 0) {
    wb.Sheets["User Data"] = ws;
  } else {
    xlsx.utils.book_append_sheet(wb, ws, "User Data");
  }

  xlsx.writeFile(wb, "final_data.xlsx");
  console.log("User data saved to final_data.xlsx");
}

main();
