// Important that #version 300 es is first
const vertexShaderSource = `#version 300 es

  // an attribute is an input (in) to a vertex shader.
  // It will receive data from a buffer
  in vec2 a_position;

  uniform vec2 u_resolution;

  // x,y waves phase
  uniform float tx,ty;

  vec2 SineWave( vec2 p )
    {
    // convert Vertex position <-1,+1> to texture coordinate <0,1> and some shrinking so the effect dont overlap screen
    // p.x=( 0.55*p.x)+0.5;
    // p.y=(-0.55*p.y)+0.5;
    // wave distortion
    float x = sin( 25.0*p.y + 30.0*p.x + 6.28*tx) * 0.05;
    float y = sin( 25.0*p.y + 30.0*p.x + 6.28*ty) * 0.05;
    return vec2(p.x+x, p.y+y);
    }

  void main() {
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(SineWave(clipSpace) * vec2(1, -1), 0, 1);
  }
`