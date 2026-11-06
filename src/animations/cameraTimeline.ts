import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCENES } from '@/data/scenes';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CameraTimelineState {
  posX: number;
  posY: number;
  posZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
  fov: number;
}

export function createCameraScrollTimeline(
  state: CameraTimelineState,
  triggerSelector: string,
  onProgress: (progress: number, activeSceneIndex: number) => void,
  reducedMotion = false
) {
  const maxIdx = SCENES.length - 1;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerSelector,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reducedMotion ? 0.2 : 1.15,
      onUpdate: (self) => {
        const sceneIdx = Math.min(maxIdx, Math.max(0, Math.round(self.progress * maxIdx)));
        onProgress(self.progress, sceneIdx);
      },
    },
  });

  for (let i = 1; i < SCENES.length; i++) {
    const s = SCENES[i];
    tl.to(state, {
      posX: s.cameraPosition[0],
      posY: s.cameraPosition[1],
      posZ: s.cameraPosition[2],
      lookX: s.lookAt[0],
      lookY: s.lookAt[1],
      lookZ: s.lookAt[2],
      fov: s.fov,
      ease: 'power2.inOut',
      duration: 1,
    });
  }

  return tl;
}
