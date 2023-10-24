import { Box, Text } from "theme-ui";

function DatabaseDisabledMessage({ type }: { type: string }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        borderRadius: "2px",
        gridArea: "1 / 1 / span 1 / span 4",
      }}
      bg="highlight"
      p={1}
    >
      <Text as="p" variant="body2">
        {type} saving is unavailable. See FAQ for more information.
      </Text>
    </Box>
  );
}

export default DatabaseDisabledMessage;
