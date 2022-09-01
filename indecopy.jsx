import * as cheerio from "cheerio";
import axios from "axios";
import express from "express";

const PORT = 9000;
const app = express();

// const url = 'https://www.mindbodygreen.com/health/page/3'
// const url = "https://www.nhs.uk/conditions";

// axios(url)
// .then(response => {
//     const html = response.data
//     const $ = cheerio.load(html)
//     const articles = []

//     $('.search-result__heading', html).each((i, el) => {
//       const title = $(el).text().trim()
//       const links = $(el).find('a').attr('href')

//       articles.push({title, links})
//     }).get()

//     console.log(articles)
// }).catch(error=> console.log(error))

// MedicalNewsToday

const condKeys = [
  "alzheimer's-and-dementia",
  "anxiety",
  "arthritis",
  "asthma-and-allergies",
  "breast-cancer",
  "cancer",
  "diabetes",
  "headache-and-migraine",
  "hiv-and-aids",
  "inflammatory-bowel-disease",
  "leukemia",
  "psoriasis",
];

const cateKeys = [
  "cardiovascular-health",
  "dermatology-and-skincare",
  "environment-and-sustainability",
  "exercise-and-fitness",
  "eye-health",
  "human-biology",
  "men's-health",
  "mental-health",
  "nutrition",
  "sexual-health",
  "women's-health",
];

const cateUrl = `${cateKeys.map(
  (key) => "https://www.medicalnewstoday.com/" + key
)}`;
const condUrl = `${condKeys.map(
  (key) => "https://www.medicalnewstoday.com/" + key
)}`;

// console.log(cateUrl + condUrl)

axios("https://www.medicalnewstoday.com/environment-and-sustainability")
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    const baseUrl = `http://www.medicalnewstoday.com`;
    const articles = [];

    const conditions = $(".css-0", html).text().trim();

    const titLinks = $(".css-8sm3l3", html)
      .map((i, el) => {
        const title = $(el).text().trim();
        const links = $(el).find("a").attr("href");

        return { title, links };
      })
      .get();

    const images = $("span lazy-image", html)
      .map((i, el) => {
        const image = $(el).attr("src").trim();

        return { image };
      })
      .get();


      // const data = images.map((i, el) => {})

    articles.push({
      conditions: conditions,
      title: titLinks,
      images: images,
      source__name: "MedicalNewsToday",
      source__img:
        "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1413780870/nu5ilpby3btq45pghneg.png",
    });

    console.log(articles);
  })
  .catch((error) => console.log(error));

// A-Z NHS health conditions
const nhsUrl = "https://www.nhs.uk/conditions";
// axios(nhsUrl)
//   .then((response) => {
//     const html = response.data;
//     const $ = cheerio.load(html);
//     const articles = [];

//     $(".nhsuk-list.nhsuk-list--border", html)
//       .each((i, el) => {
//         $(el)
//           .find("li")
//           .each((i, el) => {
//             const conditions = $(el).text().trim();
//             const link = $(el).find("a").attr("href");
//             articles.push({
//               conditions,
//               link: `${nhsUrl}/` + link
//               source: "https://www.nhs.uk",
//               source__img:
//                 "https://peopleshistorynhs.org/wp-content/uploads/2016/01/nhs-logo-880x4951.jpeg",
//             });
//           });
//       })
//       .get();

//     console.log(articles);
//   })
//   .catch((error) => console.log(error));

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
