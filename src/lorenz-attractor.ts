import { Vector3 } from "three"

export class LorenzAttractor {
  // All the points computed as part of the Lorenz Attractor
  points: Vector3[]

  // Lorenz-Attractor Hyperparameters
  sigma: number
  rho: number
  beta: number

  // How much time passes between each 'update'
  dt: number

  constructor() {
    const [x, y, z] = [10, 0.5, 20]

    const startingPoint = new Vector3(x, y, z)

    this.points = [startingPoint]

    // Initialize the Lorenz Attractor
    this.sigma = 10
    this.beta = 8 / 3
    this.rho = 28

    this.dt = 0.001
  }

  nextPoint(): Vector3 {
    // Get the current point and unpack its position
    const currentPoint = this.points[this.points.length - 1]
    const [x, y, z] = [currentPoint.x, currentPoint.y, currentPoint.z]

    // Calculate how much to move the point by
    const dx = (this.sigma * (y - x)) * this.dt
    const dy = (x * (this.rho - z) - y) * this.dt
    const dz = (x * y - this.beta * z) * this.dt

    // Create the next point
    const nextPoint = new Vector3(x + dx, y + dy, z + dz)

    return nextPoint
  }

  update(): void {
    // Get the next point
    const nextPoint = this.nextPoint()

    // Add the next point to the array of points
    this.points = [...this.points, nextPoint]
  }
}