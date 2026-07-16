import { useState } from "react";
import { Search, RefreshCw, Settings, CheckCircle } from "lucide-react";
import { Pager, Modal, FormGrid, FF, FI, FS, FTA, FSec, DetailRow, ModalFooter } from "../ui";

const maintData2 = [
  { id:1, orderNo:"JYWB2026051598", result:"合格",  maintainer:"李明",  time:"2026-05-15", devCode:"TZ-SB-004", devName:"叉车（内燃平衡）", devType:"特种设备", nextDate:"2026-05-17", status:"未完成" },
  { id:2, orderNo:"JYWB2025100921", result:"不合格", maintainer:"张建国",time:"2025-10-09", devCode:"TZ-SB-005", devName:"叉车（电动）",     devType:"特种设备", nextDate:"2025-10-11", status:"已完成" },
  { id:3, orderNo:"JYWB2026060012", result:"合格",  maintainer:"王芳",  time:"2026-06-01", devCode:"SW-001",    devName:"1号水位传感器",   devType:"水位监测", nextDate:"2026-07-01", status:"已完成" },
  { id:4, orderNo:"JYWB2026060033", result:"合格",  maintainer:"陈志强",time:"2026-06-05", devCode:"PC-001",    devName:"水泵控制终端",    devType:"抽水泵监测",nextDate:"2026-07-05", status:"未完成" },
  { id:5, orderNo:"JYWB2026060045", result:"",      maintainer:"刘海波",time:"2026-06-10", devCode:"GW-001",    devName:"主工业网关",      devType:"网络设备", nextDate:"2026-09-10", status:"未完成" },
  { id:6, orderNo:"JYWB2026060058", result:"合格",  maintainer:"李明",  time:"2026-06-12", devCode:"CAM-006",   devName:"2号门入口摄像头", devType:"视频监控", nextDate:"2026-12-12", status:"已完成" },
  { id:7, orderNo:"JYWB2026060071", result:"不合格", maintainer:"张建国",time:"2026-06-18", devCode:"TZ-SB-008", devName:"起重机",          devType:"特种设备", nextDate:"2026-06-20", status:"已完成" },
  { id:8, orderNo:"JYWB2026060084", result:"",      maintainer:"王芳",  time:"2026-06-25", devCode:"SW-002",    devName:"2号水位传感器",   devType:"水位监测", nextDate:"2026-07-25", status:"未完成" },
];

