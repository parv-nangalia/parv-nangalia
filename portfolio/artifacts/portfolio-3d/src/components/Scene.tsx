import { Suspense, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  Float,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  targetRotation: number;
  zoomedIn: boolean;
}

/**
 * Smoothly lerps the camera between a wide default framing and a
 * ~50%-closer framing focused on the island when `zoomedIn` is true.
 */
function CameraRig({ zoomedIn }: { zoomedIn: boolean }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const tmp = useRef(new THREE.Vector3());

  // Default wide framing
  const defaultPos = useMemo(() => new THREE.Vector3(0, 2.5, 11), []);
  const defaultLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  // 50% closer to the island (model sits at x = -2.2)
  const zoomedPos = useMemo(() => new THREE.Vector3(-1.2, 1.8, 5.5), []);
  const zoomedLook = useMemo(() => new THREE.Vector3(-2.2, 0, 0), []);

  useFrame((_state, delta) => {
    const t = 1 - Math.pow(0.001, delta); // framerate-independent damping
    const targetPos = zoomedIn ? zoomedPos : defaultPos;
    const targetLook = zoomedIn ? zoomedLook : defaultLook;

    camera.position.lerp(targetPos, t);
    lookTarget.current.lerp(targetLook, t);
    tmp.current.copy(lookTarget.current);
    camera.lookAt(tmp.current);
  });

  return null;
}

function Island({ targetRotation }: { targetRotation: number }) {
  const modelUrl = `${import.meta.env.BASE_URL}models/alpine-island.glb`;
  const { scene } = useGLTF(modelUrl);
  const group = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetRotation,
        4,
        delta,
      );
    }
  });

  return (
    <group position={[-2.2, 0, 0]}>
      <group ref={group}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
          <primitive object={scene} scale={4.2} position={[0, -1.6, 0]} />
        </Float>
      </group>
    </group>
  );
}

useGLTF.preload(`${import.meta.env.BASE_URL}models/alpine-island.glb`);

/**
 * Roblox-style stylized sky.
 * Horizontal gradient from violet/purple on the left, through pink and
 * orange, to a warm yellow on the right. Soft, slow-drifting puffy clouds
 * sit on top of the gradient. Renders as a stable backdrop — no depth
 * interactions, no fog, no tone mapping, no flicker.
 */
function Sky() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#2e8eff") }, // vibrant sunny sky blue (top-left)
      uColorB: { value: new THREE.Color("#9ed1ff") }, // light sky blue (upper mid)
      uColorC: { value: new THREE.Color("#ff8a3c") }, // vibrant sunset orange
      uColorD: { value: new THREE.Color("#ffc848") }, // golden yellow (bottom-right)
      uCloudColor: { value: new THREE.Color("#ffffff") },
      uCloudShadow: { value: new THREE.Color("#e8b888") },
    }),
    [],
  );

  useFrame((_state, delta) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime.value as number) += delta * 0.04;
    }
  });

  const vertexShader = /* glsl */ `
    varying vec3 vWorldPos;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `;

  const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec3 vWorldPos;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform vec3 uColorD;
    uniform vec3 uCloudColor;
    uniform vec3 uCloudShadow;

    // smooth value noise + fbm for soft puffy clouds
    float hash(vec2 p) {
      p = fract(p * vec2(127.1, 311.7));
      p += dot(p, p + 34.0);
      return fract(p.x * p.y);
    }
    float vnoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * vnoise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    // 4-stop gradient along the diagonal axis (t in [0, 1]).
    // Blue holds the upper portion, then we ease into a vibrant orange
    // and finally a warm golden yellow toward the bottom-right.
    vec3 skyGradient(float t) {
      vec3 ab = mix(uColorA, uColorB, smoothstep(0.0, 0.35, t));
      vec3 bc = mix(ab, uColorC, smoothstep(0.45, 0.75, t));
      vec3 cd = mix(bc, uColorD, smoothstep(0.75, 1.0, t));
      return cd;
    }

    void main() {
      vec3 dir = normalize(vWorldPos);

      // Yaw across the front hemisphere -> horizontal screen position [0,1]
      float yaw = atan(dir.x, -dir.z); // [-pi, pi], zero straight ahead
      float xN  = clamp(yaw / 3.14159265 * 0.5 + 0.5, 0.0, 1.0); // 0 left, 1 right
      // Vertical screen position [0,1]
      float yN  = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);            // 0 bottom, 1 top

      // Diagonal gradient axis: top-LEFT (vibrant sky blue) ->
      // bottom-RIGHT (vibrant orange / golden yellow sunset).
      // Both axes contribute, with the vertical slightly stronger so
      // the sky stays predominantly blue on top.
      float t = clamp((1.0 - yN) * 0.55 + xN * 0.45, 0.0, 1.0);

      vec3 sky = skyGradient(t);

      // Spherical UV for the cloud field
      vec2 uv = vec2(yaw / 6.2831853, dir.y * 0.5 + 0.5);

      // Two layers of slow-drifting puffy clouds
      float n1 = fbm(uv * vec2(4.0, 7.0) + vec2(uTime * 0.9, uTime * 0.15));
      float n2 = fbm(uv * vec2(8.0, 12.0) - vec2(uTime * 0.5, uTime * 0.08));
      float cloudField = n1 * 0.65 + n2 * 0.45;

      // Stylized "puffy" threshold for that Roblox-y look
      float clouds = smoothstep(0.55, 0.78, cloudField);

      // Fade clouds out below the horizon and at the very zenith
      float bandMask = smoothstep(0.05, 0.45, yN) * (1.0 - smoothstep(0.92, 1.0, yN));
      clouds *= bandMask;

      // Cloud color: bright cream highlights with a soft warm shadow
      vec3 cloudCol = mix(uCloudShadow, uCloudColor, smoothstep(0.45, 1.0, n1));

      vec3 col = mix(sky, cloudCol, clouds * 0.9);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return (
    <mesh scale={[-1, 1, 1]} renderOrder={-1000} frustumCulled={false}>
      <sphereGeometry args={[450, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function Scene({ targetRotation, zoomedIn }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#2e8eff"]} />
      <fog attach="fog" args={["#ffae66", 34, 90]} />

      <CameraRig zoomedIn={zoomedIn} />
      <Sky />

      {/* Bright daylight ambient */}
      <ambientLight intensity={0.7} color="#f1f5ff" />
      {/* Cool sky key from the upper-left (vibrant blue corner) */}
      <directionalLight
        position={[-8, 11, 4]}
        intensity={1.5}
        color="#cfe6ff"
        castShadow
      />
      {/* Warm sunset key from the lower-right (orange/gold corner) */}
      <directionalLight position={[7, -1, 5]} intensity={1.2} color="#ffa14a" />
      {/* Golden bottom rim */}
      <pointLight position={[3, -3, 5]} intensity={0.6} color="#ffc14d" />

      <Environment preset="dawn" environmentIntensity={0.6} />

      <Suspense
        fallback={
          <Html center>
            <div className="flex flex-col items-center gap-4 font-display text-white">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              Loading World...
            </div>
          </Html>
        }
      >
        <Island targetRotation={targetRotation} />
      </Suspense>

      <ContactShadows
        position={[-2.2, -3, 0]}
        opacity={0.5}
        scale={28}
        blur={2.4}
        far={12}
        color="#2a0840"
      />

    </>
  );
}
