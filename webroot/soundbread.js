var socket;

function soundLoaded(event) {
  // Sound is loaded, show button
  var div = document.getElementById(event.id);
  // do stuff when loaded
}

function stop() {
  if (preload !== null) {
    preload.close();
  }
  createjs.Sound.stop();
}

function play(id) {
  //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
  console.log('play: ' + id);
  var instance = createjs.Sound.play(id);
  if (instance === null || instance.playState === createjs.Sound.PLAY_FAILED) {
    console.log('Play failed');
    return;
  }

  $('#' + id).addClass('active');
  instance.addEventListener("complete", function (instance) {
    $('#' + id).removeClass("active");
  });
}

function init()
{
  var preload;
  var client_version;

  var maxcredits = 5;
  $('#credits').attr('aria-valuemax', maxcredits);

  socket = io(clientSettings.wsuri);

  if (!createjs.Sound.initializeDefaultPlugins()) {
    document.getElementById("error").style.display = "block";
    document.getElementById("content").style.display = "none";
    return;
  }

  var assetsPath = "./audio/";

  var sounds = $.parseJSON($.ajax({
    type: 'GET',
    url: '/api/sounds',
    dataType: 'json',
    success: function(){},
    data: {},
    async: false
  }).responseText);

  createjs.Sound.addEventListener("fileload", createjs.proxy(soundLoaded, this));
  createjs.Sound.registerSounds(sounds, assetsPath);

  // Simple keybinding
  $(document).keydown(function(e){
    var keyCode = e.which;

    if(keyCode === 191) { // '/' or '?'
      $('.keyhint').show();
    } else if(keyCode === 27) { // ESC
      $('.keyhint').hide();
    } else {
      $('.soundItem[data-keycode="' + keyCode + '"]').click();
    }
  });

  socket.on("version", function(version) {
    console.log("> version: " + version);
    console.log("client version: " + client_version);
    if(client_version !== undefined && version !== client_version) {
      location.reload();
    }
    client_version = version;
  });

  socket.on("clients", function(data){
    console.log("> clients: " + data);
    $('#clients').text(data);
  });

  socket.on("play", function(data){
    console.log("> play: " + data);
    play(data);
  });

  socket.on("credits", function(data){
    console.log("> credits: "+ data);
    $('#credits').attr('aria-valuenow', data).css('width', 100/maxcredits*data+'%');
  });

  socket.on("errormsg", function(data){
    console.log("Error: " + data);
  });

}
