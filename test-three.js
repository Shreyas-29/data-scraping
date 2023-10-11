const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

async function scrapeUserList(url) {
  try {
    const userDataArray = [];

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
    }
    console.log("Current page: ", currentPage);
    return userDataArray;
  } catch (error) {
    console.error("Error scraping user data:", error);
    return [];
  }
}

async function scrapeUserListFromUrls(urls, batchSize, dataFilePath) {
  const allUserData = [];

  let existingProfiles = new Set();

  try {
    // Load existing data or create a new array
    const existingData = fs.existsSync(dataFilePath)
      ? require(dataFilePath)
      : [];

    // Extract unique user profiles from existing data
    existingData.forEach((entry) => {
      existingProfiles.add(entry["Profile Link"]);
    });
  } catch (error) {
    console.error("Error loading existing data:", error);
  }

  for (const url of urls) {
    const userData = await scrapeUserList(url);

    // Filter out user profiles that have already been added
    const uniqueUserData = userData.filter((entry) => {
      return !existingProfiles.has(entry["Profile Link"]);
    });

    // Add the new unique user data to the result
    allUserData.push(...uniqueUserData);

    // Update the set of existing profiles
    uniqueUserData.forEach((entry) => {
      existingProfiles.add(entry["Profile Link"]);
    });
  }

  // Save the updated data to data.json
  fs.writeFileSync(
    dataFilePath,
    JSON.stringify(existingData.concat(allUserData), null, 2)
  );

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

async function main() {
  const xmlFilePath = "data.xml"; // Specify the path to your XML file
  const dataFilePath = "data.json"; // Specify the path to your JSON data file
  const urls = parseUrlsFromXml(xmlFilePath);

  if (urls.length === 0) {
    console.error("No URLs found in the XML file.");
    return;
  }

  const batchSize = 10;
  const allUserData = await scrapeUserListFromUrls(
    urls,
    batchSize,
    dataFilePath
  );

  if (allUserData.length === 0) {
    console.error("No user data scraped.");
    return;
  }

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(allUserData, {});
  xlsx.utils.book_append_sheet(wb, ws, "User Data");
  xlsx.writeFile(wb, "users_data4.xlsx");
  console.log("User data saved to users_data4.xlsx");
}

main();
