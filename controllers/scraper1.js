import axios from "axios";
import * as cheerio from "cheerio";
import Article from "../model/article.js";

//Santeplusmag
//Artofhealthyliving
// Harvard
//Shape

export const scraper1 = async (req, res) => {
  const { isHarvard, isArtofhealthyliving, isSanteplusmag, isShape, terms } =
    req.body;

  const successMsg = {
    msg: "Scraping done 🤗🤗",
  };

  if (isSanteplusmag) {
    terms.map((term) => {
      axios(`https://www.santeplusmag.com/${term.cate_key}`)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);

          const data = $(".col-md-6", html)
            .map((i, el) => {
              const link = $(el).find("a").attr("href");
              const title = $(el).find(".content-title-categorie a ").text();

              const imgText = $(el)
                .find(".featured-image.image-big-rounded a ")
                .text();

              const image = (img) => {
                if (img.length > 0) {
                  const src = imgText.match(/src\=([^\s]*)\s/)[0];

                  return src.substring(5, src.length - 2);
                }
              };

              return {
                title,
                link,
                image: image(imgText),
                category: term.cate,
                category_id: term.cate_id,
                translate: true,
                source: "Santeplusmag",
                source_img:
                  "https://www.emploi.ma/sites/default/files/styles/medium/public/logo/logo-accroche.png?itok=X0MzVvNO",
              };
            })
            .get();
          const articles = data.filter((article) => article.link?.length > 0);
          articles.map(async (article) => {
            const result = await Article.create({
              ...article,
              createdAt: new Date().toISOString(),
            });

            console.log(result);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  if (isShape) {
    terms.map((term) => {
      axios(
        `https://www.shape.com/${term?.cate_url ? term.cate_url : ""}/${
          term.cate_key
        }`
      ).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const className =
          ".comp.mntl-card-list-items.mntl-document-card.mntl-card.card.card--no-image";

        const articles = $(className, html)
          .map((i, el) => {
            const link = $(el).attr("href");
            const title = $(el).find(".card__title").text().trim();
            const imgText = $(el).find(".img-placeholder").text();
            const srcWithQuote = imgText.match(/src\=([^\s]*)\s/)[1],
              image = srcWithQuote.substring(1, srcWithQuote.length - 1);

            return {
              title,
              link,
              image,
              category: term.cate,
              category_id: term.cate_id,
              mini_card: true,
              source: "Shape",
              source_img:
                "https://upload.wikimedia.org/wikipedia/commons/a/a2/Shape_magazine_logo.jpg",
            };
          })
          .get();

        articles.map(async (article) => {
          const result = await Article.create({
            ...article,
            createdAt: new Date().toISOString(),
          });

          console.log(result);
        });
      });
    });
  }

  //Havard
  //Check categories before scraping

  if (isHarvard) {
    const pages = [1, 2, 3];
    terms.map((term) => {
      pages.map((page) => {
        axios(
          `https://www.health.harvard.edu/topics/${term.cate_key}/all?page=${page}`
        ).then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);

          const articles = $("div.mb-16", html)
            .map((i, el) => {
              const link = $(el).find("a ").attr("href");

              const title = $(el).find("a h2").text().trim();
              const summary = $(el).find(".prose.mt-4").text().trim();
              const image = $(el)
                .find(".object-cover.h-full.w-full")
                .attr("src");

              return {
                title,
                summary,
                link,
                image,
                category: term.cate,
                category_id: term.cate_id,
                source: "Harvard",
                source_img:
                  "https://www.health.harvard.edu/img/logos/hhp_logo@2x.png",
              };
            })
            .get();
          articles.map(async (article) => {
            const result = await Article.create({
              ...article,
              createdAt: new Date().toISOString(),
            });

            console.log(result);
          });
        });
      });
    });
  }

  // artofhealthyliving
  //Wellbeing
  // fitness
  //Beauty (skincare)

  if (isArtofhealthyliving) {
    terms.map((term) => {
      axios(`https://artofhealthyliving.com/category/${term.cate_key}`)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);

          const articles = $("article", html)
            .map((i, el) => {
              const link = $(el).find("a ").attr("href");

              const title = $(el).find(".entry-title a").text();
              const summary = $(el).find(".entry-summary p").text();
              const imgText = $(el).find("a").text();

              var urlRegex = /(https?:\/\/[^ ]*)/;
              var url = imgText.match(urlRegex)[1];
              //remove " from the end
              const image = url?.slice(0, -1);

              return {
                title,
                summary,
                link: link,
                image: image,
                category: term.cate,
                category_id: term.cate_id,
                source: "Artofhealthyliving",
                source_img:
                  "https://res.cloudinary.com/gasod/image/upload/v1666580930/e5a7ff83a09a842f934749f5d9579acf_meb4tt.jpg",
              };
            })
            .get();
          articles.map(async (article) => {
            const result = await Article.create({
              ...article,
              createdAt: new Date().toISOString(),
            });

            console.log(result);
          });
        })
        .catch((error) => console.log(error));
    });
  }

  res.json(successMsg);
};
