import * as THREE from 'three'
import { Float32BufferAttribute } from 'three'
import { LorenzAttractor } from './lorenz-attractor'
import './style.css'

class App {
  static MAX_POINTS = 100_000

  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer

  private line: THREE.Line

  private lorenzAttractor: LorenzAttractor

  private numCurrentPoints: number

  constructor(private speed: number) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500)
    this.renderer = new THREE.WebGLRenderer()

    this.setupCamera()
    this.setupRenderer()

    this.lorenzAttractor = new LorenzAttractor()
    this.numCurrentPoints = 0

    // 3 floats to each point: x, y, z
    const positions = new Float32Array(App.MAX_POINTS * 3)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff })

    this.line = new THREE.Line(geometry, material)

    this.scene.add(this.line)
  }

  setupCamera() {
    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(0, 0, 0)
  }

  setupRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputEncoding = THREE.sRGBEncoding

    document.body.appendChild(this.renderer.domElement)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  addNextPointToGeometry(): boolean {
    let addedAtLeastOnePoint = false

    for (let i = 0; i < this.speed; i++) {
      if (this.numCurrentPoints < App.MAX_POINTS) {
        const point = this.lorenzAttractor.nextPoint()

        const positions = this.line.geometry.attributes.position as Float32BufferAttribute
        positions.setXYZ(this.numCurrentPoints, point.x, point.y, point.z)

        this.numCurrentPoints++

        addedAtLeastOnePoint = true
      }
    }

    return addedAtLeastOnePoint
  }

  animate() {
    // Add point to geometry
    if (this.addNextPointToGeometry()) {
      this.line.geometry.attributes.position.needsUpdate = true
      this.line.geometry.setDrawRange(0, this.numCurrentPoints - 1)
    }

    this.renderer.render(this.scene, this.camera)
  }
}

const lorenzAttractorApp = new App(1)
console.log(lorenzAttractorApp)

window.addEventListener('resize', lorenzAttractorApp.onWindowResize)

function animate() {
  requestAnimationFrame(animate)

  lorenzAttractorApp.animate()
}

animate()