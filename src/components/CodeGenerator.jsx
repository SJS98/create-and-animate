import React, { useEffect } from "react";

function CodeGenerator({ elements, setCode }) {
  useEffect(() => {
    const generateCode = () => {
      return elements
        .map((element) => {
          if (element.animation) {
            return `document.querySelector('.element').classList.add('${element.animation}');`;
          }
          return "";
        })
        .join("\n");
    };

    setCode(generateCode());
  }, [elements, setCode]);

  return (
    <div className="code-generator">
      <h2>Generated Code</h2>
      <pre>{code}</pre>
    </div>
  );
}

export default CodeGenerator;
