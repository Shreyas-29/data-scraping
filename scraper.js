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
console.log("");
// async function scrapeDetailedUserData(url) {
//   try {
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);

//     const name = $(".fn.lawyer-name").text().trim();
//     const experience = $("li.iconed-line span.jicon-experience + time")
//       .text()
//       .trim();
//     const law = $("li.iconed-line:contains('Criminal Law')").text().trim();
//     const reviewLink = $("a[data-gtm-label='Review This Lawyer']").attr("href");
//     const phone = $("a[data-button-tag='call']")
//       .attr("href")
//       .replace("tel:", "");
//     const website = $("a[data-button-tag='website']").attr("href");

//     // const locationElement = $("li.iconed-line span.jicon-jurisdictions + span");
//     // const location =
//     //   locationElement.length > 0 ? locationElement.text().trim() : "";

//     const biographyElement = $("div#biography span#bio");
//     const biography =
//       biographyElement.length > 0 ? biographyElement.text().trim() : "";

//     const practiceAreaArray = [];
//     $("li.iconed-line:contains('Criminal Law')").each((index, element) => {
//       const practiceArea = $(element).text().trim();
//       practiceAreaArray.push(practiceArea);
//     });
//     const practiceArea = practiceAreaArray.join(", ");

//     const detailedUserData = {
//       name,
//       experience,
//       law,
//       //   location,
//       reviewLink,
//       phone,
//       website,
//       biography,
//       practiceArea,
//     };

//     console.log("Detailed User Data:", detailedUserData);

//     return detailedUserData;
//   } catch (error) {
//     console.error("Error scraping detailed user data:", error);
//     return null;
//   }
// }

console.log("");
// async function scrapeDetailedUserData(url) {
//   try {
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);

//     const name = $(".fn.lawyer-name").text().trim();
//     const experience = $("li.iconed-line span.jicon-experience + time")
//       .text()
//       .trim();
//     const law = $("li.iconed-line:contains('Criminal Law')").text().trim();
//     const reviewLink = $("a[data-gtm-label='Review This Lawyer']").attr("href");
//     const phone = $("a[data-button-tag='call']")
//       .attr("href")
//       .replace("tel:", "");
//     const website = $("a[data-button-tag='website']").attr("href");

//     const skills = [];
//     $("div.skill strong.text-ellipsis.to-large-font").each((index, element) => {
//       const skillName = $(element).text().trim();
//       const skillRating = $(element)
//         .siblings("div.jprogress")
//         .find("span.hidden-content")
//         .text()
//         .trim();
//       skills.push({ skillName, skillRating });
//     });

//     const feesElement = $("div#fees ul li");
//     const feesArray = feesElement
//       .map((index, element) => {
//         const feeText = $(element).text().trim();
//         return feeText;
//       })
//       .get();
//     const fees = feesArray.join(", ") || "No fee information available";

//     const languagesElement = $("div#languages ul li strong");
//     const languagesArray = languagesElement
//       .map((index, element) => {
//         const languageName = $(element).text().trim();
//         return languageName;
//       })
//       .get();
//     const languages = languagesArray.join(", ") || "No languages available";

//     const biographyElement = $("div#biography span#bio");
//     const biography =
//       biographyElement.length > 0
//         ? biographyElement.text().trim()
//         : "No biography available";

//     const practiceAreaElement = $("li.iconed-line:contains('Criminal Law')");
//     const practiceArea =
//       practiceAreaElement.length > 0
//         ? practiceAreaElement.text().trim()
//         : "No practice area available";

//     const professionalExperienceElement = $(
//       "div#experience dl.description-list"
//     );
//     const professionalExperienceArray = professionalExperienceElement
//       .map((index, element) => {
//         const jobTitle = $(element).find("dt span").text().trim();
//         const companyName = $(element).find("dd.dsc-primary").text().trim();
//         const years = $(element).find("dd.dsc-secondary").text().trim();
//         return `${jobTitle} at ${companyName} (${years})`;
//       })
//       .get();
//     const professionalExperience =
//       professionalExperienceArray.join(", ").trim() ||
//       "No professional experience available";

