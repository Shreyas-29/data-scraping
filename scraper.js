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
    xlsx.writeFile(detailedWb, "detailed_users_data.xlsx");

    console.log("Detailed user data saved to detailed_users_data.xlsx");
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
//     const fees = feesArray.join(", ");

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
//       practiceAreaElement.length > 0 ? practiceAreaElement.text().trim() : "";

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
//     const professionalExperience = professionalExperienceArray.join(", ");

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
//     const education = educationArray.join(", ");

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
//     const awards = awardsArray.join(", ");

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
//         const publicationLink = $(element).find("dt a.post_title").attr("href");
//         return publicationLink;
//       })
//       .get();
//     const publications =
//       publicationsArray.join(", ") || "No publications available";

//     const speakingEngagementsElement = $(
//       "div#speakingengagements dl.description-list"
//     );
//     const speakingEngagementsArray = speakingEngagementsElement
//       .map((index, element) => {
//         const speakingTitle = $(element).find("dt").text().trim();
//         const speakingDate = $(element).find("dd.time.date").text().trim();
//         const speakingLocation = $(element)
//           .find("dd.dsc-secondary")
//           .text()
//           .trim();
//         return `${speakingTitle} (${speakingDate}, ${speakingLocation})`;
//       })
//       .get();
//     const speakingEngagements =
//       speakingEngagementsArray.join(", ") ||
//       "No speaking engagements available";

//     const certificationsElement = $("div#certifications dl.description-list");
//     const certificationsArray = certificationsElement
//       .map((index, element) => {
//         const certificationTitle = $(element).find("dt.dsc-term").text().trim();
//         const certificationIssuer = $(element)
//           .find("dd.dsc-primary")
//           .text()
//           .trim();
//         const certificationYear = $(element)
//           .find("dd.dsc-secondary time.date")
//           .text()
//           .trim();
//         return `${certificationTitle} (${certificationIssuer}, ${certificationYear})`;
//       })
//       .get();
//     const certifications =
//       certificationsArray.join(", ") || "No certifications available";

//     const websitesElement = $("div#websites dl.description-list");
//     const websiteLinksArray = websitesElement
//       .map((index, element) => {
//         const websiteLink = $(element).find("dt a").attr("href");
//         return websiteLink;
//       })
//       .get();
//     const websites = websiteLinksArray.join(", ") || "No websites available";

//     const blogsElement = $(
//       "div#websites dl.description-list a[aria-label^='Blog']"
//     );
//     const blogLinksArray = blogsElement
//       .map((index, element) => {
//         const blogLink = $(element).attr("href");
//         return blogLink;
//       })
//       .get();
//     const blogs = blogLinksArray.join(", ") || "No blogs available";

//     const addressElement = $("div.office .adr");
//     const mainElement = $("div.office .small-font");
//     const addressLine1 = addressElement.find(".street-address").text().trim();
//     const addressLine2 = addressElement.find(".street-address-2").text().trim();
//     const city = mainElement.find(".locality").text().trim();
//     const state = mainElement.find(".region").text().trim();
//     const postalCode = mainElement.find(".postal-code").text().trim();

//     // Merge address lines 1 and 2 into a single variable
//     const address = `${addressLine1} ${addressLine2}`.trim();

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
//       speakingEngagements,
//       certifications,
//       websites,
//       blogs,
//       city,
//       state,
//       postalCode,
//       address,
//       profileLink,
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

//     const capitalizeFirstLetter = (string) => {
//       return string.replace(/\b\w/g, (match) => match.toUpperCase());
//     };

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
//     const fees = feesArray.join(", ") || "No fees available";

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
//       practiceAreaElement.length > 0 ? practiceAreaElement.text().trim() : "";

