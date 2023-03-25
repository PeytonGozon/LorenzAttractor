import * as THREE from 'three'
import { LorenzAttractor } from './lorenz-attractor'
import './style.css'

class App {
  static MAX_POINTS = 10_000

  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.Renderer

  private lorenzAttractor: LorenzAttractor

  private line: THREE.Line
  private geometry: THREE.BufferGeometry


  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
    this.renderer = new THREE.WebGLRenderer()

    this.setupCamera()
    this.setupRenderer()

    this.lorenzAttractor = new LorenzAttractor()

    for (let i = 0; i < App.MAX_POINTS; i++) {
      this.lorenzAttractor.update()
    }

    this.geometry = new THREE.BufferGeometry().setFromPoints(this.lorenzAttractor.points)
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff })

    this.line = new THREE.Line(this.geometry, material)

    this.scene.add(this.line)
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
    this.renderer.render(this.scene, this.camera)
  }
}

const lorenzAttractorApp = new App()
lorenzAttractorApp.animate()
