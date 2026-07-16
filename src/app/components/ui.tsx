import { useState } from "react";
import { X, MonitorCheck } from "lucide-react";

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
export function StatusTag({ status }: { status: string }) {
  const map: Record<string, string> = {
    "进行中": "bg-blue-100 text-blue-700", "施工中": "bg-blue-100 text-blue-700",
    "已完成": "bg-green-100 text-green-700", "未开始": "bg-gray-100 text-gray-500",
    "暂停": "bg-orange-100 text-orange-700", "在线": "bg-green-100 text-green-700",
    "离线": "bg-gray-100 text-gray-500", "正常": "bg-green-100 text-green-700",
    "超限": "bg-red-100 text-red-700", "偏高": "bg-orange-100 text-orange-700",
    "异常": "bg-red-100 text-red-700", "数据异常": "bg-red-100 text-red-700",
    "未处理": "bg-gray-100 text-gray-500", "处理中": "bg-yellow-100 text-yellow-700",
    "已关闭": "bg-green-100 text-green-700", "已解除": "bg-green-100 text-green-700",
    "重大": "bg-red-100 text-red-700", "较大": "bg-orange-100 text-orange-700",
    "一般": "bg-blue-100 text-blue-700", "轻微": "bg-gray-100 text-gray-500",
    "延期预警": "bg-red-100 text-red-700", "临期预警": "bg-orange-100 text-orange-700",
    "进度滞后": "bg-yellow-100 text-yellow-700", "启用": "bg-green-100 text-green-700",
    "停用": "bg-gray-100 text-gray-500", "未更新": "bg-slate-100 text-slate-500",
    "重大预警": "bg-red-100 text-red-700", "较大预警": "bg-orange-100 text-orange-700",
    "一般预警": "bg-blue-100 text-blue-700", "待处理": "bg-orange-100 text-orange-600",
    "一级风险": "bg-red-100 text-red-700", "二级风险": "bg-orange-100 text-orange-700",
    "三级风险": "bg-yellow-100 text-yellow-700", "四级风险": "bg-blue-100 text-blue-700",
    "管控中": "bg-blue-100 text-blue-700", "待落实": "bg-yellow-100 text-yellow-700",
    "已落实": "bg-green-100 text-green-700", "已闭环": "bg-gray-100 text-gray-500",
    "超期": "bg-red-100 text-red-700", "临期": "bg-orange-100 text-orange-700",
    "运行中": "bg-green-100 text-green-700", "停止": "bg-gray-100 text-gray-500",
    "故障": "bg-red-100 text-red-700", "待确认": "bg-orange-100 text-orange-700",
    "已确认": "bg-blue-100 text-blue-700", "已处置": "bg-green-100 text-green-700",
    "已忽略": "bg-gray-100 text-gray-500", "真实违规": "bg-red-100 text-red-700",
    "误报": "bg-gray-100 text-gray-500", "无法判断": "bg-yellow-100 text-yellow-700",
    "预警": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

export function CustomStatusTag({ status, type }: { status: string; type?: string }) {
  const map: Record<string, string> = {
    "进行中": "bg-blue-100 text-blue-700", "施工中": "bg-blue-100 text-blue-700",
    "已完成": "bg-green-100 text-green-700", "未开始": "bg-gray-100 text-gray-500",
    "已延期": "bg-red-100 text-red-700",
    "未按期开工": "bg-orange-100 text-orange-700",
    "临期未完成": "bg-yellow-100 text-yellow-700",
    "重大": "bg-red-100 text-red-700", "较大": "bg-orange-100 text-orange-700",
    "一般": "bg-blue-100 text-blue-700",
    "未处理": "bg-gray-100 text-gray-500", "处理中": "bg-yellow-100 text-yellow-700",
    "已处理": "bg-blue-100 text-blue-700", "已关闭": "bg-green-100 text-green-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#1F53BE] rounded-full transition-all duration-500" style={{ width: `${value}%` }}/>
      </div>
      <span className="text-xs text-gray-500 w-10 text-right">{value}%</span>
    </div>
  );
}

export function StatCard({ title, value, unit, footer, iconBg, icon }: { title: string; value: string | number; unit?: string; footer: string; iconBg: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-slate-500 font-medium">{title}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-slate-900 leading-tight">
        {value}{unit && <span className="text-xs font-normal text-slate-400 ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-slate-400 pt-1.5 border-t border-slate-50">{footer}</div>
    </div>
  );
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex-shrink-0">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">{children}</div>
    </div>
  );
}

export function FItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[13px] text-slate-500 whitespace-nowrap">{label}</label>
      {children}
    </div>
  );
}

