const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const xlsx = require("xlsx");

async function scrapeUserList(url) {
  try {
    const userDataArray = [];
    const scrapedNames = new Set();

    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage && currentPage <= 25) {
      const pageUrl = `${url}?page=${currentPage}`;
      const response = await axios.get(pageUrl);
      const $ = cheerio.load(response.data);

      const premiumParentElements = $("div.results-sponsored .jcard");
      const nonPremiumParentElements = $("div.results-lawyers .jcard");

      const scrapeUserData = (parentElement) => {
        const name = $("strong.name a.url", parentElement).text().trim();
        if (!scrapedNames.has(name)) {
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
        }
        scrapedNames.add(name);
      };

      premiumParentElements.each((index, parentElement) => {
        scrapeUserData(parentElement);
      });

      nonPremiumParentElements.each((index, parentElement) => {
        scrapeUserData(parentElement);
      });

      hasNextPage = $("#pagination span.next a").length > 0;
      currentPage++;

      console.log(`Scraped data from page ${currentPage - 1}`);
    }

    console.log("Current page: ", currentPage);

    return userDataArray;
  } catch (error) {
    console.error("Error scraping user data:", error);
    return [];
  }
}

// async function scrapeUserListFromUrls(urls) {
//   const allUserData = [];

//   for (const url of urls) {
//     const userData = await scrapeUserList(url);
//     console.log("url:", url);
//     allUserData.push(...userData);
//   }

//   return allUserData;
// }

// async function scrapeUserListFromUrls(urls, startFrom = 0, batchSize = 5) {
//   const allUserData = [];
//   const startIndex = Math.max(0, startFrom);
//   const endIndex = Math.min(startIndex + batchSize, urls.length);

//   for (let i = startIndex; i < endIndex; i++) {
//     const url = urls[i];
//     const userData = await scrapeUserList(url);
//     console.log("url:", url);
//     allUserData.push(...userData);
//   }

//   return { userData: allUserData, endIndex };
// }
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

// async function main() {
//   const xmlFilePath = "test.xml"; // Specify the path to your XML file
//   const urls = parseUrlsFromXml(xmlFilePath);
//   if (urls.length === 0) {
//     console.error("No URLs found in the XML file.");
//     return;
//   }
//   const allUserData = await scrapeUserListFromUrls(urls);
//   if (allUserData.length === 0) {
//     console.error("No user data scraped.");
//     return;
//   }
//   const wb = xlsx.utils.book_new();
//   const ws = xlsx.utils.json_to_sheet(allUserData, {});
//   xlsx.utils.book_append_sheet(wb, ws, "User Data");
//   xlsx.writeFile(wb, "user_data3.xlsx");
//   console.log("User data saved to user_data3.xlsx");
// }

// ... (previous code)

console.log("");

// async function main() {
//   const xmlFilePath = "data.xml"; // Specify the path to your XML file
//   const urls = parseUrlsFromXml(xmlFilePath);
//   if (urls.length === 0) {
//     console.error("No URLs found in the XML file.");
//     return;
//   }

//   // Specify the batch size
//   const batchSize = 10;

//   // Track the current index
//   let currentIndex = 0;

//   // Track the number of URLs scraped
//   let urlsScraped = 0;

//   // Load existing data or create a new workbook
//   let existingData = [];
//   let wb;

//   try {
//     wb = xlsx.readFile("user_data.xlsx");
//     if (wb.Sheets["User Data"]) {
//       existingData = xlsx.utils.sheet_to_json(wb.Sheets["User Data"]);
//     }
//   } catch (e) {
//     wb = xlsx.utils.book_new();
//   }

//   // Main loop
//   while (currentIndex < urls.length && urlsScraped < batchSize) {
//     const currentUrls = urls.slice(currentIndex, currentIndex + batchSize);

//     const allUserData = await scrapeUserListFromUrls(currentUrls, 0, batchSize);

//     existingData = [...existingData, ...allUserData];

//     currentIndex += batchSize;
//     urlsScraped += currentUrls.length;
//   }

//   const ws = xlsx.utils.json_to_sheet(existingData);

