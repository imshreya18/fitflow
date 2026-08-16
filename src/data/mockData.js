// Central mock data. Replace with real API calls when connecting a backend.

export const user = {
  name: 'Prashansa',
  handle: '@prashansa',
  avatar: 'PR',
  goal: 'Improve Fitness',
  fitnessLevel: 'Beginner',
  workoutPreference: '30 minutes',
  weeklyGoalDays: 5,
  completedThisWeek: 4,
  currentStreak: 7,
  longestStreak: 12,
  totalWorkouts: 24,
  totalActiveMinutes: 135, // 2h 15m
  goalProgress: 80,
  interests: ['Yoga', 'Strength', 'HIIT', 'Mobility'],
}

export const todaysWorkout = {
  id: 'w-full-body-flow',
  title: 'Full Body Flow',
  duration: 30,
  level: 'Beginner',
  exerciseCount: 6,
  focus: 'Build consistency',
  minutesDone: 24,
  minutesGoal: 30,
}

export const exercises = [
  { id: 'e1', name: 'Squats', sets: 3, reps: 12, restSeconds: 30, done: true },
  { id: 'e2', name: 'Push-Ups', sets: 3, reps: 10, restSeconds: 30, done: true },
  { id: 'e3', name: 'Lunges', sets: 3, reps: 12, restSeconds: 30, done: false, active: true },
  { id: 'e4', name: 'Plank Hold', sets: 3, reps: 30, unit: 'sec', restSeconds: 20, done: false },
  { id: 'e5', name: 'Glute Bridge', sets: 3, reps: 15, restSeconds: 20, done: false },
  { id: 'e6', name: 'Mountain Climbers', sets: 3, reps: 20, restSeconds: 20, done: false },
]

export const quotes = [
  "You don't need to be perfect. You just need to keep showing up.",
  'Small steps. Stronger you.',
  'Progress, not perfection.',
  "Consistency is what turns effort into habit.",
  'Your only competition is who you were yesterday.',
  'Every rep counts, every day matters.',
]

export const courses = [
  {
    id: 'c1',
    title: '30-Day Beginner Fitness',
    instructor: 'Maya Chen',
    duration: '30 days',
    lessons: 20,
    level: 'Beginner',
    category: 'Recommended',
    rating: 4.8,
    progress: 45,
    color: 'primary',
    tag: 'Full Body',
  },
  {
    id: 'c2',
    title: 'Strength Foundations',
    instructor: 'Owen Marsh',
    duration: '4 weeks',
    lessons: 12,
    level: 'Beginner',
    category: 'Strength',
    rating: 4.9,
    progress: 45,
    color: 'energy',
    tag: 'Strength',
  },
  {
    id: 'c3',
    title: '21-Day Mobility',
    instructor: 'Ines Park',
    duration: '21 days',
    lessons: 21,
    level: 'All Levels',
    category: 'Mobility',
    rating: 4.7,
    progress: 10,
    color: 'accent',
    tag: 'Mobility',
  },
  {
    id: 'c4',
    title: 'Morning Yoga',
    instructor: 'Sana Iyer',
    duration: '14 days',
    lessons: 14,
    level: 'Beginner',
    category: 'Yoga',
    rating: 4.9,
    progress: 0,
    color: 'primary',
    tag: 'Yoga',
  },
  {
    id: 'c5',
    title: 'Home HIIT',
    instructor: 'Owen Marsh',
    duration: '3 weeks',
    lessons: 15,
    level: 'Intermediate',
    category: 'Cardio',
    rating: 4.6,
    progress: 0,
    color: 'energy',
    tag: 'Cardio',
  },
  {
    id: 'c6',
    title: 'Mind & Recovery',
    instructor: 'Sana Iyer',
    duration: '10 days',
    lessons: 10,
    level: 'All Levels',
    category: 'Mind & Recovery',
    rating: 4.8,
    progress: 0,
    color: 'accent',
    tag: 'Recovery',
  },
]

export const courseCategories = [
  'Recommended', 'Beginner', 'Strength', 'Cardio', 'Yoga', 'Mobility', 'Mind & Recovery',
]

