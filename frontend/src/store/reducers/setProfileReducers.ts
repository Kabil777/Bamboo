
import {  createSlice, PayloadAction } from "@reduxjs/toolkit";


interface SetProfileReducersState {
  firstName: string;
  lastName: string;
  dob: string;
  designation: string;
  tags: string[];
}

const initialState: SetProfileReducersState = {
  firstName: "",
  lastName: "",
  dob: "",
  designation: "",
  tags: [],
};

const setProfileReducers = createSlice({
  name: "setProfileReducers",
  initialState: initialState,
  reducers: {
    setAllProfile: (state, action: PayloadAction<SetProfileReducersState>) => {
      return action.payload;
    },
  },
});

export const { setAllProfile } = setProfileReducers.actions;

export default setProfileReducers.reducer;