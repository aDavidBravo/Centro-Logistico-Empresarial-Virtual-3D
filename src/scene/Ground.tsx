import * as THREE from 'three';
import { useMemo } from 'react';
import { CAMPUS } from '@/lib/layout';
import { useStore } from '@/store/useStore';

export function Ground() {
  const selectSector = useStore(s => s.selectSector);
  // Suelo principal con grid
  const grid = useMemo(() => {
    const size = 600;
    const divisions = 120;
    return new THREE.GridHelper(size, divisions, '#0e3a4d', '#091a26');
  }, []);

  return (
    <group>
      {/* Tierra/asfalto base — click aquí deselecciona sector */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow onClick={() => selectSector(null)}>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color="#04080f" roughness={1} metalness={0} />
      </mesh>
      {/* Pavimento del campus */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0, 0]} receiveShadow>
        <planeGeometry args={[CAMPUS.width + 30, CAMPUS.depth + 20]} />
        <meshStandardMaterial color="#0a1426" roughness={0.95} metalness={0.05} />
      </mesh>
      <primitive object={grid} position={[10, 0.01, 0]} />
    </group>
  );
}
