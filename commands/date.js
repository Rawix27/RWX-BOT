const Discord = require("discord.js");
const ms = require("ms");
const embed = new Discord.RichEmbed()
const moment = require('moment')

const botconfig = require("../botconfig.json");
const mysql = require("mysql");


module.exports.run = async (bot, message, args) => {

  let miembroStaff = message.member.roles.find("name", "Staff");
  
  let miembroArbitro = message.member.roles.find("name", "Arbitro");

  if (miembroStaff || miembroArbitro) {

    let mutetime = args[0];
    if (!mutetime) return message.reply("Tiempo no especificado");
    
    let date = moment().format('lll');
    let dateBan = moment(date).format('lll');
    const TIEMPO = parseInt(mutetime, 10);
    var UNIDAD = mutetime[mutetime.length - 1];
    let dateUnban = moment(date).add(TIEMPO, UNIDAD).format('lll');

    const embedDate = new Discord.RichEmbed()
            .setTitle('DATE:')
            .setColor(0x0887DB)
            .addField(`Fecha actual:`, `${date}`)
            .setFooter('Requerido por: ' + message.author.tag, message.author.displayAvatarURL)
            .setThumbnail('https://i.imgur.com/8kqz8bf.png')
            message.channel.send(embedDate);

  } //END of IF miembroStaff

} //END of module

module.exports.help = {
  name: "date",
  description: "Prueba si el sistema de fechas funciona correctamente",
  usage: "+date [tiempo]"
}
