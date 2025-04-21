import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { TypeResource } from "@/interface/resource";

type TypePreviews<T extends TypeResource.DTO = TypeResource.DTO> = Record<
  "videos" | "audios" | "images" | "documents",
  {
    [i in string]?: T;
  }
>;

export const DEFAULT_PREVIEW: TypePreviews = {
  videos: {},
  audios: {},
  images: {},
  documents: {},
};

const previewSlice = createSlice({
  name: "PREVIEW",
  initialState: DEFAULT_PREVIEW,
  reducers: {
    preview: (
      state,
      action: PayloadAction<
        { key: keyof TypePreviews; value: TypeResource.DTO },
        string
      >,
    ) => {
      const { key, value } = action.payload;
      state[key][value.id] = value;
    },
    delPreview(
      state,
      action: PayloadAction<
        {
          key: keyof TypePreviews;
          value: TypeResource.DTO["id"];
        },
        string
      >,
    ) {
      const { key, value } = action.payload;
      state[key][value] = undefined;
    },
  },
});

const ActionsPreview = previewSlice.actions;

export { previewSlice, ActionsPreview };

export default previewSlice.reducer;
