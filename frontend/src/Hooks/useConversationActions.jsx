import { useContext, useCallback } from "react";
import conversationContext from "../Context/conversationContext";
export function useConversationActions() {
  const { updateSelectedConversationId, updateProfileStates } =
    useContext(conversationContext);

  const openConversation = useCallback(
    (conversationId) => {
      updateSelectedConversationId(conversationId);
    },
    [updateSelectedConversationId]
  );

  console.log("b");
  const openProfile = useCallback(
    (participants, user) => {
      const participantId = participants.find(
        (participant) => participant !== user
      );
      if (participantId) {
        updateProfileStates({
          selectedProfileId: participantId,
          openProfile: true,
        });
      }
    },
    [updateProfileStates]
  );

  return { openConversation, openProfile };
}
