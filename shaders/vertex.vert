varying vec3 n;

void main() {
  n = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); 
}
