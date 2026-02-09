import takeshiYamamotoProfile from "@/assets/takeshi-yamamoto-profile.jpg";
import sakuraTanakaProfile from "@/assets/sakura-tanaka-profile.jpg";
import yukiTanakaProfile from "@/assets/yuki-tanaka-profile.jpg";
import zhangMeiProfile from "@/assets/zhang-mei-profile.jpg";
import liWeiProfile from "@/assets/li-wei-profile.jpg";
import amaraJohnsonProfile from "@/assets/amara-johnson-profile.jpg";
import isabellaGarciaProfile from "@/assets/isabella-garcia-profile.jpg";
import davidCohenProfile from "@/assets/david-cohen-profile.jpg";
import sarahJohnsonProfile from "@/assets/sarah-johnson-profile.jpg";
import brunoSilvaProfile from "@/assets/bruno-silva-profile.jpg";
import priyaSharmaProfile from "@/assets/priya-sharma-profile.jpg";
import rajPatelProfile from "@/assets/raj-patel-profile.jpg";
import mayaPatelProfile from "@/assets/maya-patel-profile.jpg";
import omarAlRashidProfile from "@/assets/omar-al-rashid-profile.jpg";
import marieDuboisProfile from "@/assets/marie-dubois-profile.jpg";
import daraVichekaProfile from "@/assets/dara-vicheka-profile.jpg";
import sopheaChannProfile from "@/assets/sophea-chann-profile.jpg";
import somchaiPongpatProfile from "@/assets/somchai-pongpat-profile.jpg";
import ploySiriwanProfile from "@/assets/ploy-siriwan-profile.jpg";
import carlosMendezProfile from "@/assets/carlos-mendez-profile.jpg";
import carlosRodriguezProfile from "@/assets/carlos-rodriguez-profile.jpg";
import fatimaAlZahraProfile from "@/assets/fatima-al-zahra-profile.jpg";
import jeanPierreLaurentProfile from "@/assets/jean-pierre-laurent-profile.jpg";
import giuliaFerrariProfile from "@/assets/giulia-ferrari-profile.jpg";
import marcoRossiProfile from "@/assets/marco-rossi-profile.jpg";
import amaraOkaforProfile from "@/assets/amara-okafor-profile.jpg";
import sarahGoldbergProfile from "@/assets/sarah-goldberg-profile.jpg";

// Map from the filename (without path and extension) to the imported asset
const avatarMap: Record<string, string> = {
  "takeshi-yamamoto-profile": takeshiYamamotoProfile,
  "sakura-tanaka-profile": sakuraTanakaProfile,
  "yuki-tanaka-profile": yukiTanakaProfile,
  "zhang-mei-profile": zhangMeiProfile,
  "li-wei-profile": liWeiProfile,
  "amara-johnson-profile": amaraJohnsonProfile,
  "isabella-garcia-profile": isabellaGarciaProfile,
  "david-cohen-profile": davidCohenProfile,
  "sarah-johnson-profile": sarahJohnsonProfile,
  "bruno-silva-profile": brunoSilvaProfile,
  "priya-sharma-profile": priyaSharmaProfile,
  "raj-patel-profile": rajPatelProfile,
  "maya-patel-profile": mayaPatelProfile,
  "omar-al-rashid-profile": omarAlRashidProfile,
  "marie-dubois-profile": marieDuboisProfile,
  "dara-vicheka-profile": daraVichekaProfile,
  "sophea-chann-profile": sopheaChannProfile,
  "somchai-pongpat-profile": somchaiPongpatProfile,
  "ploy-siriwan-profile": ploySiriwanProfile,
  "carlos-mendez-profile": carlosMendezProfile,
  "carlos-rodriguez-profile": carlosRodriguezProfile,
  "fatima-al-zahra-profile": fatimaAlZahraProfile,
  "jean-pierre-laurent-profile": jeanPierreLaurentProfile,
  "giulia-ferrari-profile": giuliaFerrariProfile,
  "marco-rossi-profile": marcoRossiProfile,
  "amara-okafor-profile": amaraOkaforProfile,
  "sarah-goldberg-profile": sarahGoldbergProfile,
};

/**
 * Resolves an avatar path. If it's a /src/assets/ path, maps it to the
 * properly imported asset. Otherwise returns the path as-is.
 */
export function resolveAvatar(path: string): string {
  if (path.startsWith("/src/assets/")) {
    const filename = path.replace("/src/assets/", "").replace(".jpg", "").replace(".png", "");
    return avatarMap[filename] || path;
  }
  return path;
}
