// import React from "react";
// import loaderImg from "../../assets/loader.gif";
// import ReactDOM from "react-dom";
// import "./Loader.scss";


// const Loader = () => {

//   return (
//     ReactDOM.createPortal(
//       <div className="wrapper">
//         <div className="loader">
//           <img src={loaderImg} alt="Loading..." />
//         </div>
//       </div>
//     ),
//     document.getElementById("loader")
//   );
// }

// export const SpinnerImg = () => {
//   return (
//     <div className="--center-all">
//       <img src={loaderImg} alt="Loading..." />
//     </div>
//   );
// };


// export default Loader


import React from "react";
import loaderImg from "../../assets/loader.gif";
import ReactDOM from "react-dom";
import "./Loader.scss";

const Loader = () => {
  const loaderElement = document.getElementById("loader");

  // Check if the loaderElement exists
  if (!loaderElement) {
    console.error("Loader target element not found.");
    return null; // Render nothing if the target is not found
  }

  return ReactDOM.createPortal(
    <div className="wrapper">
      <div className="loader">
        <img src={loaderImg} alt="Loading..." />
      </div>
    </div>,
    loaderElement
  );
};

export const SpinnerImg = () => {
  return (
    <div className="--center-all">
      <img src={loaderImg} alt="Loading..." />
    </div>
  );
};

export default Loader;
