import {
  commentThreadIDsState,
  commentThreadsState,
} from "../utils/CommentState";

import { useRecoilCallback } from "recoil";

export default function useRemoveCommentThreadCallback(threadID) {
  return useRecoilCallback(
    ({ set }) =>
      (id, threadData) => {
        set(commentThreadsState(threadID), null);
      },
    []
  );
}
