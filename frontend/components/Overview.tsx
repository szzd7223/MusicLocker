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
import { Analytics, Curation } from "../types";
import { COLORS } from "../utils/api";
import { ChartCard } from "./ChartCard";
import { LegendLike } from "./LegendLike";

interface OverviewProps {
  analytics: Analytics | null;
  onDiscover: () => void;
  curation: Curation | null;
  generatingCuration: boolean;
  onGenerateCuration: () => void;
  onQuickSearch: (queryText: string) => void;
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

export function Overview({
  analytics,
  onDiscover,
  curation,
  generatingCuration,
  onGenerateCuration,
  onQuickSearch,
}: OverviewProps) {
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
        {/* Widescreen AI Music Curator Section */}
        <ChartCard
          title="AI Music Curator"
          subtitle="Personalized library breakdown & critiques"
          wide
        >
          {generatingCuration ? (
            <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
              <div style={{ position: "relative", width: "100%", height: "2px", overflow: "hidden", marginBottom: "1.5rem", background: "var(--line)" }}>
                <div className="loading-line" style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />
              </div>
              <p className="mono" style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--ink-muted)" }}>
                Analyzing patterns, drafting critique notes...
              </p>
            </div>
          ) : !curation ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
              <p style={{ margin: "0 0 1.5rem", fontSize: "1.05rem", color: "var(--ink-muted)" }}>
                Let AI analyze your ratings, notes, and genres to uncover your musical archetype.
              </p>
              <button className="button primary" onClick={onGenerateCuration}>
                Ask AI Curator <span>✦</span>
              </button>
            </div>
          ) : (
            <div className="curator-insights fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span className="eyebrow" style={{ letterSpacing: "0.1em" }}>YOUR PERSONA</span>
                  <div style={{
                    display: "inline-block",
                    padding: "0.35rem 0.85rem",
                    borderRadius: "20px",
                    backgroundColor: "rgba(255, 121, 89, 0.12)",
                    color: "var(--primary)",
                    border: "1px solid rgba(255, 121, 89, 0.3)",
                    fontWeight: "bold",
                    fontSize: "0.95rem"
                  }}>
                    {curation.persona}
                  </div>
                </div>
                {curation.isMock && (
                  <span className="mono" style={{
                    fontSize: "0.8rem",
                    backgroundColor: "var(--line)",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "4px",
                    color: "var(--ink-muted)"
                  }}>
                    Showing Demo insights (Set GEMINI_API_KEY for live AI insights)
                  </span>
                )}
                <button className="button ghost small" onClick={onGenerateCuration} style={{ alignSelf: "flex-end" }}>
                  Regenerate ✦
                </button>
              </div>

              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
                <p style={{ fontSize: "1.1rem", fontStyle: "italic", margin: "0 0 0.75rem", color: "var(--ink)" }}>
                  &ldquo;{curation.summary}&rdquo;
                </p>
                <p style={{ fontSize: "0.95rem", margin: 0, color: "var(--primary)", fontWeight: 5 }}>
                  <strong>Curator Critique:</strong> {curation.critique}
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
                <span className="eyebrow" style={{ display: "block", marginBottom: "0.75rem" }}>CURATED RECOMMENDATIONS</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {curation.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        padding: "0.75rem",
                        backgroundColor: "var(--line)",
                        borderRadius: "8px"
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span style={{ fontWeight: 6, fontSize: "0.95rem" }}>{rec.title}</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>by {rec.artist}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)", fontStyle: "italic", marginTop: "0.15rem" }}>
                          &ldquo;{rec.rationale}&rdquo;
                        </span>
                      </div>
                      <button
                        className="text-button"
                        onClick={() => onQuickSearch(`${rec.title} ${rec.artist}`)}
                        style={{ fontSize: "0.85rem", fontWeight: "bold" }}
                      >
                        Search Track →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ChartCard>

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
