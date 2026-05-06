import { useStore } from '@/store/useStore';
import { Html } from '@react-three/drei';
import { STATUS_COLOR } from '@/lib/colors';

function Trailer({ v }: { v: any }) {
  const c = v.status === 'critical' ? '#7f1d1d' : v.status === 'warn' ? '#a16207' : '#1e3a8a';
  return (
    <group position={v.pos} rotation={[0, v.rot, 0]}>
      {/* Cabina */}
      <mesh position={[3, 1.5, 0]} castShadow>
        <boxGeometry args={[3, 3, 2.4]} />
        <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Caja del trailer */}
      <mesh position={[-3, 1.8, 0]} castShadow>
        <boxGeometry args={[10, 3.6, 2.6]} />
        <meshStandardMaterial color={c} metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Banda lateral con código */}
      <mesh position={[-3, 1.4, 1.32]}>
        <planeGeometry args={[8, 0.7]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      {/* Ruedas */}
      {[[-7, 0.4, 1.3], [-5, 0.4, 1.3], [-1, 0.4, 1.3], [3, 0.4, 1.3], [-7, 0.4, -1.3], [-5, 0.4, -1.3], [-1, 0.4, -1.3], [3, 0.4, -1.3]].map((p, i) => (
        <mesh key={i} position={p as any} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.4, 12]} />
          <meshStandardMaterial color="#0a0e1a" />
        </mesh>
      ))}
      {/* Indicador de carga */}
      <mesh position={[-3, 4.0, 0]}>
        <boxGeometry args={[v.loadPct / 100 * 9, 0.2, 0.4]} />
        <meshBasicMaterial color={v.loadPct > 80 ? STATUS_COLOR.ok : v.loadPct > 40 ? STATUS_COLOR.warn : STATUS_COLOR.critical} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Van({ v }: { v: any }) {
  const c = v.status === 'critical' ? '#7f1d1d' : v.status === 'warn' ? '#a16207' : '#0e7490';
  return (
    <group position={v.pos} rotation={[0, v.rot, 0]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[5, 2.2, 2]} />
        <meshStandardMaterial color={c} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[1.5, 1.5, 0]}>
        <boxGeometry args={[1.5, 1.4, 1.9]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {[[-1.5, 0.4, 1.05], [1.5, 0.4, 1.05], [-1.5, 0.4, -1.05], [1.5, 0.4, -1.05]].map((p, i) => (
        <mesh key={i} position={p as any} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 12]} />
          <meshStandardMaterial color="#0a0e1a" />
        </mesh>
      ))}
    </group>
  );
}

function AGV({ v }: { v: any }) {
  return (
    <group position={v.pos} rotation={[0, v.rot, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.4, 0.4, 1.0]} />
        <meshStandardMaterial color="#f97316" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* LED superior */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshBasicMaterial color={v.loadPct > 50 ? STATUS_COLOR.ok : STATUS_COLOR.warn} toneMapped={false} />
      </mesh>
      {/* Pallet encima si carga */}
      {v.loadPct > 30 && (
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[1.0, 0.3, 0.8]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
      )}
    </group>
  );
}

function Forklift({ v }: { v: any }) {
  return (
    <group position={v.pos} rotation={[0, v.rot, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.6, 0.8, 1.2]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Mástil */}
      <mesh position={[0.9, 1.5, 0]}>
        <boxGeometry args={[0.15, 2.4, 0.8]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Forks */}
      <mesh position={[1.4, 0.4, 0.3]}>
        <boxGeometry args={[1.2, 0.1, 0.15]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} />
      </mesh>
      <mesh position={[1.4, 0.4, -0.3]}>
        <boxGeometry args={[1.2, 0.1, 0.15]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} />
      </mesh>
      {/* Cabina */}
      <mesh position={[-0.3, 1.4, 0]}>
        <boxGeometry args={[0.8, 1.2, 1.0]} />
        <meshStandardMaterial color="#0a0e1a" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export function Vehicles() {
  const vehicles = useStore(s => s.world.vehicles);
  const showOverlays = useStore(s => s.showOverlays);
  const setHover = useStore(s => s.setHover);
  const hoverId = useStore(s => s.hoverEntityId);

  return (
    <group>
      {vehicles.map(v => {
        const Comp = v.kind === 'trailer' ? Trailer : v.kind === 'van' ? Van : v.kind === 'forklift' ? Forklift : AGV;
        return (
          <group
            key={v.id}
            onPointerOver={(e) => { e.stopPropagation(); setHover(v.id); }}
            onPointerOut={() => setHover(null)}
          >
            <Comp v={v} />
            {showOverlays && hoverId === v.id && (
              <Html position={[v.pos[0], 5, v.pos[2]]} center distanceFactor={50}>
                <div className="px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap"
                     style={{ background: 'rgba(3,6,13,0.92)', border: '1px solid #22d3ee', color: '#22d3ee', boxShadow: '0 0 12px rgba(34,211,238,0.5)' }}>
                  <div className="font-bold">{v.id}</div>
                  <div className="text-[9px] opacity-80">{v.kind.toUpperCase()} · {v.cargo}</div>
                  <div className="text-[9px] opacity-80">{v.origin} → {v.destination}</div>
                  <div className="text-[9px] opacity-80">Load: {v.loadPct}%</div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
