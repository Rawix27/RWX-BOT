const Discord = require("discord.js");
const ms = require("ms");
const embed = new Discord.RichEmbed()
const moment = require('moment')

const botconfig = require("../botconfig.json");
const mysql = require("mysql");




module.exports.run = async (bot, message) => {




  const embedMenu = new Discord.RichEmbed()
            .setTitle('Bienvenido al menu de configuracion')
            .setDescription(`Pagina 1`)
            .setColor(0x0887DB)
            .addField(`Menuu:`, `1`)
            .setFooter('Requerido por: ' + message.author.tag, message.author.displayAvatarURL)
            .setThumbnail('https://i.imgur.com/8kqz8bf.png')

           


 let menu = await message.channel.send(embedMenu)

await menu.react("⬅");
await menu.react("➡");
await menu.react("❌");

await message.reply("Esperando Reaccion");


const collector = menu.createReactionCollector((reaction, user) => 
user.id === message.author.id &&
reaction.emoji.name === "⬅" ||
reaction.emoji.name === "➡" ||
reaction.emoji.name === "❌"
).once("collect", reaction => {
const chosen = reaction.emoji.name;
if(chosen === "⬅"){
  message.reply("Selecciono ⬅");
    // Prev page
}else if(chosen === "➡"){
  message.reply("Selecciono ➡");
    // Next page
}else{
  message.reply("Selecciono ❌");
    // Stop navigating pages
}
collector.stop();
});

} //END of module

module.exports.help = {
  name: "menu",
  description: "Menu test",
  usage: "+menu"
}