const Discord = require('discord.js')
const client = new Discord.Client();
const token = process.env.QUOTESY_TOKEN;
const permissions = 34816

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
	if (msg.content.toLowerCase().startsWith("quotesy ")) {
		var args = msg.content.split(" ");
		args.shift();
		var quote = searchCache(args);
		sendQuote(quote, msg.channel);
	}
});

function searchCache(arg) {
	return {
		found: true,
		text: "Degenerates like you belong on a cross.",
		charname: "Recruit legionary",
		image: "https://static.wikia.nocookie.net/fallout/images/b/b9/Nv-legion-armor.png/revision/latest/scale-to-width-down/242?cb=20170208144407",
		url: "https://fallout.fandom.com/wiki/Recruit_legionary"
	};
}

function sendQuote(quote, channel) {
	var msgtext = quote.text + "\n-- " + quote.charname;
	var attach;
	if (quote.audio) {
		attach.setFile(quote.audio);
	}
	channel.send(msgtext, attach)
		.then(msg => console.log(`Sent message: ${msg.content}`))
		.catch(console.error);
}

client.login(token);
