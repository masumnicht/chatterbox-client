// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox'
};

var currentTime = Date.now();
var username = window.location.search.replace('?username=', '');
//var roomname = 'General';
var rooms = ['General'];
var allMessages = [];
var curRoom = 'General';
var friends = [];

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
        if (data.results[i].roomname === undefined || data.results[i].roomname.trim() === ''){
          data.results[i].roomname = 'General';
        }
        if (data.results[i].username === undefined){
          data.results[i].username = '';
        }
        allMessages.push(data.results[i]);
        if(!_.contains(rooms, data.results[i].roomname)){
          rooms.push(data.results[i].roomname);
          $('.roomName').append($('<option>' + escapedString(data.results[i].roomname) + '</option>'));
        }
        if(escapedString(data.results[i].roomname) === curRoom || curRoom === 'General'){
          var messageEl = $('<div>' +
                        'User Name:<a href = "#" class = "'+ escapedString(allMessages[i].username).replace(/ /g, '') +'">' + escapedString(data.results[i].username) + '</a>' +
                        '<div>' + 'msg:' + escapedString(data.results[i].text) + '</div>' +
                      '</div>');
          $('#chats').prepend(messageEl);
        }  
        // $('#chats').prepend($('<span display="in-line">' + 'time:' + data.results[i].createdAt + '</span>'));
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
  $("#buttonMessage").on('click', function(event){
    event.preventDefault();
    var message = {
      username: username,
      roomname: curRoom,
      text: $('form')[0][3].value
    }
    app.send(message);
    $('form')[0][3].value = '';
  });
  
  $('#newRoom').on('keydown', function(event){
    if(event.keyCode === 13){
      if(!_.contains(rooms, $('form')[0][1].value)){
        curRoom = $('form')[0][1].value;
        rooms.push(curRoom);
        $('.roomName').append($('<option>' + curRoom + '</option>'));
      }
      $('.roomName').val(curRoom);
      $('.roomName').trigger('change');
      $('form')[0][1].value = '';  
    }
  });
  
  $('#messageForm').on('keydown', function(event){
    if(event.keyCode === 13){
      var message = {
        username: username,
        roomname: curRoom,
        text: $('form')[0][3].value
      }
      app.send(message);
      $('form')[0][3].value = '';
    }
  });

  $("#buttonRoom").on('click', function(event){
    event.preventDefault();
    if(!_.contains(rooms, $('form')[0][1].value)){
      curRoom = $('form')[0][1].value;
      rooms.push(curRoom);
      $('.roomName').append($('<option>' + curRoom + '</option>'));
    }
    $('.roomName').val(curRoom);
    $('.roomName').trigger('change');
    $('form')[0][1].value = '';   
  });
  
  $(".roomName").change(function(something){
    event.preventDefault();
    curRoom = $('form')[0][0].value;
    app.clearMessages();
    for(var i = 0; i < allMessages.length; i++){
      if(allMessages[i].roomname === curRoom || curRoom === 'General'){
        var messageEl = $('<div>' +
              'User Name:<a href = "#" class = "'+ escapedString(allMessages[i].username).replace(/ /g, '') +'">' + escapedString(allMessages[i].username) + '</a>' +
              '<div>' + 'msg:' + escapedString(allMessages[i].text) + '</div>' +
            '</div>');  
        $('#chats').prepend(messageEl);
      }
    }
  });

  $(this).on('click', 'a', function() {
    // var user = this.getAttribute('class');
    //friends.push(user);
    $(this).toggleClass('bold');
    //$(this).
  })
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
      .replace(/\'/g, '&#39;')
      .replace(/%20/g, ' ');
  return newStr;
};

app.clearMessages = function() {
  $('#chats').html('');
}

app.addMessages = app.send;
