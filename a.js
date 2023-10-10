const xmlFilePath = "test.xml";
const scrapeUserList = require("./b");
const parseXML = require("./b");

// Parse the XML file and get the list of URLs
parseXML(xmlFilePath)
  .then((userList) => {
    // Call the function to scrape and store user data
    scrapeUserList(userList);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
