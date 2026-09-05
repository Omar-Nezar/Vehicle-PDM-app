import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Boxes,
  CircleDollarSign,
  PackageSearch,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getProjectionsRequest, type PartProjection } from "../../slices/api/inventoryApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const chartColors = ["#0f766e", "#0d9488", "#14b8a6", "#2dd4bf", "#5eead4"];

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);

const formatCurrency = (value: number) =>
  `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)} OMR`;

export default function InventoryHome() {
  const [projections, setProjections] = useState<PartProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProjections(await getProjectionsRequest());
    } catch (requestError) {
      console.error("Failed to load inventory projections:", requestError);
      setError("Unable to load inventory projections.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjections();
  }, [loadProjections]);

  const totalRecommendedStock = projections.reduce((total, item) => total + item.recommended_stock, 0);
  const totalProjectedCost = projections.reduce((total, item) => total + item.projected_cost_omr, 0);
  const highestDemandPart = projections[0]?.part ?? "-";

  return (
    <div className="min-h-full space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <PackageSearch className="size-4 text-primary" />
            Inventory planning
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Parts projection dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Use projected demand and cost to plan the next inventory cycle.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadProjections()} disabled={loading} className="w-fit gap-2">
          <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
          Refresh projections
        </Button>
      </header>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={Boxes} label="Recommended stock" value={formatNumber(totalRecommendedStock)} detail="units across all parts" />
        <SummaryCard icon={CircleDollarSign} label="Projected cost" value={formatCurrency(totalProjectedCost)} detail="total recommended spend" />
        <SummaryCard icon={TrendingUp} label="Highest demand" value={highestDemandPart} detail={projections.length ? `${formatNumber(projections[0].predicted_demand)} projected units` : "Awaiting data"} />
      </section>

      {loading ? <ChartLoadingState /> : projections.length === 0 ? <EmptyState /> : (
        <>
          <section className="grid gap-6 xl:grid-cols-2">
            <ProjectionChartCard
              title="Recommended stock by part"
              description="Suggested units to keep available for each projected part demand."
              dataKey="recommended_stock"
              data={projections}
              color="#0f766e"
              valueFormatter={formatNumber}
            />
            <ProjectionChartCard
              title="Projected cost by part"
              description="Estimated spend for the recommended stock quantity."
              dataKey="projected_cost_omr"
              data={projections}
              color="#d97706"
              valueFormatter={formatCurrency}
            />
          </section>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Full projection details</CardTitle>
                  <CardDescription>{projections.length} parts returned by the projection service.</CardDescription>
                </div>
                <Badge variant="secondary">{projections.length} parts</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/60">
                    <TableRow>
                      <TableHead>Part</TableHead>
                      <TableHead className="text-right">Predicted demand</TableHead>
                      <TableHead className="text-right">Recommended stock</TableHead>
                      <TableHead className="text-right">Unit cost</TableHead>
                      <TableHead className="text-right">Projected cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projections.map((projection) => (
                      <TableRow key={projection.part}>
                        <TableCell className="font-medium whitespace-nowrap">{projection.part}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatNumber(projection.predicted_demand)}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">{formatNumber(projection.recommended_stock)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatCurrency(projection.unit_cost_omr)}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">{formatCurrency(projection.projected_cost_omr)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, detail }: { icon: typeof Boxes; label: string; value: string; detail: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="rounded-lg bg-primary/10 p-3 text-primary"><Icon className="size-5" /></div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="truncate text-2xl font-semibold tabular-nums">{value}</p>
          <p className="truncate text-xs text-muted-foreground">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectionChartCard({
  title,
  description,
  dataKey,
  data,
  color,
  valueFormatter,
}: {
  title: string;
  description: string;
  dataKey: "recommended_stock" | "projected_cost_omr";
  data: PartProjection[];
  color: string;
  valueFormatter: (value: number) => string;
}) {
  const chartHeight = Math.max(560, data.length * 34);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2"><BarChart3 className="size-5 text-primary" /><CardTitle>{title}</CardTitle></div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 8, right: 56, left: 8, bottom: 8 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value: number) => formatNumber(value)} tickLine={false} axisLine={false} />
              <YAxis dataKey="part" type="category" width={118} interval={0} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <RechartsTooltip formatter={(value) => valueFormatter(Number(value))} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]}>
                {data.map((item, index) => <Cell key={item.part} fill={chartColors[index % chartColors.length]} />)}
                <LabelList dataKey={dataKey} position="right" formatter={(value) => valueFormatter(Number(value))} fontSize={10} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartLoadingState() {
  return <section className="grid gap-6 xl:grid-cols-2">{[1, 2].map((item) => <Card key={item} className="animate-pulse"><CardHeader><div className="h-5 w-2/5 rounded bg-muted" /><div className="h-4 w-3/5 rounded bg-muted" /></CardHeader><CardContent><div className="h-125 rounded bg-muted" /></CardContent></Card>)}</section>;
}

function EmptyState() {
  return <Card className="border-dashed"><CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center"><PackageSearch className="size-10 text-muted-foreground" /><div><h2 className="font-semibold">No projections available</h2><p className="mt-1 text-sm text-muted-foreground">The projection service returned no parts.</p></div></CardContent></Card>;
}
