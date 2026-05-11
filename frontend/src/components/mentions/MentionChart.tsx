import React, { useState } from 'react';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

interface MentionChartProps {
  chance: number;
  trend?: number;
  seed: number;
}

const RANGES = ['1H', '6H', '1D', '1W', '1M', 'ALL'] as const;
type Range = typeof RANGES[number];

const RANGE_POINTS: Record<Range, number> = {
  '1H': 12, '6H': 36, '1D': 48, '1W': 84, '1M': 120, 'ALL': 200,
};

const RANGE_LABEL: Record<Range, (i: number, n: number) => string> = {
  '1H':  (i, n) => i % 3  === 0 ? `${60 - Math.round((i / n) * 60)}m` : '',
  '6H':  (i, n) => i % 9  === 0 ? `${6  - Math.round((i / n) * 6)}h` : '',
  '1D':  (i, n) => i % 8  === 0 ? `${24 - Math.round((i / n) * 24)}h` : '',
  '1W':  (i, n) => i % 12 === 0 ? `Day ${Math.ceil((i / n) * 7)}` : '',
  '1M':  (i, n) => i % 20 === 0 ? `Apr ${20 + Math.round((i / n) * 10)}` : '',
  'ALL': (i, n) => i % 40 === 0 ? `Apr ${20 + Math.round((i / n) * 12)}` : '',
};

function seededRandom(seed: number, i: number): number {
  const x = Math.sin(seed * 9301 + i * 49297 + 233280) * 43758.5453;
  return x - Math.floor(x);
}

function generateData(chance: number, seed: number, n: number, range: Range) {
  const points: { time: string; value: number }[] = [];
  let current = Math.max(30, chance - 22 - (seed % 8));
  const label = RANGE_LABEL[range];

  for (let i = 0; i <= n; i++) {
    const progress  = i / n;
    const noise     = (seededRandom(seed + 1, i) - 0.5) * (8 - progress * 3);
    const pull      = (chance - current) * 0.12;
    current = Math.max(25, Math.min(98, current + pull + noise));
    points.push({ time: label(i, n), value: +current.toFixed(1) });
  }
  // Force last point to exact chance
  points[points.length - 1].value = chance;
  return points;
}

const CustomTooltip = ({ active, payload, labelColor, mutedColor }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Box bg="rgba(0,0,0,0.85)" border="1px solid #374151" borderRadius="lg"
      px={3} py={2} backdropFilter="blur(8px)">
      <Text fontSize="lg" fontWeight="900" color="#22c55e">{payload[0].value}%</Text>
      <Text fontSize="10px" color="#94a3b8">chance</Text>
    </Box>
  );
};

export default function MentionChart({ chance, trend, seed }: MentionChartProps) {
  const [range, setRange] = useState<Range>('ALL');

  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const mutedColor   = useColorModeValue('#64748b', '#94a3b8');
  const gridColor    = useColorModeValue('#e2e8f0', '#1e293b');
  const axisColor    = useColorModeValue('#94a3b8', '#475569');

  const data    = generateData(chance, seed, RANGE_POINTS[range], range);
  const minVal  = Math.max(20, Math.min(...data.map(d => d.value)) - 5);
  const maxVal  = Math.min(100, Math.max(...data.map(d => d.value)) + 5);

  return (
    <Box>
      {/* Header */}
      <HStack mb={4} justify="space-between" flexWrap="wrap" gap={2}>
        <HStack spacing={2} align="baseline">
          <Text fontSize="2xl" fontWeight="900" color="#22c55e">{chance}% chance</Text>
          {trend !== undefined && (
            <Text fontSize="sm" fontWeight="700" color={trend > 0 ? '#22c55e' : '#ef4444'}>
              {trend > 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`}
            </Text>
          )}
        </HStack>
        {/* Time range selector */}
        <HStack spacing={1} bg={useColorModeValue('gray.100','#0d1219')}
          borderRadius="lg" p={1}>
          {RANGES.map(r => (
            <Box key={r} px={2.5} py={1} borderRadius="md" cursor="pointer"
              bg={range === r ? '#3b82f6' : 'transparent'}
              transition="all .15s"
              onClick={() => setRange(r)}>
              <Text fontSize="11px" fontWeight="700"
                color={range === r ? 'white' : mutedColor}>{r}</Text>
            </Box>
          ))}
        </HStack>
      </HStack>

      {/* Chart */}
      <Box h="200px" mx={-2}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 32, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              strokeOpacity={0.6}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: axisColor, fontSize: 10, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minVal, maxVal]}
              tick={{ fill: axisColor, fontSize: 10, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#chartGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#3b82f6', stroke: 'white', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      {/* Stats row */}
      <HStack mt={4} px={1} spacing={6} flexWrap="wrap">
        {[
          { label: 'Current',  val: `${chance}%`          },
          { label: 'High',     val: `${Math.min(99, chance + 8)}%` },
          { label: 'Low',      val: `${Math.max(10, chance - 15)}%` },
          { label: '24h Vol.', val: `$${(chance * 120).toLocaleString()}` },
        ].map(s => (
          <Box key={s.label}>
            <Text fontSize="10px" color={mutedColor} fontWeight="600" textTransform="uppercase">{s.label}</Text>
            <Text fontSize="sm" fontWeight="800" color={headingColor}>{s.val}</Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );
}
