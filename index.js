//requiring needed modules
const Discord = require('discord.js');
const request = require('request');

//make Discord bot client
const bot = new Discord.Client();




//Math functions
function kelToFar(kel){
  kel = parseFloat(kel);
  return ((kel * (9/5)) - 459.67).toString();
}

//Emoji weather resolver
function emoj(owi){
  if(owi == "01d" || owi == "01n"){ return ":sunny:"; }
  if(owi == "02d" || owi == "02n"){ return ":white_sun_small_cloud:"; }
  if(owi == "03d" || owi == "03n"){ return ":white_sun_cloud:"; }
  if(owi == "04d" || owi == "04n"){ return ":cloud:"; }
  if(owi == "09d" || owi == "09n"){ return ":cloud_rain:"; }
  if(owi == "10d" || owi == "10n"){ return ":white_sun_rain_cloud:"; }
  if(owi == "11d" || owi == "11n"){ return ":thunder_cloud_rain:"; }
  if(owi == "13d" || owi == "13n"){ return ":cloud_snow:"; }
  if(owi == "50d" || owi == "50n"){ return ":fog:"; } //This is a custom emoji, you would have to add your own
}

//Unix time to normal
function realTime(unx){
  var mer = "AM";
  var date = new Date(unx*1000);
  var hours = date.getHours();
  if(hours > 12){
    hours = hours - 12;
    var mer = "PM";
  }
  var min = 0 + date.getMinutes();
  var sec = 0 + date.getSeconds();
  return hours+":"+min+":"+sec+" "+mer;
}

//Unix date to normal
function realDate(unx){
  var mer = "AM";
  var date = new Date(unx*1000);
  var year = date.getFullYear();
  var mont = date.getMonth();
  var dow = date.getDay();
  var day = date.getDate();
  var hour = date.getHours();
  if(hour > 12){
    hour = hour - 12;
    var mer = "PM";
  }
  var min = 0 + date.getMinutes();
  var sec = 0 + date.getSeconds();
  function dowRes(num){
    if(num == 0){ return "Sunday" }
    if(num == 1){ return "Monday" }
    if(num == 2){ return "Tuesday" }
    if(num == 3){ return "Wendsday" }
    if(num == 4){ return "Thursday" }
    if(num == 5){ return "Friday" }
    if(num == 6){ return "Saturday" }
  }
  return hour+":"+min+":"+sec+" "+mer+" on "+dowRes(dow)+" the "+mont+" "+day+", "+year
}

//Commands Array
var commands = [];

//on bot ready
bot.on('ready', () => {
  console.log(`Bot ${bot.user.tag} online`);
});

//on bot message
bot.on('message', (message) => {

  //Command handler
  function mainIn(string, array){
    var spli = string.split(" ");
    var x = array.findIndex(i => i.trigger === spli[0]+" ");
    if(array[x]){
      var obj = array[x];
      if(spli.length == obj.args){
        var regex = new RegExp("^"+obj.trigger+"", "gm");
        if(regex.test(string)){
          return obj.exec(spli[1], message);
        } else {
          return "Command trigger error";
        }
      } else {
        return "Wrong number of args in statment: given "+spli.length+", needed "+obj.args;
      }
    } else {
      comStrArray = [];
      commands.forEach(function(i){
        var nn = i.trigger;
        var nnn = nn.replace("!", "");
        var nnn = nnn.replace(" ", "");
        comStrArray.push(nnn);
      });
      return "Command not in command array: commands = ["+comStrArray.toString()+"]";
    }
  }

  //Commands
  var weather = {
    trigger: "!weather ",
    exec: function(zip, message){
      var url = "http://api.openweathermap.org/data/2.5/weather?zip="+zip+"&APPID=ID-GOES-HERE"; //To Get AppID, go to https://openweathermap.org/appid
      request(url, function(e,r,b){
        var p = JSON.parse(b);
        console.log(p);
        if(p.main != undefined){
          console.log(message.author.username+" from "+message.author.channel+" requested the weather ("+Date.now()+")");
          message.channel.send(
            "__**"+p.name+" Weather | "+Math.round(kelToFar(p.main.temp))+"°F "+emoj(p.weather[0].icon)+"**__ \n"+p.weather[0].main+" with a high of **"+Math.round(kelToFar(p.main.temp_max))+"°F** and a low of **"+Math.round(kelToFar(p.main.temp_min))+"°F** \nHumidity at **"+p.main.humidity+"%** and Atmospheric Pressure at **"+p.main.pressure+" hPa** \nWind speed **"+Math.round(p.wind.speed * 2.997446 * 100) / 100+" mph** from bearing **"+p.wind.deg+"°** \nSunrise **"+realTime(p.sys.sunrise)+"**, Sunset **"+realTime(p.sys.sunset)+"** \nMeasured at Longitude **"+p.coord.lon+"**, Latitude **"+p.coord.lat+"** \n*Data was updated at "+realDate(p.dt)+"*"
          );
        }
      });
    },
    args: 2
  }
  commands.push(weather);

  //Command Handle Listner
  mainIn(message.content, commands);
  
});


//login bot
bot.login('BOT TOKEN GOES HERE');
