import { Idea } from '../types';

export interface IdeaState {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
}

export type IdeaAction =
  | { type: 'FETCH_IDEAS_START' }
  | { type: 'FETCH_IDEAS_SUCCESS'; payload: Idea[] }
  | { type: 'FETCH_IDEAS_ERROR'; payload: string }
  | { type: 'CREATE_IDEA'; payload: Idea }
  | { type: 'DELETE_IDEA'; payload: string }
  | { type: 'UPDATE_IDEA'; payload: Idea };

export const initialState: IdeaState = {
  ideas: [],
  loading: false,
  error: null,
};

export const ideaReducer = (state: IdeaState, action: IdeaAction): IdeaState => {
  switch (action.type) {
    case 'FETCH_IDEAS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_IDEAS_SUCCESS':
      return { ...state, loading: false, ideas: action.payload };
    case 'FETCH_IDEAS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_IDEA':
      return { ...state, ideas: [...state.ideas, action.payload] };
    case 'DELETE_IDEA':
      return { ...state, ideas: state.ideas.filter(idea => idea._id.toString() !== action.payload) };
    case 'UPDATE_IDEA':
      return {
        ...state,
        ideas: state.ideas.map(idea =>
          idea._id.toString() === action.payload._id.toString() ? action.payload : idea
        ),
      };
    default:
      return state;
  }
};