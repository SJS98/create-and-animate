import React, { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import AnimationsList from "./components/AnimationsList";
import axios from "axios";
import { secureStorify } from "secure-storify";
const AppContext = createContext();

export default function App() {
  const [elements, setElements] = useState([]);
  const [code, setCode] = useState("");
  const [animations] = useState(AnimationsList);
  const [frames, setFrames] = useState([[]]);
  const [showFrameSelection, setShowFrameSelection] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddAnimation = (animationName) => {
    setSelectedAnimation(animationName);
    setShowFrameSelection(true);
  };

  const handleSelectFrameList = (frameListIndex) => {
    if (selectedAnimation) {
      const preAnimEndTime =
        frames[frameListIndex][frames[frameListIndex].length - 1]?.animation
          ?.endTime;

      const newFrame = {
        framName: `Frame ${frames[frameListIndex].length + 1}`,
        animation: {
          ...animations.find(
            (anim) => anim.animationName === selectedAnimation
          ),
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

  const generateHTML = async () => {
    // Prepare the data to send to ChatGPT
    const shapeData = elements.map((element) => ({
      type: element.type,
      properties: {
        width: element.width,
        height: element.height,
        color: element.color,
        position: {
          x: element.x,
          y: element.y,
        },
        children: element.children || [],
      },
      animations: element.animations || [],
    }));

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that generates HTML, CSS, and JavaScript code based on the provided shape data and animations.",
            },
            {
              role: "user",
              content: `Generate the HTML, CSS, and JavaScript code for the following shapes and their animations:\n\n${JSON.stringify(
                shapeData,
                null,
                2
              )}`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace with your OpenAI API key
          },
        }
      );

      const aiGeneratedCode = response.data.choices[0].message.content;
      setGeneratedCode(aiGeneratedCode);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // Implement logic to execute the generated code
    // This could involve inserting the generated HTML/CSS/JS into an iframe
  };

  const handleStop = () => {
    setIsPlaying(false);
    // Implement logic to stop the animation
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
            />
          </div>
          <div className="right">
            <CodeGenerator
              elements={elements}
              code={code}
              setCode={setCode}
              frames={frames}
            />
          </div>
        </div>
        <div className="bottom">
          <FrameBar
            animations={animations}
            frames={frames}
            setFrames={setFrames}
            addNewFrameList={addNewFrameList}
          />
          <button onClick={generateHTML}>Generate Code</button>
          <button onClick={handlePlay}>Play</button>
          <button onClick={handleStop}>Stop</button>
        </div>
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
        {isPlaying && (
          <div className="playback-container">
            <iframe
              title="Animation Playback"
              srcDoc={generatedCode}
              style={{ width: "100%", height: "500px", border: "none" }}
            ></iframe>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}

function CodeGenerator({ elements, code, setCode, frames }) {
  useEffect(() => {
    const generateCode = () => {
      return elements
        .map((element) => {
          if (element.animations && element.animations.length > 0) {
            return element.animations
              .map(
                (anim) =>
                  `document.querySelector('.element-${element.id}').classList.add('${anim}');`
              )
              .join("\n");
          }
          return "";
        })
        .join("\n");
    };

    const generatedCode = generateCode();
    setCode(generatedCode);
  }, [elements, setCode]);

  return (
    <div className="code-generator">
      <h2>Generated Code</h2>
      <pre>{code}</pre>
    </div>
  );
}
import { ResizableBox } from "react-resizable";
import Draggable from "react-draggable";
import "react-resizable/css/styles.css";

function Canvas({ elements, setElements, animations, frames, setFrames }) {
  const { addNewFrameList } = useContext(AppContext);

  const addElement = (type = "div") => {
    const newElement = {
      id: Date.now(),
      type: type,
      width: 100,
      height: 100,
      color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
      x: 0,
      y: 0,
      animations: [],
      children: [],
    };
    setElements([...elements, newElement]);
  };

  const handleDragStop = (e, data, id) => {
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, x: data.x, y: data.y } : el
    );
    setElements(updatedElements);
  };

  const handleResize = (event, { element, size }, id) => {
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, width: size.width, height: size.height } : el
    );
    setElements(updatedElements);
  };

  const handleDelete = (id) => {
    const updatedElements = elements.filter((el) => el.id !== id);
    setElements(updatedElements);
  };

  const handleDrop = (event, id) => {
    const animation = event.dataTransfer.getData("text");
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, animations: [...el.animations, animation] } : el
    );
    setElements(updatedElements);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const addChildShape = (parentId) => {
    const parent = elements.find((el) => el.id === parentId);
    if (parent) {
      const newChild = {
        id: Date.now(),
        type: "div",
        width: 50,
        height: 50,
        color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
        x: parent.x + 20,
        y: parent.y + 20,
        animations: [],
        children: [],
      };
      const updatedElements = elements.map((el) =>
        el.id === parentId
          ? { ...el, children: [...el.children, newChild] }
          : el
      );
      setElements(updatedElements);
    }
  };

  return (
    <div className="canvas">
      <button className="add-element-btn" onClick={() => addElement()}>
        Add Shape
      </button>
      {elements.map((element) => (
        <Draggable
          key={element.id}
          position={{ x: element.x, y: element.y }}
          onStop={(e, data) => handleDragStop(e, data, element.id)}
        >
          <ResizableBox
            width={element.width}
            height={element.height}
            onResizeStop={(e, size) => handleResize(e, size, element.id)}
            minConstraints={[50, 50]}
            maxConstraints={[500, 500]}
          >
            <div
              className={`element ${element.animations.join(" ")}`}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: element.color,
                position: "relative",
                overflow: "hidden",
              }}
              onDrop={(e) => handleDrop(e, element.id)}
              onDragOver={handleDragOver}
            >
              <span
                className="delete-btn"
                onClick={() => handleDelete(element.id)}
              >
                &times;
              </span>
              <button
                className="add-child-btn"
                onClick={() => addChildShape(element.id)}
              >
                Add Child
              </button>
              {/* Render child shapes recursively */}
              {element.children.map((child) => (
                <Draggable
                  key={child.id}
                  position={{ x: child.x, y: child.y }}
                  onStop={(e, data) => handleDragStop(e, data, child.id)}
                >
                  <ResizableBox
                    width={child.width}
                    height={child.height}
                    onResizeStop={(e, size) => handleResize(e, size, child.id)}
                    minConstraints={[30, 30]}
                    maxConstraints={[300, 300]}
                  >
                    <div
                      className={`element ${child.animations.join(" ")}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: child.color,
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onDrop={(e) => handleDrop(e, child.id)}
                      onDragOver={handleDragOver}
                    >
                      <span
                        className="delete-btn"
                        onClick={() => handleDelete(child.id)}
                      >
                        &times;
                      </span>
                      <button
                        className="add-child-btn"
                        onClick={() => addChildShape(child.id)}
                      >
                        Add Child
                      </button>
                      {/* Further nesting can be handled recursively if needed */}
                    </div>
                  </ResizableBox>
                </Draggable>
              ))}
            </div>
          </ResizableBox>
        </Draggable>
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
