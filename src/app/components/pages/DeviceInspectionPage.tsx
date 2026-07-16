import { useState } from "react";
import { Search, RefreshCw, Settings, Plus } from "lucide-react";
import { Pager, Modal, FormGrid, FF, FI, FS, FTA, FSec, DetailRow, ModalFooter } from "../ui";

const inspectionData2 = [
  { id:1, orderNo:"JYXJ2025092747", result:"合格", inspector:"李明", time:"2025-09-27 09:51:17", devCode:"TZ-SB-006", devName:"储气罐",     devType:"特种设备", imgColor:"bg-blue-200" },
  { id:2, orderNo:"JYXJ2025092748", result:"合格", inspector:"张建国", time:"2025-09-27 11:20:05", devCode:"TZ-SB-007", devName:"压力容器",   devType:"特种设备", imgColor:"bg-slate-200" },
  { id:3, orderNo:"JYXJ2025092749", result:"不合格", inspector:"王芳",  time:"2025-09-27 14:08:33", devCode:"SW-001",    devName:"1号水位传感器", devType:"水位监测", imgColor:"bg-gray-200" },
  { id:4, orderNo:"JYXJ2025092750", result:"合格", inspector:"陈志强", time:"2025-09-28 08:45:00", devCode:"PC-2026-001",devName:"水泵控制终端", devType:"抽水泵监测",imgColor:"bg-blue-300" },
  { id:5, orderNo:"JYXJ2025092751", result:"合格", inspector:"李明",   time:"2025-09-28 10:30:22", devCode:"CAM-006",   devName:"2号门入口摄像头", devType:"视频监控",  imgColor:"bg-indigo-200" },
  { id:6, orderNo:"JYXJ2025092752", result:"不合格", inspector:"刘海波", time:"2025-09-29 09:10:44", devCode:"GW-001",    devName:"主工业网关",  devType:"网络设备",  imgColor:"bg-gray-300" },
  { id:7, orderNo:"JYXJ2025092753", result:"合格", inspector:"张建国", time:"2025-09-29 11:55:18", devCode:"TZ-SB-008", devName:"起重机",     devType:"特种设备", imgColor:"bg-orange-200" },
  { id:8, orderNo:"JYXJ2025092754", result:"合格", inspector:"王芳",   time:"2025-09-30 08:20:00", devCode:"SW-002",    devName:"2号水位传感器", devType:"水位监测", imgColor:"bg-blue-100" },
];

