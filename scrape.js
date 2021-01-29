const axios = require("axios");
const cheerio = require("cheerio");
const base_url = "https://fallout.fandom.com";
const sqlite = require("sqlite3");

async function getPages(pages, url) {

	if (url.split("/").find(str => str.startsWith("Category:")) === undefined) {
		console.log(`Found article: ${url}`)
		pages.push(url);
		return;
	}

	const { data } = await axios.get(base_url.concat(url));
	const $ = cheerio.load(data);

	var members = $("div.category-page__members").find(".category-page__member-link");
	var i = 0
	while (members[i]) {
		getPages(pages, members[i].attribs["href"]);
		i++;
	}
}

function getCharList() {
	const start_url ="/wiki/Category:Characters_by_game";
	const pages = [];
	getPages(pages, start_url);
	return pages;
}

function findQuotes

const charList = getCharList();
