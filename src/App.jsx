import React, { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import AnimationsList from "./components/AnimationsList";
import axios from "axios";

const AppContext = createContext();

export default function App() {
  const [elements, setElements] = useState([]);
  const [frames, setFrames] = useState([[]]);
  const [showFrameSelection, setShowFrameSelection] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [iframeContent, setIframeContent] = useState("");

  const [animations] = useState(AnimationsList);

  const handleAddAnimation = (animationName) => {
    setSelectedAnimation(animationName);
    setShowFrameSelection(true);
  };

  const handleSelectFrameList = (frameListIndex) => {
    if (selectedAnimation) {
      const preAnimEndTime =
        frames[frameListIndex][frames[frameListIndex].length - 1]?.animation
          ?.endTime;

      const animation = animations.find(
        (anim) => anim.animationName === selectedAnimation
      );

      const newFrame = {
        frameName: `Frame ${frames[frameListIndex].length + 1}`,
        animation: {
          ...animation,
          startTime: preAnimEndTime || 0,
          endTime: preAnimEndTime ? preAnimEndTime + 0.15 : 0.15,
          animationType: selectedAnimation,
          displacement:
            "50" +
            (["rotate", "spin", "shake"].includes(selectedAnimation)
              ? "deg"
              : "px"),
          direction: ["rotate", "spin", "shake"].includes(selectedAnimation)
            ? "clockwise"
            : "forward",
        },
      };

      const updatedFrames = frames.map((frameList, index) =>
        index === frameListIndex ? [...frameList, newFrame] : frameList
      );
      setFrames(updatedFrames);
      setShowFrameSelection(false);
      setSelectedAnimation(null);
    }
  };

  const addNewFrameList = () => {
    setFrames([...frames, []]);
  };

  const handleGenerateCode = async () => {
    // Prepare shapes and animations data
    const shapes = elements.map((el) => ({
      id: el.id,
      type: el.type,
      style: el.style,
      children: el.children,
    }));

    const animationsData = frames; // Adjust as per your frames structure

    try {
      const response = await axios.post("http://localhost:5000/generate-code", {
        shapes,
        animations: animationsData,
      });
      setGeneratedCode(response.data.code);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  const handlePlay = () => {
    setIframeContent(generatedCode);
  };

  return (
    <AppContext.Provider
      value={{
        elements,
        setElements,
        frames,
        setFrames,
        addNewFrameList,
        handleAddAnimation,
        handleSelectFrameList,
        showFrameSelection,
      }}
    >
      <div className="App">
        <div className="top">
          <div className="left">
            <SideBar animations={animations} />
          </div>
          <div className="center">
            <Canvas
              elements={elements}
              setElements={setElements}
              animations={animations}
              frames={frames}
              setFrames={setFrames}
              handleGenerateCode={handleGenerateCode}
              handlePlay={handlePlay}
            />
          </div>
          <div className="right">
            <CodeGenerator code={generatedCode} />
          </div>
        </div>
        <div className="bottom">
          <FrameBar
            animations={animations}
            frames={frames}
            setFrames={setFrames}
            addNewFrameList={addNewFrameList}
          />
        </div>
        {iframeContent && (
          <iframe
            title="Animation Preview"
            sandbox="allow-scripts"
            srcDoc={iframeContent}
            style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
          ></iframe>
        )}
        {showFrameSelection && (
          <div className="frame-selection-modal">
            {frames.length > 0 ? (
              frames.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectFrameList(index)}
                >
                  Frame List {index + 1}
                </button>
              ))
            ) : (
              <button onClick={addNewFrameList}>Create New List</button>
            )}
            <span
              className="close-framelist-popup-btn"
              onClick={() => setShowFrameSelection(false)}
            >
              {" "}
              X{" "}
            </span>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}

function CodeGenerator({ elements, code, setCode, frames }) {
  useEffect(() => {
    const generateCode = async () => {
      let code = "";

      // Iterate through each element
      elements.forEach((element, i) => {
        // Check if the element has frames
        if (frames && frames.length > 0) {
          // Iterate through each frame list
          frames.forEach((frameList, j) => {
            // Iterate through each frame of the frame list
            frameList.forEach((frame) => {
              const animation = AnimationsList.find(
                (anim) => anim.animationName === frame.animation.animationType
              );

              // Check if the animation is found
              if (animation) {
                // Generate code for each frame
                code += `// Animation for Element ${i + 1}, Frame List ${
                  j + 1
                }, Frame: ${frame.framName}\n`;
                code += `${
                  animation.code
                }(document.querySelector('.element${i}'), ${JSON.stringify(
                  animation.variables
                )});\n\n`;
              }
            });
          });
        }
      });

      console.log(code);
      return code;
    };

    generateCode().then((result) => setCode(result));
  }, [elements]);

  return (
    <div className="code-generator">
      <h2>Generated Code</h2>
      <pre>{code}</pre>
    </div>
  );
}

function Canvas({
  elements,
  setElements,
  animations,
  frames,
  setFrames,
  handleGenerateCode,
  handlePlay,
}) {
  const addElement = () => {
    const newElement = { type: "shape", animation: null, frames: [] };
    setElements([...elements, newElement]);
  };

  const handleDrop = (event, elementIndex, frameListIndex) => {
    const animation = event.dataTransfer.getData("text");
    const updatedElements = [...elements];
    updatedElements[elementIndex].animation = animation;

    const preAnimEndTime =
      frames[frameListIndex][frames[frameListIndex].length - 1]?.animation
        ?.endTime;

    const newFrame = {
      framName: `Frame ${frames[frameListIndex].length + 1}`,
      animation: {
        ...animations[animation],
        startTime: preAnimEndTime || 0,
        endTime: preAnimEndTime ? preAnimEndTime + 0.15 : 0.15,
        animationType: animation,
        displacement:
          "50" +
          (["rotate", "spin", "shake"].includes(animation) ? "deg" : "px"),
        direction: ["rotate", "spin", "shake"].includes(animation)
          ? "clockwise"
          : "forward",
      },
    };

    updatedElements[elementIndex].frames.push(newFrame);
    setElements(updatedElements);
    const updatedFrames = frames.map((frameList, index) =>
      index === frameListIndex ? [...frameList, newFrame] : frameList
    );
    setFrames(updatedFrames);
  };

  const [codeflag, setCodeFlag] = useState(false);
  const [animflag, setAnimFlag] = useState(false);

  useEffect(() => {
    handleCanvasWidth();
  }, [animflag, codeflag]);

  const handleCanvasWidth = () => {
    const top = document.querySelector(".top");
    if (animflag === true && codeflag === true) {
      top.style.gridTemplateColumns = "0vw 100vw 0vw";
    } else if (animflag === true && codeflag === false) {
      top.style.gridTemplateColumns = "0vw 80vw 20vw";
    } else if (animflag === false && codeflag === true) {
      top.style.gridTemplateColumns = "20vw 80vw 0vw";
    } else if (animflag === false && codeflag === false) {
      top.style.gridTemplateColumns = "20vw 60vw 20vw";
    }
  };
  const handleCodeGenerationSidebar = () => {
    document.querySelector(".code-generator").style.display = codeflag
      ? "block"
      : "none";
    setCodeFlag(!codeflag);
  };

  const handleAnimationsSidebar = () => {
    document.querySelector(".sidebar").style.display = animflag
      ? "block"
      : "none";
    setAnimFlag(!animflag);
  };

  return (
    <div className="canvas">
      <button className="code-btn" onClick={handleCodeGenerationSidebar}>
        CODE
      </button>
      <button className="generate-code-btn" onClick={handleGenerateCode}>
        Generate
      </button>
      <button className="add-element-btn" onClick={addElement}>
        Add Element
      </button>
      <button className="play-btn" onClick={handlePlay}>
        Play
      </button>
      <button className="animations-btn" onClick={handleAnimationsSidebar}>
        Animations
      </button>
      {elements.map((element, elementIndex) => (
        <div
          key={elementIndex}
          className={`element element${elementIndex} ${element.animation}`}
        >
          {frames.map((_, frameListIndex) => (
            <div
              key={frameListIndex}
              className="drop-zone"
              onDrop={(event) =>
                handleDrop(event, elementIndex, frameListIndex)
              }
              onDragOver={(event) => event.preventDefault()}
            >
              Drop Animation Here for Frame List {frameListIndex + 1}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SideBar({ animations }) {
  const { handleAddAnimation } = useContext(AppContext);
  const convertCamelToCapatalize = (string) => {
    return string
      .split(/(?=[A-Z])/)
      .join(" ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  return (
    <div className="sidebar">
      <div className="animations">
        <h2>Animations</h2>
        <div className="animations-list">
          {animations.map((anim, index) => (
            <div
              key={index}
              draggable
              className="animation-item"
              onDragStart={(event) =>
                event.dataTransfer.setData("text", anim.animationName)
              }
            >
              {convertCamelToCapatalize(anim.animationName)}
              <span
                className="add-anim-to-list"
                onClick={() => handleAddAnimation(anim.animationName)}
              >
                +
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FrameBar({ frames, setFrames, addNewFrameList }) {
  const handleRemoveFrame = (frameListIndex, frameIndex) => {
    const updatedFrames = frames.map((frameList, index) =>
      index === frameListIndex
        ? frameList.filter((_, i) => i !== frameIndex)
        : frameList
    );
    setFrames(updatedFrames);
  };

  const handleRemoveFrameList = (index) => {
    setFrames(frames.filter((_, i) => i !== index));
  };

  const handleDragStart = (event, frameListIndex, frameIndex) => {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ frameListIndex, frameIndex })
    );
  };

  const handleDrop = (event, targetListIndex, targetFrameIndex) => {
    const { frameListIndex, frameIndex } = JSON.parse(
      event.dataTransfer.getData("text/plain")
    );
    if (frameListIndex !== targetListIndex || frameIndex !== targetFrameIndex) {
      const updatedFrames = frames.map((frameList, index) => {
        if (index === frameListIndex) {
          const frameToMove = frameList[frameIndex];
          return frameList.filter((_, i) => i !== frameIndex);
        }
        return frameList;
      });

      const frameToMove = frames[frameListIndex][frameIndex];
      updatedFrames[targetListIndex].splice(targetFrameIndex, 0, frameToMove);
      setFrames(updatedFrames);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="framebar">
      <h2>Frames</h2>
      <div className="frames">
        {frames.map((frameList, listIndex) => (
          <div key={listIndex} className="frame-list">
            <h4>Frame List {listIndex + 1}</h4>
            {frameList.map((frame, index) => (
              <div
                key={index}
                className="frame-item"
                draggable
                onDragStart={(event) =>
                  handleDragStart(event, listIndex, index)
                }
                onDrop={(event) => handleDrop(event, listIndex, index)}
                onDragOver={handleDragOver}
              >
                <span className="stepName">
                  <span className="stepCount">{index + 1}</span>
                  {frame.animation.animationType}
                  <div>
                    <span className="more-btn"> Edit </span>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFrame(listIndex, index)}
                    >
                      Remove
                    </button>
                  </div>
                </span>
                <hr />
                {/* <span className="stepDisplacement">
                  Displacement: {frame.animation.displacement}
                </span>
                <span className="stepDirection">
                  Direction: {frame.animation.direction}
                </span> */}
                <span className="stepDesc">
                  {frame.animation.displacement} | {frame.animation.direction} |{" "}
                  {frame.animation.startTime} - {frame.animation.endTime} s
                </span>
              </div>
            ))}
            <button
              className="remove-list-btn"
              onClick={() => handleRemoveFrameList(listIndex)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button className="add-new-frame-list-btn" onClick={addNewFrameList}>
        Add New Frame List
      </button>
    </div>
  );
}
