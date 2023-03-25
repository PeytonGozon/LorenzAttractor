import * as THREE from 'three'
import { LorenzAttractor } from './lorenz-attractor'
import './style.css'

class App {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.Renderer
  material: THREE.LineBasicMaterial

  lorenzAttractor: LorenzAttractor

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
    this.renderer = new THREE.WebGLRenderer()

    this.setupCamera()
    this.setupRenderer()

    this.material = new THREE.LineBasicMaterial({ color: 0x0000ff })

    this.lorenzAttractor = new LorenzAttractor()
  }

  setupCamera() {
    this.camera.position.set(0, 0, 60)
    this.camera.lookAt(0, 0, 0)
  }

  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    window.addEventListener('resize', this.onWindowResize)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate() {
    requestAnimationFrame(() => this.animate())

    this.lorenzAttractor.update()

    const center = this.getCenterOfMass()
    this.camera.lookAt(center)

    const geometry = new THREE.BufferGeometry().setFromPoints(this.lorenzAttractor.points)

    const line = new THREE.Line(geometry, this.material)

    this.scene.add(line)

    this.renderer.render(this.scene, this.camera)

    geometry.dispose()
  }

  getCenterOfMass(): THREE.Vector3 {
    const sumOfPoints = this.lorenzAttractor.points.reduce(
      (acc, current) => acc.add(current),
      new THREE.Vector3(0, 0, 0)
    )

    const center = sumOfPoints.divideScalar(this.lorenzAttractor.points.length)

    return center
  }
}

const lorenzAttractorApp = new App()
lorenzAttractorApp.animate()
