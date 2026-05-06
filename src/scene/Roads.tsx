import { MAIN_ROAD, SECTORS } from '@/lib/layout';

export function Roads() {
  return (
    <group>
      {/* Carretera principal entre sectores */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(MAIN_ROAD.fromX + MAIN_ROAD.toX) / 2, 0.02, MAIN_ROAD.z]}>
        <planeGeometry args={[MAIN_ROAD.toX - MAIN_ROAD.fromX, MAIN_ROAD.width]} />
        <meshStandardMaterial color="#0a1726" roughness={0.85} />
      </mesh>
      {/* Líneas centrales de la carretera (segmentadas cyan) */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = MAIN_ROAD.fromX + i * 6;
        if (x > MAIN_ROAD.toX) return null;
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x + 1.5, 0.03, MAIN_ROAD.z]}>
            <planeGeometry args={[2.4, 0.18]} />
            <meshBasicMaterial color="#22d3ee" toneMapped={false} />
          </mesh>
        );
      })}
      {/* Conectores de sectores a la carretera principal */}
      {SECTORS.map(s => (
        <mesh key={s.id} rotation={[-Math.PI / 2, 0, 0]} position={[s.pos[0], 0.02, s.pos[2] / 2]}>
          <planeGeometry args={[5, Math.abs(s.pos[2]) + 4]} />
          <meshStandardMaterial color="#0d1a2c" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
