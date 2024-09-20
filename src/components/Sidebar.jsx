import React from "react";

function SideBar() {
  const animations = ["fadeIn", "slideUp", "rotate"];

  return (
    <div className="sidebar">
      <h2>Animations</h2>
      {animations.map((anim, index) => (
        <div key={index} draggable className="animation-item">
          {anim}
        </div>
      ))}
    </div>
  );
}

export default SideBar;
