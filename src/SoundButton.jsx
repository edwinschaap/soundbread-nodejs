'use strict';

var React = require('react');

var SoundButton = React.createClass({
  handleClick: function(){
    var id = this.props.sound.id;
    console.log("< " + id);
    socket.emit('play',id);
  },

  render: function() {
    var extraProps={};

    if (this.props.sound.img) {
      extraProps.style = {backgroundImage:'url(img/' + this.props.sound.img + ')'};
    }

    var keyhint = String.fromCharCode(this.props.sound.keycode);
    var styles = {display:"none"};

    return (
      <div className="soundItem gridBox"
        onClick={this.handleClick}
        id={this.props.sound.id}
        data-keycode={this.props.sound.keycode}
        {...extraProps}>
        <div className="label">{this.props.sound.title}</div>
        <div className="keyhint" style={styles}>{keyhint}</div>
      </div>
    )
  }
});

module.exports = SoundButton;
