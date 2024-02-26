import { Size } from "@react-three/fiber";
import * as THREE from "three";

export class MirrorTexture extends THREE.WebGLRenderTarget {
  camera: THREE.Camera;

  constructor(camera: THREE.Camera, size: Size) {
    super(size.width, size.height, {
      depthBuffer: true,
      depthTexture: new THREE.DepthTexture(size.width, size.height),
      encoding: THREE.sRGBEncoding,
    });
    this.camera = camera.clone();
  }

  _color = new THREE.Color();
  _colorWhite = new THREE.Color(0xffffff);
  render(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    this.camera.position.copy(camera.position);
    this.camera.position.reflect(new THREE.Vector3(0, 1, 0));

    this.camera.rotation.copy(camera.rotation);
    this.camera.rotation.x *= -1;
    this.camera.rotation.z *= -1;

    // renderer.getClearColor(this._color);
    // renderer.setClearColor(this._colorWhite);
    renderer.setRenderTarget(this);
    renderer.render(scene, this.camera);
    renderer.setRenderTarget(null);
    // renderer.setClearColor(this._color);
  }
}
