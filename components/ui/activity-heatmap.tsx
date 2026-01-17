"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActivityData {
  date: string;
  count: number;
  level: number;
}

export default function ActivityHeatmap() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const heatmapData = useMemo(() => {
    const data: ActivityData[] = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    // Use seeded random for consistent generation
    let seed = selectedYear;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const count = Math.floor(seededRandom() * 25);
      const level = count === 0 ? 0 : count <= 3 ? 1 : count <= 8 ? 2 : count <= 15 ? 3 : 4;
      
      data.push({
        date: d.toISOString().split('T')[0],
        count,
        level
      });
    }
    return data;
  }, [selectedYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const getIntensityColor = (level: number): string => {
    const colors = [
      'bg-gray-100 border-gray-200',
      'bg-green-100 border-green-200',
      'bg-green-300 border-green-400',
      'bg-green-500 border-green-600',
      'bg-green-700 border-green-800'
    ];
    return colors[level] || colors[0];
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWeeksInYear = (): ActivityData[][] => {
    const weeks: ActivityData[][] = [];
    let currentWeek: ActivityData[] = [];
    
    heatmapData.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();
      
      if (index === 0) {
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: '', count: 0, level: 0 });
        }
      }
      
      currentWeek.push(day);
      
      if (dayOfWeek === 6 || index === heatmapData.length - 1) {
        while (currentWeek.length < 7) {
          currentWeek.push({ date: '', count: 0, level: 0 });
        }
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  };

  const weeks = getWeeksInYear();
  const totalQuestions = heatmapData.reduce((sum, day) => sum + day.count, 0);
  const activeDays = heatmapData.filter(day => day.count > 0).length;
  
  const getCurrentStreak = (): number => {
    let streak = 0;
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].count > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getLongestStreak = (): number => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    heatmapData.forEach(day => {
      if (day.count > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  };

  const currentStreak = getCurrentStreak();
  const longestStreak = getLongestStreak();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>Activity Heatmap</span>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <select 
              value={selectedYear} 
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="px-3 py-1 border rounded-md text-sm"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Badge variant="outline" className="text-sm">
              {totalQuestions} questions in {selectedYear}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Your daily question-solving activity for {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activeDays}</div>
            <div className="text-sm text-muted-foreground">Active Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{longestStreak}</div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm border ${getIntensityColor(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
          
          <div className="w-full overflow-x-auto">
            <div className="flex flex-col space-y-1 min-w-max">
              {/* Month labels */}
              <div className="flex space-x-0.5 mb-2">
                {weeks.map((week, weekIndex) => {
                  const firstDay = week.find(day => day.date);
                  if (!firstDay) return <div key={weekIndex} className="w-2" />;
                  
                  const date = new Date(firstDay.date);
                  const isFirstWeekOfMonth = date.getDate() <= 7;
                  
                  if (isFirstWeekOfMonth || weekIndex === 0) {
                    const month = date.toLocaleDateString('en-US', { month: 'short' });
                    return (
                      <div key={weekIndex} className="text-xs text-muted-foreground w-8 text-center">
                        {month}
                      </div>
                    );
                  }
                  
                  return <div key={weekIndex} className="w-2" />;
                })}
              </div>
              
              {/* Heatmap grid */}
              <div className="flex">
                <div className="flex space-x-0.5">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col space-y-0.5">
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm border cursor-pointer hover:ring-1 hover:ring-gray-300 ${
                            day.date ? getIntensityColor(day.level) : 'bg-transparent border-transparent'
                          }`}
                          title={day.date ? `${day.count} questions on ${formatDate(day.date)}` : ''}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
