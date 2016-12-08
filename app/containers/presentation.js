import { ipcRenderer } from "electron";
import React, { Component, PropTypes } from "react";
import { Viewer } from "spectacle-editor-viewer";
import Socket from "../components/utils/socket";

class Presentation extends Component {
  static propTypes = {
    screenCapture: PropTypes.bool,
    remote: PropTypes.bool
  };

  constructor(props) {
    super(props);
    let socket = null;
    if (props.remote) {
      socket = new Socket();
      ipcRenderer.on("message", (event, data) => {
        socket.message(data);
      });

      socket.on("send", (data) => {
        ipcRenderer.send("socket-send", data);
      });
    }
    this.lastCurrentSlideIndex = 0;
    ipcRenderer.on("update", (event, data) => {
      console.log("update", data);
      this.setState({
        currentSlideIndex: data.currentSlideIndex,
        content: {
          presentation: data
        }
      });
    });

    this.state = {
      content: null,
      socket
    };
  }

  componentDidMount() {
    const { socket } = this.state;

    if (socket) {
      this.onNextFrame(() => {
        console.log("socket setup");
        socket.emit("open");
      });
    }
  }

  componentDidUpdate() {
    if (this.props.screenCapture) {
      setTimeout(() => {
        if (this.lastCurrentSlideIndex !== this.state.currentSlideIndex) {
          this.lastCurrentSlideIndex = this.state.currentSlideIndex;

          return;
        }

        ipcRenderer.send("ready-to-screencap", {
          currentSlideIndex: this.state.currentSlideIndex,
          numberOfSlides: this.state.content.presentation.slides.length
        });
      }, 10);
    }
  }

  onNextFrame(callback) {
    setTimeout(() => {
      window.requestAnimationFrame(callback);
    });
  }

  render() {
    const { socket } = this.state;
    if (socket) {
      this.onNextFrame(() => {
        console.log("socket setup");
        socket.emit("open");
      });
    }
    return (
      <div>
        <style>
          {`
            body {
              overflow: hidden;
            }
          `}
        </style>
        {this.props.screenCapture && <style>
          {`
            body {
              transform: scale(0.25);
              height: 700px;
              width: 1000px;
              top: -262.5px;
              left: -375px;
            }
          `}
          </style>
        }
        {this.state.content && <Viewer content={this.state.content} remote={socket} />}
      </div>
    );
  }
}

export default Presentation;
