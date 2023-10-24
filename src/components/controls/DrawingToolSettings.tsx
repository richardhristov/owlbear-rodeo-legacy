import { useEffect } from "react";
import { Flex } from "theme-ui";
import { useMedia } from "react-use";

import RadioIconButton from "../RadioIconButton";

import ColorControl from "./shared/ColorControl";
import AlphaBlendToggle from "./shared/AlphaBlendToggle";
import ToolSection from "./shared/ToolSection";
import ShapeFillToggle from "./shared/ShapeFillToggle";

import BrushIcon from "../../icons/BrushToolIcon";
import BrushPaintIcon from "../../icons/BrushPaintIcon";
import BrushLineIcon from "../../icons/BrushLineIcon";
import BrushRectangleIcon from "../../icons/BrushRectangleIcon";
import BrushCircleIcon from "../../icons/BrushCircleIcon";
import BrushTriangleIcon from "../../icons/BrushTriangleIcon";
import EraseIcon from "../../icons/EraseToolIcon";

import Divider from "../Divider";

import { useKeyboard } from "../../contexts/KeyboardContext";

import shortcuts from "../../shortcuts";

import {
  DrawingToolSettings as DrawingToolSettingsType,
  DrawingToolType,
} from "../../types/Drawing";
import EraseAllButton from "./shared/EraseAllButton";

type DrawingToolSettingsProps = {
  settings: DrawingToolSettingsType;
  onSettingChange: (change: Partial<DrawingToolSettingsType>) => void;
  onToolAction: (action: string) => void;
  disabledActions: string[];
};

function DrawingToolSettings({
  settings,
  onSettingChange,
  onToolAction,
  disabledActions,
}: DrawingToolSettingsProps) {
  // Keyboard shotcuts
  function handleKeyDown(event: KeyboardEvent) {
    if (shortcuts.drawBrush(event)) {
      onSettingChange({ type: "brush" });
    } else if (shortcuts.drawPaint(event)) {
      onSettingChange({ type: "paint" });
    } else if (shortcuts.drawLine(event)) {
      onSettingChange({ type: "line" });
    } else if (shortcuts.drawRect(event)) {
      onSettingChange({ type: "rectangle" });
    } else if (shortcuts.drawCircle(event)) {
      onSettingChange({ type: "circle" });
    } else if (shortcuts.drawTriangle(event)) {
      onSettingChange({ type: "triangle" });
    } else if (shortcuts.drawErase(event)) {
      onSettingChange({ type: "erase" });
    } else if (shortcuts.drawBlend(event)) {
      onSettingChange({ useBlending: !settings.useBlending });
    } else if (shortcuts.drawFill(event)) {
      onSettingChange({ useShapeFill: !settings.useShapeFill });
    }
  }
  useKeyboard(handleKeyDown);

  // Change to brush if on erase and it gets disabled
  useEffect(() => {
    if (settings.type === "erase" && disabledActions.includes("erase")) {
      onSettingChange({ type: "brush" });
    }
  }, [disabledActions, settings, onSettingChange]);

  const isSmallScreen = useMedia("(max-width: 799px)");

  const tools = [
    {
      id: "brush",
      title: "Brush (B)",
      isSelected: settings.type === "brush",
      icon: <BrushIcon />,
    },
    {
      id: "paint",
      title: "Paint (P)",
      isSelected: settings.type === "paint",
      icon: <BrushPaintIcon />,
    },
    {
      id: "line",
      title: "Line (L)",
      isSelected: settings.type === "line",
      icon: <BrushLineIcon />,
    },
    {
      id: "rectangle",
      title: "Rectangle (R)",
      isSelected: settings.type === "rectangle",
      icon: <BrushRectangleIcon />,
    },
    {
      id: "circle",
      title: "Circle (C)",
      isSelected: settings.type === "circle",
      icon: <BrushCircleIcon />,
    },
    {
      id: "triangle",
      title: "Triangle (T)",
      isSelected: settings.type === "triangle",
      icon: <BrushTriangleIcon />,
    },
  ];

  return (
    <Flex sx={{ alignItems: "center" }}>
      <ColorControl
        color={settings.color}
        onColorChange={(color) => onSettingChange({ color })}
        exclude={["primary"]}
      />
      <Divider vertical />
      <ToolSection
        tools={tools}
        onToolClick={(tool) =>
          onSettingChange({ type: tool.id as DrawingToolType })
        }
        collapse={isSmallScreen}
      />
      <Divider vertical />
      <RadioIconButton
        title="Erase (E)"
        onClick={() => onSettingChange({ type: "erase" })}
        isSelected={settings.type === "erase"}
        disabled={disabledActions.includes("erase")}
      >
        <EraseIcon />
      </RadioIconButton>
      <EraseAllButton
        onToolAction={onToolAction}
        disabled={disabledActions.includes("erase")}
      />
      <Divider vertical />
      <AlphaBlendToggle
        useBlending={settings.useBlending}
        onBlendingChange={(useBlending) => onSettingChange({ useBlending })}
      />
      <ShapeFillToggle
        useShapeFill={settings.useShapeFill}
        onShapeFillChange={(useShapeFill) => onSettingChange({ useShapeFill })}
      />
    </Flex>
  );
}

export default DrawingToolSettings;
