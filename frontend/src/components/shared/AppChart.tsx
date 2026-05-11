import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceDot,
} from 'recharts';
import { Box, useColorModeValue } from '@chakra-ui/react';

interface AppChartProps {
  data: { time: string; value: number }[];
  color?: string;
  height?: number;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGrid?: boolean;
  yFormatter?: (v: number) => string;
  yDomain?: [number | string, number | string];
  tooltipLabel?: string;
  yAxisSide?: 'left' | 'right';
}

export default function AppChart({
  data, color = '#3b82f6', height = 200,
  showXAxis = true, showYAxis = true, showGrid = true,
  yFormatter, yDomain, tooltipLabel,
  yAxisSide = 'left',
}: AppChartProps) {
  const gridColor = useColorModeValue('#e2e8f0', '#1f2937');
  const axisColor = useColorModeValue('#94a3b8', '#64748b');
  const id = React.useRef(`ag-${Math.random().toString(36).slice(2)}`).current;

  const last = data.length ? data[data.length - 1] : null;

  const marginLeft  = yAxisSide === 'right' ? -20 : (showYAxis ? -8 : -40);
  const marginRight = yAxisSide === 'right' ? (showYAxis ? 44 : 8) : 8;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: marginRight, left: marginLeft, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>

        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 4"
            stroke={gridColor}
            strokeOpacity={0.8}
            vertical={false}
          />
        )}

        {showXAxis
          ? <XAxis dataKey="time"
              tick={{ fill: axisColor, fontSize: 11, fontWeight: 500 }}
              tickLine={false} axisLine={false}
              interval="preserveStartEnd" />
          : <XAxis hide />
        }

        {showYAxis
          ? <YAxis
              orientation={yAxisSide}
              domain={yDomain ?? ['auto', 'auto']}
              tick={{ fill: axisColor, fontSize: 11, fontWeight: 500 }}
              tickLine={false} axisLine={false}
              tickFormatter={yFormatter}
              width={yFormatter ? 44 : 32}
            />
          : <YAxis hide />
        }

        <Tooltip
          content={({ active, payload }: any) => {
            if (!active || !payload?.length) return null;
            const val = payload[0].value as number;
            return (
              <Box bg="rgba(0,0,0,0.88)" border="1px solid #374151" borderRadius="lg"
                px={3} py={2} backdropFilter="blur(8px)">
                <Box fontSize="md" fontWeight="900" color={color}>
                  {yFormatter ? yFormatter(val) : val}
                </Box>
                {tooltipLabel && <Box fontSize="10px" color="#94a3b8">{tooltipLabel}</Box>}
              </Box>
            );
          }}
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
        />

        <Area
          type="monotone" dataKey="value"
          stroke={color} strokeWidth={2}
          fill={`url(#${id})`}
          dot={false}
          activeDot={{ r: 5, fill: color, stroke: 'white', strokeWidth: 2 }}
          isAnimationActive={true}
          animationDuration={600}
        />

        {/* Current price dot at end of line */}
        {last && (
          <ReferenceDot
            x={last.time} y={last.value}
            r={5} fill={color} stroke="white" strokeWidth={2}
            ifOverflow="visible"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
