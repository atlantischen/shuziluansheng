/**
 * @author 斯蒂芬King HLXD
 */

var StorageLocal = function () {

	this.itemName = '';
	this.version = 1;

	return {


		get: function () {

            return localStorage.getItem(this.itemName);
             
		},

		set: function ( name,data ) {
			
            this.itemName = name;
			console.log(this.itemName);
			localStorage.setItem(name,data);
            return 'save to localStorage success';
		},

		clear: function () {

			localStorage.clearItem(this.itemName);
            return 'clear localStorage success'
		}

	};

};
