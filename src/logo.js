import React, { Component } from "react";
import * as THREE from "three";

class Logo extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);

    this.handleWindowResize = this.handleWindowResize.bind(this);
  }
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    window.addEventListener("resize", this.handleWindowResize);

    // scene
    this.scene = new THREE.Scene();

    //camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      50
    );
    this.camera.position.z = 30;
    // this.camera = new THREE.PerspectiveCamera(
    //     75,
    //     width / height,
    //     0.1,
    //     1000
    // );
    // this.camera.position.set(0, 5, 400);

    // setup rendering

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
    this.mount.appendChild(this.renderer.domElement);

    // setup geo

    var particleMat = new THREE.PointsMaterial({
      color: 0xaecdd0,
      size: 0.1,
      map: new THREE.TextureLoader().load("/particle.jpg"),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    var particleGeo = new THREE.SphereGeometry(15, 300, 300);

    particleGeo.vertices.forEach(function(vertex) {
      vertex.x += Math.random() - 0.2;
      vertex.y += Math.random() - 0.2;
      vertex.z += Math.random() - 0.2;
    });

    var particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystem.name = "particleSystem";

    this.scene.add(particleSystem);

    var lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);

    this.renderer.render(this.scene, this.camera);

    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    this.mount.removeChild(this.renderer.domElement);
  }

  handleWindowResize() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);

    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(this.animate);
    var particleSystem = this.scene.getObjectByName("particleSystem");
    particleSystem.rotation.y += 0.0005;
    this.renderer.render(this.scene, this.camera);
  }
  render() {
    return (
      <div>
        <div
          id="logo-boardCanvas"
          style={{ width: "150px", height: "150px" }}
          ref={mount => {
            this.mount = mount;
          }}
        />
      </div>
    );
  }
}
export default Logo;
