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


 if(miembroStaff){


  let userinfo = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!userinfo) return message.reply("No se ha mencionado al usuario.");
  //if(!bot.hasPermission("MANAGE_MESSAGES")) return message.reply("El BOT necesita los siguientes permisos: ADMINISTRAR MENSAJES");
  //if(!bot.hasPermission("MANAGE_ROLES")) return message.reply("El BOT necesita los siguientes permisos: ADMINISTRAR ROLES");
 // if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");  
  
 con.query(`SELECT * FROM bans WHERE id = '${userinfo.id}'`, (err, rows) => {
  if(err) throw err;
  let sql;
  if(rows.length < 1){
      message.reply("El usuario mencionado no tiene registrado baneos");
  } else {
     let bans = rows[0].bans;
    sql = `UPDATE bans SET bans = ${bans - 1} WHERE id = '${userinfo.id}'`;
  
  const removeBan = new Discord.RichEmbed()
  .setTitle('BAN REMOVIDO')
  .setColor(0x1436B8)
  .addField(`Usuario:`, `<@${userinfo.id}>`)
  .addField(`Nueva cantidad de baneos:`, `${bans - 1}`)
  //.addField(`Estado actual:`, `${}`)
  .setThumbnail('https://i.imgur.com/8kqz8bf.png')
  .setFooter('Removido por: '+message.author.tag, message.author.displayAvatarURL)
  // Send the message to a specific channel
  // message.channel.find("name", "matchmaking-bans");
  // console.log(bans);
  message.channel.send(removeBan);
  }
  
  con.query(sql, console.log);
  });

  

  //end of principal IF to check role
}

if(!miembroStaff) return message.reply("No tenes los permisos suficientes")


//end of module
}

module.exports.help = {
  name: "banremove",
  description: "See info about the bans of a player",
  usage: "+banremove @user"
}
