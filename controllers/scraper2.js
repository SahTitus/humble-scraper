import axios from "axios";
import * as cheerio from "cheerio";
import Article from "../model/article.js";

//Mountelizabeth
//Eatthis
//Gaiam
//Self
//Onhealth

export const scraper2 = async (req, res) => {
  const { isMountelizabeth, isEatthis, isGaiam, isOnhealth, isSelf, terms } =
    req.body;

  const successMsg = {
    msg: "Scraping done 🤗🤗",
  };

  //Onhealth
  if (isOnhealth) {
    terms.map((term) => {
      axios
        .get(`https://www.onhealth.com/oh/api/2/${term.cate_key}`)
        .then((response) => {
          const data = response.data.Data;
          const articles = data.map((article) => {
            return {
              title: article.Title,
              image: article.Image,
              category: term.cate,
              category_id: term.cate_id,
              link:
                "https://www.onhealth.com/content/1/" + article.CleanSubject,
              source: "Onhealth",
              source_img:
                "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1490183531/w91fuklgfkc0urqejhsg.png",
            };
          });
          console.log(articles);

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

  if (isEatthis) {
    terms.map((term) => {
      axios(`https://www.eatthis.com/${term.cate_key}`).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        const data = $(".caption ", html)
          .map((i, el) => {
            const link = $(el).find(".main-posts_caption-link").attr("href");
            const title = $(el).find(" .title-wrap h2").text();
            const info = $(".img-wrap .hide-mobile ")
              .map((x, elem) => {
                const image = $(elem).find("img").attr("data-src");
                return {
                  title,
                  link,
                  image,
                  category: term.cate,
                  category_id: term.cate_id,
                  source_img:
                    "https://20fd661yccar325znz1e9bdl-wpengine.netdna-ssl.com/wp-content/uploads/2021/01/Screen-Shot-2021-01-19-at-1.05.08-PM.png",
                  source: "Eatthis",
                };
              })
              .get();

            const removeDuplicate = (data, key) => {
              return [...new Map(data.map((x) => [x[key], x]))];
            };
            return removeDuplicate(info, (article) => article.title)[0];
          })
          .get();

        const articles = data.filter((article) => article?.title);

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

  if (isMountelizabeth) {
    axios(`https://beta.mountelizabeth.com.sg/healthplus?tab=Trending`).then(
      (response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        const articles = $(".articles-block", html)
          .map((i, el) => {
            const link = $(el).find("a").attr("href");
            const title = $(el).find(".articles-con h4").text();
            const image = $(el).find("figure img ").attr("src");

            return {
              title,
              link: "https://beta.mountelizabeth.com.sg" + link,
              image: "https://beta.mountelizabeth.com.sg" + image,
              category: "wellness",
              category_id: "wellness",
              mini_card: true,
              source: "Mountelizabeth",
              source_img:
                "https://intmedicaltreatment.com/wp-content/uploads/2019/10/Mt-Elizabeth_logo.jpg",
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
      }
    );
  }

  //Gaiam

  // //No category
  if (isGaiam) {
    const pages = [1, 2];

    pages.map((page) => {
      axios(`https://www.gaiam.com/blogs/discover?page=${page}`).then(
        (response) => {
          const html = response.data;
          const $ = cheerio.load(html);

          const articles = $(".six.columns.alpha.article", html)
            .map((i, el) => {
              const link = $(el).find("a").attr("href");
              const title = $(el).find("h2 ").text();
              const summary = $(el).find(".excerpt ").text();

              const image = $(el).find(" a img ").attr("src");

              return {
                title,
                link: "https://www.gaiam.com" + link,
                image: "https:" + image,
                category: "wellness",
                category_id: "wellness",
                summary,
                source: "Gaiam",
                source_img:
                  "https://play-lh.googleusercontent.com/UQEtLCoe29vJi9R_aseraVwTJ_gNe7ff9ewqdvk8YVXTOK5yFXVP-naWTzuWSWMGUz8O",
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
        }
      );
    });
  }

  //Self.com

  if (isSelf) {
    terms.map((term) => {
      axios(
        `https://www.self.com/${term?.cate_url ? term.cate_url : ""}/${
          term.cate_key
        }`
      )
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);

          $(".river-item-content", html)
            .map((i, el) => {
              const link = $(el).find("a").attr("href");

              const title = $(el).find(".river-item-content a ").text();

              const articles = axios(`https://www.self.com${link}`).then(
                (response) => {
                  const html = response.data;
                  const $ = cheerio.load(html);

                  const data = $(
                    ".ResponsiveImagePicture-jJpQhK.jEPxaV.ContentHeaderResponsiveAsset-MtKCn.jssGMx.responsive-image",
                    html
                  )
                    .map(async (i, el) => {
                      const image = $(el).find("img").attr("src");

                      const result = await Article.create({
                        link: "https://www.self.com" + link,
                        title,
                        image,
                        category: term.cate,
                        category_id: term.cate_id,
                        source: "Self",
                        source_img:
                          "https://www.freelogovectors.net/wp-content/uploads/2019/02/self-logo.png",
                        createdAt: new Date().toISOString(),
                      });

                      console.log(result);
                    })
                    .get();
                }
              );
            })
            .get();
        })
        .catch((err) => {
          console.log(err, "las");
        });
    });
  }

  res.json(successMsg);
};
