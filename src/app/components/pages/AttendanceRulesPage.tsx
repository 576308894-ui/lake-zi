import { useState } from "react";
import { Info, CheckCircle, Save, Clock, Plus, Edit2, Trash2, LogIn, LogOut, Smartphone, AlertTriangle, Timer } from "lucide-react";
import { Modal, Btn, FF, FI, FS } from "../ui";

type ShiftRule = {
  id: number;
  name: string;
  checkIn: string;
  checkOut: string;
  lateGrace: number;    // 迟到宽限(分钟)
  earlyGrace: number;   // 早退宽限(分钟)
  overtimeStart: string; // 加班起算时间
  workdays: boolean[];  // [一,二,三,四,五,六,日]
  enabled: boolean;
};

const defaultShifts: ShiftRule[] = [
  { id: 1, name: "常日班", checkIn: "07:30", checkOut: "18:00", lateGrace: 15, earlyGrace: 10, overtimeStart: "18:30", workdays: [true,true,true,true,true,true,false], enabled: true },
  { id: 2, name: "早班",   checkIn: "06:00", checkOut: "14:00", lateGrace: 10, earlyGrace: 10, overtimeStart: "14:30", workdays: [true,true,true,true,true,true,false], enabled: false },
  { id: 3, name: "晚班",   checkIn: "14:00", checkOut: "22:00", lateGrace: 10, earlyGrace: 10, overtimeStart: "22:30", workdays: [true,true,true,true,true,true,false], enabled: false },
];

const weekLabels = ["一","二","三","四","五","六","日"];

