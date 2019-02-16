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

  if (miembroStaff) {

  
 con.query(`SELECT * FROM bans WHERE bans < 7`, (err, rows) => {
  if(err) throw err;
  let sql;
  if(rows.length < 1){
      message.reply("No hay usuarios con menos de 7 bans");
  } else {
	sql = `UPDATE bans SET bans = 0 WHERE bans < 7`;
	
	  
  const resetBans = new Discord.RichEmbed()
  .setTitle('BANS RESETEADOS')
  .setColor(0x1436B8)
  .addField(`Jugadores con menos de 7 bans reseteados a 0`)
  //.addField(`Estado actual:`, `${}`)
  .setThumbnail('https://i.imgur.com/8kqz8bf.png')
  .setFooter('Reseteado por: '+message.author.tag, message.author.displayAvatarURL)
  // Send the message to a specific channel
  // message.channel.find("name", "matchmaking-bans");
  // console.log(bans);
  message.channel.send(resetBans);
  }
  
  con.query(sql);
  });

  

  //end of principal IF to check role
}

if (!miembroStaff) return message.reply("No tenes los permisos suficientes")


//end of module
}

module.exports.help = {
  name: "banreset",
  description: "Resetea todos los baneos menores a 7",
  usage: "+banreset"
}