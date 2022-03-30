import Button  from "@material-ui/core/Button";
// Types
import { CartItemType } from "../App";
// Styles
import { Wrapper } from "./Item.styles";

// from App.tsx
type Props = {
    item: CartItemType;
    handleAddToCart: (clickedItem: CartItemType) => void;
}

// React Functional Component (generic) of type Props
const Item: React.FC<Props> = ({ item, handleAddToCart }) => (
    <Wrapper>
        <img src={item.image} alt={item.title} />
        <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {/* item in  dollars so there is a `$`*/}
            <h3>${item.price}</h3>
        </div>
        {/*put `() =>` else the function will trigger immediately*/}
        <Button onClick={() => handleAddToCart(item)}>Add to cart</Button>
    </Wrapper>
);

export default Item;