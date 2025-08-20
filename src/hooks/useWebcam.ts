import { useEffect, useRef, useState } from "react";
import * as faceapi from 'face-api.js';

// Use a larger input size & lower threshold for better accuracy. Tiny model is fast; SSD acts as a robust fallback.
const TINY_FACE_DETECTOR_OPTIONS = new faceapi.TinyFaceDetectorOptions({
  inputSize: 320,
  scoreThreshold: 0.2,
});

interface FaceDetection {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [faceDetection, setFaceDetection] = useState<FaceDetection | null>(null);
  const [emotions, setEmotions] = useState<faceapi.FaceExpressions | null>(null);
  const [dominantEmotion, setDominantEmotion] = useState<string | null>(null);
  const [isSmiling, setIsSmiling] = useState(false);
  const [isAngry, setIsAngry] = useState(false);
  const [isSad, setIsSad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const detectionIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // NEW – fallback detector
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const handleDetections = async () => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      try {
        // first try the lightweight TinyFaceDetector
        let detection = await faceapi
          .detectSingleFace(videoRef.current, TINY_FACE_DETECTOR_OPTIONS)
          .withFaceExpressions();

        // if that fails, fall back to SSD Mobilenet which is slower but more accurate on some devices
        if (!detection) {
          detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceExpressions();
        }

        if (detection) {
          const box = detection.detection.box;
          setFaceDetection({
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            confidence: detection.detection.score
          });
          const exps = detection.expressions;
          setEmotions(exps);

          // Determine dominant emotion and boolean flags
          const expsAny = exps as any;
          const dominant = Object.keys(expsAny).reduce((a, b) => expsAny[a] > expsAny[b] ? a : b);
          setDominantEmotion(dominant);

          setIsSmiling(expsAny.happy > 0.5);
          setIsAngry(expsAny.angry > 0.5);
          setIsSad(expsAny.sad > 0.5);
        } else {
          setFaceDetection(null);
          setEmotions(null);
          setDominantEmotion(null);
          setIsSmiling(false);
          setIsAngry(false);
          setIsSad(false);
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    }
    // Schedule the next detection
    if (videoRef.current?.srcObject) {
      // use window.setTimeout so types resolve to number in browser
      detectionIntervalRef.current = window.setTimeout(handleDetections, 200);
    }
  };

  const startWebcam = async () => {
    if (!modelsLoaded || isActive) {
      return;
    }

    try {
      setIsLoading(true);

      if (!videoRef.current) {
        videoRef.current = document.createElement('video');
        videoRef.current.style.position = 'fixed';
        videoRef.current.style.top = '-1000px';
        videoRef.current.style.width = '640px';
        videoRef.current.style.height = '480px';
        videoRef.current.setAttribute('playsinline', 'true');
        document.body.appendChild(videoRef.current);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Error playing video:", error);
          }
        });
      }

      videoRef.current?.addEventListener('loadeddata', () => {
        setIsActive(true);
        setIsLoading(false);
        handleDetections();
      });

    } catch (error) {
      console.warn('Webcam access denied or not available:', error);
      setIsLoading(false);
    }
  };

  const stopWebcam = () => {
    if (detectionIntervalRef.current !== null) {
      clearTimeout(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setFaceDetection(null);
    setEmotions(null);
    setDominantEmotion(null);
    setIsSmiling(false);
    setIsAngry(false);
    setIsSad(false);
  };

  useEffect(() => {
    return () => {
      stopWebcam();
      if (videoRef.current && document.body.contains(videoRef.current)) {
        document.body.removeChild(videoRef.current);
      }
    };
  }, []);

  return {
    isActive,
    faceDetection,
    emotions,
    dominantEmotion,
    isLoading: isLoading || !modelsLoaded,
    startWebcam,
    stopWebcam,
    isSmiling,
    isAngry,
    isSad,
  };
};

