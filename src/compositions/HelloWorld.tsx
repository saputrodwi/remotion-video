import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleScale = spring({frame, fps, config: {damping: 12}, from: 0.4, to: 1});
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exit = interpolate(frame, [120, 149], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Helvetica, Arial, sans-serif',
        opacity: exit,
      }}
    >
      <div
        style={{
          transform: `scale(${titleScale})`,
          color: '#fff',
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        Hello World
      </div>
      <div
        style={{
          marginTop: 24,
          color: 'rgba(255,255,255,0.85)',
          fontSize: 40,
          opacity: subtitleOpacity,
        }}
      >
        Rendered with Remotion + GitHub Actions
      </div>
    </AbsoluteFill>
  );
};
