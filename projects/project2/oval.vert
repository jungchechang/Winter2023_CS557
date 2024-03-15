#version 330 compatibility

out vec3  vMCposition;
out float vLightIntensity;
out  vec2  vST;		
out vec3 vColor;
out float Z;


const vec3 LIGHTPOS   = vec3( -2., 0., 10. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;

	vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	vColor = gl_Color.rgb;
	Z = ECposition.z;
	vMCposition  = gl_Vertex.xyz;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}