import * as THREE from 'three'
import { BufferAttribute, Float32BufferAttribute } from 'three'
import { LorenzAttractor } from './lorenz-attractor'
import './style.css'

class App {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer

  private line: THREE.Line

  private lorenzAttractor: LorenzAttractor

  private numCurrentPoints: number

  constructor(private max_points: number, private speed: number) {
    const container = document.getElementById('container')

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500)
    this.renderer = new THREE.WebGLRenderer()

    container?.appendChild(this.renderer.domElement)
    // document.body.appendChild(this.renderer.domElement)

    this.setupCamera()
    this.setupRenderer()

    this.lorenzAttractor = new LorenzAttractor()
    this.numCurrentPoints = 0

    // 3 floats to each point: x, y, z
    const positions = new Float32Array(this.max_points * 3)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

    // https://www.wayneparrott.com/how-to-create-three-js-gradient-colored-lines-and-circlelines-part-2/
    // const colors = this.setupColors()
    // geometry.setAttribute('color', new BufferAttribute(colors, 3))

    // const material = new THREE.LineBasicMaterial({
    //   vertexColors: true
    // })

    const material = new THREE.LineBasicMaterial({
      color: "#0000ff"
    })

    this.line = new THREE.Line(geometry, material)

    this.scene.add(this.line)
  }

  setupColors(): Float32Array {
    const colorArr = Array(this.max_points).fill(0).flatMap((_, index) => {
      const hue = 360.0 * index / this.max_points
      const color = new THREE.Color().setHSL(hue, 1, 0.5)

      return [color.r, color.b, color.g]
    })

    return new Float32Array(colorArr)
  }

  setupCamera() {
    this.camera.position.set(0, 0, 80)
    this.camera.lookAt(0, 0, 0)
  }

  setupRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputEncoding = THREE.sRGBEncoding
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  addNextPointToGeometry(): boolean {
    let addedAtLeastOnePoint = false

    for (let i = 0; i < this.speed; i++) {
      if (this.numCurrentPoints < this.max_points) {
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

  set setSpeed(speed: number) {
    this.speed = speed
  }
}

const lorenzAttractorApp = new App(100_000, 10)

window.addEventListener('resize', () => lorenzAttractorApp.onWindowResize())

function animate() {
  requestAnimationFrame(animate)

  lorenzAttractorApp.animate()
}

animate()