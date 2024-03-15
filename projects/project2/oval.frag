#version 330 compatibility

uniform float uAd;
uniform float uBd;
uniform float uNoiseAmp; 
uniform float uNoiseFreq; 
uniform sampler3D Noise3; 
uniform float uAlpha;
uniform float uTol;

in vec3  vMCposition;
in float vLightIntensity;
in  vec2  vST;		
in vec3 vColor;
in float Z;

const vec3 color = vec3(0.655,0.408,0.8);

void
main()
{
	//ESTABLISH ELLIPSE VARIABLES

	float Ar = uAd / 2.;
	float Br = uBd / 2.;
	float s = vST.s;
	float t = vST.t;
	int numins = int(s / uAd);
	int numint = int(t / uBd);
	float sc = (float(numins) * uAd) + Ar;
	float tc = (float(numint) * uBd) + Br;
	float ds = s - sc;
    	float dt = t - tc;
	float  oldDist = sqrt((ds*ds) + (dt*dt));

	//ESTABLISH NOISE VARIABLES

	vec4 nv = texture3D(Noise3, uNoiseFreq*vMCposition);
	float n = (nv.r + nv.g + nv.b + nv.a) - 2.;
	n *= uNoiseAmp;

	float newDist = n + oldDist;
	float scale = newDist / oldDist;

	ds *= scale;
	ds /= Ar;

	dt *= scale;
	dt /= Br;

	float d = smoothstep( 1. - uTol, 1. + uTol, (ds * ds) + (dt * dt) );

	gl_FragColor = mix(vec4(vLightIntensity * color, 1.), vec4(vLightIntensity * vColor, uAlpha), d);
	if(gl_FragColor.a == 0)
		discard;
}