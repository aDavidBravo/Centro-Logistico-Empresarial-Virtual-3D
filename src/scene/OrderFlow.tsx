import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

// Waypoints: inbound → storage → wip → outbound (X axis positions)
const WAYPOINTS = [-95, -40, 25, 85];
const TOTAL_LEN = WAYPOINTS[WAYPOINTS.length - 1] - WAYPOINTS[0];   // 180

const COUNT = 60;
const COLORS = [
  new THREE.Color('#22d3ee'),  // cyan
  new THREE.Color('#f97316'),  // amber
  new THREE.Color('#22c55e'),  // green
  new THREE.Color('#a855f7'),  // purple
];

export function OrderFlow() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const showRoutes = useStore(s => s.showRoutes);
  const paused = useStore(s => s.paused);
  const simSpeed = useStore(s => s.simSpeed);

  // Stable per-particle data (seeded)
  const particles = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({
    phase: (i / COUNT) * TOTAL_LEN,            // spread evenly along route
    zOff: (((i * 2654435761) >>> 0) % 1000) / 1000 * 6 - 3,  // z offset ±3
    yOff: (((i * 2246822519) >>> 0) % 1000) / 1000 * 1.2 + 0.6,
    speed: 2.5 + (((i * 1597334677) >>> 0) % 1000) / 1000 * 4,
    colorIdx: i % COLORS.length,
    scale: 0.18 + (((i * 374761393) >>> 0) % 1000) / 1000 * 0.14,
  })), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((_, dt) => {
    if (!meshRef.current || !showRoutes) return;
    const advance = paused ? 0 : dt * simSpeed;

    particles.forEach((p, i) => {
      p.phase = (p.phase + p.speed * advance) % TOTAL_LEN;
      const x = WAYPOINTS[0] + p.phase;
      dummy.position.set(x, p.yOff, p.zOff);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      color.copy(COLORS[p.colorIdx]);
      // Pulse brightness based on time
      const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 400 + i);
      color.multiplyScalar(pulse);
      meshRef.current.setColorAt(i, color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (!showRoutes) return null;

  return (
    <>
      {/* Glowing order particles */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Route line along X axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-95, 0.3, 0,  85, 0.3, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.18} toneMapped={false} />
      </line>
    </>
  );
}
