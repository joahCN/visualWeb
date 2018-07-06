import produce from "immer";

const initialState = {
  isShowWarning: false
};

let reducers = {
  login: [
    {
      operator: "gatherData",
      input: ["param1", "param2"],
      output: ["value1", "value2"]
    },
    {
      operator: "ajax",
      input: {requestUrl: "", method: "", callback: ""}
    }
  ]
};

export default function componentActivities(state = initialState, action) {
  return produce(state, (draft)=> {
    switch (action.type) {
      case "showWarning":
        draft.isShowWarning = true;
        break;
      case "hideWarning":
        draft.isShowWarning = false;
        break;
    }
  });

}
