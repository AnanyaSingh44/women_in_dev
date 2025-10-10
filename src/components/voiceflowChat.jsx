"use client";

import { useEffect } from "react";

export default function VoiceflowChat() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    script.type = "text/javascript";
    script.onload = () => {
      window.voiceflow.chat.load({
        verify: { projectID: "68e83f2fbd8fdad98c4fe0eb" },
        url: "https://general-runtime.voiceflow.com",
        versionID: "production",
        voice: {
          url: "https://runtime-api.voiceflow.com",
        },
      });
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
