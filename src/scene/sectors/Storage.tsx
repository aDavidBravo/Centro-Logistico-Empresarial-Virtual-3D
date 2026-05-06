import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SECTOR_BY_ID } from '@/lib/layout';
import { SectorBase } from '../SectorBase';
import { useStore } from '@/store/useStore';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '@/lib/colors';

// Racks instanciados — torres altas con cajas azules tipo LinkedIn ref
export function SectorStorage() {
  const sector = SECTOR_BY_ID.storage;
  const racks = useStore(s => s.world.racks);
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const colorsArray = useMemo(() => new Float32Array(racks.length * 3), [racks.length]);

  // Construir matrices y colores
  useMemo(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const c = new THREE.Color();
    racks.forEach((r, i) => {
      dummy.position.set(r.x - sector.pos[0], r.y, r.z - sector.pos[2]);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1.6, 1.2, 2.6);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      // Color por ocupación (azul intenso si lleno, cyan apagado si vacío, ámbar/rojo si crítico)
      if (r.occupancyPct < 25) c.set('#7f1d1d');
      else if (r.occupancyPct > 95) c.set('#a16207');
      else if (r.occupancyPct > 70) c.set('#1d4ed8');
      else c.set('#1e3a8a');
      colorsArray[i * 3] = c.r;
      colorsArray[i * 3 + 1] = c.g;
      colorsArray[i * 3 + 2] = c.b;
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.geometry.attributes.color) {
      (meshRef.current.geometry.attributes.color as any).needsUpdate = true;
    }
  }, [racks, sector.pos, colorsArray]);

  // Suave parpadeo de color por estado
  useFrame((_, dt) => {
    if (!meshRef.current) return;
  });

  // Estructura del rack (postes verticales)
  const postPositions = useMemo(() => {
    const arr: [number, number, number][] = [];
    const rows = 6, cols = 8;
    const w = sector.size[0], d = sector.size[1];
    const stepX = (w - 8) / cols;
    const stepZ = (d - 14) / rows;
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const x = -w / 2 + 4 + c * stepX;
        const z = -d / 2 + 7 + r * stepZ;
        arr.push([x, 3.5, z]);
      }
    }
    return arr;
  }, [sector]);

  return (
    <SectorBase sector={sector}>
      {/* Postes verticales de los racks */}
      <instancedMesh args={[undefined, undefined, postPositions.length]}>
        <boxGeometry args={[0.18, 7, 0.18]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.4} />
        {postPositions.map((p, i) => null)}
      </instancedMesh>
      {postPositions.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.18, 7, 0.18]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Cajas en racks — instanced */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, racks.length]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial vertexColors={false} color="#1d4ed8" metalness={0.2} roughness={0.6} emissive="#1e3a8a" emissiveIntensity={0.15} />
      </instancedMesh>

      {/* Pasillos pintados */}
      {[0].map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <planeGeometry args={[sector.size[0] - 4, 1.2]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.35} />
        </mesh>
      ))}
    </SectorBase>
  );
}
