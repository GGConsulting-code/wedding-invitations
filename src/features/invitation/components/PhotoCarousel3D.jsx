"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MathUtils, TextureLoader, Vector3 } from "three";

const MAX_SCENE_PHOTOS = 8;
const CARD_SIZE = [1.65, 2.2];

function PhotoCard3D({ photo, index, activeIndex, onSelect }) {
  const meshRef = useRef(null);
  const texture = useLoader(TextureLoader, photo.url);
  const invalidate = useThree((state) => state.invalidate);
  const offset = index - activeIndex;
  const targetPosition = useMemo(
    () => new Vector3(offset * 1.75, Math.abs(offset) * -0.08, Math.abs(offset) * -0.58),
    [offset],
  );

  useEffect(() => {
    invalidate();
    return () => texture.dispose();
  }, [invalidate, texture]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.position.lerp(targetPosition, 0.13);
    mesh.rotation.y = MathUtils.lerp(mesh.rotation.y, offset * -0.16, 0.13);
    const targetScale = offset === 0 ? 1 : 0.82;
    const nextScale = MathUtils.lerp(mesh.scale.x, targetScale, 0.13);
    mesh.scale.setScalar(nextScale);

    const isMoving =
      mesh.position.distanceTo(targetPosition) > 0.002 ||
      Math.abs(mesh.rotation.y - offset * -0.16) > 0.002 ||
      Math.abs(mesh.scale.x - targetScale) > 0.002;
    if (isMoving) invalidate();
  });

  return (
    <mesh
      ref={meshRef}
      position={[offset * 1.75, Math.abs(offset) * -0.08, Math.abs(offset) * -0.58]}
      rotation={[0, offset * -0.16, 0]}
      scale={offset === 0 ? 1 : 0.82}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(index);
      }}
    >
      <planeGeometry args={CARD_SIZE} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function GalleryScene({ photos, activeIndex, onSelect }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [activeIndex, invalidate]);

  return photos.map((photo, index) => (
    <PhotoCard3D
      key={photo.id ?? `${photo.url}-${index}`}
      photo={photo}
      index={index}
      activeIndex={activeIndex}
      onSelect={onSelect}
    />
  ));
}

export function PhotoCarousel3D({ photos = [] }) {
  const scenePhotos = useMemo(() => photos.slice(0, MAX_SCENE_PHOTOS), [photos]);
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartX = useRef(null);

  const selectPhoto = (nextIndex) => {
    setActiveIndex(Math.min(scenePhotos.length - 1, Math.max(0, nextIndex)));
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectPhoto(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectPhoto(activeIndex + 1);
    }
  };

  const handlePointerUp = (event) => {
    if (dragStartX.current === null) return;
    const distance = event.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(distance) < 36) return;
    selectPhoto(activeIndex + (distance < 0 ? 1 : -1));
  };

  if (!scenePhotos.length) return null;

  return (
    <div
      className="photo-carousel-3d"
      role="group"
      aria-roledescription="carrusel 3D"
      aria-label="Fotografías de la pareja"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        dragStartX.current = event.clientX;
      }}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragStartX.current = null;
      }}
    >
      <div className="photo-carousel-3d__canvas" aria-hidden="true">
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5.25], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        >
          <Suspense fallback={null}>
            <GalleryScene photos={scenePhotos} activeIndex={activeIndex} onSelect={selectPhoto} />
          </Suspense>
        </Canvas>
      </div>

      <p className="photo-carousel-3d__description" aria-live="polite">
        {scenePhotos[activeIndex]?.altText}
      </p>
      <span className="photo-carousel-3d__position">
        {activeIndex + 1} / {scenePhotos.length}
      </span>

      <div className="photo-carousel-3d__navigation">
        <button
          type="button"
          className="photo-carousel-3d__arrow"
          aria-label="Ver fotografía anterior"
          onClick={() => selectPhoto(activeIndex - 1)}
          disabled={activeIndex === 0}
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="photo-carousel-3d__arrow"
          aria-label="Ver fotografía siguiente"
          onClick={() => selectPhoto(activeIndex + 1)}
          disabled={activeIndex === scenePhotos.length - 1}
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      </div>

      <ul className="sr-only">
        {scenePhotos.map((photo) => <li key={photo.id}>{photo.altText}</li>)}
      </ul>
    </div>
  );
}

export { MAX_SCENE_PHOTOS };
