var stat = {
  userLength: 0
};
var author,receiver;
var iter = 0;

var getUserList = function(){
  return space.get('users');
};

var getUserNameHolder = function(){
  return $('.user-name-bold');
};
var getReceiverHolder = function(){
  return $('.receiver-holder');
};

var addMessage = function(text, time){
  var res = null;

  var auth = "$" + author + "$";
  var rec = "$" + receiver + "$";

  if (auth.length == rec.length) {
    for (var i = 0; i < auth.length; ++i) {
      if (auth[i] != rec[i]) {
        if (auth[i] < rec[i]) res = auth + rec;
        else res = rec + auth;
      }
    }
    if (res == null) res = auth + rec;
  }
  else {
    if (auth.length < rec.length) res = auth + rec;
    else res = rec + auth; 
  }

  if(!space.get(res))
    space.set(res, []);
  var messages = space.get(res);
  messages.push({
    author: author,
    text: text,
    time: time
  });
  space.set(res,messages);
};

var getAllMessages=function(){
  var res = null;

  var auth = "$" + author + "$";
  var rec = "$" + receiver + "$";

  if (auth.length == rec.length) {
    for (var i = 0; i < auth.length; ++i) {
      if (auth[i] != rec[i]) {
        if (auth[i] < rec[i]) res = auth + rec;
        else res = rec + auth;
      }
    }
    if (res == null) res = auth + rec;
  }
  else {
    if (auth.length < rec.length) res = auth + rec;
    else res = rec + auth; 
  }

  if(!space.get(res))
    space.set(res, []);
  var messages=space.get(res);
  var div = getMessagesDiv();
  var isRight;
  for(var i = 0; i < messages.length; i++){
    if(messages[i].author == author) isRight = 1;
    else isRight = 0;
    div.append(renderMessagesInSpan(messages[i].text,messages[i].time, isRight));
  }
};

var run = function(name){
  getUserNameHolder().text(name);
  author=name;
  if(!space.get('users'))
    space.set('users', []);

  var tmp = space.get('users');
  var bad = false;
  for (var i = 0; i < tmp.length; ++i)
  {
    if (tmp[i].name == name) bad = true; 
  }
  if (bad) {
    alert('Try with another name!');
  }
  else {
    tmp.push({
     name: name
    });
  }

  space.set('users', tmp);

  showOtherUsers(name);
  updateUserList();
  updateMessages();
};

var renderUserNameInSpan = function(name){
  return '<div><div class="usernames user-lists"><center>' + name + '</center></div></div>';
};
var renderMessagesInSpan = function(message, time, isRight){
  if(isRight) return '<div class="message mr"><span class="mesview">' + message+time+'</span></div>';
  else return '<div class="message ml"><span  class="mesview">' + message +time+'</span></div>';
};
var getUserNamesDiv = function(){
  return $('.other-users');
};
var getMessagesDiv=function(){
  return $('.messages');
};
var clearOtherUsers = function(){
  getUserNamesDiv().html('');
};
var clearMessagesDiv = function(){
  getMessagesDiv().html('');
};
var showOtherUsers = function(name){
  var users = space.get('users');

  stat.userLength = users.length;

  var div = getUserNamesDiv();
  for(var i = 0; i < users.length; i++){
    if(users[i].name!=author) div.append(renderUserNameInSpan(users[i].name));
  }
};

var updateUserList = function(){
  setInterval(function(){
    clearOtherUsers();
    showOtherUsers();
  }, 2000);
};
var updateMessages= function(){
  setInterval(function(){
    clearMessagesDiv();
    getAllMessages();
  }, 1000);
};
var space = {
  get: function(key){
    return JSON.parse(localStorage.getItem(key));
  },

  set: function(key, val){
    var tmp = JSON.stringify(val);
    localStorage.setItem(key, tmp);
  },

  remove: function(key){
    localStorage.removeItem(key);
  },

  clear: function(){
    localStorage.clear();
  }
};

var t = function() {
  var text=$('#mtext').val();
   var timex = new Date();
    var time = timex.getHours().toString() + ":"  
                + timex.getMinutes().toString();
    $('#mtext').val('');
    if(text!=''){
      text += ' ';
      addMessage(text, time);
    }
    clearMessagesDiv();
    getAllMessages();   
};

$(document).ready(function(){
  var name = prompt('Please enter your name');
  

  run(name);

  $('.other-users').on('click', '.usernames', function() {
    receiver=$(this).text();
    getReceiverHolder().text(receiver);
    clearMessagesDiv();r
    getAllMessages();
  });
 
 $(('input[type=text]')).on('keydown', function(e) {
   var textvalue=$('#mtext').val();
   if (e.which == 13 && textvalue!='') {
      t();
      e.preventDefault();
    }
});
 
 $('#msend').click(function(){
    t();
  });
  
});