export function DeviceInspectionPage() {
  const [addModal,  setAddModal]  = useState(false);
  const [viewModal, setViewModal] = useState<{open:boolean;item?:typeof inspectionData2[0]}>({open:false});
  const [cfgModal,  setCfgModal]  = useState(false);

  const [fCode,    setFCode]    = useState("");
  const [fName,    setFName]    = useState("");
  const [fOrderNo, setFOrderNo] = useState("");
  const [fType,    setFType]    = useState("");
  const [fResult,  setFResult]  = useState("");
  const [fInsp,    setFInsp]    = useState("");
  const [fDateS,   setFDateS]   = useState("");
  const [fDateE,   setFDateE]   = useState("");

  const filtered = inspectionData2.filter(d=>{
    if (fCode    && !d.devCode.toLowerCase().includes(fCode.toLowerCase())) return false;
    if (fName    && !d.devName.includes(fName)) return false;
    if (fOrderNo && !d.orderNo.includes(fOrderNo)) return false;
    if (fType    && d.devType !== fType) return false;
    if (fResult  && d.result !== fResult) return false;
    if (fInsp    && !d.inspector.includes(fInsp)) return false;
    return true;
  });

  const resultCls: Record<string,string> = {
    "合格":   "text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-[12px] font-semibold",
    "不合格": "text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[12px] font-semibold",
  };
  const typeCls: Record<string,string> = {
    "特种设备": "text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[12px]",
    "水位监测": "text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-[12px]",
    "抽水泵监测":"text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[12px]",
    "视频监控": "text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[12px]",
    "网络设备": "text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[12px]",
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      {/* 搜索区 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex flex-col gap-3 flex-shrink-0">
        {/* 第一行 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">设备管理号码</label>
            <input value={fCode} onChange={e=>setFCode(e.target.value)} placeholder="请输入设备名称"
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">设备名称</label>
            <input value={fName} onChange={e=>setFName(e.target.value)} placeholder="请输入设备名称"
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">工单号</label>
            <input value={fOrderNo} onChange={e=>setFOrderNo(e.target.value)} placeholder="请输入工单号"
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
        {/* 第二行 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">巡检结果</label>
            <select value={fResult} onChange={e=>setFResult(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none cursor-pointer">
              <option value="">请选择巡检结果</option>
              <option>合格</option><option>不合格</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">巡检人</label>
            <input value={fInsp} onChange={e=>setFInsp(e.target.value)} placeholder="请输入巡检人"
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-[12px] text-gray-500">巡检时间</label>
            <div className="flex items-center gap-2">
              <input type="date" value={fDateS} onChange={e=>setFDateS(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
              <span className="text-gray-400 text-[13px]">–</span>
              <input type="date" value={fDateE} onChange={e=>setFDateE(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"/>
            </div>
          </div>
        </div>
        {/* 按钮行 */}
        <div className="flex items-center gap-2 pt-1">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-white cursor-pointer hover:opacity-90" style={{background:"#1F53BE"}}>
            <Search size={13}/>搜索
          </button>
          <button onClick={()=>{setFCode("");setFName("");setFOrderNo("");setFType("");setFResult("");setFInsp("");setFDateS("");setFDateE("");}}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
            <RefreshCw size={13}/>重置
          </button>
          <button onClick={()=>setCfgModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] border text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 cursor-pointer">
            <Settings size={13}/>检测项配置
          </button>
          <button onClick={()=>setAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-white cursor-pointer hover:opacity-90" style={{background:"#22c55e"}}>
            <Plus size={13}/>新增巡检
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-[13px]" style={{minWidth:"1000px"}}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["序号","工单号","巡检结果","巡检人","巡检时间","设备管理号码","设备名称","设备类型","巡检照片","操作"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d,i)=>(
                <tr key={d.id} className={`border-b border-gray-100 hover:bg-blue-50/20 transition-colors ${i%2===0?"bg-white":"bg-gray-50/20"}`}>
                  <td className="px-4 py-3 text-gray-400 text-[12px]">{i+1}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-gray-600 whitespace-nowrap">{d.orderNo}</td>
                  <td className="px-4 py-3"><span className={resultCls[d.result]||""}>{d.result}</span></td>
                  <td className="px-4 py-3 text-gray-700">{d.inspector}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-[12px]">{d.time}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-gray-500">{d.devCode}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{d.devName}</td>
                  <td className="px-4 py-3"><span className={typeCls[d.devType]||"text-gray-600 text-[12px]"}>{d.devType}</span></td>
                  <td className="px-4 py-3">
                    <div className={`w-14 h-10 rounded-md ${d.imgColor} flex items-center justify-center overflow-hidden`}>
                      <span className="text-[10px] text-gray-400">照片</span>
                    </div>
                  </td>
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

      {/* 新增巡检 Modal */}
      <Modal open={addModal} onClose={()=>setAddModal(false)} title="新增巡检记录" width="580px"
        footer={<ModalFooter onCancel={()=>setAddModal(false)} onConfirm={()=>setAddModal(false)} confirmText="提交"/>}>
        <FormGrid cols={2}>
          <FF label="设备管理号码" required><FI placeholder="请输入设备管理号码"/></FF>
          <FF label="设备名称" required><FI placeholder="请输入设备名称"/></FF>
          <FF label="设备类型" required><FS options={["特种设备","水位监测","抽水泵监测","视频监控","网络设备"]}/></FF>
          <FF label="巡检人" required><FI placeholder="请输入巡检人姓名"/></FF>
          <FF label="巡检时间" required><FI type="datetime-local"/></FF>
          <FF label="巡检结果" required><FS options={["合格","不合格"]}/></FF>
          <FF label="发现问题" full><FTA placeholder="请描述巡检中发现的问题（无问题可填'无'）" rows={3}/></FF>
          <FF label="巡检照片" full><FI type="file" accept="image/*"/></FF>
        </FormGrid>
      </Modal>

      {/* 详情 Modal */}
      <Modal open={viewModal.open} onClose={()=>setViewModal(p=>({...p,open:false}))} title="巡检记录详情" width="500px"
        footer={<button onClick={()=>setViewModal(p=>({...p,open:false}))} className="px-4 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer">关闭</button>}>
        {viewModal.item && (
          <FSec title="巡检信息">
            <DetailRow label="工单号"      value={viewModal.item.orderNo}/>
            <DetailRow label="设备管理号码" value={viewModal.item.devCode}/>
            <DetailRow label="设备名称"    value={viewModal.item.devName}/>
            <DetailRow label="设备类型"    value={viewModal.item.devType}/>
            <DetailRow label="巡检人"      value={viewModal.item.inspector}/>
            <DetailRow label="巡检时间"    value={viewModal.item.time}/>
            <DetailRow label="巡检结果"    value={<span className={resultCls[viewModal.item.result]||""}>{viewModal.item.result}</span>}/>
          </FSec>
        )}
      </Modal>

      {/* 检测项配置 Modal */}
      <Modal open={cfgModal} onClose={()=>setCfgModal(false)} title="检测项配置" width="540px"
        footer={<ModalFooter onCancel={()=>setCfgModal(false)} onConfirm={()=>setCfgModal(false)} confirmText="保存配置"/>}>
        <div className="space-y-3">
          {["外观检查","功能测试","连接状态","数据上报","设备编号核对","安全防护检查","润滑及清洁"].map((item,i)=>(
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-[13px] text-gray-700">{item}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-[12px] text-gray-500 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-blue-600"/> 启用
                </label>
                <label className="flex items-center gap-1.5 text-[12px] text-gray-500 cursor-pointer">
                  <input type="checkbox" className="accent-red-600"/> 必填
                </label>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
