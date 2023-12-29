"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

import jsonData from "/test-cities/marion-ohio.json";

const parseLineData = () => {
  let returnArray = [];
  let total = 0;
  let sumX = 0;
  let sumY = 0;
  let scale = 1000;

  jsonData["elements"].forEach((obj) => {
    const currentList = obj["geometry"];
    total += currentList.length;

    for (let i = 0; i < currentList.length - 1; i++) {
      const start = [currentList[i].lon * scale, currentList[i].lat * scale, 0];
      const end = [
        currentList[i + 1].lon * scale,
        currentList[i + 1].lat * scale,
        0,
      ];

      sumX += currentList[i].lon * scale;
      sumY += currentList[i].lat * scale;

      returnArray.push({ start, end, color: 0xffffff });
    }

    sumX += currentList[currentList.length - 1].lon * scale;
    sumY += currentList[currentList.length - 1].lat * scale;
  });

  return {
    centerX: sumX / total,
    centerY: sumY / total,
    lineArray: returnArray,
  };
};

const MapWithLines = () => {
  const sceneRef = useRef();
  const cameraRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    parseLineData();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.logarithmicDepthBuffer = true;

    // Create a container div using JSX
    const container = document.createElement("div");
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);

    const linesArray = []; // Array to store references to individual lines

    // Define the lines' geometry and material
    const parsedLineData = parseLineData();
    const lineData = parsedLineData["lineArray"];
    const centerX = parsedLineData["centerX"];
    const centerY = parsedLineData["centerY"];

    lineData.forEach(({ start, end, color }) => {
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([...start, ...end]);
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

      const material = new THREE.LineBasicMaterial({ color });

      // Use LineSegments instead of Line for linewidth property
      const line = new THREE.LineSegments(geometry, material);

      scene.add(line);
      linesArray.push(line);
    });

    // Set the camera position
    camera.position.set(centerX, centerY, 20);

    sceneRef.current = scene;
    cameraRef.current = camera;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    // Start the animation loop
    animate();

    // Wheel event handler for zooming
    const handleWheel = (event) => {
      event.preventDefault();

      const delta = event.deltaY;
      const new_z_offset = delta * 0.01;

      // Adjust the camera position based on the scroll direction
      if (camera.position.z + new_z_offset > 5) {
        camera.position.z += new_z_offset;
      }
    };

    // Mouse event handlers for click and drag movement
    const handleMouseDown = (event) => {
      isDraggingRef.current = true;
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleMouseMove = (event) => {
      if (!isDraggingRef.current) return;

      const newX = (event.clientX / window.innerWidth) * 2 - 1;
      const newY = -(event.clientY / window.innerHeight) * 2 + 1;

      const deltaX = newX - mouseRef.current.x;
      const deltaY = newY - mouseRef.current.y;

      // Adjust the camera position based on the mouse movement
      camera.position.x -= deltaX * 15;
      camera.position.y -= deltaY * 15;

      mouseRef.current.x = newX;
      mouseRef.current.y = newY;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Add event listeners
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.removeChild(container);
    };
  }, []);

  return null;
};

export default MapWithLines;
