export function filterAndSortActivities(rows, query, status, sort) {
  const normalized = query.trim().toLowerCase();
  return rows
    .filter(
      (row) =>
        (!normalized ||
          `${row.activity} ${row.customer} ${row.type}`
            .toLowerCase()
            .includes(normalized)) &&
        (status === "All status" || row.status === status),
    )
    .sort((a, b) => {
      const left = a[sort.key === "date" ? "dateValue" : sort.key];
      const right = b[sort.key === "date" ? "dateValue" : sort.key];
      const result =
        typeof left === "number"
          ? left - right
          : String(left).localeCompare(String(right));
      return sort.direction === "asc" ? result : -result;
    });
}
