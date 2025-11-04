"""Structured layout definitions for PPTX/H5 alignment.

Each layout entry captures the constraints described in `skills/pptx/layout.md`
so downstream scripts can reason about container classes, slot arrangement, and
content rules without parsing the markdown manually.
"""

from dataclasses import dataclass, field
from typing import Dict, List


@dataclass(frozen=True)
class LayoutSlot:
    id: str
    span: str
    notes: str


@dataclass(frozen=True)
class LayoutDefinition:
    name: str
    data_attribute: str
    container_class: str
    description: str
    rules: List[str] = field(default_factory=list)
    slots: List[LayoutSlot] = field(default_factory=list)


LAYOUT_DEFINITIONS: Dict[str, LayoutDefinition] = {
    "2col-1-1": LayoutDefinition(
        name="二等分布局",
        data_attribute="2col-1-1",
        container_class="grid grid-cols-2 gap-4 h-full",
        description="两个等宽区块组成的对称布局，适合放置文本+图表的组合。",
        rules=[
            "A/B 两个槽位需使用不同元素类型（如一侧卡片、一侧图表）",
            "总模块数不得超过 2",
        ],
        slots=[
            LayoutSlot(id="A", span="1/2", notes="左侧主块，支持卡片、图表或图片"),
            LayoutSlot(id="B", span="1/2", notes="右侧主块，元素类型需与 A 不同"),
        ],
    ),
    "2col-2-1": LayoutDefinition(
        name="主次分栏布局",
        data_attribute="2col-2-1",
        container_class="grid grid-cols-3 gap-4 h-full",
        description="左右 2:1 的主次分栏布局，突出核心信息与辅助说明。",
        rules=[
            "主区建议放置核心图表或重点论述",
            "辅区用于说明性图片、要点卡片或补充信息",
        ],
        slots=[
            LayoutSlot(id="A", span="col-span-2", notes="主区，占 2/3 宽度"),
            LayoutSlot(id="B", span="col-span-1", notes="辅区，占 1/3 宽度"),
        ],
    ),
    "3col-1-1-1": LayoutDefinition(
        name="三等分布局",
        data_attribute="3col-1-1-1",
        container_class="grid grid-cols-3 gap-4 h-full",
        description="三个等宽列并列的布局，适合展示 3 个要点或图文。",
        rules=[
            "最多只允许 1 个图表模块",
            "所有卡片需保持对齐，间距一致",
        ],
        slots=[
            LayoutSlot(id="col-1", span="1/3", notes="第一列"),
            LayoutSlot(id="col-2", span="1/3", notes="第二列"),
            LayoutSlot(id="col-3", span="1/3", notes="第三列"),
        ],
    ),
    "grid-2x2": LayoutDefinition(
        name="四象限布局",
        data_attribute="grid-2x2",
        container_class="grid grid-cols-2 grid-rows-2 gap-4 h-full",
        description="2×2 的象限布局，展示四个并列模块。",
        rules=[
            "禁止在同页同时使用图表与图片，需保持元素类型一致",
            "四个模块尺寸、对齐方式需完全相同",
        ],
        slots=[
            LayoutSlot(id="q1", span="1/4", notes="左上象限"),
            LayoutSlot(id="q2", span="1/4", notes="右上象限"),
            LayoutSlot(id="q3", span="1/4", notes="左下象限"),
            LayoutSlot(id="q4", span="1/4", notes="右下象限"),
        ],
    ),
    "combo-1-2-stack": LayoutDefinition(
        name="左 1/2 + 右上下堆叠布局",
        data_attribute="combo-1-2-stack",
        container_class="grid grid-cols-2 gap-4 h-full",
        description="左侧大区块 + 右侧上下双区块的组合布局。",
        rules=[
            "左侧通常放图表或大图，右侧上下分别放文字或要点",
            "右侧上下区块需使用一致的宽度与留白",
        ],
        slots=[
            LayoutSlot(id="left", span="1/2", notes="左侧主内容区"),
            LayoutSlot(id="right-top", span="1/4", notes="右上辅助区"),
            LayoutSlot(id="right-bottom", span="1/4", notes="右下辅助区"),
        ],
    ),
    "2col-1-2": LayoutDefinition(
        name="左 1/3 + 右 2/3 布局",
        data_attribute="2col-1-2",
        container_class="grid grid-cols-3 gap-4 h-full",
        description="左辅右主的 1:2 分栏，用于图例+主体内容的组合。",
        rules=[
            "左侧 1/3 可放标题卡片、图例或引导信息",
            "右侧 2/3 放核心图表、文字模块或媒体内容",
        ],
        slots=[
            LayoutSlot(id="left", span="col-span-1", notes="左侧辅助区"),
            LayoutSlot(id="right", span="col-span-2", notes="右侧主体区"),
        ],
    ),
}


