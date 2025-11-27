import { useEffect, useState } from 'react';
import { analyticsApi } from '@/services/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    ScatterChart, Scatter, Legend
} from 'recharts';
import { Brain, TrendingUp, GitCompare, Activity, RefreshCw, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('factors');
  const [featureImportance, setFeatureImportance] = useState<any[]>([]);
  const [correlations, setCorrelations] = useState<any>(null);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  
  // Simulation State
  const [simFactor, setSimFactor] = useState([1.10]); // 10% improvement
  const [simTarget, setSimTarget] = useState('asistencia_promedio');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
        try {
            const [features, corr] = await Promise.all([
                analyticsApi.getFeatureImportance(),
                analyticsApi.getCorrelations()
            ]);
            
            // Format features for chart
            const formattedFeatures = Object.entries(features).map(([name, value]) => ({
                name: formatFeatureName(name),
                impact: (value as number * 100).toFixed(1),
                raw: value
            }));
            setFeatureImportance(formattedFeatures);
            setCorrelations(corr);
        } catch (error) {
            console.error("Analytics load error:", error);
        }
    };
    loadData();
  }, []);

  const runSim = async () => {
      setIsSimulating(true);
      try {
          const res = await analyticsApi.runSimulation(simFactor[0], simTarget);
          setSimulationResult(res);
      } catch (error) {
          console.error("Simulation error:", error);
      } finally {
          setIsSimulating(false);
      }
  };

  const formatFeatureName = (name: string) => {
      const map: Record<string, string> = {
          'notas_promedio': 'Promedio Acad.',
          'asistencia_promedio': 'Asistencia',
          'cursos_reprobados': 'Reprobados',
          'interacciones_plataforma_total': 'Engagement',
          'xp_gamificacion': 'Gamificación',
          'tiempo_sesion_promedio_min': 'Tiempo Sesión'
      };
      return map[name] || name;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Inteligencia Institucional</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
                Análisis estratégico y modelos predictivos para la toma de decisiones.
            </p>
        </div>
      </div>

      <Tabs defaultValue="factors" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="factors" className="gap-2"><Brain className="h-4 w-4"/> Factores de Riesgo</TabsTrigger>
          <TabsTrigger value="correlations" className="gap-2"><GitCompare className="h-4 w-4"/> Correlaciones</TabsTrigger>
          <TabsTrigger value="simulation" className="gap-2"><TrendingUp className="h-4 w-4"/> Laboratorio Predictivo</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: RISK FACTORS --- */}
        <TabsContent value="factors" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Drivers del Modelo Predictivo</CardTitle>
                        <CardDescription>
                            ¿Qué variables tienen mayor peso en la predicción de deserción?
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={featureImportance} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" unit="%" />
                                    <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="impact" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Insights de IA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg">
                                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Hallazgo Clave</h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                    El <strong>Promedio Académico</strong> es el predictor #1, pero la <strong>Asistencia</strong> tiene un impacto oculto significativo en las primeras 4 semanas.
                                </p>
                            </div>
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-lg">
                                <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Alerta Temprana</h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                    Los estudiantes con <strong>0 interacción</strong> en la primera semana tienen 3x más probabilidad de riesgo alto.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* --- TAB 2: CORRELATIONS --- */}
        <TabsContent value="correlations" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Análisis de Distribución: Notas vs. Asistencia</CardTitle>
                    <CardDescription>Visualización de clusters de comportamiento estudiantil.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        {correlations ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid />
                                    <XAxis type="number" dataKey="asistencia_promedio" name="Asistencia" unit="" domain={[0, 1]} tickFormatter={(v) => `${v*100}%`} />
                                    <YAxis type="number" dataKey="notas_promedio" name="Promedio" unit="" domain={[0, 20]} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Legend />
                                    <Scatter name="Estudiantes" data={correlations.scatter_data} fill="#8884d8" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Activity className="animate-spin h-8 w-8 text-zinc-300" />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- TAB 3: SIMULATION --- */}
        <TabsContent value="simulation" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Configurar Simulación</CardTitle>
                        <CardDescription>Ajusta variables globales para proyectar impacto.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Variable a Optimizar</label>
                            <Select value={simTarget} onValueChange={setSimTarget}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asistencia_promedio">Asistencia Global</SelectItem>
                                    <SelectItem value="notas_promedio">Promedio Académico</SelectItem>
                                    <SelectItem value="interacciones_plataforma_total">Engagement (Plataforma)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">Factor de Mejora</label>
                                <span className="text-sm text-indigo-600 font-bold">{((simFactor[0] - 1) * 100).toFixed(0)}%</span>
                            </div>
                            <Slider 
                                value={simFactor} 
                                onValueChange={setSimFactor} 
                                min={1.0} 
                                max={1.5} 
                                step={0.05} 
                            />
                            <p className="text-xs text-zinc-500">
                                Simular un aumento del {((simFactor[0] - 1) * 100).toFixed(0)}% en {formatFeatureName(simTarget)}.
                            </p>
                        </div>

                        <Button className="w-full" onClick={runSim} disabled={isSimulating}>
                            {isSimulating ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <TrendingUp className="mr-2 h-4 w-4" />
                            )}
                            Ejecutar Simulación
                        </Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 bg-zinc-50/50 dark:bg-zinc-900/20 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6">
                        {!simulationResult ? (
                            <div className="text-center space-y-3">
                                <div className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-sm inline-block">
                                    <Brain className="h-8 w-8 text-zinc-400" />
                                </div>
                                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Resultados de Proyección</h3>
                                <p className="text-zinc-500 max-w-xs mx-auto">
                                    Configura los parámetros a la izquierda y ejecuta la simulación para ver el impacto en el riesgo de deserción.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full space-y-8 animate-in fade-in zoom-in duration-300">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                                        <div className="text-sm text-zinc-500 mb-1">Riesgo Base</div>
                                        <div className="text-2xl font-bold text-zinc-700 dark:text-zinc-300">
                                            {(simulationResult.baseline_risk * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border-2 border-indigo-100 dark:border-indigo-900">
                                        <div className="text-sm text-indigo-600 mb-1 font-medium">Riesgo Simulado</div>
                                        <div className="text-3xl font-bold text-indigo-600">
                                            {(simulationResult.simulated_risk * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800">
                                        <div className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">Mejora Neta</div>
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                                            <TrendingUp className="h-5 w-5" />
                                            {simulationResult.improvement_percent}%
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Users className="h-4 w-4 text-zinc-500" />
                                        Impacto Humano Estimado
                                    </h4>
                                    <p className="text-zinc-600 dark:text-zinc-300 mb-2">
                                        Esta mejora podría prevenir aproximadamente <span className="font-bold text-indigo-600 text-lg">{simulationResult.students_saved_projection}</span> deserciones este semestre si se aplica a toda la población estudiantil.
                                    </p>
                                    {simulationResult.insight && (
                                        <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500 italic">
                                            <span className="font-semibold not-italic mr-1">Insight:</span>
                                            {simulationResult.insight}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
