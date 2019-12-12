import * as moment from 'moment';
class Order {
	constructor(id, items, totalAmount, date) {
		this.id = id.toString();
		this.items = items;
		this.totalAmount = totalAmount;
		this.date = date;
	}

	//getter called like a static method on objects instantiated by this class. A getter method property
	get readableDate() {
		return this.date.toLocaleDateString('en-EN', {
			//this method is not supported on Android
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	get readableDateAndroid() {
		return this.date.toLocaleString('default', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	get dateFormat() {
		return moment(this.date).format('MMMM Do YYYY, hh:mm');
	}
}

export default Order;