export const courseLessons = {
  c1: [
    { id: 'l1', title: 'Introduction', duration: '4 min', done: true },
    { id: 'l2', title: 'Full Body Basics', duration: '18 min', done: true },
    { id: 'l3', title: 'Mobility', duration: '15 min', done: true },
    { id: 'l4', title: 'Lower Body', duration: '20 min', done: false, active: true },
    { id: 'l5', title: 'Core', duration: '16 min', done: false },
    { id: 'l6', title: 'Upper Body', duration: '19 min', done: false },
    { id: 'l7', title: 'Active Recovery', duration: '12 min', done: false },
    { id: 'l8', title: 'Full Body Circuit', duration: '22 min', done: false },
  ],
}

export const interestCategories = [
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'strength', label: 'Strength', emoji: '💪' },
  { id: 'healthy-living', label: 'Healthy Living', emoji: '🥗' },
  { id: 'mindset', label: 'Mindset', emoji: '🧠' },
  { id: 'motivation', label: 'Motivation', emoji: '🔥' },
  { id: 'home-workouts', label: 'Home Workouts', emoji: '🏠' },
  { id: 'walking', label: 'Walking', emoji: '🚶' },
]

export const communityPosts = [
  {
    id: 'p1',
    author: 'Leah T.',
    interest: 'Motivation',
    title: 'The 5-minute morning workout that changed my routine',
    likes: 342,
    comments: 48,
    time: '2h ago',
  },
  {
    id: 'p2',
    author: 'Marcus O.',
    interest: 'Motivation',
    title: 'How I stayed consistent for 30 days straight',
    likes: 218,
    comments: 31,
    time: '5h ago',
  },
  {
    id: 'p3',
    author: 'Aiko S.',
    interest: 'Yoga',
    title: 'A gentle yoga flow that finally fixed my desk-neck',
    likes: 156,
    comments: 19,
    time: '1d ago',
  },
  {
    id: 'p4',
    author: 'Devon R.',
    interest: 'Strength',
    title: 'Why I stopped chasing PRs and started chasing form',
    likes: 274,
    comments: 27,
    time: '1d ago',
  },
]

export const weeklyActivity = [
  { day: 'Mon', minutes: 32, completed: true },
  { day: 'Tue', minutes: 18, completed: true },
  { day: 'Wed', minutes: 0, completed: false },
  { day: 'Thu', minutes: 28, completed: true },
  { day: 'Fri', minutes: 30, completed: true },
  { day: 'Sat', minutes: 0, completed: false },
  { day: 'Sun', minutes: 0, completed: false },
]

export const streakCalendar = [
  // last 35 days, 1 = completed, 0 = missed, null = future
  1,1,0,1,1,1,0, 1,1,1,0,1,1,1, 1,0,1,1,1,1,1, 1,1,1,1,1,1,0, 1,1,1,1,1,1,1,
]

export const milestones = [
  { id: 'm1', title: 'First Workout', done: true },
  { id: 'm2', title: '5 Day Streak', done: true },
  { id: 'm3', title: '10 Workouts', done: true },
  { id: 'm4', title: '7 Day Streak', done: true },
  { id: 'm5', title: '14 Day Streak', done: false },
  { id: 'm6', title: '30 Workouts', done: false },
]

export const goals = [
  {
    id: 'g1',
    title: 'Improve Fitness',
    emoji: '🎯',
    progress: 80,
    target: 5,
    current: 4,
    unit: 'workouts/week',
    primary: true,
  },
  {
    id: 'g2',
    title: 'Build Strength',
    emoji: '💪',
    progress: 40,
    target: 3,
    current: 1,
    unit: 'strength sessions/week',
    primary: false,
  },
  {
    id: 'g3',
    title: 'Sleep Better',
    emoji: '🌙',
    progress: 60,
    target: 8,
    current: 6.5,
    unit: 'hours/night',
    primary: false,
  },
]

export const playlists = [
  { id: 'pl1', title: 'Energy Boost', emoji: '⚡', category: 'High Energy', songs: 12, duration: '32 min' },
  { id: 'pl2', title: 'Deep Focus', emoji: '🎯', category: 'Focus', songs: 15, duration: '48 min' },
  { id: 'pl3', title: 'Wind Down', emoji: '🌙', category: 'Chill', songs: 10, duration: '35 min' },
  { id: 'pl4', title: 'Runner\u2019s Pace', emoji: '🏃', category: 'Running', songs: 18, duration: '52 min' },
  { id: 'pl5', title: 'Iron Mode', emoji: '🏋️', category: 'Strength', songs: 14, duration: '41 min' },
  { id: 'pl6', title: 'Flow State', emoji: '🧘', category: 'Yoga', songs: 9, duration: '30 min' },
]

