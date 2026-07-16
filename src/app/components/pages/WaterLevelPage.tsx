import { useState } from "react";
import { Droplets, CheckCircle, AlertTriangle, MapPin, RefreshCw, Plus } from "lucide-react";
import { Modal, FormGrid, FF, FI, FS, ModalFooter } from "../ui";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const wlData = [
  { id: 1,  code:"JW001", name:"1号降水井",  zone:"翻车机房基坑北区",   level:"一级降水", wellGroup:"一级降水井组A", workpoint:"WP01", workpointName:"翻车机房基坑",   depth:28.00, groundElev:32.50, standardWater:18.50, alarmWater:20.00, currentWater:18.62, sensor:"WL-A01", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:28:05", note:"" },
  { id: 2,  code:"JW002", name:"2号降水井",  zone:"翻车机房基坑北区",   level:"一级降水", wellGroup:"一级降水井组A", workpoint:"WP01", workpointName:"翻车机房基坑",   depth:28.00, groundElev:32.50, standardWater:18.50, alarmWater:20.00, currentWater:19.38, sensor:"WL-A02", online:true,  dataStatus:"high",     enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:28:12", note:"水位偏高，已通知抽水" },
  { id: 3,  code:"JW003", name:"3号降水井",  zone:"翻车机房基坑北区",   level:"一级降水", wellGroup:"一级降水井组A", workpoint:"WP01", workpointName:"翻车机房基坑",   depth:28.00, groundElev:32.50, standardWater:18.50, alarmWater:20.00, currentWater:20.47, sensor:"WL-A03", online:true,  dataStatus:"overlimit", enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:28:18", note:"超限预警，已启动应急抽水" },
  { id: 4,  code:"JW004", name:"4号降水井",  zone:"翻车机房基坑北区",   level:"一级降水", wellGroup:"一级降水井组A", workpoint:"WP01", workpointName:"翻车机房基坑",   depth:28.00, groundElev:32.50, standardWater:18.50, alarmWater:20.00, currentWater:18.24, sensor:"WL-A04", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:28:22", note:"" },
  { id: 5,  code:"JW005", name:"5号降水井",  zone:"翻车机房基坑南区",   level:"二级降水", wellGroup:"二级降水井组B", workpoint:"WP01", workpointName:"翻车机房基坑",   depth:26.00, groundElev:31.80, standardWater:17.80, alarmWater:19.50, currentWater:17.55, sensor:"WL-B01", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:27:58", note:"" },
  { id: 6,  code:"JW006", name:"6号降水井",  zone:"翻车机房基坑南区",   level:"二级降水", wellGroup:"二级降水井组B", workpoint:"WP01", workpointName:"翻车机房基坑",   depth:26.00, groundElev:31.80, standardWater:17.80, alarmWater:19.50, currentWater:null,  sensor:"WL-B02", online:false, dataStatus:"abnormal",  enabled:true,  bigscreen:false, collectTime:"2026-07-09 08:14:02", note:"传感器通信中断" },
  { id: 7,  code:"JW007", name:"7号降水井",  zone:"翻车机房基坑南区",   level:"二级降水", wellGroup:"二级降水井组B", workpoint:"WP01", workpointName:"翻车机房基坑",   depth:26.00, groundElev:31.80, standardWater:17.80, alarmWater:19.50, currentWater:18.72, sensor:"WL-B03", online:true,  dataStatus:"high",     enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:27:44", note:"连续偏高24h，建议检查" },
  { id: 8,  code:"JW008", name:"8号降水井",  zone:"翻车机房基坑南区",   level:"二级降水", wellGroup:"二级降水井组B", workpoint:"WP01", workpointName:"翻车机房基坑",   depth:26.00, groundElev:31.80, standardWater:17.80, alarmWater:19.50, currentWater:17.30, sensor:"WL-B04", online:true,  dataStatus:"normal",   enabled:false, bigscreen:false, collectTime:"2026-07-09 14:28:01", note:"" },
  { id: 9,  code:"JW009", name:"9号降水井",  zone:"地下皮带廊基坑",     level:"三级降水", wellGroup:"三级降水井组C", workpoint:"WP02", workpointName:"地下皮带廊基坑", depth:22.00, groundElev:30.20, standardWater:15.50, alarmWater:17.00, currentWater:15.38, sensor:"WL-C01", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:27:35", note:"" },
  { id: 10, code:"JW010", name:"10号降水井", zone:"地下皮带廊基坑",     level:"三级降水", wellGroup:"三级降水井组C", workpoint:"WP02", workpointName:"地下皮带廊基坑", depth:22.00, groundElev:30.20, standardWater:15.50, alarmWater:17.00, currentWater:16.45, sensor:"WL-C02", online:true,  dataStatus:"high",     enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:27:40", note:"接近警戒水位" },
  { id: 11, code:"JW011", name:"11号降水井", zone:"地下皮带廊基坑",     level:"三级降水", wellGroup:"三级降水井组C", workpoint:"WP02", workpointName:"地下皮带廊基坑", depth:22.00, groundElev:30.20, standardWater:15.50, alarmWater:17.00, currentWater:17.15, sensor:"WL-C03", online:true,  dataStatus:"overlimit", enabled:true,  bigscreen:true,  collectTime:"2026-07-09 14:27:48", note:"超限！请立即处理" },
  { id: 12, code:"JW012", name:"12号降水井", zone:"地下皮带廊基坑",     level:"三级降水", wellGroup:"三级降水井组C", workpoint:"WP02", workpointName:"地下皮带廊基坑", depth:22.00, groundElev:30.20, standardWater:15.50, alarmWater:17.00, currentWater:15.62, sensor:"WL-C04", online:true,  dataStatus:"normal",   enabled:true,  bigscreen:false, collectTime:"2026-07-09 14:27:52", note:"" },
];

const dsMap: Record<string,string>  = { normal:"正常", high:"偏高", overlimit:"超限", abnormal:"数据异常" };
const dsColor: Record<string,string> = { normal:"text-green-600", high:"text-orange-500", overlimit:"text-red-600", abnormal:"text-gray-400" };

// minimal pump code lookup (well code → pump code)
const pumpWellMap: Record<string,string> = {
  "JW001":"PUMP001","JW003":"PUMP002","JW004":"PUMP004","JW012":"PUMP005",
  "JW015":"PUMP006","JW020":"PUMP008","JW025":"PUMP010",
};

// ─── SVG 降水井示意图 ──────────────────────────────────────────────────────────
function WellIcon({ status, pct }: { status: string; pct: number }) {
  const isOnline = status !== "abnormal";
  const waterColor = status === "overlimit" ? "#ef4444" : status === "high" ? "#f97316" : "#3b82f6";
  const waterH = isOnline ? Math.round(pct * 60) : 0;
  return (
    <svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="0" y="0" width="80" height="18" fill="#d1d5db"/>
      <rect x="0" y="14" width="80" height="4" fill="#9ca3af"/>
      <rect x="28" y="0" width="24" height="110" rx="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
      <rect x="32" y="2" width="16" height="106" fill="#f8fafc"/>
      {isOnline && waterH > 0 && (
        <rect x="32" y={108 - waterH} width="16" height={waterH} fill={waterColor} opacity="0.75"/>
      )}
      <line x1="26" y1="45" x2="54" y2="45" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2"/>
      <line x1="26" y1="60" x2="54" y2="60" stroke="#f97316" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6"/>
      {isOnline && <line x1="40" y1="2" x2="40" y2={108 - waterH} stroke="#6b7280" strokeWidth="0.8" strokeDasharray="1,2"/>}
      <rect x="22" y="0" width="36" height="6" rx="1" fill="#6b7280"/>
      <text x="56" y="46" fill="#ef4444" fontSize="5" fontFamily="monospace">警</text>
      <text x="56" y="61" fill="#f97316" fontSize="5" fontFamily="monospace">标</text>
      {!isOnline && <text x="40" y="65" fill="#9ca3af" fontSize="7" textAnchor="middle">离线</text>}
    </svg>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export function WaterLevelPage() {
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState<{open:boolean; item?: typeof wlData[0]}>({open:false});
  const [detailTab, setDetailTab] = useState<"realtime"|"day"|"week">("realtime");
  const [handleModal, setHandleModal] = useState<{open:boolean; item?: typeof wlData[0]}>({open:false});
  const [handleDesc, setHandleDesc] = useState("");
  const [handlePerson, setHandlePerson] = useState("");
  const [handledMap, setHandledMap] = useState<Record<number,{time:string;person:string;desc:string}>>({});

  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchLevel, setSearchLevel] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const filteredWlData = wlData.filter(w => {
    if (searchCode && !w.code.toLowerCase().includes(searchCode.toLowerCase())) return false;
    if (searchName && !w.name.includes(searchName)) return false;
    if (searchType === "normal" && w.dataStatus !== "normal") return false;
    if (searchType === "alarm" && w.dataStatus === "normal") return false;
    if (searchLevel && w.level !== searchLevel) return false;
    if (searchDate && !w.collectTime.startsWith(searchDate)) return false;
    return true;
  });

  const total  = wlData.length;
  const normal = wlData.filter(w=>w.dataStatus==="normal").length;
  const alarm  = wlData.filter(w=>w.dataStatus==="high"||w.dataStatus==="overlimit").length;

  const getRelatedPump = (code: string) => pumpWellMap[code] ?? "--";
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
        {[
          { label:"点位总数", sub:"全部完成基础建设",   val:total,  bold:"text-gray-900",   bg:"bg-blue-50",   icon:<Droplets size={20} className="text-blue-500"/> },
          { label:"正常点位", sub:"持续监控运行上限",   val:normal, bold:"text-green-600",  bg:"bg-green-50",  icon:<CheckCircle size={20} className="text-green-500"/> },
          { label:"异常点位", sub:"超限或数据异常",     val:alarm,  bold:"text-red-600",    bg:"bg-red-50",    icon:<AlertTriangle size={20} className="text-red-500"/> },
        ].map(s=>(
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
            <div>
              <div className={`text-2xl font-bold leading-tight ${s.bold}`}>{s.val}</div>
              <div className="text-[12px] text-gray-500 font-medium">{s.label}</div>
              <div className="text-[11px] text-gray-400">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 搜索过滤栏 ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">编号</span>
            <input type="text" placeholder="请输入降水井编号"
              value={searchCode} onChange={e=>setSearchCode(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">名称</span>
            <input type="text" placeholder="请输入降水井名称"
              value={searchName} onChange={e=>setSearchName(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">类型</span>
            <select value={searchType} onChange={e=>setSearchType(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-32 focus:outline-none focus:border-blue-500 bg-white cursor-pointer">
              <option value="">全部类型</option>
              <option value="normal">正常</option>
              <option value="alarm">报警</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">降水井分类</span>
            <select value={searchLevel} onChange={e=>setSearchLevel(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 w-36 focus:outline-none focus:border-blue-500 bg-white cursor-pointer">
              <option value="">全部分类</option>
              <option value="一级降水">一级降水</option>
              <option value="二级降水">二级降水</option>
              <option value="三级降水">三级降水</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">时间</span>
            <input type="date" value={searchDate} onChange={e=>setSearchDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"/>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={()=>{setSearchCode("");setSearchName("");setSearchType("");setSearchLevel("");setSearchDate("");}}
              className="inline-flex items-center gap-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-[13px] font-medium cursor-pointer bg-white text-gray-600 hover:bg-gray-50">
              <RefreshCw size={13}/>重置
            </button>
            <button onClick={()=>setAddModal(true)}
              className="inline-flex items-center gap-1.5 border border-[#0052cc] rounded-md px-3 py-1.5 text-[13px] font-medium cursor-pointer bg-[#0052cc] text-white hover:bg-[#0044a8]">
              <Plus size={13}/>新增监测
            </button>
          </div>
        </div>
      </div>

      {/* ── 区域标题栏 ── */}
      <div className="flex items-center justify-between flex-shrink-0">
        <span className="text-[14px] font-semibold text-gray-700">降水井水位监测卡片
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
          return (
            <div key={w.id} className={`bg-white rounded-xl border-2 flex flex-col shadow-sm hover:shadow-md transition-shadow ${cfg.border}`}>
              <div className={`px-3 pt-3 pb-2 flex items-start justify-between border-b ${isOverlimit?"border-red-100 bg-red-50/30":isHigh?"border-orange-100 bg-orange-50/20":"border-gray-100"}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[15px] flex-shrink-0 ${isOverlimit?"bg-red-100 text-red-700":isHigh?"bg-orange-100 text-orange-700":"bg-blue-100 text-blue-700"}`}>井</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] text-gray-800 leading-tight truncate">{w.code} {w.name}</div>
                  </div>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 mt-0.5 ${isOverlimit?"bg-red-100 text-red-700":isHigh?"bg-orange-100 text-orange-700":w.dataStatus==="abnormal"?"bg-gray-100 text-gray-500":"bg-green-100 text-green-700"}`}>
                  {cfg.label}
                </span>
              </div>
              <div className="px-3 py-1 text-[11px] text-gray-400 bg-gray-50/60 border-b border-gray-100 flex items-center gap-1 flex-shrink-0">
                <MapPin size={9}/>{w.zone}
              </div>
              <div className="px-3 py-2.5 grid grid-cols-2 gap-x-2 gap-y-2 flex-1">
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
              </div>
              <div className={`px-3 py-2 border-t border-gray-100 flex items-center justify-between flex-shrink-0 ${isOverlimit?"bg-red-50/30":""}`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${w.online?"animate-pulse bg-green-400":"bg-gray-300"}`}/>
                  <span className={`text-[11px] font-medium ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-[10px] text-gray-400">数据时间: {collectHM}</span>
                </div>
                <button onClick={()=>setDetailModal({open:true,item:w})}
                  className="text-[12px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                  查看详情
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 新增监测弹窗 ── */}
      <Modal open={addModal} onClose={()=>setAddModal(false)} title="新增监测" width="480px"
        footer={<ModalFooter onCancel={()=>setAddModal(false)} onConfirm={()=>setAddModal(false)} confirmText="保存"/>}>
        <FormGrid cols={1}>
          <FF label="降水井编号" required><FI placeholder="请输入降水井编号，如 JW013"/></FF>
          <FF label="所在区域" required>
            <FS options={["翻车机房基坑北区","翻车机房基坑南区","地下皮带廊基坑"]}/>
          </FF>
          <FF label="关联传感器" required><FI placeholder="请输入传感器编号，如 WL-C05"/></FF>
          <FF label="降水井深度(m)" required><FI type="number" placeholder="请输入降水井深度（米）"/></FF>
          <FF label="基坑深度(m)" required><FI type="number" placeholder="请输入基坑深度（米）"/></FF>
        </FormGrid>
      </Modal>

      {/* ── 查看详情弹窗 ── */}
      <Modal open={detailModal.open} onClose={()=>{setDetailModal({open:false});setDetailTab("realtime");}} title="" width="760px"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-[12px] text-gray-400">
              {detailModal.item && handledMap[detailModal.item.id]
                ? <span className="text-green-600 font-medium">✓ 已处理 · {handledMap[detailModal.item.id].time}</span>
                : detailModal.item && isAlarm(detailModal.item) ? <span className="text-orange-500">当前水位异常，请及时处理</span> : null
              }
            </div>
            <div className="flex gap-2">
              {detailModal.item && isAlarm(detailModal.item) && !handledMap[detailModal.item.id] && (
                <button onClick={()=>{setHandleModal({open:true,item:detailModal.item});setDetailModal({open:false});setDetailTab("realtime");}}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-500 text-white text-[13px] font-medium hover:bg-orange-600 cursor-pointer transition-colors">
                  <CheckCircle size={14}/>处理
                </button>
              )}
              <button onClick={()=>{setDetailModal({open:false});setDetailTab("realtime");}}
                className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-600 text-[13px] hover:bg-gray-50 cursor-pointer">关闭</button>
            </div>
          </div>
        }>
        {detailModal.item && (()=>{
          const w = detailModal.item!;
          const isOverlimit = w.dataStatus==="overlimit";
          const isHigh = w.dataStatus==="high";
          const handled = handledMap[w.id];
          const pump = getRelatedPump(w.code);
          const buryDepth = w.currentWater != null ? (w.groundElev - w.currentWater).toFixed(2) : "--";

          const baseWater = w.currentWater ?? w.standardWater;
          const genRows = (count: number, intervalHours: number) => {
            const rows = [];
            const now = new Date("2026-07-13T14:30:00");
            for (let i = 0; i < count; i++) {
              const t = new Date(now.getTime() - i * intervalHours * 3600000);
              const jitter = (Math.sin(i * 1.3 + w.id) * 0.18 + Math.cos(i * 0.7) * 0.12);
              const val = +(baseWater + jitter).toFixed(2);
              const st = val >= w.alarmWater ? "overlimit" : val >= w.standardWater ? "high" : "normal";
              const pad = (n: number) => String(n).padStart(2,"0");
              const ts = `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}`;
              rows.push({ ts, val, st });
            }
            return rows;
          };
          const dayRows  = genRows(24, 1);
          const weekRows = genRows(28, 6);

          return (
            <>
              <div className={`-mx-6 -mt-6 px-6 py-4 mb-5 border-b flex items-center gap-3 ${isOverlimit?"bg-red-50 border-red-200":isHigh?"bg-orange-50 border-orange-200":"bg-blue-50 border-blue-200"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${isOverlimit?"bg-red-100 text-red-700":isHigh?"bg-orange-100 text-orange-700":"bg-blue-100 text-blue-700"}`}>井</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800 text-[15px]">{w.code} {w.name}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${isOverlimit?"bg-red-100 text-red-700":isHigh?"bg-orange-100 text-orange-700":"bg-green-100 text-green-700"}`}>
                      {statusCfg[w.dataStatus]?.label}
                    </span>
                    {handled && <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ 已处理</span>}
                  </div>
                  <div className="text-[12px] text-gray-500 mt-0.5">{w.zone} · {w.level} · 传感器 {w.sensor}</div>
                </div>
                <div className="flex items-center gap-5 text-right flex-shrink-0">
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

              <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
                {([["realtime","实时数据"],["day","近一天"],["week","近一周"]] as const).map(([key,label])=>(
                  <button key={key} onClick={()=>setDetailTab(key)}
                    className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors cursor-pointer ${detailTab===key?"border-blue-500 text-blue-600":"border-transparent text-gray-500 hover:text-gray-700"}`}>
                    {label}
                  </button>
                ))}
              </div>

              {detailTab==="realtime" && (
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
                      {([
                        ["降水井编号", w.code,                                      "降水井名称",  w.name],
                        ["所在区域",   w.zone,                                      "降水级别",    w.level],
                        ["关联传感器",  w.sensor,                                    "井深(m)",     `${w.depth.toFixed(2)}m`],
                        ["地面标高(m)",`${w.groundElev.toFixed(2)}m`,               "标准水位(m)", `${w.standardWater.toFixed(2)}m`],
                        ["报警水位(m)",`${w.alarmWater.toFixed(2)}m`,               "当前水位(m)", w.currentWater !== null ? `${w.currentWater.toFixed(2)}m` : "--"],
                        ["当前埋深(m)",`${buryDepth}m`,                             "在线状态",    w.online?"在线":"离线"],
                        ["关联抽水泵",  pump,                                        "数据状态",    dsMap[w.dataStatus]??w.dataStatus],
                        ["采集时间",   w.collectTime,                               "备注",        w.note||"—"],
                      ] as [string,string,string,string][]).map((row, ri) => (
                        <tr key={ri} className={`border-b border-gray-100 ${ri%2===0?"bg-white":"bg-gray-50/40"}`}>
                          <td className="px-4 py-2.5 text-gray-400 text-[12px]">{row[0]}</td>
                          <td className="px-4 py-2.5 font-medium text-gray-800">
                            {row[0]==="当前水位(m)"
                              ? <span className={isOverlimit?"text-red-600 font-bold":isHigh?"text-orange-600 font-bold":""}>{row[1]}</span>
                              : row[1]}
                          </td>
                          <td className="px-4 py-2.5 text-gray-400 text-[12px]">{row[2]}</td>
                          <td className="px-4 py-2.5 font-medium text-gray-800">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {(detailTab==="day"||detailTab==="week") && (()=>{
                const rows = detailTab==="day" ? dayRows : weekRows;
                return (
                  <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500">采集时间</th>
                          <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500">水位(m)</th>
                          <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500">埋深(m)</th>
                          <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500">状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r,ri)=>{
                          const bd = (w.groundElev - r.val).toFixed(2);
                          const isOL = r.st==="overlimit";
                          const isHI = r.st==="high";
                          return (
                            <tr key={ri} className={`border-b border-gray-100 ${ri%2===0?"bg-white":"bg-gray-50/40"}`}>
                              <td className="px-4 py-2.5 text-gray-500 text-[12px]">{r.ts}</td>
                              <td className={`px-4 py-2.5 font-medium ${isOL?"text-red-600":isHI?"text-orange-600":"text-gray-800"}`}>{r.val.toFixed(2)}</td>
                              <td className="px-4 py-2.5 text-gray-700">{bd}</td>
                              <td className="px-4 py-2.5">
                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${isOL?"bg-red-100 text-red-700":isHI?"bg-orange-100 text-orange-700":"bg-green-100 text-green-700"}`}>
                                  {isOL?"超限":isHI?"偏高":"正常"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

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
                  placeholder="请详细描述处理措施…"
                  className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 resize-y w-full"/>
              </FF>
            </FormGrid>
          </div>
        )}
      </Modal>
    </div>
  );
}