export function AttendanceRulesPage() {
  const [shifts, setShifts] = useState<ShiftRule[]>(defaultShifts);
  const [editModal, setEditModal] = useState<{open:boolean; item?:ShiftRule; isNew?:boolean}>({open:false});
  const [draft, setDraft] = useState<ShiftRule|null>(null);
  const [saved, setSaved] = useState(false);

  // 全局打卡规则
  const [globalRules, setGlobalRules] = useState({
    faceRequired: true,
    gpsRequired: false,
    outsideRange: 200,        // 米
    absentThreshold: 3,       // 连续缺勤N天触发告警
    monthlyAbsentLimit: 5,    // 月度缺勤上限
    overtimeUnit: 0.5,        // 加班计算单位(小时)
    breakTime: 60,            // 午休时长(分钟)
  });

  function openEdit(item: ShiftRule) {
    setDraft({ ...item });
    setEditModal({ open: true, item, isNew: false });
  }
  function openAdd() {
    const newShift: ShiftRule = { id: Date.now(), name: "", checkIn: "07:30", checkOut: "18:00", lateGrace: 15, earlyGrace: 10, overtimeStart: "18:30", workdays: [true,true,true,true,true,false,false], enabled: true };
    setDraft(newShift);
    setEditModal({ open: true, isNew: true });
  }
  function saveShift() {
    if (!draft) return;
    if (editModal.isNew) {
      setShifts(p => [...p, draft]);
    } else {
      setShifts(p => p.map(s => s.id === draft.id ? draft : s));
    }
    setEditModal({ open: false });
  }
  function deleteShift(id: number) {
    setShifts(p => p.filter(s => s.id !== id));
  }
  function toggleEnabled(id: number) {
    setShifts(p => p.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  }
  function handleSaveAll() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50">
        <span className="text-[#0284c7]">{icon}</span>
        <span className="font-semibold text-slate-800 text-[15px]">{title}</span>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const RuleRow = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
      <div>
        <div className="text-[14px] font-medium text-slate-700">{label}</div>
        {hint && <div className="text-[12px] text-slate-400 mt-0.5">{hint}</div>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${value ? "bg-[#0284c7]" : "bg-gray-300"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`}/>
    </button>
  );

  const NumInp = ({ value, onChange, min, max, suffix }: { value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string }) => (
    <div className="flex items-center gap-1.5">
      <input type="number" value={value} min={min} max={max}
        onChange={e => onChange(Number(e.target.value))}
        className="w-20 border border-gray-300 rounded-lg px-2.5 py-1.5 text-[14px] text-center focus:outline-none focus:border-[#0284c7]"/>
      {suffix && <span className="text-[13px] text-slate-500">{suffix}</span>}
    </div>
  );

  const TimeInp = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <input type="time" value={value} onChange={e => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-[14px] focus:outline-none focus:border-[#0284c7]"/>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
      {/* 顶部提示栏 */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-5 py-3.5">
        <div className="flex items-center gap-2.5 text-[13px] text-blue-700">
          <Info size={16} className="flex-shrink-0"/>
          <span>考勤规则修改后立即对所有班组生效，历史数据不受影响。如需调整个别人员，请在人员信息中单独配置。</span>
        </div>
        <button onClick={handleSaveAll}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-[13px] font-medium text-white cursor-pointer transition-all ${saved ? "bg-green-500" : "bg-[#0284c7] hover:bg-[#0369a1]"}`}>
          {saved ? <><CheckCircle size={14}/>已保存</> : <><Save size={14}/>保存所有规则</>}
        </button>
      </div>

      {/* 班次管理 */}
      <SectionCard title="班次管理" icon={<Clock size={18}/>}>
        <div className="flex justify-between items-center mb-4">
          <p className="text-[13px] text-slate-500">共 {shifts.length} 个班次，启用 {shifts.filter(s=>s.enabled).length} 个</p>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0284c7] text-white text-[13px] font-medium rounded-lg hover:bg-[#0369a1] transition-colors cursor-pointer">
            <Plus size={14}/>新增班次
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {shifts.map(s => (
            <div key={s.id} className={`rounded-xl border-2 p-4 transition-colors ${s.enabled ? "border-[#0284c7]/30 bg-blue-50/40" : "border-gray-200 bg-gray-50"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Toggle value={s.enabled} onChange={() => toggleEnabled(s.id)}/>
                  <span className="font-semibold text-slate-800 text-[15px]">{s.name}</span>
                  {s.enabled && <span className="text-[11px] bg-[#0284c7] text-white px-2 py-0.5 rounded-full">启用中</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(s)}
                    className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-[#0284c7] border border-[#0284c7]/40 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                    <Edit2 size={12}/>编辑
                  </button>
                  {shifts.length > 1 && (
                    <button onClick={() => deleteShift(s.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-red-500 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition-colors">
                      <Trash2 size={12}/>删除
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <LogIn size={14} className="text-green-500"/>
                    <span className="text-slate-500">上班打卡：</span>
                    <span className="font-mono font-semibold text-slate-800">{s.checkIn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LogOut size={14} className="text-orange-500"/>
                    <span className="text-slate-500">下班打卡：</span>
                    <span className="font-mono font-semibold text-slate-800">{s.checkOut}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-slate-500">迟到宽限：<span className="text-slate-700 font-medium">{s.lateGrace} 分钟</span></div>
                  <div className="text-slate-500">早退宽限：<span className="text-slate-700 font-medium">{s.earlyGrace} 分钟</span></div>
                  <div className="text-slate-500">加班起算：<span className="font-mono text-slate-700 font-medium">{s.overtimeStart}</span></div>
                </div>
                <div className="col-span-2 flex items-center gap-2 mt-1">
                  <span className="text-slate-500">工作日：</span>
                  {weekLabels.map((d, i) => (
                    <span key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium ${s.workdays[i] ? "bg-[#0284c7] text-white" : "bg-gray-200 text-gray-400"}`}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 打卡方式设置 */}
      <SectionCard title="打卡方式设置" icon={<Smartphone size={18}/>}>
        <RuleRow label="人脸识别打卡" hint="开启后，工人必须通过人脸识别完成打卡">
          <Toggle value={globalRules.faceRequired} onChange={v => setGlobalRules(p => ({...p, faceRequired: v}))}/>
        </RuleRow>
        <RuleRow label="GPS定位打卡" hint="开启后，打卡时校验工人是否在施工现场范围内">
          <Toggle value={globalRules.gpsRequired} onChange={v => setGlobalRules(p => ({...p, gpsRequired: v}))}/>
        </RuleRow>
        {globalRules.gpsRequired && (
          <RuleRow label="允许打卡范围" hint="超出范围的打卡记录标记为异常">
            <NumInp value={globalRules.outsideRange} onChange={v => setGlobalRules(p => ({...p, outsideRange: v}))} min={50} max={2000} suffix="米"/>
          </RuleRow>
        )}
      </SectionCard>

      {/* 异常规则 */}
      <SectionCard title="异常与告警规则" icon={<AlertTriangle size={18}/>}>
        <RuleRow label="连续缺勤告警" hint="连续缺勤达到设定天数后，自动推送告警至负责人">
          <NumInp value={globalRules.absentThreshold} onChange={v => setGlobalRules(p => ({...p, absentThreshold: v}))} min={1} max={30} suffix="天"/>
        </RuleRow>
        <RuleRow label="月度缺勤上限" hint="单月缺勤超过上限，列入异常人员名单">
          <NumInp value={globalRules.monthlyAbsentLimit} onChange={v => setGlobalRules(p => ({...p, monthlyAbsentLimit: v}))} min={1} max={31} suffix="天"/>
        </RuleRow>
      </SectionCard>

      {/* 加班与工时规则 */}
      <SectionCard title="工时与加班规则" icon={<Timer size={18}/>}>
        <RuleRow label="午休时长" hint="从每日实际在场工时中扣除午休时间">
          <NumInp value={globalRules.breakTime} onChange={v => setGlobalRules(p => ({...p, breakTime: v}))} min={0} max={120} suffix="分钟"/>
        </RuleRow>
        <RuleRow label="加班计算单位" hint="不满单位时长的加班不予计入">
          <div className="flex gap-2">
            {[0.5, 1].map(u => (
              <button key={u} onClick={() => setGlobalRules(p => ({...p, overtimeUnit: u}))}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer transition-colors border ${globalRules.overtimeUnit === u ? "bg-[#0284c7] text-white border-[#0284c7]" : "bg-white text-slate-600 border-gray-300 hover:border-[#0284c7]"}`}>
                {u === 0.5 ? "0.5 小时" : "1 小时"}
              </button>
            ))}
          </div>
        </RuleRow>
      </SectionCard>

      {/* 编辑班次弹窗 */}
      <Modal open={editModal.open} onClose={() => setEditModal({open:false})} title={editModal.isNew ? "新增班次" : "编辑班次"} width="560px"
        footer={<><Btn onClick={() => setEditModal({open:false})}>取消</Btn><Btn variant="primary" onClick={saveShift}>保存</Btn></>}>
        {draft && (
          <div className="flex flex-col gap-4">
            <FF label="班次名称" required>
              <FI placeholder="如：常日班、早班、晚班" value={draft.name} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setDraft(p => p ? {...p, name: e.target.value} : p)}/>
            </FF>
            <div className="grid grid-cols-2 gap-4">
              <FF label="上班打卡时间" required>
                <TimeInp value={draft.checkIn} onChange={v => setDraft(p => p ? {...p, checkIn: v} : p)}/>
              </FF>
              <FF label="下班打卡时间" required>
                <TimeInp value={draft.checkOut} onChange={v => setDraft(p => p ? {...p, checkOut: v} : p)}/>
              </FF>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FF label="迟到宽限(分钟)">
                <FI type="number" value={String(draft.lateGrace)} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setDraft(p => p ? {...p, lateGrace: Number(e.target.value)} : p)}/>
              </FF>
              <FF label="早退宽限(分钟)">
                <FI type="number" value={String(draft.earlyGrace)} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setDraft(p => p ? {...p, earlyGrace: Number(e.target.value)} : p)}/>
              </FF>
              <FF label="加班起算时间">
                <TimeInp value={draft.overtimeStart} onChange={v => setDraft(p => p ? {...p, overtimeStart: v} : p)}/>
              </FF>
            </div>
            <div>
              <div className="text-[13px] font-medium text-slate-700 mb-2">适用工作日</div>
              <div className="flex gap-2">
                {weekLabels.map((d, i) => (
                  <button key={i} onClick={() => setDraft(p => { if(!p) return p; const w=[...p.workdays]; w[i]=!w[i]; return {...p, workdays:w}; })}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium cursor-pointer transition-colors border-2 ${draft.workdays[i] ? "bg-[#0284c7] text-white border-[#0284c7]" : "bg-white text-gray-500 border-gray-300 hover:border-[#0284c7]"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <FF label="是否启用">
              <FS options={["启用","停用"]} value={draft.enabled ? "启用" : "停用"}
                onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setDraft(p => p ? {...p, enabled: e.target.value === "启用"} : p)}/>
            </FF>
          </div>
        )}
      </Modal>
    </div>
  );
}
