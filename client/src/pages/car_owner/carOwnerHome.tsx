

import { useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  CarFront,
  CheckCircle2,
  Clock3,
  Gauge,
  Info,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getCarsSurvival, getUserCars, type Vehicle } from "../../slices/carSlice";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Altima from "src/assets/Altima.png";
import Sunny from "src/assets/Sunny.png";
import XTrail from "src/assets/X-Trail.png";
import Patrol from "src/assets/Patrol.png";
import Pathfinder from "src/assets/Pathfinder.png";

const carImages: Record<string, string> = { Altima, Sunny, "X-Trail": XTrail, Patrol, Pathfinder };
type PredictionRecord = Record<string, unknown>;
type RiskLevel = "critical" | "watch" | "healthy";

const sampleCars: Vehicle[] = [
  {
    _id: "sample-critical",
    vehicle_id: "SAMPLE-CRITICAL",
    model: "Altima",
    engine_type: "Gasoline",
    engine_cc: 2500,
    weight_kg: 1580,
    vehicle_class: "Sedan",
    drivetrain: "FWD",
    manufacture_year: 2018,
    avg_daily_km: 42,
  },
  {
    _id: "sample-watch",
    vehicle_id: "SAMPLE-WATCH",
    model: "X-Trail",
    engine_type: "Gasoline",
    engine_cc: 2000,
    weight_kg: 1640,
    vehicle_class: "SUV",
    drivetrain: "AWD",
    manufacture_year: 2020,
    avg_daily_km: 35,
  },
];

const samplePredictions: Record<string, PredictionRecord> = {
  "SAMPLE-CRITICAL": { vehicle_id: "SAMPLE-CRITICAL", survival_days: 180, failure_within_years: 180 / 365 },
  "SAMPLE-WATCH": { vehicle_id: "SAMPLE-WATCH", survival_days: 540, failure_within_years: 540 / 365 },
};

const sampleRiskCounts: Record<Exclude<RiskLevel, "healthy">, number> = {
  critical: 1,
  watch: 1,
};

const formatYears = (years: number) => `${years.toFixed(1)} years`;

const numberFrom = (record: PredictionRecord, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  }
  return undefined;
};

const booleanFrom = (record: PredictionRecord, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
    if (value === 1 || value === "1" || value === "true") return true;
    if (value === 0 || value === "0" || value === "false") return false;
  }
  return undefined;
};

const predictionRecords = (source: unknown): PredictionRecord[] => {
  if (Array.isArray(source)) return source.filter((item): item is PredictionRecord => !!item && typeof item === "object");
  if (!source || typeof source !== "object") return [];
  const root = source as PredictionRecord;
  if (["vehicle_id", "vehicleId", "vid", "id"].some((key) => root[key] !== undefined)) return [root];
  for (const key of ["predictions", "results", "data"]) {
    if (Array.isArray(root[key])) return predictionRecords(root[key]);
  }
  return Object.entries(root).flatMap(([vehicleId, value]) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return [{
        vehicle_id: vehicleId,
        survival_days: value,
        failure_within_years: value / 365,
      }];
    }
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      const survivalDays = Number(value);
      return [{
        vehicle_id: vehicleId,
        survival_days: survivalDays,
        failure_within_years: survivalDays / 365,
      }];
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    const record = value as PredictionRecord;
    return [{ ...record, vehicle_id: record.vehicle_id ?? vehicleId }];
  });
};

const predictionFor = (source: unknown, vehicleId: string) =>
  predictionRecords(source).find((record) => [record.vehicle_id, record.vehicleId, record.vid, record.id].some((value) => String(value) === vehicleId));

const riskFor = (prediction?: PredictionRecord): { level: RiskLevel; years?: number } => {
  if (!prediction) return { level: "healthy" };
  const years = numberFrom(prediction, ["failure_within_years", "expected_failure_years", "predicted_failure_years", "time_to_failure_years", "years_until_failure"]);
  const withinOneYear = booleanFrom(prediction, ["failure_within_1_year", "fails_within_1_year"]);
  const withinTwoYears = booleanFrom(prediction, ["failure_within_2_years", "fails_within_2_years"]);
  if (withinOneYear === true || (years !== undefined && years <= 1)) return { level: "critical", years };
  if (withinTwoYears === true || (years !== undefined && years <= 2)) return { level: "watch", years };
  return { level: "healthy", years };
};