//     // const professionalExperienceElement = $(
//     //   "div#experience dl.description-list"
//     // );
//     // const professionalExperienceArray = professionalExperienceElement
//     //   .map((index, element) => {
//     //     const jobTitle = $(element).find("dt span").text().trim();
//     //     const companyName = $(element).find("dd.dsc-primary").text().trim();
//     //     const years = $(element).find("dd.dsc-secondary").text().trim();
//     //     return `${jobTitle} at ${companyName} (${years})`;
//     //   })
//     //   .get();
//     // const professionalExperience =
//     //   professionalExperienceArray.join(", ").trim() ||
//     //   "No professional experience available";
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
//       professionalExperienceArray.join(", ") ||
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
//         const publicationLink = $(element).find("dt a.post_title").attr("href");
//         return publicationLink;
//       })
//       .get();
//     const publications =
//       publicationsArray.join(", ") || "No publications available";

//     const speakingEngagementsElement = $(
//       "div#speakingengagements dl.description-list"
//     );
//     const speakingEngagementsArray = speakingEngagementsElement
//       .map((index, element) => {
//         const speakingTitle = $(element).find("dt").text().trim();
//         const speakingDate = $(element).find("dd.time.date").text().trim();
//         const speakingLocation = $(element)
//           .find("dd.dsc-secondary")
//           .text()
//           .trim();
//         return `${speakingTitle} (${speakingDate}, ${speakingLocation})`;
//       })
//       .get();
//     const speakingEngagements =
//       speakingEngagementsArray.join(", ") ||
//       "No speaking engagements available";

//     const certificationsElement = $("div#certifications dl.description-list");
//     const certificationsArray = certificationsElement
//       .map((index, element) => {
//         const certificationTitle = $(element).find("dt.dsc-term").text().trim();
//         const certificationIssuer = $(element)
//           .find("dd.dsc-primary")
//           .text()
//           .trim();
//         const certificationYear = $(element)
//           .find("dd.dsc-secondary time.date")
//           .text()
//           .trim();
//         return `${certificationTitle} (${certificationIssuer}, ${certificationYear})`;
//       })
//       .get();
//     const certifications =
//       certificationsArray.join(", ") || "No certifications available";

//     const websitesElement = $("div#websites dl.description-list");
//     const websiteLinksArray = websitesElement
//       .map((index, element) => {
//         const websiteLink = $(element).find("dt a").attr("href");
//         return websiteLink;
//       })
//       .get();
//     const websites = websiteLinksArray.join(", ") || "No websites available";

//     const blogsElement = $(
//       "div#websites dl.description-list a[aria-label^='Blog']"
//     );
//     const blogLinksArray = blogsElement
//       .map((index, element) => {
//         const blogLink = $(element).attr("href");
//         return blogLink;
//       })
//       .get();
//     const blogs = blogLinksArray.join(", ") || "No blogs available";

//     const addressElement = $("div.office .adr");
//     const mainElement = $("div.office .small-font");
//     const addressLine1 = addressElement.find(".street-address").text().trim();
//     const addressLine2 = addressElement.find(".street-address-2").text().trim();

//     const city = mainElement.find(".locality").text().trim();

//     const stateElement = mainElement.find(".region");
//     const stateText = stateElement.text().trim();
//     const state = stateText.match(/\b[A-Z]{2}\b/)?.[0] || "";

//     // const postalCode = mainElement.find(".postal-code").text().trim();
//     const postalCodeElement = mainElement.find(".postal-code");
//     const postalCode = postalCodeElement.text().trim().slice(0, 6);

//     const address =
//       `${addressLine1} ${addressLine2}`.trim() || "";

//     // const socialMediaLinks = [];
//     // $("div#profiles a.social").each((index, element) => {
//     //   const socialMediaLink = $(element).attr("href");
//     //   socialMediaLinks.push(socialMediaLink);
//     // });

//     // const lawyerAvailability = {};
//     // $("div#contacts table tbody tr").each((index, element) => {
//     //   const day = $(element).find("td:first-child").text().trim();
//     //   const hours = $(element).find("td:last-child").text().trim();
//     //   lawyerAvailability[day] = hours;
//     // });

