export const stageData = [
  { id: "S1", code: "S1", name: "施工准备阶段",             start: "2024-01-01", end: "2024-02-29", duration: 60,  status: "已完成", current: false, onScreen: true,  sort: 1 },
  { id: "S2", code: "S2", name: "基坑支护及降水阶段",       start: "2024-03-01", end: "2024-06-30", duration: 122, status: "已完成", current: false, onScreen: true,  sort: 2 },
  { id: "S3", code: "S3", name: "坑内地下结构物施工阶段",   start: "2024-07-01", end: "2025-03-31", duration: 274, status: "进行中", current: true,  onScreen: true,  sort: 3 },
  { id: "S4", code: "S4", name: "地上结构及设备安装阶段",   start: "2025-04-01", end: "2025-12-31", duration: 275, status: "未开始", current: false, onScreen: true,  sort: 4 },
];

export const progressChartData = [
  { month: "10月", planned: 10,  actual: 8    },
  { month: "11月", planned: 22,  actual: 18   },
  { month: "12月", planned: 35,  actual: 30   },
  { month: "1月",  planned: 48,  actual: 42   },
  { month: "2月",  planned: 60,  actual: 53   },
  { month: "3月",  planned: 72,  actual: 65   },
  { month: "4月",  planned: 82,  actual: null },
  { month: "5月",  planned: 90,  actual: null },
  { month: "6月",  planned: 100, actual: null },
];
