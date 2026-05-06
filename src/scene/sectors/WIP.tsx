import { SECTOR_BY_ID } from '@/lib/layout';
import { SectorBase } from '../SectorBase';
import { useStore } from '@/store/useStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Brazo robótico naranja (estilo Wisdom Warehouse)
function RoboticArm({ pos, state, id }: { pos: [number, number, number]; state: string; id: string }) {
  const upper = useRef<THREE.Group>(null!);
  const lower = useRef<THREE.Group>(null!);
  useFrame(() => {
    if (!upper.current || !lower.current) return;
    const t = Date.now() / 1000;
    const phase = state === 'pick' ? Math.sin(t * 2) * 0.3 - 0.4 : state === 'place' ? Math.sin(t * 2) * 0.3 + 0.4 : 0;
    upper.current.rotation.x = -0.4 + phase;
    lower.current.rotation.x = 0.6 - phase * 0.8;
  });

  return (
    <group position={pos}>
      {/* Base */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.9, 0.8, 16]} />
        <meshStandardMaterial color="#f97316" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Pedestal blanco */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[2, 0.1, 2]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      {/* Brazo articulado */}
      <group position={[0, 0.9, 0]}>
        <group ref={upper}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[0.45, 1.8, 0.45]} />
            <meshStandardMaterial color="#fb923c" metalness={0.5} roughness={0.4} />
          </mesh>
          <group position={[0, 1.8, 0]}>
            <group ref={lower}>
              <mesh position={[0, 0.7, 0]} castShadow>
                <boxGeometry args={[0.35, 1.4, 0.35]} />
                <meshStandardMaterial color="#fb923c" metalness={0.5} roughness={0.4} />
              </mesh>
              {/* Pinza */}
              <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[0.6, 0.2, 0.6]} />
                <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Caja siendo cargada */}
              {state === 'place' && (
                <mesh position={[0, 1.7, 0]}>
                  <boxGeometry args={[0.5, 0.4, 0.5]} />
                  <meshStandardMaterial color="#f59e0b" />
                </mesh>
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// Banda transportadora animada
function ConveyorBelt({ from, to, speed }: { from: [number, number, number]; to: [number, number, number]; speed: number }) {
  const tex = useRef<THREE.Mesh>(null!);
  const len = Math.hypot(to[0] - from[0], to[2] - from[2]);
  const cx = (from[0] + to[0]) / 2;
  const cz = (from[2] + to[2]) / 2;
  const angle = Math.atan2(to[2] - from[2], to[0] - from[0]);
  const stripesRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!stripesRef.current) return;
    stripesRef.current.position.x = (Date.now() / 1000 * speed) % 2 - 1;
  });

  return (
    <group position={[cx, 0.5, cz]} rotation={[0, -angle, 0]}>
      {/* Plataforma del conveyor */}
      <mesh ref={tex}>
        <boxGeometry args={[len, 0.3, 1.4]} />
        <meshStandardMaterial color="#1e3a8a" emissive="#1e40af" emissiveIntensity={0.3} metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Rieles laterales */}
      <mesh position={[0, 0.3, 0.7]}>
        <boxGeometry args={[len, 0.4, 0.1]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.3, -0.7]}>
        <boxGeometry args={[len, 0.4, 0.1]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.6} />
      </mesh>
      {/* Stripes animadas (cajas en movimiento) */}
      <group ref={stripesRef}>
        {Array.from({ length: Math.floor(len / 2) }).map((_, i) => (
          <mesh key={i} position={[-len / 2 + i * 2, 0.4, 0]}>
            <boxGeometry args={[1, 0.5, 1]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function SectorWIP() {
  const sector = SECTOR_BY_ID.wip;
  const arms = useStore(s => s.world.arms);
  const conveyors = useStore(s => s.world.conveyors);

  return (
    <SectorBase sector={sector}>
      {/* Líneas de producción */}
      {conveyors.map(c => (
        <ConveyorBelt
          key={c.id}
          from={[c.from[0] - sector.pos[0], c.from[1], c.from[2] - sector.pos[2]]}
          to={[c.to[0] - sector.pos[0], c.to[1], c.to[2] - sector.pos[2]]}
          speed={c.speed}
        />
      ))}

      {/* Brazos robóticos */}
      {arms.map(a => (
        <RoboticArm
          key={a.id}
          pos={[a.pos[0] - sector.pos[0], a.pos[1], a.pos[2] - sector.pos[2]]}
          state={a.state}
          id={a.id}
        />
      ))}

      {/* Etiquetas de estaciones */}
      {['Kitting', 'Ensamble', 'Prueba', 'Empaque'].map((name, i) => {
        const x = -sector.size[0] / 2 + 8 + i * (sector.size[0] - 16) / 3;
        return (
          <group key={name}>
            <Text position={[x, 0.1, -22]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.9} color="#22d3ee" anchorX="center">
              {`Línea 1 · ${name}`}
            </Text>
            <Text position={[x, 0.1, 22]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.9} color="#22d3ee" anchorX="center">
              {`Línea 2 · ${name}`}
            </Text>
          </group>
        );
      })}
    </SectorBase>
  );
}
