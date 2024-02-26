//this is just intended as a notepad of sorts for examples not turned into reusable functions

const highlight = function(mesh){
    //flash the mesh red
    const oldMaterial = mesh.material;
    const newMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true, wireframeLinewidth: 2, emissive: 0xff0000, emissiveIntensity: 5 });
    for (let i = 0; i < 4; i++) {
      setTimeout(() => { mesh.material = newMaterial; },i * 100);
      setTimeout(() => { mesh.material = oldMaterial; },i * 150);
      setTimeout(() => { mesh.material = newMaterial; },i * 200);
    }
  }

  const toggleWingRotation = function(mesh,arrRotate){
    //toggle rotation in a mesh
    //get the existing rotation
    const rotation = mesh.rotation;
    if(rotation.x !== arrRotate[0] && rotation.y !== arrRotate[1] && rotation.z !== arrRotate[2]) {
      mesh.rotation.x = 0;
      mesh.rotation.y = 0;
      mesh.rotation.z = 0;
    }else{
      mesh.rotation.x = arrRotate[0];
      mesh.rotation.y = arrRotate[1];
      mesh.rotation.z = arrRotate[2];
    }
  }