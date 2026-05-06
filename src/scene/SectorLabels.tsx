import { Billboard, Text } from '@react-three/drei';
import { SECTORS } from '@/lib/layout';
import { useStore } from '@/store/useStore';

export function SectorLabels() {
  const selected = useStore(s => s.selectedSector);
  return (
    <group>
      {SECTORS.map(s => {
        const isSel = selected === s.id;
        return (
          <Billboard key={s.id} position={[s.pos[0], 22, s.pos[2] - s.size[1] / 2 - 2]}>
            <Text
              fontSize={isSel ? 7 : 5.5}
              color={isSel ? '#ffffff' : s.glow}
              outlineWidth={0.18}
              outlineColor="#000000"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.06}
            >
              {s.label}
            </Text>
            <Text
              fontSize={1.1}
              color="#9ca3af"
              anchorX="center"
              anchorY="middle"
              position={[0, -3.5, 0]}
              letterSpacing={0.4}
            >
              SECTOR · {s.id.toUpperCase()}
            </Text>
          </Billboard>
        );
      })}
    </group>
  );
}