export function DeviceMaintenancePage() {
  const [addModal,  setAddModal]  = useState(false);
  const [viewModal, setViewModal] = useState<{open:boolean;item?:typeof maintData2[0]}>({open:false});
  const [cfgModal,  setCfgModal]  = useState(false);
  const [planCfg,   setPlanCfg]   = useState(false);
  const [planView,  setPlanView]  = useState(false);

  const [fCode,   setFCode]   = useState("");
  const [fName,   setFName]   = useState("");
  const [fOrder,  setFOrder]  = useState("");
  const [fType,   setFType]   = useState("");
  const [fResult, setFResult] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fDateS,  setFDateS]  = useState("");
  const [fDateE,  setFDateE]  = useState("");

  const filtered = maintData2.filter(d=>{
    if (fCode   && !d.devCode.toLowerCase().includes(fCode.toLowerCase())) return false;
    if (fName   && !d.devName.includes(fName)) return false;
    if (fOrder  && !d.orderNo.includes(fOrder)) return false;
    if (fType   && d.devType !== fType) return false;
    if (fResult && d.result !== fResult) return false;
    if (fStatus && d.status !== fStatus) return false;
    return true;
  });

  const resultCls: Record<string,string> = {
    "合格":   "text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-[12px] font-semibold",
    "不合格": "text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-[12px] font-semibold",
  };
  const statusCls: Record<string,string> = {
    "已完成": "text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-[12px] font-semibold",
    "未完成": "text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-[12px] font-semibold",
  };
  const typeCls: Record<string,string> = {
    "特种设备":  "text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[12px]",
    "水位监测":  "text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-[12px]",
    "抽水泵监测":"text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[12px]",
    "视频监控":  "text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[12px]",
    "网络设备":  "text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[12px]",
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      {/* 搜索区 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex flex-col gap-3 flex-shrink-0">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">设备管理号码</label>
            <input value={fCode} onChange={e=>setFCode(e.target.value)} placeholder="请输入设备管理号码"
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">设备名称</label>
            <input value={fName} onChange={e=>setFName(e.target.value)} placeholder="请输入设备名称"
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">工单号</label>
            <input value={fOrder} onChange={e=>setFOrder(e.target.value)} placeholder="请输入工单号"
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">设备类型</label>
            <select value={fType} onChange={e=>setFType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none cursor-pointer">
              <option value="">请选择设备类型</option>
              <option>特种设备</option><option>水位监测</option><option>抽水泵监测</option><option>视频监控</option><option>网络设备</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">维保结果</label>
            <select value={fResult} onChange={e=>setFResult(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none cursor-pointer">
              <option value="">请选择维保结果</option>
              <option>合格</option><option>不合格</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">维保状态</label>
            <select value={fStatus} onChange={e=>setFStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none cursor-pointer">
              <option value="">请选择维保状态</option>
              <option>已完成</option><option>未完成</option>
            </select>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">维保时间</label>
            <div className="flex items-center gap-2">
              <input type="date" value={fDateS} onChange={e=>setFDateS(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
              <span className="text-gray-400 text-[13px]">至</span>
              <input type="date" value={fDateE} onChange={e=>setFDateE(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-white cursor-pointer hover:opacity-90" style={{background:"#1F53BE"}}>
            <Search size={13}/>搜索
          </button>
          <button onClick={()=>{setFCode("");setFName("");setFOrder("");setFType("");setFResult("");setFStatus("");setFDateS("");setFDateE("");}}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
            <RefreshCw size={13}/>重置
          </button>
          <button onClick={()=>setCfgModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] border text-green-700 border-green-300 bg-green-50 hover:bg-green-100 cursor-pointer">
            <Settings size={13}/>维保检测配置项
          </button>
          <button onClick={()=>setPlanCfg(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] border text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 cursor-pointer">
            <CheckCircle size={13}/>维保计划配置
          </button>
          <button onClick={()=>setPlanView(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] border text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 cursor-pointer">
            <CheckCircle size={13}/>维保计划
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-[13px]" style={{minWidth:"1100px"}}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["序号","工单号","维保结果","维保人","维保时间","设备管理号码","设备名称","设备类型","下次应维保日期","维保状态","操作"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d,i)=>(
                <tr key={d.id} className={`border-b border-gray-100 hover:bg-blue-50/20 transition-colors ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                  <td className="px-4 py-3 text-gray-400 text-[12px]">{i+1}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-gray-600 whitespace-nowrap">{d.orderNo}</td>
                  <td className="px-4 py-3">{d.result ? <span className={resultCls[d.result]}>{d.result}</span> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-gray-700">{d.maintainer}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-[12px]">{d.time}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-gray-500">{d.devCode}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{d.devName}</td>
                  <td className="px-4 py-3"><span className={typeCls[d.devType]||"text-gray-600 text-[12px]"}>{d.devType}</span></td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-[12px]">{d.nextDate}</td>
                  <td className="px-4 py-3"><span className={statusCls[d.status]||""}>{d.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={()=>setViewModal({open:true,item:d})} className="text-[13px] hover:underline cursor-pointer" style={{color:"#1F53BE"}}>详情</button>
                      <button className="text-red-500 text-[13px] hover:underline cursor-pointer">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
          <Pager total={filtered.length}/>
        </div>
      </div>

      {/* 详情 Modal */}
      <Modal open={viewModal.open} onClose={()=>setViewModal(p=>({...p,open:false}))} title="维保记录详情" width="500px"
        footer={<button onClick={()=>setViewModal(p=>({...p,open:false}))} className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">关闭</button>}>
        {viewModal.item && (
          <FSec title="维保信息">
            <DetailRow label="工单号"       value={viewModal.item.orderNo}/>
            <DetailRow label="设备管理号码" value={viewModal.item.devCode}/>
            <DetailRow label="设备名称"     value={viewModal.item.devName}/>
            <DetailRow label="设备类型"     value={viewModal.item.devType}/>
            <DetailRow label="维保人"       value={viewModal.item.maintainer}/>
            <DetailRow label="维保时间"     value={viewModal.item.time}/>
            <DetailRow label="维保结果"     value={viewModal.item.result ? <span className={resultCls[viewModal.item.result]||""}>{viewModal.item.result}</span> : "—"}/>
            <DetailRow label="下次应维保日期" value={viewModal.item.nextDate}/>
            <DetailRow label="维保状态"     value={<span className={statusCls[viewModal.item.status]||""}>{viewModal.item.status}</span>}/>
          </FSec>
        )}
      </Modal>

      {/* 新增维保 Modal */}
      <Modal open={addModal} onClose={()=>setAddModal(false)} title="新增维保记录" width="580px"
        footer={<ModalFooter onCancel={()=>setAddModal(false)} onConfirm={()=>setAddModal(false)} confirmText="提交"/>}>
        <FormGrid cols={2}>
          <FF label="设备管理号码" required><FI placeholder="请输入设备管理号码"/></FF>
          <FF label="设备名称" required><FI placeholder="请输入设备名称"/></FF>
          <FF label="设备类型" required><FS options={["特种设备","水位监测","抽水泵监测","视频监控","网络设备"]}/></FF>
          <FF label="维保人" required><FI placeholder="请输入维保人姓名"/></FF>
          <FF label="维保时间" required><FI type="date"/></FF>
          <FF label="下次应维保日期" required><FI type="date"/></FF>
          <FF label="维保结果" required><FS options={["合格","不合格"]}/></FF>
          <FF label="维保状态" required><FS options={["已完成","未完成"]}/></FF>
          <FF label="备注" full><FTA placeholder="请输入备注信息" rows={3}/></FF>
        </FormGrid>
      </Modal>

      {/* 维保检测配置项 Modal */}
      <Modal open={cfgModal} onClose={()=>setCfgModal(false)} title="维保检测配置项" width="540px"
        footer={<ModalFooter onCancel={()=>setCfgModal(false)} onConfirm={()=>setCfgModal(false)} confirmText="保存配置"/>}>
        <div className="space-y-3">
          {["外观及结构检查","润滑保养","紧固件检查","电气系统检测","液压系统检查","安全装置测试","功能运行测试","清洁保养"].map((item,i)=>(
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-[13px] text-gray-700">{item}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-[12px] text-gray-500 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-blue-600"/>启用
                </label>
                <label className="flex items-center gap-1.5 text-[12px] text-gray-500 cursor-pointer">
                  <input type="checkbox" className="accent-red-600"/>必填
                </label>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* 维保计划配置 Modal */}
      <Modal open={planCfg} onClose={()=>setPlanCfg(false)} title="维保计划配置" width="540px"
        footer={<ModalFooter onCancel={()=>setPlanCfg(false)} onConfirm={()=>setPlanCfg(false)} confirmText="保存"/>}>
        <FormGrid cols={1}>
          <FF label="设备管理号码" required><FI placeholder="请输入设备管理号码"/></FF>
          <FF label="设备名称"><FI placeholder="设备名称（自动带出）" readOnly/></FF>
          <FF label="维保周期" required><FS options={["每月一次","每季度一次","每半年一次","每年一次","自定义"]}/></FF>
          <FF label="计划开始日期" required><FI type="date"/></FF>
          <FF label="责任人" required><FI placeholder="请输入责任人姓名"/></FF>
          <FF label="备注"><FTA placeholder="备注信息" rows={2}/></FF>
        </FormGrid>
      </Modal>

      {/* 维保计划 Modal */}
      <Modal open={planView} onClose={()=>setPlanView(false)} title="维保计划" width="640px"
        footer={<button onClick={()=>setPlanView(false)} className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">关闭</button>}>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["设备号码","设备名称","维保周期","下次维保日期","责任人","状态"].map(h=>(
                <th key={h} className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {maintData2.slice(0,6).map((d,i)=>(
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2.5 font-mono text-[12px] text-gray-500">{d.devCode}</td>
                <td className="px-3 py-2.5 text-gray-800">{d.devName}</td>
                <td className="px-3 py-2.5 text-gray-500">{["每月","每季度","每半年","每月","每年","每季度"][i]}</td>
                <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{d.nextDate}</td>
                <td className="px-3 py-2.5 text-gray-700">{d.maintainer}</td>
                <td className="px-3 py-2.5"><span className={statusCls[d.status]||""}>{d.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}
