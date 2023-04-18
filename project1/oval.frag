#version 330 compatibility

uniform float uAd;
uniform float uBd;
uniform float uTol;

in vec3  vMCposition;
in float vLightIntensity;
in  vec2  vST;		
in vec3 vColor;

const vec3 color = vec3(0.655,0.408,0.8);

void
main()
{
	float Ar = uAd / 2.;
	float Br = uBd / 2.;
	float s = vST.s;
	float t = vST.t;
	int numins = int(s / uAd);
	int numint = int(t / uBd);
	float sc = numins * uAd + Ar;
	float tc = numint * uBd + Br;

	float ellipse = (((s-sc) * (s-sc)) / (Ar * Ar)) + (((t-tc) * (t-tc)) / (Br * Br));
	float d = smoothstep( 1. - uTol, 1. + uTol, ellipse);

	vec3 rgb = vLightIntensity * mix( color, vColor, d);
	gl_FragColor = vec4( rgb, 1. );





}