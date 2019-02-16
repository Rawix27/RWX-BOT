const Discord = require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => {

  if(!message.member.hasPermission("MANAGE_SERVER")) return message.reply("No no no, no tenes permisos capo no podes hacer esto");
  if(!args[0] || args[0 == "help"]) return message.reply(`Uso: +prefix <new prefix>`);

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

  prefixes[message.guild.id] = {
    prefixes: args[0]
  };

  fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
    if (err) console.log(err)
  });

  let sEmbed = new Discord.RichEmbed()
  .setColor("#FF9900")
  .setTitle("NEW PREFIX SET!")
  .setDescription(`Set to ${args[0]}`);

  message.channel.send(sEmbed);

}

module.exports.help = {
  name: "prefix",
  description: "Cambia el prefijo del servidor para los comandos a utilizar",
  usage: "+prefix <new prefix>"
}