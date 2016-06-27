'use strict';

var React = require('react');
var SoundButton = require('./SoundButton');

var SoundBread = React.createClass({
  getInitialState: function(){
    return {
      sounds: []
    };
  },
  componentDidMount: function(){
    this.serverRequest = $.get('/api/sounds', function(data){
      this.setState({
        sounds: data
      });
    }.bind(this));
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  render: function(){
    var keycodes = $("1234567890QWERTYUIOPASDFGHJKLZXCVBNM".split('')).map(function(i, c) { return c.charCodeAt(0); }).get();
    return (
      <div>
        {this.state.sounds.map(function(sound){
          sound.keycode = keycodes.shift();
          return <SoundButton key={sound.id} sound={sound} />;
        })}
      </div>
    );
  }
});

module.exports = SoundBread;
