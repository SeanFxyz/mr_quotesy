const axios = require("axios");
const cheerio = require("cheerio");
const base_url = "https://fallout.fandom.com";
const sqlite = require("sqlite3");

function getQuotes(url) {
	// tags of interest
	// ================
	// "div.mediaContainer" - holds the audio file player
	//
	// "li" - in "Notable Quotes" section, contains quote and "div.np-quote-snd-player"
	// "div.np-quote-snd-player" contains href to audio file.
	//
	// "span.va-quotation-text" - top-of-page quote
	//
	// "div.lightbox-caption" - contains a quote and a "div.mediaContainer"

}

async function crawl(quotes, url) {

	if (url.split("/").find(str => str.startsWith("Category:")) === undefined) {
		console.log(`Found article: ${url}`)
		const page_quotes = getQuotes(url);
		for (q in page_quotes) {
			quotes.push({
				"text": q["text"],
				"audio": q["audio"],
				"url": url
			});
		}
		console.log(`Got ${page_quotes.length}`);
		return;
	}

	const { data } = await axios.get(base_url.concat(url));
	const $ = cheerio.load(data);

	var members = $("div.category-page__members").find(".category-page__member-link");
	var i = 0
	while (members[i]) {
		crawl(quotes, members[i].attribs["href"]);
		i++;
	}
}

function scrape() {
	const start_url ="/wiki/Category:Characters_by_game";
	const pages = [];
	crawl(pages, start_url);
	return pages;
}

const pages = scrape();
