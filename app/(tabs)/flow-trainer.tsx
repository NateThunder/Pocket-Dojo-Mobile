import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import Svg, { Line } from "react-native-svg";
import ZoomableContainer from "../../components/ZoomableContainer";

type FlowNode = {
  id: string;
  parentId: string | null;
};

type PositionedNode = FlowNode & {
  x: number;
  y: number;
};

const NODE_WIDTH = 120;
const NODE_HEIGHT = 60;
const H_SPACING = 160;
const V_SPACING = 80;
const START_X = 120;
const START_Y = 120;

export default function FlowTrainer() {
  const [nodes, setNodes] = useState<FlowNode[]>([{ id: "node-1", parentId: null }]);

  const addChild = (parentId: string) => {
    setNodes((prev) => [...prev, { id: `node-${prev.length + 1}`, parentId }]);
  };

  const collectDescendants = (targetId: string, list: FlowNode[]) => {
    const toDelete = new Set<string>([targetId]);
    const queue = [targetId];
    while (queue.length) {
      const current = queue.shift()!;
      list.forEach((node) => {
        if (node.parentId === current) {
          toDelete.add(node.id);
          queue.push(node.id);
        }
      });
    }
    return toDelete;
  };

  const deleteNode = (nodeId: string) => {
    setNodes((prev) => {
      const target = prev.find((node) => node.id === nodeId);
      if (!target) {
        return prev;
      }
      const toDelete = collectDescendants(nodeId, prev);
      // If deleting the root, keep the root but remove all descendants
      if (target.parentId === null) {
        toDelete.delete(nodeId);
      }
      return prev.filter((node) => !toDelete.has(node.id));
    });
  };

  const positionedNodes = useMemo<PositionedNode[]>(() => {
    if (nodes.length === 0) return [];

    const childMap = nodes.reduce<Record<string, string[]>>((acc, node) => {
      if (node.parentId) {
        acc[node.parentId] = acc[node.parentId] ?? [];
        acc[node.parentId].push(node.id);
      }
      return acc;
    }, {});

    const root = nodes.find((node) => node.parentId === null);
    if (!root) return [];

    let nextYIndex = 0;
    const layouts: PositionedNode[] = [];
    const visited = new Set<string>();

    const dfs = (node: FlowNode, depth: number): PositionedNode => {
      if (visited.has(node.id)) {
        // Cycle guard
        const existing = layouts.find((item) => item.id === node.id);
        return existing ?? { ...node, x: START_X, y: START_Y };
      }
      visited.add(node.id);

      const childrenIds = childMap[node.id] ?? [];
      const childLayouts = childrenIds
        .map((childId) => nodes.find((n) => n.id === childId))
        .filter((item): item is FlowNode => Boolean(item) && item.id !== node.id);

      const x = START_X + depth * (NODE_WIDTH + H_SPACING);
      let y: number;

      if (childLayouts.length === 0) {
        y = START_Y + nextYIndex * (NODE_HEIGHT + V_SPACING);
        nextYIndex += 1;
      } else {
        const positionedChildren = childLayouts.map((child) => dfs(child, depth + 1));
        y = positionedChildren.reduce((sum, child) => sum + child.y, 0) / positionedChildren.length;
      }

      const positioned: PositionedNode = { ...node, x, y };
      layouts.push(positioned);
      return positioned;
    };

    dfs(root, 0);
    return layouts;
  }, [nodes]);

  const positionedLookup = useMemo(() => {
    return positionedNodes.reduce<Record<string, PositionedNode>>((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, [positionedNodes]);

  const connections = useMemo(() => {
    return positionedNodes
      .map((node) => {
        if (!node.parentId) return null;
        const parent = positionedLookup[node.parentId];
        if (!parent) return null;
        return {
          id: `${parent.id}-${node.id}`,
          x1: parent.x + NODE_WIDTH / 2,
          y1: parent.y + NODE_HEIGHT / 2,
          x2: node.x + NODE_WIDTH / 2,
          y2: node.y + NODE_HEIGHT / 2,
        };
      })
      .filter(Boolean) as {
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[];
  }, [positionedLookup, positionedNodes]);

  const canvasSize = useMemo(() => {
    const width = 2000;
    const height = 2000;
    return { width, height };
  }, []);

  return (
    <ZoomableContainer contentSize={canvasSize}>
      <View style={{ width: "100%", height: "100%" }}>
        <Svg
          width={canvasSize.width}
          height={canvasSize.height}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {connections.map((line) => (
            <Line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#9ca3af"
              strokeWidth={3}
              strokeLinecap="round"
            />
          ))}
        </Svg>

        {positionedNodes.map((node) => (
          <View
            key={node.id}
            style={{
              position: "absolute",
              left: node.x,
              top: node.y,
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
              borderRadius: 12,
              backgroundColor: "#f8f8f8",
              borderWidth: 1,
              borderColor: "#dcdcdc",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: 3,
            }}
            >
              <MaterialCommunityIcons
                name="information-variant"
                size={22}
                color="black"
                style={{ position: "absolute", top: -18, left: -18 }}
              />
            <Ionicons
              name="play-circle-outline"
              size={22}
              color="black"
              style={{ position: "absolute", top: -18, right: -18 }}
            />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#222" }}>
              Start Here
            </Text>
            {!nodes.some((child) => child.parentId === node.id) ? (
              <FontAwesome6
                name="plus"
                size={18}
                color="black"
                onPress={() => addChild(node.id)}
                style={{ position: "absolute", right: -28, top: NODE_HEIGHT / 2 - 12 }}
              />
            ) : (
              <Entypo
                name="flow-branch"
                size={20}
                color="black"
                onPress={() => addChild(node.id)}
                style={{ position: "absolute", right: -18, bottom: -18 }}
              />
            )}
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="black"
              onPress={() => deleteNode(node.id)}
              style={{ position: "absolute", left: -18, bottom: -18 }}
            />
          </View>
        ))}
      </View>
    </ZoomableContainer>
  );
}
