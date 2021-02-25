const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const base_url = "https://fallout.fandom.com";

async function getQuotes(quotes, url) {
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

	const { data } = await axios.get(base_url.concat(url)).catch( error => {
		console.error(`Error loading page: ${url}`);
		return;
	});
	const $ = cheerio.load(data);

	const page_title = url.split("/").pop();
	quotes["pages"][page_title] = [];
	const page = {"page_title": page_title, "quotes": []};

	var quote_section = $("h2:contains('Notable quotes')")
		.nextUntil("h2")
		.find("li");
	quote_section.find("a,span").text("");
	for (let i = 0; i < quote_section.length; i++) {
		let li = quote_section.eq(i);
		let quote_text = li.text();
		let audio_url = li.find("source").attr("src");
		quotes["pages"][page_title]["quotes"].push {
			"text": quote_text,
			"audio": audio_url,
		});
		console.log(quote_text);
	}

	console.log(`Got ${page["quotes"].length} quotes from ${url}`);
}

async function crawl(quotes, url) {

	const page_title = url.split("/").pop().toLowerCase();
	if (page_title.startsWith("file:")) {
		return;
	} else if (page_title.startsWith("category:") === false) {
		return getQuotes(quotes, url);
	}

	const { data } = await axios.get(base_url.concat(url)).catch(error => {
		console.error(`Error loading page: ${url}`);
		return;
	});

	const $ = cheerio.load(data);

	var members = $("div.category-page__members").find(".category-page__member-link");
	for (let i = 0; i < members.length; i++) {
		crawl(quotes, members.eq(i).attr("href"));
	}
}

function getCharQuotes() {
	const start_url ="/wiki/Category:Characters_by_game";
	const quotes = {"pages": {}};
	crawl(quotes, start_url);
	return quotes;
	console.log("Writing to quotes.json...");
	fs.writeFile("quotes.json", JSON.stringify(quotes), "utf8", (err) => {
		if (err) {
			console.log(`Error writing file: ${err}`);
		} else {
			console.log("Quote database successfully saved!");
		}
	});
}

getCharQuotes();
