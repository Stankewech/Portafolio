'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraTimelineState } from '@/animations/cameraTimeline';
import * as THREE from 'three';

interface CameraControllerProps {
  camState: React.MutableRefObject<CameraTimelineState>;
}

export default function CameraController({ camState }: CameraControllerProps) {
  const { camera } = useThree();
  const mouseOffset = useRef({ x: 0, y: 0 });
  const smoothLook = useRef(new THREE.Vector3(0, 1.35, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseOffset.current.x = nx * 0.35;
      mouseOffset.current.y = -ny * 0.22;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, delta) => {
    const s = camState.current;
    const damp = Math.min(1, delta * 7.5);

    const targetPosX = s.posX + mouseOffset.current.x;
    const targetPosY = s.posY + mouseOffset.current.y;
    const targetPosZ = s.posZ;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPosX, damp);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPosY, damp);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPosZ, damp);

    smoothLook.current.x = THREE.MathUtils.lerp(smoothLook.current.x, s.lookX + mouseOffset.current.x * 0.25, damp);
    smoothLook.current.y = THREE.MathUtils.lerp(smoothLook.current.y, s.lookY + mouseOffset.current.y * 0.2, damp);
    smoothLook.current.z = THREE.MathUtils.lerp(smoothLook.current.z, s.lookZ, damp);

    camera.lookAt(smoothLook.current);

    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - s.fov) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, s.fov, damp);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
