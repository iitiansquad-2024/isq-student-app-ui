export type Member = {
  id: string;
  name: string;
  joined: string;
  streakDays: number;
  goal?: number;
  avatarUrl?: string | null;
  xp: number;
};

export const sampleMembers: Member[] = [
  {
    id: "1",
    name: "Aisha Khan",
    joined: "2024-06-12",
    streakDays: 14,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
  {
    id: "2",
    name: "Ravi Patel",
    joined: "2025-01-03",
    streakDays: 9,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
  {
    id: "3",
    name: "Maya Rao",
    joined: "2023-11-20",
    streakDays: 21,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
  {
    id: "4",
    name: "Arjun Mehta",
    joined: "2024-02-01",
    streakDays: 3,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
  {
    id: "5",
    name: "Neha Singh",
    joined: "2024-09-10",
    streakDays: 27,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
  {
    id: "6",
    name: "Ishan Verma",
    joined: "2023-05-05",
    streakDays: 18,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
];

export default sampleMembers;