//     const educationElement = $("div#education dl.description-list");
//     const educationArray = educationElement
//       .map((index, element) => {
//         const universityName = $(element).find("dt span").text().trim();
//         const degree = $(element).find("dd.dsc-primary").text().trim();
//         const graduationYear = $(element)
//           .find("dd.dsc-secondary")
//           .text()
//           .trim();
//         return `${universityName} - ${degree} (${graduationYear})`;
//       })
//       .get();
//     const education = educationArray.join(", ") || "No education available";

//     const awardsElement = $("div#awards dl.description-list");
//     const awardsArray = awardsElement
//       .map((index, element) => {
//         const awardTitle = $(element).find("dt").text().trim();
//         const awardingBody = $(element).find("dd.dsc-primary").text().trim();
//         const awardYear = $(element)
//           .find("dd.dsc-secondary time.date")
//           .text()
//           .trim();
//         return `${awardTitle} (${awardingBody}, ${awardYear})`;
//       })
//       .get();
//     const awards = awardsArray.join(", ") || "No awards available";

//     const professionalAssociationsElement = $(
//       "div#associations dl.description-list"
//     );
//     const professionalAssociationsArray = professionalAssociationsElement
//       .map((index, element) => {
//         const associationName = $(element).find("dt span").text().trim();
//         const membershipStatus = $(element)
//           .find("dd.dsc-primary")
//           .text()
//           .trim();
//         const membershipYear = $(element)
//           .find("dd.dsc-secondary")
//           .text()
//           .trim();
//         return `${associationName} (${membershipStatus}, ${membershipYear})`;
//       })
//       .get();
//     const professionalAssociations =
//       professionalAssociationsArray.join(", ") ||
//       "No professional associations available";

//     const publicationsElement = $("div#publications dl.description-list");
//     const publicationsArray = publicationsElement
//       .map((index, element) => {
//         const publicationTitle = $(element)
//           .find("dt a.post_title")
//           .text()
//           .trim();
//         const publicationJournal = $(element)
//           .find("dd.dsc-primary")
//           .text()
//           .trim();
//         const publicationYear = $(element)
//           .find("dd.dsc-secondary time.date")
//           .text()
//           .trim();
//         return `${publicationTitle} (${publicationJournal}, ${publicationYear})`;
//       })
//       .get();
//     const publications =
//       publicationsArray.join(", ") || "No publications available";

//     const profileLink = url || "No profile link available";

//     const detailedUserData = {
//       name,
//       experience,
//       law,
//       reviewLink,
//       phone,
//       website,
//       skills,
//       fees,
//       languages,
//       biography,
//       practiceArea,
//       professionalExperience,
//       education,
//       awards,
//       professionalAssociations,
//       publications,
//       profileLink,
//     };