//   if (wb.SheetNames.indexOf("User Data") >= 0) {
//     wb.Sheets["User Data"] = ws;
//   } else {
//     xlsx.utils.book_append_sheet(wb, ws, "User Data");
//   }

//   xlsx.writeFile(wb, "user_data.xlsx");

//   console.log("User data saved to user_data.xlsx");
// }

// Define a function to read and write the current index

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

// async function main() {
//   const xmlFilePath = "data.xml"; // Specify the path to your XML file
//   const urls = parseUrlsFromXml(xmlFilePath);
//   if (urls.length === 0) {
//     console.error("No URLs found in the XML file.");
//     return;
//   }

//   // Specify the batch size
//   const batchSize = 100;

//   // Load existing data or create a new workbook
//   let existingData = [];
//   let wb;

//   try {
//     wb = xlsx.readFile("user_data.xlsx");
//     if (wb.Sheets["User Data"]) {
//       existingData = xlsx.utils.sheet_to_json(wb.Sheets["User Data"]);
//     }
//   } catch (e) {
//     wb = xlsx.utils.book_new();
//   }

//   // Track the number of URLs scraped
//   let urlsScraped = 0;

//   // Track the current index
//   let currentIndex = 0;

//   // while (currentIndex < urls.length) {
//   //   const currentUrls = urls.slice(currentIndex, currentIndex + batchSize);
//   //   const allUserData = await scrapeUserListFromUrls(currentUrls, 0, batchSize);
//   //   existingData = [...existingData, ...allUserData];
//   //   currentIndex += batchSize;
//   //   urlsScraped += currentUrls.length;
//   //   if (urlsScraped >= batchSize) {
//   //     break;
//   //   }
//   // }
//   while (currentIndex < urls.length) {
//     const currentUrls = urls.slice(currentIndex, currentIndex + batchSize);
//     const allUserData = await scrapeUserListFromUrls(currentUrls, 0, batchSize);
//     existingData = [...existingData, ...allUserData];
//     currentIndex += batchSize;
//     urlsScraped += currentUrls.length;

//     // Write the current index back to the file
//     writeCurrentIndex(currentIndex);

//     if (urlsScraped >= batchSize) {
//       break;
//     }
//   }

//   const ws = xlsx.utils.json_to_sheet(existingData);

//   if (wb.SheetNames.indexOf("User Data") >= 0) {
//     wb.Sheets["User Data"] = ws;
//   } else {
//     xlsx.utils.book_append_sheet(wb, ws, "User Data");
//   }

//   xlsx.writeFile(wb, "user_data.xlsx");
//   console.log("User data saved to user_data.xlsx");
// }

// main();

console.log("");

// working correctly
async function main() {
  // Read the current index from the file
  let currentIndex = readCurrentIndex();

  const xmlFilePath = "data.xml"; // Specify the path to your XML file
  const urls = parseUrlsFromXml(xmlFilePath);
  if (urls.length === 0) {
    console.error("No URLs found in the XML file.");
    return;
  }

  // Specify the batch size
  const batchSize = 50;

  // Load existing data or create a new workbook
  let existingData = [];
  let wb;

  try {
    wb = xlsx.readFile("user_data.xlsx");
    if (wb.Sheets["User Data"]) {
      existingData = xlsx.utils.sheet_to_json(wb.Sheets["User Data"]);
    }
  } catch (e) {
    wb = xlsx.utils.book_new();
  }

  // Track the number of URLs scraped
  let urlsScraped = 0;

  const uniqueUserNames = new Set(existingData.map((user) => user.Name));

  // Main loop
  while (currentIndex < urls.length) {
    const currentUrls = urls.slice(currentIndex, currentIndex + batchSize);
    const allUserData = await scrapeUserListFromUrls(currentUrls, 0, batchSize);

    for (const userData of allUserData) {
      if (!uniqueUserNames.has(userData.Name)) {
        existingData.push(userData);
        uniqueUserNames.add(userData.Name);
      }
    }

    // existingData = [...existingData, ...allUserData];
    currentIndex += batchSize;
    urlsScraped += currentUrls.length;

    // Write the current index back to the file
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

  xlsx.writeFile(wb, "user_data5.xlsx");
  console.log("User data saved to user_data5.xlsx");
}

main();
