const Discord = require("discord.js");
const ms = require("ms");;
const moment = require('moment');
var matchmakinggg = require("./matchmakingban.js");

var date = moment().format('lll');

const botconfig = require("../botconfig.json");
const mysql = require("mysql");



var con = mysql.createConnection({
  host: botconfig.host,
  user: botconfig.user,
  password: botconfig.password,
  database: botconfig.database,
  port: botconfig.port
})




module.exports.run = async (bot, message, args) => {

 let miembroStaff = message.member.roles.find("name", "Staff");
  
 let miembroArbitro = message.member.roles.find("name", "Arbitro");

 if (miembroStaff || miembroArbitro) {

  let userinfo = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!userinfo) return message.reply("No se ha mencionado al usuario.");
  //if(!bot.hasPermission("MANAGE_MESSAGES")) return message.reply("El BOT necesita los siguientes permisos: ADMINISTRAR ROLES");
 // if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");  
  
 /* let userbanned = userinfo.roles.find("name", "Matchmaking");

if(userbanned==null)
  userbanned='BANEADO';
else
  userbanned='NO BANEADO';

 */

 con.query(`SELECT * FROM bans WHERE id = '${userinfo.id}'`, (err, rows) => {
  if(err) throw err;
  let sql;
  if(rows.length < 1 || rows[0].bans == 0){
    message.reply("El usuario mencionado no tiene registrado baneos");
  } else{
    let bans = rows[0].bans;
    let ultimoban = rows[0].lastban;
  

  const infoBan = new Discord.RichEmbed()
  .setTitle('INFORMACION DE BAN')
  .setColor(0x1436B8)
  .addField(`Usuario:`, `<@${userinfo.id}>`)
  .addField(`Cantidad de baneos:`, `${bans}`)
  //.addField(`Estado actual:`, `${userbanned}`)
  .addField(`Fecha del ultimo baneo:`, `${ultimoban}`)
  .setThumbnail('https://i.imgur.com/8kqz8bf.png')
  .setFooter('Requerido por: '+message.author.tag, message.author.displayAvatarURL)
  // Send the message to a specific channel
  // message.channel.find("name", "matchmaking-bans");
  // console.log(bans);
  message.channel.send(infoBan);

  }
  
  //con.query(sql);
  });

  

  //end of principal IF to check role
}

if (!miembroStaff && !miembroArbitro) return message.reply("No tenes los permisos suficientes")


//end of module
}

module.exports.help = {
  name: "baninfo",
  description: "Muestra informacion sobre los baneos de un usuario",
  usage: "+baninfo [@user]"
}
