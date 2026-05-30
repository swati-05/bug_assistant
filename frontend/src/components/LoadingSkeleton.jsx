import React from 'react';

const CardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-4 w-32 bg-slate-200 rounded" />
      <div className="h-5 w-16 bg-slate-200 rounded-full" />
    </div>
    <div className="h-5 w-3/4 bg-slate-200 rounded mb-3" />
    <div className="flex gap-2 mb-4">
      <div className="h-5 w-20 bg-slate-200 rounded-full" />
      <div className="h-5 w-20 bg-slate-200 rounded-full" />
    </div>
    <div className="h-3 w-full bg-slate-200 rounded mb-2" />
    <div className="h-3 w-5/6 bg-slate-200 rounded" />
  </div>
);

const LineSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
    <div className="h-4 w-2/3 bg-slate-200 rounded mb-2" />
    <div className="h-3 w-1/3 bg-slate-200 rounded" />
  </div>
);

const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  const items = Array.from({ length: count });
  return (
    <div
      className={
        type === 'card'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
          : 'space-y-3'
      }
    >
      {items.map((_, i) =>
        type === 'card' ? <CardSkeleton key={i} /> : <LineSkeleton key={i} />
      )}
    </div>
  );
};

export default LoadingSkeleton;
