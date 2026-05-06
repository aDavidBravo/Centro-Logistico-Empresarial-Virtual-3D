import { useStore } from '@/store/useStore';
import type { SectorDef } from '@/lib/layout';
import { useState } from 'react';
import { Edges } from '@react-three/drei';

interface Props {
  sector: SectorDef;
  children?: React.ReactNode;
}

export function SectorBase({ sector, children }: Props) {
  const select = useStore(s => s.selectSector);
  const selected = useStore(s => s.selectedSector === sector.id);
  const [hover, setHover] = useState(false);
  const [w, d] = sector.size;
  const [x, , z] = sector.pos;

  const intensity = selected ? 1 : hover ? 0.7 : 0.35;

  return (
    <group position={[x, 0, z]}>
      {/* Plataforma base del sector con código de color */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = 'default'; }}
        onClick={(e) => { e.stopPropagation(); select(sector.id); }}
      >
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial
          color={sector.color}
          emissive={sector.glow}
          emissiveIntensity={intensity * 0.18}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Borde luminoso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[Math.min(w, d) / 2 - 0.6, Math.min(w, d) / 2 - 0.2, 64]} />
        <meshBasicMaterial color={sector.glow} transparent opacity={selected ? 0.85 : hover ? 0.55 : 0.2} toneMapped={false} />
      </mesh>

      {/* Marco/edges */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[w, 0.02, d]} />
        <meshBasicMaterial color={sector.glow} transparent opacity={0.0} />
        <Edges color={sector.glow} threshold={1} />
      </mesh>

      {/* Pilares en las esquinas (estilo industrial) */}
      {[
        [-w / 2 + 1, 0, -d / 2 + 1],
        [w / 2 - 1, 0, -d / 2 + 1],
        [-w / 2 + 1, 0, d / 2 - 1],
        [w / 2 - 1, 0, d / 2 - 1],
      ].map((p, i) => (
        <group key={i} position={p as any}>
          <mesh position={[0, 5, 0]}>
            <boxGeometry args={[0.5, 10, 0.5]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* luz en el tope */}
          <mesh position={[0, 10.2, 0]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshBasicMaterial color={sector.glow} toneMapped={false} />
          </mesh>
          <pointLight position={[0, 10.2, 0]} intensity={3} distance={14} color={sector.glow} />
        </group>
      ))}

      {children}
    </group>
  );
}
