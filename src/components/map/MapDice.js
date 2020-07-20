import React, { useState } from "react";
import { Flex, IconButton } from "theme-ui";

import ExpandMoreDiceIcon from "../../icons/ExpandMoreDiceIcon";
import DiceTrayOverlay from "../dice/DiceTrayOverlay";

import { DiceLoadingProvider } from "../../contexts/DiceLoadingContext";

function MapDice() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Flex
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        flexDirection: "column",
        alignItems: "flex-start",
        pointerEvents: "none",
      }}
      ml={1}
    >
      <IconButton
        aria-label={isExpanded ? "Hide Dice Tray" : "Show Dice Tray"}
        title={isExpanded ? "Hide Dice Tray" : "Show Dice Tray"}
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          display: "block",
          backgroundColor: "overlay",
          borderRadius: "50%",
          pointerEvents: "all",
        }}
        m={2}
      >
        <ExpandMoreDiceIcon isExpanded={isExpanded} />
      </IconButton>
      <DiceLoadingProvider>
        <DiceTrayOverlay isOpen={isExpanded} />
      </DiceLoadingProvider>
    </Flex>
  );
}

export default MapDice;