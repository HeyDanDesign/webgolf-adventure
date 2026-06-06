import {
  TextureLoader,
  RepeatWrapping,
  MeshDepthMaterial,
  RGBADepthPacking,
  NoBlending,
  Vector2,
  Color,
  PlaneGeometry,
  ShaderMaterial,
  Mesh
} from 'three'
import { useScene } from '@base/scene'
import { useCamera } from '@base/camera'
import { useRenderTarget } from '@base/renderer'
import { useAllTextures } from '@base/loaders'

let scene = null
let camera = null
let renderTarget = null
let pixelRatio = null
let depthMaterial = null
let mat = null
let mesh = null

export const createWaterFoam = () => {
  scene = useScene()
  camera = useCamera()
  renderTarget = useRenderTarget()
  pixelRatio = Math.min(window.devicePixelRatio, 2)
  // pixelRatio = 0.5

  depthMaterial = new MeshDepthMaterial({
    depthPacking: RGBADepthPacking,
    blending: NoBlending
  })

  // Water setup
  const dudvMap = new TextureLoader().load('/textures/foam.png')
  dudvMap.wrapS = dudvMap.wrapT = RepeatWrapping

  const uniforms = {
    time: { value: 0 },
    threshold: { value: 0.1 },
    tDudv: { value: dudvMap },
    tDepth: { value: renderTarget.depthTexture },
    cameraNear: { value: camera.near },
    cameraFar: { value: camera.far },
    resolution: { value: new Vector2(innerWidth * pixelRatio, innerHeight * pixelRatio) },
    foamColor: { value: new Color(0xffffff) },
    waterColor: { value: new Color(0x000000) }
  }

  const geo = new PlaneGeometry(50, 50)
  mat = new ShaderMaterial({
    defines: {
      DEPTH_PACKING: 0,
      ORTHOGRAPHIC_CAMERA: 1
    },
    uniforms,
    vertexShader: ` 
      varying vec2 vUv;
      void main() {
        vUv = uv;
        #include <begin_vertex>
        #include <project_vertex>
      }
    `,
    fragmentShader: `
      #include <common>
      #include <packing>
      
      varying vec2 vUv;
      uniform sampler2D tDepth;
      uniform sampler2D tDudv;
      uniform vec3 waterColor;
      uniform vec3 foamColor;
      uniform float cameraNear;
      uniform float cameraFar;
      uniform float time;
      uniform float threshold;
      uniform vec2 resolution;
      
      float getDepth(const in vec2 screenPosition) {
        #if DEPTH_PACKING == 1
          return unpackRGBAToDepth(texture2D(tDepth, screenPosition));
        #else
          return texture2D(tDepth, screenPosition).x;
        #endif
      }
      
      float getViewZ(const in float depth) {
          #if ORTHOGRAPHIC_CAMERA == 1
              return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
          #else
              return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
          #endif
      }
      
      float linearDepth(const in vec2 uv) {
        float z = texture2D(tDepth, uv).x;
        return (2.0 * cameraNear) / (cameraFar + cameraNear - z * (cameraFar - cameraNear));
      }

      void main() {
          vec2 screenUV = gl_FragCoord.xy / resolution.xy;
      
          float fragmentLinearEyeDepth = getViewZ(gl_FragCoord.z);
          float linearEyeDepth = getViewZ(getDepth(screenUV));
      
          float diff = saturate(fragmentLinearEyeDepth - linearEyeDepth);
      
          vec2 displacement = texture2D(tDudv, vUv * 2.0 + vec2(time * 0.05, -time * 0.005)).rg;
          displacement = ((displacement * 2.0) - 1.1); // Adjust the effect strength as needed
          diff += displacement.x;
      
          float alpha = step(threshold, diff);
          vec3 color = mix(foamColor, waterColor, alpha);
          gl_FragColor = vec4(color, 1.0 - alpha); // Set alpha to 1.0 where there's no water
      
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
      }    
    `,
    transparent: true
  })

  mesh = new Mesh(geo, mat)
  mesh.position.y = 0.31
  mesh.rotation.x = -Math.PI / 2
  scene.add(mesh)
}

export const resizeWaterFoam = (width, height) =>
  (mat.uniforms.resolution.value = new Vector2(width * pixelRatio, height * pixelRatio))
export const updateWaterFoam = (time) => (mat.uniforms.time.value = time)
export const useWaterFoam = () => mesh
export const useDepthMaterial = () => depthMaterial
