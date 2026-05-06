import { SECTOR_BY_ID } from '@/lib/layout';
import { SectorBase } from '../SectorBase';
import { useStore } from '@/store/useStore';
import { COLORS } from '@/lib/colors';
import { STATUS_COLOR } from '@/lib/colors';

export function SectorOutbound() {
  const sector = SECTOR_BY_ID.outbound;
  const containers = useStore(s => s.world.containers).filter(c => c.sector === 'outbound');

  return (
    <SectorBase sector={sector}>
      {/* Techo de los docks */}
      <mesh position={[0, 9, -10]}>
        <boxGeometry args={[sector.size[0] - 4, 0.4, 24]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Vigas */}
      {[-15, -7.5, 0, 7.5, 15].map((x, i) => (
        <mesh key={i} position={[x, 8.6, -10]}>
          <boxGeometry args={[0.3, 0.6, 22]} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Docks (puertas de salida) */}
      {[-15, -7.5, 0, 7.5, 15].map((x, i) => (
        <group key={`dock${i}`} position={[x, 0, -sector.size[1] / 2 + 4]}>
          <mesh position={[0, 4, 0]}>
            <boxGeometry args={[3.2, 8, 0.3]} />
            <meshStandardMaterial color="#0a1424" metalness={0.4} roughness={0.6} />
          </mesh>
          {/* LED del dock (estado) */}
          <mesh position={[0, 8.3, 0]}>
            <boxGeometry args={[3.6, 0.4, 0.3]} />
            <meshBasicMaterial color={i % 4 === 0 ? STATUS_COLOR.warn : STATUS_COLOR.ok} toneMapped={false} />
          </mesh>
          {/* Número del dock */}
          <mesh position={[0, 1, 0.16]}>
            <planeGeometry args={[2.5, 0.8]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      ))}

      {/* Yard de containers */}
      {containers.map(c => (
        <group key={c.id} position={[c.pos[0] - sector.pos[0], c.pos[1], c.pos[2] - sector.pos[2]]}>
          <mesh castShadow>
            <boxGeometry args={[3.6, 2.2, 4.2]} />
            <meshStandardMaterial
              color={c.status === 'critical' ? COLORS.containerCritical : c.status === 'warn' ? COLORS.containerWarn : COLORS.containerOk}
              metalness={0.4}
              roughness={0.5}
            />
          </mesh>
          <mesh position={[0, 0, 2.12]}>
            <planeGeometry args={[3.4, 0.5]} />
            <meshBasicMaterial color="#06b6d4" toneMapped={false} opacity={0.7} transparent />
          </mesh>
        </group>
      ))}

      {/* Líneas pintadas amarillas para cada dock */}
      {[-15, -7.5, 0, 7.5, 15].map((x, i) => (
        <mesh key={`line${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.07, -10]}>
          <planeGeometry args={[2, 16]} />
          <meshBasicMaterial color="#facc15" opacity={0.4} transparent />
        </mesh>
      ))}
    </SectorBase>
  );
}
