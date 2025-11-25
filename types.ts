import type React from 'react';

export interface LearningButtonData {
  id: string;
  circleColor: string;
  labelColor: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
