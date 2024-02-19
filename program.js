

let canvas = document.querySelector("#c")
let gl = canvas.getContext("webgl2");

if (!gl) {
  // Incase browser doesn't support GL
  const title = document.getElementById("title")
  title.textContent = "No GL :("
}

const vcheck = document.getElementById("v")
vcheck.textContent = vertexShaderSource
const fcheck = document.getElementById("f")
fcheck.textContent = fragmentShaderSource

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  let x1 = x;
  let x2 = x + width;
  let y1 = y;
  let y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}

function setSillyShape(gl, x, y, size) {
  let x1 = x;
  let x2 = x + size;
  let y1 = y;
  let y2 = y + size;
  let x3 = x2/2;
  let y3 = y2/2;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

// Creates shaders
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

// Links shaders
let program = createProgram(gl, vertexShader, fragmentShader);

let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

let colorLocation = gl.getUniformLocation(program, "u_color");

let timex = gl.getUniformLocation(program, "tx");
let timey = gl.getUniformLocation(program, "ty");

let positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

let vao = gl.createVertexArray();
gl.bindVertexArray(vao);

gl.enableVertexAttribArray(positionAttributeLocation);

let size = 2;          // 2 components per iteration
let type = gl.FLOAT;   // the data is 32bit floats
let normalize = false; // don't normalize the data
let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
let offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset)



function resizeCanvasToDisplaySize(canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  const needResize = canvas.width  !== displayWidth ||
                     canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

resizeCanvasToDisplaySize(gl.canvas);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Bind the attribute/buffer set we want.
gl.bindVertexArray(vao);



// Pass in the canvas resolution so we can convert from
// pixels to clip space in the shader
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// Draw the rectangle.
let primitiveType = gl.TRIANGLES;
let count = 6;

let w = window.innerWidth;
let h = window.innerHeight;


// CAREFUL recursive function
function animationLoop(prevTime){
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let ii = 0; ii < 1000; ++ii) {
    // Put a rectangle in the position buffer

    let x = randomInt(w);
    let y = randomInt(h);

    // setRectangle(gl, x, y, 20, 20);

    setSillyShape(gl, x, y, 2);

    // Set a random color.
    gl.uniform4f(colorLocation, 1, 1, 1, 1);

    gl.uniform1f(timex, (prevTime % 17));
    gl.uniform1f(timey, (Date.now() % 13));

    gl.drawArrays(primitiveType, offset, count);
  }

  // recursion
  setTimeout(() => {
    animationLoop(Date.now());
  }, 61);
}

console.log(Date.now());
animationLoop(Date.now());



