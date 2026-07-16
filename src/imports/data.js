var wbsData = {
    name: "淄海铁路项目",
    children: [
        {
            name: "翻车机房",
            children: [
                { name: "地下部分", children: [
                    { name: "地基与基础", children: [
                        { name: "基坑垫层施工", children: [{ name: "垫层一区" }, { name: "垫层二区" }, { name: "垫层三区" }] },
                        { name: "底板施工", children: [{ name: "底板一区" }, { name: "底板二区" }, { name: "底板三区" }] },
                        { name: "承台施工", children: [{ name: "承台一区" }, { name: "承台二区" }, { name: "承台三区" }] },
                        { name: "设备基础施工", children: [{ name: "设备基础一区" }, { name: "设备基础二区" }, { name: "设备基础三区" }] },
                        { name: "集水坑施工", children: [{ name: "集水坑一区" }, { name: "集水坑二区" }] },
                        { name: "预留预埋施工", children: [{ name: "预留洞口" }, { name: "管线预埋" }, { name: "设备预埋件" }] }
                    ]},
                    { name: "地下主体结构", children: [
                        { name: "侧墙施工", children: [{ name: "东侧墙" }, { name: "西侧墙" }, { name: "南侧墙" }, { name: "北侧墙" }] },
                        { name: "内隔墙施工", children: [{ name: "内隔墙一区" }, { name: "内隔墙二区" }] },
                        { name: "顶板施工", children: [{ name: "顶板一区" }, { name: "顶板二区" }, { name: "顶板三区" }] },
                        { name: "梁柱施工", children: [{ name: "地下柱" }, { name: "地下梁" }, { name: "支撑梁" }] },
                        { name: "后浇带施工", children: [{ name: "后浇带一区" }, { name: "后浇带二区" }] },
                        { name: "防水及回填施工", children: [{ name: "外墙防水" }, { name: "顶板防水" }, { name: "基坑回填" }] }
                    ]}
                ]},
                { name: "地上部分", children: [
                    { name: "地上主体结构", children: [
                        { name: "框架柱施工", children: [{ name: "框架柱一区" }, { name: "框架柱二区" }] },
                        { name: "框架梁施工", children: [{ name: "框架梁一区" }, { name: "框架梁二区" }] },
                        { name: "楼板施工", children: [{ name: "楼板一区" }, { name: "楼板二区" }] },
                        { name: "楼梯平台施工", children: [{ name: "楼梯" }, { name: "平台" }] }
                    ]}
                ]},
                { name: "钢结构顶棚", children: [
                    { name: "钢柱安装", children: [{ name: "钢柱一区" }, { name: "钢柱二区" }, { name: "钢柱三区" }] },
                    { name: "钢梁安装", children: [{ name: "主梁一区" }, { name: "主梁二区" }] }
                ]}
            ]
        },
        { name: "地下皮带廊", children: [
            { name: "廊道基础工程", children: [
                { name: "廊道土方开挖", children: [{ name: "起点段开挖" }, { name: "中段开挖" }, { name: "终点段开挖" }] },
                { name: "廊道垫层施工", children: [{ name: "起点段垫层" }, { name: "中段垫层" }, { name: "终点段垫层" }] }
            ]},
            { name: "廊道主体结构", children: [
                { name: "廊道侧墙施工", children: [{ name: "左侧墙起点段" }, { name: "左侧墙中段" }, { name: "左侧墙终点段" }] },
                { name: "廊道顶板施工", children: [{ name: "起点段顶板" }, { name: "中段顶板" }, { name: "终点段顶板" }] }
            ]}
        ]},
        { name: "基坑支护及降水工程", children: [
            { name: "基坑工程", children: [
                { name: "基坑开挖", children: [{ name: "基坑东侧开挖" }, { name: "基坑西侧开挖" }, { name: "基坑南侧开挖" }, { name: "基坑北侧开挖" }] },
                { name: "基坑临边防护", children: [{ name: "临边护栏" }, { name: "警示标识" }, { name: "安全通道" }] }
            ]},
            { name: "支护工程", children: [
                { name: "支护桩施工", children: [{ name: "东侧支护桩" }, { name: "西侧支护桩" }, { name: "南侧支护桩" }, { name: "北侧支护桩" }] },
                { name: "冠梁施工", children: [{ name: "东侧冠梁" }, { name: "西侧冠梁" }] }
            ]}
        ]},
        { name: "监测工程", children: [
            { name: "水位监测", children: [{ name: "水位传感器安装" }, { name: "DTU数据采集" }, { name: "采集箱安装" }, { name: "数据联调" }] },
            { name: "沉降监测", children: [{ name: "沉降点布设" }, { name: "沉降数据采集" }, { name: "沉降数据对接" }] },
            { name: "位移监测", children: [{ name: "位移点布设" }, { name: "位移数据采集" }, { name: "位移数据对接" }] }
        ]},
        { name: "临设及现场辅助工程", children: [
            { name: "临时道路", children: [{ name: "场内主道路" }, { name: "施工便道" }, { name: "车辆通行区" }] },
            { name: "加工及堆场", children: [{ name: "钢筋加工区" }, { name: "材料堆放区" }, { name: "设备堆放区" }] },
            { name: "出入口及围挡", children: [{ name: "车辆出入口" }, { name: "人员出入口" }, { name: "围挡" }] }
        ]}
    ]
};
