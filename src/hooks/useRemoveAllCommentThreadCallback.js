import {
  commentThreadIDsState,
  commentThreadsState,
} from "../utils/CommentState";

import { useRecoilCallback } from "recoil";

export default function useRemoveAllCommentThreadCallback(threadID) {
  return useRecoilCallback(
    ({ set }) =>
      (id) => {
        set(commentThreadIDsState, (ids) => {
          const idsArr = Array.from(ids);
          const filter = idsArr.filter((item) => item !== threadID);
          return new Set(filter);
        });
        set(commentThreadsState(threadID), null);
      },
    []
  );
}
