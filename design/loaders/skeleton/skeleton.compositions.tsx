import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Skeleton } from './skeleton.js';
import { SkeletonList } from './skeleton-list.js';

export const TextSkeleton = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: '1.5rem', maxWidth: '360px' }}>
        <Skeleton variant="text" lines={3} />
      </div>
    </MemoryRouter>
  );
};

export const ShapeSkeletons = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <Skeleton variant="circle" width={48} height={48} />
        <Skeleton variant="rect" width={160} height={90} />
        <Skeleton variant="text" width={120} />
      </div>
    </MemoryRouter>
  );
};

export const EmailListLoading = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: '1.5rem', maxWidth: '520px' }}>
        <SkeletonList variant="email" count={3} />
      </div>
    </MemoryRouter>
  );
};

export const DashboardPanelsLoading = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: '1.5rem', maxWidth: '760px' }}>
        <SkeletonList variant="panel" count={4} />
      </div>
    </MemoryRouter>
  );
};