//     console.log("Detailed User Data:", detailedUserData);

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

    const skills = [];
    $("div.skill strong.text-ellipsis.to-large-font").each((index, element) => {
      const skillName = $(element).text().trim();
      const skillRating = $(element)
        .siblings("div.jprogress")
        .find("span.hidden-content")
        .text()
        .trim();
      skills.push({ skillName, skillRating });
    });

    const feesElement = $("div#fees ul li");
    const feesArray = feesElement
      .map((index, element) => {
        const feeText = $(element).text().trim();
        return feeText;
      })
      .get();
    const fees = feesArray.join(", ");

    const languagesElement = $("div#languages ul li strong");
    const languagesArray = languagesElement
      .map((index, element) => {
        const languageName = $(element).text().trim();
        return languageName;
      })
      .get();
    const languages = languagesArray.join(", ") || "No languages available";

    const biographyElement = $("div#biography span#bio");
    const biography =
      biographyElement.length > 0
        ? biographyElement.text().trim()
        : "No biography available";

    const practiceAreaElement = $("li.iconed-line:contains('Criminal Law')");
    const practiceArea =
      practiceAreaElement.length > 0 ? practiceAreaElement.text().trim() : "";

    const professionalExperienceElement = $(
      "div#experience dl.description-list"
    );
    const professionalExperienceArray = professionalExperienceElement
      .map((index, element) => {
        const jobTitle = $(element).find("dt span").text().trim();
        const companyName = $(element).find("dd.dsc-primary").text().trim();
        const years = $(element).find("dd.dsc-secondary").text().trim();
        return `${jobTitle} at ${companyName} (${years})`;
      })
      .get();
    const professionalExperience = professionalExperienceArray.join(", ");

    const educationElement = $("div#education dl.description-list");
    const educationArray = educationElement
      .map((index, element) => {
        const universityName = $(element).find("dt span").text().trim();
        const degree = $(element).find("dd.dsc-primary").text().trim();
        const graduationYear = $(element)
          .find("dd.dsc-secondary")
          .text()
          .trim();
        return `${universityName} - ${degree} (${graduationYear})`;
      })
      .get();
    const education = educationArray.join(", ");

    const awardsElement = $("div#awards dl.description-list");
    const awardsArray = awardsElement
      .map((index, element) => {
        const awardTitle = $(element).find("dt").text().trim();
        const awardingBody = $(element).find("dd.dsc-primary").text().trim();
        const awardYear = $(element)
          .find("dd.dsc-secondary time.date")
          .text()
          .trim();
        return `${awardTitle} (${awardingBody}, ${awardYear})`;
      })
      .get();
    const awards = awardsArray.join(", ");

    const professionalAssociationsElement = $(
      "div#associations dl.description-list"
    );
    const professionalAssociationsArray = professionalAssociationsElement
      .map((index, element) => {
        const associationName = $(element).find("dt span").text().trim();
        const membershipStatus = $(element)
          .find("dd.dsc-primary")
          .text()
          .trim();
        const membershipYear = $(element)
          .find("dd.dsc-secondary")
          .text()
          .trim();
        return `${associationName} (${membershipStatus}, ${membershipYear})`;
      })
      .get();
    const professionalAssociations =
      professionalAssociationsArray.join(", ") ||
      "No professional associations available";

    const publicationsElement = $("div#publications dl.description-list");
    const publicationsArray = publicationsElement
      .map((index, element) => {
        const publicationLink = $(element).find("dt a.post_title").attr("href");
        return publicationLink;
      })
      .get();
    const publications =
      publicationsArray.join(", ") || "No publications available";

    const speakingEngagementsElement = $(
      "div#speakingengagements dl.description-list"
    );
    const speakingEngagementsArray = speakingEngagementsElement
      .map((index, element) => {
        const speakingTitle = $(element).find("dt").text().trim();
        const speakingDate = $(element).find("dd.time.date").text().trim();
        const speakingLocation = $(element)
          .find("dd.dsc-secondary")
          .text()
          .trim();
        return `${speakingTitle} (${speakingDate}, ${speakingLocation})`;
      })
      .get();
    const speakingEngagements =
      speakingEngagementsArray.join(", ") ||
      "No speaking engagements available";

    const certificationsElement = $("div#certifications dl.description-list");
    const certificationsArray = certificationsElement
      .map((index, element) => {
        const certificationTitle = $(element).find("dt.dsc-term").text().trim();
        const certificationIssuer = $(element)
          .find("dd.dsc-primary")
          .text()
          .trim();
        const certificationYear = $(element)
          .find("dd.dsc-secondary time.date")
          .text()
          .trim();
        return `${certificationTitle} (${certificationIssuer}, ${certificationYear})`;
      })
      .get();
    const certifications =
      certificationsArray.join(", ") || "No certifications available";

    const websitesElement = $("div#websites dl.description-list");
    const websiteLinksArray = websitesElement
      .map((index, element) => {
        const websiteLink = $(element).find("dt a").attr("href");
        return websiteLink;
      })
      .get();
    const websites = websiteLinksArray.join(", ") || "No websites available";

    const blogsElement = $(
      "div#websites dl.description-list a[aria-label^='Blog']"
    );
    const blogLinksArray = blogsElement
      .map((index, element) => {
        const blogLink = $(element).attr("href");
        return blogLink;
      })
      .get();
    const blogs = blogLinksArray.join(", ") || "No blogs available";

    const profileLink = url || "No profile link available";

    const detailedUserData = {
      name,
      experience,
      law,
      reviewLink,
      phone,
      website,
      skills,
      fees,
      languages,
      biography,
      practiceArea,
      professionalExperience,
      education,
      awards,
      professionalAssociations,
      publications,
      speakingEngagements,
      certifications,
      websites,
      blogs,
      profileLink,
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
