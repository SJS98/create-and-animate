// AnimationsList.js

export default [
  {
    animationName: "fadeIn",
    variables: { duration: 1000 },
    code: `
        (element, vars) => {
          element.style.opacity = 0;
          let opacity = 0;
          const interval = setInterval(() => {
            if (opacity >= 1) clearInterval(interval);
            element.style.opacity = opacity;
            opacity += 50 / vars.duration;
          }, 50);
        }
      `,
  },
  {
    animationName: "fadeOut",
    variables: { duration: 1000 },
    code: `
        (element, vars) => {
          let opacity = 1;
          const interval = setInterval(() => {
            if (opacity <= 0) clearInterval(interval);
            element.style.opacity = opacity;
            opacity -= 50 / vars.duration;
          }, 50);
        }
      `,
  },
  {
    animationName: "slideUp",
    variables: { duration: 1000 },
    code: `
        (element, vars) => {
          element.style.transform = 'translateY(100%)';
          let position = 100;
          const interval = setInterval(() => {
            if (position <= 0) clearInterval(interval);
            element.style.transform = \`translateY(\${position}%)\`;
            position -= (100 / vars.duration) * 50;
          }, 50);
        }
      `,
  },
  {
    animationName: "slideDown",
    variables: { duration: 1000 },
    code: `
        (element, vars) => {
          element.style.transform = 'translateY(0)';
          let position = 0;
          const interval = setInterval(() => {
            if (position >= 100) clearInterval(interval);
            element.style.transform = \`translateY(\${position}%)\`;
            position += (100 / vars.duration) * 50;
          }, 50);
        }
      `,
  },
  {
    animationName: "slideLeft",
    variables: { duration: 1000 },
    code: `
        (element, vars) => {
          element.style.transform = 'translateX(100%)';
          let position = 100;
          const interval = setInterval(() => {
            if (position <= 0) clearInterval(interval);
            element.style.transform = \`translateX(\${position}%)\`;
            position -= (100 / vars.duration) * 50;
          }, 50);
        }
      `,
  },
  {
    animationName: "slideRight",
    variables: { duration: 1000 },
    code: `
        (element, vars) => {
          element.style.transform = 'translateX(0)';
          let position = 0;
          const interval = setInterval(() => {
            if (position >= 100) clearInterval(interval);
            element.style.transform = \`translateX(\${position}%)\`;
            position += (100 / vars.duration) * 50;
          }, 50);
        }
      `,
  },
  {
    animationName: "rotate",
    variables: { duration: 1000, degrees: 360 },
    code: `
        (element, vars) => {
          let angle = 0;
          const interval = setInterval(() => {
            if (angle >= vars.degrees) clearInterval(interval);
            element.style.transform = \`rotate(\${angle}deg)\`;
            angle += (vars.degrees / vars.duration) * 50;
          }, 50);
        }
      `,
  },
  {
    animationName: "scaleUp",
    variables: { duration: 1000, scale: 1.5 },
    code: `
        (element, vars) => {
          element.style.transform = 'scale(1)';
          let scale = 1;
          const interval = setInterval(() => {
            if (scale >= vars.scale) clearInterval(interval);
            element.style.transform = \`scale(\${scale})\`;
            scale += ((vars.scale - 1) / vars.duration) * 50;
          }, 50);
        }
      `,
  },
  {
    animationName: "scaleDown",
    variables: { duration: 1000, scale: 1.5 },
    code: `
        (element, vars) => {
          element.style.transform = \`scale(\${vars.scale})\`;
          let scale = vars.scale;
          const interval = setInterval(() => {
            if (scale <= 1) clearInterval(interval);
            element.style.transform = \`scale(\${scale})\`;
            scale -= ((vars.scale - 1) / vars.duration) * 50;
          }, 50);
        }
      `,
  },
  {
    animationName: "bounce",
    variables: { duration: 1000, distance: 30 },
    code: `
        (element, vars) => {
          let position = 0;
          let direction = 1;
          const interval = setInterval(() => {
            if (position >= vars.distance) direction = -1;
            if (position <= 0 && direction === -1) clearInterval(interval);
            element.style.transform = \`translateY(\${position}px)\`;
            position += (vars.distance / vars.duration) * 50 * direction;
          }, 50);
        }
      `,
  },
  {
    animationName: "shake",
    variables: { duration: 1000, distance: 10 },
    code: `
        (element, vars) => {
          let position = 0;
          let direction = 1;
          const interval = setInterval(() => {
            if (position >= vars.distance) direction = -1;
            if (position <= -vars.distance) direction = 1;
            if (direction === 1 && position === 0) clearInterval(interval);
            element.style.transform = \`translateX(\${position}px)\`;
            position += (vars.distance / vars.duration) * 50 * direction;
          }, 50);
        }
      `,
  },
  {
    animationName: "pulse",
    variables: { duration: 1000, scale: 1.1 },
    code: `
        (element, vars) => {
          let scale = 1;
          let direction = 1;
          const interval = setInterval(() => {
            if (scale >= vars.scale) direction = -1;
            if (scale <= 1) direction = 1;
            if (direction === 1 && scale === 1) clearInterval(interval);
            element.style.transform = \`scale(\${scale})\`;
            scale += ((vars.scale - 1) / vars.duration) * 50 * direction;
          }, 50);
        }
      `,
  },
  {
    animationName: "flip",
    variables: { duration: 1000, degrees: 180 },
    code: `
        (element, vars) => {
          let angle = 0;
          const interval = setInterval(() => {
            if (angle >= vars.degrees) clearInterval(interval);
            element.style.transform = \`rotateY(\${angle}deg)\`;
            angle += (vars.degrees / vars.duration) * 50;
          }, 50);
        }
      `,
  },
  {
    animationName: "swing",
    variables: { duration: 1000, degrees: 15 },
    code: `
        (element, vars) => {
          let angle = 0;
          let direction = 1;
          const interval = setInterval(() => {
            if (angle >= vars.degrees) direction = -1;
            if (angle <= -vars.degrees) direction = 1;
            if (direction === 1 && angle === 0) clearInterval(interval);
            element.style.transform = \`rotate(\${angle}deg)\`;
            angle += (vars.degrees / vars.duration) * 50 * direction;
          }, 50);
        }
      `,
  },
  {
    animationName: "spin",
    variables: { duration: 1000, degrees: 360 },
    code: `
        (element, vars) => {
          let angle = 0;
          const interval = setInterval(() => {
            if (angle >= vars.degrees) clearInterval(interval);
            element.style.transform = \`rotate(\${angle}deg)\`;
            angle += (vars.degrees / vars.duration) * 50;
          }, 50);
        }
      `,
  },
  {
    animationName: "zoomIn",
    variables: { duration: 1000 },
    code: `
        (element, vars) => {
          element.style.transform = 'scale(0)';
          let scale = 0;
          const interval = setInterval(() => {
            if (scale >= 1) clearInterval(interval);
            element.style.transform = \`scale(\${scale})\`;
            scale += 50 / vars.duration;
          }, 50);
        }
      `,
  },
  {
    animationName: "zoomOut",
    variables: { duration: 1000 },
    code: `
        (element, vars) => {
          element.style.transform = 'scale(1)';
          let scale = 1;
          const interval = setInterval(() => {
            if (scale <= 0) clearInterval(interval);
            element.style.transform = \`scale(\${scale})\`;
            scale -= 50 / vars.duration;
          }, 50);
        }
      `,
  },
  {
    animationName: "hinge",
    variables: { duration: 2000, degrees: 90, distance: 700 },
    code: `
        (element, vars) => {
          let angle = 0;
          const rotateInterval = setInterval(() => {
            if (angle >= vars.degrees) {
              clearInterval(rotateInterval);
              let distance = 0;
              const fallInterval = setInterval(() => {
                if (distance >= vars.distance) clearInterval(fallInterval);
                element.style.transform = \`translateY(\${distance}px)\`;
                distance += 50;
              }, 50);
            } else {
              element.style.transform = \`rotate(\${angle}deg)\`;
              angle += (vars.degrees / (vars.duration / 2)) * 50;
            }
          }, 50);
        }
      `,
  },
  {
    animationName: "delay",
    variables: { duration: 1000 },
    code: `
        (element, vars) => {
          return new Promise(resolve => setTimeout(resolve, vars.duration));
        }
      `,
  },
];
