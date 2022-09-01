import axios from "axios";
import * as cheerio from "cheerio";
import Article from "../model/article.js";
import Topic from "../model/topic.js";
import mongoose from "mongoose";

export const scraper = async (req, res) => {
  const {
    mnt,
    mbg,
    nhs,
    mbg_pageNum,
    isMbg_latest,
    isMbg_page,
    healthline,
    isCategories,
    isTopics,
    terms
  } = req.body;

  const successMsg = {
    msg: "Scraping done 🤗🤗",
  }

  const articles = [];
  const topics = [];

  // MedicalNewsToday
  if (mnt) {
    // Client side keys

    terms.map((term) => {
      axios(`https://www.medicalnewstoday.com/${term}`)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);

          

          const condition = $(".css-0", html).text().trim();

          const data = $(".css-8sm3l3", html)
            .map((i, el) => {
              const title = $(el).text().trim();
              const link = $(el).find("a").attr("href");
              const images = $(el).find("span lazy-image").attr("src");

              return { title, link: 'https://www.medicalnewstoday.com'+link, images };
            })
            .get();
           

          if (isTopics) {
            topics.push({
              topic: condition,
              subcategory: term,
              explore: true,
              data: data,
              source__name: "MedicalNewsToday",
              source__img:
                "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1413780870/nu5ilpby3btq45pghneg.png",
            });

           
            // console.log(topics)
          }

          if (isCategories) {
            articles.push({
              category: condition,
              data: data,
              subcategory: term,
              source__name: "MedicalNewsToday",
              source__img:
                "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1413780870/nu5ilpby3btq45pghneg.png",
            });
          }

          console.log(articles.map(d => d.data));
        })
        .catch((error) => console.log(error));
    });

    // const posts = await Topic.find();
    // if (posts.length === 0) {
    //   // return res.status(204).json({ message: "No posts found" });
    //   console.log("No posts found")
    // }
    console.log('first')
    async () => {
      try {
        const result = await Topic.create({
          ...topics,
          // creator: req.userId,
          createdAt: new Date().toISOString(),
        });
        console.log('first')
        res.status(201).json(result);
      } catch (err) {
        console.error(err);
      }
    }
  }

  // A-Z NHS health conditions
  if (nhs) {
    const nhsUrl = "https://www.nhs.uk/conditions";
    axios(nhsUrl)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const topics = [];

        $(".nhsuk-list.nhsuk-list--border", html)
          .each((i, el) => {
            $(el)
              .find("li")
              .each((i, el) => {
                const condition = $(el).text().trim();
                const link = $(el).find("a").attr("href");
                topics.push({
                  topic: condition,
                  link: `${nhsUrl}/` + link,
                  source: "NHS",
                  source__img:
                    "https://peopleshistorynhs.org/wp-content/uploads/2016/01/nhs-logo-880x4951.jpeg",
                });
              });
          })
          .get();

        console.log(topics);
      })
      .catch((error) => console.log(error));
  }

  //HEALTHLINE

  if (healthline) {
    terms.map((term) => {
      axios(`https://www.healthline.com/directory/${term}`)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          const topics = [];
          const articles = [];

          //Topics A-Z
          if (isTopics) {
            $(".css-1hacg05", html)
              .each((i, el) => {
                const topic = $(el).text().trim();
                const link = $(el).attr("href");

                topics.push({
                  topic,
                  link: `https://www.healthline.com` + link,
                  source: "Healthline",
                  source_img:
                    "https://cdn.comparably.com/26017579/l/128313_logo_healthline-media.png",
                });
              })
              .get();
          }

          //HUMAN BODY PARTS HAS THE SAME SELECTORS AS NUTRITION
          // SO GIVE A CONDITION WHEN IF (HUMAN BODY PARTS) {...}
          //NUTRITION
          if (isCategories) {
            $(".css-11kh5m1").each((i, el) => {
              const title = $(el).find(".css-1934zwx").text();
              const links = $(el).find(".css-bufxhs .css-1934zwx").attr("href");
              const image = $(el).find(".css-rlaxw5 lazy-image ").attr("src");

              articles.push({
                category: term,
                sub_category: "",
                data: { title, links, image },
                source: "Healthline",
                source_img:
                  "https://cdn.comparably.com/26017579/l/128313_logo_healthline-media.png",
              });
            });
          }

          console.log(articles);
          console.log(topics);
        })
        .catch((error) => console.log(error));
    });
  }

  // A-Z NHS health conditions
  if (nhs) {
    const nhsUrl = "https://www.nhs.uk/conditions";
    axios(nhsUrl)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const topics = [];

        $(".nhsuk-list.nhsuk-list--border", html)
          .each((i, el) => {
            $(el)
              .find("li")
              .each((i, el) => {
                const conditions = $(el).text().trim();
                const link = $(el).find("a").attr("href");
                topics.push({
                  conditions,
                  link: `${nhsUrl}/` + link,
                  source: "https://www.nhs.uk",
                  source__img:
                    "https://peopleshistorynhs.org/wp-content/uploads/2016/01/nhs-logo-880x4951.jpeg",
                });
              });
          })
          .get();

        console.log(topics);
      })
      .catch((error) => console.log(error));
  }

  // Mindbodygreen
  //Cant scrape sleep page

  if (mbg) {
    //   const mbg_page = 'page/1'
    const page= `/page/${mbg_pageNum}`
    terms.map((term) => {

      const url = `https://www.mindbodygreen.com/${term}${ isMbg_page? page :''}`
      axios(url)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          const articles = [];

          //MBG LATEST ARTICLES
          if (isMbg_latest) {
            $(".latest-card-wrapper")
              .each((i, el) => {
                const title = $(el).find(".card__header h2").text();
                const imgText = $(el)
                  .find(".card__image-wrapper noscript")
                  .text()
                  .trim();
                var urlRegex = /(https?:\/\/[^ ]*)/;
                var url = imgText.match(urlRegex)[1];
                //remove " from the end
                const image = url?.slice(0, -1);

                articles.push({
                  category: term,
                  data: { title, image },
                  source: "Mindbodygreen",
                  source_img:
                    "https://www.mindbodygreen.com/img/nav/mbg_logo_short-square-2x.png",
                });
              })
              .get();
          }

          //MBG PAGES
       
          if (isMbg_page) {
            $(".search-result__heading", html)
              .each((i, el) => {
                const title = $(el).text().trim();
                const link = $(el).find("a").attr("href");

                articles.push({
                  category: term,
                  data: { title, link },
                  source: "Mindbodygreen",
                  source_img:
                    "https://www.mindbodygreen.com/img/nav/mbg_logo_short-square-2x.png",
                });
                // console.log('kkkk');
              })
              .get();
          }

          console.log(articles);
        })
        .catch((error) => console.log(error));
    });
  }
  res.json(successMsg)
  
};