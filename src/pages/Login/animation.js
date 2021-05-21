import React, { Component } from "react";
import Lottie from "react-lottie";
import animationData from "./lf30_editor_lvlcsgns.json";

class UncontrolledLottie extends Component {
  render() {
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return (
        <Lottie options={defaultOptions} height={"7em"} width={"10em"} />
    );
  }
}

export default UncontrolledLottie;
