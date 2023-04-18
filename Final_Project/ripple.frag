#version 330 compatibility

in vec3  vMCposition;
in vec3  vECposition;
in vec3  vNs;

in vec3  vLight;
in vec3  vEyeP;

vec4 lighting() {
    vec4 ambient, diffuse, spec;

    float ka = 0.1;
    float kd = 0.6;
    float ks = 0.3;
    float shininess = 10.0;

    vec4 objectColor = vec4(0.18, 0.74, 0.98, 1.0);

    vec3 N = normalize(vNs);
    vec3 L = normalize(vLight);
    vec3 V = normalize(vEyeP); 
    vec3 R = reflect(-L, N); 

    ambient = ka * objectColor; 

    float diffuseIntensity = max(dot(N, L), 0.0); 
    diffuse = kd * diffuseIntensity * objectColor; 

    float specularIntensity = pow(max(dot(V, R), 0.0), shininess);
    spec = ks * specularIntensity * vec4(1.0, 1.0, 1.0, 1.0);

    return vec4(ambient.rgb + diffuse.rgb + spec.rgb, 1.0);
}

void
main( ) 
{
	gl_FragColor = lighting();
}