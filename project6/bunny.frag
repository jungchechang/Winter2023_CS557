#version 330 compatibility


uniform float uAd;   
uniform float uBd;  
uniform float uNoiseAmp;       
uniform float uNoiseFreq;       
uniform sampler3D Noise3;       
uniform float uAlpha;   
uniform float uTol;          
uniform bool uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;

in vec3 vMCposition;
in float vLightIntensity;
in vec2 vST;
in vec4 vColor;
in float Z;

const vec3 WHITE = vec3( 1,1,1 );

vec3 ChromaDepth(float);



vec3
ChromaDepth( float t )
{
        t = clamp( t, 0., 1. );

        float r = 1.;
        float g = 0.0;
        float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

	return vec3( r, g, b );
}


void
main( )
{
	vec3 color = vColor.rgb;
	if(uUseChromaDepth)
    	{
        	float t = (2./3.) * ( Z - uChromaRed ) / ( uChromaBlue - uChromaRed );
		t = clamp( t, 0., 2./3. );
		color = ChromaDepth(t);
    	 }

	vec4 nv = texture3D(Noise3, uNoiseFreq*vMCposition);
   	float Ar = uAd/2;
   	float Br = uBd/2;
   	float s = vST.s;
	float t = vST.t;
	float ds = 2 * s;
	float dt = t;
	float n = (nv.r + nv.g + nv.b + nv.a) - 2;	
	float delta = uNoiseAmp * n;
	ds += delta;
	dt += delta;
	int numins = int( ds / uAd);
	int numint = int( dt / uBd);

	float sc = numins* 2 * Ar+ Ar ;
	float tc = numint* 2 * Br + Br;
	ds = (ds - sc)/Ar;
	dt = (dt - tc)/Br;
    	float d = ds*ds + dt*dt;   
    	float d1 = smoothstep( 1. - uTol, 1. + uTol, d);

 
    	//When uAlpha == 0., do a discard;
    	gl_FragColor = mix(vec4(vLightIntensity * color, 1.), vec4(vLightIntensity * WHITE, uAlpha), d1);
    	if(gl_FragColor.a == 0)
	{
        	discard;
   	}
}

