import { useState } from "react";
import { Users, CheckCircle, Clock, XCircle, AlertTriangle, Search, RefreshCw, Download } from "lucide-react";
import {
  StatCard, FilterBar, FItem, Inp, Sel, Btn,
  TableCard, DTable, Pager, StatusTag,
  Modal, FormGrid, FF, FI, FS, FTA, ModalFooter,
} from "../ui";

const attendanceData = [
  { id: 1, date: "2026/7/6", name: "张建国", team: "钢筋班组", unit: "中铁二十四局", inTime: "07:28:15", outTime: "18:05:32", hours: 10.6, status: "正常", overtime: 0.6 },
  { id: 2, date: "2026/7/6", name: "李明", team: "混凝土班组", unit: "中建一局", inTime: "07:55:10", outTime: "18:00:05", hours: 10.1, status: "正常", overtime: 0.1 },
  { id: 3, date: "2026/7/6", name: "王芳", team: "管理人员", unit: "中铁建设", inTime: "08:01:22", outTime: "17:58:48", hours: 9.96, status: "正常", overtime: 0 },
  { id: 4, date: "2026/7/6", name: "陈志强", team: "模板班组", unit: "中铁二十四局", inTime: "07:30:00", outTime: "--", hours: 0, status: "未打卡出", overtime: 0 },
  { id: 5, date: "2026/7/6", name: "刘海波", team: "架子班组", unit: "中建一局", inTime: "09:15:33", outTime: "17:45:20", hours: 8.5, status: "迟到", overtime: 0 },
  { id: 6, date: "2026/7/6", name: "孙丽", team: "管理人员", unit: "中铁建设", inTime: "08:00:05", outTime: "18:30:00", hours: 10.5, status: "正常", overtime: 0.5 },
  { id: 7, date: "2026/7/6", name: "吴建平", team: "水电班组", unit: "中铁二十四局", inTime: "07:45:18", outTime: "17:50:30", hours: 10.1, status: "正常", overtime: 0.1 },
  { id: 8, date: "2026/7/6", name: "郑伟", team: "混凝土班组", unit: "中建一局", inTime: "--", outTime: "--", hours: 0, status: "缺勤", overtime: 0 },
];

export function AttendancePage() {
  const today = attendanceData;
  const normal = today.filter(d => d.status === "正常").length;
  const late = today.filter(d => d.status === "迟到").length;
  const absent = today.filter(d => d.status === "缺勤").length;
  const [corrModal, setCorrModal] = useState<{open:boolean;item?:typeof attendanceData[0]}>({open:false});
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-3 flex-shrink-0">
        <StatCard title="今日应到" value={today.length} footer="人" iconBg="bg-blue-100" icon={<Users size={18} className="text-blue-600"/>}/>
        <StatCard title="正常出勤" value={normal} footer="人" iconBg="bg-green-100" icon={<CheckCircle size={18} className="text-green-600"/>}/>
        <StatCard title="迟到" value={late} footer="人" iconBg="bg-orange-100" icon={<Clock size={18} className="text-orange-600"/>}/>
        <StatCard title="缺勤" value={absent} footer="人" iconBg="bg-red-100" icon={<XCircle size={18} className="text-red-600"/>}/>
        <StatCard title="未打卡出" value={today.filter(d=>d.status==="未打卡出").length} footer="人" iconBg="bg-yellow-100" icon={<AlertTriangle size={18} className="text-yellow-600"/>}/>
      </div>
      <FilterBar>
        <FItem label="日期"><input type="date" defaultValue="2026-07-06" className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] focus:outline-none"/></FItem>
        <FItem label="姓名"><Inp placeholder="请输入姓名"/></FItem>
        <FItem label="班组"><Sel options={["全部班组","钢筋班组","混凝土班组","木工班组","架子班组","管理人员","水电班组"]}/></FItem>
        <FItem label="所属单位"><Sel options={["全部单位","中铁二十四局","中建一局","中铁建设","中建三局"]}/></FItem>
        <FItem label="考勤状态"><Sel options={["全部状态","正常","迟到","缺勤","未打卡出"]}/></FItem>
        <div className="ml-auto flex gap-2"><Btn variant="primary"><Search size={13}/>查询</Btn><Btn><RefreshCw size={13}/>重置</Btn><Btn><Download size={13}/>导出</Btn></div>
      </FilterBar>
      <TableCard title="考勤记录" pagination={<Pager total={today.length}/>}>
        <DTable
          headers={[{label:"序号",width:"60px"},{label:"日期",width:"100px"},{label:"姓名",width:"80px"},{label:"班组",width:"110px"},{label:"所属单位",width:"110px"},{label:"进场时间",width:"110px"},{label:"离场时间",width:"110px"},{label:"工时(h)",width:"90px"},{label:"考勤状态",width:"90px"},{label:"加班时间(h)",width:"100px"},{label:"操作",width:"100px"}]}
          rows={today.map((d,i) => [
            i+1, d.date, <span key="n" className="font-medium">{d.name}</span>,
            d.team, d.unit,
            <span key="in" className={`font-mono text-[13px] ${d.status==="迟到"?"text-orange-600":d.status==="缺勤"?"text-red-600 line-through":""}`}>{d.inTime}</span>,
            <span key="out" className={`font-mono text-[13px] ${d.status==="未打卡出"?"text-red-600":""}`}>{d.outTime}</span>,
            <span key="h" className="font-mono text-[13px]">{d.hours > 0 ? d.hours.toFixed(1) : "--"}</span>,
            <StatusTag key="s" status={d.status}/>,
            <span key="ot" className={`font-mono text-[13px] ${d.overtime > 0 ? "text-orange-600" : "text-slate-400"}`}>{d.overtime > 0 ? `+${d.overtime.toFixed(1)}` : "--"}</span>,
            <div key="a" className="flex gap-2">
              <button onClick={()=>setCorrModal({open:true,item:d})} className="text-[#0052cc] text-[13px] hover:underline cursor-pointer">补录</button>
              <button onClick={()=>setCorrModal({open:true,item:d})} className="text-orange-500 text-[13px] hover:underline cursor-pointer">纠错</button>
            </div>
          ])}
        />
      </TableCard>

      <Modal open={corrModal.open} onClose={()=>setCorrModal({open:false})} title="考勤补录/纠错" footer={<ModalFooter onCancel={()=>setCorrModal({open:false})} onConfirm={()=>setCorrModal({open:false})} confirmText="提交"/>}>
        <FormGrid>
          <FF label="日期" required><FI type="date" defaultValue={corrModal.item?.date.replace(/\//g,"-")}/></FF>
          <FF label="人员姓名" required><FI defaultValue={corrModal.item?.name} disabled/></FF>
          <FF label="进场时间" required><FI type="time" defaultValue={corrModal.item?.inTime==="--"?"":corrModal.item?.inTime?.slice(0,5)}/></FF>
          <FF label="离场时间" required><FI type="time" defaultValue={corrModal.item?.outTime==="--"?"":corrModal.item?.outTime?.slice(0,5)}/></FF>
          <FF label="补录/纠错原因" required><FS options={["忘打卡","设备故障","网络异常","现场确认","其他"]}/></FF>
          <FF label="当前状态"><FI defaultValue={corrModal.item?.status} disabled/></FF>
          <FF label="说明" full><FTA placeholder="请说明补录或纠错的原因，便于审核" rows={3}/></FF>
        </FormGrid>
      </Modal>
    </div>
  );
}
