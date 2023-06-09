import { Dispatch } from 'react';
import { usersAPI } from '../api/api';
import { UsersDataType } from '../types/types';

const FOLLOW = 'my-app/FOLLOW';
const UN_FOLLOW = 'my-app/UN_FOLLOW';
const SET_USERS_DATA = 'my-app/SET_USERS_DATA';
const SET_PAGE = 'my-app/SET_PAGE';
const SET_TOTAL_USERS = 'my-app/SET_TOTAL_USERS';
const TOGGLE_IS_FETCHING = 'my-app/TOGGLE_IS_FETCHING';

const TOGGLE_FOLLOWING_IN_PROGRESS = 'my-app/TOGGLE_FOLLOWING_IN_PROGRESS';
const SET_CURRENT_PORTION = 'my-app/SET_CURRENT_PORTION';

const SET_SELECTED_PAGE = 'my-app/SET_SELECTED_PAGE';

type InicialStateType = typeof inicialState

let inicialState = {
    usersData: [] as Array<UsersDataType>,
    pageSize: 5,
    portionSize: 10,
    currentPortion: 1,
    currentPage: 1,

    selectedPage: {
        currentPortion: 1,
        currentPage: 1,
    },

    totalUsers: 0,
    isFetching: true,
    followingInProgress: [] as Array<number>
};

const userReducer = (state = inicialState, action: Actions): InicialStateType => {

    switch (action.type) {

        case FOLLOW:
            return {
                ...state,
                usersData: state.usersData.map((u) => {
                    if (u.id === action.userId) {
                        return { ...u, followed: true }
                    }
                    return u
                })
            }

        case UN_FOLLOW:
            return {
                ...state,
                usersData: state.usersData.map((u) => {
                    if (u.id === action.userId) {
                        return { ...u, followed: false }
                    }
                    return u
                })
            }

        case SET_USERS_DATA:

            return {
                ...state,
                usersData: action.usersData
            }

        case SET_TOTAL_USERS:
            return {
                ...state,
                totalUsers: action.totalUsers
            }
        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }

        case TOGGLE_FOLLOWING_IN_PROGRESS:
            return {
                ...state,
                followingInProgress: action.isFetching
                    ? [...state.followingInProgress, action.id]
                    : state.followingInProgress.filter(id => id != action.id)
            }

        case SET_SELECTED_PAGE:
            return {
                ...state,
                selectedPage: {
                    currentPortion: action.currentPortion,
                    currentPage: action.currentPage
                }
            }

        default:
            return state;
    }
}

type Actions = FollowAT | UnfollowAT | SetUsersAT |
    SetTotalUsersAT | SetIsFetchingAT | ToggleFollowingInProgressAT |
    SetSelectedPageAT

type FollowAT = { type: typeof FOLLOW, userId: number }
export const follow = (userId: number): FollowAT => ({ type: FOLLOW, userId })

type UnfollowAT = { type: typeof UN_FOLLOW, userId: number }
export const unfollow = (userId: number): UnfollowAT => ({ type: UN_FOLLOW, userId })

type SetUsersAT = { type: typeof SET_USERS_DATA, usersData: UsersDataType }
export const setUsers = (usersData: UsersDataType): SetUsersAT => ({ type: SET_USERS_DATA, usersData })

type SetTotalUsersAT = { type: typeof SET_TOTAL_USERS, totalUsers: number }
export const setTotalUsers = (totalUsers: number): SetTotalUsersAT => ({ type: SET_TOTAL_USERS, totalUsers })

type SetIsFetchingAT = { type: typeof TOGGLE_IS_FETCHING, isFetching: boolean }
export const setIsFetching = (isFetching: boolean): SetIsFetchingAT => ({ type: TOGGLE_IS_FETCHING, isFetching })

type ToggleFollowingInProgressAT = { type: typeof TOGGLE_FOLLOWING_IN_PROGRESS, isFetching: boolean, id: number }
export const toggleFollowingInProgress = (isFetching: boolean, id: number): ToggleFollowingInProgressAT => ({ type: TOGGLE_FOLLOWING_IN_PROGRESS, isFetching, id })

type SetSelectedPageAT = { type: typeof SET_SELECTED_PAGE, currentPage: number, currentPortion: number }
export const setSelectedPage = (currentPage: number, currentPortion: number): SetSelectedPageAT => ({ type: SET_SELECTED_PAGE, currentPage, currentPortion })

export const requestUsers = (page: number, pageSize: number) => async (dispath: any) => {
    dispath(setIsFetching(true));
    let data = await usersAPI.getUsers(page, pageSize);
    dispath(setIsFetching(false));
    dispath(setUsers(data.items));
    dispath(setTotalUsers(data.totalCount));
};

type DispatchType = Dispatch<Actions>

export const following = (id: number) => async (dispath: DispatchType) => {

    followUnfollowFlow(dispath, usersAPI.follow.bind(usersAPI), follow, id);
};

export const unfollowing = (id: number) => async (dispath: DispatchType) => {

    followUnfollowFlow(dispath, usersAPI.unfollow.bind(usersAPI), unfollow, id);
};

export const followUnfollowFlow = async (dispath: DispatchType, apiMethod: any, actionCreator: any, id: number) => {
    dispath(toggleFollowingInProgress(true, id));
    let data = await apiMethod(id);
    if (data.resultCode === 0) {
        dispath(actionCreator(id))
    }
    dispath(toggleFollowingInProgress(false, id));
}

export default userReducer;