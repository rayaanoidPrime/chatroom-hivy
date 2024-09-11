import DMSkeleton from "@/components/skeletons/DMSkeleton"; // TODO
import { ChatHeader } from "@/components/ChatHeader"; //TODO
import { MessageContainer } from "@/components/MessageContainer"; // TODO
import { fetchUser } from "@/features/user/user.service"; // TODO
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const ChatDM = () => {
  const { otherId } = useParams();

  otherId = Number(otherId);

  const {
    data: receiver,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", otherId],
    queryFn: ({ queryKey }) => fetchUser(queryKey[1]),
    enabled: Boolean(otherId),
  });

  if (isLoading) {
    return <DMSkeleton />;
  }

  return (
    <>
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <ChatHeader
          chatId={receiver?.id}
          chatName={receiver?.username}
          chatType="dm"
          error={error}
        />
        <MessageContainer otherId={otherId} />
      </div>
    </>
  );
};
