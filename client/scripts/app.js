// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox'
};

var currentTime = Date.now();
var username = window.location.search.replace('?username=', '');
var roomname = 'default';
var rooms = [];
var allMessages = [];

app.init = function() {

}

/*var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};*/
app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {

      
      var i = 0;
      var tempTime = currentTime;
      currentTime = Date.now();
      while(Date.parse(data.results[i].createdAt) > tempTime && i < 500) {

        i++;
      }
      /*if(i === 0){
        debugger;
      }*/
      i--;
      while(i >=0) {
        if (data.results[i].text === undefined){
          data.results[i].text = '';
        }
        if (data.results[i].roomname === undefined){
          data.results[i].roomname = '';
        }
        if (data.results[i].username === undefined){
          data.results[i].username = '';
        }
        allMessages.push(data.results[i]);
        if(!_.contains(rooms, data.results[i].roomname)){
          rooms.push(data.results[i].roomname);
          $('.roomName').append($('<option>' + escapedString(data.results[i].roomname) + '</option>'));
        }
        var name = $('<div>' +
                      'User Name:<a href = "#" class = "userName">' + escapedString(data.results[i].username) + '</a>' +
                      '<div>' + 'msg:' + escapedString(data.results[i].text) + '</div>' +
                    '</div>');
        // var msg = $('<div display="in-line">' + 'msg:' + escapedString(data.results[i].text) + '</div>');
        $('#chats').prepend(name);
        
        // $('#chats').prepend($('<span display="in-line">' + 'time:' + data.results[i].createdAt + '</span>'));
        // $('#chats').prepend($('<span display="in-line">' + '--------------------------------------' + '</span>'));
        i--;
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message');
    }
  });
}
app.fetch();
setInterval(function() {
  app.fetch()
}, 1000);

$(document).ready(function(){
  $(".button").on('click', function(event){
    event.preventDefault();
    var message = {
      username: username,
      roomname: roomname,
      text: $('form')[0][1].value
    }
    app.send(message);
    // $('form')[0][0].value = '';
  });
  $(".roomName").change(function(something){
    event.preventDefault();
    var room = $('form')[0][0].value;
    console.log(room);
  });
});



var escapedString = function(str){
  var newStr;
  if (str === undefined){
    debugger;
  }
  newStr = str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#39;');
  return newStr;
};

app.clearMessages = function() {
  $('#chats').html('');
}

app.addMessages = app.send;

app.addRoom = function() {

}

app.addFriend = function() {

}

app.handleSubmit = function() {

}