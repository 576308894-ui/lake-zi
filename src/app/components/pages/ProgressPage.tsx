import { useState } from "react";
import {
  ChevronDown, ChevronRight, RefreshCw, Filter, Search, RotateCcw,
  Plus, Upload, Download, Edit2, Trash2,
} from "lucide-react";
import {
  StatusTag, FilterBar, FItem, Inp, Sel, Btn,
  TableCard, DTable, Pager,
  Modal, FormGrid, FF, FI, FS, FSec, DetailRow, ModalFooter,
} from "../ui";
import { stageData } from "./progressShared";

// ─── DATA ─────────────────────────────────────────────────────────────────────
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

const workpointData = [
  { id: "WP01", code: "WP01", name: "翻车机房基坑",       stages: ["S1","S2"],       status: "施工中", enabled: true,  bigscreen: true,  sort: 1,  bimCount: 42 },
  { id: "WP02", code: "WP02", name: "地下皮带廊基坑",     stages: ["S1","S2"],       status: "施工中", enabled: true,  bigscreen: true,  sort: 2,  bimCount: 28 },
  { id: "WP03", code: "WP03", name: "翻车机房地下结构",   stages: ["S2"],            status: "施工中", enabled: true,  bigscreen: true,  sort: 3,  bimCount: 67 },
  { id: "WP04", code: "WP04", name: "东侧支护结构",       stages: ["S1"],            status: "已完成", enabled: true,  bigscreen: false, sort: 4,  bimCount: 14 },
  { id: "WP05", code: "WP05", name: "地下皮带廊主体结构", stages: ["S2"],            status: "未开始", enabled: true,  bigscreen: true,  sort: 5,  bimCount: 31 },
  { id: "WP06", code: "WP06", name: "翻车机房地上结构",   stages: ["S3"],            status: "未开始", enabled: true,  bigscreen: true,  sort: 6,  bimCount: 0  },
  { id: "WP07", code: "WP07", name: "钢结构顶棚区域",     stages: ["S4"],            status: "未开始", enabled: false, bigscreen: false, sort: 7,  bimCount: 0  },
  { id: "WP08", code: "WP08", name: "施工主通道",         stages: ["S1","S2"],       status: "施工中", enabled: true,  bigscreen: false, sort: 8,  bimCount: 0  },
  { id: "WP09", code: "WP09", name: "钢筋加工区",         stages: ["S1","S2","S3"],  status: "施工中", enabled: true,  bigscreen: false, sort: 9,  bimCount: 0  },
  { id: "WP10", code: "WP10", name: "材料堆放区",         stages: ["S1","S2"],       status: "施工中", enabled: true,  bigscreen: false, sort: 10, bimCount: 0  },
];

const componentTableData = [
  { id:1, code:"CJ-001", name:"翻车机房垫层",           unit:"翻车机房",   dept:"地下部分",     item:"地基与基础",   planStart:"2024-03-01", planEnd:"2024-03-31", actualStart:"2024-03-05", actualEnd:"2024-03-28", progress:100, status:"已完成", remark:"已验收" },
  { id:2, code:"CJ-002", name:"翻车机房底板",           unit:"翻车机房",   dept:"地下部分",     item:"地基与基础",   planStart:"2024-04-01", planEnd:"2024-05-31", actualStart:"2024-04-03", actualEnd:"2024-05-25", progress:100, status:"已完成", remark:"已验收" },
  { id:3, code:"CJ-003", name:"地下东侧墙",             unit:"翻车机房",   dept:"地下部分",     item:"地下主体结构", planStart:"2024-06-01", planEnd:"2024-08-31", actualStart:"2024-06-05", actualEnd:"",          progress:85,  status:"进行中", remark:"" },
  { id:4, code:"CJ-004", name:"地下西侧墙",             unit:"翻车机房",   dept:"地下部分",     item:"地下主体结构", planStart:"2024-06-01", planEnd:"2024-08-31", actualStart:"2024-06-08", actualEnd:"",          progress:80,  status:"进行中", remark:"" },
  { id:5, code:"CJ-005", name:"廊道土方开挖（起点段）", unit:"地下皮带廊", dept:"廊道基础工程", item:"廊道土方开挖", planStart:"2024-07-01", planEnd:"2024-09-30", actualStart:"2024-07-10", actualEnd:"2024-09-20", progress:100, status:"已完成", remark:"已完工" },
  { id:6, code:"CJ-006", name:"廊道侧墙（左侧起点段）", unit:"地下皮带廊", dept:"廊道主体结构", item:"廊道侧墙施工", planStart:"2024-10-01", planEnd:"2025-01-31", actualStart:"2024-10-08", actualEnd:"",          progress:55,  status:"进行中", remark:"" },
  { id:7, code:"CJ-007", name:"基坑东侧支护桩",         unit:"基坑支护",   dept:"支护工程",     item:"支护桩施工",   planStart:"2024-03-01", planEnd:"2024-04-30", actualStart:"2024-03-05", actualEnd:"2024-04-25", progress:100, status:"已完成", remark:"已验收" },
  { id:8, code:"CJ-008", name:"基坑降水井群",           unit:"基坑支护",   dept:"降水工程",     item:"降水井施工",   planStart:"2024-03-15", planEnd:"2024-06-30", actualStart:"2024-03-20", actualEnd:"2024-06-28", progress:100, status:"已完成", remark:"持续运行" },
];

