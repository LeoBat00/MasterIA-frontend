// Paladino3D.tsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

export default function Paladino3D() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(0, 0.75, 2)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.7))
    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(3, 5, 4)
    scene.add(dir)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = false
    controls.enablePan = false
    controls.minPolarAngle = Math.PI / 2
    controls.maxPolarAngle = Math.PI / 2

    const pivot = new THREE.Object3D()
    scene.add(pivot)

    const loader = new STLLoader()
    let mesh: THREE.Mesh | null = null
    loader.load(
      '/Paladin3D.stl',
      (geometry: THREE.BufferGeometry) => {
        geometry.rotateX(-Math.PI / 2)

        geometry.computeBoundingBox()
        const bb = geometry.boundingBox!
        const cx = (bb.min.x + bb.max.x) / 2
        const cz = (bb.min.z + bb.max.z) / 2
        const minY = bb.min.y
        geometry.translate(-cx, -minY, -cz)

        geometry.computeVertexNormals()
        const material = new THREE.MeshNormalMaterial()
        mesh = new THREE.Mesh(geometry, material)
        pivot.add(mesh)
        mesh.scale.set(1.5, 1.5, 1.5)
        fitCameraToObject(camera, mesh, controls,)
        animate()
      },
      (xhr: ProgressEvent<EventTarget>) => {
        if (xhr.lengthComputable) {
          console.log(`STL loading: ${(xhr.loaded / xhr.total * 100).toFixed(1)}%`)
        }
      },
      (err: ErrorEvent) => {
        console.error("Erro carregando /Paladin3D.stl", err);
      }
    )

    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      pivot.rotation.y += 0.01
      controls.update()
      renderer.render(scene, camera)
    }


    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="w-full min-h-[380px] md:min-h-[480px] lg:min-h-[590px]" />
}

function fitCameraToObject(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controls?: any,
  offset = 1.25
) {
  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())

  const maxDim = Math.max(size.x, size.y, size.z)
  const fov = camera.fov * (Math.PI / 180)
  const distance = (maxDim / (2 * Math.tan(fov / 2))) * offset

  camera.position.set(0, size.y * 0.35, distance)
  camera.near = Math.max(distance / 100, 0.01)
  camera.far = distance * 100
  camera.updateProjectionMatrix()

  if (controls) {
    controls.target.set(0, size.y * 0.5, 0)
    controls.update()
  }
}
