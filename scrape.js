const axios = require("axios");
const cheerio = require("cheerio");
const base_url = "https://fallout.fandom.com";

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
	//
	// "div.np-collapsible" - contains a "ul" of quotes

	const { data } = await axios.get(base_url.concat(url));
	const $ = cheerio.load(data);

	const heading = "h2:contains('Notable quotes')";
	// TODO: get the quotes under the heading
	var quote_section = $("h2:contains('Notable quotes')").nextUntil("h2");
	var elements = quote_section.find("li");
	console.log(elements["1"].text);
	return;
	const quotes = [];
	var i = 0;
	while (elements[i]) {
		console.log("Quote text:");
		console.log(elements[i].text);
		i++;
		continue;
		quotes.push({
			"text": elements[i].text,
			"audio": ""
		});
	}
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