export const currentSong = {
  title: 'Rise Up',
  artist: 'Nova Ridge',
  playlist: 'Energy Boost',
  duration: 214, // seconds
  elapsed: 76,
}

export const songQueue = [
  { title: 'Rise Up', artist: 'Nova Ridge', duration: '3:34' },
  { title: 'Move Different', artist: 'Kali Sun', duration: '2:58' },
  { title: 'Momentum', artist: 'Echo Park', duration: '3:12' },
  { title: 'Second Wind', artist: 'Vessel', duration: '3:45' },
]

export const aiSuggestedPrompts = [
  'I only have 15 minutes today',
  "I'm feeling tired",
  'Make today\u2019s workout easier',
  'What should I do tomorrow?',
  'Help me stay consistent',
]

export const aiInitialMessages = [
  {
    id: 'm1',
    role: 'assistant',
    text: `Good morning, ${user.name}! I saw you're on a 7-day streak \u2014 amazing consistency. How can I help with today's workout?`,
  },
]

export const notifications = [
  {
    id: 'n1',
    icon: '🔥',
    title: "You're on a 7 day streak!",
    body: 'Keep it going \u2014 one more day to tie your best streak.',
    time: '9:02 AM',
    category: 'Streaks',
    read: false,
  },
  {
    id: 'n2',
    icon: '🏋️',
    title: "Today's workout is waiting for you",
    body: 'Full Body Flow \u00b7 30 min \u00b7 6 exercises',
    time: '8:00 AM',
    category: 'Workouts',
    read: false,
  },
  {
    id: 'n3',
    icon: '🎯',
    title: "You're one workout away from your weekly goal",
    body: '4 of 5 workouts complete this week.',
    time: 'Yesterday',
    category: 'Goals',
    read: true,
  },
  {
    id: 'n4',
    icon: '💬',
    title: 'Someone commented on your post',
    body: 'Leah T. replied to your update in Motivation.',
    time: 'Yesterday',
    category: 'Community',
    read: true,
  },
  {
    id: 'n5',
    icon: '📚',
    title: 'New lesson unlocked',
    body: 'Strength Foundations \u2014 Week 2 is ready.',
    time: '2 days ago',
    category: 'Courses',
    read: true,
  },
]

export const themes = [
  { id: 'default', name: 'Default', description: 'Fresh green + white wellness', swatch: ['#26593B', '#7FCB9E', '#FAFAF8'] },
  { id: 'midnight', name: 'Midnight', description: 'Dark charcoal + green accent', swatch: ['#12160F', '#5FD08A', '#1A2018'] },
  { id: 'ocean', name: 'Ocean', description: 'Soft blue + teal', swatch: ['#14707F', '#7FD1DE', '#F4FAFB'] },
  { id: 'sunset', name: 'Sunset', description: 'Warm orange + coral', swatch: ['#D85A2A', '#F2A65A', '#FFF9F4'] },
  { id: 'lavender', name: 'Lavender', description: 'Purple + soft violet', swatch: ['#6B4FA0', '#B79EDD', '#FAF8FC'] },
]

export const onboardingGoals = [
  { id: 'fitness', label: 'Improve Fitness', emoji: '\u2728' },
  { id: 'strength', label: 'Build Strength', emoji: '\ud83d\udcaa' },
  { id: 'weight', label: 'Manage Weight', emoji: '\u2696\ufe0f' },
  { id: 'flexibility', label: 'Improve Flexibility', emoji: '\ud83e\udd38' },
  { id: 'endurance', label: 'Improve Endurance', emoji: '\ud83c\udfc3' },
  { id: 'routine', label: 'Build a Healthy Routine', emoji: '\ud83d\udcc5' },
]

export const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced']
export const workoutTimes = ['10\u201315 min', '20\u201330 min', '30\u201345 min', '45\u201360 min']
export const weeklyFrequencies = ['2 days', '3 days', '4 days', '5 days', '6+ days']
export const onboardingInterests = [
  'Yoga', 'Running', 'Strength', 'HIIT', 'Dance', 'Mobility', 'Meditation', 'Walking', 'Cycling', 'Home Workouts',
]
