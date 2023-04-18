#version 330 compatibility

float ResS;
float ResT;

in vec2 vST;

uniform bool uCircle;

uniform float uSc;
uniform float uTc;
uniform float uDs;
uniform float uDt;
uniform float uRad;
uniform float uRotAngle;
uniform float uMagFactor;
uniform float uSharpFactor;
uniform sampler2D uImageUnit;


void
sharpening(ivec2 ires, vec3 irgb, float ResS, float ResT, vec2 uST){
	vec2 stp0 = vec2(1./ResS, 0. );
	vec2 st0p = vec2(0. , 1./ResT);
	vec2 stpp = vec2(1./ResS, 1./ResT);
	vec2 stpm = vec2(1./ResS, -1./ResT);
	vec3 i00 = texture2D( uImageUnit, uST ).rgb;
	vec3 im1m1 = texture2D( uImageUnit, uST-stpp ).rgb;
	vec3 ip1p1 = texture2D( uImageUnit, uST+stpp ).rgb;
	vec3 im1p1 = texture2D( uImageUnit, uST-stpm ).rgb;
	vec3 ip1m1 = texture2D( uImageUnit, uST+stpm ).rgb;
	vec3 im10 = texture2D( uImageUnit, uST-stp0 ).rgb;
	vec3 ip10 = texture2D( uImageUnit, uST+stp0 ).rgb;
	vec3 i0m1 = texture2D( uImageUnit, uST-st0p ).rgb;
	vec3 i0p1 = texture2D( uImageUnit, uST+st0p ).rgb;
	vec3 target = vec3(0.,0.,0.);
	target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
	target += 2.*(im10+ip10+i0m1+i0p1);
	target += 4.*(i00);
	target /= 16.;
	gl_FragColor = vec4( mix( target, irgb, uSharpFactor ), 1. );
}

void main()
{
	float s = vST.s;
	float t = vST.t;
	float top	 = uSc + uDs;
	float bottom = uSc - uDs;
	float left   = uTc - uDt;
	float right  = uTc + uDt;

	ivec2 ires = textureSize( uImageUnit, 0 );
	float ResS = float( ires.s );
	float ResT = float( ires.t );

	vec3 rgb = texture2D( uImageUnit, vST ).rgb;

	if(uCircle)
	{
		if((s - uSc) * (s - uSc) + (t - uTc) * (t - uTc) < pow(uRad,2))
		{
			s = (s - uSc) * 1.0 / uMagFactor;
			t = (t - uTc) * 1.0 / uMagFactor;

			float S = s*cos(uRotAngle) - t*sin(uRotAngle) + uSc;
			float T = s*sin(uRotAngle) + t*cos(uRotAngle) + uTc;

			vec2 m = vec2(S,T);
			vec3 n = texture2D(uImageUnit, m).rgb;
			sharpening(ires, n, ResS, ResT, m);

		}else{
			gl_FragColor = vec4( rgb, 1. );
		}
	}else{
		float top	 = uSc + uDs;
		float bottom = uSc - uDs;
		float left   = uTc - uDt;
		float right  = uTc + uDt;
		
		if( s < top && s > bottom && t > left && t < right )
		{
			s = (s - uSc) * 1.0 / uMagFactor;
			t = (t - uTc) * 1.0 / uMagFactor;

			float S = s*cos(uRotAngle) - t*sin(uRotAngle) + uSc;
			float T = s*sin(uRotAngle) + t*cos(uRotAngle) + uTc;

			vec2 m = vec2(S,T);
			vec3 n = texture2D(uImageUnit, m).rgb;

			sharpening(ires, n, ResS, ResT, m);
		}else{

			gl_FragColor = vec4( rgb, 1. );
		}
    }
}