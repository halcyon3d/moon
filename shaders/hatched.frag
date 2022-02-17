varying vec3 n;

uniform vec3 ldir;
uniform vec3 cdir;
uniform vec3 col_blck;
uniform vec3 col_shdw;
uniform vec3 col_nrml;
uniform vec3 col_lite;

float noise(float x) {
    return fract(sin(dot(vec2(x,0), vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float raw_diffuse = max(0.0, dot(ldir, n));
    
    float diffuse = round(raw_diffuse * 100.0) / 100.0;
    
    float rx = noise(gl_FragCoord.x);
    float ry = noise(gl_FragCoord.y);
    float random = ry + 0.3*rx - 0.2;
    
    vec3 color = col_nrml;
    
    
    if (diffuse > random) color = col_lite;
    
    if (diffuse < 0.03) color = col_blck;
    if ((diffuse > random)&&(diffuse < 0.03)) color = col_shdw;
    
    gl_FragColor = vec4(color,1.0);
}
