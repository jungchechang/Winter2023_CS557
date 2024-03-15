#version 330 compatibility

out vec2 vST;
vec3 LIGHTPOS   = vec3( -2., 0., 10. );

void
main()
{
	vST = gl_MultiTexCoord0.st;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}