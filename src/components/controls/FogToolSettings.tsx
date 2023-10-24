import { Flex } from "theme-ui";
import { useMedia } from "react-use";

import RadioIconButton from "../RadioIconButton";

import MultilayerToggle from "./shared/MultilayerToggle";
import FogPreviewToggle from "./shared/FogPreviewToggle";
import FogCutToggle from "./shared/FogCutToggle";

import FogBrushIcon from "../../icons/FogBrushIcon";
import FogPolygonIcon from "../../icons/FogPolygonIcon";
import FogRemoveIcon from "../../icons/FogRemoveIcon";
import FogToggleIcon from "../../icons/FogToggleIcon";
import FogRectangleIcon from "../../icons/FogRectangleIcon";

import ToolSection from "./shared/ToolSection";

import Divider from "../Divider";

import { useKeyboard } from "../../contexts/KeyboardContext";

import shortcuts from "../../shortcuts";

import {
  FogToolSettings as FogToolSettingsType,
  FogToolType,
} from "../../types/Fog";

type FogToolSettingsProps = {
  settings: FogToolSettingsType;
  onSettingChange: (change: Partial<FogToolSettingsType>) => void;
};

function FogToolSettings({ settings, onSettingChange }: FogToolSettingsProps) {
  // Keyboard shortcuts
  function handleKeyDown(event: KeyboardEvent) {
    if (shortcuts.fogPolygon(event)) {
      onSettingChange({ type: "polygon" });
    } else if (shortcuts.fogBrush(event)) {
      onSettingChange({ type: "brush" });
    } else if (shortcuts.fogToggle(event)) {
      onSettingChange({ type: "toggle" });
    } else if (shortcuts.fogErase(event)) {
      onSettingChange({ type: "remove" });
    } else if (shortcuts.fogLayer(event)) {
      onSettingChange({ multilayer: !settings.multilayer });
    } else if (shortcuts.fogPreview(event)) {
      onSettingChange({ preview: !settings.preview });
    } else if (shortcuts.fogCut(event)) {
      onSettingChange({ useFogCut: !settings.useFogCut });
    } else if (shortcuts.fogRectangle(event)) {
      onSettingChange({ type: "rectangle" });
    }
  }

  useKeyboard(handleKeyDown);

  const isSmallScreen = useMedia("(max-width: 799px)");
  const drawTools = [
    {
      id: "polygon",
      title: "Fog Polygon (P)",
      isSelected: settings.type === "polygon",
      icon: <FogPolygonIcon />,
      disabled: settings.preview,
    },
    {
      id: "rectangle",
      title: "Fog Rectangle (R)",
      isSelected: settings.type === "rectangle",
      icon: <FogRectangleIcon />,
      disabled: settings.preview,
    },
    {
      id: "brush",
      title: "Fog Brush (B)",
      isSelected: settings.type === "brush",
      icon: <FogBrushIcon />,
      disabled: settings.preview,
    },
  ];

  return (
    <Flex sx={{ alignItems: "center" }}>
      <ToolSection
        tools={drawTools}
        onToolClick={(tool) =>
          onSettingChange({ type: tool.id as FogToolType })
        }
        collapse={isSmallScreen}
      />
      <Divider vertical />
      <RadioIconButton
        title="Toggle Fog (T)"
        onClick={() => onSettingChange({ type: "toggle" })}
        isSelected={settings.type === "toggle"}
        disabled={settings.preview}
      >
        <FogToggleIcon />
      </RadioIconButton>
      <RadioIconButton
        title="Erase Fog (E)"
        onClick={() => onSettingChange({ type: "remove" })}
        isSelected={settings.type === "remove"}
        disabled={settings.preview}
      >
        <FogRemoveIcon />
      </RadioIconButton>
      <Divider vertical />
      <FogCutToggle
        useFogCut={settings.useFogCut}
        onFogCutChange={(useFogCut) => onSettingChange({ useFogCut })}
        disabled={settings.preview}
      />
      <MultilayerToggle
        multilayer={settings.multilayer}
        onMultilayerChange={(multilayer) => onSettingChange({ multilayer })}
        disabled={settings.preview}
      />
      <FogPreviewToggle
        useFogPreview={settings.preview}
        onFogPreviewChange={(preview) => onSettingChange({ preview })}
      />
    </Flex>
  );
}

export default FogToolSettings;