// ─── WBS TREE ─────────────────────────────────────────────────────────────────
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

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export function ProgressPage() {
  const [topTab, setTopTab] = useState("overview");
  const [subTab, setSubTab] = useState("stage");
  const [selectedWBS, setSelectedWBS] = useState("淄海铁路项目");
  const [stageModal, setStageModal] = useState<{open:boolean;mode:"add"|"edit";item?:typeof stageData[0]}>({open:false,mode:"add"});
  const [wpModal, setWpModal] = useState<{open:boolean;mode:"add"|"edit"|"view";item?:typeof workpointData[0]}>({open:false,mode:"add"});
  const [wbsModal, setWbsModal] = useState<{open:boolean;mode:"add"|"edit"}>({open:false,mode:"add"});
  const [filterStageNo, setFilterStageNo] = useState("");
  const [filterStageName, setFilterStageName] = useState("");
  const [filterStageStatus, setFilterStageStatus] = useState("");
  const [filterCurrent, setFilterCurrent] = useState("");
  const [filterOnScreen, setFilterOnScreen] = useState("");
  const [compViewModal, setCompViewModal] = useState<{open:boolean;item?:typeof componentTableData[0]}>({open:false});
  const [filterUnit, setFilterUnit] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterItem, setFilterItem] = useState("");
  const [filterCompStatus, setFilterCompStatus] = useState("");

  const filteredComponents = componentTableData.filter(d => {
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
      {/* 顶部 tab */}
      <div className="bg-white border-b border-gray-200 px-6 flex flex-shrink-0">
        {([["overview","进度总览"],["config","基础配置"]] as const).map(([id,label]) => (
          <button key={id} onClick={()=>setTopTab(id)}
            className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${topTab===id?"text-[#1F53BE] border-[#1F53BE]":"text-slate-500 border-transparent hover:text-[#1F53BE]"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* 基础配置 二级 tab */}
      {topTab === "config" && (
        <div className="bg-white border-b border-gray-200 px-6 flex flex-shrink-0">
          {([["stage","施工阶段配置"],["wbs","WBS结构配置"],["workpoint","工点配置"]] as const).map(([id,label]) => (
            <button key={id} onClick={()=>setSubTab(id)}
              className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${subTab===id?"text-[#1F53BE] border-[#1F53BE]":"text-slate-500 border-transparent hover:text-[#1F53BE]"}`}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── 进度总览 ── */}
      {topTab === "overview" && (
        <div className="flex-1 flex overflow-hidden">
          {/* 左：WBS 树 */}
          <div className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-gray-800">WBS结构树</span>
              <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 cursor-pointer"><RefreshCw size={12}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 text-[12px]">
              <WBSTreeNode node={wbsData} selected={selectedWBS} onSelect={setSelectedWBS}/>
            </div>
          </div>

          {/* 右：内容区 */}
          <div className="flex-1 flex flex-col overflow-y-auto p-5 gap-4 bg-gray-50">
            {/* 统计卡片 */}
            <div className="grid grid-cols-6 gap-3 flex-shrink-0">
              {[
                { label:"施工作业数", value:"53", sub:"总工序", color:"text-[#1F53BE]" },
                { label:"当前进度", value:"62.5", sub:"计划进度 72%", color:"text-orange-500" },
                { label:"延期工序", value:"4", sub:"延迟工序", color:"text-red-500" },
                { label:"本月产值", value:"23", sub:"万元", color:"text-green-600" },
                { label:"本月完工", value:"45", sub:"工序", color:"text-[#1F53BE]" },
                { label:"工期预警", value:"3", sub:"个", color:"text-orange-500" },
              ].map(c=>(
                <div key={c.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col gap-1">
                  <span className="text-[11px] text-gray-400">{c.label}</span>
                  <span className={`text-[22px] font-bold ${c.color}`}>{c.value}</span>
                  <span className="text-[11px] text-gray-400">{c.sub}</span>
                </div>
              ))}
            </div>

            {/* 构件列表及状态监测 */}
            <div className="bg-white border border-gray-200 rounded-xl flex flex-col flex-shrink-0">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className="text-[13px] font-semibold text-gray-800">构件列表及状态监测</span>
                <span className="text-[11px] text-gray-400">共 {filteredComponents.length} 条</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {["序号","构件编号","构件名称","单位工程","分部工程","分项工程","当前状态","操作"].map(h=>(
                        <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComponents.map((d,i)=>{
                      const sc = d.status==="已完成"?"bg-green-100 text-green-700":d.status==="进行中"?"bg-blue-100 text-blue-700":d.status==="已延期"?"bg-red-100 text-red-700":"bg-gray-100 text-gray-500";
                      return (
                        <tr key={d.id} className={`border-b border-gray-100 hover:bg-gray-50/60 ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                          <td className="px-4 py-2.5 text-gray-500">{i+1}</td>
                          <td className="px-4 py-2.5 font-mono text-gray-400">{d.code}</td>
                          <td className="px-4 py-2.5 text-gray-800 font-medium">{d.name}</td>
                          <td className="px-4 py-2.5 text-gray-600">{d.unit}</td>
                          <td className="px-4 py-2.5 text-gray-600">{d.dept}</td>
                          <td className="px-4 py-2.5 text-gray-600">{d.item}</td>
                          <td className="px-4 py-2.5">
                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${sc}`}>{d.status}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex gap-3">
                              <button onClick={()=>setCompViewModal({open:true,item:d})} className="text-blue-600 hover:text-blue-800 cursor-pointer">查看</button>
                              <button className="text-gray-500 hover:text-gray-700 cursor-pointer">状态</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredComponents.length===0 && (
                      <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">暂无数据</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-2.5 border-t border-gray-100 flex justify-end">
                <Pager total={filteredComponents.length}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 基础配置 ── */}
      {topTab === "config" && (
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          {/* 施工阶段配置 */}
          {subTab === "stage" && (
            <>
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-gray-600 whitespace-nowrap">阶段编号</span>
                  <input value={filterStageNo} onChange={e=>setFilterStageNo(e.target.value)} placeholder="请输入阶段编号"
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 w-36"/>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-gray-600 whitespace-nowrap">阶段名称</span>
                  <input value={filterStageName} onChange={e=>setFilterStageName(e.target.value)} placeholder="请输入阶段名称"
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 w-40"/>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-gray-600 whitespace-nowrap">状态</span>
                  <select value={filterStageStatus} onChange={e=>setFilterStageStatus(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer w-32">
                    <option value="">全部状态</option>
                    <option>未开始</option><option>进行中</option><option>已完成</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-gray-600 whitespace-nowrap">是否当前</span>
                  <select value={filterCurrent} onChange={e=>setFilterCurrent(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer w-24">
                    <option value="">全部</option><option>是</option><option>否</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-gray-600 whitespace-nowrap">是否上大屏</span>
                  <select value={filterOnScreen} onChange={e=>setFilterOnScreen(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer w-24">
                    <option value="">全部</option><option>是</option><option>否</option>
                  </select>
                </div>
                <div className="flex gap-2 ml-auto">
                  <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1F53BE] text-white text-[13px] rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <Search size={13}/>查询
                  </button>
                  <button onClick={()=>{setFilterStageNo("");setFilterStageName("");setFilterStageStatus("");setFilterCurrent("");setFilterOnScreen("");}}
                    className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-200 text-gray-600 text-[13px] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <RotateCcw size={13}/>重置
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl flex flex-col">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                  <span className="text-[14px] font-semibold text-gray-800">施工阶段列表</span>
                  <div className="flex gap-2">
                    <button onClick={()=>setStageModal({open:true,mode:"add"})}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F53BE] text-white text-[13px] rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      <Plus size={13}/>新增
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-[13px] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <Upload size={13}/>导入
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        {["序号","阶段编号","阶段名称","开始日期","结束日期","工期(天)","状态","是否当前","是否上大屏","排序","操作"].map(h=>(
                          <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStages.map((s,i)=>(
                        <tr key={s.id} className={`border-b border-gray-100 hover:bg-gray-50/60 ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                          <td className="px-4 py-3 text-gray-500">{i+1}</td>
                          <td className="px-4 py-3 font-mono text-gray-500">{s.code}</td>
                          <td className="px-4 py-3 text-gray-800 font-medium">{s.name}</td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.start}</td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.end}</td>
                          <td className="px-4 py-3 text-gray-600">{s.duration}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${s.status==="已完成"?"bg-green-100 text-green-700":s.status==="进行中"?"bg-orange-100 text-orange-700":"bg-gray-100 text-gray-500"}`}>{s.status}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{s.current?"是":"否"}</td>
                          <td className="px-4 py-3">
                            <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${s.onScreen?"bg-[#1F53BE]":"bg-gray-300"}`}>
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${s.onScreen?"left-5":"left-0.5"}`}/>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{s.sort}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3">
                              <button onClick={()=>setStageModal({open:true,mode:"edit",item:s})} className="text-blue-600 hover:text-blue-800 cursor-pointer">编辑</button>
                              <button className="text-red-500 hover:text-red-700 cursor-pointer">删除</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
                  <Pager total={filteredStages.length}/>
                </div>
              </div>
            </>
          )}

          {/* WBS结构配置 */}
          {subTab === "wbs" && (() => {
            const wbsNodeDetails: Record<string, {code:string;type:string;owner:string;planStart:string;planEnd:string;duration:string;weight:string;sort:number;enabled:boolean;remark:string;children:number;level:string}> = {
              "地基与基础":   { code:"ZH-FX-001", type:"分项工程", owner:"赵工", planStart:"2024-03-01", planEnd:"2024-05-31", duration:"92 天",  weight:"8%",   sort:1, enabled:true, remark:"暂无备注", children:3, level:"第 4 层" },
              "地下主体结构": { code:"ZH-FX-002", type:"分项工程", owner:"李工", planStart:"2024-06-01", planEnd:"2024-12-31", duration:"213 天", weight:"15%",  sort:2, enabled:true, remark:"暂无备注", children:4, level:"第 4 层" },
              "地下部分":     { code:"ZH-FE-001", type:"分部工程", owner:"张工", planStart:"2024-03-01", planEnd:"2024-12-31", duration:"305 天", weight:"23%",  sort:1, enabled:true, remark:"暂无备注", children:2, level:"第 3 层" },
              "地上部分":     { code:"ZH-FE-002", type:"分部工程", owner:"王工", planStart:"2025-01-01", planEnd:"2025-06-30", duration:"180 天", weight:"12%",  sort:2, enabled:true, remark:"暂无备注", children:3, level:"第 3 层" },
              "翻车机房":     { code:"ZH-ZT-001", type:"单位工程", owner:"陈工", planStart:"2024-03-01", planEnd:"2025-06-30", duration:"487 天", weight:"55%",  sort:1, enabled:true, remark:"暂无备注", children:3, level:"第 2 层" },
              "地下皮带廊":   { code:"ZH-ZT-002", type:"单位工程", owner:"刘工", planStart:"2024-07-01", planEnd:"2025-03-31", duration:"273 天", weight:"30%",  sort:2, enabled:true, remark:"暂无备注", children:2, level:"第 2 层" },
              "淄海铁路项目": { code:"ZH-PRJ-001",type:"总项目",  owner:"张总", planStart:"2024-01-01", planEnd:"2025-12-31", duration:"730 天", weight:"100%", sort:1, enabled:true, remark:"淄海铁路智慧工地总项目", children:5, level:"第 1 层" },
            };
            const detail = wbsNodeDetails[selectedWBS] ?? { code:"ZH-XX-000", type:"分项工程", owner:"—", planStart:"—", planEnd:"—", duration:"—", weight:"—", sort:1, enabled:true, remark:"暂无备注", children:0, level:"第 5 层" };

            type CfgNode = { name: string; children?: CfgNode[] };
            const cfgTree: CfgNode = {
              name:"淄海铁路项目", children:[
                { name:"翻车机房", children:[
                  { name:"地下部分", children:[{ name:"地基与基础" }, { name:"地下主体结构" }]},
                  { name:"地上部分", children:[{ name:"设备安装部分" }, { name:"钢结构顶棚" }]},
                ]},
                { name:"地下皮带廊" },
                { name:"基坑支护及降水工程" },
                { name:"监测工程" },
                { name:"临设及现场辅助工程" },
              ],
            };

            function CfgTreeNode({ node, depth=0 }: { node: CfgNode; depth?: number }) {
              const [open, setOpen] = useState(depth < 3);
              const hasKids = !!node.children?.length;
              const isSel = node.name === selectedWBS;
              return (
                <div>
                  <div onClick={()=>{ if(hasKids) setOpen(o=>!o); setSelectedWBS(node.name); }}
                    style={{paddingLeft:`${8+depth*16}px`, paddingRight:"8px"}}
                    className={`flex items-center gap-1.5 py-1.5 rounded cursor-pointer text-[13px] transition-colors ${isSel?"bg-blue-50 text-[#1F53BE] font-medium":"text-gray-700 hover:bg-gray-50"}`}>
                    <span className={`w-3.5 h-3.5 flex-shrink-0 rounded-sm border text-[9px] flex items-center justify-center ${isSel?"bg-[#1F53BE] border-[#1F53BE] text-white":"border-gray-400 bg-white"}`}>
                      {hasKids ? (open?"▾":"▸") : ""}
                    </span>
                    <span className="truncate">{node.name}</span>
                  </div>
                  {hasKids && open && node.children!.map((c,i)=><CfgTreeNode key={i} node={c} depth={depth+1}/>)}
                </div>
              );
            }

            return (
              <div className="flex gap-0 flex-1 overflow-hidden min-h-0 bg-white border border-gray-200 rounded-xl">
                <div className="w-56 flex-shrink-0 border-r border-gray-200 flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-gray-800">WBS结构树</span>
                    <div className="flex gap-0.5">
                      <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 cursor-pointer text-[12px]">∨</button>
                      <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 cursor-pointer text-[12px]">∧</button>
                    </div>
                  </div>
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="relative">
                      <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input placeholder="搜索WBS节点..." className="w-full pl-7 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 bg-gray-50"/>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                    <CfgTreeNode node={cfgTree}/>
                  </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-semibold text-gray-800 mr-2">{selectedWBS} - 节点详情</span>
                    <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 text-[12px] rounded-lg hover:bg-gray-50 cursor-pointer"><Plus size={12}/>新增同级</button>
                    <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 text-[12px] rounded-lg hover:bg-gray-50 cursor-pointer"><Plus size={12}/>新增子节点</button>
                    <button onClick={()=>setWbsModal({open:true,mode:"edit"})} className="flex items-center gap-1 px-3 py-1.5 bg-[#1F53BE] text-white text-[12px] rounded-lg hover:bg-blue-700 cursor-pointer"><Edit2 size={12}/>编辑</button>
                    <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 text-[12px] rounded-lg hover:bg-gray-50 cursor-pointer">↑ 上移</button>
                    <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 text-[12px] rounded-lg hover:bg-gray-50 cursor-pointer">↓ 下移</button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-[12px] rounded-lg hover:bg-red-600 cursor-pointer"><Trash2 size={12}/>删除</button>
                    <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 text-[12px] rounded-lg hover:bg-gray-50 cursor-pointer"><Upload size={12}/>导入</button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    <div>
                      <div className="text-[14px] font-semibold text-gray-800 mb-4">基本信息</div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        {[
                          ["节点编号", detail.code], ["节点名称", selectedWBS],
                          ["节点类型", detail.type], ["责任人", detail.owner],
                          ["计划开始日期", detail.planStart], ["计划完成日期", detail.planEnd],
                          ["工期(天)", detail.duration], ["权重", detail.weight],
                        ].map(([label, value])=>(
                          <div key={String(label)} className="flex flex-col gap-1.5">
                            <label className="text-[12px] text-gray-500">{label}</label>
                            <div className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-gray-50">{value}</div>
                          </div>
                        ))}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] text-gray-500">排序</label>
                          <div className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-gray-50">{detail.sort}</div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] text-gray-500">是否启用</label>
                          <div className="flex items-center h-9">
                            <div className={`w-10 h-5 rounded-full relative ${detail.enabled?"bg-[#1F53BE]":"bg-gray-300"}`}>
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${detail.enabled?"left-5":"left-0.5"}`}/>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 flex flex-col gap-1.5">
                          <label className="text-[12px] text-gray-500">备注</label>
                          <div className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-400 bg-gray-50 min-h-[60px]">{detail.remark}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-gray-800 mb-4">统计信息</div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] text-gray-500">子节点数量</label>
                          <div className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-gray-50">{detail.children} 个</div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] text-gray-500">层级</label>
                          <div className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-gray-50">{detail.level}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 工点配置 */}
          {subTab === "workpoint" && (
            <>
              <FilterBar>
                <FItem label="工点名称"><Inp placeholder="请输入工点名称"/></FItem>
                <FItem label="施工阶段"><Sel options={["全部阶段","S1施工准备阶段","S2基坑支护及降水阶段","S3坑内地下结构物施工阶段","S4地上结构及设备安装阶段"]}/></FItem>
                <FItem label="当前状态"><Sel options={["全部状态","施工中","已完成","未开始","暂停"]}/></FItem>
                <div className="ml-auto flex gap-2"><Btn variant="primary"><Search size={13}/>查询</Btn><Btn><RefreshCw size={13}/>重置</Btn></div>
              </FilterBar>
              <TableCard title="工点列表" actions={<><Btn variant="primary" onClick={()=>setWpModal({open:true,mode:"add"})}><Plus size={13}/>新增工点</Btn><Btn><Upload size={13}/>批量导入</Btn></>} pagination={<Pager total={workpointData.length}/>}>
                <DTable
                  headers={[{label:"序号",width:"60px"},{label:"工点编号",width:"100px"},{label:"工点名称",width:"160px"},{label:"是否启用",width:"90px"},{label:"是否上大屏",width:"90px"},{label:"排序",width:"70px"},{label:"操作",width:"120px"}]}
                  rows={workpointData.map((w,i) => [
                    i+1, w.code, w.name,
                    w.enabled ? <span key="e" className="text-green-600 text-xs">启用</span> : <span key="e" className="text-slate-400 text-xs">停用</span>,
                    w.bigscreen ? <span key="b" className="text-green-600 text-xs">是</span> : <span key="b" className="text-slate-400 text-xs">否</span>,
                    w.sort,
                    <div key="a" className="flex gap-2">
                      <button onClick={()=>setWpModal({open:true,mode:"edit",item:w})} className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">编辑</button>
                      <button className="text-red-500 text-[13px] hover:underline cursor-pointer">删除</button>
                    </div>
                  ])}
                />
              </TableCard>
            </>
          )}
        </div>
      )}

      {/* 施工阶段 Modal */}
      <Modal open={stageModal.open} onClose={()=>setStageModal(p=>({...p,open:false}))} title={stageModal.mode==="add"?"新增施工阶段":"编辑施工阶段"} footer={<ModalFooter onCancel={()=>setStageModal(p=>({...p,open:false}))} onConfirm={()=>setStageModal(p=>({...p,open:false}))} confirmText="保存"/>}>
        <FormGrid>
          <FF label="阶段编号" required><FI placeholder="请输入阶段编号" defaultValue={stageModal.item?.code}/></FF>
          <FF label="阶段名称" required><FI placeholder="请输入阶段名称" defaultValue={stageModal.item?.name}/></FF>
          <FF label="开始日期" required><FI type="date" defaultValue={stageModal.item?.start}/></FF>
          <FF label="结束日期" required><FI type="date" defaultValue={stageModal.item?.end}/></FF>
          <FF label="阶段状态"><FS options={["未开始","进行中","已完成"]} defaultValue={stageModal.item?.status}/></FF>
          <FF label="是否当前阶段"><FS options={["否","是"]} defaultValue={stageModal.item?.current?"是":"否"}/></FF>
          <FF label="是否上大屏"><FS options={["是","否"]} defaultValue={stageModal.item?.onScreen?"是":"否"}/></FF>
          <FF label="排序号"><FI type="number" defaultValue={String(stageModal.item?.sort??1)}/></FF>
        </FormGrid>
      </Modal>

      {/* 工点 Modal */}
      <Modal open={wpModal.open} onClose={()=>setWpModal(p=>({...p,open:false}))} title={wpModal.mode==="add"?"新增工点":"编辑工点"} footer={<ModalFooter onCancel={()=>setWpModal(p=>({...p,open:false}))} onConfirm={()=>setWpModal(p=>({...p,open:false}))} confirmText="保存"/>}>
        <FormGrid>
          <FF label="工点编号" required><FI placeholder="请输入工点编号" defaultValue={wpModal.item?.code}/></FF>
          <FF label="工点名称" required><FI placeholder="请输入工点名称" defaultValue={wpModal.item?.name}/></FF>
          <FF label="当前状态"><FS options={["施工中","已完成","未开始","暂停"]} defaultValue={wpModal.item?.status}/></FF>
          <FF label="是否启用"><FS options={["是","否"]} defaultValue={wpModal.item?.enabled?"是":"否"}/></FF>
          <FF label="是否上大屏"><FS options={["是","否"]} defaultValue={wpModal.item?.bigscreen?"是":"否"}/></FF>
          <FF label="排序号"><FI type="number" defaultValue={String(wpModal.item?.sort??1)}/></FF>
        </FormGrid>
      </Modal>

      {/* WBS Modal */}
      <Modal open={wbsModal.open} onClose={()=>setWbsModal(p=>({...p,open:false}))} title={wbsModal.mode==="add"?"新增WBS节点":"编辑WBS节点"} footer={<ModalFooter onCancel={()=>setWbsModal(p=>({...p,open:false}))} onConfirm={()=>setWbsModal(p=>({...p,open:false}))} confirmText="保存"/>}>
        <FormGrid>
          <FF label="节点名称" required><FI placeholder="请输入节点名称"/></FF>
          <FF label="父节点"><FS options={["无（根节点）","翻车机房","地下皮带廊","基坑支护及降水工程","监测工程","临设及现场辅助工程"]}/></FF>
          <FF label="计划开始" required><FI type="date"/></FF>
          <FF label="计划完成" required><FI type="date"/></FF>
          <FF label="责任单位"><FI placeholder="请输入责任单位"/></FF>
          <FF label="责任人"><FI placeholder="请输入责任人"/></FF>
          <FF label="排序号"><FI type="number" defaultValue="1"/></FF>
          <FF label="节点状态"><FS options={["未开始","进行中","已完成"]}/></FF>
        </FormGrid>
      </Modal>

      {/* 构件详情 Modal */}
      <Modal open={compViewModal.open} onClose={()=>setCompViewModal({open:false})} title="构件详情" width="600px"
        footer={<Btn onClick={()=>setCompViewModal({open:false})}>关闭</Btn>}>
        {compViewModal.item && (<>
          <FSec title="基本信息">
            <DetailRow label="构件编号" value={compViewModal.item.code}/>
            <DetailRow label="构件名称" value={compViewModal.item.name}/>
            <DetailRow label="单位工程" value={compViewModal.item.unit}/>
            <DetailRow label="分部工程" value={compViewModal.item.dept}/>
            <DetailRow label="分项工程" value={compViewModal.item.item}/>
            <DetailRow label="当前状态" value={
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${compViewModal.item.status==="已完成"?"bg-green-100 text-green-700":"bg-blue-100 text-blue-700"}`}>
                {compViewModal.item.status}
              </span>}/>
          </FSec>
          <FSec title="进度信息">
            <DetailRow label="计划开始" value={compViewModal.item.planStart}/>
            <DetailRow label="计划完成" value={compViewModal.item.planEnd}/>
            <DetailRow label="实际开始" value={compViewModal.item.actualStart}/>
            <DetailRow label="实际完成" value={compViewModal.item.actualEnd || "—"}/>
            <DetailRow label="完成进度" value={
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${compViewModal.item.progress===100?"bg-green-400":"bg-blue-400"}`} style={{width:`${compViewModal.item.progress}%`}}/>
                </div>
                <span className="text-gray-700 font-medium">{compViewModal.item.progress}%</span>
              </div>}/>
            <DetailRow label="备注" value={compViewModal.item.remark || "—"}/>
          </FSec>
        </>)}
      </Modal>
    </div>
  );
}
