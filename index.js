require("dotenv").config();

const axios = require("axios");
const cheerio = require("cheerio");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_KEY
);

async function scrapeAndStore() {
try {
const response = await axios.get(
"https://blog.hubspot.com/marketing"
);

const $ = cheerio.load(response.data);

const blogs = [];

$("h2").each((index, element) => {
  const title = $(element).text().trim();

  if (title && title.length > 10) {
    blogs.push({
      title: title,
      author: "HubSpot",
      url: "https://blog.hubspot.com/marketing",
      source: "HubSpot"
    });
  }
});

console.log("===== JSON OUTPUT =====");
console.log(JSON.stringify(blogs, null, 2));

for (const blog of blogs) {
  const { error } = await supabase
    .from("blog_posts")
    .insert(blog);

  if (error) {
    console.log("Insert Error:", error.message);
  } else {
    console.log("Saved:", blog.title);
  }
}

console.log("Completed Successfully");

} catch (err) {
console.error("ERROR:", err);
}
}

scrapeAndStore();
