"use client";

import { TrendingUp } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

export function ActivitySection({ insights }: { insights: any }) {
    const dynamicChartData = Array.isArray(insights?.weeklyActivity) 
        ? insights.weeklyActivity.map((item: any) => ({
            day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
            value: item.count
        })) 
        : [
            { day: "Mon", value: 0 },
            { day: "Tue", value: 0 },
            { day: "Wed", value: 0 },
            { day: "Thu", value: 0 },
            { day: "Fri", value: 0 },
            { day: "Sat", value: 0 },
            { day: "Sun", value: 0 },
        ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase font-display flex items-center gap-3">
                <TrendingUp size={20} className="text-primary" /> Weekly Activity Summary
            </h2>
            <div className="brutal-card bg-zinc-900/60 h-72 flex flex-col p-6 rounded-[2rem] border-zinc-800 shadow-xl">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={dynamicChartData}>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 10, fontWeight: '900' }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', padding: '12px' }}
                            itemStyle={{ color: '#FAFAFA', fontWeight: '900', fontSize: '12px' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {dynamicChartData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={index === dynamicChartData.length - 1 ? '#FACC15' : '#27272a'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
