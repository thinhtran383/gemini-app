import { useState, useEffect, useCallback, useRef } from 'react';
import { getSoundFiles } from '../utils/soundMapping';

interface SpeakOptions {
  rate?: number; // Ignored for audio files, kept for API compatibility
  cancel?: boolean; // if true, cancels any ongoing speech before speaking
}

export const useSpeechSynthesis = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  
  // Initialize audio object
  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleEnded = () => {
      playNext();
    };
    
    audioRef.current.addEventListener('ended', handleEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playNext = () => {
    if (queueRef.current.length > 0 && audioRef.current) {
      const nextFile = queueRef.current.shift();
      if (nextFile) {
        // Construct path to sound file
        // Assuming sound files are in /sound/ directory relative to public root
        audioRef.current.src = `/sound/${nextFile}`;
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(false);
    }
  };

  const cancel = useCallback(() => {
    queueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const speak = useCallback((text: string, options: SpeakOptions = {}) => {
    const { cancel: shouldCancel = true } = options;

    if (shouldCancel) {
      cancel();
    }

    const files = getSoundFiles(text);
    
    if (files.length === 0) {
      return;
    }

    // Add to queue
    queueRef.current = [...queueRef.current, ...files];

    // If not currently playing, start
    if (audioRef.current && audioRef.current.paused) {
      playNext();
    }
  }, [cancel]);

  return { speak, cancel, isPlaying };
};
