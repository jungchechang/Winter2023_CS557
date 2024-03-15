#version 330 compatibility

#define M_PI 3.14159

out vec3  vMCposition;
out vec3  vECposition;
out vec3  vNs;
out vec3  vLight;
out vec3  vEyeP;

uniform float uX1, uY1, uAmp1, uFreq1;
uniform float uX2, uY2, uAmp2, uFreq2;
uniform float Timer;
float Time = Timer > 0.5 ? 1. - Timer : Timer;

float calculateZ(float offsetX, float offsetY, float amp, float freq, float state)
{
    vec2 position = gl_Vertex.xy + vec2(offsetX, offsetY);
    float r = length(position);
    float angle = 2.0 * M_PI * freq * r + state;
    float cosAngle = cos(angle);
    float sinAngle = sin(angle);
    float Value = amp * cosAngle;
    Value += 0.1 * amp * sin(10.0 * angle);
    return Value;
}

float calculateDerivative(float offsetX, float offsetY, float amp, float freq, float state) 
{
    vec2 position = gl_Vertex.xy + vec2(offsetX, offsetY);
    float r = length(position);
    float cosArg = 2.0 * M_PI * freq * r + state;
    float sinCosArg = sin(cosArg);
    float cosCosArg = cos(cosArg);
    float expFactor = exp(sqrt(position.x * position.x + position.y * position.y));
    float dx = -amp * sinCosArg * position.x / r * expFactor;
    float dy = -amp * sinCosArg * position.y / r * expFactor;
    return dx + dy;
}

vec3 getSurfaceNormal(float derivative) 
{
    vec3 Tx = vec3(1.0, 0.0, derivative);
    vec3 Ty = vec3(0.0, 1.0, derivative);

    return normalize(cross(Tx, Ty));
}

void lighting(vec4 vertex)
{
    vec3 vEyePosition = vec3(gl_ModelViewMatrix * vertex);
    vec3 vLightPosition = vec3(5.0, 10.0, 20.0);

    // Vector from eye to light
    vLight = normalize(vLightPosition - vEyePosition);

    vEyeP = normalize(vec3(0.0, 0.0, 0.0) - vEyePosition);
}

void main()
{
    float x = gl_Vertex.x;
    float y = gl_Vertex.y;
    float z = (calculateZ(uX1, uY1, uAmp1, uFreq1, -Timer * 25.0) + calculateZ(uX2, uY2, uAmp2, uFreq2, -Timer * 25.0));
    float derivative = (calculateDerivative(uX1, uY1, uAmp1, uFreq1, -Timer * 25.0) + calculateDerivative(uX2, uY2, uAmp2, uFreq2, -Timer * 25.0));
    float w = gl_Vertex.w;

    vec4 vertex = vec4(x, y, z, w);
    lighting(vertex);

    vMCposition = vertex.xyz;
    vECposition = (gl_ModelViewMatrix * vertex).xyz;

    vNs = normalize(gl_NormalMatrix * getSurfaceNormal(derivative));
    gl_Position = gl_ModelViewProjectionMatrix * vertex;
}
