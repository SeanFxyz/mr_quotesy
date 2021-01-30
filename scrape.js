const axios = require("axios");
const cheerio = require("cheerio");
const base_url = "https://fallout.fandom.com";
const sqlite = require("sqlite3");

async function getQuotes(url) {
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

	const { data } = await axios.get(base_url.concat(url));
	const $ = cheerio.load(data);

	const heading = $("h2:contains('Notable quotes')", "div.mw-parser-output");
	// TODO: get the quotes under the heading
}

async function crawl(quotes, url) {

	const page = url.split("/").pop()
	if (page.toLowerCase().startsWith("category:")) {
		console.log(`Found article: ${page}`)
		const page_quotes = getQuotes(url);
		for (q in page_quotes) {
			quotes.push({
				"text": q["text"],
				"audio": q["audio"],
				"page": page
			});
		}
		console.log(`Got ${page_quotes.length} quotes`);
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

//const pages = scrape();
const quotes = getQuotes("/wiki/Caesar");
console.log(quotes);
