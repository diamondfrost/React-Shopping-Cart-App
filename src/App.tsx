import { useState } from "react";
import { useQuery } from "react-query";
// Components
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";
// Styles
import { Wrapper, StyledButton } from "./App.styles";
// Types
export type CartItemType = {
	id: number;
	category: string;
	description: string;
	image: string;
	price: number;
	title: string;
	quantity: number;
}

// async function fetch API
// await inside parenthesis is for API call itself
// outside await is for when converting to JSON (because it takes time and is async)
// Promise is a generic
const getProducts = async (): Promise<CartItemType[]> =>
	await(await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
	// boolean to check if cart is open
	const [cartIsOpen, setCartIsOpen] = useState(false);
	// array that contains cart items
	const [cartItems, setCartItems] = useState([] as CartItemType[]);

	const { data, isLoading, error } = useQuery<CartItemType[]>(
		'products', 
		getProducts
	);
	console.log(data);

	// pass in items which is of type CartItemType
	// iterate through all the items in the cart and will return total amount of items in the cart
	// initial value of 0
	const getTotalItems = (items: CartItemType[]) => 
		items.reduce((accumulator: number, item) => accumulator + item.quantity, 0);

	// takes in clickedItem which is of type cart item type
	const handleAddToCart = (clickedItem: CartItemType) => {
		// call for previous state
		// call the setter for cart items
		setCartItems(prev => {
			// 1. Is the item already added in the cart?
			// check if item already exists
			const isItemInCart = prev.find(item => item.id === clickedItem.id);

			if (isItemInCart) {
				return prev.map(item => 
					// `...item` spread out the item
					// loop through the items until found the item clicked
					item.id === clickedItem.id
						// add 1 to quantity of that item
						? { ...item, quantity: item.quantity +1 }
						: item
				);
			}
			// First time the item is added
			// `...prev` is to spread out the prev state
			// spread the previous items and add the current item and set the amount to 1
			return [...prev, { ...clickedItem, quantity: 1 }];
		});
	};
	
	const handleRemoveFromCart = (id: number) => {
		// set the cart items on the prev state
		setCartItems(prev => (
			// call the reduce on the prev state
			// ack = accumulator
			prev.reduce((ack, item) => {
				if (item.id === id) {
					// if item quantity is 1 before subtraction, remove from array
					// returning ack will delete the item from the array
					if (item.quantity === 1) return ack;
					// else subtract 1 from quantity
					return [...ack, { ...item, amount: item.quantity - 1 }];
				// else if not on item clicked on
				} else {
					return [...ack, item];
				}
			// set the inital value for the reduce else Typescript will complain
			}, [] as CartItemType[])
		))
	};

	// when loading
	// can be replaced by the circular progress item 
	if (isLoading) return <LinearProgress />;

	if (error) return <div>Something went wrong ...</div>;

	return (
		<Wrapper>
			{/* drawer is anchored to the right and toggles cartIsOpen */}
			<Drawer anchor='right' open={cartIsOpen} onClose={() => setCartIsOpen(false)}>
				<Cart 
					cartItems={cartItems} 
					addToCart={handleAddToCart} 
					removeFromCart={handleRemoveFromCart} 
				/>
			</Drawer>
			{/* like a normal button component */}
			<StyledButton onClick={() => setCartIsOpen(true)}>
				{/* badge content is the text in the badge */}
				{/* color error gives the badge as a red color */}
				<Badge badgeContent={getTotalItems(cartItems)} color='error'>
					<AddShoppingCartIcon />
				</Badge>
			</StyledButton>
			{/*grid is a container so marked with a `container` prop*/}
			<Grid container spacing={3}>
				{/*it will complain if undefined so use `?` so it will return undefined if it cannot find data*/}
				{/*`.map()` maps through the data*/}
				{data?.map(item => (
					//this time the grid is an item so pass item prop
					//put a key because to map in react you need a key
					//xs is extra small
					//sm is small-medium
					<Grid item key={item.id} xs={12} sm={4}>
						<Item item={item} handleAddToCart={handleAddToCart} />
					</Grid>
				))}
			</Grid>
		</Wrapper>
  	);
};

export default App;
