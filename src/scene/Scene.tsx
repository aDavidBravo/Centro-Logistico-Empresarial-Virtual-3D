import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Ground } from './Ground';
import { Roads } from './Roads';
import { SectorInbound } from './sectors/Inbound';
import { SectorStorage } from './sectors/Storage';
import { SectorWIP } from './sectors/WIP';
import { SectorOutbound } from './sectors/Outbound';
import { SectorTransport } from './sectors/Transport';
import { SectorLabels } from './SectorLabels';
import { Vehicles } from './Vehicles';
import { OrderFlow } from './OrderFlow';
import { useStore } from '@/store/useStore';
import { SECTOR_BY_ID } from '@/lib/layout';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// Camera target positions per sector
const SECTOR_CAM: Record<string, { target: THREE.Vector3; offset: THREE.Vector3 }> = {
  inbound:   { target: new THREE.Vector3(-95,  0, 0), offset: new THREE.Vector3(-60, 55, 75) },
  storage:   { target: new THREE.Vector3(-40,  0, 0), offset: new THREE.Vector3(-10, 60, 85) },
  wip:       { target: new THREE.Vector3(25,   0, 0), offset: new THREE.Vector3(55,  55, 75) },
  outbound:  { target: new THREE.Vector3(85,   0, 0), offset: new THREE.Vector3(115, 55, 75) },
  transport: { target: new THREE.Vector3(135,  0, 0), offset: new THREE.Vector3(165, 55, 75) },
  _default:  { target: new THREE.Vector3(10,   0, 0), offset: new THREE.Vector3(40,  90, 130) },
};

function TickLoop() {
  const tick = useStore(s => s.tick);
  useFrame((_, dt) => tick(dt));
  return null;
}

function CinematicCamera({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl> }) {
  const selected = useStore(s => s.selectedSector);
  const { camera } = useThree();

  const targetPos = useRef(new THREE.Vector3(10, 0, 0));
  const targetCam = useRef(new THREE.Vector3(40, 90, 130));

  useFrame(() => {
    const key = selected ?? '_default';
    const def = SECTOR_CAM[key] ?? SECTOR_CAM._default;

    // Smoothly lerp desired values
    targetPos.current.lerp(def.target, 0.04);
    targetCam.current.lerp(def.offset, 0.04);

    // Update OrbitControls target
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetPos.current, 0.3);
      controlsRef.current.update();
    }

    // Move camera
    camera.position.lerp(targetCam.current, 0.04);
  });

  return null;
}

export function Scene() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);

  return (
    <Canvas dpr={[1, 1.6]} shadows gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <color attach="background" args={['#03060d']} />
      <fog attach="fog" args={['#03060d', 130, 380]} />
      <PerspectiveCamera makeDefault position={[40, 90, 130]} fov={42} />

      <Suspense fallback={null}>
        <ambientLight intensity={0.35} color="#cfe7ff" />
        <directionalLight position={[60, 120, 40]} intensity={0.9} color="#ffffff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <directionalLight position={[-80, 60, -40]} intensity={0.35} color="#22d3ee" />
        <pointLight position={[0, 30, 0]} intensity={30} distance={120} color="#3b82f6" />
        <Stars radius={300} depth={80} count={3500} factor={5} saturation={0.5} fade speed={0.4} />
        <Ground />
        <Roads />
        <SectorInbound />
        <SectorStorage />
        <SectorWIP />
        <SectorOutbound />
        <SectorTransport />
        <Vehicles />
        <OrderFlow />
        <SectorLabels />
        <TickLoop />
        <CinematicCamera controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={40}
          maxDistance={280}
          maxPolarAngle={Math.PI / 2.15}
          target={[10, 0, 0]}
        />
      </Suspense>
    </Canvas>
  );
}
