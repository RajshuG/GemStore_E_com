import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        count: 0,
    },
    reducers: {
        setCartItems(state, action) {
            state.items = action.payload;
            state.count = action.payload.reduce((total, item) => total + item.quantity, 0);
        },
        addItem(state, action) {
            const existItem = state.items.find(item => item.product_id === action.payload.id);
            if (existItem) {
                existItem.quantity += 1;
            } else {
                state.items.push({ product_id: action.payload.id, quantity: 1 });
            }
            state.count = state.items.reduce((total, item) => total + item.quantity, 0);
        },
        removeItem(state, action) {
            const itemToRemove = state.items.find(item => item.product_id === action.payload.id);
            if (itemToRemove) {
                if (itemToRemove.quantity > 1) {
                    itemToRemove.quantity -= 1;
                } else {
                    state.items = state.items.filter(item => item.product_id !== action.payload.id);
                }
            }
            state.count = state.items.reduce((total, item) => total + item.quantity, 0);
        },
    },
});

export const { setCartItems, addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
