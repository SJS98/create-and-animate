import React from "react";

function Canvas({ elements, setElements }) {
  const addElement = () => {
    const newElement = { type: "shape", animation: null };
    setElements([...elements, newElement]);
  };

  const handleDrop = (event, index) => {
    const animation = event.dataTransfer.getData("text");
    const updatedElements = [...elements];
    updatedElements[index].animation = animation;
    setElements(updatedElements);
  };

  return (
    <div className="canvas">
      <button onClick={addElement}>Add Shape</button>
      {elements.map((element, index) => (
        <div
          key={index}
          className={`element ${element.animation}`}
          onDrop={(event) => handleDrop(event, index)}
          onDragOver={(event) => event.preventDefault()}
        >
          Shape
        </div>
      ))}
    </div>
  );
}

export default Canvas;