//     const socialMediaLinks = [];
//     $("div.block-wrapper.social-media-block a.-badge.jicon.social").each(
//       (index, element) => {
//         const link = $(element).attr("href");
//         socialMediaLinks.push(link);
//       }
//     );

//     // Extract lawyer availability
//     const lawyerAvailability = {};
//     $("div#contacts table tbody tr").each((index, element) => {
//       const day = $(element).find("td:first-child").text().trim();
//       const hours = $(element).find("td:last-child").text().trim();
//       lawyerAvailability[day] = hours;
//     });

//     // Concatenate social media links into a single string
//     const concatenatedSocialMediaLinks = socialMediaLinks.join(", "); // You can use ',' for comma-separated links

//     const vCardLink = $(
//       "div.table-item a[data-vars-action='ProfileVCard']"
//     ).attr("href");

//     const profileLink = url || "No profile link available";

//     const detailedUserData = {
//       Name: name,
//       Experience: experience,
//       Law: law,
//       "Review Link": reviewLink || "No review link available",
//       Phone: phone || "No phone available",
//       Website: website || "No website available",
//       Skills: skills.length > 0 ? skills : "No skills available",
//       Fees: fees,
//       Languages: languages,
//       Biography: biography,
//       "Practice Area": practiceArea,
//       "Professional Experience": professionalExperience,
//       Education: education,
//       Awards: awards,
//       "Professional Associations": professionalAssociations,
//       Publications: publications,
//       "Speaking Engagements": speakingEngagements,
//       Certifications: certifications,
//       Websites: websites,
//       Blogs: blogs,
//       City: city,
//       State: state,
//       "Postal Code": postalCode,
//       Address: address,
//       "Social Media Links":
//         concatenatedSocialMediaLinks.length > 0
//           ? concatenatedSocialMediaLinks
//           : "No social media links",
//       "Lawyer Availability": lawyerAvailability,
//       "V Card Link": vCardLink,
//       "Profile Link": profileLink,
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

    const capitalizeFirstLetter = (string) => {
      return string.replace(/\b\w/g, (match) => match.toUpperCase());
    };

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
    const fees = feesArray.join(", ") || "";

    const languagesElement = $("div#languages ul li strong");
    const languagesArray = languagesElement
      .map((index, element) => {
        const languageName = $(element).text().trim();
        return languageName;
      })
      .get();
    const languages = languagesArray.join(", ") || "";

    const biographyElement = $("div#biography span#bio");
    const biography =
      biographyElement.length > 0 ? biographyElement.text().trim() : "";

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
    const professionalExperience = professionalExperienceArray.join(", ") || "";

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
    const education = educationArray.join(", ") || "";

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
    const awards = awardsArray.join(", ") || "";

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
      professionalAssociationsArray.join(", ") || "";

    const publicationsElement = $("div#publications dl.description-list");
    const publicationsArray = publicationsElement
      .map((index, element) => {
        const publicationLink = $(element).find("dt a.post_title").attr("href");
        return publicationLink;
      })
      .get();
    const publications = publicationsArray.join(", ") || "";

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
    const speakingEngagements = speakingEngagementsArray.join(", ") || "";

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
    const certifications = certificationsArray.join(", ") || "";

    const websitesElement = $("div#websites dl.description-list");
    const websiteLinksArray = websitesElement
      .map((index, element) => {
        const websiteLink = $(element).find("dt a").attr("href");
        return websiteLink;
      })
      .get();
    const websites = websiteLinksArray.join(", ") || "";

    const blogsElement = $(
      "div#websites dl.description-list a[aria-label^='Blog']"
    );
    const blogLinksArray = blogsElement
      .map((index, element) => {
        const blogLink = $(element).attr("href");
        return blogLink;
      })
      .get();
    const blogs = blogLinksArray.join(", ") || "";
    // const addressElement = $("div.office .adr");
    // const mainElement = $("div.office .small-font");
    // const addressLine1 = addressElement.find(".street-address").text().trim();
    // const addressLine2 = addressElement.find(".street-address-2").text().trim();

    // Address
    const allAddresses = [];
    const allCities = [];
    const allStates = [];
    const allPostalCodes = [];
    const officeElements = $("div.office");

    officeElements.each((index, element) => {
      const addressElement = $(element).find(".adr");
      const mainElement = $(element).find(".small-font");
      const addressLine1 = addressElement.find(".street-address").text().trim();
      const addressLine2 = addressElement
        .find(".street-address-2")
        .text()
        .trim();
      const city = mainElement.find(".locality").text().trim();
      const stateElement = mainElement.find(".region");
      const stateText = stateElement.text().trim();
      const state = stateText.match(/\b[A-Z]{2}\b/)?.[0] || "";
      const postalCodeElement = mainElement.find(".postal-code");
      const postalCode = postalCodeElement.text().trim().slice(0, 6);

      const fullAddress = `${addressLine1} ${addressLine2}`.trim();

      allAddresses.push(fullAddress);
      allCities.push(city);
      allStates.push(state);
      allPostalCodes.push(postalCode);
    });

    const flattenedAddresses = [].concat(...allAddresses);
    const flattenedCities = [].concat(...allCities);
    const flattenedStates = [].concat(...allStates);
    const flattenedPostalCodes = [].concat(...allPostalCodes);

    const socialMediaLinks = [];
    $("div.block-wrapper.social-media-block a.-badge.jicon.social").each(
      (index, element) => {
        const link = $(element).attr("href");
        socialMediaLinks.push(link);
      }
    );

    const lawyerAvailability = {};
    $("div#contacts table tbody tr").each((index, element) => {
      const day = $(element).find("td:first-child").text().trim();
      const hours = $(element).find("td:last-child").text().trim();
      lawyerAvailability[day] = hours;
    });

    const concatenatedSocialMediaLinks = socialMediaLinks.join(", ");

    const vCardLink = $(
      "div.table-item a[data-vars-action='ProfileVCard']"
    ).attr("href");

    const profileLink = url || "";

    const detailedUserData = {
      Name: name,
      Experience: experience,
      Law: law,
      "Review Link": reviewLink || "",
      Phone: phone || "",
      Website: website || "",
      Skills: skills.length > 0 ? skills : "",
      Fees: fees,
      Languages: languages,
      Biography: biography,
      "Practice Area": practiceArea,
      "Professional Experience": professionalExperience,
      Education: education,
      Awards: awards,
      "Professional Associations": professionalAssociations,
      Publications: publications,
      "Speaking Engagements": speakingEngagements,
      Certifications: certifications,
      Websites: websites,
      Blogs: blogs,
      "Social Media Links":
        concatenatedSocialMediaLinks.length > 0
          ? concatenatedSocialMediaLinks
          : "",
      "Postal Code 2": flattenedPostalCodes[1] || "",
      "Address 1": flattenedAddresses[0],
      "City 1": flattenedCities[0],
      "State 1": flattenedStates[0],
      "Postal Code 1": flattenedPostalCodes[0],
      "Address 2": flattenedAddresses[1] || "",
      "City 2": flattenedCities[1] || "",
      "State 2": flattenedStates[1] || "",
      "Postal Code 2": flattenedPostalCodes[1] || "",
      "Address 3": flattenedAddresses[2] || "",
      "City 3": flattenedCities[2] || "",
      "State 3": flattenedStates[2] || "",
      "Postal Code 3": flattenedPostalCodes[2] || "",
      "Address 4": flattenedAddresses[3] || "",
      "City 4": flattenedCities[3] || "",
      "State 4": flattenedStates[3] || "",
      "Postal Code 4": flattenedPostalCodes[3] || "",
      "Address 5": flattenedAddresses[4] || "",
      "City 5": flattenedCities[4] || "",
      "State 5": flattenedStates[4] || "",
      "Postal Code 5": flattenedPostalCodes[4] || "",
      "Lawyer Availability": lawyerAvailability,
      "V Card Link": vCardLink,
      "Profile Link": profileLink,
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
