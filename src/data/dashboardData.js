export const activityData = {
  chart: [
    { day: "Oct 1", visitors: 4200 },
    { day: "Oct 5", visitors: 5200 },
    { day: "Oct 10", visitors: 4600 },
    { day: "Oct 15", visitors: 6900 },
    { day: "Oct 20", visitors: 6100 },
    { day: "Oct 25", visitors: 7900 },
    { day: "Oct 30", visitors: 7350 },
  ],
  rows: [],
};
const names = [
  "Liam Carter",
  "Sophia Miller",
  "Noah Williams",
  "Emma Davis",
  "Oliver Brown",
  "Ava Wilson",
  "Elijah Moore",
  "Mia Taylor",
  "James Anderson",
  "Isabella Thomas",
  "Lucas Jackson",
  "Amelia White",
];
const activities = [
  "New subscription",
  "Invoice paid",
  "Plan upgraded",
  "Refund issued",
  "New subscription",
  "Invoice paid",
  "Account created",
  "Plan upgraded",
  "Invoice paid",
  "New subscription",
  "Refund issued",
  "Invoice paid",
];
const statuses = [
  "Completed",
  "Completed",
  "Pending",
  "Failed",
  "Completed",
  "Completed",
  "Completed",
  "Pending",
  "Completed",
  "Completed",
  "Failed",
  "Completed",
];
export const rows = names.map((customer, index) => ({
  id: `activity-${index}`,
  customer,
  activity: activities[index],
  type: index % 2 ? "Billing" : "Subscription",
  date: `Oct ${21 - index}, 2024`,
  dateValue: 21 - index,
  amount: [129, 248, 499, 89, 129, 248, 0, 499, 248, 129, 89, 248][index],
  status: statuses[index],
  initials: customer
    .split(" ")
    .map((name) => name[0])
    .join(""),
  avatarTone: ["violet", "peach", "aqua", "yellow"][index % 4],
}));
activityData.rows = rows;
export const categoryData = [
  { name: "SaaS", revenue: 42000 },
  { name: "Services", revenue: 31000 },
  { name: "Ads", revenue: 22000 },
  { name: "Other", revenue: 14000 },
];
export function getDashboardData() {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ activityData, categoryData }), 650),
  );
}
