import React from "react";
import "./Loading.css";

class Loading extends React.Component {
  render() {
    //const theme = this.props.theme;
    return (
      <div className="loading-main">
      <div className="loader-wrapper"><div className="loader"></div></div>
      {/*<div className="loader-wrapper" style={{ color: theme.body}}><div className="loader"></div></div>*/}
      </div>
    );
  }
}

export default Loading;
