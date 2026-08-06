export const exportToCSV = (filename: string, rows: any[]) => {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);

  const csvContent = [
    headers.join(","), // header row
    ...rows.map((row) =>
      headers
        .map((field) => {
          let value = row[field];

          if (value === null || value === undefined) return "";

          // stringify objects (for body)
          if (typeof value === "object") {
            value = JSON.stringify(value);
          }

          // escape quotes
          value = String(value).replace(/"/g, '""');

          return `"${value}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};