//? Modelling what a cart item should look like
export default class CartItem {
	constructor(quantity, productPrice, productTitle, sum) {
		//properties
		(this.quantity = quantity),
			(this.productPrice = productPrice),
			(this.productTitle = productTitle),
			(this.sum = sum);
	}
}
