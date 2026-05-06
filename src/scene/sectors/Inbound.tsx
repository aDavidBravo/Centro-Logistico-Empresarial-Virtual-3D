import { SECTOR_BY_ID } from '@/lib/layout';
import { SectorBase } from '../SectorBase';
import { useStore } from '@/store/useStore';
import { COLORS, STATUS_COLOR } from '@/lib/colors';

export function SectorInbound() {
  const sector = SECTOR_BY_ID.inbound;
  const containers = useStore(s => s.world.containers).filter(c => c.sector === 'inbound');

  return (
    <SectorBase sector={sector}>
      {/* Techo industrial parcial */}
      <group position={[0, 0, -8]}>
        <mesh position={[0, 12, 0]}>
          <boxGeometry args={[sector.size[0] - 4, 0.4, 30]} />
          <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* Vigas */}
        {[-15, -7.5, 0, 7.5, 15].map((x, i) => (
          <mesh key={i} position={[x, 11.6, 0]}>
            <boxGeometry args={[0.3, 0.6, 28]} />
            <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}
        {/* Barras de luz */}
        {[-12, -4, 4, 12].map((x, i) => (
          <mesh key={`l${i}`} position={[x, 11.8, 0]}>
            <boxGeometry args={[0.5, 0.1, 26]} />
            <meshBasicMaterial color="#22d3ee" toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Puertas/gates de inbound (donde entran trailers) */}
      {[-12, -4, 4, 12].map((x, i) => (
        <group key={`gate${i}`} position={[x, 0, -sector.size[1] / 2 + 4]}>
          <mesh position={[0, 4, 0]}>
            <boxGeometry args={[3.2, 8, 0.3]} />
            <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.6} />
          </mesh>
          <mesh position={[0, 8.3, 0]}>
            <boxGeometry args={[3.6, 0.4, 0.3]} />
            <meshBasicMaterial color={STATUS_COLOR.ok} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Containers apilados */}
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
          {/* Banda lateral */}
          <mesh position={[0, 0, 2.12]}>
            <planeGeometry args={[3.4, 0.5]} />
            <meshBasicMaterial color="#22d3ee" toneMapped={false} opacity={0.7} transparent />
          </mesh>
        </group>
      ))}

      {/* Áreas de validación (zonas pintadas) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 8]}>
        <planeGeometry args={[sector.size[0] - 6, 14]} />
        <meshStandardMaterial color="#1e3a8a" emissive="#1e40af" emissiveIntensity={0.05} roughness={0.9} />
      </mesh>
      {/* Líneas de cuadrícula amarillas (zonas) */}
      {[-12, -4, 4, 12].map((x, i) => (
        <mesh key={`line${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.07, 8]}>
          <planeGeometry args={[0.15, 12]} />
          <meshBasicMaterial color="#facc15" toneMapped={false} />
        </mesh>
      ))}
    </SectorBase>
  );
}
