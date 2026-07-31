"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Analytics } from "../types";
import { COLORS } from "../utils/api";
import { ChartCard } from "./ChartCard";
import { LegendLike } from "./LegendLike";

interface OverviewProps {
  analytics: Analytics | null;
  onDiscover: () => void;
}

function formatTotalDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function Overview({ analytics, onDiscover }: OverviewProps) {
  const cards = analytics
    ? [
        { label: "Songs saved", value: analytics.summary.savedSongs },
        { label: "Artists explored", value: analytics.summary.distinctArtists },
        { label: "Total duration", value: formatTotalDuration(analytics.summary.totalDuration) },
        {
          label: "Average rating",
          value: analytics.summary.averageUserRating
            ? `${analytics.summary.averageUserRating.toFixed(1)} / 5`
            : "—",
        },
      ]
    : [];

  if (!analytics || analytics.summary.savedSongs === 0) {
    return (
      <section className="empty-state">
        <div className="empty-art">♫</div>
        <p className="eyebrow">YOUR CANVAS IS READY</p>
        <h2>Your library is waiting for its first note.</h2>
        <p>
          Find a song you love, save it, and this dashboard will turn your
          collection into a story.
        </p>
        <button className="button primary" onClick={onDiscover}>
          Discover songs <span>→</span>
        </button>
      </section>
    );
  }

  return (
    <section className="content fade-in">
      <div className="section-title">
        <div>
          <p className="eyebrow">THE BIG PICTURE</p>
          <h2>Your listening landscape.</h2>
        </div>
        <span className="live-dot">Updated live</span>
      </div>
      <div className="metric-grid">
        {cards.map((card) => (
          <article className="metric-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
      <div className="chart-grid">
        <ChartCard
          title="Genres in rotation"
          subtitle="The colours of your collection"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={analytics.genreDistribution}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {analytics.genreDistribution.map((point, index) => (
                    <Cell
                      key={point.label}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                  itemStyle={{ color: "var(--ink)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <LegendLike data={analytics.genreDistribution} />
          </div>
        </ChartCard>
        <ChartCard
          title="Releases through time"
          subtitle="A timeline of the music you keep"
        >
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.releasesByYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--line)",
                  color: "var(--ink)",
                }}
                itemStyle={{ color: "var(--ink)" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ff7959"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ff7959" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Your rating ritual"
          subtitle="How generously you score your favourites"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.ratingsDistribution}>
              <CartesianGrid vertical={false} stroke="var(--line)" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--line)",
                  color: "var(--ink)",
                }}
                itemStyle={{ color: "var(--ink)" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#829cff" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Artists on repeat" subtitle="The voices you return to">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={analytics.topArtists}
              layout="vertical"
              margin={{ left: 18 }}
            >
              <CartesianGrid horizontal={false} stroke="var(--line)" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={92}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--line)",
                  color: "var(--ink)",
                }}
                itemStyle={{ color: "var(--ink)" }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#73b6a2" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Song length"
          subtitle="The length of your tracks"
          wide
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.durationHistogram}>
              <CartesianGrid vertical={false} stroke="var(--line)" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--line)",
                  color: "var(--ink)",
                }}
                itemStyle={{ color: "var(--ink)" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#e5b85e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}
