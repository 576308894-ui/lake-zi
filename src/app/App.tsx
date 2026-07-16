import { useState, useCallback, useMemo } from "react";
import {
  Layers, Wrench, Activity, Shield, Users, Cpu, Bell, MessageSquare,
  Code2, Settings, ChevronRight, LogOut, Search, Plus, Download, Upload, RefreshCw,
  AlertTriangle, CheckCircle, Clock, XCircle, Filter, Edit2, Trash2, X,
  ChevronDown, Building2, Gauge, Droplets, Zap, MonitorCheck,
  BarChart3, MapPin, Calendar, FileText, Info, Eye,
  LogIn, Smartphone, Timer, Save, QrCode, RotateCcw, Link2, HelpCircle,
  Image as ImageIcon
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";
import {
  StatusTag, StatCard, FilterBar, FItem, Inp, Sel, Btn,
  TableCard, DTable, Pager, Actions, PlaceholderPage,
  Modal, FormGrid, FF, FI, FS, FTA, FSec, DetailRow, ModalFooter, Drawer, CustomStatusTag, ProgressBar, MultiSelect,
  PrototypeNoteTag, PrototypeNote,
} from "./components/ui";
import { AttendancePage } from "./components/pages/AttendancePage";
import { AttendanceRulesPage } from "./components/pages/AttendanceRulesPage";

import { DeviceInspectionPage } from "./components/pages/DeviceInspectionPage";
import { DeviceMaintenancePage } from "./components/pages/DeviceMaintenancePage";
import { safetyBlacklistData, extraBlacklistItems } from "./components/pages/blacklistShared";
import { WbsTree } from "./components/WbsTree";

// ─── DATA ────────────────────────────────────────────────────────────────────
const wbsData = {
  name: "淄海铁路项目",
  children: [
    { name: "翻车机房", children: [
      { name: "地下部分", children: [
        { name: "地基与基础", children: [
          { name: "基坑垫层施工", children: [{ name: "垫层一区" }, { name: "垫层二区" }, { name: "垫层三区" }] },
          { name: "底板施工", children: [{ name: "底板一区" }, { name: "底板二区" }, { name: "底板三区" }] },
          { name: "承台施工", children: [{ name: "承台一区" }, { name: "承台二区" }, { name: "承台三区" }] },
          { name: "设备基础施工", children: [{ name: "设备基础一区" }, { name: "设备基础二区" }] },
          { name: "集水坑施工", children: [{ name: "集水坑一区" }, { name: "集水坑二区" }] },
        ]},
        { name: "地下主体结构", children: [
          { name: "侧墙施工", children: [{ name: "东侧墙" }, { name: "西侧墙" }, { name: "南侧墙" }, { name: "北侧墙" }] },
          { name: "顶板施工", children: [{ name: "顶板一区" }, { name: "顶板二区" }, { name: "顶板三区" }] },
          { name: "梁柱施工", children: [{ name: "地下柱" }, { name: "地下梁" }, { name: "支撑梁" }] },
          { name: "防水及回填施工", children: [{ name: "外墙防水" }, { name: "顶板防水" }, { name: "基坑回填" }] },
        ]},
      ]},
      { name: "地上部分", children: [
        { name: "地上主体结构", children: [
          { name: "框架柱施工", children: [{ name: "框架柱一区" }, { name: "框架柱二区" }] },
          { name: "框架梁施工", children: [{ name: "框架梁一区" }, { name: "框架梁二区" }] },
          { name: "楼板施工", children: [{ name: "楼板一区" }, { name: "楼板二区" }] },
        ]},
      ]},
      { name: "钢结构顶棚", children: [
        { name: "钢柱安装", children: [{ name: "钢柱一区" }, { name: "钢柱二区" }, { name: "钢柱三区" }] },
        { name: "钢梁安装", children: [{ name: "主梁一区" }, { name: "主梁二区" }] },
      ]},
    ]},
    { name: "地下皮带廊", children: [
      { name: "廊道基础工程", children: [
        { name: "廊道土方开挖", children: [{ name: "起点段开挖" }, { name: "中段开挖" }, { name: "终点段开挖" }] },
      ]},
      { name: "廊道主体结构", children: [
        { name: "廊道侧墙施工", children: [{ name: "左侧墙起点段" }, { name: "左侧墙中段" }] },
        { name: "廊道顶板施工", children: [{ name: "起点段顶板" }, { name: "中段顶板" }, { name: "终点段顶板" }] },
      ]},
    ]},
    { name: "基坑支护及降水工程", children: [
      { name: "基坑工程", children: [
        { name: "基坑开挖", children: [{ name: "基坑东侧开挖" }, { name: "基坑西侧开挖" }, { name: "基坑南侧开挖" }, { name: "基坑北侧开挖" }] },
        { name: "基坑临边防护", children: [{ name: "临边护栏" }, { name: "警示标识" }, { name: "安全通道" }] },
      ]},
      { name: "支护工程", children: [
        { name: "支护桩施工", children: [{ name: "东侧支护桩" }, { name: "西侧支护桩" }, { name: "南侧支护桩" }] },
        { name: "冠梁施工", children: [{ name: "东侧冠梁" }, { name: "西侧冠梁" }] },
      ]},
    ]},
    { name: "监测工程", children: [
      { name: "水位监测", children: [{ name: "水位传感器安装" }, { name: "DTU数据采集" }, { name: "采集箱安装" }, { name: "数据联调" }] },
      { name: "沉降监测", children: [{ name: "沉降点布设" }, { name: "沉降数据采集" }] },
      { name: "位移监测", children: [{ name: "位移点布设" }, { name: "位移数据采集" }] },
    ]},
    { name: "临设及现场辅助工程", children: [
      { name: "临时道路", children: [{ name: "场内主道路" }, { name: "施工便道" }] },
      { name: "加工及堆场", children: [{ name: "钢筋加工区" }, { name: "材料堆放区" }] },
      { name: "出入口及围挡", children: [{ name: "车辆出入口" }, { name: "人员出入口" }, { name: "围挡" }] },
    ]},
  ],
};

const stageData = [
  { id: "S1", code: "S1", name: "施工准备阶段", start: "2024-01-01", end: "2024-02-29", duration: 60, status: "已完成", current: false, onScreen: true, sort: 1 },
  { id: "S2", code: "S2", name: "基坑支护及降水阶段", start: "2024-03-01", end: "2024-06-30", duration: 122, status: "已完成", current: false, onScreen: true, sort: 2 },
  { id: "S3", code: "S3", name: "坑内地下结构物施工阶段", start: "2024-07-01", end: "2025-03-31", duration: 274, status: "进行中", current: true, onScreen: true, sort: 3 },
  { id: "S4", code: "S4", name: "地上结构及设备安装阶段", start: "2025-04-01", end: "2025-12-31", duration: 275, status: "未开始", current: false, onScreen: true, sort: 4 },
];

const workpointData = [
  { id: "WP01", code: "WP01", name: "翻车机房基坑", stages: ["S1","S2"], status: "施工中", enabled: true, bigscreen: true, sort: 1, bimCount: 42 },
  { id: "WP02", code: "WP02", name: "地下皮带廊基坑", stages: ["S1","S2"], status: "施工中", enabled: true, bigscreen: true, sort: 2, bimCount: 28 },
  { id: "WP03", code: "WP03", name: "翻车机房地下结构", stages: ["S2"], status: "施工中", enabled: true, bigscreen: true, sort: 3, bimCount: 67 },
  { id: "WP04", code: "WP04", name: "东侧支护结构", stages: ["S1"], status: "已完成", enabled: true, bigscreen: false, sort: 4, bimCount: 14 },
  { id: "WP05", code: "WP05", name: "地下皮带廊主体结构", stages: ["S2"], status: "未开始", enabled: true, bigscreen: true, sort: 5, bimCount: 31 },
  { id: "WP06", code: "WP06", name: "翻车机房地上结构", stages: ["S3"], status: "未开始", enabled: true, bigscreen: true, sort: 6, bimCount: 0 },
  { id: "WP07", code: "WP07", name: "钢结构顶棚区域", stages: ["S4"], status: "未开始", enabled: false, bigscreen: false, sort: 7, bimCount: 0 },
  { id: "WP08", code: "WP08", name: "施工主通道", stages: ["S1","S2"], status: "施工中", enabled: true, bigscreen: false, sort: 8, bimCount: 0 },
  { id: "WP09", code: "WP09", name: "钢筋加工区", stages: ["S1","S2","S3"], status: "施工中", enabled: true, bigscreen: false, sort: 9, bimCount: 0 },
  { id: "WP10", code: "WP10", name: "材料堆放区", stages: ["S1","S2"], status: "施工中", enabled: true, bigscreen: false, sort: 10, bimCount: 0 },
];

const stageWarningData = [
  { id: "SW001", code: "EW-STAGE-001", stageName: "基坑支护及降水阶段", planStart: "2026-04-01", planEnd: "2026-05-15", status: "施工中", warnType: "临期未完成", level: "较大", timeInfo: "剩余3天", owner: "张三", handleStatus: "未处理", warnTime: "2026-05-12 08:00", reason: "距离计划完成时间仅剩3天，当前进度未达预期", warnEnabled: true, bigscreen: true },
  { id: "SW002", code: "EW-STAGE-002", stageName: "坑内地下结构物施工阶段", planStart: "2026-05-16", planEnd: "2026-08-30", status: "未开始", warnType: "未按期开工", level: "一般", timeInfo: "逾期2天", owner: "李四", handleStatus: "处理中", warnTime: "2026-05-18 09:30", reason: "计划开工日期已过，尚未开工", warnEnabled: false, bigscreen: false },
];

const wbsTreeData = [
  { id: "project-1", name: "淄海铁路项目", type: "project", planStart: "2026-01-01", planEnd: "2026-12-31", bimCount: 0, children: [
    { id: "unit-1", name: "翻车机房", type: "unit", planStart: "2026-02-01", planEnd: "2026-10-31", bimCount: 15, children: [
      { id: "dept-1-1", name: "地基与基础", type: "dept", planStart: "2026-02-15", planEnd: "2026-06-30", bimCount: 8, children: [
        { id: "item-1-1-1", name: "基础底板施工", type: "item", planStart: "2026-04-10", planEnd: "2026-05-20", bimCount: 3, warnId: "WW001", children: [
          { id: "comp-1-1-1-1", name: "底板钢筋构件", type: "comp", compId: "COMP001", hasComp: true },
          { id: "comp-1-1-1-2", name: "底板混凝土构件", type: "comp", compId: "COMP002", hasComp: true },
          { id: "comp-1-1-1-3", name: "底板模板构件", type: "comp", compId: "COMP003", hasComp: true },
          { id: "comp-1-1-1-4", name: "底板支撑构件", type: "comp", compId: "COMP004", hasComp: false },
        ]},
        { id: "item-1-1-2", name: "基坑支护施工", type: "item", planStart: "2026-02-15", planEnd: "2026-04-30", bimCount: 5, children: [
          { id: "comp-1-1-2-1", name: "支护桩构件", type: "comp", compId: "COMP005", hasComp: true },
          { id: "comp-1-1-2-2", name: "护坡钢筋构件", type: "comp", compId: "COMP006", hasComp: true },
          { id: "comp-1-1-2-3", name: "锚索构件", type: "comp", compId: "COMP007", hasComp: false },
        ]},
        { id: "item-1-1-3", name: "降水施工", type: "item", planStart: "2026-03-15", planEnd: "2026-04-30", bimCount: 0, warnId: "WW003", children: [] },
      ]},
      { id: "dept-1-2", name: "地下主体结构", type: "dept", planStart: "2026-05-01", planEnd: "2026-09-30", bimCount: 12, children: [
        { id: "item-1-2-1", name: "地下侧墙施工", type: "item", planStart: "2026-05-01", planEnd: "2026-06-15", bimCount: 4, warnId: "WW002", children: [
          { id: "comp-1-2-1-1", name: "侧墙钢筋构件", type: "comp", compId: "COMP008", hasComp: false },
          { id: "comp-1-2-1-2", name: "侧墙模板构件", type: "comp", compId: "COMP009", hasComp: true },
          { id: "comp-1-2-1-3", name: "侧墙混凝土构件", type: "comp", compId: "COMP010", hasComp: true },
          { id: "comp-1-2-1-4", name: "穿墙套管构件", type: "comp", compId: "COMP011", hasComp: false },
        ]},
        { id: "item-1-2-2", name: "顶板施工", type: "item", planStart: "2026-06-01", planEnd: "2026-07-20", bimCount: 2, warnId: "WW004", children: [
          { id: "comp-1-2-2-1", name: "顶板钢筋构件", type: "comp", compId: "COMP012", hasComp: true },
          { id: "comp-1-2-2-2", name: "顶板模板构件", type: "comp", compId: "COMP013", hasComp: true },
        ]},
      ]},
      { id: "dept-1-3", name: "地上结构", type: "dept", planStart: "2026-08-01", planEnd: "2026-10-31", bimCount: 6, children: [
        { id: "item-1-3-1", name: "框架柱施工", type: "item", planStart: "2026-08-01", planEnd: "2026-09-15", bimCount: 3, children: [
          { id: "comp-1-3-1-1", name: "柱钢筋构件", type: "comp", compId: "COMP014", hasComp: true },
          { id: "comp-1-3-1-2", name: "柱模板构件", type: "comp", compId: "COMP015", hasComp: true },
        ]},
        { id: "item-1-3-2", name: "框架梁施工", type: "item", planStart: "2026-08-15", planEnd: "2026-09-30", bimCount: 3, children: [
          { id: "comp-1-3-2-1", name: "梁钢筋构件", type: "comp", compId: "COMP016", hasComp: true },
          { id: "comp-1-3-2-2", name: "梁模板构件", type: "comp", compId: "COMP017", hasComp: true },
        ]},
      ]},
    ]},
    { id: "unit-2", name: "地下皮带廊", type: "unit", planStart: "2026-03-01", planEnd: "2026-11-30", bimCount: 10, children: [
      { id: "dept-2-1", name: "地基与基础", type: "dept", planStart: "2026-03-15", planEnd: "2026-06-30", bimCount: 4, children: [
        { id: "item-2-1-1", name: "基础施工", type: "item", planStart: "2026-04-01", planEnd: "2026-05-15", bimCount: 2, warnId: "WW005", children: [
          { id: "comp-2-1-1-1", name: "基础垫层构件", type: "comp", compId: "COMP018", hasComp: true },
          { id: "comp-2-1-1-2", name: "基础钢筋构件", type: "comp", compId: "COMP019", hasComp: true },
        ]},
      ]},
      { id: "dept-2-2", name: "主体结构", type: "dept", planStart: "2026-06-01", planEnd: "2026-11-30", bimCount: 8, children: [
        { id: "item-2-2-1", name: "廊道主体施工", type: "item", planStart: "2026-05-10", planEnd: "2026-06-20", bimCount: 5, warnId: "WW006", children: [
          { id: "comp-2-2-1-1", name: "廊道侧墙构件", type: "comp", compId: "COMP020", hasComp: true },
          { id: "comp-2-2-1-2", name: "廊道顶板构件", type: "comp", compId: "COMP021", hasComp: true },
          { id: "comp-2-2-1-3", name: "廊道底板构件", type: "comp", compId: "COMP022", hasComp: false },
        ]},
      ]},
    ]},
  ]},
];

const wbsWarningData = [
  { id: "WW001", code: "EW-WBS-001", target: "基础底板施工", nodeType: "分项工程", unit: "翻车机房", dept: "地基与基础", item: "基础工程", relativePath: "地基与基础 / 基础工程", planStart: "2026-04-10", planEnd: "2026-05-20", progress: 62, completedCount: 26, totalCount: 42, status: "进行中", warnType: "临期未完成", level: "较大", timeInfo: "剩余3天", owner: "王五", handleStatus: "未处理", warnTime: "2026-05-17 10:00", reason: "当前日期距离计划完成时间仅剩3天，基础底板施工实际进度为62%，尚未完成，因此生成\"临期未完成\"预警。", warnEnabled: true, bigscreen: true },
  { id: "WW002", code: "EW-WBS-002", target: "地下侧墙施工", nodeType: "分项工程", unit: "翻车机房", dept: "地下主体结构", item: "侧墙工程", relativePath: "地下主体结构 / 侧墙工程", planStart: "2026-05-01", planEnd: "2026-06-15", progress: 85, completedCount: 34, totalCount: 40, status: "进行中", warnType: "临期未完成", level: "一般", timeInfo: "剩余2天", owner: "赵六", handleStatus: "未处理", warnTime: "2026-06-13 14:00", reason: "当前日期距离计划完成时间仅剩2天，地下侧墙施工实际进度为85%，尚未完成，因此生成\"临期未完成\"预警。", warnEnabled: true, bigscreen: false },
  { id: "WW003", code: "EW-WBS-003", target: "降水施工", nodeType: "分项工程", unit: "翻车机房", dept: "地基与基础", item: "降水工程", relativePath: "地基与基础 / 降水工程", planStart: "2026-03-15", planEnd: "2026-04-30", progress: 90, completedCount: 18, totalCount: 20, status: "进行中", warnType: "已延期", level: "重大", timeInfo: "逾期5天", owner: "张三", handleStatus: "处理中", warnTime: "2026-05-05 08:30", reason: "当前日期已超过计划完成日期5天，降水施工实际进度为90%，尚未完成，因此生成\"已延期\"预警。", warnEnabled: false, bigscreen: true },
  { id: "WW004", code: "EW-WBS-004", target: "顶板施工", nodeType: "分项工程", unit: "翻车机房", dept: "地下主体结构", item: "顶板工程", relativePath: "地下主体结构 / 顶板工程", planStart: "2026-06-01", planEnd: "2026-07-20", progress: 0, completedCount: 0, totalCount: 28, status: "未开始", warnType: "未按期开工", level: "一般", timeInfo: "逾期2天", owner: "李四", handleStatus: "未处理", warnTime: "2026-06-03 09:00", reason: "当前日期已超过计划开始日期2天，顶板施工当前状态为未开始，因此生成\"未按期开工\"预警。", warnEnabled: true, bigscreen: true },
  { id: "WW005", code: "EW-WBS-005", target: "基础施工", nodeType: "分项工程", unit: "地下皮带廊", dept: "地基与基础", item: "基础工程", relativePath: "地基与基础 / 基础工程", planStart: "2026-04-01", planEnd: "2026-05-15", progress: 45, completedCount: 9, totalCount: 20, status: "进行中", warnType: "临期未完成", level: "较大", timeInfo: "剩余1天", owner: "孙七", handleStatus: "未处理", warnTime: "2026-05-14 10:00", reason: "当前日期距离计划完成时间仅剩1天，基础施工实际进度为45%，尚未完成，因此生成\"临期未完成\"预警。", warnEnabled: false, bigscreen: false },
  { id: "WW006", code: "EW-WBS-006", target: "廊道主体施工", nodeType: "分项工程", unit: "地下皮带廊", dept: "主体结构", item: "廊道工程", relativePath: "主体结构 / 廊道工程", planStart: "2026-05-10", planEnd: "2026-06-20", progress: 30, completedCount: 6, totalCount: 20, status: "进行中", warnType: "已延期", level: "重大", timeInfo: "逾期8天", owner: "周八", handleStatus: "处理中", warnTime: "2026-06-28 08:00", reason: "当前日期已超过计划完成日期8天，廊道主体施工实际进度为30%，尚未完成，因此生成\"已延期\"预警。", warnEnabled: true, bigscreen: true },
];

const wlData = [
  // 翻车机房基坑北区 — 一级降水
  { id: 1,  code:"JW001", name:"1号降水井", zone:"翻车机房基坑北区", level:"一级降水", wellType:"降水井", wellGroup:"一级降水井组A", workpoint:"WP01", workpointName:"翻车机房基坑", depth:28.00, groundElev:32.50, standardWater:18.50, alarmWater:20.00, currentWater:18.62, sensor:"WL-A01", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:28:05", note:"" },
  { id: 2,  code:"JW002", name:"2号降水井", zone:"翻车机房基坑北区", level:"一级降水", wellType:"降水井", wellGroup:"一级降水井组A", workpoint:"WP01", workpointName:"翻车机房基坑", depth:28.00, groundElev:32.50, standardWater:18.50, alarmWater:20.00, currentWater:19.38, sensor:"WL-A02", online:true,  dataStatus:"high",     enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:28:12", note:"水位偏高，已通知抽水" },
  { id: 3,  code:"JW003", name:"3号降水井", zone:"翻车机房基坑北区", level:"一级降水", wellType:"降水井", wellGroup:"一级降水井组A", workpoint:"WP01", workpointName:"翻车机房基坑", depth:28.00, groundElev:32.50, standardWater:18.50, alarmWater:20.00, currentWater:20.47, sensor:"WL-A03", online:true,  dataStatus:"overlimit", enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:28:18", note:"超限预警，已启动应急抽水" },
  { id: 4,  code:"JW004", name:"4号降水井", zone:"翻车机房基坑北区", level:"一级降水", wellType:"观测井", wellGroup:"一级降水井组A", workpoint:"WP01", workpointName:"翻车机房基坑", depth:28.00, groundElev:32.50, standardWater:18.50, alarmWater:20.00, currentWater:18.24, sensor:"WL-A04", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:28:22", note:"" },
  // 翻车机房基坑南区 — 二级降水
  { id: 5,  code:"JW005", name:"5号降水井", zone:"翻车机房基坑南区", level:"二级降水", wellType:"降水井", wellGroup:"二级降水井组B", workpoint:"WP01", workpointName:"翻车机房基坑", depth:26.00, groundElev:31.80, standardWater:17.80, alarmWater:19.50, currentWater:17.55, sensor:"WL-B01", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:27:58", note:"" },
  { id: 6,  code:"JW006", name:"6号降水井", zone:"翻车机房基坑南区", level:"二级降水", wellType:"观测井", wellGroup:"二级降水井组B", workpoint:"WP01", workpointName:"翻车机房基坑", depth:26.00, groundElev:31.80, standardWater:17.80, alarmWater:19.50, currentWater:null,  sensor:"WL-B02", online:false, dataStatus:"abnormal",  enabled:true,  bigscreen:false, collectTime:"2026-07-09 08:14:02", note:"传感器通信中断" },
  { id: 7,  code:"JW007", name:"7号降水井", zone:"翻车机房基坑南区", level:"二级降水", wellType:"降水井", wellGroup:"二级降水井组B", workpoint:"WP01", workpointName:"翻车机房基坑", depth:26.00, groundElev:31.80, standardWater:17.80, alarmWater:19.50, currentWater:18.72, sensor:"WL-B03", online:true,  dataStatus:"high",     enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:27:44", note:"连续偏高24h，建议检查" },
  { id: 8,  code:"JW008", name:"8号降水井", zone:"翻车机房基坑南区", level:"二级降水", wellType:"坑内管井", wellGroup:"二级降水井组B", workpoint:"WP01", workpointName:"翻车机房基坑", depth:26.00, groundElev:31.80, standardWater:17.80, alarmWater:19.50, currentWater:17.30, sensor:"WL-B04", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:false, collectTime:"2026-07-09 14:28:01", note:"" },
  // 地下皮带廊基坑 — 三级降水
  { id: 9,  code:"JW009", name:"9号降水井",  zone:"地下皮带廊基坑", level:"三级降水", wellType:"降水井", wellGroup:"三级降水井组C", workpoint:"WP02", workpointName:"地下皮带廊基坑", depth:22.00, groundElev:30.20, standardWater:15.50, alarmWater:17.00, currentWater:15.38, sensor:"WL-C01", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:27:35", note:"" },
  { id: 10, code:"JW010", name:"10号降水井", zone:"地下皮带廊基坑", level:"三级降水", wellType:"降水井", wellGroup:"三级降水井组C", workpoint:"WP02", workpointName:"地下皮带廊基坑", depth:22.00, groundElev:30.20, standardWater:15.50, alarmWater:17.00, currentWater:16.45, sensor:"WL-C02", online:true,  dataStatus:"high",     enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:27:40", note:"接近警戒水位" },
  { id: 11, code:"JW011", name:"11号降水井", zone:"地下皮带廊基坑", level:"三级降水", wellType:"坑内管井", wellGroup:"三级降水井组C", workpoint:"WP02", workpointName:"地下皮带廊基坑", depth:22.00, groundElev:30.20, standardWater:15.50, alarmWater:17.00, currentWater:17.15, sensor:"WL-C03", online:true,  dataStatus:"overlimit", enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:27:48", note:"超限！请立即处理" },
  { id: 12, code:"JW012", name:"12号降水井", zone:"地下皮带廊基坑", level:"三级降水", wellType:"观测井", wellGroup:"三级降水井组C", workpoint:"WP02", workpointName:"地下皮带廊基坑", depth:22.00, groundElev:30.20, standardWater:15.50, alarmWater:17.00, currentWater:15.62, sensor:"WL-C04", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:false, collectTime:"2026-07-09 14:27:52", note:"" },
];

// 7天趋势数据
const wlTrendData = [
  { day:"7/3",  jw001:18.85, jw003:20.12, jw007:18.40, jw010:16.10, jw011:16.80 },
  { day:"7/4",  jw001:18.78, jw003:20.28, jw007:18.52, jw010:16.22, jw011:16.95 },
  { day:"7/5",  jw001:18.90, jw003:20.35, jw007:18.61, jw010:16.38, jw011:17.02 },
  { day:"7/6",  jw001:18.72, jw003:20.41, jw007:18.55, jw010:16.31, jw011:17.08 },
  { day:"7/7",  jw001:18.68, jw003:20.44, jw007:18.68, jw010:16.39, jw011:17.11 },
  { day:"7/8",  jw001:18.65, jw003:20.46, jw007:18.72, jw010:16.42, jw011:17.13 },
  { day:"7/9",  jw001:18.62, jw003:20.47, jw007:18.72, jw010:16.45, jw011:17.15 },
];

const pumpData = [
  { id: 1, code: "PUMP001", name: "1号抽水泵", type: "潜水泵", wellType: "降水井", well: "JW001", workpoint: "翻车机房基坑", currentWater: 18.75, alarmWater: 20.00, status: "运行中", communication: "在线", fault: "正常", controlMode: "远程控制", lastStartTime: "2024-01-15 08:30:00", lastStopTime: "--", totalDuration: "156h 30min", todayDuration: "6h 30min", bigscreen: "是", manufacturer: "南方泵业", model: "WQ100-30-15", power: "15kW", enabled: true },
  { id: 2, code: "PUMP002", name: "2号抽水泵", type: "潜水泵", wellType: "降水井", well: "JW003", workpoint: "翻车机房基坑", currentWater: 20.45, alarmWater: 20.00, status: "停止", communication: "在线", fault: "正常", controlMode: "远程控制", lastStartTime: "2024-01-14 16:00:00", lastStopTime: "2024-01-15 02:00:00", totalDuration: "142h 15min", todayDuration: "0h 0min", bigscreen: "是", manufacturer: "南方泵业", model: "WQ100-30-15", power: "15kW", enabled: true },
  { id: 3, code: "PUMP003", name: "3号抽水泵", type: "备用泵", wellType: "坑内管井", well: "GN001", workpoint: "地下皮带廊基坑", currentWater: 19.10, alarmWater: 19.50, status: "故障", communication: "在线", fault: "故障", controlMode: "远程控制", lastStartTime: "--", lastStopTime: "2024-01-14 22:00:00", totalDuration: "98h 45min", todayDuration: "0h 0min", bigscreen: "否", manufacturer: "上海凯泉", model: "WQ80-25-11", power: "11kW", enabled: true },
  { id: 4, code: "PUMP004", name: "4号抽水泵", type: "排水泵", wellType: "降水井", well: "JW004", workpoint: "翻车机房基坑", currentWater: 17.60, alarmWater: 19.50, status: "停止", communication: "离线", fault: "正常", controlMode: "现场手动", lastStartTime: "2024-01-13 10:00:00", lastStopTime: "2024-01-13 18:00:00", totalDuration: "86h 20min", todayDuration: "0h 0min", bigscreen: "否", manufacturer: "新界泵业", model: "WQ65-20-7.5", power: "7.5kW", enabled: true },
  { id: 5, code: "PUMP005", name: "5号抽水泵", type: "深井泵", wellType: "降水井", well: "JW012", workpoint: "翻车机房基坑", currentWater: 21.20, alarmWater: 20.00, status: "停止", communication: "在线", fault: "正常", controlMode: "远程控制", lastStartTime: "2024-01-14 06:00:00", lastStopTime: "2024-01-14 18:00:00", totalDuration: "210h 0min", todayDuration: "0h 0min", bigscreen: "是", manufacturer: "江苏井神", model: "SJ100-15", power: "22kW", enabled: true },
  { id: 6, code: "PUMP006", name: "6号抽水泵", type: "潜水泵", wellType: "降水井", well: "JW015", workpoint: "地下皮带廊基坑", currentWater: 18.90, alarmWater: 20.20, status: "运行中", communication: "在线", fault: "正常", controlMode: "自动控制", lastStartTime: "2024-01-15 06:00:00", lastStopTime: "--", totalDuration: "178h 30min", todayDuration: "8h 30min", bigscreen: "是", manufacturer: "南方泵业", model: "WQ100-30-15", power: "15kW", enabled: true },
  { id: 7, code: "PUMP007", name: "7号抽水泵", type: "备用泵", wellType: "观测井", well: "GC001", workpoint: "--", currentWater: 19.20, alarmWater: 19.80, status: "停止", communication: "在线", fault: "正常", controlMode: "现场手动", lastStartTime: "2024-01-12 09:00:00", lastStopTime: "2024-01-12 17:00:00", totalDuration: "45h 0min", todayDuration: "0h 0min", bigscreen: "否", manufacturer: "新界泵业", model: "WQ40-15-3", power: "3kW", enabled: false },
  { id: 8, code: "PUMP008", name: "8号抽水泵", type: "深井泵", wellType: "降水井", well: "JW020", workpoint: "地下皮带廊基坑", currentWater: 20.80, alarmWater: 20.20, status: "运行中", communication: "在线", fault: "正常", controlMode: "远程控制", lastStartTime: "2024-01-15 04:00:00", lastStopTime: "--", totalDuration: "125h 15min", todayDuration: "10h 30min", bigscreen: "是", manufacturer: "江苏井神", model: "SJ80-20", power: "30kW", enabled: true },
  { id: 9, code: "PUMP009", name: "9号抽水泵", type: "排水泵", wellType: "坑内管井", well: "GN002", workpoint: "地下皮带廊基坑", currentWater: 18.30, alarmWater: 19.50, status: "运行中", communication: "在线", fault: "正常", controlMode: "远程控制", lastStartTime: "2024-01-15 07:00:00", lastStopTime: "--", totalDuration: "92h 0min", todayDuration: "7h 30min", bigscreen: "否", manufacturer: "上海凯泉", model: "WQ80-25-11", power: "11kW", enabled: true },
  { id: 10, code: "PUMP010", name: "10号抽水泵", type: "其他", wellType: "降水井", well: "JW025", workpoint: "翻车机房基坑", currentWater: 19.60, alarmWater: 20.00, status: "停止", communication: "在线", fault: "正常", controlMode: "远程控制", lastStartTime: "2024-01-13 12:00:00", lastStopTime: "2024-01-13 20:00:00", totalDuration: "68h 40min", todayDuration: "0h 0min", bigscreen: "是", manufacturer: "进口品牌", model: "Custom-01", power: "18kW", enabled: true },
];

const wellData = [
  { id: 1,  code:"JW001", name:"1号降水井", workpointName:"翻车机房基坑", wellType:"降水井" },
  { id: 2,  code:"JW003", name:"3号降水井", workpointName:"翻车机房基坑", wellType:"降水井" },
  { id: 3,  code:"GN001", name:"1号坑内管井", workpointName:"地下皮带廊基坑", wellType:"坑内管井" },
  { id: 4,  code:"JW004", name:"4号降水井", workpointName:"翻车机房基坑", wellType:"降水井" },
  { id: 5,  code:"JW012", name:"12号降水井", workpointName:"翻车机房基坑", wellType:"降水井" },
  { id: 6,  code:"JW015", name:"15号降水井", workpointName:"地下皮带廊基坑", wellType:"降水井" },
  { id: 7,  code:"JW020", name:"20号降水井", workpointName:"地下皮带廊基坑", wellType:"降水井" },
  { id: 8,  code:"GN002", name:"2号坑内管井", workpointName:"地下皮带廊基坑", wellType:"坑内管井" },
  { id: 9,  code:"JW025", name:"25号降水井", workpointName:"翻车机房基坑", wellType:"降水井" },
];

// 沉降监测数据说明:
//   prevZ/currZ = 高程(m), zDiff = 累计沉降量(mm), yDiff/xDiff = 水平位移分量(mm), hDiff = 水平合位移(mm)
//   预警值: 沉降 ≥ 15mm / 水平位移 ≥ 18mm; 控制值(超限): 沉降 ≥ 20mm / 水平位移 ≥ 25mm
const settlementData = [
  // ── 翻车机房基坑北侧 ──
  { id: 1,  code:"DB-N01", name:"翻车机房北侧1号点", monitorType:"沉降监测", workpoint:"翻车机房基坑", area:"基坑北侧", installDate:"2024-04-01", prevDate:"2026/6/25", prevZ:32.486, currDate:"2026/7/9", currZ:32.472, zDiff:-14.0, yDiff:3.2, xDiff:-2.1, hDiff:3.8, settleStatus:"正常", moveStatus:"正常", status:"正常", warning:false, note:"" },
  { id: 2,  code:"DB-N02", name:"翻车机房北侧2号点", monitorType:"沉降监测", workpoint:"翻车机房基坑", area:"基坑北侧", installDate:"2024-04-01", prevDate:"2026/6/25", prevZ:32.501, currDate:"2026/7/9", currZ:32.483, zDiff:-18.2, yDiff:5.8, xDiff:2.4, hDiff:6.3, settleStatus:"预警", moveStatus:"正常", status:"预警", warning:true, note:"累计沉降已达预警值" },
  { id: 3,  code:"DB-N03", name:"翻车机房北侧3号点", monitorType:"沉降监测", workpoint:"翻车机房基坑", area:"基坑北侧", installDate:"2024-04-01", prevDate:"2026/6/25", prevZ:32.468, currDate:"2026/7/9", currZ:32.445, zDiff:-23.1, yDiff:8.4, xDiff:3.6, hDiff:9.1, settleStatus:"超限", moveStatus:"正常", status:"超限", warning:true, note:"超控制值3.1mm，需立即上报" },
  // ── 翻车机房基坑东侧 ──
  { id: 4,  code:"DB-E01", name:"翻车机房东侧1号点", monitorType:"沉降监测", workpoint:"翻车机房基坑", area:"基坑东侧", installDate:"2024-04-01", prevDate:"2026/6/25", prevZ:32.512, currDate:"2026/7/9", currZ:32.501, zDiff:-11.2, yDiff:2.8, xDiff:4.1, hDiff:5.0, settleStatus:"正常", moveStatus:"正常", status:"正常", warning:false, note:"" },
  { id: 5,  code:"DB-E02", name:"翻车机房东侧2号点", monitorType:"沉降监测", workpoint:"翻车机房基坑", area:"基坑东侧", installDate:"2024-04-01", prevDate:"2026/6/25", prevZ:32.489, currDate:"2026/7/9", currZ:32.473, zDiff:-16.4, yDiff:6.2, xDiff:8.7, hDiff:10.7, settleStatus:"预警", moveStatus:"正常", status:"预警", warning:true, note:"沉降速率加快，关注" },
  // ── 翻车机房基坑南侧 ──
  { id: 6,  code:"DB-S01", name:"翻车机房南侧1号点", monitorType:"沉降监测", workpoint:"翻车机房基坑", area:"基坑南侧", installDate:"2024-04-01", prevDate:"2026/6/25", prevZ:32.476, currDate:"2026/7/9", currZ:32.467, zDiff:-9.3, yDiff:1.8, xDiff:-3.2, hDiff:3.7, settleStatus:"正常", moveStatus:"正常", status:"正常", warning:false, note:"" },
  { id: 7,  code:"DB-S02", name:"翻车机房南侧2号点", monitorType:"沉降监测", workpoint:"翻车机房基坑", area:"基坑南侧", installDate:"2024-04-01", prevDate:"2026/6/25", prevZ:32.503, currDate:"", currZ:null, zDiff:null, yDiff:null, xDiff:null, hDiff:null, settleStatus:"未更新", moveStatus:"未更新", status:"未更新", warning:false, note:"传感器采集异常，待检修" },
  // ── 翻车机房基坑西侧 ──
  { id: 8,  code:"DB-W01", name:"翻车机房西侧1号点", monitorType:"沉降监测", workpoint:"翻车机房基坑", area:"基坑西侧", installDate:"2024-04-01", prevDate:"2026/6/25", prevZ:32.495, currDate:"2026/7/9", currZ:32.488, zDiff:-7.1, yDiff:2.2, xDiff:1.9, hDiff:2.9, settleStatus:"正常", moveStatus:"正常", status:"正常", warning:false, note:"" },
  { id: 9,  code:"DB-W02", name:"翻车机房西侧2号点", monitorType:"沉降监测", workpoint:"翻车机房基坑", area:"基坑西侧", installDate:"2024-04-01", prevDate:"2026/6/25", prevZ:32.481, currDate:"2026/7/9", currZ:32.453, zDiff:-28.4, yDiff:19.3, xDiff:12.8, hDiff:23.2, settleStatus:"超限", moveStatus:"超限", status:"超限", warning:true, note:"沉降+位移双超限，已启动应急方案" },
  // ── 地下皮带廊基坑 ──
  { id: 10, code:"DL-01",  name:"皮带廊起点段监测点", monitorType:"沉降监测", workpoint:"地下皮带廊基坑", area:"皮带廊起点段", installDate:"2024-05-15", prevDate:"2026/6/25", prevZ:30.152, currDate:"2026/7/9", currZ:30.143, zDiff:-9.0, yDiff:3.4, xDiff:2.6, hDiff:4.3, settleStatus:"正常", moveStatus:"正常", status:"正常", warning:false, note:"" },
  { id: 11, code:"DL-02",  name:"皮带廊中段监测点",   monitorType:"沉降监测", workpoint:"地下皮带廊基坑", area:"皮带廊中段",   installDate:"2024-05-15", prevDate:"2026/6/25", prevZ:30.168, currDate:"2026/7/9", currZ:30.154, zDiff:-13.8, yDiff:4.9, xDiff:3.8, hDiff:6.2, settleStatus:"正常", moveStatus:"正常", status:"正常", warning:false, note:"" },
  { id: 12, code:"DL-03",  name:"皮带廊终点段监测点", monitorType:"沉降监测", workpoint:"地下皮带廊基坑", area:"皮带廊终点段", installDate:"2024-05-15", prevDate:"2026/6/25", prevZ:30.135, currDate:"2026/7/9", currZ:30.117, zDiff:-17.6, yDiff:7.1, xDiff:5.4, hDiff:8.9, settleStatus:"预警", moveStatus:"正常", status:"预警", warning:true, note:"沉降接近控制值，加密观测" },
];

const monitorWarningData = [
  // ── 水位监测告警 ──
  { id: 1, code: "YJ-SW-20260709-001", source: "水位监测", type: "水位超限预警", level: "较大预警", target: "JW003(3号降水井)", workpoint: "翻车机房基坑北区", currentValue: "20.47m", threshold: "20.00m", content: "水位超过警戒水位0.47m，超限持续2小时，请立即处理", person: "张建国", time: "2026/7/9 12:28:18", status: "待处理", bigscreen: "是" },
  { id: 2, code: "YJ-SW-20260709-002", source: "水位监测", type: "水位超限预警", level: "重大预警", target: "JW011(11号降水井)", workpoint: "地下皮带廊基坑", currentValue: "17.15m", threshold: "17.00m", content: "水位超过警戒水位0.15m，皮带廊基坑区域水位持续上涨", person: "张建国", time: "2026/7/9 14:27:48", status: "待处理", bigscreen: "是" },
  { id: 3, code: "YJ-SW-20260709-003", source: "水位监测", type: "水位偏高预警", level: "一般预警", target: "JW002(2号降水井)", workpoint: "翻车机房基坑北区", currentValue: "19.38m", threshold: "20.00m", content: "水位偏高，距警戒水位0.62m，需加强关注", person: "张建国", time: "2026/7/9 14:28:12", status: "处理中", bigscreen: "否" },
  { id: 4, code: "YJ-SW-20260709-004", source: "水位监测", type: "水位偏高预警", level: "一般预警", target: "JW007(7号降水井)", workpoint: "翻车机房基坑南区", currentValue: "18.72m", threshold: "19.50m", content: "水位连续偏高24h，距警戒水位0.78m", person: "张建国", time: "2026/7/9 08:30:00", status: "处理中", bigscreen: "否" },
  { id: 5, code: "YJ-SW-20260709-005", source: "水位监测", type: "水位偏高预警", level: "一般预警", target: "JW010(10号降水井)", workpoint: "地下皮带廊基坑", currentValue: "16.45m", threshold: "17.00m", content: "水位偏高，接近警戒水位，建议采取降水措施", person: "张建国", time: "2026/7/9 14:27:40", status: "待处理", bigscreen: "否" },
  { id: 6, code: "YJ-SW-20260708-006", source: "水位监测", type: "传感器离线预警", level: "较大预警", target: "JW006(6号降水井)", workpoint: "翻车机房基坑南区", currentValue: "离线", threshold: "在线", content: "水位传感器通信中断，最后采集时间08:14，需现场检查", person: "张建国", time: "2026/7/9 08:14:02", status: "处理中", bigscreen: "是" },
  // ── 抽水泵告警 ──
  { id: 13, code: "YJ-SB-20260709-013", source: "抽水泵管理", type: "抽水泵故障预警", level: "较大预警", target: "JW003-PUMP(3号井抽水泵)", workpoint: "翻车机房基坑北区", currentValue: "电机过热", threshold: "正常运行", content: "3号降水井抽水泵电机过热保护触发，已自动停机，水位持续上涨中", person: "刘建", time: "2026/7/9 11:52:30", status: "处理中", bigscreen: "是" },
  { id: 14, code: "YJ-SB-20260709-014", source: "抽水泵管理", type: "抽水泵离线预警", level: "较大预警", target: "JW011-PUMP(11号井抽水泵)", workpoint: "地下皮带廊基坑", currentValue: "通信中断", threshold: "在线", content: "11号降水井抽水泵离线超过40分钟，无法远程控制，需派人现场检查", person: "刘建", time: "2026/7/9 13:48:10", status: "待处理", bigscreen: "是" },
  { id: 15, code: "YJ-SB-20260708-015", source: "抽水泵管理", type: "运行时长预警", level: "一般预警", target: "JW007-PUMP(7号井抽水泵)", workpoint: "翻车机房基坑南区", currentValue: "连续运行18h", threshold: "≤16h/天", content: "7号井抽水泵连续运行超过设定阈值，建议安排检修维护", person: "刘建", time: "2026/7/9 06:00:00", status: "已关闭", bigscreen: "否" },
  // ── 沉降监测告警 ──
  { id: 7, code: "YJ-CJ-20260709-007", source: "沉降监测", type: "沉降超限预警", level: "重大预警", target: "DB-N03(翻车机房北侧3号点)", workpoint: "翻车机房基坑", currentValue: "累计沉降23.1mm", threshold: "20.0mm", content: "累计沉降超控制值3.1mm，当日沉降速率1.8mm/d，需立即上报并采取加固措施", person: "王芳", time: "2026/7/9 09:00:00", status: "待处理", bigscreen: "是" },
  { id: 8, code: "YJ-CJ-20260709-008", source: "沉降监测", type: "沉降位移超限预警", level: "重大预警", target: "DB-W02(翻车机房西侧2号点)", workpoint: "翻车机房基坑", currentValue: "沉降28.4mm/位移23.2mm", threshold: "沉降20mm/位移25mm", content: "沉降和水平位移双超控制值，已启动应急方案，加密监测频次", person: "王芳", time: "2026/7/9 07:30:00", status: "处理中", bigscreen: "是" },
  { id: 9, code: "YJ-CJ-20260709-009", source: "沉降监测", type: "沉降预警", level: "一般预警", target: "DB-N02(翻车机房北侧2号点)", workpoint: "翻车机房基坑", currentValue: "累计沉降18.2mm", threshold: "15.0mm", content: "累计沉降超预警值，请加密观测并核查是否需要加固", person: "王芳", time: "2026/7/9 09:00:00", status: "待处理", bigscreen: "否" },
  { id: 10, code: "YJ-CJ-20260709-010", source: "沉降监测", type: "沉降预警", level: "一般预警", target: "DB-E02(翻车机房东侧2号点)", workpoint: "翻车机房基坑", currentValue: "累计沉降16.4mm", threshold: "15.0mm", content: "沉降速率近期加快，达预警值，需关注", person: "王芳", time: "2026/7/9 09:00:00", status: "待处理", bigscreen: "否" },
  { id: 11, code: "YJ-CJ-20260709-011", source: "沉降监测", type: "沉降预警", level: "一般预警", target: "DL-03(皮带廊终点段监测点)", workpoint: "地下皮带廊基坑", currentValue: "累计沉降17.6mm", threshold: "15.0mm", content: "皮带廊终点段沉降接近控制值，已安排加密观测", person: "王芳", time: "2026/7/9 09:00:00", status: "处理中", bigscreen: "否" },
  { id: 12, code: "YJ-CJ-20260706-012", source: "沉降监测", type: "数据未更新预警", level: "一般预警", target: "DB-S02(翻车机房南侧2号点)", workpoint: "翻车机房基坑", currentValue: "数据缺失", threshold: "正常上报", content: "监测点数据超过24小时未更新，传感器采集异常，需现场检查", person: "王芳", time: "2026/7/7 09:00:00", status: "已关闭", bigscreen: "否" },
];

const riskData = [
  { id: 1, code: "FX-XM-20260601-001", name: "基坑坍塌风险", category: "基坑工程", level: "一级风险", source: "集团预置", workpoint: "翻车机房", stage: "基坑支护及降水阶段", wbs: "翻车机房/地下部分", scopeType: "工点", scopeObjects: ["翻车机房","地下皮带廊"], analysis: "基坑深度大，地质条件复杂，存在坍塌风险", measure: "1.加强基坑支护监测；2.严格控制降水速率；3.设置位移监测点", dept: "安全质量部", person: "张工", personContact: "13800138001", projectManager: "刘经理", projectManagerContact: "13900139001", deadline: "2026-07-15", status: "管控中", warningStatus: "正常", bigscreen: "是", createTime: "2026-06-01" },
  { id: 2, code: "FX-XM-20260602-002", name: "脚手架搭设不规范", category: "脚手架工程", level: "二级风险", source: "集团预置", workpoint: "翻车机房", stage: "地上结构及设备安装阶段", wbs: "翻车机房/主体结构", scopeType: "工点", scopeObjects: ["翻车机房"], analysis: "脚手架搭设质量不达标，存在安全隐患", measure: "1.严格按方案搭设；2.定期检查扣件紧固；3.设置防护栏杆", dept: "工程部", person: "李工", personContact: "13800138002", projectManager: "刘经理", projectManagerContact: "13900139001", deadline: "2026-07-20", status: "待落实", warningStatus: "正常", bigscreen: "否", createTime: "2026-06-02" },
  { id: 3, code: "FX-XM-20260603-003", name: "模板支撑体系失稳", category: "模板工程", level: "二级风险", source: "系统推荐", workpoint: "地下皮带廊", stage: "地上结构及设备安装阶段", wbs: "翻车机房/主体结构", scopeType: "单位工程", scopeObjects: ["翻车机房工程","地下皮带廊工程"], analysis: "模板支撑体系承载能力不足，易导致坍塌", measure: "1.按计算书搭设支撑；2.控制混凝土浇筑顺序；3.加强过程监测", dept: "工程部", person: "王工", personContact: "13800138003", projectManager: "陈经理", projectManagerContact: "13900139002", deadline: "2026-06-10", status: "管控中", warningStatus: "超期", bigscreen: "是", createTime: "2026-06-03" },
  { id: 4, code: "FX-XM-20260604-004", name: "起重吊装作业风险", category: "起重吊装", level: "一级风险", source: "人工新增", workpoint: "翻车机房", stage: "地上结构及设备安装阶段", wbs: "翻车机房/设备安装", scopeType: "工点", scopeObjects: ["翻车机房","地下皮带廊","监测工程"], analysis: "起重设备操作不当易引发吊装事故", measure: "1.持证上岗；2.检查起重设备状态；3.设置警戒区域", dept: "机电部", person: "赵工", personContact: "13800138004", projectManager: "刘经理", projectManagerContact: "13900139001", deadline: "2026-06-25", status: "待落实", warningStatus: "临期", bigscreen: "是", createTime: "2026-06-04" },
  { id: 5, code: "FX-XM-20260605-005", name: "高处坠落风险", category: "高处作业", level: "三级风险", source: "集团预置", workpoint: "基坑支护及降水工程", stage: "地上结构及设备安装阶段", wbs: "翻车机房/屋面工程", scopeType: "工点", scopeObjects: ["基坑支护及降水工程"], analysis: "高处作业防护措施不到位", measure: "1.佩戴安全带；2.设置安全防护网；3.作业面清理杂物", dept: "安全质量部", person: "孙工", personContact: "13800138005", projectManager: "刘经理", projectManagerContact: "13900139001", deadline: "2026-07-30", status: "管控中", warningStatus: "正常", bigscreen: "否", createTime: "2026-06-05" },
  { id: 6, code: "FX-XM-20260606-006", name: "临时用电不规范", category: "临时用电", level: "三级风险", source: "系统推荐", workpoint: "临设及现场辅助工程", stage: "基坑支护及降水阶段", wbs: "翻车机房/地下部分", scopeType: "单位工程", scopeObjects: ["临设及现场辅助工程"], analysis: "临时用电线路敷设不规范，存在触电风险", measure: "1.三级配电两级保护；2.接地接零规范；3.漏电保护器检测", dept: "机电部", person: "周工", personContact: "13800138006", projectManager: "刘经理", projectManagerContact: "13900139001", deadline: "2026-08-01", status: "已落实", warningStatus: "正常", bigscreen: "否", createTime: "2026-06-06" },
  { id: 7, code: "FX-XM-20260607-007", name: "消防设施不足", category: "消防安全", level: "四级风险", source: "集团预置", workpoint: "临设及现场辅助工程", stage: "施工准备阶段", wbs: "翻车机房/施工准备", scopeType: "工点", scopeObjects: ["临设及现场辅助工程"], analysis: "消防设施配备不足，火灾时无法有效扑救", measure: "1.配备足够灭火器；2.设置消防水源；3.定期检查维护", dept: "综合部", person: "吴工", personContact: "13800138007", projectManager: "刘经理", projectManagerContact: "13900139001", deadline: "2026-06-15", status: "已闭环", warningStatus: "正常", bigscreen: "否", createTime: "2026-06-07" },
  { id: 8, code: "FX-XM-20260608-008", name: "塔吊基础沉降", category: "施工机械", level: "二级风险", source: "人工新增", workpoint: "地下皮带廊", stage: "地上结构及设备安装阶段", wbs: "翻车机房/主体结构", scopeType: "工点", scopeObjects: ["地下皮带廊"], analysis: "塔吊基础沉降超限影响设备稳定性", measure: "1.设置沉降观测点；2.定期测量；3.超限立即停机", dept: "机电部", person: "郑工", personContact: "13800138008", projectManager: "陈经理", projectManagerContact: "13900139002", deadline: "2026-07-25", status: "管控中", warningStatus: "正常", bigscreen: "是", createTime: "2026-06-08" },
  { id: 9, code: "FX-XM-20260609-009", name: "深基坑降水异常", category: "基坑工程", level: "一级风险", source: "系统推荐", workpoint: "基坑支护及降水工程", stage: "基坑支护及降水阶段", wbs: "翻车机房/地下部分", scopeType: "工点", scopeObjects: ["基坑支护及降水工程"], analysis: "深基坑降水系统异常，存在涌水风险", measure: "1.24小时监测水位；2.备用电源保障；3.应急预案", dept: "安全质量部", person: "张工", personContact: "13800138001", projectManager: "刘经理", projectManagerContact: "13900139001", deadline: "2026-06-20", status: "待落实", warningStatus: "临期", bigscreen: "是", createTime: "2026-06-09" },
  { id: 10, code: "FX-XM-20260610-010", name: "临边防护缺失", category: "高处作业", level: "三级风险", source: "集团预置", workpoint: "翻车机房", stage: "地上结构及设备安装阶段", wbs: "翻车机房/主体结构", scopeType: "工点", scopeObjects: ["翻车机房"], analysis: "临边防护措施缺失，易发生坠落事故", measure: "1.设置1.2米高防护栏杆；2.挂安全警示标识；3.定期检查", dept: "安全质量部", person: "孙工", personContact: "13800138005", projectManager: "刘经理", projectManagerContact: "13900139001", deadline: "2026-07-10", status: "管控中", warningStatus: "正常", bigscreen: "否", createTime: "2026-06-10" },
  { id: 11, code: "FX-XM-20260611-011", name: "物料提升机故障", category: "施工机械", level: "二级风险", source: "人工新增", workpoint: "监测工程", stage: "地上结构及设备安装阶段", wbs: "翻车机房/主体结构", scopeType: "工点", scopeObjects: ["监测工程"], analysis: "提升机故障或操作不当易导致人员伤亡", measure: "1.定期检修保养；2.检查安全装置；3.持证操作", dept: "机电部", person: "郑工", personContact: "13800138008", projectManager: "陈经理", projectManagerContact: "13900139002", deadline: "2026-06-05", status: "已闭环", warningStatus: "正常", bigscreen: "否", createTime: "2026-06-11" },
  { id: 12, code: "FX-XM-20260612-012", name: "动火作业风险", category: "消防安全", level: "三级风险", source: "集团预置", workpoint: "监测工程", stage: "地上结构及设备安装阶段", wbs: "翻车机房/设备安装", scopeType: "单位工程", scopeObjects: ["监测工程","临设及现场辅助工程"], analysis: "动火作业安全措施不到位，易引发火灾", measure: "1.办理动火作业票；2.配备灭火器材；3.清理作业面", dept: "综合部", person: "吴工", personContact: "13800138007", projectManager: "陈经理", projectManagerContact: "13900139002", deadline: "2026-07-18", status: "待落实", warningStatus: "正常", bigscreen: "否", createTime: "2026-06-12" },
];

const riskLibraryData = [
  { id: 1, code: "JK-GL-001", name: "基坑坍塌风险", category: "基坑工程", defaultLevel: "一级风险", analysis: "基坑深度大，地质条件复杂，周边环境敏感，存在坍塌风险", measure: "1.加强基坑支护监测；2.严格控制降水速率；3.设置位移监测点；4.编制专项应急预案" },
  { id: 2, code: "JK-GL-002", name: "基坑涌水风险", category: "基坑工程", defaultLevel: "一级风险", analysis: "地下水位较高，含水层丰富，存在涌水突泥风险", measure: "1.加强降水系统维护；2.设置坑内排水沟；3.备用抽水设备；4.加密水位监测频率" },
  { id: 3, code: "JK-GL-003", name: "基坑周边沉降", category: "基坑工程", defaultLevel: "二级风险", analysis: "基坑开挖引起周边土体变形，影响邻近建构筑物安全", measure: "1.加密周边沉降监测；2.控制开挖速率；3.及时施作支撑；4.建立预警响应机制" },
  { id: 4, code: "JJ-GL-001", name: "脚手架搭设不规范", category: "脚手架工程", defaultLevel: "二级风险", analysis: "脚手架搭设质量直接影响作业人员安全，不规范搭设易引发事故", measure: "1.严格按方案搭设；2.定期检查扣件紧固；3.设置防护栏杆；4.持证上岗验收" },
  { id: 5, code: "JJ-GL-002", name: "脚手架超载", category: "脚手架工程", defaultLevel: "一级风险", analysis: "超载使用会导致脚手架失稳坍塌，造成重大人员伤亡", measure: "1.按设计荷载控制；2.禁止超量堆放材料；3.定期开展安全检查；4.设置荷载警示标识" },
  { id: 6, code: "MB-GL-001", name: "模板支撑体系失稳", category: "模板工程", defaultLevel: "二级风险", analysis: "模板支撑体系承载能力不足或搭设不规范易导致坍塌", measure: "1.按计算书搭设支撑；2.控制混凝土浇筑顺序；3.加强过程监测；4.拆除前验算复核" },
  { id: 7, code: "QD-GL-001", name: "起重吊装作业风险", category: "起重吊装", defaultLevel: "一级风险", analysis: "起重设备故障、操作不当或指挥失误易引发吊装事故", measure: "1.持证上岗；2.起吊前检查设备；3.划定警戒区域；4.专人指挥；5.不超重起吊" },
  { id: 8, code: "GC-GL-001", name: "高处坠落风险", category: "高处作业", defaultLevel: "三级风险", analysis: "高处作业未采取有效防护措施易发生坠落事故", measure: "1.规范佩戴安全带；2.安全网全封闭；3.临边洞口防护；4.作业前安全交底" },
  { id: 9, code: "LD-GL-001", name: "临时用电不规范", category: "临时用电", defaultLevel: "三级风险", analysis: "临时用电线路敷设不规范、保护措施不到位易引发触电事故", measure: "1.规范敷设线路；2.安装漏电保护；3.持证操作；4.定期检查配电箱" },
  { id: 10, code: "XF-GL-001", name: "消防设施不足", category: "消防安全", defaultLevel: "四级风险", analysis: "消防设施配备不足或失效，火灾时无法有效扑救", measure: "1.按规定配备灭火器；2.设置消防通道；3.定期检查消防设施；4.开展消防演练" },
  { id: 11, code: "JX-GL-001", name: "塔吊基础沉降", category: "施工机械", defaultLevel: "二级风险", analysis: "塔吊基础沉降超限会影响设备稳定性，引发倾覆风险", measure: "1.定期观测沉降数据；2.超限立即停机检查；3.加固基础处理；4.第三方监测复核" },
  { id: 12, code: "JX-GL-002", name: "物料提升机故障", category: "施工机械", defaultLevel: "二级风险", analysis: "提升机故障或操作不当易导致人员伤亡和设备损坏", measure: "1.每日班前检查；2.持证操作；3.定期保养维护；4.限载运行" },
];

const controlRecordData = [
  { id: 1, recordCode: "JL-20260613-001", riskCode: "FX-XM-20260601-001", riskName: "基坑坍塌风险", workpoint: "翻车机房基坑", checker: "张工", checkTime: "2026/6/13 09:30:00", implementation: "已落实", photoCount: "3张", problem: "", status: "已完成", remark: "监测数据正常" },
  { id: 2, recordCode: "JL-20260612-002", riskCode: "FX-XM-20260602-002", riskName: "脚手架搭设不规范", workpoint: "主体结构施工区", checker: "李工", checkTime: "2026/6/12 14:00:00", implementation: "部分落实", photoCount: "5张", problem: "部分扣件松动，防护栏杆高度不足", status: "处理中", remark: "" },
  { id: 3, recordCode: "JL-20260611-003", riskCode: "FX-XM-20260603-003", riskName: "模板支撑体系失稳", workpoint: "浇筑施工区", checker: "王工", checkTime: "2026/6/11 10:00:00", implementation: "未落实", photoCount: "2张", problem: "支撑间距不符合要求，部分立杆垂直度偏差", status: "待处理", remark: "需立即整改" },
  { id: 4, recordCode: "JL-20260610-004", riskCode: "FX-XM-20260604-004", riskName: "起重吊装作业风险", workpoint: "设备安装区", checker: "赵工", checkTime: "2026/6/10 08:30:00", implementation: "已落实", photoCount: "-", problem: "", status: "已完成", remark: "设备状态良好，操作人员持证上岗" },
  { id: 5, recordCode: "JL-20260609-005", riskCode: "FX-XM-20260605-005", riskName: "高处坠落风险", workpoint: "屋面施工区", checker: "孙工", checkTime: "2026/6/9 15:00:00", implementation: "已落实", photoCount: "1张", problem: "", status: "已完成", remark: "安全防护到位" },
  { id: 6, recordCode: "JL-20260608-006", riskCode: "FX-XM-20260606-006", riskName: "临时用电不规范", workpoint: "施工现场", checker: "周工", checkTime: "2026/6/8 11:00:00", implementation: "已落实", photoCount: "-", problem: "", status: "已完成", remark: "配电系统规范" },
  { id: 7, recordCode: "JL-20260607-007", riskCode: "FX-XM-20260607-007", riskName: "消防设施不足", workpoint: "材料堆放区", checker: "吴工", checkTime: "2026/6/7 16:00:00", implementation: "已落实", photoCount: "4张", problem: "", status: "已完成", remark: "已补充消防器材" },
  { id: 8, recordCode: "JL-20260606-008", riskCode: "FX-XM-20260608-008", riskName: "塔吊基础沉降", workpoint: "塔吊作业区", checker: "郑工", checkTime: "2026/6/6 09:00:00", implementation: "部分落实", photoCount: "2张", problem: "沉降观测数据显示有轻微沉降", status: "处理中", remark: "" },
];

const aiAlarmData = [
  { id: 1, code: "AI-20260706-001", type: "未戴安全帽", level: "重大", area: "基坑作业区", camera: "CAM-001", person: "张三", time: "2026/7/6 09:25:30", confidence: "95%", confirmResult: "待确认", status: "待确认", blacklist: "否" },
  { id: 2, code: "AI-20260706-002", type: "未穿反光衣", level: "一般", area: "施工通道", camera: "CAM-002", person: "李四", time: "2026/7/6 09:45:12", confidence: "88%", confirmResult: "真实违规", status: "已确认", blacklist: "是" },
  { id: 3, code: "AI-20260706-003", type: "人员闯入危险区域", level: "重大", area: "吊装区域", camera: "CAM-003", person: "王五", time: "2026/7/6 10:12:45", confidence: "92%", confirmResult: "真实违规", status: "已处置", blacklist: "是" },
  { id: 4, code: "AI-20260706-004", type: "抽烟", level: "一般", area: "材料堆放区", camera: "CAM-004", person: "赵六", time: "2026/7/6 11:05:22", confidence: "85%", confirmResult: "误报", status: "已忽略", blacklist: "否" },
  { id: 5, code: "AI-20260706-005", type: "明火", level: "重大", area: "设备安装区", camera: "CAM-005", person: "", time: "2026/7/6 14:30:18", confidence: "98%", confirmResult: "待确认", status: "待确认", blacklist: "否" },
  { id: 6, code: "AI-20260706-006", type: "人员聚集", level: "一般", area: "屋面施工区", camera: "CAM-006", person: "", time: "2026/7/6 15:18:40", confidence: "90%", confirmResult: "真实违规", status: "已处置", blacklist: "否" },
  { id: 7, code: "AI-20260705-001", type: "未戴安全帽", level: "一般", area: "基坑作业区", camera: "CAM-001", person: "张三", time: "2026/7/5 08:55:20", confidence: "93%", confirmResult: "真实违规", status: "已关闭", blacklist: "是" },
  { id: 8, code: "AI-20260705-002", type: "车辆违规停放", level: "轻微", area: "施工通道", camera: "CAM-002", person: "", time: "2026/7/5 16:22:33", confidence: "82%", confirmResult: "误报", status: "已忽略", blacklist: "否" },
  { id: 9, code: "AI-20260704-001", type: "人员闯入危险区域", level: "重大", area: "塔吊作业区", camera: "CAM-007", person: "孙七", time: "2026/7/4 13:40:55", confidence: "96%", confirmResult: "真实违规", status: "已关闭", blacklist: "是" },
  { id: 10, code: "AI-20260704-002", type: "抽烟", level: "一般", area: "施工现场", camera: "CAM-008", person: "周八", time: "2026/7/4 10:30:15", confidence: "87%", confirmResult: "真实违规", status: "已处置", blacklist: "否" },
  { id: 11, code: "AI-20260703-001", type: "未穿反光衣", level: "轻微", area: "地下施工区", camera: "CAM-009", person: "吴九", time: "2026/7/3 09:15:28", confidence: "80%", confirmResult: "无法判断", status: "待确认", blacklist: "否" },
  { id: 12, code: "AI-20260703-002", type: "其他违规", level: "一般", area: "焊接作业区", camera: "CAM-010", person: "郑十", time: "2026/7/3 14:05:42", confidence: "84%", confirmResult: "真实违规", status: "已确认", blacklist: "是" },
  { id: 13, code: "AI-20260706-007", type: "未戴安全帽", level: "一般", area: "基坑作业区", camera: "CAM-001", person: "钱十一", time: "2026/7/6 16:45:30", confidence: "91%", confirmResult: "待确认", status: "待确认", blacklist: "否" },
  { id: 14, code: "AI-20260706-008", type: "人员聚集", level: "一般", area: "材料堆放区", camera: "CAM-004", person: "", time: "2026/7/6 17:20:15", confidence: "89%", confirmResult: "待确认", status: "待确认", blacklist: "否" },
];

const deviceData = [
  { id: "D001", code: "DEV-001", name: "水位传感器-001", type: "水位传感器", system: "水位监测", workpoint: "翻车机房基坑", related: "JJ-001", location: "一号降水井口", online: "在线", dataStatus: "正常", lastReport: "2025-03-15 08:30", enabled: "启用" },
  { id: "D002", code: "DEV-002", name: "DTU采集箱-001", type: "DTU采集设备", system: "水位监测", workpoint: "翻车机房基坑", related: "井组一区", location: "基坑东侧", online: "在线", dataStatus: "正常", lastReport: "2025-03-15 08:30", enabled: "启用" },
  { id: "D003", code: "DEV-003", name: "AI摄像头-主通道", type: "AI摄像头", system: "AI违规告警", workpoint: "施工主通道", related: "-", location: "出入口上方", online: "在线", dataStatus: "正常", lastReport: "2025-03-15 08:29", enabled: "启用" },
  { id: "D004", code: "DEV-004", name: "普通摄像头-基坑", type: "普通摄像头", system: "视频监控", workpoint: "翻车机房基坑", related: "-", location: "基坑南侧", online: "离线", dataStatus: "未更新", lastReport: "2025-03-14 20:00", enabled: "启用" },
  { id: "D005", code: "DEV-005", name: "水泵采集模块-01", type: "水泵采集模块", system: "抽水泵监测", workpoint: "翻车机房基坑", related: "抽水泵-001", location: "泵房内", online: "在线", dataStatus: "正常", lastReport: "2025-03-15 08:28", enabled: "启用" },
  { id: "D006", code: "DEV-006", name: "工业网关-001", type: "工业网关", system: "其他系统", workpoint: "材料堆放区", related: "-", location: "临时控制室", online: "在线", dataStatus: "正常", lastReport: "2025-03-15 08:25", enabled: "启用" },
];

const progressChartData = [
  { month: "10月", planned: 10, actual: 8 }, { month: "11月", planned: 22, actual: 18 },
  { month: "12月", planned: 35, actual: 30 }, { month: "1月", planned: 48, actual: 42 },
  { month: "2月", planned: 60, actual: 53 }, { month: "3月", planned: 72, actual: 65 },
  { month: "4月", planned: 82, actual: null }, { month: "5月", planned: 90, actual: null },
  { month: "6月", planned: 100, actual: null },
];

// ─── TYPES ───────────────────────────────────────────────────────────────────
type PageId =
  | "project-overview" | "bim-modeling"
  | "progress" | "early-warning"
  | "stage-config" | "wbs-config" | "workpoint-config" | "warn-rule-config"
  | "pit-maintenance" | "water-level" | "pump-management" | "settlement-monitor" | "pit-camera"
  | "safety-check" | "hazard-rectify" | "risk-control" | "ai-alarm" | "violation-record" | "blacklist-management" | "work-ticket"
  | "personnel-info" | "attendance" | "attendance-rules" | "safety-blacklist"
  | "device-list" | "device-inspection" | "device-maintenance" | "device-assets"
  | "warning-center" | "wx-miniprogram" | "data-api"
  | "user-management" | "role-permission";

interface NavChildItem {
  label: string; page: PageId; children?: { label: string; page: PageId }[];
}

interface NavItem {
  id: string; label: string; icon: React.ReactNode;
  page?: PageId; children?: NavChildItem[];
}

const navItems: NavItem[] = [
  { id: "4", label: "生产管理", icon: <Wrench size={18} />, children: [
    { label: "进度管理", page: "progress" }, { label: "工期预警", page: "early-warning" },
    { label: "基础配置", page: "stage-config", children: [
      { label: "施工阶段配置", page: "stage-config" },
      { label: "WBS结构配置", page: "wbs-config" },
      { label: "工点配置", page: "workpoint-config" },
      { label: "工期预警规则", page: "warn-rule-config" },
    ]},
  ]},
  { id: "5", label: "监测管理", icon: <Activity size={18} />, children: [
    { label: "基坑维护", page: "pit-maintenance" },
    { label: "水位监测管理", page: "water-level" },
    { label: "沉降位移监测", page: "settlement-monitor" },
    { label: "抽水泵管理", page: "pump-management" },
  ]},
  { id: "6", label: "安全管理", icon: <Shield size={18} />, children: [
    { label: "应急安全演练", page: "safety-check" }, { label: "安全隐患", page: "hazard-rectify" },
    { label: "风险管控", page: "risk-control" }, { label: "视频监控", page: "ai-alarm" }, { label: "违规行为", page: "violation-record" },
    { label: "安全红黑榜管理", page: "blacklist-management" },
    { label: "作业票管理", page: "work-ticket" },
  ]},
  { id: "7", label: "人员管理", icon: <Users size={18} />, children: [
    { label: "劳务人员信息", page: "personnel-info" },
  ]},
  { id: "8", label: "设备管理", icon: <Cpu size={18} />, children: [
    { label: "接入设备清单", page: "device-list" }, { label: "设备巡检", page: "device-inspection" },
    { label: "设备维保", page: "device-maintenance" }, { label: "设备台账", page: "device-assets" },
  ]},
  { id: "12", label: "系统管理", icon: <Settings size={18} />, children: [
    { label: "用户管理", page: "user-management" }, { label: "角色权限管理", page: "role-permission" },
  ]},
];

// ─── WBS TREE ────────────────────────────────────────────────────────────────
interface WBSNode { name: string; children?: WBSNode[] }
function WBSTreeNode({ node, depth = 0, selected, onSelect }: { node: WBSNode; depth?: number; selected: string; onSelect: (n: string) => void }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = !!node.children?.length;
  return (
    <div>
      <div
        onClick={() => { if (hasChildren) setOpen(!open); onSelect(node.name); }}
        className={`flex items-center gap-1 py-1 rounded cursor-pointer text-[13px] transition-colors ${selected === node.name ? "bg-blue-50 text-[#0052cc] font-medium" : "text-gray-700 hover:bg-slate-50"}`}
        style={{ paddingLeft: `${8 + depth * 16}px`, paddingRight: "8px" }}
      >
        {hasChildren ? (open ? <ChevronDown size={13} className="flex-shrink-0 text-slate-400" /> : <ChevronRight size={13} className="flex-shrink-0 text-slate-400" />) : <span className="w-3.5" />}
        <span className="truncate">{node.name}</span>
      </div>
      {hasChildren && open && node.children!.map((c, i) => <WBSTreeNode key={i} node={c} depth={depth + 1} selected={selected} onSelect={onSelect} />)}
    </div>
  );
}

// ─── PAGE: PROGRESS ───────────────────────────────────────────────────────────
const componentTableData = [
  { id:1, code:"CJ-001", name:"翻车机房垫层",       unit:"翻车机房", dept:"地下部分", item:"地基与基础",   planStart:"2024-03-01", planEnd:"2024-03-31", actualStart:"2024-03-05", actualEnd:"2024-03-28", progress:100, status:"已完成", remark:"已验收" },
  { id:2, code:"CJ-002", name:"翻车机房底板",       unit:"翻车机房", dept:"地下部分", item:"地基与基础",   planStart:"2024-04-01", planEnd:"2024-05-31", actualStart:"2024-04-03", actualEnd:"2024-05-25", progress:100, status:"已完成", remark:"已验收" },
  { id:3, code:"CJ-003", name:"地下东侧墙",         unit:"翻车机房", dept:"地下部分", item:"地下主体结构", planStart:"2024-06-01", planEnd:"2024-08-31", actualStart:"2024-06-05", actualEnd:"",          progress:85,  status:"进行中", remark:"" },
  { id:4, code:"CJ-004", name:"地下西侧墙",         unit:"翻车机房", dept:"地下部分", item:"地下主体结构", planStart:"2024-06-01", planEnd:"2024-08-31", actualStart:"2024-06-08", actualEnd:"",          progress:80,  status:"进行中", remark:"" },
  { id:5, code:"CJ-005", name:"廊道土方开挖（起点段）",unit:"地下皮带廊",dept:"廊道基础工程",item:"廊道土方开挖",planStart:"2024-07-01",planEnd:"2024-09-30",actualStart:"2024-07-10",actualEnd:"2024-09-20",progress:100,status:"已完成",remark:"已完工" },
  { id:6, code:"CJ-006", name:"廊道侧墙（左侧起点段）",unit:"地下皮带廊",dept:"廊道主体结构",item:"廊道侧墙施工",planStart:"2024-10-01",planEnd:"2025-01-31",actualStart:"2024-10-08",actualEnd:"",progress:55,status:"进行中",remark:"" },
  { id:7, code:"CJ-007", name:"基坑东侧支护桩",    unit:"基坑支护", dept:"支护工程",  item:"支护桩施工",   planStart:"2024-03-01", planEnd:"2024-04-30", actualStart:"2024-03-05", actualEnd:"2024-04-25", progress:100, status:"已完成", remark:"已验收" },
  { id:8, code:"CJ-008", name:"基坑降水井群",       unit:"基坑支护", dept:"降水工程",  item:"降水井施工",   planStart:"2024-03-15", planEnd:"2024-06-30", actualStart:"2024-03-20", actualEnd:"2024-06-28", progress:100, status:"已完成", remark:"持续运行" },
];

function ProgressPage() {
  const [selectedWBS, setSelectedWBS] = useState("淄海铁路项目");
  const [searchText, setSearchText] = useState("");
  const [selectedNode, setSelectedNode] = useState<{id:string; name:string; type:string; unit?:string; dept?:string}>({ id: "project-1", name: "淄海铁路项目", type: "project" });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["project-1", "unit-1", "dept-1-1", "dept-1-2"]));
  const [showOnlyWarning, setShowOnlyWarning] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [compDataState, setCompDataState] = useState(componentTableData);
  const [filterUnit, setFilterUnit] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterItem, setFilterItem] = useState("");
  const [filterCompStatus, setFilterCompStatus] = useState("");
  const [selectedComps, setSelectedComps] = useState<Set<number>>(new Set());
  const [batchModal, setBatchModal] = useState<{open:boolean;ids:number[];newStatus:string}>({open:false,ids:[],newStatus:"已完成"});
  const [compDetail, setCompDetail] = useState<{open:boolean;data?:typeof componentTableData[0]}>({open:false});
  const [compForm, setCompForm] = useState<{open:boolean;data?:typeof componentTableData[0]}>({open:false});
  const [bimLinkModal, setBimLinkModal] = useState<{open:boolean}>({open:false});
  const [wbsModal, setWbsModal] = useState<{open:boolean;mode:"add"|"edit";nodeType?:string}>({open:false,mode:"add"});
  const [filterStageNo, setFilterStageNo] = useState("");
  const [filterStageName, setFilterStageName] = useState("");
  const [filterStageStatus, setFilterStageStatus] = useState("");
  const [filterCurrent, setFilterCurrent] = useState("");
  const [filterOnScreen, setFilterOnScreen] = useState("");

  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);
  };

  const getChildNodesForWarning = () => {
    const findNode = (nodes: any[], id: string): any => {
      for (const n of nodes) {
        if (n.id === id) return n;
        if (n.children) {
          const found = findNode(n.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    const currentNode = findNode(wbsTreeData, selectedNode?.id);
    return currentNode?.children || [];
  };

  const getChildNodes = () => {
    const findNode = (nodes: any[], targetName: string): any => {
      for (const node of nodes) {
        if (node.name === targetName) return node;
        if (node.children) {
          const found = findNode(node.children, targetName);
          if (found) return found;
        }
      }
      return null;
    };
    const currentNode = findNode(wbsTreeData, selectedWBS);
    return currentNode?.children || [];
  };

  const filteredComponents = compDataState.filter(d => {
    if (filterUnit && d.unit !== filterUnit) return false;
    if (filterDept && d.dept !== filterDept) return false;
    if (filterItem && d.item !== filterItem) return false;
    if (filterCompStatus && d.status !== filterCompStatus) return false;
    return true;
  });

  const filteredStages = stageData.filter(s => {
    if (filterStageNo && !s.code.includes(filterStageNo)) return false;
    if (filterStageName && !s.name.includes(filterStageName)) return false;
    if (filterStageStatus && s.status !== filterStageStatus) return false;
    if (filterCurrent === "是" && !s.current) return false;
    if (filterCurrent === "否" && s.current) return false;
    if (filterOnScreen === "是" && !s.onScreen) return false;
    if (filterOnScreen === "否" && s.onScreen) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ── 进度总览 ── */}
      <div className="flex-1 flex overflow-hidden">
          {/* 左：WBS 树 */}
          <div className="w-[340px] bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-800">WBS结构</span>
            </div>
            <div className="p-3 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="text" value={searchText} onChange={e => {}} placeholder="搜索WBS节点" className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-1">
              {(() => {
                const traverseNodes = (nodes: any[], level: number): any[] => {
                  let result: any[] = [];
                  nodes.forEach(node => {
                    result.push({ ...node, level });
                    if (node.children) {
                      result = result.concat(traverseNodes(node.children, level + 1));
                    }
                  });
                  return result;
                };
                const flatNodes = traverseNodes(wbsTreeData, 0);
                return flatNodes.map(node => (
                  <div key={node.id} onClick={() => handleNodeSelect(node)} className={`flex items-center gap-1 px-2 py-1.5 text-sm cursor-pointer transition-colors ${selectedNode?.id === node.id ? "bg-blue-50 text-[#1F53BE]" : "text-gray-700 hover:bg-gray-50"}`} style={{ paddingLeft: `${node.level * 16 + 8}px` }}>
                    <span className="flex-1 truncate">{node.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${node.type === "project" ? "bg-blue-100 text-blue-700" : node.type === "unit" ? "bg-green-100 text-green-700" : node.type === "dept" ? "bg-purple-100 text-purple-700" : node.type === "comp" ? "bg-gray-100 text-gray-600" : "bg-orange-100 text-orange-700"}`}>
                      {node.type === "project" ? "项目" : node.type === "unit" ? "单位工程" : node.type === "dept" ? "分部工程" : node.type === "comp" ? "构件" : "分项工程"}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* 右：内容区 */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 p-4 gap-4">
            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-3 flex-shrink-0">
              {/* 项目总进度 */}
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col gap-1">
                <span className="text-[11px] text-gray-400">项目总进度</span>
                <div className="flex items-end gap-1">
                  <span className="text-[22px] font-bold text-orange-500">62.5</span>
                  <span className="text-[13px] text-orange-400 mb-0.5">%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-orange-400 h-1.5 rounded-full" style={{width:"62.5%"}}/>
                </div>
              </div>
              {/* 总构件数量 */}
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col gap-1">
                <span className="text-[11px] text-gray-400">总构件数量</span>
                <span className="text-[22px] font-bold text-gray-700">440</span>
                <span className="text-[11px] text-gray-400">个构件</span>
              </div>
              {/* 已完成的构件 */}
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col gap-1">
                <span className="text-[11px] text-gray-400">已完成的构件</span>
                <span className="text-[22px] font-bold text-green-600">312</span>
                <span className="text-[11px] text-gray-400">个构件</span>
              </div>
              {/* 进行中的构件 */}
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col gap-1">
                <span className="text-[11px] text-gray-400">进行中的构件</span>
                <span className="text-[22px] font-bold text-blue-500">86</span>
                <span className="text-[11px] text-gray-400">个构件</span>
              </div>
              {/* 未开始构件 */}
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col gap-1">
                <span className="text-[11px] text-gray-400">未开始构件</span>
                <span className="text-[22px] font-bold text-orange-500">42</span>
                <span className="text-[11px] text-gray-400">个构件</span>
              </div>
            </div>

            {/* 构件列表及状态监测 */}
            <div className="bg-white border border-gray-200 rounded-xl flex flex-col flex-1 overflow-hidden">
              {/* 卡片头：选择模式下变为操作栏 */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-semibold text-gray-800">构件列表及状态监测</span>
                  <span className="text-[13px] text-gray-600">已选择 <span className="font-semibold text-[#1F53BE]">{selectedComps.size}</span> 项</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-500">当前状态</span>
                    <select value={filterCompStatus} onChange={e => setFilterCompStatus(e.target.value)}
                      className="px-2 py-1 border border-gray-200 rounded text-[11px] text-gray-600 bg-white cursor-pointer focus:outline-none">
                      <option value="">全部状态</option>
                      <option value="未开始">未开始</option>
                      <option value="进行中">进行中</option>
                      <option value="已完成">已完成</option>
                      <option value="已延期">已延期</option>
                    </select>
                  </div>
                  <button
                    disabled={selectedComps.size === 0}
                    onClick={()=>setBatchModal({open:true,ids:[...selectedComps],newStatus:"已完成"})}
                    className={`px-3 py-1.5 text-[12px] rounded-lg cursor-pointer transition-colors ${selectedComps.size>0?"bg-[#1F53BE] text-white hover:bg-blue-700":"bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                    批量调整状态
                  </button>
                  <span className="text-[11px] text-gray-400">共 {filteredComponents.length} 条</span>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                      <th className="px-3 py-2.5 w-10">
                        <input type="checkbox"
                          checked={selectedComps.size === filteredComponents.length && filteredComponents.length > 0}
                          onChange={e => setSelectedComps(e.target.checked ? new Set(filteredComponents.map(d=>d.id)) : new Set())}
                          className="w-4 h-4 accent-[#1F53BE] cursor-pointer"/>
                      </th>
                      {["序号","构件编号","构件名称","单位工程","分部工程","分项工程","当前状态"].map(h=>(
                        <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                      {filteredComponents.map((d,i)=>{
                        const sc = d.status==="已完成"?"bg-green-100 text-green-700":d.status==="进行中"?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-500";
                        const isChecked = selectedComps.has(d.id);
                        return (
                          <tr key={d.id} className={`border-b border-gray-100 hover:bg-gray-50/60 ${isChecked?"bg-blue-50/30":i%2===0?"bg-white":"bg-gray-50/20"}`}>
                            <td className="px-3 py-2.5"><input type="checkbox" checked={isChecked} onChange={e => setSelectedComps(prev => {
                              const next = new Set(prev);
                              if (e.target.checked) next.add(d.id);
                              else next.delete(d.id);
                              return next;
                            })} className="w-4 h-4 accent-[#1F53BE] cursor-pointer"/></td>
                            <td className="px-4 py-2.5 text-gray-600">{i+1}</td>
                            <td className="px-4 py-2.5 text-gray-800 font-medium">{d.id}</td>
                            <td className="px-4 py-2.5 text-gray-800">{d.name}</td>
                            <td className="px-4 py-2.5 text-gray-600">{d.unit}</td>
                            <td className="px-4 py-2.5 text-gray-600">{d.dept}</td>
                            <td className="px-4 py-2.5">{d.item}</td>
                            <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-[11px] font-medium ${sc}`}>{d.status}</span></td>

                          </tr>
                        );
                      })}
                      {filteredComponents.length===0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-gray-400">暂无构件数据</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </div>
      )

      {/* 批量调整状态 Modal */}
      <Modal open={batchModal.open} onClose={()=>setBatchModal(p=>({...p,open:false}))} title="调整状态" width="480px"
        footer={<ModalFooter onCancel={()=>setBatchModal(p=>({...p,open:false}))} onConfirm={()=>{
          setCompDataState(prev=>prev.map(c=>batchModal.ids.includes(c.id)?{...c,status:batchModal.newStatus}:c));
          setBatchModal(p=>({...p,open:false}));
          setSelectedComps(new Set());
        }} confirmText="确认调整"/>}>
        <div className="flex flex-col gap-5 py-1">
          <div>
            <div className="text-[12px] text-gray-500 mb-2">已选择构件</div>
            <div className="flex flex-wrap gap-1.5">
              {batchModal.ids.map(id=>{
                const comp = compDataState.find(c=>c.id===id);
                return comp ? (
                  <span key={id} className="text-[12px] px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">{comp.name}</span>
                ) : null;
              })}
            </div>
          </div>
          <div>
            <div className="text-[12px] text-gray-500 mb-3">调整为</div>
            <div className="flex gap-2">
              {["未开始","进行中","已完成","已延期"].map(s=>(
                <button key={s} onClick={()=>setBatchModal(p=>({...p,newStatus:s}))}
                  className={`px-4 py-2 text-[12px] rounded-lg border transition-colors cursor-pointer ${batchModal.newStatus===s?"bg-[#1F53BE] text-white border-[#1F53BE]":"bg-white text-gray-600 border-gray-200 hover:border-[#1F53BE]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* 构件详情 Modal */}
      <Modal open={compDetail.open} onClose={()=>setCompDetail(p=>({...p,open:false}))} title="构件详情" width="500px">
        {compDetail.data && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Cubes size={20} className="text-[#1F53BE]"/>
              </div>
              <div>
                <div className="text-[14px] font-semibold text-gray-800">{compDetail.data.name}</div>
                <div className="text-[12px] text-gray-500">编号：{compDetail.data.id}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[11px] text-gray-400 mb-1">所属单位工程</div>
                <div className="text-[13px] text-gray-800">{compDetail.data.unit}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[11px] text-gray-400 mb-1">所属分部工程</div>
                <div className="text-[13px] text-gray-800">{compDetail.data.dept}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[11px] text-gray-400 mb-1">所属分项工程</div>
                <div className="text-[13px] text-gray-800">{compDetail.data.item}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[11px] text-gray-400 mb-1">当前状态</div>
                <div className={`text-[13px] ${compDetail.data.status==="已完成"?"text-green-600":compDetail.data.status==="进行中"?"text-blue-600":"text-gray-600"}`}>
                  {compDetail.data.status}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[11px] text-gray-400 mb-1">关联说明</div>
              <div className="text-[13px] text-gray-700">{compDetail.data.desc || "-"}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* 构件编辑/新增 Modal */}
      <Modal open={compForm.open} onClose={()=>setCompForm(p=>({...p,open:false}))} title={compForm.data?"编辑构件":"新增构件"} width="500px"
        footer={<ModalFooter onCancel={()=>setCompForm(p=>({...p,open:false}))} onConfirm={()=>{
          if(compForm.data){
            setCompDataState(prev=>prev.map(c=>c.id===compForm.data.id?{...c,...compForm.data}:c));
          }else{
            setCompDataState(prev=>[...prev,{...compForm.data,id:`COMP-${Date.now()}`,status:"未开始"}]);
          }
          setCompForm(p=>({...p,open:false}));
        }} confirmText="保存"/>}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">构件编号</label>
            <input type="text" value={compForm.data?.id || ""} onChange={e => setCompForm(p=>({...p,data:{...p.data,id:e.target.value}}))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">构件名称</label>
            <input type="text" value={compForm.data?.name || ""} onChange={e => setCompForm(p=>({...p,data:{...p.data,name:e.target.value}}))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-gray-500">单位工程</label>
              <select value={compForm.data?.unit || ""} onChange={e => setCompForm(p=>({...p,data:{...p.data,unit:e.target.value}}))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500">
                <option value="">请选择</option>
                <option value="翻车机房">翻车机房</option>
                <option value="地下皮带廊">地下皮带廊</option>
                <option value="转运站">转运站</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-gray-500">分部工程</label>
              <select value={compForm.data?.dept || ""} onChange={e => setCompForm(p=>({...p,data:{...p.data,dept:e.target.value}}))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500">
                <option value="">请选择</option>
                <option value="地基与基础">地基与基础</option>
                <option value="地下主体结构">地下主体结构</option>
                <option value="主体结构">主体结构</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-gray-500">分项工程</label>
              <select value={compForm.data?.item || ""} onChange={e => setCompForm(p=>({...p,data:{...p.data,item:e.target.value}}))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500">
                <option value="">请选择</option>
                <option value="基础工程">基础工程</option>
                <option value="侧墙工程">侧墙工程</option>
                <option value="降水工程">降水工程</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">当前状态</label>
            <select value={compForm.data?.status || "未开始"} onChange={e => setCompForm(p=>({...p,data:{...p.data,status:e.target.value}}))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500">
              <option value="未开始">未开始</option>
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
              <option value="已延期">已延期</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">关联说明</label>
            <textarea value={compForm.data?.desc || ""} onChange={e => setCompForm(p=>({...p,data:{...p.data,desc:e.target.value}}))} placeholder="请输入关联说明..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 resize-none min-h-[60px] focus:outline-none focus:border-blue-500"/>
          </div>
        </div>
      </Modal>

      {/* BIM关联 Modal */}
      <Modal open={bimLinkModal.open} onClose={()=>setBimLinkModal({open:false})} title="BIM关联" width="600px"
        footer={<ModalFooter onCancel={()=>setBimLinkModal({open:false})} onConfirm={()=>setBimLinkModal({open:false})} confirmText="确认关联"/>}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">当前节点</label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg text-[13px] text-gray-700">{selectedNode.name}</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">BIM模型选择</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="">请选择BIM模型</option>
              <option value="model1">翻车机房结构模型</option>
              <option value="model2">地下皮带廊模型</option>
              <option value="model3">基坑支护模型</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">构件ID</label>
            <input type="text" placeholder="请输入构件ID或选择模型后自动关联" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="text-[12px] text-blue-700">
              <span className="font-medium">提示：</span>选择BIM模型后，系统将自动关联对应的构件信息。
            </div>
          </div>
        </div>
      </Modal>

      {/* WBS配置相关 Modal */}
      <Modal open={wbsModal.open} onClose={()=>setWbsModal({open:false})} title={wbsModal.mode==="add"?"新增节点":"编辑节点"} width="500px"
        footer={<ModalFooter onCancel={()=>setWbsModal({open:false})} onConfirm={()=>setWbsModal({open:false})} confirmText="保存"/>}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">节点名称</label>
            <input type="text" placeholder="请输入节点名称" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">计划开始时间</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">计划结束时间</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── PAGE: EARLY WARNING ─────────────────────────────────────────────────────
function EarlyWarningPage() {
  const [activeTab, setActiveTab] = useState("wbs");
  const [viewDrawer, setViewDrawer] = useState<{open:boolean;item?:typeof wbsWarningData[0]}>({open:false});
  const [handleModal, setHandleModal] = useState<{open:boolean;item?:typeof wbsWarningData[0]}>({open:false});
  const [closeModal, setCloseModal] = useState<{open:boolean;item?:typeof wbsWarningData[0]}>({open:false});
  const [handleStatus, setHandleStatus] = useState("处理中");
  const [handleDesc, setHandleDesc] = useState("");

  const [selectedNode, setSelectedNode] = useState<{id:string; name:string; type:string; unit?:string; dept?:string}>({ id: "project-1", name: "淄海铁路项目", type: "project" });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["project-1", "unit-1", "dept-1-1", "dept-1-2"]));
  const [searchText, setSearchText] = useState("");
  const [showOnlyWarning, setShowOnlyWarning] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [childNodeSearch, setChildNodeSearch] = useState("");

  const [wbsFilters, setWbsFilters] = useState({
    code: "",
    warnType: "",
    level: "",
    owner: "",
    handleStatus: "",
  });

  const [stageFilters, setStageFilters] = useState({
    stageName: "",
    warnType: "",
    level: "",
    owner: "",
    handleStatus: "",
  });

  const filteredStageData = stageWarningData.filter(d => {
    if (stageFilters.stageName && !d.stageName.includes(stageFilters.stageName)) return false;
    if (stageFilters.warnType && d.warnType !== stageFilters.warnType) return false;
    if (stageFilters.level && d.level !== stageFilters.level) return false;
    if (stageFilters.owner && !d.owner.includes(stageFilters.owner)) return false;
    if (stageFilters.handleStatus && d.handleStatus !== stageFilters.handleStatus) return false;
    return true;
  }).sort((a, b) => {
    const typeOrder = { "已延期": 0, "未按期开工": 1, "临期未完成": 2 };
    return (typeOrder[a.warnType] || 99) - (typeOrder[b.warnType] || 99) || new Date(b.warnTime).getTime() - new Date(a.warnTime).getTime();
  });

  const handleResetStage = () => setStageFilters({ stageName: "", warnType: "", level: "", owner: "", handleStatus: "" });

  const totalWarning = stageWarningData.length + wbsWarningData.length;
  const stageWarningCount = stageWarningData.length;
  const wbsWarningCount = wbsWarningData.length;
  const unhandledCount = [...stageWarningData, ...wbsWarningData].filter(d => d.handleStatus === "未处理").length;
  const handledCount = [...stageWarningData, ...wbsWarningData].filter(d => d.handleStatus === "已处理" || d.handleStatus === "已关闭").length;

  const getCurrentScopePath = () => {
    if (selectedNode.type === "item") {
      return `${selectedNode.unit} / ${selectedNode.dept} / ${selectedNode.name}`;
    }
    if (selectedNode.type === "dept") {
      return `${selectedNode.unit} / ${selectedNode.name}`;
    }
    return selectedNode.name;
  };

  const getChildNodesForWarning = () => {
    const findNode = (nodes: any[], id: string): any => {
      for (const n of nodes) {
        if (n.id === id) return n;
        if (n.children) {
          const found = findNode(n.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    const currentNode = findNode(wbsTreeData, selectedNode?.id);
    return currentNode?.children || [];
  };

  const filteredWbsData = wbsWarningData.filter(d => {
    if (selectedNode.type === "unit" && d.unit !== selectedNode.name) return false;
    if (selectedNode.type === "dept" && (d.unit !== selectedNode.unit || d.dept !== selectedNode.name)) return false;
    if (selectedNode.type === "item" && (d.unit !== selectedNode.unit || d.dept !== selectedNode.dept || d.target !== selectedNode.name)) return false;
    if (wbsFilters.code && !d.code.includes(wbsFilters.code)) return false;
    if (wbsFilters.warnType && d.warnType !== wbsFilters.warnType) return false;
    if (wbsFilters.level && d.level !== wbsFilters.level) return false;
    if (wbsFilters.owner && !d.owner.includes(wbsFilters.owner)) return false;
    if (wbsFilters.handleStatus && d.handleStatus !== wbsFilters.handleStatus) return false;
    return true;
  }).sort((a, b) => {
    const typeOrder = { "已延期": 0, "未按期开工": 1, "临期未完成": 2 };
    return (typeOrder[a.warnType] || 99) - (typeOrder[b.warnType] || 99) || new Date(b.warnTime).getTime() - new Date(a.warnTime).getTime();
  });

  const statData = {
    total: filteredWbsData.length,
    notStarted: filteredWbsData.filter(d => d.warnType === "未按期开工").length,
    nearDeadline: filteredWbsData.filter(d => d.warnType === "临期未完成").length,
    delayed: filteredWbsData.filter(d => d.warnType === "已延期").length,
  };

  const handleNodeSelect = (node: any) => {
    let unit = selectedNode.unit;
    let dept = selectedNode.dept;
    if (node.type === "unit") {
      unit = node.name;
      dept = undefined;
    } else if (node.type === "dept") {
      dept = node.name;
    }
    setSelectedNode({
      id: node.id,
      name: node.name,
      type: node.type,
      unit,
      dept,
    });
    if (node.children) {
      setExpandedNodes(prev => {
        const next = new Set(prev);
        next.add(node.id);
        return next;
      });
    }
  };

  const handleResetWbs = () => setWbsFilters({ code: "", warnType: "", level: "", owner: "", handleStatus: "" });

  const handleView = (item: typeof wbsWarningData[0]) => {
    setViewDrawer({ open: true, item });
  };

  const handleOpenHandleModal = (item: typeof wbsWarningData[0]) => {
    setHandleStatus("处理中");
    setHandleDesc("");
    setHandleModal({ open: true, item });
  };

  const handleOpenCloseModal = (item: typeof wbsWarningData[0]) => {
    setCloseModal({ open: true, item });
  };

  const handleConfirmClose = () => {
    setCloseModal(p => ({ ...p, open: false }));
  };

  const handleSubmitHandle = () => {
    setHandleModal(p => ({ ...p, open: false }));
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex border-b border-gray-200">
          {[
            { id: "stage", label: "施工阶段预警" },
            { id: "wbs", label: "WBS工期预警" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id ? "text-[#1F53BE] border-[#1F53BE]" : "text-slate-500 border-transparent hover:text-[#1F53BE] hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "stage" && (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <div className="bg-white border border-gray-200 rounded-xl flex flex-col flex-1 overflow-hidden flex-shrink-0">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <FItem label="阶段名称"><input type="text" value={stageFilters.stageName} onChange={e => setStageFilters(p => ({ ...p, stageName: e.target.value }))} placeholder="请输入阶段名称" className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500"/></FItem>
                <FItem label="预警类型">
                  <select value={stageFilters.warnType} onChange={e => setStageFilters(p => ({ ...p, warnType: e.target.value }))} className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer">
                    <option value="">全部类型</option>
                    <option value="未按期开工">未按期开工</option>
                    <option value="临期未完成">临期未完成</option>
                    <option value="已延期">已延期</option>
                  </select>
                </FItem>

                <div className="ml-auto flex gap-2">
                  <Btn variant="primary"><Search size={13}/>查询</Btn>
                  <Btn onClick={handleResetStage}><RefreshCw size={13}/>重置</Btn>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {[{label:"序号",width:"60px"},{label:"预警编号",width:"140px"},{label:"施工阶段",width:"180px"},{label:"计划开始时间",width:"120px"},{label:"计划完成时间",width:"120px"},{label:"当前状态",width:"90px"},{label:"预警类型",width:"110px"},{label:"是否启动预警",width:"110px"},{label:"是否大屏展示",width:"110px"}].map((h,i) => (
                      <th key={i} style={{ width: h.width }} className="bg-slate-50 px-4 py-2.5 text-left text-xs font-semibold text-slate-500 border-b border-gray-200 sticky top-0 z-10 whitespace-nowrap">{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStageData.map((e,i) => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 text-[13px] text-gray-700 border-b border-gray-100">{i+1}</td>
                      <td className="px-4 py-2.5 text-[13px] text-gray-700 border-b border-gray-100 font-medium">{e.code}</td>
                      <td className="px-4 py-2.5 text-[13px] text-gray-700 border-b border-gray-100">{e.stageName}</td>
                      <td className="px-4 py-2.5 text-[13px] text-gray-700 border-b border-gray-100">{e.planStart}</td>
                      <td className="px-4 py-2.5 text-[13px] text-gray-700 border-b border-gray-100">{e.planEnd}</td>
                      <td className="px-4 py-2.5 border-b border-gray-100"><CustomStatusTag status={e.status} type="current"/></td>
                      <td className="px-4 py-2.5 border-b border-gray-100"><CustomStatusTag status={e.warnType}/></td>
                      <td className="px-4 py-2.5 border-b border-gray-100"><span className={`px-2 py-0.5 rounded text-[12px] font-medium ${e.warnEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{e.warnEnabled ? "已启动" : "未启动"}</span></td>
                      <td className="px-4 py-2.5 border-b border-gray-100"><button className={`relative w-9 h-4 rounded-full transition-colors cursor-pointer ${e.bigscreen ? "bg-green-500" : "bg-gray-300"}`} onClick={() => {}}><span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${e.bigscreen ? "left-5" : "left-0.5"}`}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStageData.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">暂无数据</div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 flex-shrink-0">
              <span className="text-xs text-slate-400 mr-2">共 {filteredStageData.length} 条</span>
              <button className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-500 hover:bg-gray-50 cursor-pointer">上一页</button>
              <button className="px-3 py-1 text-xs border rounded bg-[#0052cc] text-white border-[#0052cc]">1</button>
              <button className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-500 hover:bg-gray-50 cursor-pointer">下一页</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "wbs" && (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[340px] bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex-shrink-0 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">WBS结构</span>
              <button onClick={() => setSelectedNode({ id: "project-1", name: "淄海铁路项目", type: "project" })} className="px-3 py-1 text-xs bg-[#1F53BE] text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">全部预警</button>
            </div>
            <WbsTree data={wbsTreeData} selectedNode={selectedNode} onSelect={handleNodeSelect} expandedNodes={expandedNodes} onToggleExpanded={id => setExpandedNodes(prev => {
              const next = new Set(prev);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            })} searchText={searchText} showOnlyWarning={showOnlyWarning} filterType={filterType} onFilterChange={setFilterType}/>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 p-4">
            <div className="bg-white border border-gray-200 rounded-xl flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <span className="text-[14px] font-semibold text-gray-800">预警列表</span>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="text" value={childNodeSearch} onChange={e => setChildNodeSearch(e.target.value)} placeholder="输入节点名称搜索" className="w-48 pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400"/>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                      <th className="px-4 py-3 w-8"><input type="checkbox" className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-500"/></th>
                      {[{label:"序号",width:"60px"},{label:"预警编码",width:"130px"},{label:"节点名称",width:"200px"},{label:"节点类型",width:"100px"},{label:"计划开始时间",width:"120px"},{label:"计划结束时间",width:"120px"},{label:"当前状态",width:"100px"},{label:"预警类型",width:"100px"},{label:"是否大屏展示",width:"100px"}].map((h,i) => (
                        <th key={i} style={{ width: h.width }} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getChildNodesForWarning().filter(n => n.warnId && (!childNodeSearch || n.name.includes(childNodeSearch))).map((n,i) => {
                      const warnInfo = wbsWarningData.find(w => w.id === n.warnId);
                      return (
                        <tr key={n.id} className={`border-b border-gray-100 hover:bg-gray-50/60 ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                          <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-500"/></td>
                          <td className="px-4 py-3 text-gray-500">{i+1}</td>
                          <td className="px-4 py-3 text-gray-700 font-medium">{warnInfo?.code || "-"}</td>
                          <td className="px-4 py-3 text-gray-800 font-medium">{n.name}</td>
                          <td className="px-4 py-3 text-gray-700">{warnInfo?.nodeType || "-"}</td>
                          <td className="px-4 py-3 text-gray-700">{warnInfo?.planStart || "-"}</td>
                          <td className="px-4 py-3 text-gray-700">{warnInfo?.planEnd || "-"}</td>
                          <td className="px-4 py-3"><CustomStatusTag status={warnInfo?.status || "-"} type="current"/></td>
                          <td className="px-4 py-3"><CustomStatusTag status={warnInfo?.warnType || "-"}/></td>
                          <td className="px-4 py-3"><button className={`relative w-9 h-4 rounded-full transition-colors cursor-pointer ${warnInfo?.bigscreen ? "bg-green-500" : "bg-gray-300"}`} onClick={() => {}}><span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${warnInfo?.bigscreen ? "left-5" : "left-0.5"}`}/></button></td>
                        </tr>
                      );
                    })}
                    {getChildNodesForWarning().filter(n => n.warnId).length === 0 && (
                      <tr><td colSpan={10} className="px-4 py-10 text-center text-gray-400">暂无预警数据</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <Drawer open={viewDrawer.open} onClose={() => setViewDrawer(p => ({ ...p, open: false }))} title="WBS工期预警详情">
        {viewDrawer.item && (() => {
          const item = viewDrawer.item as any;
          return (
            <div className="space-y-5">
              <FSec title="基本信息">
                <DetailRow label="预警编号" value={item.code}/>
                <DetailRow label="预警对象" value={item.target}/>
                <DetailRow label="所属单位工程" value={item.unit}/>
                <DetailRow label="所属分部工程" value={item.dept}/>
                <DetailRow label="所属分项工程" value={item.item}/>
                <DetailRow label="负责人" value={item.owner}/>
              </FSec>
              <FSec title="计划信息">
                <DetailRow label="计划开始时间" value={item.planStart}/>
                <DetailRow label="计划完成时间" value={item.planEnd}/>
                <DetailRow label="当前状态" value={<CustomStatusTag status={item.status} type="current"/>}/>
                <DetailRow label="剩余天数/逾期天数" value={item.timeInfo}/>
              </FSec>
              <FSec title="进度信息">
                <DetailRow label="实际进度" value={<ProgressBar value={item.progress}/>}/>
                <DetailRow label="已完成构件数" value={item.completedCount}/>
                <DetailRow label="关联构件总数" value={item.totalCount > 0 ? item.totalCount : "未关联"}/>
              </FSec>
              <FSec title="预警信息">
                <DetailRow label="预警类型" value={<CustomStatusTag status={item.warnType}/>}/>
                <DetailRow label="预警等级" value={<CustomStatusTag status={item.level} type="level"/>} highlight={item.level === "重大"}/>
                <DetailRow label="预警生成时间" value={item.warnTime}/>
              </FSec>
              <FSec title="判断依据">
                <div className="text-[13px] text-gray-700 bg-gray-50 rounded-lg p-3">
                  {item.reason}
                </div>
              </FSec>
              <FSec title="处理信息">
                <DetailRow label="处理状态" value={<CustomStatusTag status={item.handleStatus} type="handle"/>}/>
              </FSec>
            </div>
          );
        })()}
      </Drawer>

      <Modal open={handleModal.open} onClose={() => setHandleModal(p => ({ ...p, open: false }))} title="处理工期预警" width="480px" footer={
        <>
          <Btn onClick={() => setHandleModal(p => ({ ...p, open: false }))}>取消</Btn>
          <Btn variant="primary" onClick={handleSubmitHandle}>确认</Btn>
        </>
      }>
        {handleModal.item && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-600">预警对象</label>
              <input type="text" defaultValue={handleModal.item.target} disabled className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400 w-full"/>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-600">处理状态 <span className="text-red-500">*</span></label>
              <select value={handleStatus} onChange={e => setHandleStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 appearance-none bg-white w-full cursor-pointer">
                <option value="处理中">处理中</option>
                <option value="已处理">已处理</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-600">处理说明 <span className="text-red-500">*</span></label>
              <textarea value={handleDesc} onChange={e => setHandleDesc(e.target.value)} placeholder="请输入处理说明" rows={4} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 resize-y w-full"/>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={closeModal.open} onClose={() => setCloseModal(p => ({ ...p, open: false }))} title="确认关闭" width="400px" footer={
        <>
          <Btn onClick={() => setCloseModal(p => ({ ...p, open: false }))}>取消</Btn>
          <Btn variant="danger" onClick={handleConfirmClose}>确认关闭</Btn>
        </>
      }>
        <div className="py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-yellow-600"/>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-800">确认关闭预警</p>
              <p className="text-sm text-gray-500">关闭后将不再显示该预警信息</p>
            </div>
          </div>
          <p className="text-[13px] text-gray-600">确认关闭该条工期预警吗？</p>
          {closeModal.item && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">预警编号</p>
              <p className="text-sm text-gray-700 font-medium">{closeModal.item.code}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

// ─── PAGE: WATER LEVEL ───────────────────────────────────────────────────────
// ─── DATA: PIT CAMERA ────────────────────────────────────────────────────────
const pitCameraData = [
  {
    id: "PC001", name: "翻车机房基坑北区", zone: "翻车机房", location: "北侧支护段", status: "在线",
    cameraCount: 4, recordStatus: "录像中", lastUpdate: "2026-07-09 14:32:18",
    depth: { val: 12.5, max: 15, unit: "m", label: "基坑深度" },
    waterLevel: { val: 8.2, max: 15, unit: "m", label: "水位深度" },
    settlement: { val: 3.8, max: 30, unit: "mm", label: "地表沉降" },
    displacement: { val: 5.2, max: 40, unit: "mm", label: "水平位移" },
    axialForce: { val: 320, max: 500, unit: "kN", label: "支撑轴力" },
    deformation: { val: 6.1, max: 50, unit: "mm", label: "围护变形" },
    alarmLevel: "正常",
  },
  {
    id: "PC002", name: "翻车机房基坑南区", zone: "翻车机房", location: "南侧支护段", status: "在线",
    cameraCount: 4, recordStatus: "录像中", lastUpdate: "2026-07-09 14:31:55",
    depth: { val: 13.1, max: 15, unit: "m", label: "基坑深度" },
    waterLevel: { val: 9.0, max: 15, unit: "m", label: "水位深度" },
    settlement: { val: 7.4, max: 30, unit: "mm", label: "地表沉降" },
    displacement: { val: 12.3, max: 40, unit: "mm", label: "水平位移" },
    axialForce: { val: 410, max: 500, unit: "kN", label: "支撑轴力" },
    deformation: { val: 14.5, max: 50, unit: "mm", label: "围护变形" },
    alarmLevel: "预警",
  },
  {
    id: "PC003", name: "地下皮带廊基坑东段", zone: "地下皮带廊", location: "东段起点段", status: "在线",
    cameraCount: 3, recordStatus: "录像中", lastUpdate: "2026-07-09 14:30:44",
    depth: { val: 8.6, max: 12, unit: "m", label: "基坑深度" },
    waterLevel: { val: 5.1, max: 12, unit: "m", label: "水位深度" },
    settlement: { val: 2.1, max: 30, unit: "mm", label: "地表沉降" },
    displacement: { val: 3.7, max: 40, unit: "mm", label: "水平位移" },
    axialForce: { val: 180, max: 400, unit: "kN", label: "支撑轴力" },
    deformation: { val: 4.2, max: 50, unit: "mm", label: "围护变形" },
    alarmLevel: "正常",
  },
  {
    id: "PC004", name: "地下皮带廊基坑西段", zone: "地下皮带廊", location: "西段终点段", status: "离线",
    cameraCount: 3, recordStatus: "离线", lastUpdate: "2026-07-09 08:14:02",
    depth: { val: 8.6, max: 12, unit: "m", label: "基坑深度" },
    waterLevel: { val: 5.5, max: 12, unit: "m", label: "水位深度" },
    settlement: { val: 1.9, max: 30, unit: "mm", label: "地表沉降" },
    displacement: { val: 2.8, max: 40, unit: "mm", label: "水平位移" },
    axialForce: { val: 165, max: 400, unit: "kN", label: "支撑轴力" },
    deformation: { val: 3.5, max: 50, unit: "mm", label: "围护变形" },
    alarmLevel: "正常",
  },
  {
    id: "PC005", name: "东侧支护结构监测区", zone: "基坑支护工程", location: "东侧支护桩区域", status: "在线",
    cameraCount: 2, recordStatus: "录像中", lastUpdate: "2026-07-09 14:32:05",
    depth: { val: 10.2, max: 14, unit: "m", label: "基坑深度" },
    waterLevel: { val: 6.8, max: 14, unit: "m", label: "水位深度" },
    settlement: { val: 4.5, max: 30, unit: "mm", label: "地表沉降" },
    displacement: { val: 8.9, max: 40, unit: "mm", label: "水平位移" },
    axialForce: { val: 285, max: 450, unit: "kN", label: "支撑轴力" },
    deformation: { val: 9.3, max: 50, unit: "mm", label: "围护变形" },
    alarmLevel: "注意",
  },
  {
    id: "PC006", name: "基坑降水监测点综合", zone: "降水工程", location: "全场区降水井群", status: "在线",
    cameraCount: 6, recordStatus: "录像中", lastUpdate: "2026-07-09 14:32:20",
    depth: { val: 11.0, max: 15, unit: "m", label: "基坑深度" },
    waterLevel: { val: 7.3, max: 15, unit: "m", label: "水位深度" },
    settlement: { val: 5.2, max: 30, unit: "mm", label: "地表沉降" },
    displacement: { val: 6.8, max: 40, unit: "mm", label: "水平位移" },
    axialForce: { val: 342, max: 500, unit: "kN", label: "支撑轴力" },
    deformation: { val: 7.8, max: 50, unit: "mm", label: "围护变形" },
    alarmLevel: "正常",
  },
];

// Simulated camera thumbnail SVG for a construction pit
function PitCamThumbnail({ status, alarmLevel }: { status: string; alarmLevel: string }) {
  const isOnline = status === "在线";
  const dotColor = alarmLevel === "预警" ? "#ef4444" : alarmLevel === "注意" ? "#f59e0b" : "#22c55e";
  return (
    <div className="w-full h-full relative">
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="150" fill={isOnline ? "#1a1a2e" : "#2a2a2a"}/>
        <rect x="0" y="55" width="200" height="95" fill={isOnline ? "#16213e" : "#222"}/>
        <polygon points="15,55 40,110 160,110 185,55" fill={isOnline ? "#0f3460" : "#333"} stroke={isOnline?"#1e5f74":"#555"} strokeWidth="1"/>
        <rect x="40" y="110" width="120" height="8" fill={isOnline?"#0d2137":"#2a2a2a"}/>
        <line x1="40" y1="75" x2="160" y2="75" stroke={isOnline?"#e94560":"#888"} strokeWidth="3"/>
        <line x1="40" y1="95" x2="160" y2="95" stroke={isOnline?"#e94560":"#888"} strokeWidth="3"/>
        <rect x="38" y="55" width="4" height="63" fill={isOnline?"#c84b31":"#666"}/>
        <rect x="158" y="55" width="4" height="63" fill={isOnline?"#c84b31":"#666"}/>
        {isOnline && <line x1="45" y1="100" x2="155" y2="100" stroke="#00b4d8" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.8"/>}
        {isOnline && (
          <g transform="translate(85,88)">
            <circle cx="0" cy="-8" r="4" fill="#ffd166"/>
            <rect x="-3" y="-4" width="6" height="10" rx="1" fill="#06d6a0"/>
            <line x1="0" y1="-4" x2="-6" y2="2" stroke="#06d6a0" strokeWidth="1.5"/>
            <line x1="0" y1="-4" x2="6" y2="2" stroke="#06d6a0" strokeWidth="1.5"/>
          </g>
        )}
        {isOnline ? (
          <>
            <rect x="2" y="2" width="12" height="12" fill="none" stroke="#00b4d8" strokeWidth="1"/>
            <rect x="186" y="2" width="12" height="12" fill="none" stroke="#00b4d8" strokeWidth="1"/>
            <rect x="2" y="136" width="12" height="12" fill="none" stroke="#00b4d8" strokeWidth="1"/>
            <rect x="186" y="136" width="12" height="12" fill="none" stroke="#00b4d8" strokeWidth="1"/>
            <circle cx="100" cy="75" r="8" fill="none" stroke="#00b4d8" strokeWidth="1" opacity="0.6"/>
            <line x1="96" y1="75" x2="104" y2="75" stroke="#00b4d8" strokeWidth="0.8" opacity="0.6"/>
            <line x1="100" y1="71" x2="100" y2="79" stroke="#00b4d8" strokeWidth="0.8" opacity="0.6"/>
            <text x="4" y="148" fill="#00b4d8" fontSize="7" fontFamily="monospace">REC</text>
            <text x="130" y="148" fill="#9ca3af" fontSize="7" fontFamily="monospace">14:32:18</text>
          </>
        ) : (
          <>
            <text x="100" y="70" fill="#6b7280" fontSize="12" textAnchor="middle">NO SIGNAL</text>
            <text x="100" y="88" fill="#4b5563" fontSize="8" textAnchor="middle">摄像头离线</text>
          </>
        )}
      </svg>
      {isOnline && (
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: dotColor }}/>
      )}
    </div>
  );
}

// Full-screen camera view (2x2 grid simulation)
function CameraFeedModal({ item, onClose }: { item: typeof pitCameraData[0]; onClose: ()=>void }) {
  const views = [
    { name: `${item.name} #1`, angle: "俯视全景" },
    { name: `${item.name} #2`, angle: "东侧壁" },
    { name: `${item.name} #3`, angle: "西侧壁" },
    { name: `${item.name} #4`, angle: "底部作业区" },
  ];
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col" onClick={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-gray-700 flex-shrink-0" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${item.status==="在线"?"bg-green-400 animate-pulse":"bg-red-500"}`}/>
          <span className="text-white font-semibold text-[14px]">{item.name} — 实时监控</span>
          <span className="text-gray-400 text-[12px]">共 {item.cameraCount} 路摄像头</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-[12px] font-mono">{item.lastUpdate}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1"><X size={18}/></button>
        </div>
      </div>
      {/* Camera grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1 bg-gray-800 p-1 min-h-0" onClick={e=>e.stopPropagation()}>
        {views.map((v,i)=>(
          <div key={i} className="relative bg-black overflow-hidden rounded">
            <PitCamThumbnail status={item.status} alarmLevel={item.alarmLevel}/>
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${item.status==="在线"?"bg-green-400":"bg-red-500"}`}/>
              <span className="text-white text-[11px] font-mono bg-black/60 px-1.5 py-0.5 rounded">{v.angle}</span>
            </div>
            <div className="absolute bottom-2 right-2">
              <span className="text-gray-400 text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded">CAM {String(i+1).padStart(2,"0")}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Bottom data bar */}
      <div className="flex items-center gap-6 px-5 py-2.5 bg-gray-900 border-t border-gray-700 flex-shrink-0" onClick={e=>e.stopPropagation()}>
        {[item.depth, item.waterLevel, item.settlement, item.displacement, item.axialForce, item.deformation].map((m,i)=>(
          <div key={i} className="flex items-center gap-2">
            <span className="text-gray-400 text-[11px]">{m.label}:</span>
            <span className="text-white text-[12px] font-mono font-bold">{m.val}{m.unit}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${item.alarmLevel==="预警"?"bg-red-600 text-white":item.alarmLevel==="注意"?"bg-amber-500 text-white":"bg-green-600 text-white"}`}>{item.alarmLevel}</span>
        </div>
      </div>
    </div>
  );
}

function StageConfigPage() {
  const [stageModal, setStageModal] = useState<{open:boolean;mode:"add"|"edit";item?:typeof stageData[0]}>({open:false,mode:"add"});
  const [filterStageNo, setFilterStageNo] = useState("");
  const [filterStageName, setFilterStageName] = useState("");
  const [filterStageStatus, setFilterStageStatus] = useState("");
  const [filterCurrent, setFilterCurrent] = useState("");
  const [filterOnScreen, setFilterOnScreen] = useState("");

  const filteredStages = stageData.filter(s => {
    if (filterStageNo && !s.code.includes(filterStageNo)) return false;
    if (filterStageName && !s.name.includes(filterStageName)) return false;
    if (filterStageStatus && s.status !== filterStageStatus) return false;
    if (filterCurrent === "是" && !s.current) return false;
    if (filterCurrent === "否" && s.current) return false;
    if (filterOnScreen === "是" && !s.onScreen) return false;
    if (filterOnScreen === "否" && s.onScreen) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-semibold text-gray-800">施工阶段配置</span>
          <button onClick={()=>setStageModal({open:true,mode:"add"})} className="px-3 py-1.5 text-[12px] bg-[#1F53BE] text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">新增阶段</button>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-500">阶段编号</span>
            <input type="text" value={filterStageNo} onChange={e=>setFilterStageNo(e.target.value)} placeholder="请输入阶段编号" className="px-3 py-1.5 border border-gray-200 rounded text-[12px] w-36 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-500">阶段名称</span>
            <input type="text" value={filterStageName} onChange={e=>setFilterStageName(e.target.value)} placeholder="请输入阶段名称" className="px-3 py-1.5 border border-gray-200 rounded text-[12px] w-36 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-500">状态</span>
            <select value={filterStageStatus} onChange={e=>setFilterStageStatus(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded text-[12px] w-36 focus:outline-none focus:border-blue-500 bg-white cursor-pointer">
              <option value="">全部状态</option>
              <option value="已完成">已完成</option>
              <option value="进行中">进行中</option>
              <option value="未开始">未开始</option>
            </select>
          </div>
          <button onClick={()=>{setFilterStageNo("");setFilterStageName("");setFilterStageStatus("");}} className="px-3 py-1.5 text-[12px] border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">重置</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["序号","阶段编号","阶段名称","开始日期","结束日期","持续天数","状态","当前阶段","操作"].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStages.map((s,i)=>{
                return (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                    <td className="px-4 py-2.5 text-gray-600">{i+1}</td>
                    <td className="px-4 py-2.5 text-gray-800 font-medium">{s.code}</td>
                    <td className="px-4 py-2.5 text-gray-800">{s.name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{s.start}</td>
                    <td className="px-4 py-2.5 text-gray-600">{s.end}</td>
                    <td className="px-4 py-2.5 text-gray-600">{s.duration}</td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-[11px] font-medium ${s.status==="已完成"?"bg-green-100 text-green-700":s.status==="进行中"?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-500"}`}>{s.status}</span></td>
                    <td className="px-4 py-2.5">{s.current?"是":"否"}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <button onClick={()=>setStageModal({open:true,mode:"edit",item:s})} className="text-[#1F53BE] hover:text-blue-700 text-[12px] font-medium cursor-pointer">编辑</button>
                        <button onClick={()=>{}} className="text-red-500 hover:text-red-700 text-[12px] font-medium cursor-pointer">删除</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end mt-4 gap-2">
          <span className="text-[11px] text-gray-400">共 {filteredStages.length} 条</span>
          <button className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-500 hover:bg-gray-50 cursor-pointer">上一页</button>
          <button className="px-3 py-1 text-xs border rounded bg-[#1F53BE] text-white border-[#1F53BE]">1</button>
          <button className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-500 hover:bg-gray-50 cursor-pointer">下一页</button>
        </div>
      </div>

      <Modal open={stageModal.open} onClose={()=>setStageModal(p=>({...p,open:false}))} title={stageModal.mode==="add"?"新增阶段":"编辑阶段"} width="500px"
        footer={<ModalFooter onCancel={()=>setStageModal(p=>({...p,open:false}))} onConfirm={()=>setStageModal(p=>({...p,open:false}))} confirmText="保存"/>}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">阶段编号</label>
            <input type="text" defaultValue={stageModal.item?.code || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">阶段名称</label>
            <input type="text" defaultValue={stageModal.item?.name || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-gray-500">开始日期</label>
              <input type="date" defaultValue={stageModal.item?.start || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-gray-500">结束日期</label>
              <input type="date" defaultValue={stageModal.item?.end || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">状态</label>
            <select defaultValue={stageModal.item?.status || "未开始"} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="未开始">未开始</option>
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">当前阶段</label>
            <select defaultValue={stageModal.item?.current ? "是" : "否"} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="是">是</option>
              <option value="否">否</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function WbsConfigPage() {
  const [wbsModal, setWbsModal] = useState<{open:boolean;mode:"add"|"edit";nodeType?:string}>({open:false,mode:"add"});
  const [bimLinkModal, setBimLinkModal] = useState<{open:boolean}>({open:false});
  const [searchText, setSearchText] = useState("");
  const [selectedNode, setSelectedNode] = useState<{id:string; name:string; type:string; unit?:string; dept?:string; planStart?:string; planEnd?:string; bimCount?:number}>({ id: "project-1", name: "淄海铁路项目", type: "project" });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["project-1", "unit-1", "dept-1-1", "dept-1-2"]));
  const [showOnlyWarning, setShowOnlyWarning] = useState(false);
  const [filterType, setFilterType] = useState("");

  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);
  };

  const getChildNodesForWarning = () => {
    const findNode = (nodes: any[], id: string): any => {
      for (const n of nodes) {
        if (n.id === id) return n;
        if (n.children) {
          const found = findNode(n.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    const currentNode = findNode(wbsTreeData, selectedNode?.id);
    return currentNode?.children || [];
  };

  return (
    <div className="flex gap-4 h-full p-4">
      <div className="w-[340px] bg-white border border-gray-200 rounded-xl p-4 flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-semibold text-gray-800">WBS结构</span>
        </div>
        <div className="p-3 border border-gray-100 bg-gray-50/50 rounded-lg mb-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="搜索WBS节点" className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-1">
          <WbsTree data={wbsTreeData} selectedNode={selectedNode} onSelect={handleNodeSelect} expandedNodes={expandedNodes} onToggleExpanded={id => setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
          })} searchText={searchText} showOnlyWarning={false} filterType={filterType} onFilterChange={setFilterType}/>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-semibold text-gray-800">节点详情</span>
          <div className="flex items-center gap-2">
            <button onClick={()=>setWbsModal({open:true,mode:"edit",nodeType:selectedNode.type})} className="px-3 py-1.5 text-[12px] bg-[#1F53BE] text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">编辑</button>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[13px] font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">基本信息</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[11px] text-gray-400 mb-1">节点名称</div>
              <div className="text-[13px] text-gray-800 font-medium">{selectedNode.name}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[11px] text-gray-400 mb-1">节点类型</div>
              <div className="text-[13px] text-gray-800">
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${selectedNode.type === "project" ? "bg-blue-100 text-blue-700" : selectedNode.type === "unit" ? "bg-green-100 text-green-700" : selectedNode.type === "dept" ? "bg-purple-100 text-purple-700" : selectedNode.type === "comp" ? "bg-gray-100 text-gray-600" : "bg-orange-100 text-orange-700"}`}>
                  {selectedNode.type === "project" ? "项目" : selectedNode.type === "unit" ? "单位工程" : selectedNode.type === "dept" ? "分部工程" : selectedNode.type === "comp" ? "构件" : "分项工程"}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[11px] text-gray-400 mb-1">计划开始时间</div>
              <div className="text-[13px] text-gray-800 font-medium">{selectedNode.planStart || "--"}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[11px] text-gray-400 mb-1">计划结束时间</div>
              <div className="text-[13px] text-gray-800 font-medium">{selectedNode.planEnd || "--"}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[13px] font-semibold text-gray-700">子节点列表</div>
            {selectedNode.type !== "comp" && (
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-[12px] border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">导入</button>
                <button className="px-3 py-1.5 text-[12px] border border-red-200 text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors">批量删除</button>
                {selectedNode.type === "item" && (
                  <button onClick={()=>setBimLinkModal({open:true})} className="px-3 py-1.5 text-[12px] border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">BIM关联</button>
                )}
                <button onClick={()=>setWbsModal({open:true,mode:"add",nodeType:selectedNode.type === "project" ? "unit" : selectedNode.type === "unit" ? "dept" : "item"})} className="px-3 py-1.5 text-[12px] bg-[#1F53BE] text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">新增子节点</button>
              </div>
            )}
          </div>
          {selectedNode.type === "comp" ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-[13px]">
              构件类型没有子节点
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto border border-gray-100 rounded-lg">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 whitespace-nowrap">
                      <input type="checkbox" className="w-3.5 h-3.5 text-[#1F53BE] rounded border-gray-300 focus:ring-[#1F53BE] cursor-pointer"/>
                    </th>
                    {[
                      "序号",
                      "节点名称",
                      "节点类型",
                      ...(selectedNode.type === "item" ? ["是否关联构件", "构件ID"] : []),
                      "计划开始时间",
                      "计划结束时间",
                      "操作"
                    ].map(h=>(
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getChildNodesForWarning().map((node, i)=>{
                    return (
                      <tr key={node.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                        <td className="px-4 py-2.5">
                          <input type="checkbox" className="w-3.5 h-3.5 text-[#1F53BE] rounded border-gray-300 focus:ring-[#1F53BE] cursor-pointer"/>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">{i+1}</td>
                        <td className="px-4 py-2.5 text-gray-800 font-medium">{node.name}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${node.type === "project" ? "bg-blue-100 text-blue-700" : node.type === "unit" ? "bg-green-100 text-green-700" : node.type === "dept" ? "bg-purple-100 text-purple-700" : node.type === "comp" ? "bg-gray-100 text-gray-600" : "bg-orange-100 text-orange-700"}`}>
                            {node.type === "project" ? "项目" : node.type === "unit" ? "单位工程" : node.type === "dept" ? "分部工程" : node.type === "comp" ? "构件" : "分项工程"}
                          </span>
                        </td>
                        {selectedNode.type === "item" && node.type === "comp" && (
                          <>
                            <td className="px-4 py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${node.hasComp ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                {node.hasComp ? "是" : "否"}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-gray-800 font-medium">{node.compId || "--"}</td>
                          </>
                        )}
                        <td className="px-4 py-2.5 text-gray-700">{node.planStart || "--"}</td>
                        <td className="px-4 py-2.5 text-gray-700">{node.planEnd || "--"}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-3">
                            <button onClick={()=>setWbsModal({open:true,mode:"edit",nodeType:node.type})} className="text-[#1F53BE] hover:text-blue-700 text-[12px] font-medium cursor-pointer">编辑</button>
                            <button className="text-red-500 hover:text-red-700 text-[12px] font-medium cursor-pointer">删除</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {getChildNodesForWarning().length === 0 && (
                    <tr>
                      <td colSpan={selectedNode.type === "item" ? 9 : 7} className="px-4 py-8 text-center text-gray-400">暂无子节点</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal open={wbsModal.open} onClose={()=>setWbsModal({open:false})} title={wbsModal.mode==="add"?"新增节点":"编辑节点"} width="500px"
        footer={<ModalFooter onCancel={()=>setWbsModal({open:false})} onConfirm={()=>setWbsModal({open:false})} confirmText="保存"/>}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">节点名称</label>
            <input type="text" placeholder="请输入节点名称" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">计划开始时间</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">计划结束时间</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
        </div>
      </Modal>

      <Modal open={bimLinkModal.open} onClose={()=>setBimLinkModal({open:false})} title="BIM关联" width="600px"
        footer={<ModalFooter onCancel={()=>setBimLinkModal({open:false})} onConfirm={()=>setBimLinkModal({open:false})} confirmText="确认关联"/>}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">当前节点</label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg text-[13px] text-gray-700">{selectedNode.name}</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">BIM模型选择</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="">请选择BIM模型</option>
              <option value="model1">翻车机房结构模型</option>
              <option value="model2">地下皮带廊模型</option>
              <option value="model3">基坑支护模型</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">构件ID</label>
            <input type="text" placeholder="请输入构件ID或选择模型后自动关联" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="text-[12px] text-blue-700">
              <span className="font-medium">提示：</span>选择BIM模型后，系统将自动关联对应的构件信息。
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function WorkpointConfigPage() {
  const [wpModal, setWpModal] = useState<{open:boolean;mode:"add"|"edit"|"view";item?:typeof workpointData[0]}>({open:false,mode:"add"});

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-semibold text-gray-800">工点配置</span>
          <button onClick={()=>setWpModal({open:true,mode:"add"})} className="px-3 py-1.5 text-[12px] bg-[#1F53BE] text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">新增工点</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["序号","工点编号","工点名称","操作"].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workpointData.map((w,i)=>{
                return (
                  <tr key={w.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                    <td className="px-4 py-2.5 text-gray-600">{i+1}</td>
                    <td className="px-4 py-2.5 text-gray-800 font-medium">{w.code}</td>
                    <td className="px-4 py-2.5 text-gray-800">{w.name}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <button onClick={()=>setWpModal({open:true,mode:"edit",item:w})} className="text-[#1F53BE] hover:text-blue-700 text-[12px] font-medium cursor-pointer">编辑</button>
                        <button onClick={()=>{}} className="text-red-500 hover:text-red-700 text-[12px] font-medium cursor-pointer">删除</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={wpModal.open} onClose={()=>setWpModal(p=>({...p,open:false}))} title={wpModal.mode==="add"?"新增工点":wpModal.mode==="edit"?"编辑工点":"工点详情"} width="500px"
        footer={<ModalFooter onCancel={()=>setWpModal(p=>({...p,open:false}))} onConfirm={()=>setWpModal(p=>({...p,open:false}))} confirmText="保存"/>}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">工点编号</label>
            <input type="text" defaultValue={wpModal.item?.code || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">工点名称</label>
            <input type="text" defaultValue={wpModal.item?.name || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function WarnRuleConfigPage() {
  const [warnRuleModal, setWarnRuleModal] = useState<{open:boolean;mode:"add"|"edit";item?:typeof warnRuleData[0]}>({open:false,mode:"add"});
  const [warnRuleData, setWarnRuleData] = useState([
    { id: 1, name: "未按期开工规则", targets: ["施工阶段", "WBS节点"], warnType: "未按期开工", threshold: 0, enabled: true },
    { id: 2, name: "临期未完成规则", targets: ["施工阶段", "WBS节点"], warnType: "临期未完成", threshold: 7, enabled: true },
    { id: 3, name: "延期规则", targets: ["施工阶段", "WBS节点"], warnType: "已延期", threshold: 0, enabled: true },
  ]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-semibold text-gray-800">工期预警规则</span>
          <button onClick={()=>setWarnRuleModal({open:true,mode:"add"})} className="px-3 py-1.5 text-[12px] bg-[#1F53BE] text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">新增规则</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["序号","规则名称","预警目标","预警类型","阈值(天)","启用状态","操作"].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {warnRuleData.map((r,i)=>{
                return (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                    <td className="px-4 py-2.5 text-gray-600">{i+1}</td>
                    <td className="px-4 py-2.5 text-gray-800 font-medium">{r.name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{r.targets.join(', ')}</td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-[11px] font-medium ${r.warnType==="已延期"?"bg-red-100 text-red-700":r.warnType==="临期未完成"?"bg-amber-100 text-amber-700":"bg-orange-100 text-orange-700"}`}>{r.warnType}</span></td>
                    <td className="px-4 py-2.5 text-gray-600">{r.threshold}</td>
                    <td className="px-4 py-2.5"><button className={`relative w-9 h-4 rounded-full transition-colors cursor-pointer ${r.enabled?"bg-green-500":"bg-gray-300"}`} onClick={()=>{setWarnRuleData(prev=>prev.map(item=>item.id===r.id?{...item,enabled:!item.enabled}:item));}}><span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${r.enabled?"left-5":"left-0.5"}`}/></button></td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <button onClick={()=>setWarnRuleModal({open:true,mode:"edit",item:r})} className="text-[#1F53BE] hover:text-blue-700 text-[12px] font-medium cursor-pointer">编辑</button>
                        <button onClick={()=>{setWarnRuleData(prev=>prev.filter(item=>item.id!==r.id));}} className="text-red-500 hover:text-red-700 text-[12px] font-medium cursor-pointer">删除</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={warnRuleModal.open} onClose={()=>setWarnRuleModal({open:false})} title={warnRuleModal.mode==="add"?"新增规则":"编辑规则"} width="500px"
        footer={<ModalFooter onCancel={()=>setWarnRuleModal({open:false})} onConfirm={()=>setWarnRuleModal({open:false})} confirmText="保存"/>}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">规则名称</label>
            <input type="text" defaultValue={warnRuleModal.item?.name || ""} placeholder="请输入规则名称" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">预警目标</label>
            <div className="flex gap-2">
              {["施工阶段", "WBS节点"].map(t=>(
                <button key={t} className={`px-4 py-2 text-[12px] rounded-lg border transition-colors cursor-pointer ${warnRuleModal.item?.targets.includes(t)?"bg-[#1F53BE] text-white border-[#1F53BE]":"bg-white text-gray-600 border-gray-200 hover:border-[#1F53BE]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">预警类型</label>
            <select defaultValue={warnRuleModal.item?.warnType || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="">请选择</option>
              <option value="未按期开工">未按期开工</option>
              <option value="临期未完成">临期未完成</option>
              <option value="已延期">已延期</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">阈值(天)</label>
            <input type="number" defaultValue={warnRuleModal.item?.threshold || 0} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PitCameraPage() {
  const [cameraModal, setCameraModal] = useState<{open:boolean;item?:typeof pitCameraData[0]}>({open:false});
  const [filterZone, setFilterZone] = useState("全部区域");
  const [filterStatus, setFilterStatus] = useState("全部");

  const online = pitCameraData.filter(d=>d.status==="在线").length;
  const alarmCount = pitCameraData.filter(d=>d.alarmLevel!=="正常").length;
  const totalCams = pitCameraData.reduce((s,d)=>s+d.cameraCount,0);

  const filtered = pitCameraData.filter(d=>{
    if (filterZone !== "全部区域" && d.zone !== filterZone) return false;
    if (filterStatus !== "全部" && d.status !== filterStatus) return false;
    return true;
  });

  function MiniBar({ val, max, warn }: { val: number; max: number; warn?: boolean }) {
    const pct = Math.min(100, Math.round(val/max*100));
    const color = warn ? (pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-blue-500") : "bg-blue-500";
    return (
      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{width:`${pct}%`}}/>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      {/* 顶部统计 */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <StatCard title="监控点总数" value={pitCameraData.length} footer="个区域" iconBg="bg-blue-100" icon={<MonitorCheck size={18} className="text-blue-600"/>}/>
        <StatCard title="在线监控" value={online} footer={`/ ${pitCameraData.length} 在线`} iconBg="bg-green-100" icon={<CheckCircle size={18} className="text-green-600"/>}/>
        <StatCard title="摄像头总数" value={totalCams} footer="路" iconBg="bg-purple-100" icon={<Eye size={18} className="text-purple-600"/>}/>
        <StatCard title="预警/注意" value={alarmCount} footer="处异常" iconBg="bg-orange-100" icon={<AlertTriangle size={18} className="text-orange-600"/>}/>
      </div>

      {/* 过滤栏 */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 flex-shrink-0">
        <span className="text-[13px] text-gray-500 font-medium">区域筛选：</span>
        {["全部区域","翻车机房","地下皮带廊","基坑支护工程","降水工程"].map(z=>(
          <button key={z} onClick={()=>setFilterZone(z)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${filterZone===z?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {z}
          </button>
        ))}
        <div className="w-px h-4 bg-gray-200 mx-1"/>
        <span className="text-[13px] text-gray-500 font-medium">状态：</span>
        {["全部","在线","离线"].map(s=>(
          <button key={s} onClick={()=>setFilterStatus(s)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${filterStatus===s?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-[12px] text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
          数据实时更新
        </div>
      </div>

      {/* 监控卡片列表 */}
      <div className="flex flex-col gap-3">
        {filtered.map(d => {
          const metrics = [d.depth, d.waterLevel, d.settlement, d.displacement, d.axialForce, d.deformation];
          const alarmColors: Record<string,string> = { 预警: "bg-red-100 text-red-700 border-red-200", 注意: "bg-amber-100 text-amber-700 border-amber-200", 正常: "bg-green-100 text-green-700 border-green-200" };
          return (
            <div key={d.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden flex transition-shadow hover:shadow-md ${d.alarmLevel==="预警"?"border-red-200":d.alarmLevel==="注意"?"border-amber-200":"border-gray-200"}`}>
              {/* 左侧摄像头预览 */}
              <div className="w-52 flex-shrink-0 relative bg-black flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <PitCamThumbnail status={d.status} alarmLevel={d.alarmLevel}/>
                </div>
                {/* 状态指示 */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 rounded px-1.5 py-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${d.status==="在线"?"bg-green-400 animate-pulse":"bg-red-500"}`}/>
                  <span className="text-[11px] text-white font-medium">{d.status}</span>
                </div>
                {/* 查看按钮 */}
                <button onClick={()=>setCameraModal({open:true,item:d})}
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 cursor-pointer">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/40">
                      <Eye size={18} className="text-white"/>
                    </div>
                    <span className="text-white text-[11px] font-medium">查看监控</span>
                  </div>
                </button>
              </div>

              {/* 右侧：标题 + 数据 */}
              <div className="flex-1 flex flex-col px-4 py-3 min-w-0">
                {/* 标题行 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-[14px]">{d.name}</span>
                    <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{d.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${alarmColors[d.alarmLevel]}`}>{d.alarmLevel}</span>
                    <button onClick={()=>setCameraModal({open:true,item:d})}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white text-[12px] font-medium hover:bg-blue-700 flex items-center gap-1">
                      <Eye size={12}/>查看监控
                    </button>
                  </div>
                </div>

                {/* 基本信息 */}
                <div className="flex items-center gap-4 mb-3 text-[12px] text-gray-500">
                  <span><MapPin size={11} className="inline mr-0.5"/>位置：{d.location}</span>
                  <span>摄像头：{d.cameraCount} 路</span>
                  <span className={`${d.recordStatus==="录像中"?"text-green-600":"text-gray-400"}`}>● {d.recordStatus}</span>
                  <span>更新：{d.lastUpdate}</span>
                </div>

                {/* 6 个监测指标 */}
                <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                  {metrics.map((m,i)=>{
                    const pct = Math.min(100, Math.round(m.val/m.max*100));
                    const isWarn = pct > 80;
                    const isCaution = pct > 60 && !isWarn;
                    return (
                      <div key={i} className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-gray-500">{m.label}（{m.unit}）</span>
                          <span className={`text-[13px] font-bold ${isWarn?"text-red-600":isCaution?"text-amber-600":"text-gray-800"}`}>{m.val}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 relative">
                          <div
                            className={`h-1.5 rounded-full transition-all ${isWarn?"bg-red-500":isCaution?"bg-amber-500":"bg-blue-500"}`}
                            style={{width:`${pct}%`}}/>
                          <span className="absolute -right-0 top-2 text-[10px] text-gray-400">{m.max}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 全屏监控弹窗 */}
      {cameraModal.open && cameraModal.item && (
        <CameraFeedModal item={cameraModal.item} onClose={()=>setCameraModal({open:false})}/>
      )}
    </div>
  );
}

const dsMap: Record<string,string> = { normal:"正常", high:"偏高", overlimit:"超限", abnormal:"数据异常" };
const dsColor: Record<string,string> = { normal:"text-green-600", high:"text-orange-500", overlimit:"text-red-600", abnormal:"text-gray-400" };
const dsBg: Record<string,string> = { normal:"border-gray-200 bg-white", high:"border-orange-200 bg-orange-50", overlimit:"border-red-200 bg-red-50", abnormal:"border-gray-200 bg-gray-50" };

// SVG 降水井示意图
function WellIcon({ status, pct }: { status: string; pct: number }) {
  const isOnline = status !== "abnormal";
  const waterColor = status === "overlimit" ? "#ef4444" : status === "high" ? "#f97316" : "#3b82f6";
  const waterH = isOnline ? Math.round(pct * 60) : 0;
  return (
    <svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* 地面 */}
      <rect x="0" y="0" width="80" height="18" fill="#d1d5db"/>
      <rect x="0" y="14" width="80" height="4" fill="#9ca3af"/>
      {/* 井管外壁 */}
      <rect x="28" y="0" width="24" height="110" rx="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
      {/* 井管内 */}
      <rect x="32" y="2" width="16" height="106" fill="#f8fafc"/>
      {/* 水体 */}
      {isOnline && waterH > 0 && (
        <rect x="32" y={108 - waterH} width="16" height={waterH} fill={waterColor} opacity="0.75"/>
      )}
      {/* 警戒线 */}
      <line x1="26" y1="45" x2="54" y2="45" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2"/>
      {/* 标准线 */}
      <line x1="26" y1="60" x2="54" y2="60" stroke="#f97316" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6"/>
      {/* 传感器线 */}
      {isOnline && <line x1="40" y1="2" x2="40" y2={108 - waterH} stroke="#6b7280" strokeWidth="0.8" strokeDasharray="1,2"/>}
      {/* 盖板 */}
      <rect x="22" y="0" width="36" height="6" rx="1" fill="#6b7280"/>
      {/* 标注 */}
      <text x="56" y="46" fill="#ef4444" fontSize="5" fontFamily="monospace">警</text>
      <text x="56" y="61" fill="#f97316" fontSize="5" fontFamily="monospace">标</text>
      {!isOnline && <text x="40" y="65" fill="#9ca3af" fontSize="7" textAnchor="middle">离线</text>}
    </svg>
  );
}

function PitMaintenancePage() {
  const [pitData, setPitData] = useState([
    { code: "WP01", name: "翻车机房基坑", controlWaterLevel: "20.00", alarmWaterLevel: "5.50" },
    { code: "WP02", name: "地下皮带廊基坑", controlWaterLevel: "17.00", alarmWaterLevel: "5.00" },
  ]);
  const [pitFormModal, setPitFormModal] = useState<{open:boolean;mode:"add"|"edit";item?:{code:string;name:string;controlWaterLevel:string;alarmWaterLevel:string};code?:string;name?:string;controlWaterLevel?:string;alarmWaterLevel?:string}>({open:false,mode:"add"});

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-semibold text-gray-800">基坑维护</span>
          <button onClick={()=>setPitFormModal({open:true,mode:"add",code:"",name:"",controlWaterLevel:"",alarmWaterLevel:""})}
            className="px-3 py-1.5 text-[12px] bg-[#1F53BE] text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">新增基坑</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["序号","基坑编码","基坑名称","标准控制水位（m）","报警水位（m）","操作"].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pitData.map((pit, i) => {
                const wellCount = wlData.filter(w => w.workpoint === pit.code).length;
                return (
                  <tr key={pit.code} className="border-b border-gray-100 hover:bg-gray-50/60">
                    <td className="px-4 py-2.5 text-gray-600">{i+1}</td>
                    <td className="px-4 py-2.5 text-gray-800 font-medium">{pit.code}</td>
                    <td className="px-4 py-2.5 text-gray-800">{pit.name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{pit.controlWaterLevel}</td>
                    <td className="px-4 py-2.5 text-gray-600">{pit.alarmWaterLevel}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <button onClick={()=>setPitFormModal({open:true,mode:"edit",item:pit,code:pit.code,name:pit.name,controlWaterLevel:pit.controlWaterLevel,alarmWaterLevel:pit.alarmWaterLevel})}
                          className="text-[#1F53BE] hover:text-blue-700 text-[12px] font-medium cursor-pointer">编辑</button>
                        <button
                          disabled={wellCount > 0}
                          onClick={() => setPitData(prev => prev.filter(p => p.code !== pit.code))}
                          className={`text-[12px] font-medium cursor-pointer ${wellCount > 0 ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:text-red-700"}`}
                          title={wellCount > 0 ? `该基坑已关联${wellCount}口水井，无法删除` : "删除"}>
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pitData.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">暂无基坑数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={pitFormModal.open} onClose={()=>setPitFormModal({open:false})} title={pitFormModal.mode==="add"?"新增基坑":"编辑基坑"} width="420px"
        footer={<ModalFooter onCancel={()=>setPitFormModal({open:false})} onConfirm={()=>{
          if(pitFormModal.mode==="add" && pitFormModal.code && pitFormModal.name){
            setPitData(prev => [...prev, {code: pitFormModal.code!, name: pitFormModal.name!, controlWaterLevel: pitFormModal.controlWaterLevel || "0.00", alarmWaterLevel: pitFormModal.alarmWaterLevel || "0.00"}]);
          } else if(pitFormModal.mode==="edit" && pitFormModal.item && pitFormModal.name){
            setPitData(prev => prev.map(p => p.code === pitFormModal.item!.code ? {...p, name: pitFormModal.name!, controlWaterLevel: pitFormModal.controlWaterLevel || "0.00", alarmWaterLevel: pitFormModal.alarmWaterLevel || "0.00"} : p));
          }
          setPitFormModal({open:false});
        }} confirmText="保存"/>}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">基坑编码</label>
            <input type="text" value={pitFormModal.code || ""} disabled={pitFormModal.mode==="edit"}
              onChange={e=>setPitFormModal(p=>({...p,code:e.target.value}))}
              placeholder="请输入基坑编码，如 WP03"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">基坑名称</label>
            <input type="text" value={pitFormModal.name || ""}
              onChange={e=>setPitFormModal(p=>({...p,name:e.target.value}))}
              placeholder="请输入基坑名称"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">标准控制水位（m）</label>
            <input type="number" step="0.01" value={pitFormModal.controlWaterLevel || ""}
              onChange={e=>setPitFormModal(p=>({...p,controlWaterLevel:e.target.value}))}
              placeholder="请输入标准控制水位"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-gray-500">报警水位（m）</label>
            <input type="number" step="0.01" value={pitFormModal.alarmWaterLevel || ""}
              onChange={e=>setPitFormModal(p=>({...p,alarmWaterLevel:e.target.value}))}
              placeholder="请输入报警水位"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function WaterLevelPage() {
  const [addModal, setAddModal] = useState(false);
  const [wellFormModal, setWellFormModal] = useState<{open:boolean;mode:"add"|"edit";item?:typeof wlData[0];code?:string;name?:string;wellType?:string;pit?:string;controlWaterLevel?:string;alarmWaterLevel?:string;sensor?:string;depth?:string;remark?:string;enabled?:boolean}>({open:false,mode:"add"});
  const [pitData, setPitData] = useState([
    { code: "WP01", name: "翻车机房基坑", controlWaterLevel: "20.00", alarmWaterLevel: "5.50" },
    { code: "WP02", name: "地下皮带廊基坑", controlWaterLevel: "17.00", alarmWaterLevel: "5.00" },
  ]);
  const waterSensorData = [
    { code: "WL-C01", name: "水位传感器01" },
    { code: "WL-C02", name: "水位传感器02" },
    { code: "WL-C03", name: "水位传感器03" },
    { code: "WL-C04", name: "水位传感器04" },
    { code: "WL-C05", name: "水位传感器05" },
    { code: "WL-C06", name: "水位传感器06" },
    { code: "WL-C07", name: "水位传感器07" },
    { code: "WL-C08", name: "水位传感器08" },
    { code: "WL-C09", name: "水位传感器09" },
    { code: "WL-C10", name: "水位传感器10" },
    { code: "WL-C11", name: "水位传感器11" },
    { code: "WL-C12", name: "水位传感器12" },
  ];
  const [warnRuleModal, setWarnRuleModal] = useState(false);
  const [detailModal, setDetailModal] = useState<{open:boolean; item?: typeof wlData[0]}>({open:false});
  const [handleModal, setHandleModal] = useState<{open:boolean; item?: typeof wlData[0]}>({open:false});
  const [handleDesc, setHandleDesc] = useState("");
  const [handlePerson, setHandlePerson] = useState("");
  // 本地已处理记录：wellId -> {time, person, desc}
  const [handledMap, setHandledMap] = useState<Record<number,{time:string;person:string;desc:string}>>({});
  const [pumpRuleModal, setPumpRuleModal] = useState(false);
  const [showPrototypeNotes, setShowPrototypeNotes] = useState(true);

  const prototypeNotes: Record<string, PrototypeNote> = {
    "field-01": {
      id: "field-01",
      type: "field",
      number: 1,
      title: "字段01：井点概要",
      description: `【位置】顶部井点编号和名称旁

【接口字段】
wellCode - 井点编码
wellName - 井点名称
pitName - 所属基坑
wellType - 井点类型
sensorCode - 关联传感器
sensorStatus - 传感器状态

【说明】
由井点详情接口返回，只读展示，不允许在详情弹窗中编辑。
展示内容包括：井点编号+名称、水位状态标签、所属基坑、井点类型、关联传感器、传感器状态。`
    },
    "status-01": {
      id: "status-01",
      type: "status",
      number: 1,
      title: "状态01：水位状态",
      description: `【位置】正常、偏高、超限、数据异常标签旁

【状态代码】
NORMAL - 正常
HIGH - 偏高
OVER_LIMIT - 超限
DATA_ABNORMAL - 数据异常

【后台判断规则】
1. 当前水位 ≤ 标准控制水位 → 正常
2. 标准控制水位 ＜ 当前水位 ＜ 报警水位 → 偏高
3. 当前水位 ≥ 报警水位 → 超限
4. 传感器离线、数据超时、数据为空、数据越界或异常跳变 → 数据异常

【优先级】
数据异常 ＞ 超限 ＞ 偏高 ＞ 正常

【颜色规则】
正常：绿色
偏高：橙色
超限：红色
数据异常：灰色

【前端职责】
根据 monitorStatus 展示，不自行判断。`
    },
    "field-02": {
      id: "field-02",
      type: "field",
      number: 2,
      title: "字段02：核心水位指标",
      description: `【字段说明】
controlLevel - 标准控制水位
alarmLevel - 报警水位
currentLevel - 当前水位

【数据来源】
当前水位取最新一条有效监测数据。
标准控制水位和报警水位来自基础配置。

【展示规则】
标准控制水位：≤{值}m，蓝色显示
报警水位：≥{值}m，橙色显示
当前水位：根据水位状态变色（正常-灰、偏高-橙、超限-红）

【不展示内容】
当前版本不展示地面标高、井口标高、当前埋深和水位换算过程。`
    },
    "field-03": {
      id: "field-03",
      type: "field",
      number: 3,
      title: "字段03：实时监测数据",
      description: `【左侧展示字段】
wellType - 井点类型
wellDepth - 井点深度
currentLevel - 当前水位
collectionTime - 采集时间
monitorStatus - 数据状态
sensorStatus - 传感器状态

【展示规则】
- 全部只读展示，不可编辑
- 当前水位根据状态变色
- 数据状态使用标签样式展示
- 传感器状态：在线（绿色）/ 离线（灰色）

【数据来源】
全部由井点详情接口返回，前端直接展示。`
    },
    "rule-01": {
      id: "rule-01",
      type: "rule",
      number: 1,
      title: "规则01：水位趋势",
      description: `【位置】右侧"水位趋势"旁

【趋势代码】
RISING - 上升
FALLING - 下降
STABLE - 平稳
NO_DATA - 暂无数据

【计算规则】
后台默认分析最近30分钟有效数据。
trendValue = 最新有效水位 - 30分钟前有效水位

按照"水位值越大表示水位越高"的口径：
- trendValue ≥ 0.05m → 上升
- trendValue ≤ -0.05m → 下降
- -0.05m ＜ trendValue ＜ 0.05m → 平稳

【暂无数据情况】
- 有效数据少于3条
- 传感器离线
- 数据超时
- 数据异常跳变
- 数据不连续

【接口返回】
trendCode - 趋势代码
trendName - 趋势名称
trendValue - 趋势值
trendPeriod - 统计周期（分钟）

【前端职责】
只展示 trendName，不自行计算。`
    },
    "field-04": {
      id: "field-04",
      type: "field",
      number: 4,
      title: "字段04：当前抽水建议",
      description: `【建议代码】
NO_PUMP - 暂无需抽水
START_PUMP - 建议启动水泵
URGENT_START - 建议尽快启动水泵
CONTINUE_PUMP - 建议继续抽水
STOP_PUMP - 建议停止水泵
CHECK_ON_SITE - 建议现场检查
UNABLE_TO_GENERATE - 暂无法生成建议
OBSERVATION_ONLY - 观测井不生成建议

【颜色规则】
暂无需抽水：绿色
建议启动：橙色
尽快启动：红色
继续抽水：蓝色
停止水泵：蓝绿色
现场检查：红色
无法生成：灰色

【前端职责】
根据 suggestionCode 展示建议名称和对应颜色，不自行判断。`
    },
    "rule-02": {
      id: "rule-02",
      type: "rule",
      number: 2,
      title: "规则02：抽水建议生成前提",
      description: `【完整建议生成条件】
1. 井点类型支持抽水
2. 已纳入水位监测
3. 已绑定水位传感器
4. 已绑定抽水泵
5. 水位数据正常
6. 水泵状态正常

【支持抽水的井点类型】
- 降水井
- 坑内管井

【观测井特殊规则】
观测井只监测水位，不生成抽水建议。
可以：展示实时水位、展示水位趋势、产生水位预警
不可以：绑定抽水泵、生成启动/继续/停止水泵建议

【判断优先级】
设备或数据异常 ＞ 抽水无效 ＞ 建议尽快启动 ＞ 建议启动 ＞ 建议继续 ＞ 建议停止 ＞ 暂无需抽水`
    },
    "field-05": {
      id: "field-05",
      type: "field",
      number: 5,
      title: "字段05：判断依据",
      description: `【接口字段】
reasonCode - 判断依据代码
reasonText - 判断依据文本

【生成规则】
判断依据由后台根据 reasonCode 和固定模板生成。
不同的 reasonCode 对应不同的文案模板。

【前端禁止事项】
- 不得自行比较水位阈值
- 不得自行拼接业务规则
- 不得自行生成抽水建议
- 不得使用大模型生成临时文案

【前端职责】
直接展示 reasonText 文本内容，使用浅色背景说明区域。`
    },
    "field-06": {
      id: "field-06",
      type: "field",
      number: 6,
      title: "字段06：生成时间",
      description: `【字段】
generatedTime - 建议生成时间

【重新计算触发条件】
以下数据变化时后台重新计算：
1. 最新水位
2. 水位趋势
3. 水泵状态
4. 传感器状态
5. 水位阈值
6. 设备绑定关系

【前端职责】
显示后台计算时间，不使用前端当前时间。
使用浅色小字展示在抽水建议区域底部。`
    }
  };

  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchLevel, setSearchLevel] = useState("");
  const [searchWellType, setSearchWellType] = useState("");
  const [searchPitName, setSearchPitName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const filteredWlData = wlData.filter(w => {
    if (!w.enabled) return false;
    if (searchCode && !w.code.toLowerCase().includes(searchCode.toLowerCase())) return false;
    if (searchName && !w.name.includes(searchName)) return false;
    if (searchType && w.dataStatus !== searchType) return false;
    if (searchLevel && w.level !== searchLevel) return false;
    if (searchWellType && w.wellType !== searchWellType) return false;
    if (searchPitName && !w.workpointName.includes(searchPitName)) return false;
    if (searchDate && !w.collectTime.startsWith(searchDate)) return false;
    return true;
  });

  const enabledWlData = wlData.filter(w => w.enabled);
  const total = enabledWlData.length;
  const normal = enabledWlData.filter(w=>w.dataStatus==="normal").length;
  const alarm = enabledWlData.filter(w=>w.dataStatus==="high"||w.dataStatus==="overlimit"||w.dataStatus==="abnormal").length;
  const highCount = enabledWlData.filter(w=>w.dataStatus==="high").length;
  const overlimitCount = enabledWlData.filter(w=>w.dataStatus==="overlimit").length;
  const abnormalCount = enabledWlData.filter(w=>w.dataStatus==="abnormal").length;
  const monitoredCount = enabledWlData.filter(w => w.sensor).length;
  const unmonitoredCount = enabledWlData.filter(w => !w.sensor).length;

  const getRelatedPump = (code: string) => {
    return pumpData.find(p => p.well === code) || null;
  };

  const isAlarm = (w: typeof wlData[0]) => w.dataStatus==="high" || w.dataStatus==="overlimit";

  function confirmHandle() {
    if (!handleModal.item) return;
    const now = new Date().toLocaleString("zh-CN",{hour12:false}).replace(/\//g,"-");
    setHandledMap(p => ({...p, [handleModal.item!.id]: {time:now, person:handlePerson||"当前用户", desc:handleDesc}}));
    setHandleDesc("");
    setHandlePerson("");
    setHandleModal({open:false});
  }

  const statusCfg: Record<string,{label:string;color:string;bg:string;dot:string;border:string}> = {
    normal:   { label:"正常",     color:"text-green-600",  bg:"bg-green-50",  dot:"bg-green-400",  border:"border-gray-200" },
    high:     { label:"偏高",     color:"text-orange-600", bg:"bg-orange-50", dot:"bg-orange-400", border:"border-orange-300" },
    overlimit:{ label:"超限",     color:"text-red-600",    bg:"bg-red-50",    dot:"bg-red-500",    border:"border-red-400" },
    abnormal: { label:"数据异常", color:"text-gray-400",   bg:"bg-gray-50",   dot:"bg-gray-300",   border:"border-gray-200" },
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

      {/* ── 顶部三项统计 ── */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Droplets size={20} className="text-blue-500"/>
          </div>
          <div>
            <div className="text-2xl font-bold leading-tight text-gray-900">{total}</div>
            <div className="text-[12px] text-gray-500 font-medium">井点总数</div>
            <div className="text-[11px] text-gray-400">已监测{monitoredCount} · 未监测{unmonitoredCount}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={20} className="text-green-500"/>
          </div>
          <div>
            <div className="text-2xl font-bold leading-tight text-green-600">{normal}</div>
            <div className="text-[12px] text-gray-500 font-medium">正常点位</div>
            <div className="text-[11px] text-gray-400">水位状态正常</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-500"/>
          </div>
          <div>
            <div className="text-2xl font-bold leading-tight text-red-600">{alarm}</div>
            <div className="text-[12px] text-gray-500 font-medium">异常点位</div>
            <div className="text-[11px] text-gray-400">偏高{highCount} · 超限{overlimitCount} · 数据异常{abnormalCount}</div>
          </div>
        </div>
      </div>

      {/* ── 搜索过滤栏 ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">井点编码</span>
            <input type="text" placeholder="请输入井点编号"
              value={searchCode} onChange={e=>setSearchCode(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">井点名称</span>
            <input type="text" placeholder="请输入井点名称"
              value={searchName} onChange={e=>setSearchName(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">基坑名称</span>
            <input type="text" placeholder="请输入基坑名称"
              value={searchPitName} onChange={e=>setSearchPitName(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">预警状态</span>
            <select value={searchType} onChange={e=>setSearchType(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-32 focus:outline-none focus:border-blue-500 bg-white cursor-pointer">
              <option value="">全部状态</option>
              <option value="normal">正常</option>
              <option value="high">偏高</option>
              <option value="overlimit">超限</option>
              <option value="abnormal">异常</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">井点类型</span>
            <select value={searchWellType} onChange={e=>setSearchWellType(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500 bg-white cursor-pointer">
              <option value="">全部分类</option>
              <option value="观测井">观测井</option>
              <option value="降水井">降水井</option>
              <option value="坑内管井">坑内管井</option>
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={()=>{setSearchCode("");setSearchName("");setSearchType("");setSearchLevel("");setSearchWellType("");setSearchPitName("");setSearchDate("");}}
              className="inline-flex items-center gap-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-[13px] font-medium cursor-pointer bg-white text-gray-600 hover:bg-gray-50">
              重置
            </button>
            <button onClick={()=>setWarnRuleModal(true)}
              className="inline-flex items-center gap-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-[13px] font-medium cursor-pointer bg-white text-gray-600 hover:bg-gray-50">
              <HelpCircle size={14}/>
              预警规则说明
            </button>
            <button onClick={()=>setWellFormModal({open:true,mode:"add",code:"",name:"",wellType:"降水井",pit:"",sensor:"",depth:"",remark:"",enabled:true})}
              className="inline-flex items-center gap-1.5 border border-[#0052cc] rounded-md px-3 py-1.5 text-[13px] font-medium cursor-pointer bg-[#0052cc] text-white hover:bg-[#0044a8]">
              井点维护
            </button>
          </div>
        </div>
      </div>

      {/* ── 区域标题栏 ── */}
      <div className="flex items-center justify-between flex-shrink-0">
        <span className="text-[14px] font-semibold text-gray-700">井点水位监测
          <span className="ml-2 text-[12px] font-normal text-gray-400">共 {filteredWlData.length} 口</span>
        </span>
        {filteredWlData.length === 0 && (
          <span className="text-[13px] text-gray-400">未找到匹配的降水井</span>
        )}
      </div>

      {/* ── 监测井卡片网格 ── */}
      <div className="grid grid-cols-4 gap-3">
        {filteredWlData.map(w => {
          const cfg = statusCfg[w.dataStatus] ?? statusCfg.normal;
          const isOverlimit = w.dataStatus==="overlimit";
          const isHigh = w.dataStatus==="high";
          const collectHM = w.collectTime.slice(11,16);
          const pump = getRelatedPump(w.code);
          return (
            <div key={w.id} className={`bg-white rounded-xl border-2 flex flex-col shadow-sm hover:shadow-md transition-shadow ${cfg.border}`}>
              {/* 卡片头 */}
              <div className={`px-3 pt-3 pb-2 flex items-start justify-between border-b ${isOverlimit?"border-red-100 bg-red-50/30":isHigh?"border-orange-100 bg-orange-50/20":"border-gray-100"}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[15px] flex-shrink-0 ${isOverlimit?"bg-red-100 text-red-700":isHigh?"bg-orange-100 text-orange-700":"bg-blue-100 text-blue-700"}`}>
                    井
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] text-gray-800 leading-tight truncate">{w.code} {w.name}</div>
                  </div>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 mt-0.5 ${isOverlimit?"bg-red-100 text-red-700":isHigh?"bg-orange-100 text-orange-700":w.dataStatus==="abnormal"?"bg-gray-100 text-gray-500":"bg-green-100 text-green-700"}`}>
                  {cfg.label}
                </span>
              </div>

              {/* 监控位置 */}
              <div className="px-3 py-1 text-[11px] text-gray-400 bg-gray-50/60 border-b border-gray-100 flex items-center gap-1 flex-shrink-0">
                <MapPin size={9}/>{w.zone}
              </div>

              {/* 基坑名称和井点类型 */}
              <div className="px-3 py-1.5 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <div className="text-[11px] text-gray-500 truncate">
                  <span className="text-gray-400">基坑：</span>{w.workpointName}
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${w.wellType==="观测井"?"bg-cyan-100 text-cyan-700":w.wellType==="坑内管井"?"bg-purple-100 text-purple-700":"bg-blue-100 text-blue-700"}`}>
                  {w.wellType}
                </span>
              </div>

              {/* 数据网格 */}
              <div className="px-3 py-2.5 grid grid-cols-2 gap-x-2 gap-y-2 flex-1">
                {!w.sensor ? (
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-[12px] text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">未绑定设备</span>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="text-[10px] text-gray-400">标准值</div>
                      <div className="text-[13px] font-semibold text-blue-600">≤{w.standardWater.toFixed(2)}m</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400">报警值</div>
                      <div className="text-[13px] font-semibold text-orange-500">≥{w.alarmWater.toFixed(2)}m</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400">当前水位</div>
                      <div className={`text-[13px] font-bold flex items-center gap-1 ${isOverlimit?"text-red-600":isHigh?"text-orange-600":"text-gray-800"}`}>
                        {w.currentWater !== null ? `${w.currentWater.toFixed(2)}m` : "--"}
                        {isOverlimit && <span className="text-[9px] bg-red-500 text-white px-1 rounded">超限</span>}
                        {isHigh && <span className="text-[9px] bg-orange-400 text-white px-1 rounded">偏高</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400">井深</div>
                      <div className="text-[13px] font-semibold text-gray-700">{w.depth.toFixed(2)}m</div>
                    </div>
                  </>
                )}
              </div>

              {/* 卡片底部 */}
              <div className={`px-3 py-2 border-t border-gray-100 flex items-center justify-between flex-shrink-0 ${isOverlimit?"bg-red-50/30":""}`}>
                <div className="flex items-center gap-1.5">
                  {!w.sensor ? (
                    <span className="text-[10px] text-gray-400">未绑定设备</span>
                  ) : (
                    <>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${w.online?"animate-pulse bg-green-400":"bg-gray-300"}`}/>
                      <span className="text-[10px] text-gray-400">数据时间: {collectHM}</span>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={()=>setDetailModal({open:true,item:w})}
                    className="text-[12px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                    查看详情
                  </button>
                  <button onClick={()=>setWellFormModal({open:true,mode:"edit",code:w.code,name:w.name,wellType:w.wellType,pit:w.workpoint,controlWaterLevel:w.standardWater?.toString() || "",alarmWaterLevel:w.alarmWater?.toString() || "",sensor:w.sensor,depth:w.depth?.toString() || "",remark:w.note,enabled:w.enabled})}
                    className="text-[12px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                    编辑
                  </button>
                  {(() => {
                    const hasSensor = !!w.sensor;
                    const hasPump = pumpData.some(p => p.well === w.code);
                    const hasHistory = !!w.collectTime;
                    const canDelete = !hasSensor && !hasPump && !hasHistory;
                    return (
                      <button onClick={() => {
                        if (canDelete) {
                          setWellData(prev => prev.filter(item => item.id !== w.id));
                        }
                      }}
                        className={`text-[12px] font-medium cursor-pointer ${canDelete ? "text-red-500 hover:text-red-700" : "text-gray-300 cursor-not-allowed"}`}
                        disabled={!canDelete}>
                        删除
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 井点维护弹窗 ── */}
      <Modal open={wellFormModal.open} onClose={()=>setWellFormModal({open:false})} title="井点维护" width="480px"
        footer={<ModalFooter onCancel={()=>setWellFormModal({open:false})} onConfirm={()=>setWellFormModal({open:false})} confirmText="保存"/>}>
        <FormGrid cols={1}>
          <FF label="井点编码" required>
            <input type="text" value={wellFormModal.code || ""} disabled={wellFormModal.mode==="edit"}
              onChange={e=>setWellFormModal(p=>({...p,code:e.target.value}))}
              placeholder="请输入井点编码，如 JW013"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"/>
          </FF>
          <FF label="井点名称" required>
            <input type="text" value={wellFormModal.name || ""}
              onChange={e=>setWellFormModal(p=>({...p,name:e.target.value}))}
              placeholder="请输入井点名称，如 13号降水井"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </FF>
          <FF label="所属基坑" required>
            <select value={wellFormModal.pit || ""}
              onChange={e=>{
                const pitCode = e.target.value;
                const pit = pitData.find(p => p.code === pitCode);
                setWellFormModal(p=>({
                  ...p,
                  pit: pitCode,
                  controlWaterLevel: pit?.controlWaterLevel || "",
                  alarmWaterLevel: pit?.alarmWaterLevel || ""
                }));
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="">请选择所属基坑</option>
              {pitData.map(pit => (
                <option key={pit.code} value={pit.code}>{pit.name}</option>
              ))}
            </select>
          </FF>
          <FF label="标准控制水位（m）" required>
            <input type="number" step="0.01" value={wellFormModal.controlWaterLevel || ""}
              onChange={e=>setWellFormModal(p=>({...p,controlWaterLevel:e.target.value}))}
              placeholder="请输入标准控制水位"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </FF>
          <FF label="报警水位（m）" required>
            <input type="number" step="0.01" value={wellFormModal.alarmWaterLevel || ""}
              onChange={e=>setWellFormModal(p=>({...p,alarmWaterLevel:e.target.value}))}
              placeholder="请输入报警水位"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </FF>
          <FF label="井点类型" required>
            <select value={wellFormModal.wellType || "降水井"}
              onChange={e=>setWellFormModal(p=>({...p,wellType:e.target.value}))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="降水井">降水井</option>
              <option value="观测井">观测井</option>
              <option value="坑内管井">坑内管井</option>
            </select>
          </FF>
          <FF label="是否启用水位监测" required>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="enabled" checked={wellFormModal.enabled !== false}
                  onChange={()=>setWellFormModal(p=>({...p,enabled:true}))}
                  className="w-3.5 h-3.5 accent-[#0052cc] cursor-pointer"/>
                <span className="text-[13px] text-gray-700">是</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="enabled" checked={wellFormModal.enabled === false}
                  onChange={()=>setWellFormModal(p=>({...p,enabled:false}))}
                  className="w-3.5 h-3.5 accent-[#0052cc] cursor-pointer"/>
                <span className="text-[13px] text-gray-700">否</span>
              </label>
            </div>
          </FF>
          <FF label="关联水位传感器" required={wellFormModal.enabled !== false}>
            <select value={wellFormModal.sensor || ""}
              onChange={e=>setWellFormModal(p=>({...p,sensor:e.target.value}))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer disabled:bg-gray-50 disabled:text-gray-400">
              <option value="">请选择水位传感器</option>
              {waterSensorData.map(s => (
                <option key={s.code} value={s.code}>{s.name}（{s.code}）</option>
              ))}
            </select>
          </FF>
          <FF label="井点深度(m)" required>
            <input type="number" value={wellFormModal.depth || ""}
              onChange={e=>setWellFormModal(p=>({...p,depth:e.target.value}))}
              placeholder="请输入井点深度（米）"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </FF>
          <FF label="备注">
            <textarea value={wellFormModal.remark || ""}
              onChange={e=>setWellFormModal(p=>({...p,remark:e.target.value}))}
              placeholder="请输入备注信息"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 resize-none"/>
          </FF>
        </FormGrid>
      </Modal>

      {/* ── 预警规则说明弹窗 ── */}
      <Modal open={warnRuleModal} onClose={()=>setWarnRuleModal(false)} title="水位监测预警规则说明" width="680px"
        footer={<ModalFooter onCancel={()=>setWarnRuleModal(false)} onConfirm={()=>setWarnRuleModal(false)} confirmText="我知道了"/>}>
        <div className="space-y-6">
          {/* 第一部分：预警状态说明 */}
          <div>
            <div className="text-[14px] font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-[#0052cc] rounded-full"/>
              预警状态说明
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-gray-500 w-24">状态</th>
                    <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-gray-500">判断条件</th>
                    <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-gray-500 w-24">显示颜色</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500"/>
                        <span className="font-medium text-gray-700">正常</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">当前水位 ≤ 标准控制水位</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-[11px] font-medium">绿色</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"/>
                        <span className="font-medium text-gray-700">偏高</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">标准控制水位 ＜ 当前水位 ＜ 报警水位</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[11px] font-medium">橙色</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"/>
                        <span className="font-medium text-gray-700">超限</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">当前水位 ≥ 报警水位</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded text-[11px] font-medium">红色</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-400"/>
                        <span className="font-medium text-gray-700">数据异常</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">监测设备离线、数据超时、数据为空、监测数值超出合理范围或数据异常跳变</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium">灰色</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 第二部分：判断优先级 */}
          <div>
            <div className="text-[14px] font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-[#0052cc] rounded-full"/>
              判断优先级
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-[12px] font-medium">数据异常</span>
                <span className="text-gray-400 text-[14px]">＞</span>
                <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-[12px] font-medium">水位超限</span>
                <span className="text-gray-400 text-[14px]">＞</span>
                <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-md text-[12px] font-medium">水位偏高</span>
                <span className="text-gray-400 text-[14px]">＞</span>
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-[12px] font-medium">正常</span>
              </div>
              <p className="text-[12px] text-gray-500 text-center">
                当设备离线或监测数据异常时，即使最后一次水位数据达到报警阈值，也优先显示"数据异常"。
              </p>
            </div>
          </div>

          {/* 第三部分：阈值来源 */}
          <div>
            <div className="text-[14px] font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-[#0052cc] rounded-full"/>
              阈值来源
            </div>
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
              <p className="text-[13px] text-gray-600 leading-relaxed">
                标准控制水位和报警水位由项目专项降水方案、设计资料或现场管理要求确定。系统根据当前井点使用的阈值自动判断监测状态。
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── 查看详情弹窗 ── */}
      <Modal open={detailModal.open} onClose={()=>{setDetailModal({open:false});}} title="" width="760px"
        footer={
          <div className="flex items-center justify-end w-full">
            <button onClick={()=>{setDetailModal({open:false});}}
              className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-600 text-[13px] hover:bg-gray-50 cursor-pointer">关闭</button>
          </div>
        }>
        {detailModal.item && (()=>{
          const w = detailModal.item!;
          const isOverlimit = w.dataStatus==="overlimit";
          const isHigh = w.dataStatus==="high";
          const handled = handledMap[w.id];
          const pump = getRelatedPump(w.code);
          const buryDepth = w.currentWater != null ? (w.groundElev - w.currentWater).toFixed(2) : "--";

          // ── 抽水建议逻辑 ──
          const isObservationWell = w.wellType === "观测井";
          const sensorOffline = !w.online || w.dataStatus === "abnormal";
          const pumpFaulty = pump && pump.fault === "故障";
          const hasPump = !!pump;

          // 判断当前建议
          let advice = "";
          let adviceColor = "";
          let adviceBg = "";
          if (isObservationWell) {
            advice = "观测井仅用于水位监测，不生成抽水建议";
            adviceColor = "text-gray-500";
            adviceBg = "bg-gray-50";
          } else if (sensorOffline) {
            advice = "水位监测数据异常，请检查监测设备";
            adviceColor = "text-red-600";
            adviceBg = "bg-red-50";
          } else if (!hasPump) {
            advice = "未绑定抽水泵，暂无法生成抽水建议";
            adviceColor = "text-gray-500";
            adviceBg = "bg-gray-50";
          } else if (pumpFaulty) {
            advice = "建议现场检查";
            adviceColor = "text-red-600";
            adviceBg = "bg-red-50";
          } else if (w.dataStatus === "normal" && pump.status === "停止") {
            advice = "暂无需抽水";
            adviceColor = "text-green-600";
            adviceBg = "bg-green-50";
          } else if ((isHigh || isOverlimit) && pump.status === "停止") {
            advice = "建议启动水泵";
            adviceColor = "text-orange-600";
            adviceBg = "bg-orange-50";
          } else if ((isHigh || isOverlimit) && pump.status === "运行中") {
            advice = "建议继续抽水";
            adviceColor = "text-orange-600";
            adviceBg = "bg-orange-50";
          } else if (w.dataStatus === "normal" && pump.status === "运行中") {
            advice = "建议停止水泵";
            adviceColor = "text-green-600";
            adviceBg = "bg-green-50";
          } else {
            advice = "暂无需抽水";
            adviceColor = "text-green-600";
            adviceBg = "bg-green-50";
          }

          // 判断依据
          let reasoning = "";
          if (isObservationWell) {
            reasoning = "该井点为观测井，仅用于水位监测，系统不为其生成抽水建议。";
          } else if (sensorOffline) {
            reasoning = "水位传感器离线或监测数据异常，无法获取有效水位数据，请检查监测设备状态。";
          } else if (!hasPump) {
            reasoning = "该井点未绑定抽水泵，系统无法生成完整的抽水建议。";
          } else if (pumpFaulty) {
            reasoning = `抽水泵（${pump.code}）当前状态为故障，建议现场检查水泵并排除故障。`;
          } else if (w.dataStatus === "normal" && pump.status === "停止") {
            reasoning = `当前水位为${w.currentWater?.toFixed(2)}m，低于标准控制水位${w.standardWater.toFixed(2)}m，水泵处于停止状态，暂无需抽水。`;
          } else if ((isHigh || isOverlimit) && pump.status === "停止") {
            reasoning = `当前水位为${w.currentWater?.toFixed(2)}m，${isOverlimit?"已超过报警水位":"高于标准控制水位"}${isOverlimit?w.alarmWater.toFixed(2):w.standardWater.toFixed(2)}m，且当前关联水泵处于停止状态，建议启动水泵并持续关注水位变化。`;
          } else if ((isHigh || isOverlimit) && pump.status === "运行中") {
            reasoning = `当前水位为${w.currentWater?.toFixed(2)}m，${isOverlimit?"已超过报警水位":"高于标准控制水位"}${isOverlimit?w.alarmWater.toFixed(2):w.standardWater.toFixed(2)}m，水泵正在运行中，建议继续抽水直至水位恢复安全范围。`;
          } else if (w.dataStatus === "normal" && pump.status === "运行中") {
            reasoning = `当前水位为${w.currentWater?.toFixed(2)}m，已恢复至安全范围并持续稳定，水泵仍在运行，建议停止水泵。`;
          }

          // 趋势
          const trend = isOverlimit ? "持续上升" : isHigh ? "缓慢上升" : "平稳";

          return (
            <>
              {/* 标题栏 */}
              <div className={`-mx-6 -mt-6 px-6 py-4 mb-5 border-b flex items-center gap-3 relative ${isOverlimit?"bg-red-50 border-red-200":isHigh?"bg-orange-50 border-orange-200":"bg-blue-50 border-blue-200"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${isOverlimit?"bg-red-100 text-red-700":isHigh?"bg-orange-100 text-orange-700":"bg-blue-100 text-blue-700"}`}>井</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800 text-[15px]">{w.code} {w.name}</span>
                    <PrototypeNoteTag note={prototypeNotes["field-01"]} show={showPrototypeNotes} position="after" />
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${isOverlimit?"bg-red-100 text-red-700":isHigh?"bg-orange-100 text-orange-700":"bg-green-100 text-green-700"}`}>
                      {statusCfg[w.dataStatus]?.label}
                    </span>
                    <PrototypeNoteTag note={prototypeNotes["status-01"]} show={showPrototypeNotes} position="after" />
                    {handled && <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ 已处理</span>}
                  </div>
                  <div className="text-[12px] text-gray-500 mt-0.5">{w.workpointName} · 传感器 {w.sensor}</div>
                </div>
                <div className="flex items-center gap-5 text-right flex-shrink-0 relative">
                  <PrototypeNoteTag note={prototypeNotes["field-02"]} show={showPrototypeNotes} position="top-right" />
                  <div><div className="text-[10px] text-gray-400 mb-0.5">标准水位</div><div className="text-[15px] font-bold text-blue-600">≤{w.standardWater.toFixed(2)}m</div></div>
                  <div><div className="text-[10px] text-gray-400 mb-0.5">报警水位</div><div className="text-[15px] font-bold text-orange-500">≥{w.alarmWater.toFixed(2)}m</div></div>
                  <div>
                    <div className="text-[10px] text-gray-400 mb-0.5">当前水位</div>
                    <div className={`text-[18px] font-bold ${isOverlimit?"text-red-600":isHigh?"text-orange-600":"text-gray-800"}`}>
                      {w.currentWater !== null ? `${w.currentWater.toFixed(2)}m` : "--"}
                    </div>
                  </div>
                </div>
              </div>

              {/* 实时数据 */}
              <div className="grid grid-cols-2 gap-4">
                  {/* 左侧：水位监测数据 */}
                  <div className="rounded-xl border border-gray-200 overflow-hidden relative">
                    <PrototypeNoteTag note={prototypeNotes["field-03"]} show={showPrototypeNotes} position="top-right" />
                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
                      <span className="text-[13px] font-semibold text-gray-700">水位监测数据</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-500">井点类型</span>
                        <span className="text-[13px] font-medium text-gray-800">{w.wellType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-500">井点深度</span>
                        <span className="text-[13px] font-medium text-gray-800">{w.depth.toFixed(2)}m</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-500">当前水位</span>
                        <span className={`text-[13px] font-medium ${isOverlimit?"text-red-600":isHigh?"text-orange-600":"text-gray-800"}`}>
                          {w.currentWater !== null ? `${w.currentWater.toFixed(2)}m` : "--"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-500">采集时间</span>
                        <span className="text-[13px] font-medium text-gray-800">{w.collectTime.split(" ")[1]}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-500">数据状态</span>
                        <span className={`text-[12px] px-2 py-0.5 rounded-full font-medium ${isOverlimit?"bg-red-100 text-red-700":isHigh?"bg-orange-100 text-orange-700":"bg-green-100 text-green-700"}`}>
                          {statusCfg[w.dataStatus]?.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-500">传感器状态</span>
                        <span className={`text-[13px] font-medium ${w.online?"text-green-600":"text-gray-500"}`}>
                          {w.online ? "在线" : "离线"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 右侧：抽水建议 */}
                  <div className="rounded-xl border border-gray-200 overflow-hidden relative">
                    <PrototypeNoteTag note={prototypeNotes["rule-02"]} show={showPrototypeNotes} position="top-right" />
                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-gray-700">抽水建议</span>
                      {!isObservationWell && (
                        <button onClick={()=>setPumpRuleModal(true)}
                          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md px-2 py-0.5 hover:bg-gray-50 cursor-pointer transition-colors">
                          <HelpCircle size={11}/>查看判断规则
                        </button>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      {/* 当前建议 - 突出显示 */}
                      <div className={`rounded-lg px-3 py-2 relative ${adviceBg}`}>
                        <PrototypeNoteTag note={prototypeNotes["field-04"]} show={showPrototypeNotes} position="top-right" />
                        <span className="text-[11px] text-gray-500">当前建议</span>
                        <div className={`text-[14px] font-bold ${adviceColor}`}>{advice}</div>
                      </div>

                      {!isObservationWell && !sensorOffline && !(!hasPump) && !pumpFaulty ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-gray-500">关联水泵</span>
                            <span className="text-[13px] font-medium text-gray-800">{pump ? `${pump.code} ${pump.name}` : "--"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-gray-500">水泵状态</span>
                            <span className={`text-[13px] font-medium ${pump && pump.status==="运行中"?"text-green-600":"text-gray-600"}`}>
                              {pump ? pump.status : "--"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-[12px] text-gray-500">水位趋势</span>
                              <PrototypeNoteTag note={prototypeNotes["rule-01"]} show={showPrototypeNotes} position="after" />
                            </div>
                            <span className="text-[13px] font-medium text-gray-800">{trend}</span>
                          </div>
                        </>
                      ) : null}

                      {/* 判断依据 */}
                      <div className="pt-2 border-t border-gray-100 relative">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[12px] text-gray-500">判断依据</span>
                          <PrototypeNoteTag note={prototypeNotes["field-05"]} show={showPrototypeNotes} position="after" />
                        </div>
                        <p className="text-[12px] text-gray-700 leading-relaxed">{reasoning}</p>
                      </div>

                      {/* 生成时间 */}
                      <div className="pt-1 flex items-center gap-1">
                        <PrototypeNoteTag note={prototypeNotes["field-06"]} show={showPrototypeNotes} position="inline" />
                        <span className="text-[11px] text-gray-400">生成时间：{w.collectTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

              {/* 已处理记录 */}
              {handled && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="text-[12px] font-semibold text-green-700 mb-2 flex items-center gap-1.5">
                    <CheckCircle size={13}/>处理记录
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[12px]">
                    <div><span className="text-gray-400">处理时间：</span><span className="text-gray-700">{handled.time}</span></div>
                    <div><span className="text-gray-400">处理人：</span><span className="text-gray-700 font-medium">{handled.person}</span></div>
                    <div className="col-span-2"><span className="text-gray-400">处理说明：</span><span className="text-gray-700">{handled.desc}</span></div>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </Modal>

      {/* ── 抽水建议判断规则弹窗 ── */}
      <Modal open={pumpRuleModal} onClose={()=>setPumpRuleModal(false)} title="抽水建议判断规则" width="760px"
        footer={
          <button onClick={()=>setPumpRuleModal(false)}
            className="px-4 py-1.5 rounded-lg bg-[#1F53BE] text-white text-[13px] hover:bg-blue-700 cursor-pointer">我知道了</button>
        }>
        {/* 第一部分：建议结果说明 */}
        <div className="mb-5">
          <div className="text-[14px] font-semibold text-gray-800 mb-3">一、建议结果说明</div>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500">判断情况</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500">建议结果</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["水位正常且水泵停止", "暂无需抽水", "text-green-600"],
                  ["当前水位达到或超过标准控制水位，水泵停止", "建议启动水泵", "text-orange-600"],
                  ["当前水位达到或超过标准控制水位，水泵运行且水位持续下降", "建议继续抽水", "text-orange-600"],
                  ["当前水位恢复至安全范围并持续稳定，水泵仍在运行", "建议停止水泵", "text-green-600"],
                  ["水泵运行后水位未下降或持续上涨", "建议现场检查", "text-red-600"],
                  ["传感器离线、数据异常、水泵故障或数据长时间未更新", "建议现场检查", "text-red-600"],
                ].map((row,ri)=>(
                  <tr key={ri} className={`border-b border-gray-100 ${ri%2===0?"bg-white":"bg-gray-50/40"}`}>
                    <td className="px-4 py-2.5 text-gray-700">{row[0]}</td>
                    <td className={`px-4 py-2.5 font-medium ${row[2]}`}>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 第二部分：判断优先级 */}
        <div className="mb-5">
          <div className="text-[14px] font-semibold text-gray-800 mb-3">二、判断优先级</div>
          <div className="flex items-center gap-2 flex-wrap">
            {["设备或数据异常","抽水无效","建议启动","建议继续","建议停止","暂无需抽水"].map((label,i,arr)=>(
              <span key={label} className="flex items-center gap-2">
                <span className={`text-[12px] px-3 py-1 rounded-lg font-medium ${
                  label==="设备或数据异常"||label==="抽水无效"?"bg-red-50 text-red-600":
                  label==="建议启动"||label==="建议继续"?"bg-orange-50 text-orange-600":
                  "bg-green-50 text-green-600"
                }`}>{label}</span>
                {i<arr.length-1 && <span className="text-gray-300 text-[14px]">＞</span>}
              </span>
            ))}
          </div>
        </div>

        {/* 第三部分：补充说明 */}
        <div>
          <div className="text-[14px] font-semibold text-gray-800 mb-3">三、补充说明</div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {[
              "抽水建议由后台根据最新水位、水位趋势和水泵运行状态自动生成。",
              "抽水建议只用于辅助判断，不直接控制水泵启停。",
              "预警状态和抽水建议分别判断，二者互不替代。",
              "观测井不生成抽水建议。",
              "未绑定抽水泵时，系统无法生成完整抽水建议。",
              "数据更新后，系统自动重新计算当前抽水建议。",
              "判断规则为系统内置规则，前端不允许编辑。",
            ].map((text,i)=>(
              <div key={i} className="flex items-start gap-2 text-[12px] text-gray-700">
                <span className="text-gray-400 flex-shrink-0 mt-0.5">{i+1}.</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* ── 处理弹窗 ── */}
      <Modal open={handleModal.open} onClose={()=>setHandleModal({open:false})} title="异常处理" width="480px"
        footer={<ModalFooter onCancel={()=>setHandleModal({open:false})} onConfirm={confirmHandle} confirmText="确认处理"/>}>
        {handleModal.item && (
          <div className="flex flex-col gap-4">
            <div className={`rounded-xl p-3 border flex items-center gap-3 ${handleModal.item.dataStatus==="overlimit"?"bg-red-50 border-red-200":"bg-orange-50 border-orange-200"}`}>
              <AlertTriangle size={16} className={handleModal.item.dataStatus==="overlimit"?"text-red-500":"text-orange-400"} />
              <div className="text-[13px]">
                <span className="font-semibold">{handleModal.item.code} {handleModal.item.name}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span>当前水位 <span className="font-bold">{handleModal.item.currentWater?.toFixed(2)}m</span></span>
                <span className="mx-2 text-gray-400">|</span>
                <span className={`font-semibold ${handleModal.item.dataStatus==="overlimit"?"text-red-600":"text-orange-600"}`}>
                  {statusCfg[handleModal.item.dataStatus]?.label}
                </span>
              </div>
            </div>
            <FormGrid cols={1}>
              <FF label="处理人" required>
                <input value={handlePerson} onChange={e=>setHandlePerson(e.target.value)} placeholder="请输入处理人姓名"
                  className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 w-full"/>
              </FF>
              <FF label="处理说明" required>
                <textarea value={handleDesc} onChange={e=>setHandleDesc(e.target.value)} rows={4}
                  placeholder="请详细描述处理措施，如：已启动3号降水井抽水泵，增加抽水频次；安排人员现场检查，预计2小时后水位恢复正常…"
                  className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 resize-y w-full"/>
              </FF>
            </FormGrid>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── PAGE: PUMP MANAGEMENT ───────────────────────────────────────────────────
function PumpManagementPage() {
  const [pumpModal, setPumpModal] = useState<{open:boolean;mode:"add"|"edit"|"view";item?:typeof pumpData[0]}>({open:false,mode:"add"});
  const [deleteModal, setDeleteModal] = useState<{open:boolean;item?:typeof pumpData[0]}>({open:false});
  const [searchCode, setSearchCode] = useState("");
  const [searchWell, setSearchWell] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRunStatus, setFilterRunStatus] = useState("");
  const [selectedWorkpoint, setSelectedWorkpoint] = useState("");
  const [selectedWell, setSelectedWell] = useState("");

  const workpointOptions = [...new Set(wellData.filter(w => w.wellType === "降水井" || w.wellType === "坑内管井").map(w => w.workpointName))];
  const filteredWells = selectedWorkpoint 
    ? wellData.filter(w => w.workpointName === selectedWorkpoint && (w.wellType === "降水井" || w.wellType === "坑内管井"))
    : [];

  const getWellInfo = (wellCode: string) => {
    return wellData.find(w => w.code === wellCode);
  };

  const handleModalOpen = (mode: "add"|"edit"|"view", item?: typeof pumpData[0]) => {
    setSelectedWorkpoint("");
    setSelectedWell("");
    if (mode === "edit" && item?.well) {
      const well = getWellInfo(item.well);
      if (well) {
        setSelectedWorkpoint(well.workpointName);
        setSelectedWell(well.code);
      }
    }
    setPumpModal({open:true, mode, item});
  };

  // Mock realtime values per pump
  const mockFlow = (p: typeof pumpData[0]) => p.status === "运行中" ? (12 + p.id * 1.3 + (p.id % 3) * 2.1).toFixed(1) : "0.0";
  const mockCurrent = (p: typeof pumpData[0]) => p.status === "运行中" ? (5.8 + p.id * 0.4 + (p.id % 2) * 1.2).toFixed(1) : "0.0";
  const parseDuration = (d: string) => {
    const m = d.match(/(\d+)h/);
    return m ? m[1] + ".0h" : "0.0h";
  };

  const canDelete = (p: typeof pumpData[0]) => {
    return !p.well && !p.totalDuration && p.fault === "正常" && !monitorWarningData.some(w => w.target.includes(p.code));
  };

  const filteredPumps = pumpData.filter(p => {
    if (searchCode && !p.code.includes(searchCode) && !p.name.includes(searchCode)) return false;
    if (searchWell && !p.well.includes(searchWell)) return false;
    if (filterStatus) {
      if (filterStatus === "正常" && p.fault !== "正常") return false;
      if (filterStatus === "故障" && p.fault !== "故障") return false;
      if (filterStatus === "离线" && p.communication !== "离线") return false;
    }
    if (filterRunStatus) {
      if (filterRunStatus === "运行中" && p.status !== "运行中") return false;
      if (filterRunStatus === "已停止" && p.status !== "停止") return false;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      {/* 搜索过滤栏 */}
      <FilterBar>
        <FItem label="水泵编号/名称"><Inp placeholder="请输入编号或名称" value={searchCode} onChange={e=>setSearchCode(e.target.value)}/></FItem>
        <FItem label="关联井点"><Inp placeholder="请输入关联井点" value={searchWell} onChange={e=>setSearchWell(e.target.value)}/></FItem>
        <FItem label="设备状态">
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer">
            <option value="">全部状态</option>
            <option value="正常">正常</option>
            <option value="故障">故障</option>
            <option value="离线">离线</option>
          </select>
        </FItem>
        <FItem label="运行状态">
          <select value={filterRunStatus} onChange={e=>setFilterRunStatus(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer">
            <option value="">全部状态</option>
            <option value="运行中">运行中</option>
            <option value="已停止">已停止</option>
          </select>
        </FItem>
        <div className="ml-auto flex gap-2">
          <Btn variant="primary" onClick={()=>handleModalOpen("add")}><Plus size={13}/>新增抽水泵</Btn>
          <Btn><Download size={13}/>导出</Btn>
          <Btn variant="primary"><Search size={13}/>查询</Btn>
          <Btn onClick={()=>{setSearchCode("");setSearchWell("");setFilterStatus("");setFilterRunStatus("");}}><RefreshCw size={13}/>重置</Btn>
        </div>
      </FilterBar>

      {/* 卡片网格 */}
      <div className="grid grid-cols-4 gap-4">
        {filteredPumps.map(p => {
          const isFault = p.fault === "故障";
          const isOffline = p.communication === "离线";
          const isRunning = p.status === "运行中";
          const borderCls = isFault ? "border-red-200" : isOffline ? "border-gray-300" : isRunning ? "border-blue-100" : "border-gray-200";
          const bgCls = isFault ? "bg-red-50" : isOffline ? "bg-gray-50" : isRunning ? "bg-blue-50" : "bg-gray-50";
          const iconCls = isFault ? "bg-red-100 text-red-600" : isOffline ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-600";
          const runStatus = p.status === "运行中" ? "运行中" : "已停止";
          const runStatusCls = p.status === "运行中" ? "text-green-600" : "text-gray-500";
          const devStatus = p.communication === "离线" ? "离线" : p.fault === "故障" ? "故障" : "正常";
          const devStatusCls = p.communication === "离线" ? "text-gray-400" : p.fault === "故障" ? "text-red-600" : "text-green-600";
          return (
            <div key={p.id} className={`bg-white rounded-xl border ${borderCls} p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow`}>
              {/* 卡片头部 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[14px] ${iconCls}`}>泵</div>
                  <div>
                    <div className="font-bold text-gray-800 text-[13px]">{p.code}</div>
                    <div className="text-[12px] text-gray-500">{p.name}</div>
                  </div>
                </div>
                <span className={`text-[11px] px-2 py-1 rounded-full ${bgCls} ${runStatusCls}`}>{runStatus}</span>
              </div>

              {/* 字段列表 */}
              <div className="flex-1 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400">关联基坑</span>
                  <span className="text-[12px] font-medium text-gray-700 truncate max-w-[140px]">{p.workpoint || "--"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400">关联井点</span>
                  <span className="text-[12px] font-medium text-gray-700 truncate max-w-[140px]">{p.well || "--"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400">今日时长</span>
                  <span className="text-[12px] font-medium text-gray-700">{parseDuration(p.todayDuration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400">设备状态</span>
                  <span className={`text-[12px] font-medium ${devStatusCls}`}>{devStatus}</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onClick={()=>handleModalOpen("edit", p)}
                  className="flex-1 text-center text-[12px] text-blue-600 hover:text-blue-800 cursor-pointer py-1.5 rounded-md border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">编辑</button>
                <button onClick={()=>setDeleteModal({open:true,item:p})}
                  className="flex-1 text-center text-[12px] text-red-500 hover:text-red-700 cursor-pointer py-1.5 rounded-md border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors">删除</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 抽水泵 Modal */}
      <Modal open={pumpModal.open} onClose={()=>setPumpModal(p=>({...p,open:false}))} title={pumpModal.mode==="add"?"新增抽水泵":pumpModal.mode==="edit"?"编辑抽水泵":"抽水泵详情"} width="640px" footer={pumpModal.mode==="view"?<Btn onClick={()=>setPumpModal(p=>({...p,open:false}))}>关闭</Btn>:<ModalFooter onCancel={()=>setPumpModal(p=>({...p,open:false}))} onConfirm={()=>setPumpModal(p=>({...p,open:false}))} confirmText="保存"/>}>
        {pumpModal.mode==="view" && pumpModal.item ? (
          <>
            <FSec title="基本信息">
              <DetailRow label="泵编号" value={pumpModal.item.code}/>
              <DetailRow label="泵名称" value={pumpModal.item.name}/>
              <DetailRow label="泵类型" value={pumpModal.item.type}/>
              <DetailRow label="关联降水井" value={pumpModal.item.well}/>
              <DetailRow label="关联工点" value={pumpModal.item.workpoint}/>
              <DetailRow label="控制模式" value={pumpModal.item.controlMode}/>
            </FSec>
            <FSec title="运行状态">
              <DetailRow label="运行状态" value={<StatusTag status={pumpModal.item.status}/>}/>
              <DetailRow label="通信状态" value={<StatusTag status={pumpModal.item.communication}/>}/>
              <DetailRow label="故障状态" value={<StatusTag status={pumpModal.item.fault}/>}/>
              <DetailRow label="当前水位(m)" value={String(pumpModal.item.currentWater)} highlight={pumpModal.item.currentWater > pumpModal.item.alarmWater}/>
              <DetailRow label="今日运行" value={pumpModal.item.todayDuration}/>
              <DetailRow label="累计运行" value={pumpModal.item.totalDuration}/>
            </FSec>
          </>
        ) : (
          <FormGrid>
            <FF label="泵编号" required><FI placeholder="请输入泵编号" defaultValue={pumpModal.item?.code}/></FF>
            <FF label="泵名称" required><FI placeholder="请输入泵名称" defaultValue={pumpModal.item?.name}/></FF>
            <FF label="泵类型" required><FS options={["潜水泵","深井泵","备用泵","排水泵","其他"]} defaultValue={pumpModal.item?.type}/></FF>
            <FF label="关联基坑" required>
              <select value={selectedWorkpoint} onChange={e=>{setSelectedWorkpoint(e.target.value);setSelectedWell("");}} className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-full focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer">
                <option value="">请选择基坑</option>
                {workpointOptions.map(wp => (
                  <option key={wp} value={wp}>{wp}</option>
                ))}
              </select>
            </FF>
            <FF label="关联井点" required>
              <select value={selectedWell} onChange={e=>setSelectedWell(e.target.value)} disabled={!selectedWorkpoint} className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-full focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:text-gray-400">
                <option value="">请选择井点</option>
                {filteredWells.map(w => (
                  <option key={w.id} value={w.code}>{w.code} ｜ {w.name}</option>
                ))}
              </select>
            </FF>
            <FF label="井类型">
              <div className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-500 bg-gray-50">根据关联井点自动获取</div>
            </FF>
            <FF label="通信状态">
              <div className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-500 bg-gray-50">{pumpModal.item?.communication || "离线"}</div>
            </FF>
            <FF label="运行状态">
              <div className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-500 bg-gray-50">{pumpModal.item?.status || "已停止"}</div>
            </FF>
            <FF label="故障状态">
              <div className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-500 bg-gray-50">{pumpModal.item?.fault || "正常"}</div>
            </FF>
            <FF label="今日运行时长">
              <div className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-500 bg-gray-50">{pumpModal.item?.todayDuration || "--"}</div>
            </FF>
            <FF label="最新数据时间">
              <div className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-500 bg-gray-50">{pumpModal.item?.collectTime || "--"}</div>
            </FF>
          </FormGrid>
        )}
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal open={deleteModal.open} onClose={()=>setDeleteModal(p=>({...p,open:false}))} title="确认删除" width="480px"
        footer={
          <div className="flex justify-end gap-2">
            <Btn onClick={()=>setDeleteModal(p=>({...p,open:false}))}>取消</Btn>
            <Btn variant="primary" disabled={deleteModal.item && !canDelete(deleteModal.item)} onClick={()=>setDeleteModal(p=>({...p,open:false}))}>确认删除</Btn>
          </div>
        }>
        {deleteModal.item && <>
          <div className="text-[13px] text-gray-700 mb-4">确定要删除 <span className="font-medium">{deleteModal.item.code} {deleteModal.item.name}</span> 吗？</div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-[12px] text-gray-500 font-medium mb-2">删除条件检查：</div>
            <div className="space-y-1.5">
              <div className={`flex items-center gap-2 text-[12px] ${!deleteModal.item.well ? "text-green-600" : "text-red-500"}`}>
                <span>{!deleteModal.item.well ? "✓" : "✗"}</span>
                <span>{!deleteModal.item.well ? "未绑定井点" : "已绑定井点，无法删除"}</span>
              </div>
              <div className={`flex items-center gap-2 text-[12px] ${!deleteModal.item.totalDuration ? "text-green-600" : "text-red-500"}`}>
                <span>{!deleteModal.item.totalDuration ? "✓" : "✗"}</span>
                <span>{!deleteModal.item.totalDuration ? "没有运行历史" : "存在运行历史，无法删除"}</span>
              </div>
              <div className={`flex items-center gap-2 text-[12px] ${deleteModal.item.fault === "正常" ? "text-green-600" : "text-red-500"}`}>
                <span>{deleteModal.item.fault === "正常" ? "✓" : "✗"}</span>
                <span>{deleteModal.item.fault === "正常" ? "没有故障记录" : "存在故障记录，无法删除"}</span>
              </div>
              <div className={`flex items-center gap-2 text-[12px] ${!monitorWarningData.some(w => w.target.includes(deleteModal.item!.code)) ? "text-green-600" : "text-red-500"}`}>
                <span>{!monitorWarningData.some(w => w.target.includes(deleteModal.item!.code)) ? "✓" : "✗"}</span>
                <span>{!monitorWarningData.some(w => w.target.includes(deleteModal.item!.code)) ? "没有关联预警" : "存在关联预警，无法删除"}</span>
              </div>
            </div>
          </div>
          {!canDelete(deleteModal.item) && (
            <div className="mt-3 text-[12px] text-red-500">不满足删除条件，无法删除</div>
          )}
        </>}
      </Modal>
    </div>
  );
}

// ─── PAGE: SETTLEMENT MONITOR ────────────────────────────────────────────────
function SettlementMonitorPage() {
  const [viewModal, setViewModal] = useState<{open:boolean;item?:typeof settlementData[0]}>({open:false});
  const [ruleModal, setRuleModal] = useState(false);
  const [ruleData, setRuleData] = useState({
    name: "沉降位移监测默认规则",
    enabled: true,
    xWarn: "18",
    xOver: "25",
    yWarn: "18",
    yOver: "25",
    zWarn: "15",
    zOver: "20",
    zMode: "absolute",
    remark: ""
  });

  const handleSaveRule = () => {
    if (ruleData.enabled) {
      const errors = [];
      const checkField = (val: string, name: string) => {
        if (!val || val.trim() === "") errors.push(`${name}必填`);
        else if (parseFloat(val) <= 0) errors.push(`${name}必须大于0`);
        return parseFloat(val);
      };
      const xWarn = checkField(ruleData.xWarn, "X方向预警值");
      const xOver = checkField(ruleData.xOver, "X方向超限值");
      const yWarn = checkField(ruleData.yWarn, "Y方向预警值");
      const yOver = checkField(ruleData.yOver, "Y方向超限值");
      const zWarn = checkField(ruleData.zWarn, "Z方向预警值");
      const zOver = checkField(ruleData.zOver, "Z方向超限值");
      if (xWarn >= xOver) errors.push("X方向超限值必须大于预警值");
      if (yWarn >= yOver) errors.push("Y方向超限值必须大于预警值");
      if (zWarn >= zOver) errors.push("Z方向超限值必须大于预警值");
      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }
    }
    setRuleModal(false);
  };

  const formatNum = (val: string) => {
    const num = parseFloat(val);
    return isNaN(num) ? "" : num.toFixed(2);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <FilterBar>
        <FItem label="监测点编号"><Inp placeholder="请输入编号"/></FItem>
        <FItem label="上期日期">
          <div className="flex items-center gap-1">
            <Inp placeholder="开始日期"/>
            <span className="text-gray-400 text-[12px]">~</span>
            <Inp placeholder="结束日期"/>
          </div>
        </FItem>
        <FItem label="本期日期">
          <div className="flex items-center gap-1">
            <Inp placeholder="开始日期"/>
            <span className="text-gray-400 text-[12px]">~</span>
            <Inp placeholder="结束日期"/>
          </div>
        </FItem>
        <div className="ml-auto flex gap-2"><Btn onClick={()=>setRuleModal(true)}>偏差规则</Btn><Btn><Download size={13}/>导出</Btn><Btn variant="primary"><Search size={13}/>查询</Btn><Btn><RefreshCw size={13}/>重置</Btn></div>
      </FilterBar>
      <TableCard title="监测点数据对比表" pagination={<Pager total={12}/>}>
        <DTable
          headers={[
            {label:"序号",width:"60px"},
            {label:"监测点编号",width:"110px"},
            {label:"监测点名称",width:"150px"},
            {label:"上期日期",width:"100px"},
            {label:"上期Y(m)",width:"95px"},
            {label:"上期X(m)",width:"95px"},
            {label:"上期Z(m)",width:"95px"},
            {label:"本期日期",width:"100px"},
            {label:"本期Y(m)",width:"95px"},
            {label:"本期X(m)",width:"95px"},
            {label:"本期Z(m)",width:"95px"},
            {label:"差值Y(m)",width:"95px"},
            {label:"差值X(m)",width:"95px"},
            {label:"差值Z(m)",width:"95px"},
            {label:"备注",width:"150px"},
            {label:"操作",width:"150px"}
          ]}
          rows={settlementData.map((d,i) => [
            i+1,
            <span key="c" className="font-mono text-[12px] text-slate-500">{d.code}</span>,
            d.name,
            d.prevDate || "--",
            <span key="py" className="font-mono text-[13px] text-slate-600">{d.yDiff !== null ? (d.yDiff / 1000).toFixed(4) : "--"}</span>,
            <span key="px" className="font-mono text-[13px] text-slate-600">{d.xDiff !== null ? (d.xDiff / 1000).toFixed(4) : "--"}</span>,
            <span key="pz" className="font-mono text-[13px] text-slate-600">{d.zDiff !== null ? (d.zDiff / 1000).toFixed(4) : "--"}</span>,
            d.currDate || "--",
            <span key="cy" className="font-mono text-[13px] text-slate-600">{d.yDiff !== null ? (d.yDiff / 1000).toFixed(4) : "--"}</span>,
            <span key="cx" className="font-mono text-[13px] text-slate-600">{d.xDiff !== null ? (d.xDiff / 1000).toFixed(4) : "--"}</span>,
            <span key="cz" className={`font-mono text-[13px] ${d.zDiff !== null && Math.abs(d.zDiff) >= 20 ? "text-red-600 font-medium" : d.zDiff !== null && Math.abs(d.zDiff) >= 15 ? "text-orange-600 font-medium" : "text-slate-600"}`}>{d.zDiff !== null ? (d.zDiff / 1000).toFixed(4) : "--"}</span>,
            <span key="dy" className={`font-mono text-[13px] ${d.yDiff !== null && Math.abs(d.yDiff) >= 18 ? "text-red-600 font-medium" : "text-slate-600"}`}>{d.yDiff !== null ? (d.yDiff / 1000).toFixed(4) : "--"}</span>,
            <span key="dx" className={`font-mono text-[13px] ${d.xDiff !== null && Math.abs(d.xDiff) >= 18 ? "text-red-600 font-medium" : "text-slate-600"}`}>{d.xDiff !== null ? (d.xDiff / 1000).toFixed(4) : "--"}</span>,
            <span key="dz" className={`font-mono text-[13px] ${d.zDiff !== null && Math.abs(d.zDiff) >= 20 ? "text-red-600 font-medium" : d.zDiff !== null && Math.abs(d.zDiff) >= 15 ? "text-orange-600 font-medium" : "text-slate-600"}`}>{d.zDiff !== null ? (d.zDiff / 1000).toFixed(4) : "--"}</span>,
            <span key="note" className="text-[13px] text-slate-600">{d.note || "--"}</span>,
            <div key="a" className="flex gap-3">
              <button className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">编辑</button>
              <button className="text-red-500 text-[13px] hover:underline cursor-pointer">删除</button>
            </div>
          ])}
        />
      </TableCard>

      {/* 查看监测点 Modal */}
      <Modal open={viewModal.open} onClose={()=>setViewModal(p=>({...p,open:false}))} title="监测点详情" width="560px" footer={<Btn onClick={()=>setViewModal(p=>({...p,open:false}))}>关闭</Btn>}>
        {viewModal.item && <>
          <FSec title="基本信息">
            <DetailRow label="监测点编号" value={viewModal.item.code}/>
            <DetailRow label="监测点名称" value={viewModal.item.name}/>
          </FSec>
          <FSec title="监测数据">
            {(()=>{
              const d = viewModal.item!;
              const rows = [
                ["上期日期", d.prevDate||"--", "上期高程(m)", d.prevZ?.toFixed(3)??"--", false, false],
                ["本期日期", d.currDate||"--", "本期高程(m)", d.currZ?.toFixed(3)??"--", false, false],
                ["Y位移分量(mm)", d.yDiff?.toFixed(1)??"--", "X位移分量(mm)", d.xDiff?.toFixed(1)??"--", Math.abs(d.yDiff??0)>=18, Math.abs(d.xDiff??0)>=18],
                ["累计沉降量(mm)", d.zDiff?.toFixed(1)??"--", "水平合位移(mm)", d.hDiff?.toFixed(1)??"--", Math.abs(d.zDiff??0)>=20, (d.hDiff??0)>=25],
              ] as [string,string,string,string,boolean,boolean][];
              return (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 w-1/4">参数项</th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 w-1/4">数值</th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 w-1/4">参数项</th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 w-1/4">数值</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(([l1,v1,l2,v2,w1,w2],i)=>(
                        <tr key={i} className={`border-b border-gray-100 ${i%2===0?"bg-white":"bg-gray-50/40"}`}>
                          <td className="px-4 py-2.5 text-gray-400 text-[12px]">{l1}</td>
                          <td className={`px-4 py-2.5 font-medium ${w1?"text-red-600 font-bold":"text-gray-800"}`}>{v1}</td>
                          <td className="px-4 py-2.5 text-gray-400 text-[12px]">{l2}</td>
                          <td className={`px-4 py-2.5 font-medium ${w2?"text-red-600 font-bold":"text-gray-800"}`}>{v2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </FSec>
        </>}
      </Modal>

      {/* 偏差规则维护弹窗 */}
      <Modal open={ruleModal} onClose={()=>setRuleModal(false)} title="偏差规则维护" width="680px"
        footer={
          <div className="flex justify-end gap-2">
            <Btn onClick={()=>setRuleModal(false)}>取消</Btn>
            <Btn variant="primary" onClick={handleSaveRule}>保存</Btn>
          </div>
        }>
        <div className="space-y-4">
          <div>
            <div className="text-[12px] text-gray-500 mb-1.5">规则名称 <span className="text-red-500">*</span></div>
            <input type="text" value={ruleData.name} onChange={e=>setRuleData(p=>({...p,name:e.target.value}))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500" placeholder="请输入规则名称"/>
          </div>
          <div>
            <div className="text-[12px] text-gray-500 mb-1.5">适用范围</div>
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px]">
              <span className="text-gray-800">当前项目全部监测点</span>
              <span className="text-gray-400 text-[12px]">只读</span>
            </div>
          </div>
          <div>
            <div className="text-[12px] text-gray-500 mb-1.5">计算单位</div>
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px]">
              <span className="text-gray-800">mm</span>
              <span className="text-gray-400 text-[11px]">系统将客户表格中的差值(m)自动换算为mm</span>
            </div>
          </div>
          <div>
            <div className="text-[12px] text-gray-500 mb-2">是否启用规则</div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!ruleData.enabled} onChange={()=>setRuleData(p=>({...p,enabled:false}))} className="w-4 h-4 text-[#1F53BE] border-gray-300 focus:ring-[#1F53BE]"/>
                <span className="text-[13px] text-gray-700">否</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={ruleData.enabled} onChange={()=>setRuleData(p=>({...p,enabled:true}))} className="w-4 h-4 text-[#1F53BE] border-gray-300 focus:ring-[#1F53BE]"/>
                <span className="text-[13px] text-gray-700">是</span>
              </label>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <div className="text-[13px] font-semibold text-gray-700 mb-3">X方向偏差规则</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[12px] text-gray-500 mb-1.5">X方向预警值(mm) <span className="text-red-500">*</span></div>
                <input type="number" value={ruleData.xWarn} onChange={e=>setRuleData(p=>({...p,xWarn:formatNum(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500" placeholder="请输入预警值" step="0.01"/>
              </div>
              <div>
                <div className="text-[12px] text-gray-500 mb-1.5">X方向超限值(mm) <span className="text-red-500">*</span></div>
                <input type="number" value={ruleData.xOver} onChange={e=>setRuleData(p=>({...p,xOver:formatNum(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500" placeholder="请输入超限值" step="0.01"/>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <div className="text-[13px] font-semibold text-gray-700 mb-3">Y方向偏差规则</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[12px] text-gray-500 mb-1.5">Y方向预警值(mm) <span className="text-red-500">*</span></div>
                <input type="number" value={ruleData.yWarn} onChange={e=>setRuleData(p=>({...p,yWarn:formatNum(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500" placeholder="请输入预警值" step="0.01"/>
              </div>
              <div>
                <div className="text-[12px] text-gray-500 mb-1.5">Y方向超限值(mm) <span className="text-red-500">*</span></div>
                <input type="number" value={ruleData.yOver} onChange={e=>setRuleData(p=>({...p,yOver:formatNum(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500" placeholder="请输入超限值" step="0.01"/>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <div className="text-[13px] font-semibold text-gray-700 mb-3">Z方向偏差规则</div>
            <div className="mb-3">
              <div className="text-[12px] text-gray-500 mb-2">Z方向判断方式 <span className="text-red-500">*</span></div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={ruleData.zMode === "absolute"} onChange={()=>setRuleData(p=>({...p,zMode:"absolute"}))} className="w-4 h-4 text-[#1F53BE] border-gray-300 focus:ring-[#1F53BE]"/>
                  <span className="text-[13px] text-gray-700">按绝对偏差判断</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={ruleData.zMode === "separate"} onChange={()=>setRuleData(p=>({...p,zMode:"separate"}))} className="w-4 h-4 text-[#1F53BE] border-gray-300 focus:ring-[#1F53BE]"/>
                  <span className="text-[13px] text-gray-700">区分沉降和隆起</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[12px] text-gray-500 mb-1.5">Z方向预警值(mm) <span className="text-red-500">*</span></div>
                <input type="number" value={ruleData.zWarn} onChange={e=>setRuleData(p=>({...p,zWarn:formatNum(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500" placeholder="请输入预警值" step="0.01"/>
              </div>
              <div>
                <div className="text-[12px] text-gray-500 mb-1.5">Z方向超限值(mm) <span className="text-red-500">*</span></div>
                <input type="number" value={ruleData.zOver} onChange={e=>setRuleData(p=>({...p,zOver:formatNum(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500" placeholder="请输入超限值" step="0.01"/>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <div className="text-[13px] font-semibold text-gray-700 mb-2">判断说明</div>
            <div className="text-[12px] text-gray-600 space-y-1">
              <p>· 绝对偏差小于预警值：正常</p>
              <p>· 绝对偏差达到预警值但小于超限值：预警</p>
              <p>· 绝对偏差达到或超过超限值：超限</p>
              <p>· 综合状态取X、Y、Z三个方向中最严重的状态</p>
            </div>
          </div>
          <div>
            <div className="text-[12px] text-gray-500 mb-1.5">备注</div>
            <textarea value={ruleData.remark} onChange={e=>setRuleData(p=>({...p,remark:e.target.value}))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 resize-none" rows={3} placeholder="请输入规则来源、专项监测方案或补充说明……"/>
          </div>
        </div>
      </Modal>
    </div>
  );
}
// ─── PAGE: RISK CONTROL ──────────────────────────────────────────────────────
const riskWorkpoints = ["翻车机房","地下皮带廊","基坑支护及降水工程","监测工程","临设及现场辅助工程"];
const riskUnitProjects = ["翻车机房工程","地下皮带廊工程","基坑支护及降水工程","监测工程","临设及现场辅助工程"];
const riskStages = ["施工准备阶段","基坑支护及降水阶段","坑内地下结构物施工阶段","地上结构及设备安装阶段"];
const riskCategories = ["基坑工程","脚手架工程","模板工程","起重吊装","高处作业","临时用电","消防安全","施工机械"];

function RiskControlPage() {
  const [tab, setTab] = useState("list");
  const [riskList, setRiskList] = useState(() => riskData.map(r => ({...r})));
  const [riskModal, setRiskModal] = useState<{open:boolean;mode:"add"|"edit"|"view";item?:typeof riskList[0]}>({open:false,mode:"add"});
  const [libViewModal, setLibViewModal] = useState<{open:boolean;item?:typeof riskLibraryData[0]}>({open:false});
  const [libSelectModal, setLibSelectModal] = useState<{open:boolean}>({open:false});
  const [libData, setLibData] = useState(() => riskLibraryData.map(r => ({...r})));
  
  // 风险库选择弹窗 filters
  const [libSelectFilterName, setLibSelectFilterName] = useState("");
  const [libSelectFilterCat, setLibSelectFilterCat] = useState("");
  const [libSelectFilterLevel, setLibSelectFilterLevel] = useState("");

  // 风险管理 filters
  const [filterStage, setFilterStage] = useState("");
  const [filterMName, setFilterMName] = useState("");
  const [filterMType, setFilterMType] = useState("");

  // 风险库 filters
  const [libFilterName, setLibFilterName] = useState("");
  const [libFilterCat, setLibFilterCat] = useState("");
  const [libFilterLevel, setLibFilterLevel] = useState("");

  const filteredRisk = riskList.filter(r => {
    if (filterStage && r.stage !== filterStage) return false;
    if (filterMName && !r.name.includes(filterMName)) return false;
    if (filterMType && r.category !== filterMType) return false;
    return true;
  });

  const filteredLib = libData.filter(r => {
    if (libFilterName && !r.name.includes(libFilterName)) return false;
    if (libFilterCat && r.category !== libFilterCat) return false;
    if (libFilterLevel && r.defaultLevel !== libFilterLevel) return false;
    return true;
  });

  const toggleBigscreen = (id: number) => {
    setRiskList(prev => prev.map(r => r.id === id ? {...r, bigscreen: r.bigscreen === "是" ? "否" : "是"} : r));
  };

  const level1 = riskList.filter(r => r.level === "一级风险").length;
  const level2 = riskList.filter(r => r.level === "二级风险").length;
  const pending = riskList.filter(r => r.status === "待落实").length;
  const overdue = riskList.filter(r => r.warningStatus === "超期").length;

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      
      <div className="bg-white border border-gray-200 rounded-xl flex-shrink-0">
        <div className="border-b border-gray-200 flex px-2">
          {[["list","项目风险管理"],["library","风险库"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer -mb-px ${tab === id ? "text-[#0052cc] border-[#0052cc]" : "text-slate-500 border-transparent hover:text-[#0052cc]"}`}>{label}</button>
          ))}
        </div>

        {/* 风险管理 */}
        {tab === "list" && (
          <>
            <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-end">
              <FItem label="施工阶段">
                <select value={filterStage} onChange={e=>setFilterStage(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none cursor-pointer">
                  <option value="">全部阶段</option>
                  {riskStages.map(s=><option key={s}>{s}</option>)}
                </select>
              </FItem>
              <FItem label="风险名称"><Inp placeholder="请输入风险名称" value={filterMName} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setFilterMName(e.target.value)}/></FItem>
              <FItem label="风险类型">
                <select value={filterMType} onChange={e=>setFilterMType(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none cursor-pointer">
                  <option value="">全部类型</option>
                  {riskCategories.map(c=><option key={c}>{c}</option>)}
                </select>
              </FItem>
              <div className="ml-auto flex gap-2">
                <Btn variant="primary"><Search size={13}/>查询</Btn>
                <Btn onClick={()=>{setFilterWp("");setFilterMName("");setFilterMType("");}}><RefreshCw size={13}/>重置</Btn>
                <Btn variant="primary" onClick={()=>setRiskModal({open:true,mode:"add"})}><Plus size={13}/>新增</Btn>
                <Btn><Download size={13}/>导出</Btn>
              </div>
            </div>
            <div className="overflow-auto" style={{ maxHeight: "480px" }}>
              <DTable
                headers={[{label:"序号",width:"55px"},{label:"施工阶段",width:"100px"},{label:"适用范围类型",width:"100px"},{label:"适用对象",width:"120px"},{label:"风险名称",width:"100px"},{label:"风险类型",width:"80px"},{label:"风险等级",width:"80px"},{label:"风险管控分析",width:"150px"},{label:"风险措施",width:"150px"},{label:"责任部门",width:"80px"},{label:"责任人",width:"60px"},{label:"责任人联系方式",width:"110px"},{label:"项目经理",width:"70px"},{label:"项目经理联系方式",width:"110px"},{label:"创建时间",width:"100px"},{label:"操作",width:"100px"}]}
                rows={filteredRisk.flatMap((r,i) => {
                  const objects = r.scopeObjects && r.scopeObjects.length > 0 ? r.scopeObjects : ["-"];
                  return objects.map((obj, idx) => [
                    idx === 0 ? i+1 : "",
                    idx === 0 ? <span key="wp" className="text-[13px] text-slate-700">{r.stage}</span> : "",
                    idx === 0 ? <span key="st" className="text-[13px] text-slate-700">{r.scopeType || "-"}</span> : "",
                    <span key="so" className="text-[13px] text-slate-700">{obj}</span>,
                    idx === 0 ? <span key="n" className={`font-medium text-[13px] ${r.level==="一级风险"?"text-red-700":""}`}>{r.name}</span> : "",
                    idx === 0 ? <span key="cat" className="text-[12px] text-slate-500">{r.category}</span> : "",
                    idx === 0 ? <StatusTag key="lv" status={r.level}/> : "",
                    idx === 0 ? <span key="a" className="text-[12px] text-slate-500 line-clamp-2">{r.analysis || "-"}</span> : "",
                    idx === 0 ? <span key="m" className="text-[12px] text-slate-500 line-clamp-2">{r.measure}</span> : "",
                    idx === 0 ? <span key="dept" className="text-[13px]">{r.dept}</span> : "",
                    idx === 0 ? <span key="p" className="text-[13px]">{r.person}</span> : "",
                    idx === 0 ? <span key="pc" className="text-[13px]">{r.personContact || "-"}</span> : "",
                    idx === 0 ? <span key="pm" className="text-[13px]">{r.projectManager || "-"}</span> : "",
                    idx === 0 ? <span key="pmc" className="text-[13px]">{r.projectManagerContact || "-"}</span> : "",
                    idx === 0 ? <span key="ct" className="text-[12px] text-slate-400">{r.createTime}</span> : "",
                    idx === 0 ? (
                      <div key="a" className="flex gap-2">
                        <button onClick={()=>setRiskModal({open:true,mode:"view",item:r})} className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">查看</button>
                        <button onClick={()=>setRiskModal({open:true,mode:"edit",item:r})} className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">编辑</button>
                        <button onClick={()=>setRiskList(prev=>prev.filter(x=>x.id!==r.id))} className="text-red-600 text-[13px] hover:underline cursor-pointer">删除</button>
                      </div>
                    ) : ""
                  ]);
                })}
              />
            </div>
          </>
        )}

        {/* 风险库 */}
        {tab === "library" && (
          <>
            <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-end">
              <FItem label="风险名称"><Inp placeholder="请输入风险名称" value={libFilterName} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setLibFilterName(e.target.value)}/></FItem>
              <FItem label="风险类型">
                <select value={libFilterCat} onChange={e=>setLibFilterCat(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none cursor-pointer">
                  <option value="">全部类型</option>
                  {riskCategories.map(c=><option key={c}>{c}</option>)}
                </select>
              </FItem>
              <FItem label="风险等级">
                <select value={libFilterLevel} onChange={e=>setLibFilterLevel(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none cursor-pointer">
                  <option value="">全部等级</option>
                  <option>一级风险</option><option>二级风险</option><option>三级风险</option><option>四级风险</option>
                </select>
              </FItem>
              <div className="ml-auto flex gap-2">
                <Btn variant="primary"><Search size={13}/>查询</Btn>
                <Btn onClick={()=>{setLibFilterName("");setLibFilterCat("");setLibFilterLevel("");}}><RefreshCw size={13}/>重置</Btn>
                <Btn variant="danger" onClick={()=>setLibViewModal({open:true,item:undefined})}><Plus size={13}/>新增</Btn>
                <Btn><Upload size={13}/>导入</Btn>
              </div>
            </div>
            <div className="overflow-auto" style={{ maxHeight: "480px" }}>
              <DTable
                headers={[{label:"序号",width:"55px"},{label:"风险名称",width:"150px"},{label:"风险类型",width:"100px"},{label:"风险等级",width:"90px"},{label:"风险管控分析",width:"200px"},{label:"风险措施",width:"200px"},{label:"操作",width:"100px"}]}
                rows={filteredLib.map((r,i) => [
                  i+1,
                  <span key="n" className="font-medium text-[13px] text-slate-800">{r.name}</span>,
                  <span key="cat" className="text-[12px] text-slate-500">{r.category}</span>,
                  <StatusTag key="l" status={r.defaultLevel}/>,
                  <span key="a" className="text-[12px] text-slate-500">{r.analysis || "-"}</span>,
                  <span key="m" className="text-[12px] text-slate-500">{r.measure}</span>,
                  <div key="a" className="flex gap-2">
                    <button onClick={()=>setLibViewModal({open:true,item:r})} className="text-[#0052cc] text-[12px] hover:underline cursor-pointer">查看</button>
                    <button onClick={()=>setLibData(prev=>prev.filter(x=>x.id!==r.id))} className="text-red-600 text-[12px] hover:underline cursor-pointer">删除</button>
                  </div>
                ])}
              />
            </div>
          </>
        )}

      </div>

      {/* 风险管理 查看/编辑 Modal */}
      <Modal open={riskModal.open} onClose={()=>setRiskModal(p=>({...p,open:false}))} title={riskModal.mode==="add"?"新增项目风险管理":riskModal.mode==="edit"?"编辑项目风险管理":"项目风险管理详情"} width="680px"
        footer={riskModal.mode==="view"?<Btn onClick={()=>setRiskModal(p=>({...p,open:false}))}>关闭</Btn>:<ModalFooter onCancel={()=>setRiskModal(p=>({...p,open:false}))} onConfirm={()=>setRiskModal(p=>({...p,open:false}))} confirmText="保存"/>}>
        {riskModal.mode==="view" && riskModal.item ? (
          <>
            <FSec title="基本信息">
              <DetailRow label="施工阶段" value={riskModal.item.stage}/>
              <DetailRow label="适用范围类型" value={riskModal.item.scopeType || "-"}/>
              <DetailRow label="适用对象" value={(riskModal.item.scopeObjects || []).join("、") || "-"}/>
              <DetailRow label="风险名称" value={riskModal.item.name}/>
              <DetailRow label="风险类型" value={riskModal.item.category}/>
              <DetailRow label="风险等级" value={<StatusTag status={riskModal.item.level}/>}/>
              <DetailRow label="风险管控分析" value={riskModal.item.analysis || "-"}/>
              <DetailRow label="风险措施" value={riskModal.item.measure}/>
            </FSec>
            <FSec title="管控信息">
              <DetailRow label="责任部门" value={riskModal.item.dept}/>
              <DetailRow label="责任人" value={riskModal.item.person}/>
              <DetailRow label="责任人联系方式" value={riskModal.item.personContact || "-"}/>
              <DetailRow label="项目经理" value={riskModal.item.projectManager || "-"}/>
              <DetailRow label="项目经理联系方式" value={riskModal.item.projectManagerContact || "-"}/>
              <DetailRow label="创建时间" value={riskModal.item.createTime}/>
            </FSec>
          </>
        ) : (
          <FormGrid>
            <FF label="施工阶段" required>
              <FS options={riskStages} defaultValue={riskModal.item?.stage}/>
            </FF>
            <FF label="适用范围类型">
              <FS options={["单位工程","工点"]} defaultValue={riskModal.item?.scopeType || "工点"} onChange={(v)=>{
                setRiskModal(p=>({...p, item: {...(p.item || {}), scopeType: v, scopeObjects: []} as any}));
              }}/>
            </FF>
            <FF label="适用对象" full>
              <MultiSelect 
                options={riskModal.item?.scopeType === "单位工程" ? riskUnitProjects : riskWorkpoints}
                value={riskModal.item?.scopeObjects || []}
                onChange={(vals)=>setRiskModal(p=>({...p, item: {...(p.item || {}), scopeObjects: vals} as any}))}
              />
            </FF>
            <FF label="风险名称" required>
              <div className="flex gap-2">
                <input type="text" readOnly value={riskModal.item?.name || ""} className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-[13px] bg-gray-50" placeholder="请选择风险名称"/>
                <button onClick={()=>setLibSelectModal({open:true})} className="px-3 py-1.5 border border-[#0052cc] rounded-md text-[13px] font-medium cursor-pointer bg-[#0052cc] text-white hover:bg-[#0044a8]">选择</button>
              </div>
            </FF>
            <FF label="风险类型">
              <input type="text" readOnly value={riskModal.item?.category || ""} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-[13px] bg-gray-50" placeholder="选择风险名称后自动填充"/>
            </FF>
            <FF label="风险等级">
              <StatusTag status={riskModal.item?.level || "-"}/>
            </FF>
            <FF label="风险管控分析" full>
              <textarea readOnly value={riskModal.item?.analysis || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50 resize-none" placeholder="选择风险名称后自动填充" rows={3}/>
            </FF>
            <FF label="风险措施" full>
              <textarea readOnly value={riskModal.item?.measure || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50 resize-none" placeholder="选择风险名称后自动填充" rows={3}/>
            </FF>
            <FF label="责任部门">
              <FS options={["安全质量部","工程部","机电部","综合部"]} defaultValue={riskModal.item?.dept}/>
            </FF>
            <FF label="责任人">
              <FI placeholder="请输入责任人" defaultValue={riskModal.item?.person}/>
            </FF>
            <FF label="责任人联系方式">
              <FI placeholder="请输入责任人联系方式" defaultValue={riskModal.item?.personContact}/>
            </FF>
            <FF label="项目经理">
              <FI placeholder="请输入项目经理" defaultValue={riskModal.item?.projectManager}/>
            </FF>
            <FF label="项目经理联系方式">
              <FI placeholder="请输入项目经理联系方式" defaultValue={riskModal.item?.projectManagerContact}/>
            </FF>
          </FormGrid>
        )}
      </Modal>

      {/* 风险库 查看/新增 Modal */}
      <Modal open={libViewModal.open} onClose={()=>setLibViewModal(p=>({...p,open:false}))} title={libViewModal.item?"风险库详情":"新增风险库"} width="600px" 
        footer={libViewModal.item?<Btn onClick={()=>setLibViewModal(p=>({...p,open:false}))}>关闭</Btn>:<ModalFooter onCancel={()=>setLibViewModal(p=>({...p,open:false}))} onConfirm={()=>setLibViewModal(p=>({...p,open:false}))} confirmText="保存"/>}>
        {libViewModal.item ? (
          <FSec title="基本信息">
            <DetailRow label="编号" value={libViewModal.item.code}/>
            <DetailRow label="风险名称" value={libViewModal.item.name}/>
            <DetailRow label="风险类型" value={libViewModal.item.category}/>
            <DetailRow label="风险等级" value={<StatusTag status={libViewModal.item.defaultLevel}/>}/>
            <DetailRow label="风险管控分析" value={libViewModal.item.analysis || "-"}/>
            <DetailRow label="风险措施" value={libViewModal.item.measure}/>
          </FSec>
        ) : (
          <FSec title="基本信息">
            <FF label="编号" required><Inp placeholder="请输入编号"/></FF>
            <FF label="风险名称" required><Inp placeholder="请输入风险名称"/></FF>
            <FF label="风险类型" required><FS options={riskCategories}/></FF>
            <FF label="风险等级" required><FS options={["一级风险","二级风险","三级风险","四级风险"]}/></FF>
            <FF label="风险管控分析" required full><FTA placeholder="请输入风险管控分析" rows={3}/></FF>
            <FF label="风险措施" required full><FTA placeholder="请输入风险措施" rows={3}/></FF>
          </FSec>
        )}
      </Modal>

      {/* 风险库选择 Modal */}
      <Modal open={libSelectModal.open} onClose={()=>setLibSelectModal(p=>({...p,open:false}))} title="选择风险名称" width="700px" footer={<Btn onClick={()=>setLibSelectModal(p=>({...p,open:false}))}>关闭</Btn>}>
        <div className="mb-3 flex gap-3">
          <div className="flex-1">
            <label className="block text-[12px] text-gray-500 mb-1">风险名称</label>
            <input type="text" value={libSelectFilterName} onChange={(e)=>setLibSelectFilterName(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-[13px]" placeholder="请输入风险名称"/>
          </div>
          <div className="w-36">
            <label className="block text-[12px] text-gray-500 mb-1">风险类型</label>
            <select value={libSelectFilterCat} onChange={(e)=>setLibSelectFilterCat(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] appearance-none bg-white">
              <option value="">全部</option>
              {riskCategories.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-[12px] text-gray-500 mb-1">风险等级</label>
            <select value={libSelectFilterLevel} onChange={(e)=>setLibSelectFilterLevel(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] appearance-none bg-white">
              <option value="">全部</option>
              <option>一级风险</option>
              <option>二级风险</option>
              <option>三级风险</option>
              <option>四级风险</option>
            </select>
          </div>
          <button onClick={()=>{setLibSelectFilterName("");setLibSelectFilterCat("");setLibSelectFilterLevel("");}} className="self-end px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">重置</button>
        </div>
        <div className="overflow-auto" style={{ maxHeight: "350px" }}>
          <DTable
            headers={[{label:"序号",width:"55px"},{label:"风险名称",width:"150px"},{label:"风险类型",width:"100px"},{label:"风险等级",width:"90px"},{label:"风险管控分析",width:"200px"},{label:"风险措施",width:"200px"},{label:"操作",width:"60px"}]}
            rows={libData.filter(r=>{
              if(libSelectFilterName && !r.name.includes(libSelectFilterName)) return false;
              if(libSelectFilterCat && r.category !== libSelectFilterCat) return false;
              if(libSelectFilterLevel && r.defaultLevel !== libSelectFilterLevel) return false;
              return true;
            }).map((r,i) => [
              i+1,
              <span key="n" className="font-medium text-[13px] text-slate-800">{r.name}</span>,
              <span key="cat" className="text-[12px] text-slate-500">{r.category}</span>,
              <StatusTag key="l" status={r.defaultLevel}/>,
              <span key="a" className="text-[12px] text-slate-500">{r.analysis || "-"}</span>,
              <span key="m" className="text-[12px] text-slate-500">{r.measure}</span>,
              <button key="sel" onClick={()=>{
                setRiskModal(p=>({
                  ...p,
                  item: {
                    ...(p.item || {}),
                    name: r.name,
                    category: r.category,
                    level: r.defaultLevel,
                    analysis: r.analysis,
                    measure: r.measure
                  } as any
                }));
                setLibSelectModal({open:false});
              }} className="text-[#0052cc] text-[12px] hover:underline cursor-pointer">选择</button>
            ])}
          />
        </div>
      </Modal>
    </div>
  );
}

// ─── PAGE: AI ALARM ──────────────────────────────────────────────────────────
// ─── PAGE: VIOLATION RECORD ──────────────────────────────────────────────────
const violationData = [
  // ── 王海 (5次) ──
  { id:1,  person:"王海", behavior:"未正确佩戴安全帽",   category:"个人防护", location:"2号门入口",       time:"2026/7/10 10:12", totalCount:5, screenshot:"https://images.unsplash.com/photo-1612725118809-0bebfb71a551?w=300&q=80", isRelated:true, relatedPersons:[{name:"王海",idCard:"110101199001011234",team:"钢筋班组"}], cameraName:"施工主通道摄像头" },
  { id:10, person:"王海", behavior:"未穿反光背心",       category:"个人防护", location:"基坑东侧施工区",   time:"2026/7/9 14:30",  totalCount:5, screenshot:"https://images.unsplash.com/photo-1628158088791-89567a8e84ec?w=300&q=80", isRelated:true, relatedPersons:[{name:"王海",idCard:"110101199001011234",team:"钢筋班组"}], cameraName:"翻车机房基坑北侧" },
  { id:11, person:"王海", behavior:"施工现场吸烟",       category:"文明施工", location:"材料堆放区南侧",   time:"2026/7/8 11:20",  totalCount:5, screenshot:"https://images.unsplash.com/photo-1759922378219-1d31edb644f4?w=300&q=80", isRelated:false, relatedPersons:[], cameraName:"材料堆放区摄像头" },
  { id:12, person:"王海", behavior:"违规操作电动工具",   category:"机械操作", location:"钢筋加工区",       time:"2026/7/5 09:15",  totalCount:5, screenshot:"https://images.unsplash.com/photo-1628158088791-89567a8e84ec?w=300&q=80", isRelated:true, relatedPersons:[{name:"王海",idCard:"110101199001011234",team:"钢筋班组"}], cameraName:"钢筋加工区摄像头" },
  { id:13, person:"王海", behavior:"人员进入危险区域",   category:"安全行为", location:"吊装作业区",       time:"2026/7/2 16:45",  totalCount:5, screenshot:"https://images.unsplash.com/photo-1770822662968-ca372bb6d1a5?w=300&q=80", isRelated:false, relatedPersons:[], cameraName:"吊装作业区摄像头" },
  // ── 其他人员 ──
  { id:2, person:"李强",  behavior:"未穿反光背心",       category:"个人防护", location:"基坑东侧施工区",   time:"2026/7/10 09:45", totalCount:3, screenshot:"https://images.unsplash.com/photo-1628158088791-89567a8e84ec?w=300&q=80", isRelated:true, relatedPersons:[{name:"李强",idCard:"110101199102022345",team:"木工班组"}], cameraName:"翻车机房基坑南侧" },
  { id:3, person:"张明",  behavior:"人员进入危险区域",   category:"安全行为", location:"吊装作业区",       time:"2026/7/10 11:30", totalCount:2, screenshot:"https://images.unsplash.com/photo-1770822662968-ca372bb6d1a5?w=300&q=80", isRelated:false, relatedPersons:[], cameraName:"吊装作业区摄像头" },
  { id:4, person:"赵刚",  behavior:"高处作业未系安全带", category:"高处作业", location:"翻车机房3层平台",  time:"2026/7/10 14:05", totalCount:1, screenshot:"https://images.unsplash.com/photo-1763973137261-f6c67c5d3051?w=300&q=80", isRelated:true, relatedPersons:[{name:"赵刚",idCard:"110101199203033456",team:"架子班组"}], cameraName:"翻车机房主体施工区" },
  { id:5, person:"孙伟",  behavior:"施工现场吸烟",       category:"文明施工", location:"材料堆放区南侧",   time:"2026/7/9 16:22",  totalCount:4, screenshot:"https://images.unsplash.com/photo-1759922378219-1d31edb644f4?w=300&q=80", isRelated:true, relatedPersons:[{name:"孙伟",idCard:"110101199304044567",team:"电工班组"}], cameraName:"材料堆放区摄像头" },
  { id:6, person:"陈建",  behavior:"私拉乱接电线",       category:"临时用电", location:"基坑配电箱旁",     time:"2026/7/9 08:55",  totalCount:2, screenshot:"https://images.unsplash.com/photo-1762438440807-adaaf10faf64?w=300&q=80", isRelated:false, relatedPersons:[], cameraName:"基坑东侧支护区" },
  { id:7, person:"周磊",  behavior:"未正确佩戴安全帽",   category:"个人防护", location:"钢筋加工区",       time:"2026/7/8 10:40",  totalCount:6, screenshot:"https://images.unsplash.com/photo-1612725118809-0bebfb71a551?w=300&q=80", isRelated:true, relatedPersons:[{name:"周磊",idCard:"110101199405055678",team:"钢筋班组"}], cameraName:"钢筋加工区摄像头" },
  { id:8, person:"吴涛",  behavior:"违规操作电动工具",   category:"机械操作", location:"木工加工棚",       time:"2026/7/8 13:15",  totalCount:1, screenshot:"https://images.unsplash.com/photo-1628158088791-89567a8e84ec?w=300&q=80", isRelated:false, relatedPersons:[], cameraName:"木工加工棚摄像头" },
  { id:9, person:"郑华",  behavior:"拆除安全防护设施",   category:"安全防护", location:"基坑西南角临边",   time:"2026/7/7 15:50",  totalCount:3, screenshot:"https://images.unsplash.com/photo-1770822662968-ca372bb6d1a5?w=300&q=80", isRelated:true, relatedPersons:[{name:"郑华",idCard:"110101199506066789",team:"土方班组"}], cameraName:"基坑西侧支护区" },
];

function ViolationRecordPage() {
  const [detailModal, setDetailModal] = useState<{open:boolean;item?:typeof violationData[0]}>({open:false});
  const [relateModal, setRelateModal] = useState<{open:boolean;item?:typeof violationData[0]}>({open:false});
  const [relNameSearch, setRelNameSearch] = useState("");
  const [relTeamSearch, setRelTeamSearch] = useState("");
  const [relSelected, setRelSelected] = useState<string[]>([]);
  const [filterBehavior, setFilterBehavior] = useState("");
  const [filterScope, setFilterScope] = useState("");
  const [filterCameraName, setFilterCameraName] = useState("");
  const [filterTimeStart, setFilterTimeStart] = useState("");
  const [filterTimeEnd, setFilterTimeEnd] = useState("");
  const [filterIsRelated, setFilterIsRelated] = useState("");

  const filtered = violationData.filter(d=>{
    if (filterBehavior && d.behavior !== filterBehavior) return false;
    if (filterScope && d.location !== filterScope) return false;
    if (filterCameraName && d.cameraName !== filterCameraName) return false;
    if (filterIsRelated === "是" && !d.isRelated) return false;
    if (filterIsRelated === "否" && d.isRelated) return false;
    if (filterTimeStart && d.time < filterTimeStart) return false;
    if (filterTimeEnd && d.time > filterTimeEnd) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      {/* 搜索条件模块 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="text-[13px] font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Search size={14} className="text-gray-400"/>
          搜索条件
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">违规行为</label>
            <select value={filterBehavior} onChange={e=>setFilterBehavior(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none focus:border-blue-400 cursor-pointer">
              <option value="">全部违规行为</option>
              {Array.from(new Set(violationData.map(d=>d.behavior))).map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">范围</label>
            <select value={filterScope} onChange={e=>setFilterScope(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none focus:border-blue-400 cursor-pointer">
              <option value="">全部范围</option>
              {Array.from(new Set(violationData.map(d=>d.location))).map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">摄像头名称</label>
            <select value={filterCameraName} onChange={e=>setFilterCameraName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none focus:border-blue-400 cursor-pointer">
              <option value="">全部摄像头</option>
              {Array.from(new Set(violationData.map(d=>d.cameraName))).map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">开始时间</label>
            <input type="date" value={filterTimeStart} onChange={e=>setFilterTimeStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none focus:border-blue-400"/>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">结束时间</label>
            <input type="date" value={filterTimeEnd} onChange={e=>setFilterTimeEnd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none focus:border-blue-400"/>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">是否关联人员</label>
            <select value={filterIsRelated} onChange={e=>setFilterIsRelated(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none focus:border-blue-400 cursor-pointer">
              <option value="">全部</option>
              <option>是</option>
              <option>否</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
          <button onClick={()=>{setFilterBehavior("");setFilterScope("");setFilterCameraName("");setFilterTimeStart("");setFilterTimeEnd("");setFilterIsRelated("");}}
            className="px-4 py-2 rounded-lg text-[13px] border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">重置</button>
          <button className="px-4 py-2 rounded-lg text-[13px] font-medium text-white cursor-pointer hover:opacity-90 transition-all" style={{background:"#1F53BE"}}>查询</button>
        </div>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-[13px]" style={{minWidth:"860px"}}>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["序号","截图画面","违规行为","工点","摄像头名称","违规时间","是否关联人员","操作"].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d,i)=>(
              <tr key={d.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                <td className="px-4 py-2 text-gray-400 text-[12px]">{i+1}</td>
                <td className="px-4 py-2">
                  <div className="relative w-[90px] h-[60px] rounded overflow-hidden flex-shrink-0 bg-gray-900">
                    <img src={d.screenshot} alt={d.behavior} className="w-full h-full object-cover opacity-80"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <div className="absolute bottom-0.5 left-1 right-1 flex items-center justify-between">
                      <span className="text-[8px] text-red-400 font-mono">● REC</span>
                      <span className="text-[8px] text-white/70 font-mono">{d.time.slice(-5)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-100">{d.behavior}</span>
                </td>
                <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{d.location}</td>
                <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{d.cameraName}</td>
                <td className="px-4 py-2 text-gray-500 whitespace-nowrap text-[12px]">{d.time}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center justify-center w-16 px-2 py-0.5 rounded-full text-[11px] font-medium ${d.isRelated ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                    {d.isRelated ? "是" : "否"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-3">
                    <button onClick={()=>setDetailModal({open:true,item:d})}
                      className="text-[13px] hover:underline cursor-pointer" style={{color:"#1F53BE"}}>查看</button>
                    <button onClick={()=>setRelateModal({open:true,item:d})}
                      className="text-[13px] hover:underline cursor-pointer text-gray-500">关联人员</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页 */}
        <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
          <Pager total={filtered.length}/>
        </div>
      </div>

      {/* 查看详情 Modal */}
      <Modal open={detailModal.open} onClose={()=>setDetailModal(p=>({...p,open:false}))} title="违规详情" width="560px"
        footer={<button onClick={()=>setDetailModal(p=>({...p,open:false}))} className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">关闭</button>}>
        {detailModal.item && (
          <div className="flex flex-col gap-4">
            {/* 违规大图 */}
            <div className="relative w-full rounded-xl overflow-hidden bg-gray-900" style={{aspectRatio:"16/9"}}>
              <img src={detailModal.item.screenshot} alt={detailModal.item.behavior} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20"/>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 rounded px-2 py-0.5">
                <span className="text-[11px] text-red-400 font-mono animate-pulse">●</span>
                <span className="text-[11px] text-white/90 font-mono tracking-wide">REC</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block px-3 py-1 rounded-lg text-[13px] font-semibold bg-red-600/90 text-white shadow">{detailModal.item.behavior}</span>
              </div>
            </div>
            {/* 信息行 */}
            <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              <div className="flex items-center px-4 py-3 gap-3 bg-white">
                <span className="text-[13px] text-gray-400 w-16 flex-shrink-0">违规行为</span>
                <span className="text-[13px] font-medium text-red-700">{detailModal.item.behavior}</span>
              </div>
              <div className="flex items-center px-4 py-3 gap-3 bg-white">
                <span className="text-[13px] text-gray-400 w-16 flex-shrink-0">违规时间</span>
                <span className="text-[13px] text-gray-700">{detailModal.item.time}</span>
              </div>
              <div className="flex items-center px-4 py-3 gap-3 bg-white">
                <span className="text-[13px] text-gray-400 w-16 flex-shrink-0">工点</span>
                <span className="text-[13px] text-gray-700">{detailModal.item.location}</span>
              </div>
              <div className="flex items-center px-4 py-3 gap-3 bg-white">
                <span className="text-[13px] text-gray-400 w-16 flex-shrink-0">是否关联人员</span>
                <span className={`inline-flex items-center justify-center w-16 px-2 py-0.5 rounded-full text-[11px] font-medium ${detailModal.item.isRelated ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                  {detailModal.item.isRelated ? "是" : "否"}
                </span>
              </div>
              {detailModal.item.isRelated && detailModal.item.relatedPersons && detailModal.item.relatedPersons.length > 0 && (
                <div className="px-4 py-3 bg-white">
                  <span className="text-[13px] text-gray-400 w-16 flex-shrink-0 inline-block">关联人员明细</span>
                  <div className="mt-2 space-y-2">
                    {detailModal.item.relatedPersons.map((rp, idx) => (
                      <div key={idx} className="flex items-center gap-4 px-3 py-2 bg-gray-50 rounded-lg">
                        <span className="text-[13px] font-medium text-gray-700">{rp.name}</span>
                        <span className="text-[12px] text-gray-500">{rp.idCard}</span>
                        <span className="text-[12px] text-gray-500">{rp.team}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 关联人员 Modal */}
      <Modal open={relateModal.open} onClose={()=>{setRelateModal(p=>({...p,open:false}));setRelNameSearch("");setRelTeamSearch("");setRelSelected([]);}} title="关联人员" width="720px"
        footer={
          <div className="flex gap-2 justify-end">
            <button onClick={()=>{setRelateModal(p=>({...p,open:false}));setRelNameSearch("");setRelTeamSearch("");setRelSelected([]);}}
              className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">取消</button>
            <button onClick={()=>{setRelateModal(p=>({...p,open:false}));setRelNameSearch("");setRelTeamSearch("");setRelSelected([]);}}
              className="px-4 py-1.5 rounded-lg text-[13px] text-white cursor-pointer hover:opacity-90" style={{background:"#1F53BE"}}>
              确定{relSelected.length>0?`（已选${relSelected.length}人）`:""}
            </button>
          </div>
        }>
        {relateModal.item && (() => {
          const allPersonnel: {key:string;name:string;idCard:string;trade:string;unit:string;team:string;status:string;entry:string;phone:string}[] = [
            {key:"p1", name:"王海",   idCard:"110101199001011234", trade:"钢筋工",     unit:"中铁二十四局", team:"钢筋一班",   status:"在场", entry:"2024-03-01", phone:"138****2301"},
            {key:"p2", name:"刘建军", idCard:"110102199102022345", trade:"混凝土工",   unit:"中建三局",     team:"混凝土二班", status:"在场", entry:"2024-04-15", phone:"139****4412"},
            {key:"p3", name:"陈伟",   idCard:"110103199203033456", trade:"架子工",     unit:"中铁建设",     team:"架子班",     status:"离场", entry:"2024-02-20", phone:"136****5523"},
            {key:"p4", name:"李强",   idCard:"110101199102022345", trade:"钢筋工",     unit:"中建一局",     team:"钢筋二班",   status:"在场", entry:"2024-01-10", phone:"137****6634"},
            {key:"p5", name:"赵磊",   idCard:"110104199304044567", trade:"焊工",       unit:"中铁二十四局", team:"焊接班",     status:"在场", entry:"2024-05-01", phone:"135****7745"},
            {key:"p6", name:"张明",   idCard:"110105199405055678", trade:"吊装工",     unit:"中建三局",     team:"吊装班",     status:"在场", entry:"2024-03-18", phone:"133****8856"},
            {key:"p7", name:"吴刚",   idCard:"110106199506066789", trade:"架子工",     unit:"中铁建设",     team:"架子二班",   status:"在场", entry:"2024-02-28", phone:"134****9967"},
            {key:"p8", name:"孙鹏",   idCard:"110107199607077890", trade:"普工",       unit:"中建一局",     team:"杂工班",     status:"离场", entry:"2024-06-01", phone:"132****0078"},
            {key:"p9", name:"周明",   idCard:"110108199708088901", trade:"混凝土工",   unit:"中建三局",     team:"混凝土一班", status:"在场", entry:"2024-04-01", phone:"131****1189"},
            {key:"p10",name:"黄涛",   idCard:"110109199809099012", trade:"钢筋工",     unit:"中铁二十四局", team:"钢筋三班",   status:"在场", entry:"2024-03-15", phone:"130****2290"},
            {key:"p11",name:"杨波",   idCard:"110110199910100123", trade:"机械操作工", unit:"中铁建设",     team:"机械班",     status:"在场", entry:"2024-02-10", phone:"188****3301"},
            {key:"p12",name:"谢磊",   idCard:"110111200011111234", trade:"普工",       unit:"中建一局",     team:"杂工班",     status:"在场", entry:"2024-05-20", phone:"187****4412"},
            {key:"p13",name:"郑华",   idCard:"110101199506066789", trade:"架子工",     unit:"中建三局",     team:"架子一班",   status:"在场", entry:"2024-01-25", phone:"186****5523"},
            {key:"p14",name:"冯强",   idCard:"110112200112122345", trade:"钢筋工",     unit:"中铁建设",     team:"钢筋班",     status:"在场", entry:"2024-04-08", phone:"185****6634"},
            {key:"p15",name:"马建国", idCard:"110113200201013456", trade:"电工",       unit:"中铁二十四局", team:"水电班",     status:"在场", entry:"2024-03-10", phone:"184****1234"},
          ];
          const allTeams = Array.from(new Set(allPersonnel.map(p=>p.team)));
          const filteredList = allPersonnel.filter(p=>{
            if (relNameSearch && !p.name.includes(relNameSearch)) return false;
            if (relTeamSearch && p.team !== relTeamSearch) return false;
            return true;
          });
          const toggleSelect = (key:string) => {
            setRelSelected(prev => prev.includes(key) ? prev.filter(k=>k!==key) : [...prev, key]);
          };
          const allChecked = filteredList.length>0 && filteredList.every(p=>relSelected.includes(p.key));
          const toggleAll = () => {
            if (allChecked) setRelSelected(prev=>prev.filter(k=>!filteredList.map(p=>p.key).includes(k)));
            else setRelSelected(prev=>Array.from(new Set([...prev, ...filteredList.map(p=>p.key)])));
          };
          return (
            <div className="flex flex-col gap-3">
              {/* 搜索栏 */}
              <div className="flex gap-2">
                <input value={relNameSearch} onChange={e=>setRelNameSearch(e.target.value)} placeholder="搜索人员姓名"
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
                <select value={relTeamSearch} onChange={e=>setRelTeamSearch(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none cursor-pointer">
                  <option value="">全部班组</option>
                  {allTeams.map(t=><option key={t}>{t}</option>)}
                </select>
                {(relNameSearch||relTeamSearch) && (
                  <button onClick={()=>{setRelNameSearch("");setRelTeamSearch("");}} className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-500 hover:bg-gray-50 cursor-pointer">重置</button>
                )}
              </div>
              {/* 已选提示 */}
              {relSelected.length>0 && (
                <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[13px] text-blue-700">
                  已选 <span className="font-semibold">{relSelected.length}</span> 名人员
                  <button onClick={()=>setRelSelected([])} className="ml-3 text-blue-400 hover:text-blue-600 cursor-pointer">清空选择</button>
                </div>
              )}
              {/* 人员列表 */}
              <div className="rounded-lg border border-gray-200 overflow-hidden max-h-[340px] overflow-y-auto">
                <table className="w-full text-[13px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2.5 w-10">
                        <input type="checkbox" checked={allChecked} onChange={toggleAll} className="cursor-pointer"/>
                      </th>
                      {["姓名","身份证号","班组","工种","所属单位","人员状态","进场时间"].map(h=>(
                        <th key={h} className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length===0 ? (
                      <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400 text-[13px]">暂无匹配人员</td></tr>
                    ) : filteredList.map((p,i)=>(
                      <tr key={p.key} onClick={()=>toggleSelect(p.key)} className={`border-b border-gray-100 cursor-pointer transition-colors ${relSelected.includes(p.key)?"bg-blue-50":"hover:bg-gray-50/50"} ${i%2===0?"":"bg-gray-50/20"}`}>
                        <td className="px-3 py-2.5 text-center">
                          <input type="checkbox" checked={relSelected.includes(p.key)} onChange={()=>toggleSelect(p.key)} onClick={e=>e.stopPropagation()} className="cursor-pointer"/>
                        </td>
                        <td className="px-3 py-2.5 font-medium text-gray-800">{p.name}</td>
                        <td className="px-3 py-2.5 text-gray-600 font-mono text-[12px]">{p.idCard}</td>
                        <td className="px-3 py-2.5 text-gray-600">{p.team}</td>
                        <td className="px-3 py-2.5 text-gray-600">{p.trade}</td>
                        <td className="px-3 py-2.5 text-gray-600">{p.unit}</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${p.status==="在场"?"bg-green-50 text-green-700":"bg-gray-100 text-gray-500"}`}>{p.status}</span>
                        </td>
                        <td className="px-3 py-2.5 text-gray-500 text-[12px]">{p.entry}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

const cameraWorkpoints = ["翻车机房","地下皮带廊","基坑支护及降水工程","监测工程","临设及现场辅助工程"];
const cameraList = [
  { id:1,  code:"CAM-001", name:"翻车机房基坑北侧",   workpoint:"翻车机房",            status:"normal",  lastCheck:"2026/7/10 14:30", image:"https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM001", channel:"1" },
  { id:2,  code:"CAM-002", name:"翻车机房基坑南侧",   workpoint:"翻车机房",            status:"normal",  lastCheck:"2026/7/10 14:28", image:"https://images.unsplash.com/photo-1517089152318-42ec560349c0?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM002", channel:"1" },
  { id:3,  code:"CAM-003", name:"翻车机房主体施工区", workpoint:"翻车机房",            status:"normal",  lastCheck:"2026/7/10 14:32", image:"https://images.unsplash.com/photo-1694521787162-5373b598945c?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM003", channel:"2" },
  { id:4,  code:"CAM-004", name:"翻车机房1号门入口",  workpoint:"翻车机房",            status:"offline", lastCheck:"2026/7/10 09:15", image:"", deviceSerial:"DS-2CD3T46WD-I3-CAM004", channel:"1" },
  { id:5,  code:"CAM-005", name:"地下皮带廊东口",     workpoint:"地下皮带廊",          status:"normal",  lastCheck:"2026/7/10 14:30", image:"https://images.unsplash.com/photo-1527335988388-b40ee248d80c?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM005", channel:"1" },
  { id:6,  code:"CAM-006", name:"地下皮带廊西口",     workpoint:"地下皮带廊",          status:"normal",  lastCheck:"2026/7/10 14:25", image:"https://images.unsplash.com/photo-1673978481178-b4d72cfd2fb9?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM006", channel:"1" },
  { id:7,  code:"CAM-007", name:"地下皮带廊中段",     workpoint:"地下皮带廊",          status:"offline", lastCheck:"2026/7/10 08:50", image:"", deviceSerial:"DS-2CD3T46WD-I3-CAM007", channel:"2" },
  { id:8,  code:"CAM-008", name:"基坑东侧支护区",     workpoint:"基坑支护及降水工程",  status:"normal",  lastCheck:"2026/7/10 14:31", image:"https://images.unsplash.com/photo-1780427999144-4bd6cd1efbab?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM008", channel:"1" },
  { id:9,  code:"CAM-009", name:"基坑西侧支护区",     workpoint:"基坑支护及降水工程",  status:"normal",  lastCheck:"2026/7/10 14:29", image:"https://images.unsplash.com/photo-1759318965270-0549e993a3b8?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM009", channel:"1" },
  { id:10, code:"CAM-010", name:"降水泵房监控",       workpoint:"基坑支护及降水工程",  status:"normal",  lastCheck:"2026/7/10 14:27", image:"https://images.unsplash.com/photo-1517089258673-4b72e709a9c5?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM010", channel:"3" },
  { id:11, code:"CAM-011", name:"沉降监测站北侧",     workpoint:"监测工程",            status:"normal",  lastCheck:"2026/7/10 14:30", image:"https://images.unsplash.com/photo-1664662566501-73a7e41d8c19?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM011", channel:"1" },
  { id:12, code:"CAM-012", name:"监测设备间",         workpoint:"监测工程",            status:"offline", lastCheck:"2026/7/10 11:20", image:"", deviceSerial:"DS-2CD3T46WD-I3-CAM012", channel:"1" },
  { id:13, code:"CAM-013", name:"临时施工通道",       workpoint:"临设及现场辅助工程",  status:"normal",  lastCheck:"2026/7/10 14:32", image:"https://images.unsplash.com/photo-1631472965545-5c99a4ce43db?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM013", channel:"1" },
  { id:14, code:"CAM-014", name:"材料堆放区",         workpoint:"临设及现场辅助工程",  status:"normal",  lastCheck:"2026/7/10 14:28", image:"https://images.unsplash.com/photo-1776202128321-2576846d556c?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM014", channel:"2" },
  { id:15, code:"CAM-015", name:"工人生活区入口",     workpoint:"临设及现场辅助工程",  status:"normal",  lastCheck:"2026/7/10 14:30", image:"https://images.unsplash.com/photo-1692166623396-1a44298e22fe?w=400&q=80", deviceSerial:"DS-2CD3T46WD-I3-CAM015", channel:"1" },
];

function AiAlarmPage() {
  const [filterWorkpoint,   setFilterWorkpoint]   = useState("");
  const [filterCameraStatus, setFilterCameraStatus] = useState("");
  const [cameraData, setCameraData] = useState(() => cameraList.map(c => ({...c})));
  const [cameraModal, setCameraModal] = useState<{open:boolean;mode:"add"|"edit";item?:typeof cameraData[0]}>({open:false,mode:"add"});

  const onlineCount  = cameraData.filter(c=>c.status==="normal").length;
  const offlineCount = cameraData.filter(c=>c.status==="offline").length;
  const onlineRate   = Math.round(onlineCount / cameraData.length * 100);

  const filtered = cameraData.filter(c=>{
    if (filterWorkpoint   && c.workpoint   !== filterWorkpoint)   return false;
    if (filterCameraStatus === "正常"  && c.status !== "normal")  return false;
    if (filterCameraStatus === "离线"  && c.status !== "offline") return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 flex-shrink-0">
        {[
          { label:"摄像头总数", value:cameraList.length, sub:"路摄像头接入",          color:"text-blue-600",  bg:"bg-blue-100" },
          { label:"在线正常",   value:onlineCount,        sub:"设备运行正常",          color:"text-green-600", bg:"bg-green-100" },
          { label:"设备离线",   value:offlineCount,       sub:"信号中断需排查",        color:"text-gray-500",  bg:"bg-gray-100" },
        ].map((c,i)=>(
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
              <Eye size={18} className={c.color}/>
            </div>
            <div>
              <div className="text-[12px] text-gray-400 mb-0.5">{c.label}</div>
              <div className={`text-[28px] font-bold leading-none ${c.color}`}>{c.value}</div>
              <div className="text-[11px] text-gray-400 mt-1">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 flex-shrink-0 flex-wrap">
        <label className="text-[13px] text-gray-500 font-medium">工点：</label>
        <select value={filterWorkpoint} onChange={e=>setFilterWorkpoint(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none cursor-pointer">
          <option value="">全部工点</option>
          {cameraWorkpoints.map(w=><option key={w}>{w}</option>)}
        </select>
        <label className="text-[13px] text-gray-500 font-medium ml-2">摄像头状态：</label>
        <select value={filterCameraStatus} onChange={e=>setFilterCameraStatus(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none cursor-pointer">
          <option value="">全部状态</option>
          <option>正常</option>
          <option>离线</option>
        </select>
        <button onClick={()=>{setFilterWorkpoint("");setFilterCameraStatus("");}}
          className="px-3 py-1.5 rounded-lg text-[13px] border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">重置</button>
        <button onClick={()=>setCameraModal({open:true,mode:"add"})}
          className="ml-auto px-3 py-1.5 rounded-lg text-[13px] border border-[#0052cc] bg-[#0052cc] text-white hover:bg-[#0044a8] cursor-pointer">新增</button>
        <div className="flex items-center gap-2 text-[12px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
          实时更新
        </div>
      </div>

      {/* 摄像头卡片网格 */}
      <div className="grid grid-cols-4 gap-4">
        {filtered.map(cam => {
          const isOnline  = cam.status === "normal";
          const isOffline = cam.status === "offline";
          return (
            <div key={cam.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${isOffline?"border-gray-300 opacity-75":"border-gray-200"}`}>
              {/* 摄像头图示区 */}
              <div className="relative h-[140px] overflow-hidden">
                {isOnline && cam.image ? (
                  <>
                    <img src={cam.image} alt={cam.name} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"/>
                    {/* 顶部 HUD */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-black/50 rounded px-1.5 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"/>
                        <span className="text-white text-[9px] font-bold tracking-widest">REC</span>
                      </div>
                      <span className="bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">正常</span>
                    </div>
                    {/* 底部时间戳 */}
                    <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                      <span className="text-white/80 text-[9px] font-mono">{cam.code}</span>
                      <span className="text-white/80 text-[9px] font-mono">{cam.lastCheck.slice(5)}</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Eye size={22} className="text-gray-400"/>
                    </div>
                    <span className="text-gray-400 text-[11px]">信号中断</span>
                    <span className="absolute top-2 right-2 bg-gray-400 text-white text-[10px] font-semibold px-2 py-0.5 rounded">离线</span>
                  </div>
                )}
              </div>
              {/* 摄像头信息 */}
              <div className="px-3 py-3">
                <div className="text-[13px] font-semibold text-gray-800 truncate">{cam.name}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 font-mono">{cam.code}</div>
                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin size={11} className="text-gray-400 flex-shrink-0"/>
                  <span className="text-[11px] text-gray-500 truncate">{cam.workpoint}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400">{cam.lastCheck.slice(5)}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={()=>setCameraModal({open:true,mode:"edit",item:cam})} className="text-[10px] text-[#0052cc] hover:underline cursor-pointer">编辑</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={()=>{
                      if(confirm(`确定要删除摄像头 "${cam.name}" 吗？`)){
                        setCameraData(d=>d.filter(c=>c.id!==cam.id));
                      }
                    }} className="text-[10px] text-red-500 hover:underline cursor-pointer">删除</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 新增/编辑摄像头弹窗 */}
      <Modal open={cameraModal.open} onClose={()=>setCameraModal(p=>({...p,open:false}))} title={cameraModal.mode==="add"?"新增摄像头":"编辑摄像头"} width="500px" footer={null}>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-[12px] text-gray-500 mb-1">摄像头编号 <span className="text-red-500">*</span></label>
            <input type="text" defaultValue={cameraModal.item?.code || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px]" placeholder="请输入摄像头编号"/>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1">摄像头名称 <span className="text-red-500">*</span></label>
            <input type="text" defaultValue={cameraModal.item?.name || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px]" placeholder="请输入摄像头名称"/>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1">所属工点 <span className="text-red-500">*</span></label>
            <select defaultValue={cameraModal.item?.workpoint || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] appearance-none bg-white">
              <option value="">请选择所属工点</option>
              {cameraWorkpoints.map(w=><option key={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1">设备序列号 <span className="text-red-500">*</span></label>
            <input type="text" defaultValue={cameraModal.item?.deviceSerial || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px]" placeholder="请输入设备序列号"/>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1">通道号</label>
            <input type="text" defaultValue={cameraModal.item?.channel || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px]" placeholder="请输入通道号"/>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button onClick={()=>setCameraModal(p=>({...p,open:false}))} className="px-4 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">取消</button>
            <button onClick={()=>setCameraModal(p=>({...p,open:false}))} className="px-4 py-2 border border-[#0052cc] bg-[#0052cc] text-white rounded-lg text-[13px] hover:bg-[#0044a8]">保存</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


// ─── PAGE: DEVICE LIST (full 14 items) ───────────────────────────────────────
function FullDeviceListPage() {
  const [deviceModal, setDeviceModal] = useState<{open:boolean;mode:"add"|"edit"|"view";item?:typeof fullDeviceData[0]}>({open:false,mode:"add"});
  const onlineCount = fullDeviceData.filter(d => d.online === "在线").length;
  const offlineCount = fullDeviceData.filter(d => d.online === "离线").length;
  const abnormalCount = fullDeviceData.filter(d => d.dataStatus === "异常").length;
  const disabledCount = fullDeviceData.filter(d => d.enabled === "停用").length;
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-3 flex-shrink-0">
        <StatCard title="接入设备总数" value={fullDeviceData.length} footer="台设备" iconBg="bg-blue-100" icon={<Cpu size={18} className="text-blue-600"/>}/>
        <StatCard title="在线设备" value={onlineCount} footer="台在线" iconBg="bg-green-100" icon={<CheckCircle size={18} className="text-green-600"/>}/>
        <StatCard title="离线设备" value={offlineCount} footer="台离线" iconBg="bg-gray-100" icon={<XCircle size={18} className="text-gray-500"/>}/>
        <StatCard title="数据异常" value={abnormalCount} footer="台异常" iconBg="bg-red-100" icon={<AlertTriangle size={18} className="text-red-600"/>}/>
        <StatCard title="停用设备" value={disabledCount} footer="台停用" iconBg="bg-orange-100" icon={<XCircle size={18} className="text-orange-600"/>}/>
      </div>
      <FilterBar>
        <FItem label="设备名称"><Inp placeholder="请输入设备名称"/></FItem>
        <FItem label="设备类型"><Sel options={["全部类型","水位传感器","DTU采集设备","水泵采集模块","AI摄像头","普通摄像头","工业网关","环境监测设备","其他设备"]}/></FItem>
        <FItem label="所属系统"><Sel options={["全部系统","水位监测","抽水泵监测","视频监控","AI违规告警","环境监测","监测预警","其他系统"]}/></FItem>
        <FItem label="在线状态"><Sel options={["全部状态","在线","离线"]}/></FItem>
        <FItem label="数据状态"><Sel options={["全部状态","正常","异常","未更新"]}/></FItem>
        <FItem label="是否启用"><Sel options={["全部","启用","停用"]}/></FItem>
        <div className="ml-auto flex gap-2"><Btn variant="primary"><Search size={13}/>查询</Btn><Btn><RefreshCw size={13}/>重置</Btn><Btn variant="primary" onClick={()=>setDeviceModal({open:true,mode:"add"})}><Plus size={13}/>新增设备</Btn></div>
      </FilterBar>
      <TableCard title="接入设备列表" actions={<><Btn><Download size={13}/>导出</Btn></>} pagination={<Pager total={fullDeviceData.length}/>}>
        <table className="w-full text-[13px]" style={{minWidth:"900px"}}>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["设备编号","设备名称","设备类型","绑定对象","通讯方式","最后上报","接入状态","在线状态","操作"].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap sticky top-0 bg-gray-50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fullDeviceData.map((d,i)=>{
              const lastTime = d.lastReport && d.lastReport !== "--" ? d.lastReport.split(" ")[1] || d.lastReport : "--";
              const commStr = d.protocol && d.protocol !== "预留" ? `${d.communication} / ${d.protocol}` : d.communication;
              const isCamera = d.type === "AI摄像头" || d.type === "普通摄像头";
              const isWater  = d.system === "水位监测";
              let ctxBtn = "配置";
              if (d.online === "离线") ctxBtn = "诊断";
              else if (isCamera) ctxBtn = "预览";
              else if (isWater) ctxBtn = "配置";
              return (
                <tr key={d.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                  <td className="px-4 py-3 font-mono text-[12px] text-gray-500 whitespace-nowrap">{d.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{d.name}</td>
                  <td className="px-4 py-3 text-gray-600">{d.system}</td>
                  <td className="px-4 py-3 text-gray-600">{d.obj}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{commStr}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{lastTime}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"/>
                      <span className="text-green-700 text-[12px]">已接入</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${d.online==="在线"?"bg-green-500":"bg-gray-400"}`}/>
                      <span className={`text-[12px] ${d.online==="在线"?"text-green-700":"text-gray-500"}`}>{d.online}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={()=>setDeviceModal({open:true,mode:"view",item:d})} className="text-[#1F53BE] text-[13px] hover:underline cursor-pointer">详情</button>
                      <button className="text-[#1F53BE] text-[13px] hover:underline cursor-pointer">{ctxBtn}</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableCard>

      {/* 设备 Modal */}
      <Modal open={deviceModal.open} onClose={()=>setDeviceModal(p=>({...p,open:false}))} title={deviceModal.mode==="add"?"新增设备":deviceModal.mode==="edit"?"编辑设备":"设备详情"} width="640px" footer={deviceModal.mode==="view"?<Btn onClick={()=>setDeviceModal(p=>({...p,open:false}))}>关闭</Btn>:<ModalFooter onCancel={()=>setDeviceModal(p=>({...p,open:false}))} onConfirm={()=>setDeviceModal(p=>({...p,open:false}))} confirmText="保存"/>}>
        {deviceModal.mode==="view" && deviceModal.item ? (
          <>
            <FSec title="基本信息">
              <DetailRow label="设备编号" value={deviceModal.item.code}/>
              <DetailRow label="设备名称" value={deviceModal.item.name}/>
              <DetailRow label="设备类型" value={deviceModal.item.type}/>
              <DetailRow label="所属系统" value={deviceModal.item.system}/>
              <DetailRow label="关联工点" value={deviceModal.item.workpoint}/>
              <DetailRow label="关联对象" value={deviceModal.item.obj}/>
              <DetailRow label="安装位置" value={deviceModal.item.location}/>
            </FSec>
            <FSec title="通信信息">
              <DetailRow label="通信方式" value={deviceModal.item.communication}/>
              <DetailRow label="通信协议" value={deviceModal.item.protocol}/>
              <DetailRow label="制造商" value={deviceModal.item.manufacturer}/>
              <DetailRow label="型号" value={deviceModal.item.model}/>
            </FSec>
            <FSec title="运行状态">
              <DetailRow label="在线状态" value={<StatusTag status={deviceModal.item.online}/>}/>
              <DetailRow label="数据状态" value={<StatusTag status={deviceModal.item.dataStatus}/>}/>
              <DetailRow label="最后上报" value={deviceModal.item.lastReport||"--"}/>
              <DetailRow label="今日告警" value={String(deviceModal.item.todayAlarm)} highlight={deviceModal.item.todayAlarm>0}/>
              <DetailRow label="是否启用" value={<StatusTag status={deviceModal.item.enabled}/>}/>
            </FSec>
          </>
        ) : (
          <FormGrid>
            <FF label="设备名称" required><FI placeholder="请输入设备名称" defaultValue={deviceModal.item?.name}/></FF>
            <FF label="设备类型" required><FS options={["水位传感器","DTU采集设备","水泵采集模块","AI摄像头","普通摄像头","工业网关","环境监测设备","其他设备"]} defaultValue={deviceModal.item?.type}/></FF>
            <FF label="所属系统"><FS options={["水位监测","抽水泵监测","视频监控","AI违规告警","环境监测","监测预警","其他系统"]} defaultValue={deviceModal.item?.system}/></FF>
            <FF label="关联工点"><FI placeholder="请输入工点名称" defaultValue={deviceModal.item?.workpoint}/></FF>
            <FF label="关联对象"><FI placeholder="请输入关联对象" defaultValue={deviceModal.item?.obj}/></FF>
            <FF label="安装位置"><FI placeholder="请输入安装位置" defaultValue={deviceModal.item?.location}/></FF>
            <FF label="通信方式"><FS options={["4G","有线","WiFi","预留"]} defaultValue={deviceModal.item?.communication}/></FF>
            <FF label="通信协议"><FS options={["MQTT","Modbus","OPC UA","GB/T 28181","RTSP","HTTP","预留"]} defaultValue={deviceModal.item?.protocol}/></FF>
            <FF label="制造商"><FI placeholder="请输入制造商" defaultValue={deviceModal.item?.manufacturer}/></FF>
            <FF label="型号"><FI placeholder="请输入型号" defaultValue={deviceModal.item?.model}/></FF>
            <FF label="是否启用"><FS options={["启用","停用"]} defaultValue={deviceModal.item?.enabled}/></FF>
          </FormGrid>
        )}
      </Modal>
    </div>
  );
}

// ─── PAGE: DEVICE LIST (legacy stub) ─────────────────────────────────────────
function DeviceListPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-3 flex-shrink-0">
        <StatCard title="接入设备总数" value={156} footer="台设备" iconBg="bg-blue-100" icon={<Cpu size={18} className="text-blue-600"/>}/>
        <StatCard title="在线设备" value={142} footer="台在线" iconBg="bg-green-100" icon={<CheckCircle size={18} className="text-green-600"/>}/>
        <StatCard title="离线设备" value={8} footer="台离线" iconBg="bg-gray-100" icon={<XCircle size={18} className="text-gray-500"/>}/>
        <StatCard title="数据异常" value={4} footer="台异常" iconBg="bg-red-100" icon={<AlertTriangle size={18} className="text-red-600"/>}/>
        <StatCard title="停用设备" value={2} footer="台停用" iconBg="bg-orange-100" icon={<XCircle size={18} className="text-orange-600"/>}/>
      </div>
      <FilterBar>
        <FItem label="设备名称"><Inp placeholder="请输入设备名称"/></FItem>
        <FItem label="设备类型"><Sel options={["全部类型","水位传感器","DTU采集设备","水泵采集模块","AI摄像头","普通摄像头","工业网关","其他设备"]}/></FItem>
        <FItem label="所属系统"><Sel options={["全部系统","水位监测","抽水泵监测","视频监控","AI违规告警","环境监测"]}/></FItem>
        <FItem label="在线状态"><Sel options={["全部状态","在线","离线"]}/></FItem>
        <FItem label="数据状态"><Sel options={["全部状态","正常","异常","未更新"]}/></FItem>
        <div className="ml-auto flex gap-2"><Btn variant="primary"><Search size={13}/>查询</Btn><Btn><RefreshCw size={13}/>重置</Btn><Btn variant="primary"><Plus size={13}/>新增设备</Btn></div>
      </FilterBar>
      <TableCard title="设备列表" pagination={<Pager total={6}/>}>
        <DTable
          headers={[{label:"设备编号",width:"110px"},{label:"设备名称",width:"160px"},{label:"设备类型",width:"120px"},{label:"所属系统",width:"120px"},{label:"关联工点",width:"130px"},{label:"安装位置",width:"120px"},{label:"在线状态",width:"90px"},{label:"数据状态",width:"90px"},{label:"最后上报时间",width:"150px"},{label:"是否启用",width:"80px"},{label:"操作",width:"130px"}]}
          rows={deviceData.map(d => [
            <span key="c" className="font-mono text-[12px] text-slate-500">{d.code}</span>,
            d.name, d.type, d.system, d.workpoint, d.location,
            <StatusTag key="o" status={d.online}/>, <StatusTag key="ds" status={d.dataStatus}/>,
            <span key="lr" className="text-[12px] text-slate-400">{d.lastReport}</span>,
            <StatusTag key="e" status={d.enabled}/>,
            <Actions key="a" items={[{label:"查看"},{label:"编辑"},{label:"删除",danger:true}]}/>
          ])}
        />
      </TableCard>
    </div>
  );
}

// ─── PAGE: PROJECT OVERVIEW ──────────────────────────────────────────────────
function ProjectOverviewPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="项目总工期" value={580} unit="天" footer="2024-03-01 ~ 2025-10-31" iconBg="bg-blue-100" icon={<Calendar size={18} className="text-blue-600"/>}/>
        <StatCard title="已完成工期" value={385} unit="天" footer="占总工期 66.4%" iconBg="bg-green-100" icon={<CheckCircle size={18} className="text-green-600"/>}/>
        <StatCard title="整体进度" value="65.2" unit="%" footer="计划进度 72%" iconBg="bg-orange-100" icon={<BarChart3 size={18} className="text-orange-600"/>}/>
        <StatCard title="工点总数" value={10} footer="施工中 5 | 未开始 4 | 完成 1" iconBg="bg-purple-100" icon={<MapPin size={18} className="text-purple-600"/>}/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm font-semibold text-gray-700 mb-4">施工阶段状态</div>
          {stageData.map((s,i) => {
            const pct = s.status === "已完成" ? 100 : s.status === "进行中" ? 55 : 0;
            return (
              <div key={i} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] text-gray-700">{s.name}</span>
                  <div className="flex items-center gap-2"><StatusTag status={s.status}/><span className="text-xs text-slate-400">{pct}%</span></div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.status === "已完成" ? "bg-green-400" : s.status === "进行中" ? "bg-blue-500" : "bg-slate-200"}`} style={{ width: `${pct}%`}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm font-semibold text-gray-700 mb-4">监测设备汇总</div>
          <div className="space-y-3">
            {[{name:"水位监测井",total:84,online:78,color:"bg-blue-400"},{name:"AI摄像头",total:12,online:11,color:"bg-purple-400"},{name:"普通摄像头",total:8,online:7,color:"bg-slate-400"},{name:"抽水泵",total:pumpData.length,online:pumpData.filter(p=>p.communication==="在线").length,color:"bg-green-400"},{name:"沉降监测点",total:settlementData.length,online:settlementData.filter(d=>d.currDate).length,color:"bg-orange-400"}].map(item => (
              <div key={item.name}>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-slate-400">{item.online}/{item.total} 在线</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.online/item.total)*100}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="text-sm font-semibold text-gray-700 mb-4">整体进度曲线</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={progressChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
            <XAxis dataKey="month" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}} unit="%"/>
            <Tooltip formatter={(v) => `${v}%`}/><Legend/>
            <Bar dataKey="planned" fill="#e2e8f0" name="计划进度" radius={[2,2,0,0]}/>
            <Bar dataKey="actual" fill="#0052cc" name="实际进度" radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── EXTRA DATA ──────────────────────────────────────────────────────────────
const fullDeviceData = [
  { id: 1, code: "DEV-SW-001", name: "1号水位传感器", type: "水位传感器", system: "水位监测", workpoint: "翻车机房基坑", obj: "JW001降水井", location: "基坑东侧-1", online: "在线", dataStatus: "正常", lastReport: "2026/7/6 14:30:00", enabled: "启用", manufacturer: "华为", model: "HW-SW-001", communication: "4G", protocol: "MQTT", todayAlarm: 0 },
  { id: 2, code: "DEV-SW-002", name: "2号水位传感器", type: "水位传感器", system: "水位监测", workpoint: "翻车机房基坑", obj: "JW002降水井", location: "基坑西侧-2", online: "在线", dataStatus: "正常", lastReport: "2026/7/6 14:30:00", enabled: "启用", manufacturer: "华为", model: "HW-SW-001", communication: "4G", protocol: "MQTT", todayAlarm: 0 },
  { id: 3, code: "DEV-DTU-001", name: "基坑一区DTU", type: "DTU采集设备", system: "水位监测", workpoint: "翻车机房基坑", obj: "一区井组", location: "基坑北侧-DTU房", online: "在线", dataStatus: "正常", lastReport: "2026/7/6 14:28:00", enabled: "启用", manufacturer: "研华", model: "ADAM-6000", communication: "有线", protocol: "Modbus", todayAlarm: 0 },
  { id: 4, code: "DEV-PUMP-001", name: "1号水泵采集模块", type: "水泵采集模块", system: "抽水泵监测", workpoint: "翻车机房基坑", obj: "PUMP001", location: "1号水泵控制柜", online: "在线", dataStatus: "正常", lastReport: "2026/7/6 14:25:00", enabled: "启用", manufacturer: "西门子", model: "S7-1200", communication: "有线", protocol: "OPC UA", todayAlarm: 0 },
  { id: 5, code: "DEV-PUMP-002", name: "2号水泵采集模块", type: "水泵采集模块", system: "抽水泵监测", workpoint: "翻车机房基坑", obj: "PUMP002", location: "2号水泵控制柜", online: "离线", dataStatus: "未更新", lastReport: "2026/7/5 10:00:00", enabled: "启用", manufacturer: "西门子", model: "S7-1200", communication: "有线", protocol: "OPC UA", todayAlarm: 2 },
  { id: 6, code: "DEV-AI-001", name: "基坑东侧AI摄像头", type: "AI摄像头", system: "AI违规告警", workpoint: "基坑东侧", obj: "基坑东侧监控点", location: "基坑东侧立杆", online: "在线", dataStatus: "正常", lastReport: "2026/7/6 14:30:00", enabled: "启用", manufacturer: "海康威视", model: "DS-2CD864F", communication: "有线", protocol: "GB/T 28181", todayAlarm: 5 },
  { id: 7, code: "DEV-AI-002", name: "施工通道AI摄像头", type: "AI摄像头", system: "AI违规告警", workpoint: "施工主通道", obj: "主通道监控点", location: "主通道入口立杆", online: "在线", dataStatus: "异常", lastReport: "2026/7/6 14:20:00", enabled: "启用", manufacturer: "海康威视", model: "DS-2CD864F", communication: "有线", protocol: "GB/T 28181", todayAlarm: 3 },
  { id: 8, code: "DEV-CAM-001", name: "施工主通道摄像头", type: "普通摄像头", system: "视频监控", workpoint: "施工主通道", obj: "主通道监控点", location: "主通道中段立杆", online: "离线", dataStatus: "未更新", lastReport: "2026/7/4 16:00:00", enabled: "停用", manufacturer: "大华", model: "DH-IPC-HFW4238M", communication: "有线", protocol: "RTSP", todayAlarm: 0 },
  { id: 9, code: "DEV-CAM-002", name: "材料堆放区摄像头", type: "普通摄像头", system: "视频监控", workpoint: "材料堆放区", obj: "材料区监控点", location: "材料区东南角", online: "在线", dataStatus: "正常", lastReport: "2026/7/6 14:30:00", enabled: "启用", manufacturer: "大华", model: "DH-IPC-HFW4238M", communication: "有线", protocol: "RTSP", todayAlarm: 0 },
  { id: 10, code: "DEV-ENV-001", name: "办公区环境监测设备", type: "环境监测设备", system: "环境监测", workpoint: "办公生活区", obj: "办公区", location: "办公楼楼顶", online: "在线", dataStatus: "正常", lastReport: "2026/7/6 14:25:00", enabled: "启用", manufacturer: "赛默飞", model: "TSI-7500", communication: "4G", protocol: "HTTP", todayAlarm: 0 },
  { id: 11, code: "DEV-ENV-002", name: "钢筋加工区环境监测", type: "环境监测设备", system: "环境监测", workpoint: "钢筋加工区", obj: "加工区", location: "加工区北侧", online: "在线", dataStatus: "异常", lastReport: "2026/7/6 14:15:00", enabled: "启用", manufacturer: "赛默飞", model: "TSI-7500", communication: "4G", protocol: "HTTP", todayAlarm: 1 },
  { id: 12, code: "DEV-GW-001", name: "主工业网关", type: "工业网关", system: "监测预警", workpoint: "翻车机房基坑", obj: "主监控室", location: "主监控室机柜", online: "在线", dataStatus: "正常", lastReport: "2026/7/6 14:30:00", enabled: "启用", manufacturer: "华为", model: "AR500", communication: "有线", protocol: "MQTT", todayAlarm: 0 },
  { id: 13, code: "DEV-GW-002", name: "备用工业网关", type: "工业网关", system: "监测预警", workpoint: "翻车机房基坑", obj: "备用监控室", location: "备用监控室机柜", online: "离线", dataStatus: "未更新", lastReport: "2026/7/1 08:00:00", enabled: "停用", manufacturer: "华为", model: "AR500", communication: "有线", protocol: "MQTT", todayAlarm: 0 },
  { id: 14, code: "DEV-OTH-001", name: "智能音柱（预留）", type: "其他设备", system: "其他系统", workpoint: "施工主通道", obj: "广播系统", location: "主通道北侧", online: "离线", dataStatus: "未更新", lastReport: "--", enabled: "停用", manufacturer: "海康威视", model: "DS-2FP2021", communication: "预留", protocol: "预留", todayAlarm: 0 },
];

const redListData = [
  { id: 1, code: "RB-20260706-001", name: "李明", idCard: "370102****0034", unit: "中建一局", team: "钢筋班组", trade: "钢筋工", reason: "连续30天无违规", reward: "通报表扬", time: "2026/7/5 10:00:00", expire: "2026/8/5", screen: "是", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" },
  { id: 2, code: "RB-20260706-002", name: "王强", idCard: "370103****0045", unit: "中建一局", team: "混凝土班组", trade: "混凝土工", reason: "安全检查优秀", reward: "荣誉证书", time: "2026/7/4 09:30:00", expire: "2026/7/31", screen: "是", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" },
  { id: 3, code: "RB-20260706-003", name: "张伟", idCard: "370104****0056", unit: "中铁建设", team: "木工班组", trade: "木工", reason: "培训表现优秀", reward: "积分奖励", time: "2026/7/3 14:00:00", expire: "2026/7/30", screen: "否", image: "" },
  { id: 4, code: "RB-20260706-004", name: "刘洋", idCard: "370105****0067", unit: "中建一局", team: "架子班组", trade: "架子工", reason: "班组安全评分优秀", reward: "现金奖励", time: "2026/7/2 11:00:00", expire: "2026/7/29", screen: "是", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" },
  { id: 5, code: "RB-20260706-005", name: "陈刚", idCard: "370106****0078", unit: "中铁建设", team: "水电班组", trade: "电工", reason: "人工新增", reward: "通报表扬", time: "2026/7/1 16:00:00", expire: "2026/7/28", screen: "否", image: "" },
];

const blackListData = [
  { id: 1, code: "BB-20260706-001", name: "赵六", idCard: "370104****0078", unit: "中建三局", team: "钢筋班组", trade: "钢筋工", violationCount: 6, lastViolation: "未戴安全帽", reason: "累计违规6次", time: "2026/7/5 08:30:00", measure: "书面警告", inBlacklist: "是", screen: "是" },
  { id: 2, code: "BB-20260706-002", name: "孙七", idCard: "370105****0089", unit: "中建一局", team: "混凝土班组", trade: "混凝土工", violationCount: 5, lastViolation: "未穿反光衣", reason: "累计违规5次", time: "2026/7/4 09:15:00", measure: "口头警告", inBlacklist: "否", screen: "是" },
  { id: 3, code: "BB-20260706-003", name: "周八", idCard: "370108****0056", unit: "中铁建设", team: "木工班组", trade: "木工", violationCount: 7, lastViolation: "抽烟", reason: "累计违规7次", time: "2026/7/3 10:00:00", measure: "经济处罚", inBlacklist: "是", screen: "否" },
  { id: 4, code: "BB-20260706-004", name: "吴九", idCard: "370109****0078", unit: "中建三局", team: "架子班组", trade: "架子工", violationCount: 5, lastViolation: "人员闯入危险区域", reason: "累计违规5次", time: "2026/7/2 14:30:00", measure: "停工整改", inBlacklist: "否", screen: "是" },
  { id: 5, code: "BB-20260706-005", name: "郑十", idCard: "370110****0090", unit: "中建一局", team: "水电班组", trade: "焊工", violationCount: 1, lastViolation: "明火", reason: "严重违规", time: "2026/7/1 11:00:00", measure: "书面警告", inBlacklist: "是", screen: "是" },
];

const blockListData = [
  { id: 1, code: "BL-20260706-001", name: "赵六", idCard: "110101****1234", unit: "中建三局", team: "钢筋班组", reason: "累计违规6次，多次不整改", effectTime: "2026/7/5 08:30:00", cancelTime: "", status: "生效中", syncStatus: "已同步", remark: "限制进场30天" },
  { id: 2, code: "BL-20260706-002", name: "周八", idCard: "110102****5678", unit: "中铁建设", team: "木工班组", reason: "累计违规7次", effectTime: "2026/7/3 10:00:00", cancelTime: "", status: "生效中", syncStatus: "已同步", remark: "限制进场60天" },
  { id: 3, code: "BL-20260706-003", name: "郑十", idCard: "110103****9012", unit: "中建一局", team: "水电班组", reason: "明火作业违规", effectTime: "2026/7/1 11:00:00", cancelTime: "", status: "生效中", syncStatus: "待同步", remark: "限制进场90天" },
  { id: 4, code: "BL-20260706-004", name: "钱某", idCard: "110104****3456", unit: "中建三局", team: "杂工班组", reason: "多次安全检查不合格", effectTime: "2026/6/15 09:00:00", cancelTime: "2026/7/15 09:00:00", status: "已解除", syncStatus: "已解除", remark: "已解除限制" },
  { id: 5, code: "BL-20260706-005", name: "孙某", idCard: "110105****7890", unit: "中铁建设", team: "钢筋班组", reason: "严重违规", effectTime: "2026/6/20 10:00:00", cancelTime: "", status: "生效中", syncStatus: "同步失败", remark: "需要手动同步" },
];

const safetyCheckData = [
  { id: 1, code: "SC-20260706-001", type: "综合安全检查", area: "翻车机房基坑", inspector: "张安全", team: "安全质量部", time: "2026/7/6 09:00:00", score: 92, level: "良好", problems: 2, unresolved: 1, status: "已完成" },
  { id: 2, code: "SC-20260706-002", type: "专项安全检查", area: "地下皮带廊", inspector: "李巡查", team: "工程部", time: "2026/7/6 11:00:00", score: 85, level: "合格", problems: 4, unresolved: 2, status: "已完成" },
  { id: 3, code: "SC-20260706-003", type: "日常安全巡查", area: "施工主通道", inspector: "王检查", team: "安全质量部", time: "2026/7/6 14:00:00", score: 78, level: "合格", problems: 5, unresolved: 3, status: "进行中" },
  { id: 4, code: "SC-20260705-001", type: "综合安全检查", area: "翻车机房地上结构", inspector: "张安全", team: "安全质量部", time: "2026/7/5 09:30:00", score: 88, level: "良好", problems: 3, unresolved: 0, status: "已完成" },
  { id: 5, code: "SC-20260705-002", type: "专项安全检查", area: "基坑支护区域", inspector: "赵核查", team: "机电部", time: "2026/7/5 14:30:00", score: 95, level: "优秀", problems: 1, unresolved: 0, status: "已完成" },
  { id: 6, code: "SC-20260704-001", type: "日常安全巡查", area: "材料堆放区", inspector: "孙巡逻", team: "综合部", time: "2026/7/4 10:00:00", score: 72, level: "合格", problems: 6, unresolved: 4, status: "已完成" },
  { id: 7, code: "SC-20260704-002", type: "综合安全检查", area: "钢筋加工区", inspector: "李巡查", team: "工程部", time: "2026/7/4 15:00:00", score: 81, level: "合格", problems: 3, unresolved: 1, status: "已完成" },
  { id: 8, code: "SC-20260703-001", type: "专项安全检查", area: "高处作业区", inspector: "王检查", team: "安全质量部", time: "2026/7/3 09:00:00", score: 90, level: "良好", problems: 2, unresolved: 0, status: "已完成" },
];

const hazardData = [
  { id: 1, code: "YH202607060001", title: "临边防护栏杆缺失", source: "安全检查", type: "高处作业防护缺失", category: "安全防护", level: "重大隐患", area: "翻车机房3层", location: "翻车机房3层平台", workpoint: "WP03", finder: "张安全", findTime: "2026/7/6 09:30:00", desc: "3层施工平台临边防护栏杆缺失约5米", measure: "立即停工整改，补设安全护栏", responsePerson: "李工", deadline: "2026/7/7", status: "整改中", closedTime: "", score: 72 },
  { id: 2, code: "YH202607060002", title: "脚手架扣件松动超标", source: "AI告警", type: "脚手架安全隐患", category: "脚手架", level: "较大隐患", area: "主体结构施工区", location: "主体结构北侧", workpoint: "WP01", finder: "AI系统", findTime: "2026/7/6 10:15:00", desc: "脚手架扣件松动，横杆步距超标", measure: "停止作业，重新检查紧固所有扣件", responsePerson: "王工", deadline: "2026/7/8", status: "待处理", closedTime: "", score: 65 },
  { id: 3, code: "YH202607050001", title: "配电箱漏电保护缺失", source: "安全检查", type: "临时用电不规范", category: "临时用电", level: "一般隐患", area: "钢筋加工区", location: "钢筋加工区配电房", workpoint: "WP09", finder: "孙巡逻", findTime: "2026/7/5 14:00:00", desc: "配电箱未设漏电保护器，电线裸露接头", measure: "整改电线接头，安装漏电保护器", responsePerson: "周工", deadline: "2026/7/6", status: "已完结", closedTime: "2026/7/6 16:00:00", score: 88 },
  { id: 4, code: "YH202607050002", title: "消防通道被材料堵塞", source: "日常巡查", type: "消防通道占用", category: "消防安全", level: "一般隐患", area: "材料堆放区", location: "材料堆放区南侧通道", workpoint: "WP10", finder: "王检查", findTime: "2026/7/5 11:30:00", desc: "消防通道被材料堵塞，无法通行", measure: "立即清理通道，保持畅通", responsePerson: "吴工", deadline: "2026/7/5", status: "已完结", closedTime: "2026/7/5 17:00:00", score: 92 },
  { id: 5, code: "YH202607040001", title: "基坑临边护栏高度不足", source: "安全检查", type: "基坑临边防护", category: "安全防护", level: "重大隐患", area: "基坑西南角", location: "基坑西南角临边", workpoint: "WP01", finder: "张安全", findTime: "2026/7/4 09:00:00", desc: "基坑临边护栏高度不足，警示标识缺失", measure: "加高护栏至1.2m，补设警示标识", responsePerson: "陈工", deadline: "2026/7/5", status: "待验收", closedTime: "", score: 80 },
  { id: 6, code: "YH202607030001", title: "动火作业未配备灭火器", source: "AI告警", type: "明火作业风险", category: "动火作业", level: "较大隐患", area: "焊接作业区", location: "焊接作业区西侧", workpoint: "WP03", finder: "AI系统", findTime: "2026/7/3 14:30:00", desc: "动火作业未配备灭火器，周边有可燃物", measure: "立即停止动火，清理现场，配备消防器材", responsePerson: "赵工", deadline: "2026/7/4", status: "已完结", closedTime: "2026/7/4 09:00:00", score: 95 },
  { id: 7, code: "YH202607020001", title: "高处作业人员未系安全带", source: "日常巡查", type: "高处作业防护缺失", category: "高处作业", level: "重大隐患", area: "高处作业区", location: "高处作业区东侧脚手架", workpoint: "WP03", finder: "李巡查", findTime: "2026/7/2 15:00:00", desc: "高处作业人员未佩戴安全带，存在坠落风险", measure: "立即停止作业，要求佩戴安全带后方可继续", responsePerson: "孙工", deadline: "2026/7/3", status: "整改中", closedTime: "", score: 60 },
  { id: 8, code: "YH202607010001", title: "施工用电线路老化", source: "专项检查", type: "临时用电不规范", category: "临时用电", level: "较大隐患", area: "翻车机房基坑", location: "基坑施工用电配线", workpoint: "WP01", finder: "电气专检组", findTime: "2026/7/1 10:00:00", desc: "施工现场临时用电线路老化，绝缘层破损多处", measure: "更换全部老化线路，做好绝缘防护", responsePerson: "刘工", deadline: "2026/7/5", status: "待处理", closedTime: "", score: 58 },
  { id: 9, code: "YH202606280001", title: "防护网破损未修复", source: "安全检查", type: "安全防护", category: "安全防护", level: "一般隐患", area: "皮带廊施工区", location: "皮带廊中段防护网", workpoint: "WP10", finder: "赵核查", findTime: "2026/6/28 11:00:00", desc: "安全防护网多处破损，未及时修复", measure: "更换破损防护网，加强日常检查频次", responsePerson: "王工", deadline: "2026/6/30", status: "待验收", closedTime: "", score: 76 },
];

const personnelData = [
  { id: 1, code: "P001", name: "张建国", idCard: "370101199808120012", gender: "男", age: 42, unit: "中铁二十四局", team: "钢筋班组", trade: "钢筋工", certNo: "GJ-2021-001", entryTime: "2024-03-01", exitTime: "", status: "在场", attendance: 95, violations: 0, phone: "138****0001" },
  { id: 2, code: "P002", name: "李明", idCard: "370102198901230034", gender: "男", age: 35, unit: "中建一局", team: "混凝土班组", trade: "混凝土工", certNo: "GJ-2021-002", entryTime: "2024-03-05", exitTime: "", status: "在场", attendance: 98, violations: 0, phone: "139****0002" },
  { id: 3, code: "P003", name: "王芳", idCard: "370103199609150056", gender: "女", age: 28, unit: "中铁建设", team: "管理人员", trade: "安全员", certNo: "AQ-2020-003", entryTime: "2024-02-28", exitTime: "", status: "在场", attendance: 100, violations: 0, phone: "137****0003" },
  { id: 4, code: "P004", name: "赵六", idCard: "370104198606220078", gender: "男", age: 38, unit: "中建三局", team: "钢筋班组", trade: "钢筋工", certNo: "GJ-2022-004", entryTime: "2024-04-01", exitTime: "2024-06-15", status: "黑名单", attendance: 72, violations: 6, phone: "136****0004" },
  { id: 5, code: "P005", name: "陈志强", idCard: "370105197903080090", gender: "男", age: 45, unit: "中铁二十四局", team: "模板班组", trade: "木工", certNo: "GJ-2019-005", entryTime: "2024-03-01", exitTime: "", status: "在场", attendance: 90, violations: 1, phone: "135****0005" },
  { id: 6, code: "P006", name: "刘海波", idCard: "370106199107190012", gender: "男", age: 33, unit: "中建一局", team: "架子班组", trade: "架子工", certNo: "GJ-2020-006", entryTime: "2024-03-10", exitTime: "", status: "在场", attendance: 88, violations: 0, phone: "134****0006" },
  { id: 7, code: "P007", name: "孙丽", idCard: "370107199805240034", gender: "女", age: 26, unit: "中铁建设", team: "管理人员", trade: "质检员", certNo: "ZJ-2021-007", entryTime: "2024-02-28", exitTime: "", status: "在场", attendance: 97, violations: 0, phone: "133****0007" },
  { id: 8, code: "P008", name: "周八", idCard: "370108198301100056", gender: "男", age: 41, unit: "中铁建设", team: "木工班组", trade: "木工", certNo: "GJ-2018-008", entryTime: "2024-04-05", exitTime: "2024-05-20", status: "黑名单", attendance: 65, violations: 7, phone: "132****0008" },
  { id: 9, code: "P009", name: "吴建平", idCard: "370109198503170078", gender: "男", age: 39, unit: "中铁二十四局", team: "水电班组", trade: "电工", certNo: "LD-2020-009", entryTime: "2024-03-15", exitTime: "", status: "在场", attendance: 92, violations: 0, phone: "131****0009" },
  { id: 10, code: "P010", name: "郑伟", idCard: "370110199004120090", gender: "男", age: 36, unit: "中建一局", team: "混凝土班组", trade: "混凝土工", certNo: "GJ-2021-010", entryTime: "2024-03-20", exitTime: "2026-07-01", status: "离场", attendance: 85, violations: 2, phone: "130****0010" },
];

const deviceInspectionData = [
  { id: 1, code: "JX-20260706-001", device: "DEV-AI-001", deviceName: "基坑东侧AI摄像头", type: "定期巡检", inspector: "李设备", time: "2026/7/6 09:00:00", result: "正常", problems: "无", status: "已完成", nextTime: "2026/7/13" },
  { id: 2, code: "JX-20260706-002", device: "DEV-AI-002", deviceName: "施工通道AI摄像头", type: "故障排查", inspector: "王运维", time: "2026/7/6 10:30:00", result: "异常", problems: "镜头污染，画面模糊", status: "整改中", nextTime: "2026/7/8" },
  { id: 3, code: "JX-20260706-003", device: "DEV-PUMP-002", deviceName: "2号水泵采集模块", type: "故障排查", inspector: "李设备", time: "2026/7/6 14:00:00", result: "故障", problems: "通信模块损坏，无法上传数据", status: "待维修", nextTime: "--" },
  { id: 4, code: "JX-20260705-001", device: "DEV-SW-001", deviceName: "1号水位传感器", type: "定期巡检", inspector: "张维护", time: "2026/7/5 10:00:00", result: "正常", problems: "无", status: "已完成", nextTime: "2026/7/12" },
  { id: 5, code: "JX-20260705-002", device: "DEV-ENV-002", deviceName: "钢筋加工区环境监测", type: "异常处理", inspector: "王运维", time: "2026/7/5 15:00:00", result: "异常", problems: "PM2.5传感器数据偏高，需校准", status: "已完成", nextTime: "2026/7/12" },
  { id: 6, code: "JX-20260704-001", device: "DEV-GW-001", deviceName: "主工业网关", type: "定期巡检", inspector: "李设备", time: "2026/7/4 09:00:00", result: "正常", problems: "无", status: "已完成", nextTime: "2026/7/18" },
];

const deviceMaintenanceData = [
  { id: 1, code: "WB-20260701-001", device: "DEV-AI-001", deviceName: "基坑东侧AI摄像头", type: "清洁保养", maintainer: "李设备", planTime: "2026/7/1", actualTime: "2026/7/1 09:00:00", cost: 0, result: "完成", content: "清洁镜头，检查固定支架，更新固件", nextPlanTime: "2026/8/1", status: "已完成" },
  { id: 2, code: "WB-20260701-002", device: "DEV-PUMP-002", deviceName: "2号水泵采集模块", type: "故障维修", maintainer: "王运维", planTime: "2026/7/5", actualTime: "2026/7/6 14:00:00", cost: 1200, result: "进行中", content: "更换通信模块，预计需要1天", nextPlanTime: "2026/8/5", status: "进行中" },
  { id: 3, code: "WB-20260615-001", device: "DEV-SW-001", deviceName: "1号水位传感器", type: "定期保养", maintainer: "张维护", planTime: "2026/6/15", actualTime: "2026/6/15 10:00:00", cost: 0, result: "完成", content: "清洁传感器探头，检查连接线，校准零点", nextPlanTime: "2026/7/15", status: "已完成" },
  { id: 4, code: "WB-20260610-001", device: "DEV-GW-001", deviceName: "主工业网关", type: "定期保养", maintainer: "李设备", planTime: "2026/6/10", actualTime: "2026/6/10 09:00:00", cost: 0, result: "完成", content: "检查网络连接，清理日志，升级固件", nextPlanTime: "2026/7/10", status: "已完成" },
  { id: 5, code: "WB-20260601-001", device: "DEV-ENV-002", deviceName: "钢筋加工区环境监测", type: "校准检定", maintainer: "第三方", planTime: "2026/6/1", actualTime: "2026/6/1 14:00:00", cost: 800, result: "完成", content: "PM2.5传感器重新校准，签发检定证书", nextPlanTime: "2026/12/1", status: "已完成" },
];

const deviceAssetsData = [
  { id: 1, code: "ZC-2024-001", name: "1号水位传感器", type: "水位传感器", model: "HW-SW-001", sn: "HW20240301001", purchaseTime: "2024/3/1", purchasePrice: 3500, status: "在用", location: "翻车机房基坑东侧", warrantyExpire: "2027/3/1", life: 5, owner: "安全质量部" },
  { id: 2, code: "ZC-2024-002", name: "2号水位传感器", type: "水位传感器", model: "HW-SW-001", sn: "HW20240301002", purchaseTime: "2024/3/1", purchasePrice: 3500, status: "在用", location: "翻车机房基坑西侧", warrantyExpire: "2027/3/1", life: 5, owner: "安全质量部" },
  { id: 3, code: "ZC-2024-003", name: "基坑一区DTU", type: "DTU采集设备", model: "ADAM-6000", sn: "RH20240301001", purchaseTime: "2024/3/5", purchasePrice: 8000, status: "在用", location: "基坑北侧DTU房", warrantyExpire: "2026/3/5", life: 3, owner: "信息技术部" },
  { id: 4, code: "ZC-2024-004", name: "1号水泵采集模块", type: "水泵采集模块", model: "S7-1200", sn: "SM20240310001", purchaseTime: "2024/3/10", purchasePrice: 12000, status: "在用", location: "1号水泵控制柜", warrantyExpire: "2027/3/10", life: 5, owner: "机电部" },
  { id: 5, code: "ZC-2024-005", name: "基坑东侧AI摄像头", type: "AI摄像头", model: "DS-2CD864F", sn: "HK20240301001", purchaseTime: "2024/3/1", purchasePrice: 15000, status: "在用", location: "基坑东侧立杆", warrantyExpire: "2027/3/1", life: 5, owner: "安全质量部" },
  { id: 6, code: "ZC-2024-006", name: "施工通道AI摄像头", type: "AI摄像头", model: "DS-2CD864F", sn: "HK20240301002", purchaseTime: "2024/3/1", purchasePrice: 15000, status: "在用", location: "主通道入口立杆", warrantyExpire: "2027/3/1", life: 5, owner: "安全质量部" },
  { id: 7, code: "ZC-2024-007", name: "主工业网关", type: "工业网关", model: "AR500", sn: "HW20240305001", purchaseTime: "2024/3/5", purchasePrice: 25000, status: "在用", location: "主监控室机柜", warrantyExpire: "2027/3/5", life: 5, owner: "信息技术部" },
  { id: 8, code: "ZC-2023-001", name: "施工主通道摄像头", type: "普通摄像头", model: "DH-IPC-HFW4238M", sn: "DH20230601001", purchaseTime: "2023/6/1", purchasePrice: 5000, status: "停用", location: "主通道中段", warrantyExpire: "2026/6/1", life: 5, owner: "安全质量部" },
];

const userManagementData = [
  { id: 1, username: "admin", realName: "系统管理员", role: "超级管理员", dept: "信息技术部", phone: "138****0001", email: "admin@zhrail.com", lastLogin: "2026/7/6 08:30:00", status: "启用", createTime: "2024/1/1" },
  { id: 2, username: "zhang_jianguo", realName: "张建国", role: "项目负责人", dept: "工程部", phone: "138****0002", email: "zjg@zhrail.com", lastLogin: "2026/7/6 09:15:00", status: "启用", createTime: "2024/3/1" },
  { id: 3, username: "li_an", realName: "李安全", role: "安全员", dept: "安全质量部", phone: "137****0003", email: "la@zhrail.com", lastLogin: "2026/7/6 08:00:00", status: "启用", createTime: "2024/3/1" },
  { id: 4, username: "wang_fang", realName: "王芳", role: "质检员", dept: "安全质量部", phone: "136****0004", email: "wf@zhrail.com", lastLogin: "2026/7/5 17:30:00", status: "启用", createTime: "2024/3/5" },
  { id: 5, username: "chen_zq", realName: "陈志强", role: "施工员", dept: "工程部", phone: "135****0005", email: "czq@zhrail.com", lastLogin: "2026/7/4 16:00:00", status: "启用", createTime: "2024/4/1" },
  { id: 6, username: "liu_hb", realName: "刘海波", role: "施工员", dept: "工程部", phone: "134****0006", email: "lhb@zhrail.com", lastLogin: "2026/6/30 18:00:00", status: "禁用", createTime: "2024/4/5" },
  { id: 7, username: "device_mgr", realName: "李设备", role: "设备管理员", dept: "机电部", phone: "133****0007", email: "lsb@zhrail.com", lastLogin: "2026/7/6 07:30:00", status: "启用", createTime: "2024/3/15" },
  { id: 8, username: "monitor_op", realName: "王运维", role: "监测操作员", dept: "信息技术部", phone: "132****0008", email: "wyy@zhrail.com", lastLogin: "2026/7/6 08:45:00", status: "启用", createTime: "2024/3/20" },
];

const roleData = [
  { id: 1, name: "超级管理员", code: "SUPER_ADMIN", desc: "系统最高权限，可管理所有功能模块", userCount: 1, menuCount: 52, status: "启用", createTime: "2024/1/1" },
  { id: 2, name: "项目负责人", code: "PROJECT_MANAGER", desc: "项目整体管理权限，可查看所有模块数据，审批相关操作", userCount: 2, menuCount: 45, status: "启用", createTime: "2024/1/1" },
  { id: 3, name: "安全员", code: "SAFETY_OFFICER", desc: "安全管理相关模块的完整操作权限", userCount: 3, menuCount: 28, status: "启用", createTime: "2024/1/1" },
  { id: 4, name: "质检员", code: "QUALITY_INSPECTOR", desc: "质量检查与进度管理模块操作权限", userCount: 2, menuCount: 20, status: "启用", createTime: "2024/1/1" },
  { id: 5, name: "施工员", code: "CONSTRUCTION_WORKER", desc: "进度查看、工点管理基本操作权限", userCount: 8, menuCount: 12, status: "启用", createTime: "2024/1/1" },
  { id: 6, name: "设备管理员", code: "DEVICE_MANAGER", desc: "设备管理、监测数据查看完整权限", userCount: 2, menuCount: 22, status: "启用", createTime: "2024/1/1" },
  { id: 7, name: "监测操作员", code: "MONITOR_OPERATOR", desc: "监测数据查看与预警处理权限", userCount: 4, menuCount: 18, status: "启用", createTime: "2024/1/1" },
  { id: 8, name: "只读用户", code: "READ_ONLY", desc: "仅可查看数据，无操作权限", userCount: 5, menuCount: 35, status: "启用", createTime: "2024/2/1" },
];

const apiData = [
  { id: 1, name: "集团监测数据平台接口", code: "API-GROUP-MONITOR", type: "数据接收", url: "https://monitor.group.com/api/v2/data", method: "POST", auth: "Token认证", frequency: "5分钟", status: "正常", lastSync: "2026/7/6 14:28:00", successRate: "99.8%", todayCalls: 288 },
  { id: 2, name: "沉降监测数据同步接口", code: "API-SETTLEMENT", type: "数据接收", url: "https://settlement.company.com/api/sync", method: "GET", auth: "Basic认证", frequency: "10天", status: "正常", lastSync: "2026/6/13 09:30:00", successRate: "100%", todayCalls: 0 },
  { id: 3, name: "人员实名制平台接口", code: "API-PERSONNEL", type: "数据推送", url: "https://realname.moc.gov.cn/api/push", method: "POST", auth: "证书认证", frequency: "实时", status: "正常", lastSync: "2026/7/6 14:30:00", successRate: "98.5%", todayCalls: 126 },
  { id: 4, name: "黑名单同步接口", code: "API-BLACKLIST", type: "数据推送", url: "https://access.system.com/api/blacklist", method: "PUT", auth: "Token认证", frequency: "实时", status: "异常", lastSync: "2026/7/5 18:30:00", successRate: "85.2%", todayCalls: 3 },
  { id: 5, name: "大屏数据推送接口", code: "API-BIGSCREEN", type: "数据推送", url: "ws://bigscreen.local/ws/data", method: "WebSocket", auth: "Token认证", frequency: "实时", status: "正常", lastSync: "2026/7/6 14:30:00", successRate: "99.9%", todayCalls: 1728 },
  { id: 6, name: "工程进度数据接口", code: "API-PROGRESS", type: "数据接收", url: "https://pm.company.com/api/progress", method: "GET", auth: "OAuth2.0", frequency: "1小时", status: "停用", lastSync: "2026/5/1 09:00:00", successRate: "--", todayCalls: 0 },
];

const miniProgramData = [
  { id: 1, module: "进度填报", code: "MP-PROGRESS", desc: "施工人员现场进度填报，支持照片上传", enabled: true, userCount: 28, todayUse: 15, version: "v2.1.0", updateTime: "2026/6/1" },
  { id: 2, module: "安全检查", code: "MP-SAFETY", desc: "移动端安全巡检，扫码填报检查结果", enabled: true, userCount: 12, todayUse: 8, version: "v1.5.0", updateTime: "2026/5/15" },
  { id: 3, module: "隐患上报", code: "MP-HAZARD", desc: "一线工人隐患拍照上报，实时推送处理", enabled: true, userCount: 45, todayUse: 3, version: "v1.3.0", updateTime: "2026/4/20" },
  { id: 4, module: "考勤打卡", code: "MP-ATTENDANCE", desc: "工人扫码考勤，支持人脸识别辅助", enabled: true, userCount: 180, todayUse: 168, version: "v3.0.1", updateTime: "2026/6/10" },
  { id: 5, module: "预警推送", code: "MP-ALARM", desc: "监测预警消息推送，支持查看详情和处置", enabled: true, userCount: 20, todayUse: 12, version: "v1.2.0", updateTime: "2026/5/1" },
  { id: 6, module: "BIM轻量化查看", code: "MP-BIM", desc: "手机端BIM模型浏览，施工进度可视化", enabled: false, userCount: 0, todayUse: 0, version: "v0.8.0 (测试)", updateTime: "2026/3/1" },
];

// ─── NEW PAGE COMPONENTS ──────────────────────────────────────────────────────

function BimModelingPage() {
  const [stage, setStage] = useState("地下结构");
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <StatCard title="BIM构件总数" value={482} footer="个构件" iconBg="bg-blue-100" icon={<Building2 size={18} className="text-blue-600"/>}/>
        <StatCard title="已完工构件" value={186} footer="占 38.6%" iconBg="bg-green-100" icon={<CheckCircle size={18} className="text-green-600"/>}/>
        <StatCard title="施工中构件" value={124} footer="正在施工" iconBg="bg-blue-100" icon={<Zap size={18} className="text-blue-600"/>}/>
        <StatCard title="未开工构件" value={172} footer="待施工" iconBg="bg-gray-100" icon={<Clock size={18} className="text-gray-500"/>}/>
      </div>
      <div className="flex gap-4 flex-1 overflow-hidden min-h-0">
        <div className="flex-1 bg-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <span className="text-sm font-medium text-white">BIM模型展示 — 淄海铁路翻车机房</span>
            <div className="flex gap-2">
              {["地下结构","地上结构","钢结构顶棚","总体"].map(s => (
                <button key={s} onClick={() => setStage(s)} className={`px-3 py-1 text-xs rounded cursor-pointer transition-colors ${stage === s ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <svg viewBox="0 0 600 400" className="w-full max-w-2xl opacity-90">
              {/* Ground */}
              <rect x="0" y="300" width="600" height="100" fill="#2d3748"/>
              {/* Underground structure */}
              <rect x="100" y="160" width="400" height="140" fill="#1a365d" stroke="#4299e1" strokeWidth="2"/>
              <rect x="120" y="180" width="360" height="100" fill="#2a4a7f" stroke="#63b3ed" strokeWidth="1"/>
              {/* Basement level label */}
              <text x="300" y="235" textAnchor="middle" fill="#90cdf4" fontSize="14" fontFamily="monospace">地下主体结构</text>
              {/* Above ground */}
              {stage !== "地下结构" && <>
                <rect x="150" y="80" width="300" height="80" fill="#2c5282" stroke="#4299e1" strokeWidth="2"/>
                <text x="300" y="125" textAnchor="middle" fill="#90cdf4" fontSize="12" fontFamily="monospace">地上主体结构</text>
              </>}
              {/* Steel roof */}
              {(stage === "钢结构顶棚" || stage === "总体") && <>
                <path d="M120,80 L300,20 L480,80" fill="none" stroke="#f6ad55" strokeWidth="3"/>
                <line x1="200" y1="52" x2="200" y2="80" stroke="#f6ad55" strokeWidth="2"/>
                <line x1="300" y1="20" x2="300" y2="80" stroke="#f6ad55" strokeWidth="2"/>
                <line x1="400" y1="52" x2="400" y2="80" stroke="#f6ad55" strokeWidth="2"/>
                <text x="300" y="14" textAnchor="middle" fill="#f6ad55" fontSize="11" fontFamily="monospace">钢结构顶棚</text>
              </>}
              {/* Progress indicators */}
              <circle cx="130" cy="230" r="6" fill="#48bb78"/>
              <circle cx="155" cy="230" r="6" fill="#48bb78"/>
              <circle cx="180" cy="230" r="6" fill="#4299e1"/>
              <circle cx="205" cy="230" r="6" fill="#4299e1"/>
              <circle cx="230" cy="230" r="6" fill="#718096"/>
              <text x="300" y="370" textAnchor="middle" fill="#a0aec0" fontSize="11">当前阶段：{stage} — 施工进度 55%</text>
            </svg>
            <div className="absolute bottom-4 right-4 bg-slate-900/80 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex flex-col gap-1.5">
                {[["已完工","bg-green-400"],["施工中","bg-blue-400"],["未开工","bg-slate-500"]].map(([l,c]) => (
                  <div key={l} className="flex items-center gap-2 text-xs text-slate-300">
                    <div className={`w-3 h-3 rounded-sm ${c}`}/>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-64 flex-shrink-0 flex flex-col gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">构件完成情况</div>
            {[{name:"地基与基础",total:48,done:48},
              {name:"地下主体结构",total:92,done:68},
              {name:"地上主体结构",total:86,done:32},
              {name:"钢结构顶棚",total:64,done:8},
              {name:"地下皮带廊",total:56,done:14},
              {name:"辅助工程",total:136,done:16}].map(item => (
              <div key={item.name} className="mb-2.5">
                <div className="flex justify-between text-[12px] text-slate-600 mb-1">
                  <span>{item.name}</span>
                  <span className="text-slate-400">{item.done}/{item.total}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(item.done/item.total)*100}%`}}/>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1">
            <div className="text-sm font-semibold text-gray-700 mb-3">构件信息</div>
            <div className="space-y-2 text-[13px]">
              {[["构件编号","WBS-FJF-DX-001"],["构件名称","地下主体结构-底板"],["所属WBS","翻车机房/地下部分"],["关联工点","WP03"],["计划开始","2024-07-01"],["计划完成","2024-09-30"],["当前状态","施工中"],["完成比例","73%"]].map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400">{k}</span>
                  <span className="text-slate-700 font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const drillData = [
  { id:1, theme:"消防应急演练", type:"消防演练", planTime:"2026-07-07 16:31:00", location:"翻车机房基坑", dept:"安全质量部", leader:"张安全", status:"消防演练" },
  { id:2, theme:"防汛应急演练", type:"防汛演练", planTime:"2026-07-10 09:00:00", location:"地下皮带廊", dept:"工程部", leader:"李建设", status:"防汛演练" },
  { id:3, theme:"高空坠落应急处置演练", type:"高空作业演练", planTime:"2026-07-15 14:00:00", location:"高处作业区", dept:"安全质量部", leader:"王安全", status:"高空作业演练" },
];
const drillHistoryData = [
  { id:1, theme:"消防应急演练（6月）", type:"消防演练", planTime:"2026-06-12 09:00:00", location:"施工主通道", dept:"安全质量部", leader:"张安全", status:"已完成" },
  { id:2, theme:"基坑坍塌应急演练", type:"地质灾害演练", planTime:"2026-05-20 10:00:00", location:"翻车机房基坑", dept:"工程部", leader:"赵建工", status:"已完成" },
  { id:3, theme:"触电急救演练", type:"电气安全演练", planTime:"2026-04-18 14:00:00", location:"钢筋加工区", dept:"机电部", leader:"刘机电", status:"已完成" },
];

function SafetyCheckPage() {
  const [tab, setTab] = useState<"plan"|"history">("plan");
  const [filterTheme, setFilterTheme] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setViewModal] = useState<{open:boolean;item?:typeof drillData[0]}>({open:false});

  const drillTypeTag = (type: string) => {
    const map: Record<string, string> = {
      "消防演练":"bg-blue-100 text-blue-700",
      "防汛演练":"bg-cyan-100 text-cyan-700",
      "高空作业演练":"bg-purple-100 text-purple-700",
      "地质灾害演练":"bg-orange-100 text-orange-700",
      "电气安全演练":"bg-yellow-100 text-yellow-700",
      "已完成":"bg-green-100 text-green-700",
    };
    return map[type] || "bg-gray-100 text-gray-600";
  };

  const source = tab === "plan" ? drillData : drillHistoryData;
  const filtered = source.filter(d => {
    if (filterTheme && !d.theme.includes(filterTheme)) return false;
    if (filterType && d.type !== filterType) return false;
    if (filterStart && d.planTime < filterStart) return false;
    if (filterEnd && d.planTime > filterEnd + " 99") return false;
    return true;
  });

  const cols = ["序号","演练主题","演练类型","计划时间","演练地点","组织部门","组织负责人","状态","操作"];

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      {/* 搜索栏 */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-600 whitespace-nowrap">演练主题</span>
          <input value={filterTheme} onChange={e=>setFilterTheme(e.target.value)} placeholder="请输入演练主题"
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 w-44"/>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-600 whitespace-nowrap">演练类型</span>
          <select value={filterType} onChange={e=>setFilterType(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 bg-white cursor-pointer w-44">
            <option value="">请选择演练类型</option>
            <option>消防演练</option>
            <option>防汛演练</option>
            <option>高空作业演练</option>
            <option>地质灾害演练</option>
            <option>电气安全演练</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-600 whitespace-nowrap">计划时间</span>
          <div className="flex items-center gap-1.5">
            <input type="date" value={filterStart} onChange={e=>setFilterStart(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400"/>
            <span className="text-gray-400">–</span>
            <input type="date" value={filterEnd} onChange={e=>setFilterEnd(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400"/>
          </div>
        </div>
        <div className="flex gap-2 ml-auto">
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1F53BE] text-white text-[13px] rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Search size={13}/>搜索
          </button>
          <button onClick={()=>{setFilterTheme("");setFilterType("");setFilterStart("");setFilterEnd("");}}
            className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-200 text-gray-600 text-[13px] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <RotateCcw size={13}/>重置
          </button>
          <button onClick={()=>setAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1F53BE] text-white text-[13px] rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Plus size={13}/>新增演练计划
          </button>
        </div>
      </div>

      {/* 主体表格卡片 */}
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col flex-1 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-5 pt-4 gap-6">
          {(["plan","history"] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)}
              className={`pb-3 text-[13px] font-medium border-b-2 transition-colors cursor-pointer -mb-px ${tab===t?"border-[#1F53BE] text-[#1F53BE]":"border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t==="plan"?"演练预告":"历史演练记录"}
            </button>
          ))}
        </div>

        {/* 表格 */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {cols.map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d,i)=>(
                <tr key={d.id} className={`border-b border-gray-100 hover:bg-gray-50/60 transition-colors ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                  <td className="px-4 py-3 text-gray-500">{i+1}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{d.theme}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${drillTypeTag(d.type)}`}>{d.type}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-[12px] whitespace-nowrap">{d.planTime}</td>
                  <td className="px-4 py-3 text-gray-700">{d.location}</td>
                  <td className="px-4 py-3 text-gray-700">{d.dept}</td>
                  <td className="px-4 py-3 text-gray-700">{d.leader}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${drillTypeTag(d.status)}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={()=>setViewModal({open:true,item:d as any})} className="text-blue-600 hover:text-blue-800 cursor-pointer">查看</button>
                      {tab==="plan" && <>
                        <button className="text-gray-600 hover:text-gray-800 cursor-pointer">编辑</button>
                        <button className="text-red-500 hover:text-red-700 cursor-pointer">删除</button>
                        <button className="text-green-600 hover:text-green-800 cursor-pointer">标记执行</button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400 text-[13px]">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
          <Pager total={filtered.length}/>
        </div>
      </div>

      {/* 新增演练计划 Modal */}
      <Modal open={addModal} onClose={()=>setAddModal(false)} title="新增演练计划" width="640px"
        footer={<ModalFooter onCancel={()=>setAddModal(false)} onConfirm={()=>setAddModal(false)} confirmText="保存"/>}>
        <FormGrid>
          <FF label="演练主题" required full><FI placeholder="请输入演练主题"/></FF>
          <FF label="演练类型" required><FS options={["消防演练","防汛演练","高空作业演练","地质灾害演练","电气安全演练"]}/></FF>
          <FF label="组织部门" required><FI placeholder="请输入组织部门"/></FF>
          <FF label="组织负责人" required><FI placeholder="请输入负责人姓名"/></FF>
          <FF label="演练地点" required><FI placeholder="请输入演练地点"/></FF>
          <FF label="计划时间" required><FI type="datetime-local"/></FF>
          <FF label="演练说明" full><FTA placeholder="请输入演练内容说明" rows={3}/></FF>
        </FormGrid>
      </Modal>

      {/* 查看详情 Modal */}
      <Modal open={viewModal.open} onClose={()=>setViewModal({open:false})} title="演练详情" width="560px"
        footer={<Btn onClick={()=>setViewModal({open:false})}>关闭</Btn>}>
        {viewModal.item && (
          <FSec title="演练信息">
            <DetailRow label="演练主题" value={viewModal.item.theme}/>
            <DetailRow label="演练类型" value={viewModal.item.type}/>
            <DetailRow label="计划时间" value={viewModal.item.planTime}/>
            <DetailRow label="演练地点" value={viewModal.item.location}/>
            <DetailRow label="组织部门" value={viewModal.item.dept}/>
            <DetailRow label="组织负责人" value={viewModal.item.leader}/>
            <DetailRow label="状态" value={viewModal.item.status}/>
          </FSec>
        )}
      </Modal>
    </div>
  );
}

function HazardRectifyPage() {
  const [hazardModal, setHazardModal] = useState<{open:boolean;mode:"add"|"view"|"rectify";item?:typeof hazardData[0]}>({open:false,mode:"add"});
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterCode, setFilterCode] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  const total = hazardData.length;
  const pending = hazardData.filter(d => d.status === "待处理").length;
  const rectifying = hazardData.filter(d => d.status === "整改中").length;
  const accepting = hazardData.filter(d => d.status === "待验收").length;
  const closed = hazardData.filter(d => d.status === "已完结").length;

  const statusCls: Record<string,string> = {
    "待处理": "bg-orange-100 text-orange-700",
    "整改中": "bg-blue-100 text-blue-700",
    "待验收": "bg-purple-100 text-purple-700",
    "已完结": "bg-green-100 text-green-700",
  };
  const categoryCls: Record<string,string> = {
    "安全防护": "bg-blue-100 text-blue-700",
    "脚手架": "bg-cyan-100 text-cyan-700",
    "临时用电": "bg-yellow-100 text-yellow-800",
    "消防安全": "bg-red-100 text-red-700",
    "动火作业": "bg-orange-100 text-orange-700",
    "高处作业": "bg-purple-100 text-purple-700",
  };

  const filtered = hazardData.filter(d => {
    if (filterStatus && d.status !== filterStatus) return false;
    if (filterTitle && !d.title.includes(filterTitle)) return false;
    if (filterCode && !d.code.includes(filterCode)) return false;
    if (filterStart && d.findTime < filterStart) return false;
    if (filterEnd && d.findTime > filterEnd) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      {/* 统计卡片 — 匹配图片: 总隐患数 待处理 整改中 待验收 已完结 */}
      <div className="grid grid-cols-5 gap-3 flex-shrink-0">
        <StatCard title="总隐患数" value={total} footer="条" iconBg="bg-blue-50" icon={<FileText size={18} className="text-blue-500"/>}/>
        <StatCard title="待处理" value={pending} footer="待处理" iconBg="bg-orange-50" icon={<Clock size={18} className="text-orange-500"/>}/>
        <StatCard title="整改中" value={rectifying} footer="整改中" iconBg="bg-blue-50" icon={<RefreshCw size={18} className="text-blue-400"/>}/>
        <StatCard title="待验收" value={accepting} footer="待验收" iconBg="bg-purple-50" icon={<FileText size={18} className="text-purple-500"/>}/>
        <StatCard title="已完结" value={closed} footer="已完结" iconBg="bg-green-50" icon={<CheckCircle size={18} className="text-green-500"/>}/>
      </div>

      {/* 隐患工单列表 */}
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-[15px] font-semibold text-gray-800">隐患工单列表</span>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 text-blue-600 text-[13px] rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
              <AlertTriangle size={13}/>隐患配置
            </button>
            <button onClick={()=>setHazardModal({open:true,mode:"add"})}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[13px] rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <Plus size={13}/>新建隐患
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-green-500 text-green-600 text-[13px] rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
              <QrCode size={13}/>隐患上报二维码
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-[13px] rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
              <Download size={13}/>导出
            </button>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 flex-wrap">
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 focus:outline-none focus:border-blue-400 bg-white cursor-pointer">
            <option value="">全部状态</option>
            <option>待处理</option>
            <option>整改中</option>
            <option>待验收</option>
            <option>已完结</option>
          </select>
          <input value={filterTitle} onChange={e=>setFilterTitle(e.target.value)} placeholder="输入隐患标题"
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 focus:outline-none focus:border-blue-400 w-36"/>
          <input value={filterCode} onChange={e=>setFilterCode(e.target.value)} placeholder="搜索单号"
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 focus:outline-none focus:border-blue-400 w-36"/>
          <div className="flex items-center gap-1">
            <input type="date" value={filterStart} onChange={e=>setFilterStart(e.target.value)} placeholder="开始日期"
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 focus:outline-none focus:border-blue-400"/>
            <span className="text-gray-400 text-[13px]">—</span>
            <input type="date" value={filterEnd} onChange={e=>setFilterEnd(e.target.value)} placeholder="结束日期"
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 focus:outline-none focus:border-blue-400"/>
          </div>
          <button onClick={()=>{setFilterStatus("");setFilterTitle("");setFilterCode("");setFilterStart("");setFilterEnd("");}}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">重置</button>
          <button className="px-4 py-1.5 bg-blue-500 text-white text-[13px] rounded-lg hover:bg-blue-600 cursor-pointer">查询</button>
        </div>

        {/* 表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["工单编号","标题","状态","上报人","隐患内容","隐患分类","地点","上报时间","上报得分","操作"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d,i)=>(
                <tr key={d.id} className={`border-b border-gray-100 hover:bg-gray-50/60 transition-colors ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                  <td className="px-4 py-3 font-mono text-[12px] text-gray-400 whitespace-nowrap">{d.code}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium max-w-[140px] truncate" title={d.title}>{d.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusCls[d.status]||"bg-gray-100 text-gray-600"}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{d.finder}</td>
                  <td className="px-4 py-3 text-gray-500 text-[12px] max-w-[160px] truncate" title={d.desc}>{d.desc}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${categoryCls[d.category]||"bg-gray-100 text-gray-600"}`}>{d.category}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{d.location}</td>
                  <td className="px-4 py-3 text-gray-400 text-[12px] whitespace-nowrap">{d.findTime}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-[14px] ${d.score>=90?"text-green-600":d.score>=75?"text-blue-600":d.score>=60?"text-orange-600":"text-red-600"}`}>{d.score}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={()=>setHazardModal({open:true,mode:"view",item:d})} className="text-blue-600 hover:text-blue-800 cursor-pointer">查看</button>
                      <button className="text-red-500 hover:text-red-700 cursor-pointer">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
          <Pager total={filtered.length}/>
        </div>
      </div>

      {/* 隐患 Modal */}
      <Modal open={hazardModal.open} onClose={()=>setHazardModal(p=>({...p,open:false}))} title={hazardModal.mode==="add"?"新建隐患":hazardModal.mode==="rectify"?"提交整改":"隐患详情"} width="640px" footer={hazardModal.mode==="view"?<Btn onClick={()=>setHazardModal(p=>({...p,open:false}))}>关闭</Btn>:<ModalFooter onCancel={()=>setHazardModal(p=>({...p,open:false}))} onConfirm={()=>setHazardModal(p=>({...p,open:false}))} confirmText={hazardModal.mode==="rectify"?"提交整改":"保存"}/>}>
        {hazardModal.mode==="view" && hazardModal.item ? (
          <>
            <FSec title="隐患信息">
              <DetailRow label="工单编号" value={hazardModal.item.code}/>
              <DetailRow label="标题" value={hazardModal.item.title}/>
              <DetailRow label="来源" value={hazardModal.item.source}/>
              <DetailRow label="隐患分类" value={hazardModal.item.category}/>
              <DetailRow label="等级" value={<StatusTag status={hazardModal.item.level}/>}/>
              <DetailRow label="地点" value={hazardModal.item.location}/>
              <DetailRow label="上报人" value={hazardModal.item.finder}/>
              <DetailRow label="上报时间" value={hazardModal.item.findTime}/>
              <DetailRow label="上报得分" value={String(hazardModal.item.score)}/>
              <DetailRow label="隐患内容" value={hazardModal.item.desc}/>
              <DetailRow label="整改措施" value={hazardModal.item.measure}/>
            </FSec>
            <FSec title="整改信息">
              <DetailRow label="责任人" value={hazardModal.item.responsePerson}/>
              <DetailRow label="整改期限" value={hazardModal.item.deadline}/>
              <DetailRow label="整改状态" value={<span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusCls[hazardModal.item.status]||""}`}>{hazardModal.item.status}</span>}/>
              {hazardModal.item.closedTime && <DetailRow label="完结时间" value={hazardModal.item.closedTime}/>}
            </FSec>
          </>
        ) : (
          <FormGrid>
            <FF label="隐患标题" required><FI placeholder="请输入隐患标题"/></FF>
            <FF label="隐患分类" required><FS options={["安全防护","脚手架","临时用电","消防安全","动火作业","高处作业","其他"]}/></FF>
            <FF label="来源"><FS options={["安全检查","AI告警","日常巡查","专项检查"]}/></FF>
            <FF label="地点" required><FI placeholder="请输入隐患地点"/></FF>
            <FF label="上报人"><FI placeholder="请输入上报人"/></FF>
            <FF label="整改期限" required><FI type="date"/></FF>
            <FF label="责任人" required><FI placeholder="请输入责任人"/></FF>
            <FF label="隐患内容" full><FTA placeholder="请详细描述隐患情况" rows={3}/></FF>
            <FF label="整改措施" full><FTA placeholder="请输入整改措施" rows={3}/></FF>
          </FormGrid>
        )}
      </Modal>
    </div>
  );
}

function BlacklistManagementPage() {
  const [tab, setTab] = useState<"red"|"black">("red");

  // ── 人员搜索公共 hook ──────────────────────────────────────────────
  function usePersonSearch() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<typeof personnelData[0]|null>(null);
    const [showDrop, setShowDrop] = useState(false);
    const suggestions = query.length >= 1
      ? personnelData.filter(p => p.name.includes(query) || p.code.includes(query)).slice(0, 6)
      : [];
    return { query, setQuery, selected, setSelected, showDrop, setShowDrop, suggestions };
  }

  // ── 红榜 ──────────────────────────────────────────────────────────
  const [redAdd, setRedAdd] = useState(false);
  const redSearch = usePersonSearch();
  const [redForm, setRedForm] = useState({ reward:"", reason:"", rewardContent:"" });

  // ── 黑榜 ──────────────────────────────────────────────────────────
  const [viewViolModal, setViewViolModal] = useState<{open:boolean;name?:string;records?:typeof violationData}>({open:false});
  const [joinBlackModal, setJoinBlackModal] = useState<{open:boolean;name?:string;unit?:string;team?:string;trade?:string}>({open:false});
  const [joinedSet, setJoinedSet] = useState<Set<string>>(new Set());
  const [addBlackModal, setAddBlackModal] = useState(false);
  const [addBlackForm, setAddBlackForm] = useState({name:"", reason:""});

  // Derive 黑榜 data from violationData (group by person)
  const derivedBlackData = useMemo(()=>{
    const map = new Map<string,typeof violationData>();
    violationData.forEach(v=>{ if(!map.has(v.person)) map.set(v.person,[]); map.get(v.person)!.push(v); });
    return Array.from(map.entries()).map(([name, records])=>{
      const sorted = [...records].sort((a,b)=>b.time.localeCompare(a.time));
      const totalCount = Math.max(...records.map(r=>r.totalCount));
      const bl = blackListData.find(b=>b.name===name);
      const p = personnelData.find(p=>p.name===name);
      return { name, idCard:p?.idCard?.replace(/(\d{6})\d{8}(\d{4})/,"$1****$2")??"", unit:bl?.unit??"中铁二十四局", team:bl?.team??"钢筋一班", trade:bl?.trade??"钢筋工", totalCount, lastBehavior:sorted[0].behavior, lastTime:sorted[0].time, records:sorted };
    });
  },[]);

  const filteredBlackData = derivedBlackData;

  const [detailModal, setDetailModal] = useState<{open:boolean;data?:any;type?:string}>({open:false});

  function PersonSearchField({ hook }: { hook: ReturnType<typeof usePersonSearch> }) {
    return (
      <div className="relative">
        <input value={hook.query} onChange={e=>{ hook.setQuery(e.target.value); hook.setSelected(null); hook.setShowDrop(true); }}
          onFocus={()=>hook.setShowDrop(true)}
          placeholder="输入姓名进行搜索…"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
        {hook.showDrop && hook.suggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 overflow-hidden">
            {hook.suggestions.map(p=>(
              <div key={p.id} onClick={()=>{ hook.setSelected(p); hook.setQuery(p.name); hook.setShowDrop(false); }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 cursor-pointer text-[13px] border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{background:"#1F53BE"}}>
                  {p.name[0]}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{p.name}</div>
                  <div className="text-[11px] text-gray-400">{p.team} · {p.trade} · {p.unit}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const redBoardColors = ["bg-green-500","bg-green-400","bg-green-300","bg-teal-500","bg-teal-400"];
  const blackBoardColors = ["bg-red-500","bg-red-400","bg-orange-500","bg-orange-400","bg-yellow-500"];
  const blackBadge: Record<number,{label:string;cls:string}> = {
    0:{label:"加入黑名单",cls:"text-blue-600 font-semibold"},
    1:{label:"重点关注",cls:"bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[11px] font-semibold"},
    2:{label:"预警",cls:"bg-red-100 text-red-600 px-2 py-0.5 rounded text-[11px] font-semibold"},
  };

  const [redModal, setRedModal] = useState<{open:boolean;item?:typeof redListData[0]}>({open:false});
  const [blackModal, setBlackModal] = useState<{open:boolean;item?:typeof blackListData[0];name?:string}>({open:false});
  const [removeBlackModal, setRemoveBlackModal] = useState<{open:boolean;name?:string}>({open:false});
  const [removeReason, setRemoveReason] = useState("");
  const [controlMap, setControlMap] = useState<Map<string, boolean>>(new Map());
  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      {/* Tab 切换 + 内容 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-shrink-0">
        {/* Tab 栏 — 与系统一致的 border-b-2 样式 */}
        <div className="border-b border-gray-200 flex px-2">
          {([["red","安全红榜"],["black","安全黑榜"]] as const).map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer -mb-px ${tab===id?"border-[#1F53BE] text-[#1F53BE]":"border-transparent text-slate-500 hover:text-[#1F53BE]"}`}>
              {label}
            </button>
          ))}
          {/* 新增按钮推到右侧 */}
          <div className="ml-auto flex items-center pr-2 gap-2">
            {tab==="red" && (
              <>
                <button onClick={()=>{ redSearch.setQuery(""); redSearch.setSelected(null); setRedAdd(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white cursor-pointer hover:opacity-90" style={{background:"#1F53BE"}}>
                  <Plus size={13}/>新增红榜
                </button>
                <button onClick={()=>{}}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
                  <Download size={13}/>导出
                </button>
              </>
            )}
            {tab==="black" && (
              <>
                <button onClick={()=>{setAddBlackForm({name:"",reason:""});setAddBlackModal(true);}}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white cursor-pointer hover:opacity-90" style={{background:"#1F53BE"}}>
                  <Plus size={13}/>人工加入黑榜
                </button>
                <button onClick={()=>{}}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
                  <Download size={13}/>导出
                </button>
              </>
            )}
          </div>
        </div>

        {/* ─── 搜索条件 ─── */}
        <div className="px-4 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="text-sm font-semibold text-gray-700 mb-3">搜索条件</div>
          <div className="flex items-center gap-4 flex-wrap">
            <input placeholder="请输入姓名" className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none focus:border-blue-400 w-[180px]"/>
            <input placeholder="请输入身份证号" className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none focus:border-blue-400 w-[180px]"/>
            {tab === "red" && (
              <>
                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none cursor-pointer">
                  <option>全部班组</option>
                  {Array.from(new Set(redListData.map(r=>r.team))).map(t=><option key={t}>{t}</option>)}
                </select>
                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none cursor-pointer">
                  <option>全部工种</option>
                  {Array.from(new Set(redListData.map(r=>r.trade))).map(t=><option key={t}>{t}</option>)}
                </select>
                <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none"/>
                <span className="text-gray-400 text-[12px]">至</span>
                <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none"/>
              </>
            )}
            {tab === "black" && (
              <>
                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none cursor-pointer">
                  <option>全部班组</option>
                  {Array.from(new Set(filteredBlackData.map(b=>b.team))).map(t=><option key={t}>{t}</option>)}
                </select>
                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none cursor-pointer">
                  <option>全部工种</option>
                  {Array.from(new Set(filteredBlackData.map(b=>b.trade))).map(t=><option key={t}>{t}</option>)}
                </select>
                <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none"/>
                <span className="text-gray-400 text-[12px]">至</span>
                <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-white focus:outline-none"/>
              </>
            )}
            <button className="px-3 py-1.5 rounded-lg text-[13px] border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer ml-auto">重置</button>
            <button className="px-3 py-1.5 rounded-lg text-[13px] font-medium text-white cursor-pointer hover:opacity-90" style={{background:"#1F53BE"}}>查询</button>
          </div>
        </div>

        {/* ─── 红榜表格 ─── */}
        {tab === "red" && (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["序号","图片","姓名","身份证号","班组","工种","上榜原因","奖励类型","上榜时间","操作"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {redListData.map((r,i)=>(
                <tr key={r.id} className={`border-b border-gray-100 hover:bg-green-50/30 transition-colors ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                  <td className="px-4 py-3 text-gray-400 text-[12px]">{i+1}</td>
                  <td className="px-4 py-3">
                    {r.image ? (
                      <img src={r.image} alt={r.name} className="w-10 h-10 rounded-lg object-cover"/>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImageIcon size={16} className="text-gray-400"/>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-700">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-[12px]">{r.idCard}</td>
                  <td className="px-4 py-3 text-gray-600">{r.team}</td>
                  <td className="px-4 py-3 text-gray-600">{r.trade}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[180px]">{r.reason}</td>
                  <td className="px-4 py-3"><span className="text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-[12px] font-medium">{r.reward}</span></td>
                  <td className="px-4 py-3 text-gray-400 text-[12px] whitespace-nowrap">{r.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={()=>setDetailModal({open:true,data:r,type:"red"})} className="text-[13px] hover:underline cursor-pointer" style={{color:"#1F53BE"}}>查看</button>
                      <button onClick={()=>{
                        if(confirm(`确定要编辑红榜记录 "${r.name}" 吗？`)){
                          setRedModal({open:true,item:r});
                        }
                      }} className="text-[13px] hover:underline cursor-pointer" style={{color:"#1F53BE"}}>编辑</button>
                      <button onClick={()=>{
                        if(confirm(`确定要删除红榜记录 "${r.name}" 吗？`)){
                          const idx = redListData.findIndex(item => item.id === r.id);
                          if(idx > -1) redListData.splice(idx, 1);
                        }
                      }} className="text-[13px] hover:underline cursor-pointer text-red-500">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ─── 黑榜表格 ─── */}
        {tab === "black" && (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["序号","姓名","身份证号","班组","工种","违规次数","最近违规行为","最近违规时间","入榜来源","入榜时间","管控措施","操作"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBlackData.length===0 ? (
                <tr><td colSpan={12} className="px-4 py-10 text-center text-gray-400">暂无数据</td></tr>
              ) : filteredBlackData.map((b,i)=>(
                <tr key={b.name} className={`border-b border-gray-100 hover:bg-red-50/20 transition-colors ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                  <td className="px-4 py-3 text-gray-400 text-[12px]">{i+1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{b.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-[12px]">{b.idCard}</td>
                  <td className="px-4 py-3 text-gray-600">{b.team}</td>
                  <td className="px-4 py-3 text-gray-600">{b.trade}</td>
                  <td className="px-4 py-3 font-bold text-red-600">{b.totalCount}次</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-100">{b.lastBehavior}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-[12px] whitespace-nowrap">{b.lastTime}</td>
                  <td className="px-4 py-3"><span className="text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-[12px] font-medium">自动入榜</span></td>
                  <td className="px-4 py-3 text-gray-400 text-[12px] whitespace-nowrap">{b.lastTime}</td>
                  <td className="px-4 py-3">
                    {controlMap.get(b.name) ? (
                      <span className="text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[12px] font-medium">限制入场</span>
                    ) : (
                      <span className="text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-[12px]">无限制</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={()=>setViewViolModal({open:true,name:b.name,records:b.records})}
                        className="text-[13px] hover:underline cursor-pointer" style={{color:"#1F53BE"}}>查看违规记录</button>
                      <button onClick={()=>setBlackModal({open:true,name:b.name})}
                        className={`text-[13px] hover:underline cursor-pointer ${controlMap.get(b.name)?"text-orange-500":"text-[#1F53BE]"}`}>
                        {controlMap.get(b.name)?"取消管控":"设置管控"}
                      </button>
                      <button onClick={()=>setRemoveBlackModal({open:true,name:b.name})}
                        className="text-[13px] hover:underline cursor-pointer text-red-500">移出黑榜</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── 新增红榜 Modal ──────────────────────────────────────────── */}
      <Modal open={redAdd} onClose={()=>setRedAdd(false)} title="新增红榜记录" width="560px"
        footer={<ModalFooter onCancel={()=>setRedAdd(false)} onConfirm={()=>setRedAdd(false)} confirmText="提交"/>}>
        <FormGrid cols={1}>
          <FF label="人员姓名" required>
            <PersonSearchField hook={redSearch}/>
          </FF>
          {redSearch.selected && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 grid grid-cols-2 gap-3 text-[13px]">
              <div><span className="text-gray-400">班组：</span><span className="font-medium text-gray-700">{redSearch.selected.team}</span></div>
              <div><span className="text-gray-400">工种：</span><span className="font-medium text-gray-700">{redSearch.selected.trade}</span></div>
            </div>
          )}
          <FF label="奖励内容" required><FI placeholder="如：现金奖励500元"/></FF>
          <FF label="奖励原因" required><FTA placeholder="请描述上榜原因，如：连续30天无违规、主动上报隐患3次等" rows={3}/></FF>
          <FF label="发放奖励"><FS options={["通报表扬","荣誉证书","积分奖励","现金奖励","其他"]}/></FF>
          <FF label="上传图片">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <ImageIcon size={24} className="mx-auto text-gray-400 mb-2"/>
              <div className="text-[13px] text-gray-500">点击上传图片</div>
              <div className="text-[11px] text-gray-400 mt-1">支持 JPG、PNG 格式，最大 2MB</div>
              <input type="file" accept="image/*" className="hidden"/>
            </div>
          </FF>
        </FormGrid>
      </Modal>

      {/* ─── 新增黑榜 Modal ──────────────────────────────────────────── */}
      <Modal open={addBlackModal} onClose={()=>setAddBlackModal(false)} title="新增黑榜" width="460px"
        footer={
          <div className="flex gap-2 justify-end">
            <button onClick={()=>setAddBlackModal(false)} className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">取消</button>
            <button onClick={()=>{
              if(addBlackForm.name.trim()){
                const newEntry: typeof safetyBlacklistData[0] = {
                  id: safetyBlacklistData.length + extraBlacklistItems.length + 1,
                  code: `BL${String(safetyBlacklistData.length+extraBlacklistItems.length+1).padStart(3,"0")}`,
                  name: addBlackForm.name.trim(), idCard:"待完善", gender:"男", age:0,
                  unit:"待完善", team:"待完善", trade:"待完善",
                  violations:0, lastViolation: new Date().toISOString().slice(0,10),
                  lastViolationType:"违规行为", blacklistTime: new Date().toISOString().slice(0,10),
                  blacklistReason: addBlackForm.reason.trim()||"手动加入黑榜",
                  operator:"当前用户", status:"黑名单", phone:"待完善", entryTime:"待完善",
                };
                extraBlacklistItems.push(newEntry);
                setJoinedSet(prev=>new Set([...prev, addBlackForm.name.trim()]));
              }
              setAddBlackModal(false);
            }} className="px-4 py-1.5 rounded-lg text-[13px] text-white cursor-pointer hover:opacity-90" style={{background:"#1F53BE"}}>确定</button>
          </div>
        }>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">人员姓名 <span className="text-red-500">*</span></label>
            <input value={addBlackForm.name} onChange={e=>setAddBlackForm(p=>({...p,name:e.target.value}))}
              placeholder="请输入人员姓名"
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400 w-full"/>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">上榜原因</label>
            <textarea value={addBlackForm.reason} onChange={e=>setAddBlackForm(p=>({...p,reason:e.target.value}))}
              placeholder="请填写上榜原因，如：累计违规次数超限、严重违规行为等"
              rows={3}
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400 w-full resize-none"/>
          </div>
        </div>
      </Modal>

      {/* ─── 查看违规记录 Modal ──────────────────────────────────────── */}
      <Modal open={viewViolModal.open} onClose={()=>setViewViolModal({open:false})} title="查看违规记录" width="720px"
        footer={<button onClick={()=>setViewViolModal({open:false})} className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">关闭</button>}>
        {viewViolModal.records && (
          <div className="flex flex-col gap-4">
            {/* 姓名 */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-500">姓名：</span>
              <span className="text-[14px] font-semibold text-gray-800">{viewViolModal.name}</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[12px] border border-red-100">共 {viewViolModal.records.length} 条违规记录</span>
            </div>
            {/* 表格 */}
            <div className="overflow-auto max-h-[460px] rounded-lg border border-gray-100">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <th className="py-2.5 px-3 text-left whitespace-nowrap w-[110px]">违规照片</th>
                    <th className="py-2.5 px-3 text-left whitespace-nowrap">违规行为</th>
                    <th className="py-2.5 px-3 text-left whitespace-nowrap w-[90px]">违规类型</th>
                    <th className="py-2.5 px-3 text-left whitespace-nowrap w-[130px]">违规时间</th>
                  </tr>
                </thead>
                <tbody>
                  {viewViolModal.records.map((r,i)=>(
                    <tr key={r.id} className={`border-b border-gray-50 ${i%2===0?"bg-white":"bg-gray-50/40"} hover:bg-blue-50/30`}>
                      <td className="py-2 px-3">
                        <div className="relative w-[88px] h-[56px] rounded overflow-hidden bg-gray-900 flex-shrink-0">
                          <img src={r.screenshot} alt={r.behavior} className="w-full h-full object-cover"/>
                          <div className="absolute top-0.5 left-0.5 flex items-center gap-0.5 bg-black/50 rounded px-1 py-0.5">
                            <span className="text-[8px] text-red-400 animate-pulse">●</span>
                            <span className="text-[8px] text-white/80 font-mono">REC</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100 text-[12px]">{r.behavior}</span>
                      </td>
                      <td className="py-2 px-3 text-gray-600 whitespace-nowrap">{(r as any).category ?? "—"}</td>
                      <td className="py-2 px-3 text-gray-500 whitespace-nowrap">{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── 加入黑名单确认 Modal ────────────────────────────────────── */}
      <Modal open={joinBlackModal.open} onClose={()=>setJoinBlackModal({open:false})} title="加入黑名单确认" width="420px"
        footer={
          <div className="flex gap-2 justify-end">
            <button onClick={()=>setJoinBlackModal({open:false})} className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">取消</button>
            <button onClick={()=>{
              if(joinBlackModal.name){
                const newEntry: typeof safetyBlacklistData[0] = {
                  id: safetyBlacklistData.length + extraBlacklistItems.length + 1,
                  code: `BL${String(safetyBlacklistData.length+extraBlacklistItems.length+1).padStart(3,"0")}`,
                  name: joinBlackModal.name, idCard:"待完善", gender:"男", age:0,
                  unit: joinBlackModal.unit??"待完善", team: joinBlackModal.team??"待完善", trade: joinBlackModal.trade??"待完善",
                  violations: 0, lastViolation: new Date().toISOString().slice(0,10),
                  lastViolationType:"违规行为", blacklistTime: new Date().toISOString().slice(0,10),
                  blacklistReason:"通过安全黑榜加入黑名单", operator:"当前用户", status:"黑名单",
                  phone:"待完善", entryTime:"待完善",
                };
                extraBlacklistItems.push(newEntry);
                setJoinedSet(prev=>new Set([...prev, joinBlackModal.name!]));
              }
              setJoinBlackModal({open:false});
            }} className="px-4 py-1.5 rounded-lg text-[13px] text-white cursor-pointer hover:opacity-90 bg-red-600">确定</button>
          </div>
        }>
        {joinBlackModal.name && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">{joinBlackModal.name[0]}</div>
              <div>
                <div className="font-semibold text-gray-800 text-[15px]">{joinBlackModal.name}</div>
                <div className="text-[12px] text-gray-500 mt-0.5">{joinBlackModal.unit} · {joinBlackModal.team} · {joinBlackModal.trade}</div>
              </div>
            </div>
            <p className="text-[14px] text-gray-700 leading-relaxed">
              确定将 <span className="font-semibold text-red-600">{joinBlackModal.name}</span> 加入黑名单？加入后该人员将被限制进场，相关数据可在
              <span className="font-medium text-blue-600"> 人员管理 &gt; 黑名单 </span> 中查看。
            </p>
          </div>
        )}
      </Modal>

      {/* ─── 详情 Modal ──────────────────────────────────────────────── */}
      <Modal open={detailModal.open} onClose={()=>setDetailModal({open:false})} title={detailModal.type==="red"?"红榜详情":"黑榜详情"} width="480px"
        footer={<button onClick={()=>setDetailModal({open:false})} className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">关闭</button>}>
        {detailModal.data && detailModal.type==="red" && (
          <FSec title="红榜信息">
            <DetailRow label="人员姓名" value={<span className="font-bold text-green-700">{detailModal.data.name}</span>}/>
            <DetailRow label="所属单位" value={detailModal.data.unit}/>
            <DetailRow label="班组 / 工种" value={`${detailModal.data.team} / ${detailModal.data.trade}`}/>
            <DetailRow label="奖励类型" value={<span className="text-green-600 font-medium">{detailModal.data.reward}</span>}/>
            <DetailRow label="上榜原因" value={detailModal.data.reason}/>
            <DetailRow label="上榜时间" value={detailModal.data.time}/>
            <DetailRow label="有效期至" value={detailModal.data.expire}/>
          </FSec>
        )}
        {detailModal.data && detailModal.type==="black" && (
          <FSec title="黑榜信息">
            <DetailRow label="人员姓名" value={<span className="font-bold text-red-700">{detailModal.data.name}</span>}/>
            <DetailRow label="所属单位" value={detailModal.data.unit}/>
            <DetailRow label="班组 / 工种" value={`${detailModal.data.team} / ${detailModal.data.trade}`}/>
            <DetailRow label="最近违规" value={detailModal.data.lastViolation}/>
            <DetailRow label="处理措施" value={<span className="text-orange-600 font-medium">{detailModal.data.measure}</span>}/>
            <DetailRow label="加入黑名单" value={detailModal.data.inBlacklist==="是"?<span className="text-red-600 font-semibold">是</span>:"否"}/>
            <DetailRow label="上榜时间" value={detailModal.data.time}/>
          </FSec>
        )}
      </Modal>

      {/* ─── 兼容旧弹窗（保留不删除，避免引用报错） ─────────────────── */}
      <Modal open={redModal.open} onClose={()=>setRedModal({open:false})} title="编辑红榜" footer={<ModalFooter onCancel={()=>setRedModal({open:false})} onConfirm={()=>setRedModal({open:false})} confirmText="保存"/>}>
        {redModal.item && (
          <FormGrid cols={1}>
            <FF label="人员姓名">
              <div className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50">{redModal.item.name}</div>
            </FF>
            <FF label="所属单位">
              <div className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50">{redModal.item.unit}</div>
            </FF>
            <FF label="班组">
              <div className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50">{redModal.item.team}</div>
            </FF>
            <FF label="工种">
              <div className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50">{redModal.item.trade}</div>
            </FF>
            <FF label="奖励内容"><FI defaultValue={redModal.item.reward} placeholder="如：现金奖励500元"/></FF>
            <FF label="奖励原因"><FTA defaultValue={redModal.item.reason} placeholder="请描述上榜原因" rows={3}/></FF>
            <FF label="发放奖励"><FS defaultValue={redModal.item.reward} options={["通报表扬","荣誉证书","积分奖励","现金奖励","其他"]}/></FF>
            <FF label="图片">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                {redModal.item.image ? (
                  <img src={redModal.item.image} alt="预览" className="max-h-32 mx-auto rounded-lg"/>
                ) : (
                  <>
                    <ImageIcon size={24} className="mx-auto text-gray-400 mb-2"/>
                    <div className="text-[13px] text-gray-500">点击上传图片</div>
                    <div className="text-[11px] text-gray-400 mt-1">支持 JPG、PNG 格式，最大 2MB</div>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden"/>
              </div>
            </FF>
          </FormGrid>
        )}
      </Modal>
      <Modal open={blackModal.open} onClose={()=>setBlackModal({open:false})} title={controlMap.get(blackModal.name!)?"取消管控":"设置管控"} width="420px"
        footer={
          <div className="flex gap-2 justify-end">
            <button onClick={()=>setBlackModal({open:false})} className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">取消</button>
            <button onClick={()=>{
              setControlMap(prev=>{
                const newMap = new Map(prev);
                const current = newMap.get(blackModal.name!);
                newMap.set(blackModal.name!, !current);
                return newMap;
              });
              setBlackModal({open:false});
            }} className="px-4 py-1.5 rounded-lg text-[13px] text-white cursor-pointer hover:opacity-90" style={{background:"#1F53BE"}}>
              {controlMap.get(blackModal.name!)?"确认取消":"确认限制"}
            </button>
          </div>
        }>
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-[13px] text-gray-700">人员姓名：<span className="font-semibold">{blackModal.name}</span></p>
          </div>
          {!controlMap.get(blackModal.name!) ? (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-[13px] text-red-700">确认限制该人员入场？</p>
              <p className="text-[12px] text-red-500 mt-1">限制后该人员将无法进入施工现场</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <p className="text-[13px] text-green-700">确认取消该人员的入场限制？</p>
              <p className="text-[12px] text-green-500 mt-1">取消后该人员可正常进入施工现场</p>
            </div>
          )}
        </div>
      </Modal>

      {/* ─── 移出黑榜 Modal ──────────────────────────────────────────── */}
      <Modal open={removeBlackModal.open} onClose={()=>{setRemoveBlackModal({open:false});setRemoveReason("");}} title="移出黑榜" width="460px"
        footer={
          <div className="flex gap-2 justify-end">
            <button onClick={()=>{setRemoveBlackModal({open:false});setRemoveReason("");}} className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">取消</button>
            <button onClick={()=>{
              if(!removeReason.trim()){
                alert("请填写移出原因");
                return;
              }
              if(confirm(`确定将 ${removeBlackModal.name} 移出黑榜吗？移出后将保留历史入榜记录。`)){
                setJoinedSet(prev=>{
                  const newSet = new Set(prev);
                  newSet.delete(removeBlackModal.name!);
                  return newSet;
                });
                alert(`${removeBlackModal.name} 已移出黑榜，历史入榜记录已保留。`);
                setRemoveBlackModal({open:false});
                setRemoveReason("");
              }
            }} className="px-4 py-1.5 rounded-lg text-[13px] text-white cursor-pointer hover:opacity-90" style={{background:"#1F53BE"}}>确认移出</button>
          </div>
        }>
        <div className="flex flex-col gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <p className="text-[13px] text-orange-700">移出后将保留该人员的历史入榜记录，请谨慎操作。</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">移出原因 <span className="text-red-500">*</span></label>
            <textarea value={removeReason} onChange={e=>setRemoveReason(e.target.value)}
              placeholder="请填写移出黑榜的原因，如：整改完成、表现良好等"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] resize-none focus:outline-none focus:border-blue-400" rows={4}/>
          </div>
        </div>
      </Modal>

      {/* ─── 旧 block/rule tab body (隐藏保留数据结构) */}
      <div className="hidden">
      </div>
    </div>
  );
}

const workTicketData = [
  { id: "1", type: "吊装作业", status: "未开票", code: "DZZY2026070600040", level: "三级", unit: "台池铁路项目部", location: "跨庐铜铁路特大桥261-266", applicant: "桩基五工班张飞彦", startTime: "2026-07-06", endTime: "2026-07-07", currentNode: "风险识别复核", guardian: "桩基五工班肖勇" },
  { id: "2", type: "动火作业", status: "作业后", code: "DHZY2026062400001", level: "三级", unit: "广南联络线项目部", location: "框架小桥1#翼墙", applicant: "李国太", startTime: "2026-06-24", endTime: "2026-06-25", currentNode: "审批人", guardian: "马英军" },
  { id: "3", type: "动火作业", status: "已关闭", code: "DHZY2026062300002", level: "三级", unit: "广南联络线项目部", location: "框架小桥1#翼墙", applicant: "李国太", startTime: "2026-06-23", endTime: "2026-06-24", currentNode: "审批人", guardian: "马英军" },
  { id: "4", type: "动火作业", status: "已关闭", code: "DHZY2026062200017", level: "三级", unit: "广南联络线项目部", location: "框架小桥1#翼墙", applicant: "李国太", startTime: "2026-06-22", endTime: "2026-06-23", currentNode: "审批人", guardian: "马英军" },
  { id: "5", type: "动火作业", status: "已关闭", code: "DHZY2026062100004", level: "三级", unit: "广南联络线项目部", location: "框架小桥1#翼墙", applicant: "李国太", startTime: "2026-06-21", endTime: "2026-06-22", currentNode: "审批人", guardian: "马英军" },
  { id: "6", type: "动火作业", status: "已关闭", code: "DHZY2026061800046", level: "三级", unit: "广南联络线项目部", location: "框架小桥翼墙1#", applicant: "李国太", startTime: "2026-06-18", endTime: "2026-06-19", currentNode: "审批人", guardian: "马英军" },
  { id: "7", type: "吊装作业", status: "已关闭", code: "DZZY2026061700053", level: "", unit: "广南联络线项目部", location: "跨庐铜铁路特大桥48号墩", applicant: "桩基四工班王形宾", startTime: "2026-06-17", endTime: "2026-06-18", currentNode: "签发人", guardian: "桩基四工班王形宾" },
  { id: "8", type: "动火作业", status: "已关闭", code: "DHZY2026061700002", level: "三级", unit: "广南联络线项目部", location: "框架小桥1#翼墙基础", applicant: "李国太", startTime: "2026-06-17", endTime: "2026-06-18", currentNode: "审批人", guardian: "马英军" },
  { id: "9", type: "动火作业", status: "已关闭", code: "DHZY2026061300005", level: "三级", unit: "广南联络线项目部", location: "左线7#~11#基础", applicant: "李国太", startTime: "2026-06-13", endTime: "2026-06-14", currentNode: "审批人", guardian: "陈钊" },
  { id: "10", type: "动火作业", status: "已关闭", code: "DHZY2026061200028", level: "三级", unit: "广南联络线项目部", location: "左6#~11#", applicant: "李国太", startTime: "2026-06-12", endTime: "2026-06-13", currentNode: "审批人", guardian: "陈钊" },
];

const workTypes = ["请选择作业类型", "吊装作业", "动火作业", "高处作业", "有限空间作业", "临时用电作业"];
const statusTabs = ["全部", "暂存", "未开票", "已开票", "待监管", "作业中", "作业后", "已关闭", "已作废"];

const statusColors: Record<string, string> = {
  "暂存": "bg-gray-100 text-gray-600",
  "未开票": "bg-orange-100 text-orange-600",
  "已开票": "bg-blue-100 text-blue-600",
  "待监管": "bg-yellow-100 text-yellow-600",
  "作业中": "bg-green-100 text-green-600",
  "作业后": "bg-teal-100 text-teal-600",
  "已关闭": "bg-gray-100 text-gray-500",
  "已作废": "bg-red-100 text-red-600",
};

function WorkTicketPage() {
  const [searchType, setSearchType] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [searchApplicant, setSearchApplicant] = useState("");
  const [activeStatus, setActiveStatus] = useState("全部");
  const [showExpand, setShowExpand] = useState(false);

  const filteredData = workTicketData.filter(item => {
    if (searchType && item.type !== searchType) return false;
    if (searchCode && !item.code.includes(searchCode)) return false;
    if (searchApplicant && !item.applicant.includes(searchApplicant)) return false;
    if (activeStatus !== "全部" && item.status !== activeStatus) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-gray-500">作业类型</label>
            <select value={searchType} onChange={e=>setSearchType(e.target.value)} className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer">
              {workTypes.map(t=><option key={t} value={t==="请选择作业类型"?"":t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-gray-500">编号</label>
            <input type="text" value={searchCode} onChange={e=>setSearchCode(e.target.value)} placeholder="请输入编号" className="w-48 px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-gray-500">申请人</label>
            <input type="text" value={searchApplicant} onChange={e=>setSearchApplicant(e.target.value)} placeholder="请输入申请人" className="w-48 px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          </div>
          <button className="px-4 py-2 bg-[#0052cc] text-white text-[13px] rounded-lg hover:bg-[#0044a8] cursor-pointer transition-colors">搜索</button>
          <button onClick={()=>{setSearchType("");setSearchCode("");setSearchApplicant("");}} className="px-4 py-2 border border-gray-200 text-gray-600 text-[13px] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">重置</button>
          <button onClick={()=>setShowExpand(!showExpand)} className="px-4 py-2 border border-gray-200 text-gray-600 text-[13px] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">展开</button>
        </div>

        <div className="flex items-center gap-1 mb-4 border-b border-gray-100">
          {statusTabs.map(tab=>(
            <button key={tab} onClick={()=>setActiveStatus(tab)} className={`px-4 py-2 text-[13px] font-medium cursor-pointer transition-colors border-b-2 ${activeStatus===tab?"text-[#0052cc] border-[#0052cc]":"text-gray-500 border-transparent hover:text-gray-700"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["序号","作业类型","申请状态","编号","作业分级","作业单位","作业地点","申请人","起止时间","监护人"].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i)=>{
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                    <td className="px-4 py-2.5 text-gray-600">{i+1}</td>
                    <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-600">{item.type}</span></td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-[11px] font-medium ${statusColors[item.status]}`}>{item.status}</span></td>
                    <td className="px-4 py-2.5 text-gray-800 font-medium">{item.code}</td>
                    <td className="px-4 py-2.5"><span className={item.level ? "px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-600" : ""}>{item.level || "-"}</span></td>
                    <td className="px-4 py-2.5 text-gray-700">{item.unit}</td>
                    <td className="px-4 py-2.5 text-gray-700">{item.location}</td>
                    <td className="px-4 py-2.5 text-gray-700">{item.applicant}</td>
                    <td className="px-4 py-2.5 text-gray-700">{item.startTime} ~ {item.endTime}</td>
                    <td className="px-4 py-2.5 text-gray-700">{item.guardian}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end mt-4 gap-4">
          <span className="text-[12px] text-gray-500">共 714 条</span>
          <select className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
            <option>100条/页</option>
          </select>
          <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled>‹</button>
          <button className="px-3 py-1.5 bg-[#0052cc] text-white rounded text-[12px]">1</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 cursor-pointer">2</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 cursor-pointer">3</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 cursor-pointer">4</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 cursor-pointer">5</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 cursor-pointer">6</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 cursor-pointer">...</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 cursor-pointer">72</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 cursor-pointer">›</button>
          <span className="text-[12px] text-gray-500">前往</span>
          <input type="number" defaultValue={1} className="w-12 px-2 py-1.5 border border-gray-200 rounded text-[12px] text-gray-700 focus:outline-none focus:border-blue-500"/>
          <span className="text-[12px] text-gray-500">页</span>
        </div>
      </div>
    </div>
  );
}

function PersonnelInfoPage() {
  const [syncing, setSyncing] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewModal, setViewModal] = useState<{open:boolean;item?:typeof personnelData[0]}>({open:false});
  const [blackModal, setBlackModal] = useState<{open:boolean;item?:typeof personnelData[0]}>({open:false});

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  };

  const filtered = personnelData.filter(p => {
    if (filterName && !p.name.includes(filterName) && !p.code.includes(filterName)) return false;
    if (filterUnit && p.unit !== filterUnit) return false;
    if (filterTeam && p.team !== filterTeam) return false;
    if (filterStatus) {
      const ps = p.status === "黑名单" ? "黑名单" : "正常";
      if (ps !== filterStatus) return false;
    }
    return true;
  });

  const maskId = (id: string) => {
    if (!id || id.length < 10) return id;
    return id.slice(0, 6) + "********" + id.slice(-4);
  };

  const inField = personnelData.filter(p => p.status === "在场").length;
  const blacklisted = personnelData.filter(p => p.status === "黑名单").length;

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-5 gap-3 flex-shrink-0">
        <StatCard title="人员总数" value={personnelData.length} footer="人" iconBg="bg-blue-100" icon={<Users size={18} className="text-blue-600"/>}/>
        <StatCard title="在场人员" value={inField} footer="人在场" iconBg="bg-green-100" icon={<CheckCircle size={18} className="text-green-600"/>}/>
        <StatCard title="已离场" value={personnelData.filter(p=>p.status==="离场").length} footer="人离场" iconBg="bg-gray-100" icon={<XCircle size={18} className="text-gray-500"/>}/>
        <StatCard title="黑名单人员" value={blacklisted} footer="限制进场" iconBg="bg-red-100" icon={<AlertTriangle size={18} className="text-red-600"/>}/>
        <StatCard title="平均出勤率" value="90.3" unit="%" footer="本月" iconBg="bg-purple-100" icon={<BarChart3 size={18} className="text-purple-600"/>}/>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-600 whitespace-nowrap">姓名/工号</span>
          <input value={filterName} onChange={e=>setFilterName(e.target.value)} placeholder="请输入姓名或工号"
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 w-40"/>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-600 whitespace-nowrap">所属单位</span>
          <select value={filterUnit} onChange={e=>setFilterUnit(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 bg-white cursor-pointer w-40">
            <option value="">全部单位</option>
            <option>中铁二十四局</option><option>中建一局</option><option>中铁建设</option><option>中建三局</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-600 whitespace-nowrap">班组</span>
          <select value={filterTeam} onChange={e=>setFilterTeam(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 bg-white cursor-pointer w-36">
            <option value="">全部班组</option>
            <option>钢筋班组</option><option>混凝土班组</option><option>木工班组</option><option>架子班组</option><option>管理人员</option><option>水电班组</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-600 whitespace-nowrap">人员状态</span>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 bg-white cursor-pointer w-32">
            <option value="">全部</option>
            <option>正常</option><option>黑名单</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1F53BE] text-white text-[13px] rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Search size={13}/>搜索
          </button>
          <button onClick={()=>{setFilterName("");setFilterUnit("");setFilterTeam("");setFilterStatus("");}}
            className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-200 text-gray-600 text-[13px] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <RotateCcw size={13}/>重置
          </button>
          <button onClick={handleSync}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-[13px] rounded-lg cursor-pointer transition-colors ${syncing?"bg-gray-100 text-gray-400":"bg-[#1F53BE] text-white hover:bg-blue-700"}`}>
            <RefreshCw size={13} className={syncing?"animate-spin":""}/>
            {syncing?"同步中...":"数据同步"}
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <span className="text-[14px] font-semibold text-gray-800">劳务人员信息列表</span>
          <span className="text-[12px] text-gray-400">数据来源：劳务实名制系统</span>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["工号","姓名","性别","年龄","身份证","所属单位","班组","工种","联系电话","进场时间","出场时间","人员状态","操作"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i)=>{
                const persStatus = p.status === "黑名单" ? "黑名单" : "正常";
                return (
                  <tr key={p.id} className={`border-b border-gray-100 hover:bg-gray-50/60 transition-colors ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                    <td className="px-4 py-3 font-mono text-[12px] text-gray-500">{p.code}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.gender}</td>
                    <td className="px-4 py-3 text-gray-600">{p.age}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-gray-500 tracking-wide">{maskId(p.idCard)}</td>
                    <td className="px-4 py-3 text-gray-700">{p.unit}</td>
                    <td className="px-4 py-3 text-gray-700">{p.team}</td>
                    <td className="px-4 py-3 text-gray-700">{p.trade}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-gray-500">{p.phone}</td>
                    <td className="px-4 py-3 text-gray-500 text-[12px] whitespace-nowrap">{p.entryTime}</td>
                    <td className="px-4 py-3 text-gray-500 text-[12px] whitespace-nowrap">{p.exitTime || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${persStatus==="黑名单"?"bg-red-100 text-red-700":"bg-green-100 text-green-700"}`}>{persStatus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={()=>setViewModal({open:true,item:p})} className="text-blue-600 hover:text-blue-800 cursor-pointer">查看</button>
                        {persStatus !== "黑名单" && (
                          <button onClick={()=>setBlackModal({open:true,item:p})} className="text-red-500 hover:text-red-700 cursor-pointer">加入黑名单</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0 && (
                <tr><td colSpan={13} className="px-4 py-12 text-center text-gray-400">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
          <Pager total={filtered.length}/>
        </div>
      </div>

      {/* 查看详情 Modal */}
      <Modal open={viewModal.open} onClose={()=>setViewModal({open:false})} title="人员详情" width="560px"
        footer={<Btn onClick={()=>setViewModal({open:false})}>关闭</Btn>}>
        {viewModal.item && (<>
          <FSec title="基本信息">
            <DetailRow label="工号" value={viewModal.item.code}/>
            <DetailRow label="姓名" value={viewModal.item.name}/>
            <DetailRow label="性别" value={viewModal.item.gender}/>
            <DetailRow label="年龄" value={String(viewModal.item.age)}/>
            <DetailRow label="身份证号" value={maskId(viewModal.item.idCard)}/>
            <DetailRow label="联系电话" value={viewModal.item.phone}/>
          </FSec>
          <FSec title="工作信息">
            <DetailRow label="所属单位" value={viewModal.item.unit}/>
            <DetailRow label="班组" value={viewModal.item.team}/>
            <DetailRow label="工种" value={viewModal.item.trade}/>
            <DetailRow label="进场时间" value={viewModal.item.entryTime}/>
            <DetailRow label="出场时间" value={viewModal.item.exitTime || "—"}/>
            <DetailRow label="人员状态" value={<span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${viewModal.item.status==="黑名单"?"bg-red-100 text-red-700":"bg-green-100 text-green-700"}`}>{viewModal.item.status==="黑名单"?"黑名单":"正常"}</span>}/>
          </FSec>
        </>)}
      </Modal>

      {/* 加入黑名单 Modal */}
      <Modal open={blackModal.open} onClose={()=>setBlackModal({open:false})} title="加入黑名单" width="480px"
        footer={<ModalFooter onCancel={()=>setBlackModal({open:false})} onConfirm={()=>setBlackModal({open:false})} confirmText="确认加入"/>}>
        {blackModal.item && (
          <FormGrid cols={1}>
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 grid grid-cols-3 gap-3 text-[13px]">
              <div><span className="text-gray-400">姓名：</span><span className="font-medium text-gray-700">{blackModal.item.name}</span></div>
              <div><span className="text-gray-400">班组：</span><span className="font-medium text-gray-700">{blackModal.item.team}</span></div>
              <div><span className="text-gray-400">单位：</span><span className="font-medium text-gray-700">{blackModal.item.unit}</span></div>
            </div>
            <FF label="加入原因" required><FTA placeholder="请输入加入黑名单的原因" rows={3}/></FF>
            <FF label="生效日期" required><FI type="date"/></FF>
            <FF label="备注"><FTA placeholder="其他备注信息" rows={2}/></FF>
          </FormGrid>
        )}
      </Modal>
    </div>
  );
}

function DeviceAssetsPage() {
  const [assetModal, setAssetModal] = useState<{open:boolean;mode:"add"|"edit"|"view";item?:typeof deviceAssetsData[0]}>({open:false,mode:"add"});
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

      <FilterBar>
        <FItem label="资产名称"><Inp placeholder="请输入名称"/></FItem>
        <FItem label="设备类型"><Sel options={["全部类型","水位传感器","DTU采集设备","水泵采集模块","AI摄像头","普通摄像头","工业网关","环境监测设备"]}/></FItem>
        <FItem label="管理部门"><Sel options={["全部部门","安全质量部","机电部","信息技术部"]}/></FItem>
        <FItem label="状态"><Sel options={["全部状态","在用","停用","报废"]}/></FItem>
        <div className="ml-auto flex gap-2"><Btn variant="primary"><Search size={13}/>查询</Btn><Btn><RefreshCw size={13}/>重置</Btn><Btn variant="primary" onClick={()=>setAssetModal({open:true,mode:"add"})}><Plus size={13}/>新增台账</Btn><Btn><Download size={13}/>导出</Btn></div>
      </FilterBar>
      <TableCard title="设备资产台账" pagination={<Pager total={deviceAssetsData.length}/>}>
        <DTable
          headers={[{label:"序号",width:"60px"},{label:"资产编号",width:"120px"},{label:"设备名称",width:"160px"},{label:"型号",width:"120px"},{label:"设备序列号",width:"130px"},{label:"设备类型",width:"120px"},{label:"使用状态",width:"90px"},{label:"生产厂家",width:"130px"},{label:"操作",width:"120px"}]}
          rows={deviceAssetsData.map((d,i) => [
            i+1,
            <span key="c" className="font-mono text-[12px] text-slate-400">{d.code}</span>,
            d.name,
            <span key="m" className="font-mono text-[12px]">{d.model}</span>,
            <span key="sn" className="font-mono text-[12px] text-slate-400">{d.sn}</span>,
            d.type,
            <StatusTag key="s" status={d.status}/>,
            <span key="mfr" className="text-[13px] text-slate-600">{(d as any).manufacturer ?? "—"}</span>,
            <div key="a" className="flex gap-2">
              <button onClick={()=>setAssetModal({open:true,mode:"view",item:d})} className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">查看</button>
              <button onClick={()=>setAssetModal({open:true,mode:"edit",item:d})} className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">编辑</button>
            </div>
          ])}
        />
      </TableCard>

      <Modal open={assetModal.open} onClose={()=>setAssetModal(p=>({...p,open:false}))} title={assetModal.mode==="add"?"新增资产台账":assetModal.mode==="edit"?"编辑资产台账":"资产台账详情"} width="640px"
        footer={assetModal.mode==="view"?<Btn onClick={()=>setAssetModal(p=>({...p,open:false}))}>关闭</Btn>:<ModalFooter onCancel={()=>setAssetModal(p=>({...p,open:false}))} onConfirm={()=>setAssetModal(p=>({...p,open:false}))} confirmText="保存"/>}>
        {assetModal.mode==="view" && assetModal.item ? (
          <div>
            <DetailRow label="资产编号" value={<span className="font-mono">{assetModal.item.code}</span>}/>
            <DetailRow label="设备名称" value={assetModal.item.name}/>
            <DetailRow label="设备名称" value={assetModal.item.name}/>
            <DetailRow label="设备序列号" value={<span className="font-mono text-slate-400">{assetModal.item.sn}</span>}/>
            <DetailRow label="型号" value={<span className="font-mono">{assetModal.item.model}</span>}/>
            <DetailRow label="设备类型" value={assetModal.item.type}/>
            <DetailRow label="使用状态" value={<StatusTag status={assetModal.item.status}/>}/>
            <DetailRow label="生产厂家" value={(assetModal.item as any).manufacturer ?? "—"}/>
            <DetailRow label="管理部门" value={assetModal.item.owner}/>
          </div>
        ) : (
          <FormGrid>
            <FF label="设备名称" required><FI placeholder="请输入设备名称" defaultValue={assetModal.item?.name}/></FF>
            <FF label="设备序列号"><FI placeholder="请输入序列号" defaultValue={assetModal.item?.sn}/></FF>
            <FF label="型号"><FI placeholder="请输入型号" defaultValue={assetModal.item?.model}/></FF>
            <FF label="设备类型" required><FS options={["水位传感器","DTU采集设备","水泵采集模块","AI摄像头","普通摄像头","工业网关","环境监测设备"]} defaultValue={assetModal.item?.type}/></FF>
            <FF label="使用状态"><FS options={["在用","停用","报废"]} defaultValue={assetModal.item?.status}/></FF>
            <FF label="生产厂家"><FI placeholder="请输入生产厂家" defaultValue={(assetModal.item as any)?.manufacturer}/></FF>
            <FF label="管理部门"><FS options={["安全质量部","机电部","信息技术部","综合部"]} defaultValue={assetModal.item?.owner}/></FF>
          </FormGrid>
        )}
      </Modal>
    </div>
  );
}

function WarningCenterPage() {
  const allWarnings = [
    ...monitorWarningData.map(w => ({...w, source: w.source})),
    ...riskData.filter(r=>r.warningStatus!=="正常").map(r => ({id:r.id+100, code:r.code, source:"风险管控", type:`${r.level}到期预警`, level:"较大预警", target:r.name, workpoint:r.workpoint, currentValue:r.status, threshold:"已闭环", content:`${r.name}管控${r.warningStatus}`, person:r.person, time:r.deadline, status:r.warningStatus==="超期"?"待处理":"待处理", bigscreen:"是"})),
  ];
  const pending = allWarnings.filter(w=>w.status==="待处理").length;
  const processing = allWarnings.filter(w=>w.status==="处理中").length;
  const resolved = allWarnings.filter(w=>w.status==="已关闭"||w.status==="已解除").length;
  const [viewModal, setViewModal] = useState<{open:boolean;item?:any}>({open:false});
  const [disposeModal, setDisposeModal] = useState<{open:boolean;item?:any}>({open:false});
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-3 flex-shrink-0">
        <StatCard title="当前预警总数" value={allWarnings.length} footer="条预警" iconBg="bg-red-100" icon={<Bell size={18} className="text-red-600"/>}/>
        <StatCard title="待处理" value={pending} footer="需立即响应" iconBg="bg-orange-100" icon={<AlertTriangle size={18} className="text-orange-600"/>}/>
        <StatCard title="处理中" value={processing} footer="正在处理" iconBg="bg-yellow-100" icon={<Clock size={18} className="text-yellow-600"/>}/>
        <StatCard title="今日新增" value={6} footer="条新预警" iconBg="bg-blue-100" icon={<Zap size={18} className="text-blue-600"/>}/>
        <StatCard title="已关闭/解除" value={resolved} footer="已完成" iconBg="bg-green-100" icon={<CheckCircle size={18} className="text-green-600"/>}/>
      </div>
      <FilterBar>
        <FItem label="预警来源"><Sel options={["全部来源","水位监测","抽水泵管理","沉降位移监测","风险管控","AI告警","安全检查"]}/></FItem>
        <FItem label="预警等级"><Sel options={["全部等级","重大预警","较大预警","一般预警"]}/></FItem>
        <FItem label="处理状态"><Sel options={["全部状态","待处理","处理中","已关闭","已解除"]}/></FItem>
        <FItem label="上大屏"><Sel options={["全部","是","否"]}/></FItem>
        <div className="ml-auto flex gap-2"><Btn variant="primary"><Search size={13}/>查询</Btn><Btn><RefreshCw size={13}/>重置</Btn><Btn><Download size={13}/>导出</Btn></div>
      </FilterBar>
      <TableCard title="综合预警列表" pagination={<Pager total={allWarnings.length}/>}>
        <DTable
          headers={[{label:"序号",width:"60px"},{label:"预警编号",width:"170px"},{label:"预警来源",width:"110px"},{label:"预警类型",width:"140px"},{label:"预警等级",width:"100px"},{label:"预警对象",width:"100px"},{label:"关联工点",width:"130px"},{label:"当前值",width:"120px"},{label:"预警内容",width:"200px"},{label:"责任人",width:"80px"},{label:"预警时间",width:"150px"},{label:"处理状态",width:"90px"},{label:"上大屏",width:"80px"},{label:"操作",width:"150px"}]}
          rows={allWarnings.slice(0,15).map((w,i) => [
            i+1,
            <span key="c" className="font-mono text-[11px] text-slate-400">{w.code}</span>,
            w.source, w.type, <StatusTag key="l" status={w.level}/>, w.target, w.workpoint,
            <span key="cv" className="text-red-600 font-medium text-[13px]">{w.currentValue}</span>,
            <span key="ct" className="text-[12px] text-slate-600">{w.content}</span>,
            w.person,
            <span key="t" className="text-[12px] text-slate-400">{w.time}</span>,
            <StatusTag key="s" status={w.status}/>, w.bigscreen,
            <div key="a" className="flex gap-2">
              <button onClick={()=>setViewModal({open:true,item:w})} className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">查看</button>
              {w.status!=="已关闭"&&w.status!=="已解除"&&<button onClick={()=>setDisposeModal({open:true,item:w})} className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">处置</button>}
              <button className="text-gray-400 text-[13px] hover:underline cursor-pointer">关闭</button>
            </div>
          ])}
        />
      </TableCard>

      <Modal open={viewModal.open} onClose={()=>setViewModal({open:false})} title="预警详情" width="560px" footer={<Btn onClick={()=>setViewModal({open:false})}>关闭</Btn>}>
        {viewModal.item && <>
          <DetailRow label="预警编号" value={<span className="font-mono text-[12px]">{viewModal.item.code}</span>}/>
          <DetailRow label="预警来源" value={viewModal.item.source}/>
          <DetailRow label="预警类型" value={viewModal.item.type}/>
          <DetailRow label="预警等级" value={<StatusTag status={viewModal.item.level}/>}/>
          <DetailRow label="预警对象" value={viewModal.item.target}/>
          <DetailRow label="关联工点" value={viewModal.item.workpoint}/>
          <DetailRow label="当前值" value={<span className="text-red-600 font-medium">{viewModal.item.currentValue}</span>} highlight/>
          <DetailRow label="预警内容" value={viewModal.item.content}/>
          <DetailRow label="责任人" value={viewModal.item.person}/>
          <DetailRow label="预警时间" value={viewModal.item.time}/>
          <DetailRow label="处理状态" value={<StatusTag status={viewModal.item.status}/>}/>
          <DetailRow label="是否上大屏" value={viewModal.item.bigscreen}/>
        </>}
      </Modal>

      <Modal open={disposeModal.open} onClose={()=>setDisposeModal({open:false})} title="处置预警" footer={<ModalFooter onCancel={()=>setDisposeModal({open:false})} onConfirm={()=>setDisposeModal({open:false})} confirmText="提交处置"/>}>
        {disposeModal.item && <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="text-[13px] font-medium text-orange-700">{disposeModal.item.type}</div>
          <div className="text-[12px] text-orange-600 mt-1">{disposeModal.item.content}</div>
        </div>}
        <FormGrid>
          <FF label="处置人" required><FI placeholder="请输入处置人姓名"/></FF>
          <FF label="处置时间"><FI type="datetime-local"/></FF>
          <FF label="处置结果" required><FS options={["已处理","需继续跟踪","误报关闭","转交其他部门"]}/></FF>
          <FF label="处理状态"><FS options={["处理中","已关闭","已解除"]}/></FF>
          <FF label="处置措施" required full><FTA placeholder="请详细描述处置措施和结果" rows={4}/></FF>
          <FF label="备注" full><FTA placeholder="可选填写备注信息" rows={2}/></FF>
        </FormGrid>
      </Modal>
    </div>
  );
}

function WxMiniprogramPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <StatCard title="已启用模块" value={miniProgramData.filter(m=>m.enabled).length} footer="个" iconBg="bg-blue-100" icon={<MessageSquare size={18} className="text-blue-600"/>}/>
        <StatCard title="今日活跃用户" value={miniProgramData.reduce((a,m)=>a+m.todayUse,0)} footer="人次" iconBg="bg-green-100" icon={<Users size={18} className="text-green-600"/>}/>
        <StatCard title="注册用户总数" value={miniProgramData.reduce((a,m)=>a+m.userCount,0)} footer="人" iconBg="bg-purple-100" icon={<Users size={18} className="text-purple-600"/>}/>
        <StatCard title="未启用模块" value={miniProgramData.filter(m=>!m.enabled).length} footer="个" iconBg="bg-gray-100" icon={<XCircle size={18} className="text-gray-500"/>}/>
      </div>
      <TableCard title="功能模块列表" actions={<><Btn variant="primary"><Plus size={13}/>新增模块</Btn><Btn><Download size={13}/>导出</Btn></>}>
        <DTable
          headers={[{label:"序号",width:"60px"},{label:"模块编号",width:"130px"},{label:"功能模块",width:"130px"},{label:"功能描述",width:"250px"},{label:"是否启用",width:"90px"},{label:"注册用户数",width:"100px"},{label:"今日使用人次",width:"120px"},{label:"当前版本",width:"120px"},{label:"更新时间",width:"110px"},{label:"操作",width:"150px"}]}
          rows={miniProgramData.map((m,i) => [
            i+1,
            <span key="c" className="font-mono text-[12px] text-slate-400">{m.code}</span>,
            <span key="n" className="font-medium text-[13px]">{m.module}</span>,
            <span key="d" className="text-[12px] text-slate-500">{m.desc}</span>,
            <span key="e" className={`text-xs font-medium ${m.enabled ? "text-green-600" : "text-slate-400"}`}>{m.enabled ? "启用" : "停用"}</span>,
            <span key="u" className="font-mono text-[13px]">{m.userCount}</span>,
            <span key="tu" className={`font-mono text-[13px] font-medium ${m.todayUse > 50 ? "text-blue-600" : m.todayUse > 0 ? "text-slate-700" : "text-slate-400"}`}>{m.todayUse}</span>,
            <span key="v" className="font-mono text-[12px] text-slate-500">{m.version}</span>,
            m.updateTime,
            <Actions key="a" items={[{label:m.enabled?"停用":"启用"},{label:"配置"},{label:"查看日志"}]}/>
          ])}
        />
      </TableCard>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm font-semibold text-gray-700 mb-4">今日使用统计</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={miniProgramData.filter(m=>m.enabled)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="module" tick={{fontSize:11}}/>
              <YAxis tick={{fontSize:11}}/>
              <Tooltip/>
              <Bar dataKey="todayUse" fill="#0052cc" name="今日使用" radius={[2,2,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm font-semibold text-gray-700 mb-4">小程序基本信息</div>
          <div className="space-y-2 text-[13px]">
            {[["小程序名称","淄海铁路智慧工地"],["AppID","wx1234567890abcdef"],["当前版本","v3.0.1"],["更新时间","2026/6/10"],["审核状态","已通过"],["运行环境","微信正式版"],["开发框架","uni-app"],["技术支持","信息技术部"]].map(([k,v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-slate-400">{k}</span>
                <span className="font-medium text-slate-700">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataApiPage() {
  const normal = apiData.filter(a=>a.status==="正常").length;
  const abnormal = apiData.filter(a=>a.status==="异常").length;
  const disabled = apiData.filter(a=>a.status==="停用").length;
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <StatCard title="接口总数" value={apiData.length} footer="个接口" iconBg="bg-blue-100" icon={<Code2 size={18} className="text-blue-600"/>}/>
        <StatCard title="运行正常" value={normal} footer="个" iconBg="bg-green-100" icon={<CheckCircle size={18} className="text-green-600"/>}/>
        <StatCard title="运行异常" value={abnormal} footer="个" iconBg="bg-red-100" icon={<AlertTriangle size={18} className="text-red-600"/>}/>
        <StatCard title="今日调用次数" value={apiData.reduce((a,d)=>a+d.todayCalls,0)} footer="次" iconBg="bg-purple-100" icon={<BarChart3 size={18} className="text-purple-600"/>}/>
      </div>
      <FilterBar>
        <FItem label="接口名称"><Inp placeholder="请输入接口名称"/></FItem>
        <FItem label="接口类型"><Sel options={["全部类型","数据接收","数据推送"]}/></FItem>
        <FItem label="运行状态"><Sel options={["全部状态","正常","异常","停用"]}/></FItem>
        <div className="ml-auto flex gap-2"><Btn variant="primary"><Search size={13}/>查询</Btn><Btn><RefreshCw size={13}/>重置</Btn><Btn variant="primary"><Plus size={13}/>新增接口</Btn></div>
      </FilterBar>
      <TableCard title="数据接口列表" actions={<><Btn><RefreshCw size={13}/>全部刷新</Btn><Btn><Download size={13}/>导出</Btn></>}>
        <DTable
          headers={[{label:"序号",width:"60px"},{label:"接口编号",width:"140px"},{label:"接口名称",width:"180px"},{label:"接口类型",width:"100px"},{label:"接口地址",width:"250px"},{label:"请求方式",width:"100px"},{label:"认证方式",width:"100px"},{label:"同步频率",width:"90px"},{label:"运行状态",width:"90px"},{label:"最后同步",width:"150px"},{label:"成功率",width:"80px"},{label:"今日调用",width:"90px"},{label:"操作",width:"150px"}]}
          rows={apiData.map((a,i) => [
            i+1,
            <span key="c" className="font-mono text-[12px] text-slate-400">{a.code}</span>,
            a.name, a.type,
            <span key="u" className="font-mono text-[11px] text-slate-500 break-all">{a.url}</span>,
            <span key="m" className="font-mono text-[12px] bg-slate-100 px-1.5 py-0.5 rounded">{a.method}</span>,
            a.auth, a.frequency,
            <span key="s" className={`text-xs font-medium ${a.status==="正常"?"text-green-600":a.status==="异常"?"text-red-600":"text-slate-400"}`}>{a.status}</span>,
            <span key="ls" className="text-[12px] text-slate-400">{a.lastSync}</span>,
            <span key="sr" className={`font-mono text-[13px] ${parseFloat(a.successRate)>95?"text-green-600":parseFloat(a.successRate)>80?"text-orange-600":"text-red-600"}`}>{a.successRate}</span>,
            <span key="tc" className="font-mono text-[13px]">{a.todayCalls}</span>,
            <Actions key="a" items={[{label:"查看"},{label:"编辑"},{label:"测试"},{label:a.status==="停用"?"启用":"停用"}]}/>
          ])}
        />
      </TableCard>
    </div>
  );
}

function UserManagementPage() {
  const [userModal, setUserModal] = useState<{open:boolean;mode:"add"|"edit"|"resetpwd";item?:typeof userManagementData[0]}>({open:false,mode:"add"});
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <StatCard title="用户总数" value={userManagementData.length} footer="人" iconBg="bg-blue-100" icon={<Users size={18} className="text-blue-600"/>}/>
        <StatCard title="启用用户" value={userManagementData.filter(u=>u.status==="启用").length} footer="人" iconBg="bg-green-100" icon={<CheckCircle size={18} className="text-green-600"/>}/>
        <StatCard title="禁用用户" value={userManagementData.filter(u=>u.status==="禁用").length} footer="人" iconBg="bg-gray-100" icon={<XCircle size={18} className="text-gray-500"/>}/>
        <StatCard title="今日活跃" value={userManagementData.filter(u=>u.lastLogin.startsWith("2026/7/6")).length} footer="人登录" iconBg="bg-purple-100" icon={<Activity size={18} className="text-purple-600"/>}/>
      </div>
      <FilterBar>
        <FItem label="用户名/姓名"><Inp placeholder="用户名或真实姓名"/></FItem>
        <FItem label="角色"><Sel options={["全部角色","超级管理员","项目负责人","安全员","质检员","施工员","设备管理员","监测操作员","只读用户"]}/></FItem>
        <FItem label="部门"><Sel options={["全部部门","信息技术部","工程部","安全质量部","机电部","综合部"]}/></FItem>
        <FItem label="状态"><Sel options={["全部状态","启用","禁用"]}/></FItem>
        <div className="ml-auto flex gap-2"><Btn variant="primary"><Search size={13}/>查询</Btn><Btn><RefreshCw size={13}/>重置</Btn><Btn variant="primary" onClick={()=>setUserModal({open:true,mode:"add"})}><Plus size={13}/>新增用户</Btn></div>
      </FilterBar>
      <TableCard title="用户列表" actions={<><Btn><Upload size={13}/>批量导入</Btn><Btn><Download size={13}/>导出</Btn></>} pagination={<Pager total={userManagementData.length}/>}>
        <DTable
          headers={[{label:"序号",width:"60px"},{label:"用户名",width:"130px"},{label:"真实姓名",width:"90px"},{label:"所属角色",width:"120px"},{label:"所属部门",width:"110px"},{label:"手机号",width:"120px"},{label:"邮箱",width:"160px"},{label:"最后登录",width:"150px"},{label:"状态",width:"80px"},{label:"创建时间",width:"110px"},{label:"操作",width:"160px"}]}
          rows={userManagementData.map((u,i) => [
            i+1,
            <span key="un" className="font-mono text-[13px]">{u.username}</span>,
            u.realName, u.role, u.dept,
            <span key="ph" className="font-mono text-[12px]">{u.phone}</span>,
            <span key="em" className="text-[12px] text-slate-400">{u.email}</span>,
            <span key="ll" className="text-[12px] text-slate-400">{u.lastLogin}</span>,
            <StatusTag key="s" status={u.status}/>,
            <span key="ct" className="text-[12px] text-slate-400">{u.createTime}</span>,
            <div key="a" className="flex gap-2">
              <button onClick={()=>setUserModal({open:true,mode:"edit",item:u})} className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">编辑</button>
              <button onClick={()=>setUserModal({open:true,mode:"resetpwd",item:u})} className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">重置密码</button>
              <button className="text-gray-400 text-[13px] hover:underline cursor-pointer">{u.status==="启用"?"禁用":"启用"}</button>
              <button className="text-red-500 text-[13px] hover:underline cursor-pointer">删除</button>
            </div>
          ])}
        />
      </TableCard>

      {/* 用户 Modal */}
      <Modal open={userModal.open} onClose={()=>setUserModal(p=>({...p,open:false}))} title={userModal.mode==="add"?"新增用户":userModal.mode==="resetpwd"?"重置密码":"编辑用户"} footer={<ModalFooter onCancel={()=>setUserModal(p=>({...p,open:false}))} onConfirm={()=>setUserModal(p=>({...p,open:false}))} confirmText={userModal.mode==="resetpwd"?"确认重置":"保存"}/>}>
        {userModal.mode==="resetpwd" ? (
          <FormGrid cols={1}>
            <FF label="用户名"><FI defaultValue={userModal.item?.username} disabled/></FF>
            <FF label="真实姓名"><FI defaultValue={userModal.item?.realName} disabled/></FF>
            <FF label="新密码" required><FI type="password" placeholder="请输入新密码（8位以上）"/></FF>
            <FF label="确认密码" required><FI type="password" placeholder="请再次输入新密码"/></FF>
          </FormGrid>
        ) : (
          <FormGrid>
            <FF label="用户名" required><FI placeholder="请输入用户名" defaultValue={userModal.item?.username}/></FF>
            <FF label="真实姓名" required><FI placeholder="请输入真实姓名" defaultValue={userModal.item?.realName}/></FF>
            <FF label="所属角色" required><FS options={["超级管理员","项目负责人","安全员","质检员","施工员","设备管理员","监测操作员","只读用户"]} defaultValue={userModal.item?.role}/></FF>
            <FF label="所属部门"><FS options={["信息技术部","工程部","安全质量部","机电部","综合部"]} defaultValue={userModal.item?.dept}/></FF>
            <FF label="手机号"><FI placeholder="请输入手机号" defaultValue={userModal.item?.phone}/></FF>
            <FF label="邮箱"><FI type="email" placeholder="请输入邮箱" defaultValue={userModal.item?.email}/></FF>
            {userModal.mode==="add" && <>
              <FF label="初始密码" required><FI type="password" placeholder="请输入初始密码"/></FF>
              <FF label="确认密码" required><FI type="password" placeholder="请再次输入密码"/></FF>
            </>}
            <FF label="账号状态"><FS options={["启用","禁用"]} defaultValue={userModal.item?.status}/></FF>
          </FormGrid>
        )}
      </Modal>
    </div>
  );
}

function RolePermissionPage() {
  const [selectedRole, setSelectedRole] = useState(1);
  const role = roleData.find(r => r.id === selectedRole);
  const menuTree = [
    {name:"项目总览",checked:true,children:[]},
    {name:"BIM建模与效果展示",checked:true,children:[]},
    {name:"生产管理",checked:true,children:[{name:"进度管理",checked:true},{name:"工期预警",checked:true}]},
    {name:"监测管理",checked:true,children:[{name:"水位监测管理",checked:true},{name:"抽水泵管理",checked:true},{name:"沉降位移监测",checked:true},{name:"监测预警",checked:true}]},
    {name:"安全管理",checked:true,children:[{name:"安全检查",checked:true},{name:"安全隐患",checked:selectedRole<=3},{name:"风险管控",checked:true},{name:"AI违规告警",checked:selectedRole<=4},{name:"安全红黑榜管理",checked:selectedRole<=3}]},
    {name:"人员管理",checked:selectedRole<=5,children:[{name:"劳务人员信息",checked:selectedRole<=5}]},
    {name:"设备管理",checked:selectedRole<=2||selectedRole===6,children:[{name:"接入设备清单",checked:true},{name:"设备巡检",checked:selectedRole<=2||selectedRole===6},{name:"设备维保",checked:selectedRole<=2||selectedRole===6},{name:"设备台账",checked:selectedRole<=6}]},
    {name:"系统管理",checked:selectedRole<=2,children:[{name:"用户管理",checked:selectedRole===1},{name:"角色权限管理",checked:selectedRole===1}]},
  ];
  return (
    <div className="flex-1 overflow-hidden p-6 flex flex-col gap-4">
      <div className="flex gap-4 flex-1 overflow-hidden min-h-0">
        <div className="w-72 flex-shrink-0 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">角色列表</span>
            <Btn variant="primary"><Plus size={13}/>新增</Btn>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {roleData.map(r => (
              <button key={r.id} onClick={() => setSelectedRole(r.id)} className={`w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${selectedRole === r.id ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50 border border-transparent"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[13px] font-medium ${selectedRole === r.id ? "text-[#0052cc]" : "text-gray-700"}`}>{r.name}</span>
                  <span className="text-[11px] text-slate-400">{r.userCount}人</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 overflow-hidden min-h-0">
          {role && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold text-gray-800">{role.name}</div>
                  <div className="text-[13px] text-slate-400 mt-0.5">{role.desc}</div>
                </div>
                <div className="flex gap-2">
                  <Btn><Edit2 size={13}/>编辑角色</Btn>
                  <Btn variant="primary"><CheckCircle size={13}/>保存权限</Btn>
                </div>
              </div>
              <div className="flex gap-6 mt-3 text-[13px]">
                <span className="text-slate-400">用户数：<span className="text-slate-700 font-medium">{role.userCount}</span></span>
                <span className="text-slate-400">菜单权限：<span className="text-slate-700 font-medium">{role.menuCount}个</span></span>
                <span className="text-slate-400">角色编码：<span className="font-mono text-slate-500">{role.code}</span></span>
                <span className="text-slate-400">状态：<span className="text-green-600 font-medium">{role.status}</span></span>
              </div>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-xl flex-1 overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <span className="text-[15px] font-semibold text-gray-800">菜单权限配置</span>
              <div className="flex gap-2 text-[13px]"><button className="text-[#0052cc] cursor-pointer">全选</button><span className="text-slate-300">|</span><button className="text-[#0052cc] cursor-pointer">全不选</button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                {menuTree.map(menu => (
                  <div key={menu.name} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <input type="checkbox" defaultChecked={menu.checked} className="cursor-pointer"/>
                      <span className="text-[13px] font-semibold text-gray-700">{menu.name}</span>
                    </div>
                    {menu.children.length > 0 && (
                      <div className="ml-5 space-y-1.5">
                        {menu.children.map((child: {name:string;checked:boolean}) => (
                          <div key={child.name} className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked={child.checked} className="cursor-pointer"/>
                            <span className="text-[12px] text-slate-600">{child.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE CONFIG & ROUTING ───────────────────────────────────────────────────
const pageConfig: Record<PageId, { title: string; desc: string; breadcrumb: string[] }> = {
  "project-overview": { title: "项目总览", desc: "全面了解项目进度、监测与安全状态", breadcrumb: ["项目总览"] },
  "bim-modeling": { title: "BIM建模与效果展示", desc: "查看BIM模型与施工效果展示", breadcrumb: ["BIM建模与效果展示"] },
  "progress": { title: "进度管理", desc: "", breadcrumb: [] },
  "early-warning": { title: "工期预警", desc: "监控项目进度，及时预警临期、延期及进度滞后等情况", breadcrumb: [] },
  "stage-config": { title: "施工阶段配置", desc: "配置施工阶段信息，包括阶段编号、名称、时间范围等", breadcrumb: ["生产管理", "基础配置", "施工阶段配置"] },
  "wbs-config": { title: "WBS结构配置", desc: "管理WBS树形结构，支持节点增删改查及BIM关联", breadcrumb: ["生产管理", "基础配置", "WBS结构配置"] },
  "workpoint-config": { title: "工点配置", desc: "配置工点信息，关联施工阶段，管理大屏展示状态", breadcrumb: ["生产管理", "基础配置", "工点配置"] },
  "warn-rule-config": { title: "工期预警规则", desc: "设置工期预警规则，配置预警阈值和启用状态", breadcrumb: ["生产管理", "基础配置", "工期预警规则"] },
  "pit-camera": { title: "基坑视频监控", desc: "实时查看各基坑区域摄像头监控画面与关键监测数据", breadcrumb: ["监测管理", "基坑视频监控"] },
  "pit-maintenance": { title: "基坑维护", desc: "管理基坑基础信息，配置标准控制水位和报警水位", breadcrumb: ["监测管理", "基坑维护"] },
  "water-level": { title: "水位监测管理", desc: "监测基坑降水井水位数据，保障施工安全", breadcrumb: ["监测管理", "水位监测管理"] },
  "pump-management": { title: "抽水泵管理", desc: "对深基坑降水抽水泵进行台账维护、运行状态监测与故障查看", breadcrumb: ["监测管理", "抽水泵管理"] },
  "settlement-monitor": { title: "沉降位移监测", desc: "监测点坐标对比，自动计算差值，判断沉降、位移是否超限", breadcrumb: ["监测管理", "沉降位移监测"] },
  "safety-check": { title: "应急安全演练", desc: "应急预案演练计划管理与历史记录查询", breadcrumb: ["安全管理", "应急安全演练"] },
  "hazard-rectify": { title: "安全隐患", desc: "安全隐患排查与整改跟踪管理", breadcrumb: ["安全管理", "安全隐患"] },
  "risk-control": { title: "风险管控", desc: "施工风险识别、分级管控与记录管理", breadcrumb: ["安全管理", "风险管控"] },
  "ai-alarm": { title: "视频监控", desc: "实时查看施工现场各区域摄像头监控画面", breadcrumb: ["安全管理", "视频监控"] },
  "violation-record": { title: "违规行为", desc: "施工现场违规行为人工登记与整改追踪", breadcrumb: ["安全管理", "违规行为"] },
  "blacklist-management": { title: "安全红黑榜管理", desc: "安全行为奖惩记录与黑名单管理", breadcrumb: ["安全管理", "安全红黑榜管理"] },
  "work-ticket": { title: "作业票管理", desc: "作业票的申请、审批与管理", breadcrumb: ["安全管理", "作业票管理"] },
  "personnel-info": { title: "劳务人员信息", desc: "劳务实名制人员信息台账维护与查询", breadcrumb: ["人员管理", "劳务人员信息"] },
  "attendance": { title: "考勤管理", desc: "人员考勤记录查询与统计分析", breadcrumb: ["人员管理", "考勤管理"] },
  "attendance-rules": { title: "考勤规则设置", desc: "配置打卡时间、班次安排、迟到早退规则及加班计算方式", breadcrumb: ["人员管理", "考勤规则设置"] },

  "device-list": { title: "接入设备清单", desc: "项目接入的各类传感器与设备台账管理", breadcrumb: ["设备管理", "接入设备清单"] },
  "device-inspection": { title: "设备巡检", desc: "设备巡检计划、执行与记录管理", breadcrumb: ["设备管理", "设备巡检"] },
  "device-maintenance": { title: "设备维保", desc: "设备维护保养计划与记录管理", breadcrumb: ["设备管理", "设备维保"] },
  "device-assets": { title: "设备台账", desc: "设备资产台账与生命周期管理", breadcrumb: ["设备管理", "设备台账"] },
  "warning-center": { title: "预警中心", desc: "汇聚各系统预警信息，统一管理与响应", breadcrumb: ["预警中心"] },
  "wx-miniprogram": { title: "微信小程序管理", desc: "小程序用户权限、功能模块配置管理", breadcrumb: ["微信小程序管理"] },
  "data-api": { title: "数据接口管理", desc: "外部系统数据接口配置、监控与日志管理", breadcrumb: ["数据接口管理"] },
  "user-management": { title: "用户管理", desc: "系统用户账号创建与权限分配", breadcrumb: ["系统管理", "用户管理"] },
  "role-permission": { title: "角色权限管理", desc: "系统角色定义与功能权限配置", breadcrumb: ["系统管理", "角色权限管理"] },
};

function renderPage(page: PageId): React.ReactNode {
  switch (page) {
    case "project-overview": return <ProjectOverviewPage/>;
    case "bim-modeling": return <BimModelingPage/>;
    case "progress": return <ProgressPage/>;
    case "early-warning": return <EarlyWarningPage/>;
    case "stage-config": return <StageConfigPage/>;
    case "wbs-config": return <WbsConfigPage/>;
    case "workpoint-config": return <WorkpointConfigPage/>;
    case "warn-rule-config": return <WarnRuleConfigPage/>;
    case "pit-camera": return <PitCameraPage/>;
    case "pit-maintenance": return <PitMaintenancePage/>;
    case "water-level": return <WaterLevelPage/>;
    case "pump-management": return <PumpManagementPage/>;
    case "settlement-monitor": return <SettlementMonitorPage/>;
    case "safety-check": return <SafetyCheckPage/>;
    case "hazard-rectify": return <HazardRectifyPage/>;
    case "risk-control": return <RiskControlPage/>;
    case "ai-alarm": return <AiAlarmPage/>;
    case "violation-record": return <ViolationRecordPage/>;
    case "blacklist-management": return <BlacklistManagementPage/>;
    case "work-ticket": return <WorkTicketPage/>;
    case "personnel-info": return <PersonnelInfoPage/>;
    case "attendance": return <AttendancePage/>;
    case "attendance-rules": return <AttendanceRulesPage/>;

    case "device-list": return <FullDeviceListPage/>;
    case "device-inspection": return <DeviceInspectionPage/>;
    case "device-maintenance": return <DeviceMaintenancePage/>;
    case "device-assets": return <DeviceAssetsPage/>;
    case "warning-center": return <WarningCenterPage/>;
    case "wx-miniprogram": return <WxMiniprogramPage/>;
    case "data-api": return <DataApiPage/>;
    case "user-management": return <UserManagementPage/>;
    case "role-permission": return <RolePermissionPage/>;
    default: {
      const cfg = pageConfig[page];
      return <PlaceholderPage title={cfg.title} desc={cfg.desc}/>;
    }
  }
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("progress");
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set(["4"]));

  const toggleMenu = useCallback((id: string) => {
    setOpenMenus(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const navigateTo = useCallback((page: PageId, menuId?: string) => {
    setCurrentPage(page);
    if (menuId) setOpenMenus(prev => new Set([...prev, menuId]));
  }, []);

  const cfg = pageConfig[currentPage];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── 顶部蓝色通栏 ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-5" style={{background:"#1F53BE", height:"54px"}}>
        {/* 左：系统名 */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Building2 size={17} className="text-white"/>
          </div>
          <div>
            <div className="text-[14px] font-bold text-white leading-tight tracking-wide">淄海铁路智慧工地信息化系统</div>
          </div>
        </div>
        {/* 右：消息 + 用户 */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white bg-white/15 hover:bg-white/25 cursor-pointer transition-all">
            <Bell size={14}/><span>消息</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Users size={14} className="text-white"/>
            </div>
            <span className="text-[13px] text-white/90">管理员</span>
          </div>
        </div>
      </header>

      {/* ── 主体：侧边栏 + 内容 ── */}
      <div className="flex flex-1 overflow-hidden" style={{background:"#f0f2f5"}}>
        {/* SIDEBAR */}
        <aside className="w-[210px] bg-white flex flex-col flex-shrink-0" style={{borderRight:"1px solid #e8eaec"}}>
          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-2 px-2" style={{scrollbarWidth:"none"}}>
            {navItems.map(item => {
              const hasChildren = !!item.children?.length;
              const isOpen = openMenus.has(item.id);
              const isPageActive = item.page === currentPage;
              const isGroupActive = hasChildren && item.children!.some(c => c.page === currentPage || c.children?.some(gc => gc.page === currentPage));
              const groupOn = isPageActive || isGroupActive;
              return (
                <div key={item.id} className="mb-0.5">
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all ${groupOn ? "text-white" : "text-gray-600 hover:bg-blue-50 hover:text-[#1F53BE]"}`}
                    style={groupOn ? {background:"#1F53BE"} : {}}
                    onClick={() => hasChildren ? toggleMenu(item.id) : navigateTo(item.page!, item.id)}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {hasChildren && <ChevronRight size={13} className={`transition-transform ${isOpen?"rotate-90":""} ${groupOn?"text-white/60":"text-gray-300"}`}/>}
                  </button>
                  {hasChildren && isOpen && (
                    <div className="ml-6 pl-3 mt-0.5 pb-1 space-y-0.5" style={{borderLeft:"2px solid #e8eaec"}}>
                      {item.children!.map(child => {
                        const childHasChildren = !!child.children?.length;
                        const childOn = child.page === currentPage;
                        const isGrandchildActive = childHasChildren && child.children!.some(gc => gc.page === currentPage);
                        const childGroupOn = childOn || isGrandchildActive;
                        return (
                          <div key={child.page}>
                            <button
                              onClick={() => childHasChildren ? toggleMenu(child.page) : navigateTo(child.page, item.id)}
                              className={`w-full flex items-center justify-between text-left px-3 py-2 text-[12px] rounded-lg cursor-pointer block transition-all font-medium ${childGroupOn ? "text-white" : "text-gray-500 hover:bg-blue-50 hover:text-[#1F53BE]"}`}
                              style={childGroupOn ? {background:"#1F53BE"} : {}}>
                              <span>{child.label}</span>
                              {childHasChildren && <ChevronRight size={11} className={`transition-transform ${openMenus.has(child.page)?"rotate-90":""} ${childGroupOn?"text-white/60":"text-gray-300"}`}/>}
                            </button>
                            {childHasChildren && openMenus.has(child.page) && (
                              <div className="ml-4 pl-3 mt-0.5 pb-1 space-y-0.5">
                                {child.children!.map(grandchild => {
                                  const grandchildOn = grandchild.page === currentPage;
                                  return (
                                    <button key={grandchild.page}
                                      onClick={() => navigateTo(grandchild.page, item.id)}
                                      className={`w-full text-left px-3 py-1.5 text-[11px] rounded-lg cursor-pointer block transition-all font-medium ${grandchildOn ? "text-white" : "text-gray-500 hover:bg-blue-50 hover:text-[#1F53BE]"}`}
                                      style={grandchildOn ? {background:"#1F53BE"} : {}}>
                                      {grandchild.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User bottom */}
          <div className="px-3 py-3 flex-shrink-0" style={{borderTop:"1px solid #e8eaec"}}>
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Users size={13} className="text-white"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-gray-700">管理员</p>
                <p className="text-[10px] text-gray-400 truncate">admin@zhrail.com</p>
              </div>
              <LogOut size={13} className="text-gray-300"/>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Page title strip */}
          <div className="bg-white px-6 py-3 flex-shrink-0 flex items-center gap-3" style={{borderBottom:"1px solid #e8eaec"}}>
            <h1 className="text-[15px] font-semibold text-gray-800">{cfg.title}</h1>
          </div>
          <main className="flex-1 overflow-hidden flex flex-col min-h-0">
            {renderPage(currentPage)}
          </main>
        </div>
      </div>
    </div>
  );
}
