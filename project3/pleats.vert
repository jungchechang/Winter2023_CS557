#version 330 compatibility

out vec2 vST;
out vec3 vMC;
out vec3 Normal;
out vec3 vLight;
out vec3 vEye;

uniform float uK;
uniform float uP;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;



vec4 LIGHTPOS = vec4(uLightX,uLightY,uLightZ, 1.);

#define PI 3.14159265

void 
main()
{
	vST = gl_MultiTexCoord0.st;

	float Y0 = 1.;

	vec4 P = gl_Vertex;
	P.z = uK * (Y0 - P.y) * sin(2. * PI * P.x / uP);

	float dzdx = uK * (Y0 - P.y) * (2. *PI / uP) * cos( 2. * PI * P.x / uP );
	float dzdy = -uK * sin(2. * PI * P.x / uP);

	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );

	
	vec4 mixLight =  gl_ModelViewMatrix* LIGHTPOS;
	vec3 ECposition = (gl_ModelViewMatrix * P).xyz;
	Normal = normalize(gl_NormalMatrix * normalize(cross(Tx, Ty)));

	vLight = normalize(mixLight.xyz - ECposition);
	vEye = normalize(vec3(0.0, 0.0, 0.0) - ECposition);
	gl_Position = gl_ModelViewProjectionMatrix * P;
	vMC = gl_Position.xyz;

}