export function Inp({ placeholder, w = "w-32" }: { placeholder?: string; w?: string }) {
  return <input type="text" placeholder={placeholder} className={`px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 ${w} focus:outline-none focus:border-blue-500`} />;
}

export function Sel({ options, w = "w-36" }: { options: string[]; w?: string }) {
  return (
    <select className={`px-3 py-1.5 border border-gray-200 rounded-md text-[13px] text-gray-700 ${w} focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer`}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

export function Btn({ variant = "default", children, onClick }: { variant?: "primary" | "default" | "danger"; children: React.ReactNode; onClick?: () => void }) {
  const v = { primary: "bg-[#0052cc] text-white border-[#0052cc] hover:bg-[#0044a8]", default: "bg-white text-gray-600 border-gray-200 hover:bg-gray-50", danger: "bg-red-600 text-white border-red-600 hover:bg-red-700" }[variant];
  return <button onClick={onClick} className={`inline-flex items-center gap-1.5 border rounded-md px-3 py-1.5 text-[13px] font-medium cursor-pointer transition-colors whitespace-nowrap ${v}`}>{children}</button>;
}

export function TableCard({ title, actions, children, pagination }: { title: string; actions?: React.ReactNode; children: React.ReactNode; pagination?: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl flex flex-col flex-1 overflow-hidden min-h-0">
      <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <span className="text-[15px] font-semibold text-gray-800">{title}</span>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
      {pagination && (
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 flex-shrink-0">{pagination}</div>
      )}
    </div>
  );
}

export function DTable({ headers, rows }: { headers: { label: string; width?: string }[]; rows: React.ReactNode[][] }) {
  const minW = headers.reduce((a, h) => a + parseInt(h.width ?? "100"), 0);
  return (
    <table className="w-full border-collapse" style={{ minWidth: `${minW}px` }}>
      <thead>
        <tr>{headers.map((h, i) => <th key={i} style={{ width: h.width }} className="bg-slate-50 px-4 py-2.5 text-left text-xs font-semibold text-slate-500 border-b border-gray-200 sticky top-0 z-10 whitespace-nowrap">{h.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="hover:bg-slate-50 transition-colors">
            {row.map((cell, ci) => <td key={ci} className="px-4 py-2.5 text-[13px] text-gray-700 border-b border-gray-100">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Pager({ total }: { total: number }) {
  return <>
    <span className="text-xs text-slate-400 mr-2">共 {total} 条</span>
    <button className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-500 hover:bg-gray-50 cursor-pointer">上一页</button>
    <button className="px-3 py-1 text-xs border rounded bg-[#0052cc] text-white border-[#0052cc]">1</button>
    <button className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-500 hover:bg-gray-50 cursor-pointer">下一页</button>
  </>;
}

export function Actions({ items }: { items: { label: string; danger?: boolean }[] }) {
  return (
    <div className="flex gap-2">
      {items.map(it => (
        <button key={it.label} className={`text-[13px] hover:underline cursor-pointer ${it.danger ? "text-red-500" : "text-[#0052cc]"}`}>{it.label}</button>
      ))}
    </div>
  );
}

export function PlaceholderPage({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <MonitorCheck size={32} className="text-blue-400" />
        </div>
        <p className="text-lg font-semibold text-slate-700 mb-1">{title}</p>
        <p className="text-sm text-slate-400 max-w-xs">{desc}</p>
      </div>
    </div>
  );
}

// ─── MODAL & FORM COMPONENTS ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, width = "560px", children, footer }: {
  open: boolean; onClose: () => void; title: string; width?: string;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"/>
      <div className="relative bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]" style={{ width }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <span className="text-base font-semibold text-gray-800">{title}</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-colors">
            <X size={16}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

export function FormGrid({ cols = 2, children }: { cols?: number; children: React.ReactNode }) {
  return <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>{children}</div>;
}

export function FF({ label, required, full, children }: { label: string; required?: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "col-span-2" : ""}`}>
      <label className="text-[13px] font-medium text-slate-600">
        {required && <span className="text-red-500 mr-1">*</span>}{label}
      </label>
      {children}
    </div>
  );
}

export function FI({ placeholder, defaultValue, type = "text", disabled }: { placeholder?: string; defaultValue?: string; type?: string; disabled?: boolean }) {
  return <input type={type} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400 w-full"/>;
}

export function FS({ options, defaultValue }: { options: string[]; defaultValue?: string }) {
  return (
    <select defaultValue={defaultValue} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 appearance-none bg-white w-full cursor-pointer">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

export function MultiSelect({ options, value, onChange }: { options: string[]; value: string[]; onChange: (vals: string[]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        onClick={()=>setOpen(!open)} 
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 appearance-none bg-white flex items-center justify-between cursor-pointer"
      >
        <span className={value.length > 0 ? "text-gray-700" : "text-gray-400"}>
          {value.length > 0 ? value.join("、") : "请选择适用对象"}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {options.map(opt => (
            <label key={opt} className={`flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer ${value.includes(opt) ? "bg-blue-50" : "hover:bg-gray-50"}`}>
              <input type="checkbox" checked={value.includes(opt)} onChange={(e)=>{
                const newVals = e.target.checked ? [...value, opt] : value.filter(v=>v!==opt);
                onChange(newVals);
              }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"/>
              <span className={value.includes(opt) ? "text-blue-700 font-medium" : "text-gray-700"}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function FTA({ placeholder, rows = 3, defaultValue }: { placeholder?: string; rows?: number; defaultValue?: string }) {
  return <textarea rows={rows} defaultValue={defaultValue} placeholder={placeholder} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 resize-y w-full"/>;
}

export function FSec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[13px] font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">{title}</div>
      {children}
    </div>
  );
}

export function DetailRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex py-2 border-b border-gray-50">
      <span className="w-28 flex-shrink-0 text-[13px] text-slate-400">{label}</span>
      <span className={`text-[13px] flex-1 ${highlight ? "text-red-600 font-medium" : "text-gray-700"}`}>{value}</span>
    </div>
  );
}

export function ModalFooter({ onCancel, onConfirm, confirmText = "确定", confirmVariant = "primary" }: {
  onCancel: () => void; onConfirm: () => void; confirmText?: string; confirmVariant?: "primary" | "danger";
}) {
  return <>
    <Btn onClick={onCancel}>取消</Btn>
    <Btn variant={confirmVariant} onClick={onConfirm}>{confirmText}</Btn>
  </>;
}

export function Drawer({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"/>
      <div className="relative ml-auto bg-white w-[480px] h-full flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <span className="text-base font-semibold text-gray-800">{title}</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-colors">
            <X size={16}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export interface PrototypeNote {
  id: string;
  type: "field" | "status" | "rule" | "interaction";
  number: number;
  title: string;
  description: string;
}

const prototypeNoteColors: Record<PrototypeNote["type"], string> = {
  field: "bg-blue-100 text-blue-700 border-blue-200",
  status: "bg-green-100 text-green-700 border-green-200",
  rule: "bg-amber-100 text-amber-700 border-amber-200",
  interaction: "bg-purple-100 text-purple-700 border-purple-200",
};

const prototypeNoteLabels: Record<PrototypeNote["type"], string> = {
  field: "字段",
  status: "状态",
  rule: "规则",
  interaction: "交互",
};

export function PrototypeNoteTag({ note, show = true, position = "top-right" }: {
  note: PrototypeNote;
  show?: boolean;
  position?: "top-right" | "inline" | "after";
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  if (!show) return null;
  const label = `${prototypeNoteLabels[note.type]}${String(note.number).padStart(2, "0")}`;
  const color = prototypeNoteColors[note.type];

  const TagElement = (
    <span
      className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${color} cursor-pointer flex-shrink-0 hover:opacity-80 transition-opacity select-none`}
      onClick={(e) => { e.stopPropagation(); setDetailOpen(true); }}
    >
      {label}
    </span>
  );

  if (position === "inline") {
    return (
      <>
        {TagElement}
        {detailOpen && (
          <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={note.title} width="480px"
            footer={
              <button onClick={() => setDetailOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#1F53BE] text-white text-[13px] hover:bg-blue-700 cursor-pointer">我知道了</button>
            }>
            <div className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
              {note.description}
            </div>
          </Modal>
        )}
      </>
    );
  }
  if (position === "after") {
    return (
      <>
        <span className="ml-1 flex-shrink-0">{TagElement}</span>
        {detailOpen && (
          <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={note.title} width="480px"
            footer={
              <button onClick={() => setDetailOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#1F53BE] text-white text-[13px] hover:bg-blue-700 cursor-pointer">我知道了</button>
            }>
            <div className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
              {note.description}
            </div>
          </Modal>
        )}
      </>
    );
  }
  return (
    <>
      <span
        className={`absolute -top-1.5 -right-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded border ${color} cursor-pointer z-10 shadow-sm hover:opacity-80 transition-opacity select-none`}
        onClick={(e) => { e.stopPropagation(); setDetailOpen(true); }}
      >
        {label}
      </span>
      {detailOpen && (
        <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={note.title} width="480px"
          footer={
            <button onClick={() => setDetailOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-[#1F53BE] text-white text-[13px] hover:bg-blue-700 cursor-pointer">我知道了</button>
          }>
          <div className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
            {note.description}
          </div>
        </Modal>
      )}
    </>
  );
}