const riskStyles: Record<RiskLevel, { card: string; icon: string; label: string; Icon: typeof AlertTriangle }> = {
  critical: { card: "border-red-200 bg-red-50/70 dark:border-red-950 dark:bg-red-950/20", icon: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", label: "Expected within 1 year", Icon: AlertTriangle },
  watch: { card: "border-yellow-200 bg-yellow-50/70 dark:border-yellow-950 dark:bg-yellow-950/20", icon: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300", label: "Expected within 2 years", Icon: Clock3 },
  healthy: { card: "border-emerald-200 bg-emerald-50/60 dark:border-emerald-950 dark:bg-emerald-950/20", icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", label: "No failure within 2 years", Icon: CheckCircle2 },
};

export default function CarOwnerHome() {
  const dispatch = useAppDispatch();
  const { cars, survival, loading, survivalLoading, error } = useAppSelector((state) => state.car);
  useEffect(() => { void dispatch(getUserCars()); void dispatch(getCarsSurvival()); }, [dispatch]);
  const refresh = () => { void dispatch(getUserCars()); void dispatch(getCarsSurvival()); };
  const criticalCount = cars.filter((car) => riskFor(predictionFor(survival, car.vehicle_id)).level === "critical").length + sampleRiskCounts.critical;
  const watchCount = cars.filter((car) => riskFor(predictionFor(survival, car.vehicle_id)).level === "watch").length + sampleRiskCounts.watch;

  return (
    <TooltipProvider>
      <main className="min-h-full flex-1 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground"><Activity className="size-4 text-primary" /> Fleet health overview</div><h1 className="text-3xl font-semibold tracking-tight">Your vehicle dashboard</h1><p className="mt-2 max-w-2xl text-muted-foreground">A clear view of predicted maintenance risk across your registered cars.</p></div>
          <Button variant="outline" onClick={refresh} disabled={loading || survivalLoading} className="w-fit gap-2"><RefreshCw className={survivalLoading ? "size-4 animate-spin" : "size-4"} /> Refresh predictions</Button>
        </header>
        <section className="grid gap-4 sm:grid-cols-3"><SummaryCard icon={CarFront} label="Registered cars" value={cars.length} tone="text-primary" /><SummaryCard icon={AlertTriangle} label="Needs attention" value={criticalCount} tone="text-red-600" /><SummaryCard icon={ShieldCheck} label="Watch list" value={watchCount} tone="text-yellow-600" /></section>
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/20 dark:text-red-300">{error}</div>}
        {loading ? <LoadingGrid /> : <>
          {cars.length === 0 && <EmptyState />}
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => <VehicleRiskCard key={car.vehicle_id} car={car} prediction={predictionFor(survival, car.vehicle_id)} loading={survivalLoading} />)}
            {sampleCars.map((car) => <VehicleRiskCard key={car.vehicle_id} car={car} prediction={samplePredictions[car.vehicle_id]} loading={false} isSample />)}
          </section>
        </>}
      </div>
      </main>
    </TooltipProvider>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }: { icon: typeof CarFront; label: string; value: number; tone: string }) {
  return <Card><CardContent className="flex items-center gap-4 pt-6"><div className={`rounded-lg bg-muted p-3 ${tone}`}><Icon className="size-5" /></div><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-semibold">{value}</p></div></CardContent></Card>;
}

function VehicleRiskCard({ car, prediction, loading, isSample = false }: { car: Vehicle; prediction?: PredictionRecord; loading: boolean; isSample?: boolean }) {
  const risk = riskFor(prediction); const style = riskStyles[risk.level]; const StatusIcon = style.Icon;
  return <Card className={`overflow-hidden border ${style.card}`}><div className="flex aspect-video items-center justify-center bg-white/70 p-5 dark:bg-black/10"><img src={carImages[car.model] || Altima} alt={`${car.model} vehicle`} className="max-h-full max-w-full object-contain" /></div><CardHeader className="gap-3"><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-xl">{car.model}</CardTitle><CardDescription className="mt-1">{car.vehicle_id} · {car.manufacture_year} · {car.vehicle_class}</CardDescription></div><div className={`rounded-full p-2 ${style.icon}`}><StatusIcon className="size-5" /></div></div><div className="flex items-center gap-2"><Badge variant="outline" className="w-fit gap-1.5 border-current bg-background/60"><StatusIcon className="size-3.5" />{loading ? "Updating prediction..." : style.label}</Badge>{isSample && <Tooltip><TooltipTrigger><Badge variant="secondary" className="cursor-help gap-1"><Info className="size-3" />Sample</Badge></TooltipTrigger><TooltipContent>This is a sample card showing the {risk.level} state.</TooltipContent></Tooltip>}</div></CardHeader><CardContent className="grid grid-cols-2 gap-3 border-t border-current/10 pt-4 text-sm"><div><p className="text-muted-foreground">Engine</p><p className="font-medium">{car.engine_type} · {car.engine_cc} cc</p></div><div><p className="text-muted-foreground">Drivetrain</p><p className="font-medium">{car.drivetrain}</p></div><div className="flex items-center gap-2 text-muted-foreground"><Gauge className="size-4" />{car.avg_daily_km} km/day</div><div className="flex items-center justify-end gap-2 text-muted-foreground"><Clock3 className="size-4" />{risk.years !== undefined ? `~${formatYears(risk.years)}` : "2+ years"}</div></CardContent></Card>;
}

function LoadingGrid() {
  return <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <Card key={item} className="animate-pulse overflow-hidden"><div className="aspect-video bg-muted" /><CardContent className="space-y-3 pt-6"><div className="h-5 w-2/5 rounded bg-muted" /><div className="h-4 w-3/5 rounded bg-muted" /><div className="h-20 rounded bg-muted" /></CardContent></Card>)}</section>;
}

function EmptyState() {
  return <Card className="border-dashed"><CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center"><CarFront className="size-10 text-muted-foreground" /><div><h2 className="font-semibold">No vehicles registered yet</h2><p className="mt-1 text-sm text-muted-foreground">Add a car to start receiving survival predictions.</p></div></CardContent></Card>;
}