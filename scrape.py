import sys
from bs4 import BeautifulSoup as Soup
from urllib import request
import json

base_url = "https://fallout.fandom.com"

def getQuotes(href):
    # tags of interest
    # ================
    # "div.mediaContainer" - holds the audio file plyaer
    #
    # "li" - in "Notable Quotes" section, contains quote and "div.np-quote-snd-player"
    # "div.np-quote-snd-player" contains href to audio file.
    #
    # "span.va-quotation-text" - top-of-page quote
    #
    # "div.lightbox-caption" - contains a quote and a "div.mediaContainer"
    #
    # "div.np-collapsible" - contains a "ul" of quotes

    url = base_url + href

    print("Getting quotes from page:", href)

    with request.urlopen(url) as response:
        quotes = []
        html = response.read()
        soup = Soup(html, features="html5lib")

        page_title = url.split("/").pop()

        el = soup.select_one("h2:-soup-contains('Notable quotes')")
        if el:
            el = el.next_element
            while el.name != "h2":
                if el.name == "li":

                    s = ".np-quote-snd-player-title a, np-quote-snd-player-title span"
                    for e in el.select(s):
                        e.string.replace_with("")

                    quote_text = el.string
                    audio_url = el.find("source")
                    if audio_url:
                        audio_url = audio_url["src"]
                    else:
                        autio_url = ""

                    new_quote = {
                        "quote_text": quote_text,
                        "audio_url": audio_url,
                        "page_title": page_title
                    }
                    quotes.append(new_quote)
                    print("Got quote:", new_quote)

                elif el.name == "h2":
                    break

                el = el.next_element

        return quotes

def crawl(href):
    page_title = href.split("/").pop().lower()
    if (page_title.startswith("file:")):
        return []
    elif (page_title.startswith("category:") == False):
        return getQuotes(href)

    quotes = []
    url = base_url + href
    with request.urlopen(url) as response:
        html = response.read()
        soup = Soup(html, features="html5lib")

        members = soup.select("div.category-page__members .category-page__member-link")
        if members:
            for m in members:
                quotes += crawl(m["href"])

    return quotes

if __name__ == "__main__":
    href = '/wiki/Category:Characters_by_game'
    quotes = crawl(href)
    quotes += getQuotes(url)
    with open("quotes.json", "w") as quoteFile:
        json.dump(quotes, quoteFile)
