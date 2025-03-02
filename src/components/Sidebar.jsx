// SideBar.js

import React, { useContext } from "react";
import { AppContext } from "../App"; // Ensure AppContext is exported from App.js

function SideBar() {
  const { handleAddAnimation } = useContext(AppContext);
  const animations = [
    "fadeIn",
    "fadeOut",
    "slideUp",
    "slideDown",
    "slideLeft",
    "slideRight",
    "rotate",
    "scaleUp",
    "scaleDown",
    "bounce",
    "shake",
    "pulse",
    "flip",
    "swing",
    "spin",
    "zoomIn",
    "zoomOut",
    "hinge",
    "delay",
  ];

  const handleDragStart = (event, animation) => {
    event.dataTransfer.setData("text", animation);
  };

  return (
    <div className="sidebar">
      <h2>Animations</h2>
      {animations.map((anim, index) => (
        <div
          key={index}
          draggable
          className="animation-item"
          onDragStart={(event) => handleDragStart(event, anim)}
        >
          {anim}
        </div>
      ))}
    </div>
  );
}

export default SideBar;
