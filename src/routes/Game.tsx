import { useState, useEffect, useRef } from "react";
import { Flex, Box, Text } from "theme-ui";
import { useParams } from "react-router-dom";
import Konva from "konva";

import Banner from "../components/banner/Banner";
import ReconnectBanner from "../components/banner/ReconnectBanner";
import OfflineBanner from "../components/banner/OfflineBanner";
import LoadingOverlay from "../components/LoadingOverlay";
import MapLoadingOverlay from "../components/map/MapLoadingOverlay";
import UpgradingLoadingOverlay from "../components/UpgradingLoadingOverlay";

import AuthModal from "../modals/AuthModal";
import GameExpiredModal from "../modals/GameExpiredModal";
import ForceUpdateModal from "../modals/ForceUpdateModal";
import MaintenanceModal from "../modals/MaintenanceModal";

import { useAuth } from "../contexts/AuthContext";
import { MapStageProvider } from "../contexts/MapStageContext";
import { useDatabase } from "../contexts/DatabaseContext";
import { PlayerProvider } from "../contexts/PlayerContext";
import { PartyProvider } from "../contexts/PartyContext";
import { AssetsProvider, AssetURLsProvider } from "../contexts/AssetsContext";
import { MapDataProvider } from "../contexts/MapDataContext";
import { TokenDataProvider } from "../contexts/TokenDataContext";
import { MapLoadingProvider } from "../contexts/MapLoadingContext";

import NetworkedMapAndTokens from "../network/NetworkedMapAndTokens";
import NetworkedParty from "../network/NetworkedParty";

import Session, { PeerErrorEvent, SessionStatus } from "../network/Session";

function Game() {
  const { id: gameId }: { id: string } = useParams();
  const { password } = useAuth();
  const { databaseStatus } = useDatabase();

  const [session] = useState(new Session());
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>();

  const [maintenance, setMaintenance] = useState(
    process.env.REACT_APP_MAINTENANCE === "true"
  );

  // Handle session errors
  const [peerError, setPeerError] = useState<string | null>(null);
  useEffect(() => {
    function handlePeerError({ error }: PeerErrorEvent) {
      if (error.code === "ERR_WEBRTC_SUPPORT") {
        setPeerError("WebRTC not supported.");
      } else if (error.code === "ERR_CREATE_OFFER") {
        setPeerError("Unable to connect to party.");
      }
    }
    session.on("peerError", handlePeerError);
    return () => {
      session.off("peerError", handlePeerError);
    };
  }, [session]);

  useEffect(() => {
    function handleStatus(status: SessionStatus) {
      setSessionStatus(status);
    }

    session.on("status", handleStatus);

    return () => {
      session.off("status", handleStatus);
    };
  }, [session]);

  const [gameExpired, setGameExpired] = useState(false);
  useEffect(() => {
    function handleGameExpired() {
      setGameExpired(true);
    }

    session.on("gameExpired", handleGameExpired);

    return () => {
      session.off("gameExpired", handleGameExpired);
    };
  }, [session]);

  // Join game
  useEffect(() => {
    if (
      sessionStatus === "ready" &&
      (databaseStatus === "loaded" || databaseStatus === "disabled")
    ) {
      session.joinGame(gameId, password);
    }
  }, [gameId, password, databaseStatus, session, sessionStatus]);

  function handleAuthSubmit(newPassword: string) {
    if (databaseStatus === "loaded" || databaseStatus === "disabled") {
      session.joinGame(gameId, newPassword);
    }
  }

  useEffect(() => {
    async function connect() {
      await session.connect();
    }
    connect();

    return () => {
      session.disconnect();
    };
  }, [session]);

  // A ref to the Konva stage
  // the ref will be assigned in the MapInteraction component
  const mapStageRef = useRef<Konva.Stage | null>(null);

  return (
    <AssetsProvider>
      <AssetURLsProvider>
        <MapLoadingProvider>
          <MapDataProvider>
            <TokenDataProvider>
              <PlayerProvider session={session}>
                <PartyProvider session={session}>
                  <MapStageProvider value={mapStageRef}>
                    <Flex
                      sx={{
                        justifyContent: "space-between",
                        flexGrow: 1,
                        height: "100%",
                      }}
                    >
                      <NetworkedParty session={session} gameId={gameId} />
                      <NetworkedMapAndTokens session={session} />
                    </Flex>
                    <Banner
                      isOpen={!!peerError}
                      onRequestClose={() => setPeerError(null)}
                    >
                      <Box p={1}>
                        <Text as="p" variant="body2">
                          {peerError} See FAQ for more information.
                        </Text>
                      </Box>
                    </Banner>
                    <OfflineBanner isOpen={sessionStatus === "offline"} />
                    <ReconnectBanner
                      isOpen={sessionStatus === "reconnecting"}
                    />
                    <AuthModal
                      isOpen={sessionStatus === "auth"}
                      onSubmit={handleAuthSubmit}
                    />
                    <GameExpiredModal
                      isOpen={gameExpired}
                      onRequestClose={() => setGameExpired(false)}
                    />
                    <ForceUpdateModal
                      isOpen={sessionStatus === "needs_update"}
                    />
                    {!sessionStatus && <LoadingOverlay />}
                    {sessionStatus && databaseStatus === "upgrading" && (
                      <UpgradingLoadingOverlay />
                    )}
                    <MaintenanceModal
                      isOpen={maintenance}
                      onRequestClose={() => setMaintenance(false)}
                    />
                    <MapLoadingOverlay />
                  </MapStageProvider>
                </PartyProvider>
              </PlayerProvider>
            </TokenDataProvider>
          </MapDataProvider>
        </MapLoadingProvider>
      </AssetURLsProvider>
    </AssetsProvider>
  );
}

export default Game;
