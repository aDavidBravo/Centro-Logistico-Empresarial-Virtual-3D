import { SECTOR_BY_ID } from '@/lib/layout';
import { SectorBase } from '../SectorBase';
import { useStore } from '@/store/useStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { STATUS_COLOR } from '@/lib/colors';

function Drone({ pos, status, id, hover }: { pos: [number, number, number]; status: string; id: string; hover: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(() => {
    if (!ref.current) return;
    const t = Date.now() / 1000;
    ref.current.position.y = pos[1] + Math.sin(t * 2 + hover) * 0.2;
  });
  return (
    <group ref={ref} position={pos as any}>
      {/* Cuerpo */}
      <mesh>
        <boxGeometry args={[0.6, 0.2, 0.6]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 4 brazos con propelas */}
      {[
        [0.6, 0, 0.6], [-0.6, 0, 0.6], [0.6, 0, -0.6], [-0.6, 0, -0.6],
      ].map((p, i) => (
        <group key={i} position={p as any}>
          <mesh>
            <boxGeometry args={[0.1, 0.05, 0.1]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[0, (Date.now() / 50 + i) % (Math.PI * 2), 0]}>
            <boxGeometry args={[0.6, 0.01, 0.06]} />
            <meshStandardMaterial color="#9ca3af" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
      {/* LED de estado */}
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color={status === 'critical' ? STATUS_COLOR.critical : status === 'warn' ? STATUS_COLOR.warn : STATUS_COLOR.ok} toneMapped={false} />
      </mesh>
      <pointLight position={[0, -0.15, 0]} intensity={0.6} distance={3} color={status === 'ok' ? '#22ffaa' : status === 'warn' ? '#facc15' : '#ef4444'} />
    </group>
  );
}

export function SectorTransport() {
  const sector = SECTOR_BY_ID.transport;
  const drones = useStore(s => s.world.drones);

  return (
    <SectorBase sector={sector}>
      {/* Drone Port — plataformas elevadas */}
      <group position={[10, 0, 18]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[(i % 2) * 5 - 2.5, 0, Math.floor(i / 2) * 5 - 2.5]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[1.6, 1.8, 1, 12]} />
              <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.5} />
            </mesh>
            {/* Helipad H */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.01, 0]}>
              <ringGeometry args={[1.0, 1.4, 24]} />
              <meshBasicMaterial color="#a855f7" toneMapped={false} />
            </mesh>
            <pointLight position={[0, 1.5, 0]} intensity={1} distance={6} color="#a855f7" />
          </group>
        ))}
      </group>

      {/* Estación de carga drones */}
      <group position={[-15, 0, 18]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[6, 3, 4]} />
          <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 3.05, 0]}>
          <boxGeometry args={[5.4, 0.1, 3.6]} />
          <meshBasicMaterial color="#a855f7" toneMapped={false} />
        </mesh>
      </group>

      {/* Drones flotando */}
      {drones.map(d => (
        <Drone
          key={d.id}
          pos={[d.pos[0] - sector.pos[0], d.pos[1], d.pos[2] - sector.pos[2]]}
          status={d.status}
          hover={d.hover}
          id={d.id}
        />
      ))}

      {/* Espacios para vans/camiones (líneas de estacionamiento) */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-15 + (i % 3) * 6, 0.06, -10 + Math.floor(i / 3) * 8]}>
          <planeGeometry args={[5, 7]} />
          <meshBasicMaterial color="#facc15" opacity={0.15} transparent />
        </mesh>
      ))}
    </SectorBase>
  );
}
