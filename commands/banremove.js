const Discord = require("discord.js");
const ms = require("ms");;
const moment = require('moment');
var matchmakinggg = require("./matchmakingban.js");

const date = moment().format('lll');

const botconfig = require("../botconfig.json");
const mysql = require("mysql");



var con = mysql.createConnection({
  host: botconfig.host,
  user: botconfig.user,
  password: botconfig.password,
  database: botconfig.database
})

// const dateUnban = moment(date).add(mutetime).format('lll'); // ACA NO FUNCIONA, TIENE QUE IR DEBAJO de MUTETIME



module.exports.run = async (bot, message, args) => {

 let miembroStaff = message.member.roles.find("name", "Staff");


 if(miembroStaff){

  //+mmban @user 1s/m/h/d

  let userinfo = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!userinfo) return message.reply("No se ha mencionado al usuario.");
  //if(!bot.hasPermission("MANAGE_MESSAGES")) return message.reply("El BOT necesita los siguientes permisos: ADMINISTRAR MENSAJES");
  //if(!bot.hasPermission("MANAGE_ROLES")) return message.reply("El BOT necesita los siguientes permisos: ADMINISTRAR ROLES");
 // if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");  
  
 con.query(`SELECT * FROM bans WHERE id = '${userinfo.id}'`, (err, rows) => {
  if(err) throw err;
  let sql;
       //TRY ADDING THIS LINE RIGHT HERE
  if(rows.length < 1){
      message.reply("El usuario mencionado no tiene registrado baneos");
  } else {
     let bans = rows[0].bans;
    sql = `UPDATE bans SET bans = ${bans - 1} WHERE id = '${userinfo.id}'`;
  
  const removeBan = new Discord.RichEmbed()
  .setTitle('BAN REMOVIDO')
  .setColor(0x1436B8)
  //  .setDescription(`*El usuario <@${userinfo.id}> ha sido baneado: ${matchmakinggg.numerodebaneos} veces*`)
  .addField(`Usuario:`, `<@${userinfo.id}>`)
  .addField(`Nueva cantidad de baneos:`, `${bans - 1}`)
  //.addField(`Estado actual:`, `${}`)
  //  .addField(`Fecha del ultimo baneo:`, `${matchmakinggg.dateBan}`)
  .setThumbnail('https://i.imgur.com/8kqz8bf.png')
  .setFooter('Removido por: '+message.author.tag, message.author.displayAvatarURL)
  // Send the embed to the same channel as the message
  // message.channel.send(embedBan1);
  // message.channel.find("name", "matchmaking-bans");
  //console.log(bans);
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
