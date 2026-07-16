import { ChevronRight, ChevronDown, AlertTriangle } from "lucide-react";

interface WbsTreeNode {
  id: string;
  name: string;
  type: string;
  children?: WbsTreeNode[];
  warnId?: string;
  compId?: string;
  hasComp?: boolean;
}

interface WbsTreeProps {
  data: WbsTreeNode[];
  selectedNode: { id: string; name: string; type: string; unit?: string; dept?: string };
  onSelect: (node: WbsTreeNode) => void;
  expandedNodes: Set<string>;
  onToggleExpanded: (id: string) => void;
  searchText?: string;
  showOnlyWarning?: boolean;
  filterType?: string;
  onFilterChange?: (type: string) => void;
}

function WbsTreeItem({
  node,
  level,
  selectedNode,
  onSelect,
  expandedNodes,
  onToggleExpanded,
}: {
  node: WbsTreeNode;
  level: number;
  selectedNode: { id: string; name: string; type: string; unit?: string; dept?: string };
  onSelect: (node: WbsTreeNode) => void;
  expandedNodes: Set<string>;
  onToggleExpanded: (id: string) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNode.id === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpanded(node.id);
  };

  const typeColors: Record<string, string> = {
    project: "bg-blue-100 text-blue-700",
    unit: "bg-green-100 text-green-700",
    dept: "bg-purple-100 text-purple-700",
    comp: "bg-gray-100 text-gray-600",
    item: "bg-orange-100 text-orange-700",
  };

  const typeLabels: Record<string, string> = {
    project: "项目",
    unit: "单位工程",
    dept: "分部工程",
    comp: "构件",
    item: "分项工程",
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center gap-1 px-2 py-1.5 text-sm cursor-pointer transition-colors ${
          isSelected ? "bg-blue-50 text-[#1F53BE]" : "text-gray-700 hover:bg-gray-50"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren && (
          <span
            onClick={handleToggle}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        {!hasChildren && <span className="w-3.5" />}
        <span className="flex-1 truncate">{node.name}</span>
        {node.warnId && <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />}
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium flex-shrink-0 ${typeColors[node.type] || "bg-gray-100 text-gray-600"}`}>
          {typeLabels[node.type] || node.type}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <WbsTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedNode={selectedNode}
              onSelect={onSelect}
              expandedNodes={expandedNodes}
              onToggleExpanded={onToggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function WbsTree({
  data,
  selectedNode,
  onSelect,
  expandedNodes,
  onToggleExpanded,
  searchText = "",
  showOnlyWarning = false,
  filterType = "",
  onFilterChange,
}: WbsTreeProps) {
  const filterNodes = (nodes: WbsTreeNode[]): WbsTreeNode[] => {
    return nodes
      .map((node) => {
        const filteredChildren = node.children ? filterNodes(node.children) : [];
        const hasWarning = node.warnId || filteredChildren.some((c) => c.warnId);
        const matchesSearch = !searchText || node.name.toLowerCase().includes(searchText.toLowerCase());

        if (showOnlyWarning && !hasWarning) return null;
        if (!matchesSearch) return null;

        return {
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : undefined,
        };
      })
      .filter((node): node is WbsTreeNode => node !== null);
  };

  const filteredData = filterNodes(data);

  return (
    <div className="flex-1 overflow-y-auto p-1">
      {filteredData.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-400 text-sm">暂无数据</div>
      ) : (
        filteredData.map((node) => (
          <WbsTreeItem
            key={node.id}
            node={node}
            level={0}
            selectedNode={selectedNode}
            onSelect={onSelect}
            expandedNodes={expandedNodes}
            onToggleExpanded={onToggleExpanded}
          />
        ))
      )}
    </div>
  );
}