"use client";

import React from "react";

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  wide?: boolean;
}

export function ChartCard({ title, subtitle, children, wide = false }: ChartCardProps) {
  return (
    <article className={`chart-card ${wide ? "wide" : ""}`}>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      {children}
    </article>
  );
}
