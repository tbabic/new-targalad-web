function stackingBonus() {
	this.value = 0;
	this.add = function(bonus) {
		value += bonus;
	}
	this.remove = function(bonus) {
		value -= bonus;
	}
	this.get = function() {
		return value;
	}
	
}

function nonstackingBonus() {
	this.value = [0];
	this.add = function(bonus) {
		this.value.push(bonus);
		this.value.sort(function(a, b){return b-a});
	}
	this.remove = function(bonus) {
		this.value -= bonus;
	}
	this.get = function() {
		return this.value[0];
	}
}


