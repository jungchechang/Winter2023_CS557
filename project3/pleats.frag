#version 330 compatibility

in vec3 vMC;
in vec2 vST;
in vec3 vEye;
in vec3 Normal;
in vec3 vLight;

uniform float uK;
uniform float uP;
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

uniform vec4 uColor;
uniform sampler3D Noise3;
uniform vec4 uSpecularColor;



vec3
RotateNormal( float angx, float angy, vec3 n )
{
	float cx = cos( angx );
	float sx = sin( angx );
	float cy = cos( angy );
	float sy = sin( angy );

	// rotate about x:
	float yp =  n.y * cx - n.z * sx;    // y'
	n.z      =  n.y * sx + n.z*cx;    // z'
	n.y      =  yp;
	// n.x      =  n.x;

	// rotate about y:
	float xp =  n.x * cy + n.z * sy;    // x'
	n.z      = -n.x * sy + n.z * cy;    // z'
	n.x      =  xp;
	// n.y      =  n.y;

	return normalize( n );
}

void
main()
{
	vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;

	vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

	vec3 n = normalize(RotateNormal(angx,angy,Normal));


	vec3 ambient = uKa * uColor.rgb;
	float d = max(dot(n,vLight), 0.);
	vec3 diffuse = uKd * d * uColor.rgb;

	vec3 specular = uKs * 0.0 * uSpecularColor.rgb;
	if(dot(n,vLight) > 0.){
        		vec3 ref = normalize(2. * n * dot(n, vLight) - vLight);
		float t = pow( max( dot(vEye, ref), 0. ), uShininess );
		specular = uKs * t * uSpecularColor.rgb;
    	}

    	gl_FragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1.);
}