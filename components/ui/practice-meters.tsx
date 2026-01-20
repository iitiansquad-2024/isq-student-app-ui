"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Target, TrendingUp, Calendar, Zap } from "lucide-react";

interface PracticeMeterProps {
  currentDays?: number;
  goal?: number;
  questionsToday?: number;
}

// Alternative 1: Progress Ring with Stats
export function ProgressRingMeter({ currentDays = 5, goal = 18, questionsToday = 12 }: PracticeMeterProps) {
  const progress = (currentDays / goal) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-6 bg-card rounded-xl p-4 border border-border">
      <div className="relative">
        <svg width="100" height="100" className="transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted stroke-current"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-primary stroke-current"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Flame className="w-5 h-5 text-orange-500 mb-1" />
          <span className="text-xl font-bold text-foreground">{currentDays}</span>
          <span className="text-xs text-muted-foreground">days</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground mb-1">Practice Streak</div>
        <div className="text-xs text-muted-foreground mb-2">{currentDays}/{goal} days this month</div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-blue-500" />
            <span className="text-muted-foreground">Today: {questionsToday} Q</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Alternative 2: Card-based Stats
export function StatsCardMeter({ currentDays = 5, goal = 18, questionsToday = 12 }: PracticeMeterProps) {
  const progress = (currentDays / goal) * 100;

  return (
    <div className="grid grid-cols-3 gap-3">
      <motion.div 
        className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-3 text-center border border-orange-200 dark:border-orange-800"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
        <div className="text-lg font-bold text-foreground">{currentDays}</div>
        <div className="text-xs text-muted-foreground">Day Streak</div>
      </motion.div>
      
      <motion.div 
        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Target className="w-5 h-5 text-blue-500 mx-auto mb-1" />
        <div className="text-lg font-bold text-foreground">{questionsToday}</div>
        <div className="text-xs text-muted-foreground">Today</div>
      </motion.div>
      
      <motion.div 
        className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-800"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
        <div className="text-lg font-bold text-foreground">{Math.round(progress)}%</div>
        <div className="text-xs text-muted-foreground">Progress</div>
      </motion.div>
    </div>
  );
}

// Alternative 3: Minimal Progress Bar
export function MinimalProgressBar({ currentDays = 5, goal = 18, questionsToday = 12 }: PracticeMeterProps) {
  const progress = (currentDays / goal) * 100;

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">Current Day Practice</div>
            <div className="text-xs text-muted-foreground">{questionsToday} questions completed</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-foreground">{currentDays}/{goal}</div>
          <div className="text-xs text-muted-foreground">days this month</div>
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">0</span>
          <span className="text-xs text-muted-foreground">{goal}</span>
        </div>
      </div>
    </div>
  );
}

// Alternative 4: Circular Progress with Calendar
export function CalendarProgressMeter({ currentDays = 5, goal = 18, questionsToday = 12 }: PracticeMeterProps) {
  const progress = (currentDays / goal) * 100;

  return (
    <div className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <Calendar className="w-7 h-7 text-primary-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {currentDays}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-foreground">Practice Progress</span>
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{Math.round(progress)}%</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">{currentDays} days active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-muted-foreground">{questionsToday} questions today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-muted-foreground">{goal - currentDays} days to goal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-muted-foreground">On track</span>
          </div>
        </div>
      </div>
    </div>
  );
}
