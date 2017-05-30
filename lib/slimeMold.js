/**
 * Similar to Hyphae http://inconvergent.net/generative/hyphae/
 */
import * as THREE from 'three'
const randomColor = require( 'randomcolor' );

class SlimeMold extends THREE.Group {
  constructor() {
    super()
    this.cells = []
    let cell = new SlimeCell()
    cell.direction = Math.random() * Math.PI * 2
    this.cells.push(cell)
    this.add(cell)
  }
  grow() {
    // all cells that haven't split, splits a new cell in the cell's direction
    let newCells = []
    this.cells.forEach((c)=>{
      if (c.dormant) return
      let newCell = c.split()
      newCells.push(newCell)
      this.add(newCell)
      c.dormant = true
    })
    // if destiny allows, a random cell will split
    if (Math.random() < BRANCH_RATE) {
      const randI = Math.floor(Math.random() * this.cells.length)
      let newCell = this.cells[randI].branch()
      newCells.push(newCell)
      this.add(newCell)
    }
    // concat new cells to existing ones
    this.cells = this.cells.concat(newCells)
  }
}

const MIN_ENERGY = 0.1
const CELL_SCALE = 0.02
const SPLIT_COST = 0.1
const SPLIT_ANGLE = Math.PI * 0.2 // radian
const BRANCH_RATE = 0.1
const BRANCH_COST = 0.5
const BRANCH_ANGLE = Math.PI * 1.5 // radian

/**
 * Slime cell
 * {Boolean} dormant
 * {Number} energy
 * {Number} direction, in radian
 * @type {THREE.Mesh}
 */
class SlimeCell extends THREE.Mesh {
  constructor() {
    super(
      new THREE.SphereGeometry(1),
      new THREE.MeshBasicMaterial({ color: randomColor({ hue: 'red' }) })
    )

    this.dormant = false
    this.energy = 1
    this.scale.multiplyScalar(CELL_SCALE)
  }
  /**
   * Splits a new cell that's slightly smaller,
   * and is in the direction of current cell
   * @return {SlimeCell}
   */
  split() {
    let newCell = new SlimeCell()
    newCell.energy = this.energy * (1 - SPLIT_COST)
    if (newCell.energy < MIN_ENERGY) newCell.dormant = true
    newCell.direction = this.direction + (Math.random() - 0.5) * SPLIT_ANGLE
    newCell.scale.multiplyScalar(newCell.energy)
    // position new cell
    newCell.position.copy(this.position)
    newCell.position.add( (new THREE.Vector3(CELL_SCALE * 2 * newCell.energy, 0, Math.random() - 0.5)).applyAxisAngle(
      new THREE.Vector3(0, 0, 1),
      newCell.direction
    ) )
    return newCell
  }
  /**
   * Branches a new cell that's half the size,
   * and in another random direction of current cell
   * @return {SlimeCell}
   */
  branch() {
    let newCell = new SlimeCell()
    newCell.energy = this.energy * (1 - BRANCH_COST)
    if (newCell.energy < MIN_ENERGY) newCell.dormant = true
    newCell.direction = this.direction + (Math.random() - 0.5) * BRANCH_ANGLE
    newCell.scale.multiplyScalar(newCell.energy)
    // position new cell
    newCell.position.copy(this.position)
    newCell.position.add( (new THREE.Vector3(CELL_SCALE * 2 * newCell.energy, 0, Math.random() - 0.5)).applyAxisAngle(
      new THREE.Vector3(0, 0, 1),
      newCell.direction
    ) )
    return newCell
  }
}

export default SlimeMold
